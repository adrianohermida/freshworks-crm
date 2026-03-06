import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertCircle, Plus } from 'lucide-react';

import TicketCard from '../components/tickets/TicketCard';
import BulkActionBar from '../components/tickets/BulkActionBar';
import AdvancedBulkActions from '../components/tickets/AdvancedBulkActions';
import AdvancedSearch from '../components/tickets/AdvancedSearch';
import TicketHeader from '../components/tickets/TicketHeader';
import FilterBar from '../components/tickets/FilterBar';
import TicketGrid from '../components/tickets/TicketGrid';
import BulkTicketUpdater from '../components/tickets/BulkTicketUpdater';
import TicketSorting from '../components/tickets/TicketSorting';
import AdvancedFilterPanel from '../components/tickets/AdvancedFilterPanel';
import ExportCSVButton from '../components/tickets/ExportCSVButton';
import PageLayout from '../components/common/PageLayout';
import Analytics from '../components/Analytics';
import CreateTicketModal from '../components/tickets/CreateTicketModal';
import EditTicketModal from '../components/tickets/EditTicketModal';
import DeleteTicketDialog from '../components/tickets/DeleteTicketDialog';
import TicketPagination from '../components/tickets/TicketPagination';
import { useAutoRefresh } from '../components/hooks/useAutoRefresh';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 20;

function useTickets() {
  const queryClient = useQueryClient();
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      try {
         return await base44.entities.Ticket.list();
       } catch (error) {
         console.error('Erro ao carregar tickets:', error);
         toast.error('❌ Erro ao carregar tickets');
         return [];
       }
    },
    initialData: [],
    refetchInterval: 30000,
    staleTime: 10000
  });
  const syncMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('syncFreshDeskTickets');
      if (response.data?.error) {
        throw new Error(response.data.error);
      }
      return response.data;
    },
    onSuccess: (data) => {
       toast.success(`✅ Sincronizado: ${data.synced || 0} de ${data.total || 0} tickets`);
       queryClient.invalidateQueries({ queryKey: ['tickets'] });
     },
     onError: (error) => {
       toast.error('❌ Erro ao sincronizar: ' + (error.message || 'Tente novamente'));
     }
  });
  const analyzeMutation = useMutation({
    mutationFn: async (ticketId) => {
      const response = await base44.functions.invoke('analyzeTicketWithAI', { ticketId });
      if (response.data?.error) {
        throw new Error(response.data.error);
      }
      return response.data;
    },
    onSuccess: () => {
       toast.success('✅ Análise IA concluída!');
       queryClient.invalidateQueries({ queryKey: ['tickets'] });
     },
     onError: (error) => {
       toast.error('❌ Erro na análise: ' + (error.message || 'Tente novamente'));
     }
  });
  return { tickets, isLoadingTickets: isLoading, syncMutation, analyzeMutation };
}

