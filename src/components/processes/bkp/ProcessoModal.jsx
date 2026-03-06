import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { parsearCNJ, validarCNJ, formatarCNJ } from '@/components/utils/CNJParser';
import PartesManager from './PartesManager';

const ESTADOS = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'];

export default function ProcessoModal({ isOpen, onClose, processo, defaultTipo = 'cejusc' }) {
  const queryClient = useQueryClient();
  const isEditing = !!processo?.id;

  const [form, setForm] = useState({
    tipo: defaultTipo,
    numero_processo: '',
    tribunal: '',
    classe_judicial: '',
    classe_codigo: '',
    grau: '',
    data_abertura: '',
    data_proxima_audiencia: '',
    data_hora_ultima_atualizacao: '',
    status: 'aberto',
    descricao: '',
    cliente_id: '',
    cliente_nome: '',
    consultor_responsavel_email: '',
    sistema_processual: null,
    formato_processo: null,
    nivel_sigilo: 0,
    observacoes: '',
  });

  const [cnjData, setCnjData] = useState(null);
  const [cnjLoading, setCnjLoading] = useState(false);
  const [cnjValid, setCnjValid] = useState(null);
  const [partes, setPartes] = useState(processo?.partes || []);

  useEffect(() => {
    if (processo) {
      setForm({
        tipo: processo.tipo || defaultTipo,
        numero_processo: processo.numero_processo || '',
        tribunal: processo.tribunal || '',
        classe_judicial: processo.classe_judicial || '',
        classe_codigo: processo.classe_codigo || '',
        grau: processo.grau || '',
        data_abertura: processo.data_abertura || '',
        data_proxima_audiencia: processo.data_proxima_audiencia || '',
        data_hora_ultima_atualizacao: processo.data_hora_ultima_atualizacao || '',
        status: processo.status || 'aberto',
        descricao: processo.descricao || '',
        cliente_id: processo.cliente_id || '',
        cliente_nome: processo.cliente_nome || '',
        consultor_responsavel_email: processo.consultor_responsavel_email || '',
        consultor_responsavel_nome: processo.consultor_responsavel_nome || '',
        sistema_processual: processo.sistema_processual || null,
        formato_processo: processo.formato_processo || null,
        nivel_sigilo: processo.nivel_sigilo || 0,
        observacoes: processo.observacoes || '',
      });
      setPartes(processo.partes || []);
    } else {
      setForm(f => ({ ...f, tipo: defaultTipo, numero_processo: '', data_abertura: '', data_hora_ultima_atualizacao: '', descricao: '', status: 'aberto', consultor_responsavel_email: '', consultor_responsavel_nome: '', sistema_processual: null, formato_processo: null, nivel_sigilo: 0 }));
      setPartes([]);
    }
  }, [processo, defaultTipo, isOpen]);

  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes-select'],
    queryFn: () => base44.entities.Cliente.filter({}, 'nome_completo', 200),
  });

  const { data: consultores = [] } = useQuery({
    queryKey: ['consultores-select'],
    queryFn: () => base44.entities.Consultor.filter({ status: 'ativo' }, 'nome_completo', 200),
  });

  const saveMutation = useMutation({
    mutationFn: (data) =>
      isEditing
        ? base44.entities.ProcessoCEJUSC.update(processo.id, data)
        : base44.entities.ProcessoCEJUSC.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processos'] });
      toast.success(isEditing ? 'Processo atualizado!' : 'Processo criado!');
      onClose();
    },
    onError: (err) => toast.error(err.message || 'Erro ao salvar'),
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // Auto-carregar dados do CNJ ao digitar número
  const handleProcessoChange = async (valor) => {
    set('numero_processo', valor);
    
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
        
        // Auto-preencher campos
        if (parsed.tribunalNome) {
          set('tribunal', parsed.tribunalNome);
        }
        // Formatar o número
        set('numero_processo', parsed.formatado);
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

  // Gerar título automaticamente baseado nas partes
  const gerarTitulo = () => {
    const poloAtivo = partes.filter(p => p.polo === 'ativo').map(p => p.nome);
    const poloPassivo = partes.filter(p => p.polo === 'passivo').map(p => p.nome);
    
    let titulo = '';
    if (poloAtivo.length > 0) {
      titulo = poloAtivo.length === 1 ? poloAtivo[0] : `${poloAtivo[0]} e outros`;
    }
    if (poloPassivo.length > 0) {
      titulo += (titulo ? ' x ' : '') + (poloPassivo.length === 1 ? poloPassivo[0] : `${poloPassivo[0]} e outros`);
    }
    return titulo;
  };

  const handleSave = () => {
    if (!form.numero_processo || !form.data_abertura) {
      toast.error('Preencha número do processo e data de abertura');
      return;
    }
    // Sincronizar nome do cliente selecionado
    const clienteSelecionado = clientes.find(c => c.id === form.cliente_id);
    const consultorSelecionado = consultores.find(c => c.email === form.consultor_responsavel_email);
    
    saveMutation.mutate({
      ...form,
      cliente_nome: clienteSelecionado?.nome_completo || form.cliente_nome,
      consultor_responsavel_nome: consultorSelecionado?.nome_completo || form.consultor_responsavel_nome,
      partes: partes,
      descricao: form.descricao || gerarTitulo(), // Usar título gerado se descrição vazia
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Processo' : 'Novo Processo'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Atualize os dados do processo' : 'Crie um novo processo no sistema'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basico" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basico">Básico</TabsTrigger>
            <TabsTrigger value="partes">Partes</TabsTrigger>
          </TabsList>

          <TabsContent value="basico" className="space-y-4 py-2">
          {/* Tipo */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Tipo *</label>
            <Select value={form.tipo} onValueChange={(v) => set('tipo', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cejusc">CEJUSC</SelectItem>
                <SelectItem value="procon">PROCON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Número */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Número do Processo *</label>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  placeholder={form.tipo === 'cejusc' ? 'Ex: 0000832-35.2018.4.01.3202' : 'Ex: RECL-2024-001'}
                  value={form.numero_processo}
                  onChange={(e) => handleProcessoChange(e.target.value)}
                  className={cnjValid === false ? 'border-red-500' : cnjValid === true ? 'border-green-500' : ''}
                />
                {cnjLoading && <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-slate-400" />}
                {cnjValid === true && <CheckCircle2 className="absolute right-3 top-2.5 h-4 w-4 text-green-600" />}
                {cnjValid === false && form.numero_processo.length >= 10 && (
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
          </div>

          {/* Tribunal / UF */}
          {form.tipo === 'cejusc' && (
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Tribunal / UF</label>
              <Select value={form.tribunal} onValueChange={(v) => set('tribunal', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar UF" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Classe */}
          {form.tipo === 'cejusc' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Classe Judicial</label>
                <Input
                  placeholder="Ex: Procedimento Comum Cível"
                  value={form.classe_judicial}
                  onChange={(e) => set('classe_judicial', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Código Classe (TPU)</label>
                <Input
                  placeholder="Ex: 436"
                  type="number"
                  value={form.classe_codigo}
                  onChange={(e) => set('classe_codigo', e.target.value ? parseInt(e.target.value) : '')}
                />
              </div>
            </div>
          )}

          {/* Datas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Data de Abertura *</label>
              <Input type="date" value={form.data_abertura} onChange={(e) => set('data_abertura', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Próx. Audiência</label>
              <Input type="date" value={form.data_proxima_audiencia} onChange={(e) => set('data_proxima_audiencia', e.target.value)} />
            </div>
          </div>

          {/* Data Última Atualização (DataJud) */}
          {form.tipo === 'cejusc' && (
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Última Atualização (DataJud)</label>
              <Input type="datetime-local" value={form.data_hora_ultima_atualizacao} onChange={(e) => set('data_hora_ultima_atualizacao', e.target.value)} />
            </div>
          )}

          {/* Status */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Status</label>
            <Select value={form.status} onValueChange={(v) => set('status', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aberto">Aberto</SelectItem>
                <SelectItem value="em_audiencia">Em Audiência</SelectItem>
                <SelectItem value="acordo">Acordo</SelectItem>
                <SelectItem value="finalizado">Finalizado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cliente */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Cliente Vinculado</label>
            <Select value={form.cliente_id} onValueChange={(v) => set('cliente_id', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar cliente..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>— Nenhum —</SelectItem>
                {clientes.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Consultor */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Consultor Responsável</label>
            <Select value={form.consultor_responsavel_email} onValueChange={(v) => set('consultor_responsavel_email', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar consultor..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>— Nenhum —</SelectItem>
                {consultores.map(c => (
                  <SelectItem key={c.id} value={c.email}>{c.nome_completo} ({c.email})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Descrição */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Descrição</label>
            <textarea
              className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:border-[#212373] focus:outline-none resize-none h-20"
              placeholder="Descreva o processo..."
              value={form.descricao}
              onChange={(e) => set('descricao', e.target.value)}
            />
          </div>

          {/* Grau */}
          {form.tipo === 'cejusc' && (
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Grau/Instância (G1, G2, JE)</label>
              <Input
                placeholder="Ex: G1, G2, JE"
                value={form.grau}
                onChange={(e) => set('grau', e.target.value)}
              />
            </div>
          )}

          {/* Sistema Processual */}
          {form.tipo === 'cejusc' && (
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Sistema Processual</label>
              <Input
                placeholder="Ex: Pje, SAJ"
                value={form.sistema_processual?.nome || ''}
                onChange={(e) => set('sistema_processual', { nome: e.target.value, codigo: null })}
              />
            </div>
          )}

          {/* Formato */}
          {form.tipo === 'cejusc' && (
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Formato</label>
              <Select value={form.formato_processo?.nome || ''} onValueChange={(v) => set('formato_processo', { nome: v, codigo: v === 'Eletrônico' ? 1 : 2 })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Eletrônico">Eletrônico</SelectItem>
                  <SelectItem value="Físico">Físico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Nível de Sigilo */}
          {form.tipo === 'cejusc' && (
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Nível de Sigilo</label>
              <Select value={String(form.nivel_sigilo)} onValueChange={(v) => set('nivel_sigilo', parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Público (0)</SelectItem>
                  <SelectItem value="1">Sigiloso (1)</SelectItem>
                  <SelectItem value="2">Altamente Sigiloso (2)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Observações */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Observações internas</label>
            <textarea
              className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:border-[#212373] focus:outline-none resize-none h-16"
              placeholder="Notas internas..."
              value={form.observacoes}
              onChange={(e) => set('observacoes', e.target.value)}
            />
          </div>
          </TabsContent>

          <TabsContent value="partes" className="py-2">
           <PartesManager partes={partes} onChange={setPartes} />
          </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
           <X className="w-4 h-4 mr-2" />Cancelar
          </Button>
          <Button
           onClick={handleSave}
           disabled={saveMutation.isPending}
           className="flex-1 bg-[#212373] hover:bg-[#1a1b5e]"
          >
           {saveMutation.isPending ? (
             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
           ) : (
             <Save className="w-4 h-4 mr-2" />
           )}
           {isEditing ? 'Atualizar' : 'Salvar'}
          </Button>
          </div>
          </DialogContent>
          </Dialog>
  );
}