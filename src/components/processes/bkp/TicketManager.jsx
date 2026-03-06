import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Plus, X, Loader2, MessageSquare, Send, Clock,
  ChevronDown, ChevronRight, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const STATUS_CONFIG = {
  aberto:            { label: 'Aberto',              color: 'bg-blue-100 text-blue-800'    },
  em_atendimento:    { label: 'Em Atendimento',       color: 'bg-yellow-100 text-yellow-800'},
  aguardando_cliente:{ label: 'Aguardando Cliente',   color: 'bg-orange-100 text-orange-800'},
  resolvido:         { label: 'Resolvido',            color: 'bg-green-100 text-green-800'  },
  fechado:           { label: 'Fechado',              color: 'bg-slate-100 text-slate-600'  },
};

const PRIORIDADE_CONFIG = {
  baixa:   { label: 'Baixa',   color: 'bg-slate-100 text-slate-600'  },
  media:   { label: 'Média',   color: 'bg-blue-100 text-blue-800'    },
  alta:    { label: 'Alta',    color: 'bg-amber-100 text-amber-800'  },
  urgente: { label: 'Urgente', color: 'bg-red-100 text-red-800'      },
};

const TIPOS_TICKET = [
  { value: 'duvida',     label: '❓ Dúvida'          },
  { value: 'documento',  label: '📄 Documento'        },
  { value: 'prazo',      label: '⏰ Prazo'             },
  { value: 'audiencia',  label: '🗓️ Audiência'         },
  { value: 'acordo',     label: '🤝 Acordo'            },
  { value: 'reclamacao', label: '⚠️ Reclamação'        },
  { value: 'outro',      label: '📌 Outro'             },
];

