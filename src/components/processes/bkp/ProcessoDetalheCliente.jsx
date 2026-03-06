import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Scale, Calendar, Clock, FileText, Bell, AlertTriangle, CheckCircle, MessageSquare, Send, Plus, Loader2 } from 'lucide-react';
import MovimentacaoEnriquecida from './MovimentacaoEnriquecida';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const STATUS_PROCESSO = {
  aberto:       { label: 'Aberto',       className: 'bg-blue-100 text-blue-800'   },
  em_audiencia: { label: 'Em Audiência', className: 'bg-amber-100 text-amber-800' },
  acordo:       { label: 'Acordo',       className: 'bg-green-100 text-green-800' },
  cancelado:    { label: 'Cancelado',    className: 'bg-red-100 text-red-800'     },
  finalizado:   { label: 'Finalizado',   className: 'bg-slate-100 text-slate-600' },
};

const TIPO_ATO_INFO = {
  abertura_prazo:         { emoji: '⏰', label: 'Abertura de Prazo',         urgente: true  },
  emenda:                 { emoji: '📝', label: 'Emenda da Petição',         urgente: true  },
  apresentacao_documentos:{ emoji: '📄', label: 'Apresentação de Docs',      urgente: true  },
  plano_pagamento:        { emoji: '💰', label: 'Plano de Pagamento',        urgente: false },
  designacao_audiencia:   { emoji: '🗓️', label: 'Audiência Designada',       urgente: false },
  redesignacao_audiencia: { emoji: '🔄', label: 'Redesignação de Audiência', urgente: false },
  cancelamento_audiencia: { emoji: '❌', label: 'Cancelamento de Audiência', urgente: false },
  certidao_ata:           { emoji: '📋', label: 'Certidão/Ata',              urgente: false },
  acordo:                 { emoji: '🤝', label: 'Acordo',                    urgente: false },
  encerramento:           { emoji: '✅', label: 'Encerramento',              urgente: false },
  despacho:               { emoji: '⚖️', label: 'Despacho',                  urgente: false },
  sentenca:               { emoji: '⚖️', label: 'Sentença',                  urgente: false },
  recurso:                { emoji: '📌', label: 'Recurso',                   urgente: false },
  outro:                  { emoji: '📌', label: 'Andamento',                 urgente: false },
};

