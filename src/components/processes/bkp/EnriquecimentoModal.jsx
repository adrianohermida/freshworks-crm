import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function EnriquecimentoModal({ parte, processo, onClose, onSuccess }) {
  const [step, setStep] = useState('preview'); // preview, confirming, success, error
  const [selectedConsulta, setSelectedConsulta] = useState(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // Busca tabela de precificação
  const { data: precificacoes = [] } = useQuery({
    queryKey: ['precificacoes'],
    queryFn: () => base44.entities.Precificacao.list(),
  });

  // Filtra consultas disponíveis baseado no tipo de pessoa
  const consultasDisponiveis = precificacoes.filter(p => {
    const tipoPessoa = parte.tipo === 'pessoa_fisica' ? 'fisica' : 'juridica';
    return p.tipo_pessoa === tipoPessoa && p.ativo;
  });

  const handleSelectConsulta = (consulta) => {
    setSelectedConsulta(consulta);
  };

  const handleEnriquecimento = async () => {
    if (!selectedConsulta) {
      toast.error('Selecione um tipo de consulta');
      return;
    }

    setLoading(true);
    setStep('confirming');

    try {
      // Chamar função backend para consultar Directdata
      const response = await base44.functions.invoke('enriquecerPartePorDirectdata', {
        parte_id: parte.id,
        parte_cpf_cnpj: parte.cpf_cnpj,
        tipo_consulta: selectedConsulta.tipo_consulta,
        custo_creditos: selectedConsulta.valor_creditos,
      });

      if (response.data?.success) {
        setStep('success');
        toast.success('Parte enriquecida com sucesso!');
        
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 2000);
      } else {
        setStep('error');
        toast.error(response.data?.mensagem || 'Erro na consulta');
      }
    } catch (error) {
      setStep('error');
      toast.error('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Enriquecer Dados - {parte.nome}</DialogTitle>
        </DialogHeader>

        {step === 'preview' && (
          <div className="space-y-4">
            {/* Info Parte */}
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-xs font-semibold text-slate-600 mb-1">Dados Atuais da Parte</p>
              <p className="text-sm text-slate-800">{parte.nome}</p>
              {parte.cpf_cnpj && <p className="text-xs text-slate-600">CPF/CNPJ: {parte.cpf_cnpj}</p>}
              {parte.qualificacao && <p className="text-xs text-slate-600">Qualificação: {parte.qualificacao}</p>}
            </div>

            {/* Seleção de Consulta */}
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">Selecione o Tipo de Consulta Directdata</p>
              {consultasDisponiveis.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-800">Nenhuma consulta disponível para este tipo de pessoa</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {consultasDisponiveis.map((consulta) => (
                    <div
                      key={consulta.id}
                      onClick={() => handleSelectConsulta(consulta)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedConsulta?.id === consulta.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <p className="font-semibold text-sm text-slate-800">{consulta.nome_consulta}</p>
                      <p className="text-xs text-slate-600 mt-1">{consulta.descricao}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                          {consulta.nivel.toUpperCase()}
                        </Badge>
                        <span className="font-bold text-sm text-blue-600">{consulta.valor_creditos} créditos</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preview dos Dados que serão Retornados */}
            {selectedConsulta && (
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">Dados que Serão Retornados</p>
                <div className="bg-slate-50 p-3 rounded-lg max-h-64 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {selectedConsulta.campos_retornados?.map((campo) => (
                      <div key={campo} className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-slate-700">{campo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Custo */}
            {selectedConsulta && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800">Custo da Consulta:</span>
                  <span className="text-lg font-bold text-blue-600">{selectedConsulta.valor_creditos} créditos</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">≈ R$ {selectedConsulta.valor_reais}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button
                onClick={handleEnriquecimento}
                disabled={!selectedConsulta || loading}
                className="gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Confirmar e Enriquecer
              </Button>
            </div>
          </div>
        )}

        {step === 'confirming' && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm text-slate-700">Consultando Directdata...</p>
            <p className="text-xs text-slate-500 mt-1">Isso pode levar alguns segundos</p>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-semibold text-slate-800">Sucesso!</p>
            <p className="text-xs text-slate-600 mt-1">Dados enriquecidos com sucesso</p>
          </div>
        )}

        {step === 'error' && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-sm font-semibold text-slate-800">Erro na Consulta</p>
            <p className="text-xs text-slate-600 mt-1">Verifique o CPF/CNPJ e tente novamente</p>
            <Button variant="outline" className="mt-4" onClick={() => setStep('preview')}>
              Voltar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}