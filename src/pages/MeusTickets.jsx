import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Plus, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ModuleHeader from "@/components/cliente/ModuleHeader";
import TicketCardCliente from "@/components/cliente/TicketCardCliente";
import TicketsEmptyState from "@/components/cliente/TicketsEmptyState";
import TicketFiltrosCliente from "@/components/cliente/TicketFiltrosCliente";
import NovoTicketModal from "@/components/cliente/NovoTicketModal";
import PersistentCTABanner from "@/components/cliente/PersistentCTABanner";
import ResumeLoader from "@/components/common/ResumeLoader";

export default function MeusTickets() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [statusFiltro, setStatusFiltro] = useState('todos');

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const list = await base44.entities.Escritorio.list();
      return list[0];
    }
  });

  const { data: tickets = [], isLoading: loadingTickets, refetch: refetchTickets } = useQuery({
    queryKey: ['meus-tickets', user?.email, escritorio?.id, statusFiltro],
    queryFn: async () => {
      if (!user || !escritorio?.id) return [];
      const result = await base44.entities.Ticket.filter({ 
        escritorio_id: escritorio.id,
        cliente_email: user.email,
        ...(statusFiltro !== 'todos' && { status: statusFiltro })
      });
      return result.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    enabled: !!user && !!escritorio?.id
  });

  if (loadingUser) return <ResumeLoader />;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <PersistentCTABanner />
      
      <ModuleHeader
        title="Suporte ao Cliente"
        breadcrumbItems={[
          { label: 'Painel', url: createPageUrl('MeuPainel') },
          { label: 'Tickets' }
        ]}
        icon={MessageSquare}
        action={
          <Button 
            onClick={() => setModalOpen(true)}
            className="bg-[var(--brand-primary)] w-full sm:w-auto"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Chamado
          </Button>
        }
      />

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-6 pb-32 md:pb-6 space-y-6">

        {/* Filtros */}
        <div>
          <TicketFiltrosCliente statusFiltro={statusFiltro} onStatusChange={setStatusFiltro} />
        </div>

        {/* Tickets Grid */}
        {loadingTickets ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-40 md:h-48 w-full" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <TicketsEmptyState onNovoChamado={() => setModalOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {tickets.map((ticket) => (
              <TicketCardCliente 
                key={ticket.id} 
                ticket={ticket} 
              />
            ))}
          </div>
        )}
      </div>

      <NovoTicketModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          refetchTickets();
        }}
        user={user}
        escritorioId={escritorio?.id}
      />
    </div>
  );
}