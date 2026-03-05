/**
 * ProcessoTimeline
 * Exibe histórico de movimentações do processo com tradução TPU.
 * Usa AndamentoProcessual como fonte primária, processo.movimentos[] como fallback.
 */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import MovimentacaoEnriquecida from './MovimentacaoEnriquecida';

export default function ProcessoTimeline({ movimentos = [], processo = {} }) {
  // Busca AndamentosProcessual (fonte primária, mais enriquecida)
  const { data: andamentos = [], isLoading } = useQuery({
    queryKey: ['andamentos-processuais', processo.id],
    queryFn: () => base44.entities.AndamentoProcessual.filter(
      { processo_id: processo.id },
      '-data_hora',
      100
    ),
    enabled: !!processo.id,
    staleTime: 2 * 60 * 1000,
  });

  // Usa andamentos se disponíveis, senão fallback para processo.movimentos[]
  const fonte = andamentos.length > 0 ? andamentos : movimentos;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Scale className="w-4 h-4 text-[#212373]" />
          Movimentações Processuais
          {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400 ml-1" />}
          {processo.ultima_sincronizacao && !isLoading && (
            <span className="ml-auto text-xs font-normal text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Sync {format(new Date(processo.ultima_sincronizacao), "dd/MM HH:mm", { locale: ptBR })}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-slate-400 py-4 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            Carregando movimentações...
          </div>
        ) : (
          <MovimentacaoEnriquecida movimentos={fonte} />
        )}
      </CardContent>
    </Card>
  );
}