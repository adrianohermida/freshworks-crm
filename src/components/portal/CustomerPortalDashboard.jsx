import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerPortalDashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        toast.error('Erro ao carregar usuário');
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const { data: config = {}, isLoading: configLoading } = useQuery({
    queryKey: ['portalConfig'],
    queryFn: async () => {
      const configs = await base44.entities.CustomerPortalConfig.list();
      return configs?.[0] || {};
    }
  });

  const { data: tickets = [], isLoading: ticketsLoading } = useQuery({
    queryKey: ['customerTickets', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      if (!user?.email) return [];
      return base44.entities.CustomerTicketView.filter({
        customer_email: user.email
      });
    }
  });

  const { data: kbArticles = [] } = useQuery({
    queryKey: ['portalKnowledgeBase'],
    queryFn: async () => {
      return base44.entities.KnowledgeBase.filter({ 
        is_published: true 
      });
    },
    enabled: config.enable_kb
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando portal...</p>
        </div>
      </div>
    );
  }

  const statusIcons = {
    open: <AlertCircle className="w-4 h-4 text-blue-600" />,
    in_progress: <Clock className="w-4 h-4 text-yellow-600" />,
    waiting_customer: <Clock className="w-4 h-4 text-orange-600" />,
    resolved: <CheckCircle2 className="w-4 h-4 text-green-600" />,
    closed: <CheckCircle2 className="w-4 h-4 text-gray-600" />
  };

  const statusLabels = {
    open: 'Aberto',
    in_progress: 'Em Progresso',
    waiting_customer: 'Aguardando você',
    resolved: 'Resolvido',
    closed: 'Fechado'
  };

  const statsByStatus = {
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    waiting_customer: tickets.filter(t => t.status === 'waiting_customer').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {config.logo_url && (
            <img src={config.logo_url} alt="Logo" className="h-12 mb-4" />
          )}
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Centro de Atendimento
          </h1>
          {config.welcome_message && (
            <p className="text-slate-600">{config.welcome_message}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-blue-600">{statsByStatus.open}</p>
              <p className="text-sm text-gray-600 mt-1">Abertos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-yellow-600">{statsByStatus.in_progress}</p>
              <p className="text-sm text-gray-600 mt-1">Em Progresso</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-orange-600">{statsByStatus.waiting_customer}</p>
              <p className="text-sm text-gray-600 mt-1">Aguardando você</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-green-600">{statsByStatus.resolved}</p>
              <p className="text-sm text-gray-600 mt-1">Resolvidos</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tickets">Meus Tickets</TabsTrigger>
            {config.enable_kb && <TabsTrigger value="knowledge">Base de Conhecimento</TabsTrigger>}
            {config.enable_ticket_creation && <TabsTrigger value="create">Novo Ticket</TabsTrigger>}
          </TabsList>

          {/* My Tickets */}
          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>Meus Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                {ticketsLoading ? (
                  <p className="text-center text-gray-500 py-8">Carregando tickets...</p>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Você ainda não criou nenhum ticket</p>
                    {config.enable_ticket_creation && (
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Primeiro Ticket
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tickets.map(ticket => (
                      <div
                        key={ticket.id}
                        className="border rounded-lg p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 mb-1">
                              {ticket.subject}
                            </h3>
                            <p className="text-sm text-gray-600">
                              #{ticket.ticket_id?.slice(0, 8)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {statusIcons[ticket.status]}
                            <Badge variant="outline">
                              {statusLabels[ticket.status]}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600 mt-3">
                          <span>
                            {ticket.response_count} resposta{ticket.response_count !== 1 ? 's' : ''}
                          </span>
                          {ticket.last_response && (
                            <span>
                              Última atualização: {new Date(ticket.last_response).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knowledge Base */}
          {config.enable_kb && (
            <TabsContent value="knowledge">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kbArticles.length === 0 ? (
                  <p className="text-gray-500 py-8">Nenhum artigo disponível</p>
                ) : (
                  kbArticles.map(article => (
                    <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="pt-6">
                        <h3 className="font-semibold text-slate-900 mb-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {article.content}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{article.category}</span>
                          <span className="flex gap-1">
                            👍 {article.helpful_count || 0}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          )}

          {/* Create Ticket */}
          {config.enable_ticket_creation && (
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Criar Novo Ticket</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-500 py-8">
                    Funcionalidade de criação de tickets em breve
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}