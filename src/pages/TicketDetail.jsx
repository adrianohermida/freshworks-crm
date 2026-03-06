import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Zap, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

import ResponseHistoryPaginated from '../components/tickets/ResponseHistoryPaginated';
import StatusUpdater from '../components/tickets/StatusUpdater';
import AgentAssignmentPanel from '../components/tickets/AgentAssignmentPanel';
import ContactSearchModal from '../components/tickets/ContactSearchModal';
import CannedResponsesPanel from '../components/tickets/CannedResponsesPanel';
import TimeTracker from '../components/tickets/TimeTracker';
import ResponsePanel from '../components/tickets/ResponsePanel';
import Analytics from '../components/Analytics';
import TicketGroupUpdater from '../components/tickets/TicketGroupUpdater';
import TicketTypeUpdater from '../components/tickets/TicketTypeUpdater';
import TicketTagsUpdater from '../components/tickets/TicketTagsUpdater';

export default function TicketDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ticketId = searchParams.get('id');
  const [responseBody, setResponseBody] = useState('');
  const [errors, setErrors] = useState({});
  const [showContactSearch, setShowContactSearch] = useState(false);
  const queryClient = useQueryClient();

  const { data: ticketList = [], isLoading } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => base44.entities.Ticket.filter({ id: ticketId }),
    enabled: !!ticketId
  });

  const ticket = ticketList[0];

  const validateForm = () => {
    const newErrors = {};
    if (!responseBody.trim()) {
      newErrors.responseBody = 'Resposta não pode estar vazia';
    }
    if (responseBody.trim().length < 10) {
      newErrors.responseBody = 'Resposta deve ter pelo menos 10 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Post response mutation
  const responseMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('postFreshDeskResponse', {
        ticketId,
        response_body: responseBody.trim()
      });
      if (response.data?.error) {
        throw new Error(response.data.error || 'Erro ao enviar resposta');
      }
      return response.data;
    },
    onSuccess: () => {
       toast.success('✅ Resposta enviada com sucesso!');
       setResponseBody('');
       setErrors({});
       queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
     },
     onError: (error) => {
       toast.error('❌ Erro ao enviar: ' + (error.message || 'Tente novamente'));
     }
  });

  // Analyze ticket mutation
  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('analyzeTicketWithAI', { ticketId });
      if (response.data?.error) {
        throw new Error(response.data.error || 'Erro na análise IA');
      }
      return response.data;
    },
    onSuccess: () => {
       toast.success('✅ Análise IA concluída!');
       queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
     },
     onError: (error) => {
       toast.error('❌ Erro na análise: ' + (error.message || 'Tente novamente'));
     }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      base44.analytics.track?.({
        eventName: 'response_submitted',
        properties: { 
          ticketId,
          responseLength: responseBody.length
        }
      });
      responseMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
      </div>
    );
  }
  
  if (!ticket) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-400">Ticket não encontrado</p>
      </div>
    );
  }

  return (
    <>
      <Analytics 
        eventName="ticket_detail_view"
        properties={{ 
          ticketId,
          status: ticket?.status,
          priority: ticket?.priority
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl('Tickets'))}
          className="mb-6 gap-2"
          aria-label="Voltar para lista de tickets"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        {/* Ticket Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start gap-4 flex-col md:flex-row">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-3">{ticket.subject}</CardTitle>
                <p className="text-sm text-gray-600">
                  Cliente: {ticket.customer_name} ({ticket.customer_email})
                </p>
                <p className="text-sm text-gray-600">
                  Criado em: {format(new Date(ticket.created_date), 'PPP p', { locale: ptBR })}
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-orange-100 text-orange-800">{ticket.priority}</Badge>
                </div>
                <StatusUpdater ticket={ticket} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2 text-sm">Descrição</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
              </div>
              {/* Removed - now in separate panel */}
            </div>

            {ticket.ai_summary && (
              <div className="bg-turquoise-50 border border-turquoise-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-turquoise-900">Resumo da IA</h3>
                <p className="text-sm text-turquoise-800">{ticket.ai_summary}</p>
                <p className="text-xs text-turquoise-600 mt-2">
                  Sentimento: {ticket.ai_sentiment}
                </p>
              </div>
            )}

            {!ticket.ai_summary && (
              <Button
                onClick={() => analyzeMutation.mutate()}
                disabled={analyzeMutation.isPending}
                className="gap-2 w-full bg-turquoise-600 hover:bg-turquoise-700"
              >
                <Zap className="w-4 h-4" />
                {analyzeMutation.isPending ? 'Analisando...' : 'Analisar com IA'}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Agent Assignment */}
        <AgentAssignmentPanel ticket={ticket} />

        {/* Metadata Management */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TicketGroupUpdater ticket={ticket} />
          <TicketTypeUpdater ticket={ticket} />
          <TicketTagsUpdater ticket={ticket} />
        </div>

        {/* Time Tracker */}
        <TimeTracker ticketId={ticketId} />

        {/* Canned Responses */}
        <CannedResponsesPanel
          onSelectResponse={(content) => {
            setResponseBody(prev => (prev ? prev + '\n\n' + content : content));
          }}
        />

        {/* Response Panel with Conversations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Responder ao Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {ticket.ai_suggested_response && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <p className="text-sm text-green-800 dark:text-green-300 font-semibold mb-2">Resposta Sugerida pela IA:</p>
                      <p className="text-sm text-green-700 dark:text-green-400">{ticket.ai_suggested_response}</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setResponseBody(ticket.ai_suggested_response)}
                        className="mt-2"
                      >
                        Usar esta resposta
                      </Button>
                    </div>
                  )}

                <Textarea
                  placeholder="Digite sua resposta..."
                  value={responseBody}
                  onChange={(e) => {
                    setResponseBody(e.target.value);
                    if (errors.responseBody) setErrors({});
                  }}
                  className={`min-h-32 ${errors.responseBody ? 'border-red-500' : ''}`}
                  aria-label="Campo de resposta"
                  aria-describedby={errors.responseBody ? 'responseError' : undefined}
                />
                {errors.responseBody && (
                  <p id="responseError" className="text-red-600 text-sm">{errors.responseBody}</p>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={responseMutation.isPending || !responseBody.trim()}
                  className="w-full gap-2 bg-turquoise-600 hover:bg-turquoise-700 dark:bg-turquoise-700 dark:hover:bg-turquoise-600"
                >
                  <Send className="w-4 h-4" />
                  {responseMutation.isPending ? 'Enviando...' : 'Enviar Resposta'}
                </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <ResponsePanel 
                  ticketId={ticketId}
                  onResponseAdded={() => queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] })}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Response History */}
        <ResponseHistoryPaginated ticket={ticket} />

        {/* Contact Search Modal */}
        <ContactSearchModal 
          isOpen={showContactSearch}
          onClose={() => setShowContactSearch(false)}
          onSelectContact={(contact) => {
            // Handle contact selection if needed
            toast.success(`Contato selecionado: ${contact.name}`);
          }}
        />
      </div>
    </div>
    </>
  );
}