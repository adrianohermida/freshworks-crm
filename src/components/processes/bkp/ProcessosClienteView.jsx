/**
 * ProcessosClienteView - Visão do cliente (somente seus processos)
 */
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, Scale, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { STATUS_CONFIG, TIPO_CONFIG } from './ProcessoCard';
import ProcessoKPIBar from './ProcessoKPIBar';
import ProcessoListaVazia from './ProcessoListaVazia';
import MovimentacaoEnriquecida from './MovimentacaoEnriquecida';
import { useProcessos, useProcessoFilters } from './hooks/useProcessos';

function ProcessoCardCliente({ processo }) {
  const conf = STATUS_CONFIG[processo.status] || STATUS_CONFIG.aberto;
  const tipoConf = TIPO_CONFIG[processo.tipo] || TIPO_CONFIG.cejusc;
  const Icon = conf.icon;
  const movimentos = (processo.movimentos || []).slice(0, 5);

  return (
    <Link to={createPageUrl(`ProcessoDetalhe?id=${processo.id}`)}>
      <Card className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200 hover:border-[#00d9a3] cursor-pointer group">
        <CardContent className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className={tipoConf.color + ' text-xs'}>{tipoConf.label}</Badge>
                <Badge className={conf.color + ' text-xs'}>
                  <Icon className="w-3 h-3 mr-1" />{conf.label}
                </Badge>
              </div>
              <p className="font-mono font-semibold text-sm text-slate-900 group-hover:text-[#00d9a3] transition-colors">
                {processo.numero_processo}
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#00d9a3] flex-shrink-0 transition-colors" />
          </div>

        {processo.descricao && (
          <p className="text-xs text-slate-600 line-clamp-2">{processo.descricao}</p>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
          {processo.data_abertura && (
            <div>
              <p className="font-medium text-slate-600 text-xs">Abertura</p>
              <p className="text-xs">{format(new Date(processo.data_abertura), 'dd/MM/yyyy', { locale: ptBR })}</p>
            </div>
          )}
          {processo.tribunal && (
            <div>
              <p className="font-medium text-slate-600 text-xs">Tribunal</p>
              <p className="text-xs">{processo.tribunal}</p>
            </div>
          )}
          {processo.classe_judicial && (
            <div className="col-span-2">
              <p className="font-medium text-slate-600 text-xs">Classe</p>
              <p className="text-xs">{processo.classe_judicial}</p>
            </div>
          )}
        </div>

        {processo.data_proxima_audiencia && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-800">Próxima Audiência</p>
              <p className="text-xs text-amber-700">
                {format(new Date(processo.data_proxima_audiencia + 'T12:00:00'), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>
        )}

        {movimentos.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-1.5">Últimas Movimentações</p>
            <MovimentacaoEnriquecida movimentos={movimentos} compact />
          </div>
        )}

        {processo.assuntos?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {processo.assuntos.slice(0, 3).map((a, i) => (
              <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {typeof a === 'string' ? a : a?.nome || a}
              </span>
            ))}
          </div>
        )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default function ProcessosClienteView({ user, clienteId }) {
  const resolvedClienteId = clienteId || user?.id;
  const { processos, isLoading } = useProcessos({ user, role: 'client', clienteId: resolvedClienteId });
  const { kpis } = useProcessoFilters(processos);

  const abertos = processos.filter(p => p.status === 'aberto' || p.status === 'em_audiencia');
  const concluidos = processos.filter(p => ['acordo', 'finalizado', 'cancelado'].includes(p.status));
  const stats = kpis();

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
  }

  if (processos.length === 0) {
    return <ProcessoListaVazia isCliente />;
  }

  return (
    <div className="space-y-5">
      <ProcessoKPIBar
        kpis={{ total: stats.total, 'Em Andamento': abertos.length, acordos: stats.acordos }}
        cols={3}
      />

      {abertos.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-slate-600 mb-3">Em Andamento ({abertos.length})</p>
          <div className="space-y-3">
            {abertos.map(p => <ProcessoCardCliente key={p.id} processo={p} />)}
          </div>
        </div>
      )}

      {concluidos.length > 0 && (
        <div className="opacity-80">
          <p className="text-sm font-semibold text-slate-500 mb-3">Concluídos / Arquivados ({concluidos.length})</p>
          <div className="space-y-3">
            {concluidos.map(p => <ProcessoCardCliente key={p.id} processo={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}