function TicketsCliente({ processoId, processo, user }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [titulo, setTitulo] = useState('');
  const [ticketAberto, setTicketAberto] = useState(null);

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets_cliente', processoId],
    queryFn: () => base44.entities.Ticket.filter({ processo_id: processoId }, '-ultima_mensagem_data', 50),
    enabled: !!processoId,
  });

  const criarTicket = useMutation({
    mutationFn: async () => {
      const msg = novaMensagem.trim() ? [{
        id: Date.now().toString(),
        autor_email: user?.email || '',
        autor_nome: user?.full_name || user?.email || 'Cliente',
        autor_tipo: 'cliente',
        conteudo: novaMensagem.trim(),
        data: new Date().toISOString(),
        lido_por_cliente: true,
        lido_por_consultor: false,
        anexos: [],
      }] : [];
      return base44.entities.Ticket.create({
        processo_id: processoId,
        processo_numero: processo?.numero_processo,
        cliente_id: processo?.cliente_id,
        cliente_nome: processo?.cliente_nome,
        cliente_email: user?.email,
        consultor_email: processo?.consultor_responsavel_email,
        consultor_nome: processo?.consultor_responsavel_nome,
        titulo: titulo.trim(),
        tipo: 'duvida',
        prioridade: 'media',
        status: 'aberto',
        mensagens: msg,
        ultima_mensagem_data: msg[0]?.data,
        ultima_mensagem_preview: msg[0]?.conteudo?.slice(0, 100),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets_cliente', processoId] });
      toast.success('Ticket aberto com sucesso');
      setShowForm(false);
      setTitulo('');
      setNovaMensagem('');
    },
    onError: (e) => toast.error('Erro: ' + e.message),
  });

  const enviarMensagem = useMutation({
    mutationFn: async (msg) => {
      const mensagens = [...(ticketAberto.mensagens || []), msg];
      return base44.entities.Ticket.update(ticketAberto.id, {
        mensagens,
        ultima_mensagem_data: msg.data,
        ultima_mensagem_preview: msg.conteudo.slice(0, 100),
        status: ticketAberto.status === 'aguardando_cliente' ? 'em_atendimento' : ticketAberto.status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets_cliente', processoId] });
      setNovaMensagem('');
      toast.success('Mensagem enviada');
    },
    onError: (e) => toast.error('Erro: ' + e.message),
  });

  if (ticketAberto) {
    const atualizados = tickets.find(t => t.id === ticketAberto.id) || ticketAberto;
    return (
      <div className="space-y-3">
        <Button variant="ghost" size="sm" onClick={() => setTicketAberto(null)} className="gap-1 text-slate-600">
          <ArrowLeft className="w-4 h-4" /> Tickets
        </Button>
        <Card>
          <CardHeader className="pb-3 border-b">
            <h3 className="font-semibold text-slate-800">{atualizados.titulo}</h3>
            <Badge className="w-fit text-xs bg-blue-100 text-blue-800">{atualizados.status}</Badge>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="space-y-3 max-h-64 overflow-y-auto mb-3">
              {(atualizados.mensagens || []).length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-4">Nenhuma mensagem ainda</p>
              ) : (
                atualizados.mensagens.map((msg, i) => {
                  const isOwn = msg.autor_tipo === 'cliente';
                  return (
                    <div key={i} className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
                      <div className={`max-w-[80%] rounded-lg p-2.5 text-sm ${isOwn ? 'bg-[#212373] text-white' : 'bg-slate-100 text-slate-800'}`}>
                        {!isOwn && <p className="text-xs font-semibold mb-0.5 opacity-70">{msg.autor_nome}</p>}
                        <p>{msg.conteudo}</p>
                        <p className={`text-xs mt-1 ${isOwn ? 'text-white/60' : 'text-slate-400'}`}>
                          {format(new Date(msg.data), 'dd/MM HH:mm')}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {atualizados.status !== 'fechado' && (
              <div className="flex gap-2 items-end border-t pt-3">
                <textarea
                  value={novaMensagem}
                  onChange={e => setNovaMensagem(e.target.value)}
                  placeholder="Escreva uma resposta..."
                  className="flex-1 border border-slate-300 rounded-lg p-2 text-sm resize-none h-16 focus:border-[#212373] focus:outline-none"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (!novaMensagem.trim()) return;
                    enviarMensagem.mutate({
                      id: Date.now().toString(),
                      autor_email: user?.email || '',
                      autor_nome: user?.full_name || 'Cliente',
                      autor_tipo: 'cliente',
                      conteudo: novaMensagem.trim(),
                      data: new Date().toISOString(),
                      lido_por_cliente: true,
                      lido_por_consultor: false,
                      anexos: [],
                    });
                  }}
                  disabled={!novaMensagem.trim() || enviarMensagem.isPending}
                  className="bg-[#212373] hover:bg-[#1a1b5e] text-white self-end"
                >
                  {enviarMensagem.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#212373]" />
          Meus Tickets
          <Badge variant="secondary" className="text-xs">{tickets.length}</Badge>
        </h3>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)} className="gap-1 text-xs bg-[#212373] hover:bg-[#1a1b5e] text-white">
            <Plus className="w-3 h-3" /> Abrir Ticket
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-[#212373]/20">
          <CardHeader className="pb-2 border-b">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm text-[#212373]">Novo Ticket</h4>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)} className="h-6 w-6 p-0">✕</Button>
            </div>
          </CardHeader>
          <CardContent className="pt-3 space-y-3">
            <input
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Título do ticket *"
              className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:border-[#212373] focus:outline-none"
            />
            <textarea
              value={novaMensagem}
              onChange={e => setNovaMensagem(e.target.value)}
              placeholder="Descreva sua dúvida ou solicitação..."
              className="w-full border border-slate-300 rounded-lg p-2 text-sm resize-none h-20 focus:border-[#212373] focus:outline-none"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button
                size="sm"
                onClick={() => criarTicket.mutate()}
                disabled={!titulo.trim() || criarTicket.isPending}
                className="bg-[#212373] hover:bg-[#1a1b5e] text-white gap-1"
              >
                {criarTicket.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                Abrir
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-8 text-slate-400 border-dashed border-2 rounded-lg">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Nenhum ticket aberto</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tickets.map(t => (
            <button
              key={t.id}
              onClick={() => { setTicketAberto(t); setNovaMensagem(''); }}
              className="w-full text-left border border-slate-200 rounded-lg p-3 hover:border-[#212373] hover:shadow-sm transition-all bg-white"
            >
              <p className="font-medium text-sm text-slate-800">{t.titulo}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="text-xs bg-blue-100 text-blue-800 border-0">{t.status}</Badge>
                <span className="text-xs text-slate-400">{t.mensagens?.length || 0} mensagen(s)</span>
                {t.ultima_mensagem_data && (
                  <span className="text-xs text-slate-400 ml-auto">
                    {format(new Date(t.ultima_mensagem_data), 'dd/MM HH:mm')}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProcessoDetalheCliente({ processoId, onBack, user }) {
  const { data: processo, isLoading: loadingProcesso } = useQuery({
    queryKey: ['processo_detalhe', processoId],
    queryFn: () => base44.entities.ProcessoCEJUSC.get(processoId),
    enabled: !!processoId,
  });

  const { data: andamentos = [], isLoading: loadingAndamentos } = useQuery({
    queryKey: ['andamentos_detalhe', processoId],
    queryFn: () => base44.entities.AndamentoProcessual.filter({ processo_id: processoId }, '-data_ato', 50),
    enabled: !!processoId,
  });

  if (loadingProcesso) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-[#212373] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!processo) {
    return (
      <div className="text-center py-16 text-slate-400">
        <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p>Processo não encontrado.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={onBack}>Voltar</Button>
      </div>
    );
  }

  const statusInfo = STATUS_PROCESSO[processo.status] || STATUS_PROCESSO.aberto;
  const andamentosUrgentes = andamentos.filter(a => TIPO_ATO_INFO[a.tipo_ato]?.urgente && !a.notificacao_cliente_enviada === false);
  const movimentos = (processo.movimentos || []).slice(0, 10);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-3 gap-1 text-slate-600">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <div className="bg-gradient-to-r from-[#212373] to-[#1a1956] text-white rounded-xl p-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="font-mono text-lg font-bold">{processo.numero_processo}</p>
              {processo.descricao && (
                <p className="text-white/70 text-sm mt-1">{processo.descricao}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className={`border-0 text-xs ${statusInfo.className}`}>{statusInfo.label}</Badge>
                {processo.tribunal && (
                  <Badge className="bg-white/20 text-white text-xs uppercase">{processo.tribunal}</Badge>
                )}
              </div>
            </div>
            <div className="text-white/70 text-sm space-y-1 text-right">
              {processo.data_abertura && (
                <p className="flex items-center gap-1 justify-end">
                  <Calendar className="w-3.5 h-3.5" />
                  Aberto: {format(new Date(processo.data_abertura + 'T12:00:00'), 'dd/MM/yyyy')}
                </p>
              )}
              {processo.classe_judicial && <p className="text-xs">{processo.classe_judicial}</p>}
              {processo.orgao_julgador && <p className="text-xs">{processo.orgao_julgador}</p>}
            </div>
          </div>
          {processo.data_proxima_audiencia && (
            <div className="mt-3 bg-amber-400/20 border border-amber-300/30 rounded-lg px-3 py-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              <span className="text-sm text-amber-100">
                Próxima audiência: <strong>
                  {format(new Date(processo.data_proxima_audiencia + 'T12:00:00'), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs: Andamentos + Tickets */}
      <Tabs defaultValue="andamentos">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="andamentos">📋 Andamentos</TabsTrigger>
          <TabsTrigger value="tickets">💬 Suporte</TabsTrigger>
        </TabsList>

        <TabsContent value="andamentos" className="space-y-4 mt-4">

      {/* Andamentos Urgentes */}
      {andamentosUrgentes.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-amber-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Atenção — {andamentosUrgentes.length} andamento(s) com prazo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {andamentosUrgentes.map(a => {
              const info = TIPO_ATO_INFO[a.tipo_ato] || TIPO_ATO_INFO.outro;
              const vencido = a.prazo_limite && new Date(a.prazo_limite + 'T23:59:00') < new Date();
              return (
                <div key={a.id} className="bg-white rounded-lg p-3 border border-amber-200">
                  <p className="font-semibold text-sm text-amber-900">{info.emoji} {info.label}</p>
                  {a.prazo_limite && (
                    <p className={`text-xs mt-0.5 font-medium ${vencido ? 'text-red-600' : 'text-amber-700'}`}>
                      {vencido ? '⚠ Prazo vencido: ' : 'Prazo: '}
                      {format(new Date(a.prazo_limite + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  )}
                  {a.descricao && <p className="text-xs text-slate-600 mt-0.5">{a.descricao}</p>}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Histórico de Andamentos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="w-4 h-4 text-[#212373]" />
            Histórico de Andamentos
            <Badge className="ml-auto bg-slate-100 text-slate-700 text-xs">{andamentos.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingAndamentos ? (
            <div className="flex justify-center py-6">
              <div className="w-5 h-5 border-2 border-slate-300 border-t-[#212373] rounded-full animate-spin" />
            </div>
          ) : andamentos.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nenhum andamento registrado ainda</p>
            </div>
          ) : (
            <div className="space-y-2">
              {andamentos.map(a => {
                const info = TIPO_ATO_INFO[a.tipo_ato] || TIPO_ATO_INFO.outro;
                const vencido = a.prazo_limite && new Date(a.prazo_limite + 'T23:59:00') < new Date();
                return (
                  <div
                    key={a.id}
                    className={`border rounded-lg p-3 bg-white ${info.urgente ? 'border-amber-200' : 'border-slate-200'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span>{info.emoji}</span>
                          <span className="text-sm font-semibold text-slate-800">{info.label}</span>
                          {info.urgente && (
                            <Badge className="bg-amber-100 text-amber-700 text-xs border-0">Com Prazo</Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Data: {a.data_ato ? format(new Date(a.data_ato + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR }) : '—'}
                          {a.prazo_limite && (
                            <span className={`ml-3 font-medium ${vencido ? 'text-red-600' : 'text-amber-700'}`}>
                              Prazo: {format(new Date(a.prazo_limite + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })}
                              {vencido && ' ⚠️'}
                            </span>
                          )}
                        </p>
                        {a.descricao && (
                          <p className="text-xs text-slate-600 mt-1">{a.descricao}</p>
                        )}
                      </div>
                      {a.notificacao_cliente_enviada && (
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" title="Você foi notificado por email" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

        </TabsContent>

        <TabsContent value="tickets" className="mt-4">
          <TicketsCliente processoId={processoId} processo={processo} user={user} />
        </TabsContent>
      </Tabs>

      {/* Movimentações DataJud com normalização TPU */}
      {movimentos.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Scale className="w-4 h-4 text-[#212373]" />
              Movimentações Processuais
              {processo.ultima_sincronizacao && (
                <span className="ml-auto text-xs font-normal text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Atualizado {format(new Date(processo.ultima_sincronizacao), "dd/MM HH:mm", { locale: ptBR })}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MovimentacaoEnriquecida movimentos={movimentos} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}