export default function TicketsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [advancedFiltered, setAdvancedFiltered] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editTicket, setEditTicket] = useState(null);
  const [deleteTicket, setDeleteTicket] = useState(null);
  const [groups, setGroups] = useState([]);
  const [sortField, setSortField] = useState('created_date');
  const [sortDir, setSortDir] = useState('desc');
  const [showAdvFilters, setShowAdvFilters] = useState(false);
  const [advFilters, setAdvFilters] = useState(null);
  const queryClient = useQueryClient();
  const { tickets, isLoadingTickets, syncMutation, analyzeMutation } = useTickets();

  // Load groups on mount
  React.useEffect(() => {
    const loadGroups = async () => {
      try {
        const response = await base44.functions.invoke('listTicketGroups', {});
        if (response.data?.groups) {
          setGroups(response.data.groups);
        }
      } catch (error) {
        console.error('Erro ao carregar grupos:', error);
      }
    };
    loadGroups();
  }, []);

  // Auto-refresh tickets every 30 seconds
  useAutoRefresh(['tickets'], 30000, true);

  const toggleSelectTicket = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredTickets.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTickets.map(t => t.id)));
    }
  };

  // Track page view
  React.useEffect(() => {
    base44.analytics.track?.({
      eventName: 'tickets_page_view',
      properties: { timestamp: new Date().toISOString() }
    });
  }, []);

  // Filter tickets
  const baseFiltered = tickets.filter(ticket => {
    const matchSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  // Apply advanced filters
  let allFiltered = advancedFiltered || baseFiltered;
  if (advFilters) {
    allFiltered = allFiltered.filter(t => {
      if (advFilters.groups?.length > 0 && !advFilters.groups.includes(t.group_id)) return false;
      if (advFilters.types?.length > 0 && !advFilters.types.includes(t.type)) return false;
      if (advFilters.tags?.length > 0 && !advFilters.tags.some(tag => t.tags?.includes(tag))) return false;
      if (advFilters.slaProblem !== null) {
        const isOverdue = t.due_by && new Date(t.due_by) < new Date();
        if (advFilters.slaProblem && !isOverdue) return false;
        if (!advFilters.slaProblem && isOverdue) return false;
      }
      return true;
    });
  }

  // Sort tickets
  const sortedTickets = [...allFiltered].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (sortField === 'priority') {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      aVal = priorityOrder[aVal] || 999;
      bVal = priorityOrder[bVal] || 999;
    } else if (sortField === 'status') {
      const statusOrder = { open: 0, pending: 1, resolved: 2, closed: 3 };
      aVal = statusOrder[aVal] || 999;
      bVal = statusOrder[bVal] || 999;
    } else if (sortField === 'created_date' || sortField === 'updated_date') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }

    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedTickets.length / PAGE_SIZE);
  const filteredTickets = sortedTickets.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset to page 1 when filters change
  React.useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter, priorityFilter, advancedFiltered]);

  if (!tickets || tickets.length === 0) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-96">
          <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Nenhum ticket disponível</h2>
          <p className="text-gray-600 mb-6">Sincronize seus tickets do Freshdesk</p>
          <div className="flex gap-3">
            <button
                onClick={() => syncMutation.mutate()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Sincronizar Agora
              </button>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Novo Ticket
            </button>
          </div>
        </div>
        <CreateTicketModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['tickets'] })}
        />
      </PageLayout>
    );
  }

  return (
    <>
      <Analytics 
        eventName="tickets_page_rendered"
        properties={{ 
          ticketCount: tickets.length,
          filteredCount: filteredTickets.length 
        }}
      />
      <PageLayout>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tickets</h1>
            <p className="text-gray-600">Gerencie todos os seus tickets Freshdesk</p>
          </div>
          <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Novo Ticket
          </Button>
        </div>

        <TicketHeader
          isSyncing={syncMutation.isPending}
          onSync={() => syncMutation.mutate()}
        />

        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          onAdvancedSearch={
            <AdvancedSearch
              tickets={baseFiltered}
              onFilterChange={(filtered) => {
                setAdvancedFiltered(filtered);
                setSelectedIds(new Set());
              }}
            />
          }
          selectedCount={selectedIds.size}
          onToggleSelectAll={toggleSelectAll}
          filteredCount={filteredTickets.length}
        />

        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <TicketSorting
            sortField={sortField}
            sortDir={sortDir}
            onSort={({ field, direction }) => {
              setSortField(field);
              setSortDir(direction);
            }}
          />
          <div className="flex gap-2">
            <ExportCSVButton />
            <Button
              variant={showAdvFilters ? 'default' : 'outline'}
              onClick={() => setShowAdvFilters(!showAdvFilters)}
            >
              {showAdvFilters ? 'Fechar Filtros' : 'Filtros Avançados'}
            </Button>
          </div>
        </div>

        {showAdvFilters && (
          <AdvancedFilterPanel
            groups={groups}
            tags={tickets.flatMap(t => t.tags || [])}
            onFilter={setAdvFilters}
            onClose={() => setShowAdvFilters(false)}
          />
        )}

        <div className="space-y-4">
          {filteredTickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              isSelected={selectedIds.has(ticket.id)}
              onToggleSelect={() => toggleSelectTicket(ticket.id)}
              onAnalyze={() => analyzeMutation.mutate(ticket.id)}
              onEdit={() => setEditTicket(ticket)}
              onDelete={() => setDeleteTicket(ticket)}
            />
          ))}
          {filteredTickets.length === 0 && !isLoadingTickets && (
            <div className="text-center py-8 text-gray-500">
              Nenhum ticket encontrado com os filtros selecionados
            </div>
          )}
        </div>

        <TicketPagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={sortedTickets.length}
          pageSize={PAGE_SIZE}
        />

        {selectedIds.size > 0 && (
          <div className="space-y-4">
            <BulkActionBar
              selectedCount={selectedIds.size}
              selectedIds={Array.from(selectedIds)}
              onClear={() => setSelectedIds(new Set())}
              onSuccess={() => setSelectedIds(new Set())}
            />
            <BulkTicketUpdater
              selectedIds={Array.from(selectedIds)}
              groups={groups}
              onSuccess={() => {
                setSelectedIds(new Set());
                queryClient.invalidateQueries({ queryKey: ['tickets'] });
              }}
            />
            <AdvancedBulkActions
              selectedTickets={Array.from(selectedIds)}
              onComplete={() => setSelectedIds(new Set())}
            />
          </div>
        )}

        <CreateTicketModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['tickets'] })}
        />

        {editTicket && (
          <EditTicketModal
            isOpen={!!editTicket}
            ticket={editTicket}
            onClose={() => setEditTicket(null)}
            onSuccess={() => queryClient.invalidateQueries({ queryKey: ['tickets'] })}
          />
        )}

        {deleteTicket && (
          <DeleteTicketDialog
            isOpen={!!deleteTicket}
            ticket={deleteTicket}
            onClose={() => setDeleteTicket(null)}
            onSuccess={() => queryClient.invalidateQueries({ queryKey: ['tickets'] })}
          />
        )}
      </PageLayout>
    </>
  );
}