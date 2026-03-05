import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Bell, Clock, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import ProcessoDetalheCliente from './ProcessoDetalheCliente';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const STATUS_PROCESSO = {
  aberto:       { label: 'Aberto',        className: 'bg-blue-100 text-blue-800' },
  em_audiencia: { label: 'Em Audiência',  className: 'bg-amber-100 text-amber-800' },
  acordo:       { label: 'Acordo',        className: 'bg-green-100 text-green-800' },
  cancelado:    { label: 'Cancelado',     className: 'bg-red-100 text-red-800' },
  finalizado:   { label: 'Finalizado',    className: 'bg-slate-100 text-slate-600' },
};

const TIPO_ATO_INFO = {
  abertura_prazo:        { emoji: '⏰', label: 'Abertura de Prazo', urgente: true },
  emenda:                { emoji: '📝', label: 'Emenda da Petição', urgente: true },
  apresentacao_documentos:{ emoji: '📄', label: 'Apresentação de Docs', urgente: true },
  plano_pagamento:       { emoji: '💰', label: 'Plano de Pagamento' },
  designacao_audiencia:  { emoji: '🗓️', label: 'Audiência Designada' },
  redesignacao_audiencia:{ emoji: '🔄', label: 'Redesignação de Audiência' },
  cancelamento_audiencia:{ emoji: '❌', label: 'Cancelamento de Audiência' },
  certidao_ata:          { emoji: '📋', label: 'Certidão/Ata' },
  acordo:                { emoji: '🤝', label: 'Acordo' },
  encerramento:          { emoji: '✅', label: 'Encerramento' },
  despacho:              { emoji: '⚖️', label: 'Despacho' },
  sentenca:              { emoji: '⚖️', label: 'Sentença' },
  recurso:               { emoji: '📌', label: 'Recurso' },
  outro:                 { emoji: '📌', label: 'Andamento' },
};

export default function ProcessosClienteTab({ clienteId, user }) {
  const [processoSelecionado, setProcessoSelecionado] = useState(null);

  const { data: processos = [], isLoading: loadingProcessos } = useQuery({
    queryKey: ['processos_cliente', clienteId],
    queryFn: () => base44.entities.ProcessoCEJUSC.filter({ cliente_id: clienteId }, '-updated_date', 20),
    enabled: !!clienteId,
  });

  const { data: andamentos = [], isLoading: loadingAndamentos } = useQuery({
    queryKey: ['andamentos_cliente', clienteId],
    queryFn: () => base44.entities.AndamentoProcessual.filter({ cliente_id: clienteId }, '-created_date', 20),
    enabled: !!clienteId,
  });

  const andamentosUrgentes = andamentos.filter(a => TIPO_ATO_INFO[a.tipo_ato]?.urgente);
  const andamentosRecentes = andamentos.slice(0, 5);

  if (processoSelecionado) {
    return (
      <ProcessoDetalheCliente
        processoId={processoSelecionado}
        onBack={() => setProcessoSelecionado(null)}
        user={user}
      />
    );
  }

  if (loadingProcessos || loadingAndamentos) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alertas urgentes */}
      {andamentosUrgentes.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-amber-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {andamentosUrgentes.length} andamento(s) urgente(s) — atenção necessária
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {andamentosUrgentes.map(a => {
              const info = TIPO_ATO_INFO[a.tipo_ato] || TIPO_ATO_INFO.outro;
              const prazoPassado = a.prazo_limite && new Date(a.prazo_limite + 'T23:59:00') < new Date();
              return (
                <div key={a.id} className="bg-white rounded-lg p-3 border border-amber-200">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-amber-900">
                        {info.emoji} {info.label}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">{a.processo_numero}</p>
                      {a.prazo_limite && (
                        <p className={`text-xs font-medium mt-0.5 ${prazoPassado ? 'text-red-600' : 'text-amber-700'}`}>
                          {prazoPassado ? '⚠ Prazo vencido: ' : 'Prazo: '}
                          {format(new Date(a.prazo_limite + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                      )}
                      {a.descricao && <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{a.descricao}</p>}
                    </div>
                    <Badge className={prazoPassado ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}>
                      {prazoPassado ? 'Vencido' : 'Urgente'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Processos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="w-4 h-4 text-[#212373]" />
            Meus Processos CEJUSC
            <Badge className="ml-auto bg-slate-100 text-slate-700">{processos.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {processos.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nenhum processo registrado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {processos.map(p => {
                const statusInfo = STATUS_PROCESSO[p.status] || STATUS_PROCESSO.aberto;
                const ultimaSinc = p.ultima_sincronizacao
                  ? format(new Date(p.ultima_sincronizacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                  : null;
                const qtdAndamentos = andamentos.filter(a => a.processo_id === p.id).length;
                return (
                  <button
                    key={p.id}
                    onClick={() => setProcessoSelecionado(p.id)}
                    className="w-full text-left border border-slate-200 rounded-lg p-4 bg-slate-50 hover:bg-white hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm font-semibold text-slate-800 truncate">{p.numero_processo}</p>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          <Badge className={`text-xs border-0 ${statusInfo.className}`}>{statusInfo.label}</Badge>
                          {p.tribunal && (
                            <Badge variant="outline" className="text-xs uppercase">{p.tribunal}</Badge>
                          )}
                          {qtdAndamentos > 0 && (
                            <Badge className="text-xs bg-purple-100 text-purple-700 border-0">
                              {qtdAndamentos} andamento{qtdAndamentos > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        <div className="mt-2 space-y-0.5 text-xs text-slate-500">
                          {p.classe_judicial && <p>Classe: {p.classe_judicial}</p>}
                          {p.orgao_julgador && <p>Órgão: {p.orgao_julgador}</p>}
                          {p.data_proxima_audiencia && (
                            <p className="text-amber-700 font-medium">
                              🗓 Próxima audiência: {format(new Date(p.data_proxima_audiencia + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })}
                            </p>
                          )}
                          {ultimaSinc && (
                            <p className="flex items-center gap-1 text-slate-400">
                              <Clock className="w-3 h-3" /> Sincronizado: {ultimaSinc}
                            </p>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#212373] transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Histórico de Andamentos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="w-4 h-4 text-[#212373]" />
            Histórico de Andamentos
            <Badge className="ml-auto bg-slate-100 text-slate-700">{andamentos.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {andamentos.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nenhum andamento registrado</p>
            </div>
          ) : (
            <div className="space-y-2">
              {andamentosRecentes.map(a => {
                const info = TIPO_ATO_INFO[a.tipo_ato] || TIPO_ATO_INFO.outro;
                return (
                  <div key={a.id} className="flex items-start gap-3 border border-slate-100 rounded-lg p-3 bg-white">
                    <span className="text-lg flex-shrink-0">{info.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{info.label}</p>
                      <p className="text-xs font-mono text-slate-400 truncate">{a.processo_numero}</p>
                      {a.descricao && <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{a.descricao}</p>}
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0 gap-1">
                      <span className="text-xs text-slate-400">
                        {a.data_ato ? format(new Date(a.data_ato + 'T12:00:00'), 'dd/MM/yy', { locale: ptBR }) : '—'}
                      </span>
                      {a.notificacao_cliente_enviada && (
                        <CheckCircle className="w-3 h-3 text-green-500" title="Notificado" />
                      )}
                    </div>
                  </div>
                );
              })}
              {andamentos.length > 5 && (
                <p className="text-xs text-center text-slate-400 pt-1">
                  + {andamentos.length - 5} andamento(s) mais antigos
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}