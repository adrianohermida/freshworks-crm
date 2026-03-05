import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Send, Loader2, RefreshCw, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TIPOS_ATO_LABEL = {
  abertura_prazo: { label: 'Abertura de Prazo', emoji: '⏰', urgente: true },
  emenda: { label: 'Emenda da Petição', emoji: '📝', urgente: true },
  apresentacao_documentos: { label: 'Apresentação de Docs', emoji: '📄', urgente: true },
  plano_pagamento: { label: 'Plano de Pagamento', emoji: '💰' },
  designacao_audiencia: { label: 'Audiência Designada', emoji: '🗓️' },
  redesignacao_audiencia: { label: 'Redesignação', emoji: '🔄' },
  cancelamento_audiencia: { label: 'Cancelamento', emoji: '❌' },
  certidao_ata: { label: 'Certidão/Ata', emoji: '📋' },
  acordo: { label: 'Acordo', emoji: '🤝' },
  encerramento: { label: 'Encerramento', emoji: '✅' },
  despacho: { label: 'Despacho', emoji: '⚖️' },
  sentenca: { label: 'Sentença', emoji: '⚖️' },
  recurso: { label: 'Recurso', emoji: '📌' },
  outro: { label: 'Outro', emoji: '📌' },
};

export default function AndamentosNotificacoesPainel() {
  const queryClient = useQueryClient();
  const [enviandoTodos, setEnviandoTodos] = useState(false);

  // Busca andamentos não notificados
  const { data: andamentos = [], isLoading, refetch } = useQuery({
    queryKey: ['andamentos_pendentes_notificacao'],
    queryFn: () => base44.entities.AndamentoProcessual.filter(
      { notificacao_cliente_enviada: false },
      '-created_date',
      100
    ),
    refetchInterval: 60000,
  });

  const enviarMutation = useMutation({
    mutationFn: (andamentoId) => base44.functions.invoke('enviarNotificacaoAndamento', {
      andamento_id: andamentoId,
      notificar_cliente: true,
      notificar_consultor: true,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['andamentos_pendentes_notificacao'] });
      toast.success('Notificação enviada');
    },
    onError: (e) => toast.error('Erro: ' + e.message),
  });

  const enviarTodosMutation = useMutation({
    mutationFn: async () => {
      setEnviandoTodos(true);
      const comEmail = andamentos.filter(a => a.cliente_email);
      let ok = 0, erro = 0;
      for (const a of comEmail) {
        try {
          await base44.functions.invoke('enviarNotificacaoAndamento', {
            andamento_id: a.id,
            notificar_cliente: true,
            notificar_consultor: true,
          });
          ok++;
        } catch {
          erro++;
        }
      }
      return { ok, erro };
    },
    onSuccess: ({ ok, erro }) => {
      setEnviandoTodos(false);
      queryClient.invalidateQueries({ queryKey: ['andamentos_pendentes_notificacao'] });
      toast.success(`${ok} notificações enviadas${erro > 0 ? `, ${erro} falhas` : ''}`);
    },
    onError: () => { setEnviandoTodos(false); toast.error('Erro ao enviar notificações'); },
  });

  // Separa urgentes e normais
  const urgentes = andamentos.filter(a => TIPOS_ATO_LABEL[a.tipo_ato]?.urgente);
  const normais = andamentos.filter(a => !TIPOS_ATO_LABEL[a.tipo_ato]?.urgente);
  const semEmail = andamentos.filter(a => !a.cliente_email);

  if (isLoading) return (
    <div className="flex justify-center py-8">
      <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#212373]" />
          <h2 className="font-semibold text-slate-900">Notificações Pendentes</h2>
          {andamentos.length > 0 && (
            <Badge className="bg-amber-100 text-amber-800 border border-amber-200">
              {andamentos.length} pendente{andamentos.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={refetch}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          {andamentos.filter(a => a.cliente_email).length > 0 && (
            <Button
              size="sm"
              className="bg-[#212373] hover:bg-[#1a1b5e]"
              onClick={() => enviarTodosMutation.mutate()}
              disabled={enviandoTodos || enviarTodosMutation.isPending}
            >
              {enviandoTodos
                ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" />Enviando...</>
                : <><Send className="w-3 h-3 mr-1" />Notificar Todos</>}
            </Button>
          )}
        </div>
      </div>

      {andamentos.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <p className="font-medium text-slate-800">Todas as notificações foram enviadas</p>
            <p className="text-sm text-slate-500 mt-1">Nenhum andamento pendente de notificação</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Aviso sem email */}
          {semEmail.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 flex items-center gap-2">
              <BellOff className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{semEmail.length} andamento(s) sem email de cliente cadastrado — não serão notificados</span>
            </div>
          )}

          {/* Urgentes */}
          {urgentes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <p className="text-sm font-semibold text-amber-700">Com Prazo ({urgentes.length})</p>
              </div>
              {urgentes.map(a => (
                <AndamentoNotificacaoCard
                  key={a.id}
                  andamento={a}
                  onEnviar={() => enviarMutation.mutate(a.id)}
                  enviando={enviarMutation.isPending}
                  urgente
                />
              ))}
            </div>
          )}

          {/* Normais */}
          {normais.length > 0 && (
            <div className="space-y-2">
              {urgentes.length > 0 && (
                <p className="text-sm font-semibold text-slate-600">Outros ({normais.length})</p>
              )}
              {normais.map(a => (
                <AndamentoNotificacaoCard
                  key={a.id}
                  andamento={a}
                  onEnviar={() => enviarMutation.mutate(a.id)}
                  enviando={enviarMutation.isPending}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AndamentoNotificacaoCard({ andamento, onEnviar, enviando, urgente }) {
  const tipo = TIPOS_ATO_LABEL[andamento.tipo_ato] || TIPOS_ATO_LABEL.outro;
  const prazoPassado = andamento.prazo_limite && new Date(andamento.prazo_limite + 'T23:59:00') < new Date();

  return (
    <div className={`border rounded-lg p-3 bg-white flex items-start justify-between gap-3 ${urgente ? 'border-amber-200' : 'border-slate-200'}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-base">{tipo.emoji}</span>
          <span className="text-sm font-semibold text-slate-800">{tipo.label}</span>
          {urgente && <Badge className="bg-amber-100 text-amber-700 text-xs border border-amber-200">Com Prazo</Badge>}
          {prazoPassado && <Badge className="bg-red-100 text-red-700 text-xs border border-red-200">⚠ Vencido</Badge>}
        </div>
        <div className="text-xs text-slate-500 space-y-0.5">
          <p className="font-mono truncate">{andamento.processo_numero || andamento.processo_id}</p>
          <p>
            Cliente: <span className="text-slate-700">{andamento.cliente_nome || '—'}</span>
            {andamento.cliente_email
              ? <span className="ml-2 text-slate-400">({andamento.cliente_email})</span>
              : <span className="ml-2 text-red-400">sem email</span>}
          </p>
          <p>Ato: {andamento.data_ato ? format(new Date(andamento.data_ato + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR }) : '—'}</p>
          {andamento.prazo_limite && (
            <p className={prazoPassado ? 'text-red-600 font-medium' : 'text-amber-600'}>
              Prazo: {format(new Date(andamento.prazo_limite + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })}
            </p>
          )}
          {andamento.descricao && <p className="text-slate-600 truncate">{andamento.descricao}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-1 flex-shrink-0">
        {andamento.cliente_email ? (
          <Button
            size="sm"
            variant="outline"
            className="text-xs gap-1 border-[#212373] text-[#212373] hover:bg-[#212373] hover:text-white"
            onClick={onEnviar}
            disabled={enviando}
          >
            {enviando ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
            Enviar
          </Button>
        ) : (
          <Button size="sm" variant="ghost" disabled className="text-xs gap-1 text-slate-300">
            <BellOff className="w-3 h-3" />
            Sem email
          </Button>
        )}
      </div>
    </div>
  );
}