import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ChevronRight, CheckCircle, Clock, Send, FileSearch, Handshake, XCircle, Loader2 } from 'lucide-react';

const ESTADOS_PROCON = [
  { value: 'aberto',       label: 'Rascunho',         color: 'bg-slate-100 text-slate-700',  icon: Clock },
  { value: 'em_audiencia', label: 'Enviado ao PROCON', color: 'bg-blue-100 text-blue-800',   icon: Send },
  { value: 'acordo',       label: 'Em Análise',        color: 'bg-yellow-100 text-yellow-800', icon: FileSearch },
  { value: 'finalizado',   label: 'Resolvido',         color: 'bg-green-100 text-green-800',  icon: Handshake },
  { value: 'cancelado',    label: 'Cancelado',         color: 'bg-red-100 text-red-800',      icon: XCircle },
];

const TRANSICOES_VALIDAS = {
  aberto:       ['em_audiencia', 'cancelado'],
  em_audiencia: ['acordo', 'cancelado'],
  acordo:       ['finalizado', 'em_audiencia', 'cancelado'],
  finalizado:   [],
  cancelado:    [],
};

const STATUS_LABELS = {
  aberto:       'Rascunho',
  em_audiencia: 'Enviado ao PROCON',
  acordo:       'Em Análise',
  finalizado:   'Resolvido',
  cancelado:    'Cancelado',
};

export default function ProconWorkflow({ processo }) {
  const queryClient = useQueryClient();
  const [transitioning, setTransitioning] = useState(false);

  const currentIndex = ESTADOS_PROCON.findIndex(e => e.value === processo.status);
  const transicoesPossiveis = TRANSICOES_VALIDAS[processo.status] || [];

  const mutation = useMutation({
    mutationFn: ({ novoStatus }) =>
      base44.entities.ProcessoCEJUSC.update(processo.id, { status: novoStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processos'] });
      toast.success('Status atualizado!');
      setTransitioning(false);
    },
    onError: (e) => { toast.error('Erro: ' + e.message); setTransitioning(false); },
  });

  const moverPara = (novoStatus) => {
    const novoLabel = STATUS_LABELS[novoStatus];
    if (!confirm(`Mover processo para "${novoLabel}"?`)) return;
    setTransitioning(true);
    mutation.mutate({ novoStatus });
  };

  // Fluxo linear do PROCON (excluindo cancelado para a barra de progresso)
  const fluxoPrincipal = ESTADOS_PROCON.filter(e => e.value !== 'cancelado');

  return (
    <Card className="border-orange-200 bg-orange-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-orange-800 flex items-center gap-2">
          🏛️ Workflow PROCON
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barra de progresso visual */}
        <div className="flex items-center gap-1">
          {fluxoPrincipal.map((estado, idx) => {
            const isCurrent = estado.value === processo.status;
            const isPast = idx < fluxoPrincipal.findIndex(e => e.value === processo.status);
            const Icon = estado.icon;
            return (
              <React.Fragment key={estado.value}>
                <div className={`flex flex-col items-center flex-1 min-w-0`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCurrent ? 'bg-orange-500 text-white shadow-md' :
                    isPast ? 'bg-green-500 text-white' :
                    'bg-slate-200 text-slate-400'
                  }`}>
                    {isPast ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <p className={`text-xs mt-1 text-center leading-tight ${isCurrent ? 'font-bold text-orange-700' : isPast ? 'text-green-700' : 'text-slate-400'}`}>
                    {estado.label}
                  </p>
                </div>
                {idx < fluxoPrincipal.length - 1 && (
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isPast ? 'text-green-400' : 'text-slate-300'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Status atual */}
        {processo.status === 'cancelado' && (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" /> Processo Cancelado
          </Badge>
        )}

        {/* Ações disponíveis */}
        {transicoesPossiveis.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <p className="w-full text-xs text-slate-500">Avançar para:</p>
            {transicoesPossiveis.map(status => {
              const cfg = ESTADOS_PROCON.find(e => e.value === status);
              const Icon = cfg?.icon || Clock;
              const isCancelar = status === 'cancelado';
              return (
                <Button
                  key={status}
                  size="sm"
                  variant={isCancelar ? 'ghost' : 'outline'}
                  onClick={() => moverPara(status)}
                  disabled={mutation.isPending}
                  className={`gap-1 text-xs ${isCancelar ? 'text-red-500 hover:bg-red-50' : 'border-orange-300 text-orange-700 hover:bg-orange-50'}`}
                >
                  {mutation.isPending && transitioning ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Icon className="w-3 h-3" />
                  )}
                  {STATUS_LABELS[status]}
                </Button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}