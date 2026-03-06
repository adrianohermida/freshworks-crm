import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { ChevronLeft, Send, Clock, User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ResumeLoader from '@/components/common/ResumeLoader';

const statusColors = {
  aberto: 'bg-blue-100 text-blue-800',
  triagem: 'bg-yellow-100 text-yellow-800',
  em_atendimento: 'bg-purple-100 text-purple-800',
  aguardando_cliente: 'bg-orange-100 text-orange-800',
  resolvido: 'bg-green-100 text-green-800',
  fechado: 'bg-gray-100 text-gray-800'
};

const prioridadeColors = {
  baixa: 'bg-gray-100 text-gray-800',
  media: 'bg-blue-100 text-blue-800',
  alta: 'bg-orange-100 text-orange-800',
  urgente: 'bg-red-100 text-red-800'
};

export default function TicketDetalhesCliente() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation ? useLocation() : null;
  const ticketId = location?.state?.ticketId || new URLSearchParams(window.location.search).get('id');
  const [resposta, setResposta] = useState('');

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const list = await base44.entities.Escritorio.list();
      return list[0];
    }
  });

  const { data: ticket, isLoading: loadingTicket } = useQuery({
    queryKey: ['ticket-cliente', ticketId],
    queryFn: async () => {
      if (!ticketId || !escritorio?.id) return null;
      const tickets = await base44.entities.Ticket.filter({ id: ticketId, escritorio_id: escritorio.id }, '', 1);
      return tickets[0] || null;
    },
    enabled: !!ticketId && !!escritorio?.id
  });

  const { data: mensagens = [], isLoading: loadingMensagens } = useQuery({
    queryKey: ['ticket-mensagens', ticketId],
    queryFn: async () => {
      if (!ticketId) return [];
      const msgs = await base44.entities.TicketMensagem.filter({
        ticket_id: ticketId
      }, '-created_date', 50);
      return msgs || [];
    },
    enabled: !!ticketId
  });

  const respostaMutation = useMutation({
    mutationFn: async (texto) => {
      const user = await base44.auth.me();
      await base44.entities.TicketMensagem.create({
        ticket_id: ticketId,
        remetente_email: user.email,
        remetente_nome: user.full_name,
        tipo_remetente: 'cliente',
        conteudo: texto,
        canal: ticket?.canal || 'chat'
      });
      
      // Atualizar status do ticket
      if (ticket?.status === 'aguardando_cliente') {
        await base44.entities.Ticket.update(ticketId, {
          status: 'em_atendimento',
          ultima_atualizacao: new Date().toISOString()
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket-mensagens']);
      queryClient.invalidateQueries(['ticket-cliente']);
      setResposta('');
      toast.success('Resposta enviada');
    },
    onError: () => toast.error('Erro ao enviar resposta')
  });

  const fecharMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.Ticket.update(ticketId, {
        status: 'fechado'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket-cliente']);
      toast.success('Ticket fechado');
      navigate(createPageUrl('MeusTickets'));
    }
  });

  if (loadingTicket || !ticket) return <ResumeLoader />;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(createPageUrl('MeusTickets'))}
            className="gap-2 text-[var(--brand-primary)]"
          >
            <ChevronLeft className="w-5 h-5" />
            Voltar
          </Button>
        </div>

        {/* Ticket Info */}
        <Card className="bg-[var(--bg-elevated)] border-[var(--border-primary)]">
          <CardHeader>
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl md:text-2xl text-[var(--text-primary)]">
                    {ticket.titulo}
                  </CardTitle>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Criado em {new Date(ticket.created_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {ticket.status !== 'fechado' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fecharMutation.mutate()}
                    disabled={fecharMutation.isPending}
                  >
                    Fechar Ticket
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge className={statusColors[ticket.status] || statusColors.aberto}>
                  {ticket.status?.replace('_', ' ')}
                </Badge>
                {ticket.prioridade && (
                  <Badge className={prioridadeColors[ticket.prioridade]}>
                    {ticket.prioridade}
                  </Badge>
                )}
                {ticket.responsavel_nome && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {ticket.responsavel_nome}
                  </Badge>
                )}
              </div>

              <p className="text-[var(--text-secondary)]">{ticket.descricao}</p>
            </div>
          </CardHeader>
        </Card>

        {/* Mensagens */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Conversa</h3>
          
          {loadingMensagens ? (
            <div className="space-y-2">
              {[1, 2].map(i => (
                <div key={i} className="h-24 bg-[var(--bg-elevated)] rounded animate-pulse" />
              ))}
            </div>
          ) : mensagens.length === 0 ? (
            <Card className="bg-[var(--bg-elevated)] border-[var(--border-primary)]">
              <CardContent className="p-6 text-center text-[var(--text-secondary)]">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                Nenhuma mensagem ainda
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {mensagens.map(msg => (
                <Card
                  key={msg.id}
                  className={`bg-[var(--bg-elevated)] border-[var(--border-primary)] ${
                    msg.tipo_remetente === 'cliente' ? 'ml-8' : 'mr-8'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="font-medium text-sm text-[var(--text-primary)]">
                        {msg.remetente_nome}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(msg.created_date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">{msg.conteudo}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Responder */}
        {ticket.status !== 'fechado' && (
          <Card className="bg-[var(--bg-elevated)] border-[var(--border-primary)]">
            <CardHeader>
              <CardTitle className="text-base">Adicionar Resposta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={resposta}
                onChange={(e) => setResposta(e.target.value)}
                placeholder="Digite sua resposta..."
                className="bg-[var(--bg-primary)] border-[var(--border-primary)] min-h-24"
              />
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setResposta('')}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => resposta.trim() && respostaMutation.mutate(resposta)}
                  disabled={!resposta.trim() || respostaMutation.isPending}
                  className="bg-[var(--brand-primary)]"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}