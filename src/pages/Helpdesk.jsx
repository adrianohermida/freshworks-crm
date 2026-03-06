import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Mail, BarChart3 } from 'lucide-react';
import ResumeLoader from '@/components/common/ResumeLoader';
import HelpdeskErrorBoundary from '@/components/helpdesk/HelpdeskErrorBoundary';

const HelpdeskTicketPanel = React.lazy(() => import('@/components/helpdesk/ticket/HelpdeskTicketPanel'));
const HelpdeskTicketList = React.lazy(() => import('@/components/helpdesk/inbox/HelpdeskTicketList'));
const EmailInboxList = React.lazy(() => import('@/components/email/EmailInboxList'));
const EmailThreadView = React.lazy(() => import('@/components/email/EmailThreadView'));
const HelpdeskAnalyticsDashboard = React.lazy(() => import('@/components/helpdesk/analytics/HelpdeskAnalyticsDashboard'));

export default function Helpdesk() {
  const [tab, setTab] = useState('tickets');
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [contaSelecionada, setContaSelecionada] = useState('contato');

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
    enabled: !!user,
  });

  const { data: tickets = [] } = useQuery({
    queryKey: ['tickets-helpdesk', escritorio?.[0]?.id],
    queryFn: () => escritorio?.[0]?.id 
      ? base44.entities.Ticket.filter({ escritorio_id: escritorio[0].id }, '-created_date', 100)
      : Promise.resolve([]),
    enabled: !!escritorio?.[0]?.id,
  });

  const { data: emails = [] } = useQuery({
    queryKey: ['emails-helpdesk', escritorio?.[0]?.id, contaSelecionada],
    queryFn: () => escritorio?.[0]?.id
      ? base44.entities.EmailRecebido.filter({ escritorio_id: escritorio[0].id }, '-data_recebimento', 100)
      : Promise.resolve([]),
    enabled: !!escritorio?.[0]?.id,
  });

  const { data: conversas = [] } = useQuery({
    queryKey: ['conversas-helpdesk', escritorio?.[0]?.id],
    queryFn: () => escritorio?.[0]?.id
      ? base44.entities.Conversa.filter({ escritorio_id: escritorio[0].id }, '-ultima_atualizacao', 100)
      : Promise.resolve([]),
    enabled: !!escritorio?.[0]?.id,
  });

  // Real-time sync
  React.useEffect(() => {
    if (!escritorio?.[0]?.id) return;
    
    const unsubTickets = base44.entities.Ticket.subscribe(() => {
      // Refetch will happen automatically via query invalidation if needed
    });
    const unsubEmails = base44.entities.EmailRecebido.subscribe(() => {});
    const unsubConversas = base44.entities.Conversa.subscribe(() => {});

    return () => {
      unsubTickets?.();
      unsubEmails?.();
      unsubConversas?.();
    };
  }, [escritorio?.[0]?.id]);

  if (loadingUser) return <ResumeLoader />;

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--text-secondary)]">Acesso restrito a administradores</p>
        </div>
      </div>
    );
  }

  const stats = {
    tickets: tickets.filter(t => ['aberto', 'triagem'].includes(t.status)).length,
    emails: emails.filter(e => ['novo', 'lido'].includes(e.status)).length,
  };

  return (
    <HelpdeskErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-secondary)]">
        {/* Header */}
        <div className="bg-[var(--bg-elevated)] border-b border-[var(--border-primary)] p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)]">Helpdesk</h1>
            <p className="text-xs lg:text-sm text-[var(--text-secondary)]">Gerenciar tickets e emails</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto">
          <Tabs value={tab} onValueChange={setTab} className="p-4 lg:p-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-3">
            <TabsTrigger value="tickets" className="flex items-center gap-2 text-xs lg:text-sm">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Tickets</span>
              <span className="sm:hidden">{stats.tickets}</span>
              <span className="hidden sm:inline">({stats.tickets})</span>
            </TabsTrigger>
            <TabsTrigger value="emails" className="flex items-center gap-2 text-xs lg:text-sm">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Emails</span>
              <span className="sm:hidden">{stats.emails}</span>
              <span className="hidden sm:inline">({stats.emails})</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 text-xs lg:text-sm">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-2 lg:gap-4 mt-4 h-[calc(100vh-250px)]">
            <React.Suspense fallback={<div className="h-12 bg-gray-200 rounded animate-pulse" />}>
              <HelpdeskTicketList
                filtros={{ status: 'aberto,triagem' }}
                escritorioId={escritorio?.[0]?.id}
                itemSelecionado={itemSelecionado}
                onSelectItem={setItemSelecionado}
              />
            </React.Suspense>
            {itemSelecionado && (
              <React.Suspense fallback={<div className="h-12 bg-gray-200 rounded animate-pulse" />}>
                <HelpdeskTicketPanel
                  ticket={itemSelecionado}
                  onClose={() => setItemSelecionado(null)}
                />
              </React.Suspense>
            )}
          </TabsContent>

          {/* Emails Tab */}
          <TabsContent value="emails" className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-2 lg:gap-4 mt-4 h-[calc(100vh-250px)]">
            <React.Suspense fallback={<div className="h-12 bg-gray-200 rounded animate-pulse" />}>
              <EmailInboxList
                emails={emails}
                itemSelecionado={itemSelecionado}
                onSelectItem={setItemSelecionado}
              />
            </React.Suspense>
            {itemSelecionado && (
              <React.Suspense fallback={<div className="h-12 bg-gray-200 rounded animate-pulse" />}>
                <EmailThreadView
                  email={itemSelecionado}
                  user={user}
                  escritorioId={escritorio?.[0]?.id}
                  contaSelecionada={contaSelecionada}
                  onClose={() => setItemSelecionado(null)}
                />
              </React.Suspense>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="h-[calc(100vh-250px)]">
            <React.Suspense fallback={<div className="h-12 bg-gray-200 rounded animate-pulse" />}>
              <HelpdeskAnalyticsDashboard
                escritorioId={escritorio?.[0]?.id}
              />
            </React.Suspense>
          </TabsContent>
          </Tabs>
          </div>
          </div>
    </HelpdeskErrorBoundary>
  );
}