import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { parsearCNJ, validarCNJ, formatarCNJ } from "@/components/utils/CNJParser";
import AutoPreenchimentoProcesso from "./AutoPreenchimentoProcesso";
import PartesManager from "./PartesManager";
import AssuntosMovimentosViewer from "./AssuntosMovimentosViewer";
import ClasseTPUValidatorAdvanced from "../datajud/ClasseTPUValidatorAdvanced";
import EnriquecimentoIndicadorCompleto from "../datajud/EnriquecimentoIndicadorCompleto";
import FormWrapper from "../shared/FormWrapper";
import { ErrorAlert, useFormErrorHandler } from "../shared/ErrorAlert";
import { FormInput } from "../shared/FormInput";
import { normalizeFormErrors } from "../shared/ErrorHandler";

export default function ProcessoCEJUSCForm({ clienteId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    cliente_id: clienteId,
    numero_processo: "",
    data_ajuizamento: new Date().toISOString().split('T')[0],
    status: "aberto",
    descricao: "",
    partes: [],
    assuntos: [],
    movimentos: [],
    credores_envolvidos: [],
    data_proxima_audiencia: "",
    observacoes: ""
  });
  
  const { errors, setFieldError, clearFieldError, clearAllErrors } = useFormErrorHandler();
  const [globalError, setGlobalError] = useState(null);
  const [cnjData, setCnjData] = useState(null);
  const [cnjLoading, setCnjLoading] = useState(false);
  const [cnjValid, setCnjValid] = useState(null);
  const [classeValida, setClasseValida] = useState(false);
  const [enriquecimentos, setEnriquecimentos] = useState({});

  const handleProcessoCarregado = (processoDados) => {
    if (!processoDados) return;

    // Normalizar assuntos: garantir que seja array de objetos {codigo, nome}
    const assuntosNormalizados = Array.isArray(processoDados.assuntos)
      ? processoDados.assuntos.map(a => 
          typeof a === 'string' ? { nome: a, codigo: null } : a
        )
      : [];

    // Converter classe_codigo para número
    const classeCodigo = processoDados.classe_codigo 
      ? (typeof processoDados.classe_codigo === 'number' 
          ? processoDados.classe_codigo 
          : parseInt(processoDados.classe_codigo) || null)
      : null;

    setFormData(prev => ({
      ...prev,
      numero_processo: processoDados.numero_processo || prev.numero_processo,
      data_ajuizamento: processoDados.data_ajuizamento || prev.data_ajuizamento,
      descricao: processoDados.descricao || prev.descricao,
      assuntos: assuntosNormalizados,
      movimentos: processoDados.movimentos || [],
      classe_judicial: processoDados.classe_judicial || '',
      classe_codigo: classeCodigo,
      tribunal: processoDados.tribunal || '',
      grau: processoDados.grau || '',
      municipio: processoDados.municipio || '',
      orgao_julgador: typeof processoDados.orgao_julgador === 'string' 
        ? processoDados.orgao_julgador 
        : (processoDados.orgao_julgador?.nome || ''),
      orgao_julgador_metadata: processoDados.orgao_julgador_metadata || processoDados.orgao_julgador,
      codigo_orgao_julgador: processoDados.codigo_orgao_julgador,
      codigo_orgao_julgador_ibge: processoDados.codigo_orgao_julgador_ibge,
      sistema_processual: processoDados.sistema_processual || null,
      formato_processo: processoDados.formato_processo || null,
      nivel_sigilo: processoDados.nivel_sigilo || 0,
      data_hora_ultima_atualizacao: processoDados.data_hora_ultima_atualizacao || null,
    }));

    // Registrar enriquecimentos encontrados
    setEnriquecimentos({
      tpu: processoDados.classe_judicial ? { classe_judicial: processoDados.classe_judicial } : null,
      juizo: processoDados.tribunal ? { tribunal: processoDados.tribunal, municipio: processoDados.municipio } : null,
      foroTJSP: processoDados.codigo_foro_tjsp ? { nome_foro: processoDados.nome_foro, comarca: processoDados.comarca } : null,
    });
  };

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ProcessoCEJUSC.create(data),
    onSuccess: (data) => {
      clearAllErrors();
      setGlobalError(null);
      onSuccess?.(data);
    },
    onError: (error) => {
      setGlobalError(error);
    }
  });

  // Auto-carregar dados do CNJ ao digitar número
  const handleProcessoChange = async (valor) => {
    setFormData({ ...formData, numero_processo: valor });
    
    if (!valor || valor.length < 10) {
      setCnjData(null);
      setCnjValid(null);
      return;
    }

    setCnjLoading(true);
    try {
      const isValid = validarCNJ(valor);
      setCnjValid(isValid);

      if (isValid) {
        const parsed = parsearCNJ(valor);
        setCnjData(parsed);
        
        // Auto-preencher tribunal se disponível
        if (parsed.tribunalNome) {
          setFormData(prev => ({
            ...prev,
            tribunal: parsed.tribunalNome
          }));
        }
        // Formatar o número
        setFormData(prev => ({
          ...prev,
          numero_processo: parsed.formatado
        }));
      } else {
        setCnjData(null);
      }
    } catch (err) {
      console.error('Erro ao parsear CNJ:', err);
      setCnjData(null);
      setCnjValid(false);
    } finally {
      setCnjLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAllErrors();
    setGlobalError(null);

    // Validar frontend
    if (!formData.numero_processo) {
      setFieldError('numero_processo', {
        message: 'Número do processo obrigatório',
        code: 'REQUIRED_FIELD'
      });
    }
    if (!formData.data_ajuizamento) {
      setFieldError('data_ajuizamento', {
        message: 'Data de ajuizamento obrigatória',
        code: 'REQUIRED_FIELD'
      });
    }

    if (Object.keys(errors).length > 0) return;

    // VALIDAÇÃO BACKEND
    try {
      const validacao = await base44.functions.invoke('validarProcessoCEJUSC', {
        numero_processo: formData.numero_processo,
        data_ajuizamento: formData.data_ajuizamento,
        tribunal: formData.tribunal,
        partes: formData.partes
      });

      if (!validacao.data?.valido) {
        if (validacao.data?.erros && Array.isArray(validacao.data.erros)) {
          validacao.data.erros.forEach(err => {
            if (err.campo) {
              setFieldError(err.campo, {
                message: err.mensagem,
                code: err.code
              });
            }
          });
        }
        return;
      }

      // Enriquecer com dados DataJud se disponível
      if (validacao.data?.datajud && !formData.tribunal && validacao.data.datajud.tribunal) {
        setFormData(prev => ({ ...prev, tribunal: validacao.data.datajud.tribunal }));
      }
    } catch (validErr) {
      console.error('[ProcessoCEJUSCForm] Erro validação backend:', validErr.message);
      setFieldError('geral', {
        message: 'Erro ao validar processo no servidor',
        code: 'BACKEND_ERROR'
      });
      return;
    }

    // Normalizar dados antes de enviar
    const dataToSubmit = {
      ...formData,
      // Garantir classe_codigo é número ou null
      classe_codigo: formData.classe_codigo ? parseInt(formData.classe_codigo) || null : null,
      // Garantir assuntos é array de objetos {codigo, nome}
      assuntos: Array.isArray(formData.assuntos) 
        ? formData.assuntos.filter(a => a && (a.codigo || a.nome))
        : [],
    };

    createMutation.mutate(dataToSubmit);
  };

  const isLoading = createMutation.isPending;

  return (
    <FormWrapper
      title="Novo Processo CEJUSC"
      subtitle="Mediação judicial"
      onCancel={onCancel}
    >
      {/* Erro Global */}
      {globalError && (
        <ErrorAlert
          error={globalError}
          onRetry={handleSubmit}
          onClose={() => setGlobalError(null)}
          className="mb-4"
        />
      )}

      {/* Auto-preenchimento */}
      <AutoPreenchimentoProcesso clienteId={clienteId} onProcessoCarregado={handleProcessoCarregado} />

      <Tabs defaultValue="basico" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200">
          <TabsTrigger value="basico">Básico</TabsTrigger>
          <TabsTrigger value="partes">Partes</TabsTrigger>
          <TabsTrigger value="datajud">DataJud</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tab Básico */}
            <TabsContent value="basico" className="space-y-4">
              {/* Indicador de enriquecimento */}
              {Object.values(enriquecimentos).some(e => e) && (
                <EnriquecimentoIndicadorCompleto
                  classeEnriquecida={enriquecimentos.tpu?.classe_judicial}
                  assuntosEnriquecidos={enriquecimentos.tpu?.assuntos_enriquecidos?.length || 0}
                  movimentosEnriquecidos={enriquecimentos.tpu?.movimentos_enriquecidos?.length || 0}
                  documentosEnriquecidos={enriquecimentos.tpu?.documentos_enriquecidos?.length || 0}
                  juizoEnriquecido={!!enriquecimentos.juizo}
                  foroTJSPEnriquecido={!!enriquecimentos.foroTJSP}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="numero_processo">Número do Processo *</Label>
                 <div className="space-y-2">
                   <div className="relative">
                     <Input
                       id="numero_processo"
                       placeholder="0001234-56.2024.8.26.0000"
                       value={formData.numero_processo}
                       onChange={(e) => {
                         handleProcessoChange(e.target.value);
                         clearFieldError('numero_processo');
                       }}
                       className={cnjValid === false ? 'border-red-500' : cnjValid === true ? 'border-green-500' : ''}
                       required
                     />
                     {cnjLoading && <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-slate-400" />}
                     {cnjValid === true && <CheckCircle2 className="absolute right-3 top-2.5 h-4 w-4 text-green-600" />}
                     {cnjValid === false && formData.numero_processo.length >= 10 && (
                       <AlertCircle className="absolute right-3 top-2.5 h-4 w-4 text-red-600" />
                     )}
                   </div>

                   {/* Info do CNJ */}
                   {cnjData && (
                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                       <div className="text-xs font-medium text-blue-900">
                         ✓ Dados extraídos do CNJ:
                       </div>
                       <div className="text-xs text-blue-800 space-y-1">
                         <div><strong>Tribunal:</strong> {cnjData.tribunalNomeCompleto || cnjData.tribunalNome}</div>
                         <div><strong>Segmento:</strong> {cnjData.tipoJustica}</div>
                         <div><strong>Ano:</strong> {cnjData.ano}</div>
                         <div><strong>Número sequencial:</strong> {cnjData.numero}</div>
                       </div>
                     </div>
                   )}
                 </div>
                 {errors.numero_processo && (
                   <p className="text-xs text-red-600 mt-1">{errors.numero_processo.message}</p>
                 )}
               </div>

              <FormInput
                id="data_ajuizamento"
                label="Data de Ajuizamento *"
                type="date"
                value={formData.data_ajuizamento}
                onChange={(e) => {
                  setFormData({ ...formData, data_ajuizamento: e.target.value });
                  clearFieldError('data_ajuizamento');
                }}
                error={errors.data_ajuizamento}
                required
              />

              <div>
                <ClasseTPUValidatorAdvanced 
                  value={formData.classe_codigo}
                  onChange={(codigo) => {
                    setFormData({ ...formData, classe_codigo: codigo });
                  }}
                  onValidate={setClasseValida}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aberto">Aberto</SelectItem>
                    <SelectItem value="em_audiencia">Em Audiência</SelectItem>
                    <SelectItem value="acordo">Acordo</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="data_proxima_audiencia">Próxima Audiência</Label>
                <Input
                  id="data_proxima_audiencia"
                  type="date"
                  value={formData.data_proxima_audiencia}
                  onChange={(e) => setFormData({ ...formData, data_proxima_audiencia: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="descricao">Descrição da Reclamação</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                  placeholder="Descreva a reclamação e o motivo do processo..."
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={2}
                  placeholder="Observações gerais sobre o processo..."
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab Partes */}
          <TabsContent value="partes" className="space-y-4">
            <PartesManager partes={formData.partes} onChange={(partes) => setFormData({ ...formData, partes })} />
          </TabsContent>

          {/* Tab DataJud */}
          <TabsContent value="datajud" className="space-y-4">
            <AssuntosMovimentosViewer assuntos={formData.assuntos} movimentos={formData.movimentos} />
          </TabsContent>

          {/* Botões */}
          <div className="flex gap-2 pt-4 border-t">
            <Button type="button" variant="outline" className="flex-1 h-11" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}
              className="flex-1 h-11 bg-[#00d9a3] hover:bg-[#00c492] text-[#1f2749] font-bold">
              {isLoading ? "Salvando..." : "Cadastrar"}
            </Button>
          </div>
        </form>
      </Tabs>
    </FormWrapper>
  );
}