function TicketDetalhe({ ticket, user, onClose, onUpdated }) {
  const [novaMensagem, setNovaMensagem] = useState('');
  const queryClient = useQueryClient();

  const autorTipo = user?.role === 'admin' ? 'admin' : (user?.role === 'consultant' || user?.role === 'consultor') ? 'consultor' : 'cliente';

  const enviarMutation = useMutation({
    mutationFn: async () => {
      const msg = {
        id: Date.now().toString(),
        autor_email: user.email,
        autor_nome: user.full_name || user.email,
        autor_tipo: autorTipo,
        conteudo: novaMensagem.trim(),
        data: new Date().toISOString(),
        lido_por_cliente: autorTipo === 'cliente',
        lido_por_consultor: autorTipo !== 'cliente',
        anexos: [],
      };
      const mensagens = [...(ticket.mensagens || []), msg];
      await base44.entities.Ticket.update(ticket.id, {
        mensagens,
        ultima_mensagem_data: msg.data,
        ultima_mensagem_preview: msg.conteudo.slice(0, 100),
        status: ticket.status === 'aguardando_cliente' && autorTipo === 'cliente' ? 'em_atendimento' : ticket.status,
      });
      return msg;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setNovaMensagem('');
      onUpdated?.();
      toast.success('Mensagem enviada');
    },
    onError: (e) => toast.error('Erro: ' + e.message),
  });

  const mudarStatusMutation = useMutation({
    mutationFn: (novoStatus) => {
      const historico = [...(ticket.historico_status || []), {
        status_anterior: ticket.status,
        status_novo: novoStatus,
        alterado_por: user.email,
        data: new Date().toISOString(),
      }];
      return base44.entities.Ticket.update(ticket.id, { status: novoStatus, historico_status: historico });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      onUpdated?.();
      toast.success('Status atualizado');
    },
  });

  const podeGerenciar = user?.role === 'admin' || user?.role === 'consultant' || user?.role === 'consultor';
  const statusCfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.aberto;

  return (
    <Card className="border-[#212373]/20">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 items-center mb-1">
              <Badge className={statusCfg.color}>{statusCfg.label}</Badge>
              <Badge className={PRIORIDADE_CONFIG[ticket.prioridade]?.color}>{PRIORIDADE_CONFIG[ticket.prioridade]?.label}</Badge>
            </div>
            <h3 className="font-semibold text-slate-800">{ticket.titulo}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {ticket.cliente_nome} · Aberto em {format(new Date(ticket.created_date || Date.now()), 'dd/MM/yyyy HH:mm')}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 flex-shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Botões de status (apenas admin/consultor) */}
        {podeGerenciar && ticket.status !== 'fechado' && (
          <div className="flex flex-wrap gap-1 mt-2">
            {Object.entries(STATUS_CONFIG)
              .filter(([k]) => k !== ticket.status && k !== 'aberto')
              .map(([k, v]) => (
                <Button
                  key={k}
                  size="sm"
                  variant="outline"
                  onClick={() => mudarStatusMutation.mutate(k)}
                  disabled={mudarStatusMutation.isPending}
                  className="text-xs h-6 px-2"
                >
                  {v.label}
                </Button>
              ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-3">
        {/* Thread de mensagens */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1 mb-3">
          {(ticket.mensagens || []).length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-4">Nenhuma mensagem ainda</p>
          ) : (
            ticket.mensagens.map((msg, i) => {
              const isOwn = msg.autor_email === user?.email;
              return (
                <div key={i} className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
                  <div className={`max-w-[80%] rounded-lg p-2.5 text-sm ${
                    isOwn ? 'bg-[#212373] text-white' :
                    msg.autor_tipo === 'admin' || msg.autor_tipo === 'consultor' ? 'bg-slate-100 text-slate-800' :
                    'bg-blue-50 text-slate-800'
                  }`}>
                    {!isOwn && (
                      <p className="text-xs font-semibold mb-0.5 opacity-70">{msg.autor_nome}</p>
                    )}
                    <p className="leading-relaxed">{msg.conteudo}</p>
                    <p className={`text-xs mt-1 ${isOwn ? 'text-white/60' : 'text-slate-400'}`}>
                      {format(new Date(msg.data), 'dd/MM HH:mm')}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Caixa de resposta */}
        {ticket.status !== 'fechado' && (
          <div className="flex gap-2 items-end border-t pt-3">
            <textarea
              value={novaMensagem}
              onChange={e => setNovaMensagem(e.target.value)}
              placeholder="Escreva uma resposta..."
              className="flex-1 border border-slate-300 rounded-lg p-2 text-sm resize-none h-16 focus:border-[#212373] focus:outline-none"
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && novaMensagem.trim()) {
                  enviarMutation.mutate();
                }
              }}
            />
            <Button
              size="sm"
              onClick={() => enviarMutation.mutate()}
              disabled={!novaMensagem.trim() || enviarMutation.isPending}
              className="bg-[#212373] hover:bg-[#1a1b5e] text-white self-end"
            >
              {enviarMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function NovoTicketForm({ processo, user, onClose, onCreated }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ titulo: '', tipo: 'duvida', prioridade: 'media', mensagem_inicial: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const autorTipo = user?.role === 'admin' ? 'admin' : (user?.role === 'consultant' || user?.role === 'consultor') ? 'consultor' : 'cliente';

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const msg = data.mensagem_inicial ? [{
        id: Date.now().toString(),
        autor_email: user.email,
        autor_nome: user.full_name || user.email,
        autor_tipo: autorTipo,
        conteudo: data.mensagem_inicial,
        data: new Date().toISOString(),
        lido_por_cliente: autorTipo === 'cliente',
        lido_por_consultor: autorTipo !== 'cliente',
        anexos: [],
      }] : [];

      return base44.entities.Ticket.create({
        processo_id: processo?.id,
        processo_numero: processo?.numero_processo,
        cliente_id: processo?.cliente_id,
        cliente_nome: processo?.cliente_nome,
        cliente_email: user?.email,
        consultor_email: processo?.consultor_responsavel_email,
        consultor_nome: processo?.consultor_responsavel_nome,
        titulo: data.titulo,
        tipo: data.tipo,
        prioridade: data.prioridade,
        status: 'aberto',
        mensagens: msg,
        ultima_mensagem_data: msg[0]?.data,
        ultima_mensagem_preview: msg[0]?.conteudo?.slice(0, 100),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Ticket aberto com sucesso');
      onCreated?.();
      onClose();
    },
    onError: (e) => toast.error('Erro: ' + e.message),
  });

  return (
    <Card className="border-[#212373]/20 shadow-md">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base text-[#212373]">Abrir Ticket</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7"><X className="w-4 h-4" /></Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div>
          <Label className="text-xs text-slate-600">Título *</Label>
          <Input value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Descreva brevemente..." className="mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-slate-600">Tipo</Label>
            <Select value={form.tipo} onValueChange={v => set('tipo', v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TIPOS_TICKET.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-slate-600">Prioridade</Label>
            <Select value={form.prioridade} onValueChange={v => set('prioridade', v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(PRIORIDADE_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-xs text-slate-600">Mensagem inicial</Label>
          <textarea
            value={form.mensagem_inicial}
            onChange={e => set('mensagem_inicial', e.target.value)}
            placeholder="Descreva o que precisa..."
            className="mt-1 w-full border border-slate-300 rounded-lg p-2 text-sm resize-none h-20 focus:border-[#212373] focus:outline-none"
          />
        </div>
        <div className="flex gap-2 justify-end pt-1 border-t">
          <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          <Button
            size="sm"
            onClick={() => createMutation.mutate(form)}
            disabled={!form.titulo || createMutation.isPending}
            className="bg-[#212373] hover:bg-[#1a1b5e] text-white gap-1"
          >
            {createMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
            Abrir Ticket
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TicketManager({ processo, userRole, user }) {
  const [showForm, setShowForm] = useState(false);
  const [ticketAberto, setTicketAberto] = useState(null);

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets', processo?.id],
    queryFn: () => base44.entities.Ticket.filter({ processo_id: processo.id }, '-ultima_mensagem_data', 100),
    enabled: !!processo?.id,
  });

  const queryClient = useQueryClient();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#212373]" />
          Tickets de Atendimento
          <Badge variant="secondary" className="text-xs">{tickets.length}</Badge>
          {tickets.filter(t => t.status === 'aberto' || t.status === 'aguardando_cliente').length > 0 && (
            <Badge className="bg-red-100 text-red-800 text-xs">
              {tickets.filter(t => t.status === 'aberto' || t.status === 'aguardando_cliente').length} pendente(s)
            </Badge>
          )}
        </h3>
        {!showForm && !ticketAberto && (
          <Button size="sm" onClick={() => setShowForm(true)} className="gap-1 text-xs bg-[#212373] hover:bg-[#1a1b5e] text-white">
            <Plus className="w-3 h-3" /> Novo Ticket
          </Button>
        )}
      </div>

      {showForm && (
        <NovoTicketForm
          processo={processo}
          user={user}
          onClose={() => setShowForm(false)}
          onCreated={() => queryClient.invalidateQueries({ queryKey: ['tickets', processo?.id] })}
        />
      )}

      {ticketAberto && (
        <TicketDetalhe
          ticket={ticketAberto}
          user={user}
          onClose={() => setTicketAberto(null)}
          onUpdated={() => {
            queryClient.invalidateQueries({ queryKey: ['tickets', processo?.id] });
            // Reabrir o ticket atualizado
            queryClient.fetchQuery({ queryKey: ['tickets', processo?.id] })
              .then(list => {
                const atualizado = list.find(t => t.id === ticketAberto.id);
                if (atualizado) setTicketAberto(atualizado);
              }).catch(() => {});
          }}
        />
      )}

      {!ticketAberto && (
        isLoading ? (
          <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-6 text-slate-400 border-dashed border-2 rounded-lg">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Nenhum ticket aberto</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tickets.map(t => {
              const statusCfg = STATUS_CONFIG[t.status] || STATUS_CONFIG.aberto;
              const prioCfg = PRIORIDADE_CONFIG[t.prioridade] || PRIORIDADE_CONFIG.media;
              return (
                <button
                  key={t.id}
                  onClick={() => setTicketAberto(t)}
                  className="w-full text-left border border-slate-200 rounded-lg p-3 hover:border-[#212373] hover:shadow-sm transition-all bg-white"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge className={`${statusCfg.color} text-xs`}>{statusCfg.label}</Badge>
                        <Badge className={`${prioCfg.color} text-xs`}>{prioCfg.label}</Badge>
                        <span className="text-xs text-slate-400">{TIPOS_TICKET.find(ty => ty.value === t.tipo)?.label}</span>
                      </div>
                      <p className="font-medium text-slate-800 text-sm truncate">{t.titulo}</p>
                      {t.ultima_mensagem_preview && (
                        <p className="text-xs text-slate-400 truncate mt-0.5">{t.ultima_mensagem_preview}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-slate-400">
                        {t.mensagens?.length || 0} msg(s)
                      </p>
                      {t.ultima_mensagem_data && (
                        <p className="text-xs text-slate-400">
                          {format(new Date(t.ultima_mensagem_data), 'dd/MM HH:mm')}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}