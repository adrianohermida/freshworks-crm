import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import DeadlineCard from '../components/deadlines/DeadlineCard';
import DeadlineDialog from '../components/deadlines/DeadlineDialog';

export default function DeadlinesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const queryClient = useQueryClient();

  // Fetch deadlines
  const { data: deadlines, isLoading } = useQuery({
    queryKey: ['deadlines'],
    queryFn: async () => {
      const result = await base44.entities.Deadline.list('-deadline_date');
      return result || [];
    },
    initialData: [],
  });

  // Create deadline mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const created = await base44.entities.Deadline.create(data);
      // Sync new deadline to Google Calendar
      try {
        await base44.functions.invoke('syncDeadlineToGoogleCalendar', {
          deadline_id: created.id,
          action: 'create',
        });
      } catch (err) {
        console.error('Erro ao sincronizar com Google Calendar:', err);
      }
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadlines'] });
      setIsDialogOpen(false);
    },
  });

  // Update deadline mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Deadline.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadlines'] });
      setIsDialogOpen(false);
      setEditingDeadline(null);
    },
  });

  // Delete deadline mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      // Get deadline before deletion to get calendar event ID
      const deadline = deadlines.find((d) => d.id === id);
      if (deadline?.calendar_event_id) {
        try {
          await base44.functions.invoke('syncDeadlineToGoogleCalendar', {
            deadline_id: id,
            action: 'delete',
          });
        } catch (err) {
          console.error('Erro ao deletar evento do Google Calendar:', err);
        }
      }
      return base44.entities.Deadline.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadlines'] });
    },
  });

  // Handle save
  const handleSave = async (data) => {
    if (editingDeadline) {
      updateMutation.mutate({ id: editingDeadline.id, data });
      // Sync updated deadline to Google Calendar
      try {
        await base44.functions.invoke('syncDeadlineToGoogleCalendar', {
          deadline_id: editingDeadline.id,
          action: 'update',
        });
      } catch (err) {
        console.error('Erro ao sincronizar com Google Calendar:', err);
      }
    } else {
      createMutation.mutate(data);
    }
  };

  // Handle edit
  const handleEdit = (deadline) => {
    setEditingDeadline(deadline);
    setIsDialogOpen(true);
  };

  // Handle complete
  const handleComplete = (deadline) => {
    updateMutation.mutate({
      id: deadline.id,
      data: { ...deadline, status: 'completed', completed_date: new Date().toISOString().split('T')[0] },
    });
  };

  // Filter and sort deadlines
  const filteredDeadlines = useMemo(() => {
    let filtered = deadlines;

    if (filterStatus !== 'all') {
      filtered = filtered.filter((d) => d.status === filterStatus);
    }

    // Sort
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.deadline_date) - new Date(b.deadline_date));
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    return filtered;
  }, [deadlines, filterStatus, sortBy]);

  // Calculate stats
  const stats = {
    total: deadlines.length,
    pending: deadlines.filter((d) => d.status === 'pending').length,
    overdue: deadlines.filter((d) => d.status === 'overdue').length,
    completed: deadlines.filter((d) => d.status === 'completed').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-600">Carregando prazos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Prazos e Deadlines</h1>
          <p className="text-gray-600">Gerencie todos os seus prazos processuais em um único lugar</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-gray-600 text-sm font-medium">Total de Prazos</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200 bg-blue-50">
            <p className="text-blue-600 text-sm font-medium">Pendentes</p>
            <p className="text-3xl font-bold text-blue-900 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-red-200 bg-red-50">
            <p className="text-red-600 text-sm font-medium">Vencidos</p>
            <p className="text-3xl font-bold text-red-900 mt-1">{stats.overdue}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200 bg-green-50">
            <p className="text-green-600 text-sm font-medium">Completos</p>
            <p className="text-3xl font-bold text-green-900 mt-1">{stats.completed}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-4 w-full sm:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendentes</option>
              <option value="alert">Alerta</option>
              <option value="overdue">Vencidos</option>
              <option value="completed">Completos</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Ordenar por Data</option>
              <option value="priority">Ordenar por Prioridade</option>
            </select>
          </div>

          <button
            onClick={() => {
              setEditingDeadline(null);
              setIsDialogOpen(true);
            }}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Novo Prazo
          </button>
        </div>

        {/* Deadlines List */}
        <div className="space-y-4">
          {filteredDeadlines.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">
                {filterStatus === 'all' ? 'Nenhum prazo cadastrado' : 'Nenhum prazo encontrado com este filtro'}
              </p>
              <button
                onClick={() => {
                  setEditingDeadline(null);
                  setIsDialogOpen(true);
                }}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Criar primeiro prazo →
              </button>
            </div>
          ) : (
            filteredDeadlines.map((deadline) => (
              <DeadlineCard
                key={deadline.id}
                deadline={deadline}
                onEdit={handleEdit}
                onDelete={(id) => deleteMutation.mutate(id)}
                onComplete={handleComplete}
              />
            ))
          )}
        </div>
      </div>

      {/* Dialog */}
      <DeadlineDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingDeadline(null);
        }}
        onSave={handleSave}
        deadline={editingDeadline}
      />
    </div>
  );
}