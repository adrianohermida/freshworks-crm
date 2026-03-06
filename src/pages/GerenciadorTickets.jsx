import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Clock, AlertTriangle, Lock, MessageSquare, Plus, Search, Loader2 } from 'lucide-react';
import { useToast, ToastContainer } from '@/components/notifications/Toast';
import { TicketsLoadingState } from '@/components/freshdesk/TicketLoadingStates';

export default function GerenciadorTickets() {
  const queryClient = useQueryClient();
  const { toasts, addToast, removeToast } = useToast();
  const [filtroStatus, setFiltroStatus] = useState('aberto');
  const [busca, setBusca] = useState('');

  // Listar tickets
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets', filtroStatus],
    queryFn: async () => {
      const res = await base44.entities.Ticket.filter({
        status: filtroStatus !== 'todos' ? filtroStatus : undefined
      });
      return res;
    },
    staleTime: 30000
  });

  // Atualizar status
  const updateMutation = useMutation({
    mutationFn: async ({ id, novoStatus }) => {
      return base44.entities.Ticket.update(id, { status: novoStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      addToast('Status atualizado com sucesso', 'success');
    },
    onError: (err) => {
      addToast('Erro ao atualizar status', 'error');
    }
  });

  const statusConfig = {
    aberto: { label: 'Aberto', icon: AlertTriangle, color: 'bg-red-100 text-red-800' },
    em_progresso: { label: 'Em Progresso', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
    resolvido: { label: 'Resolvido', icon: CheckCircle2, color: 'bg-green-100 text-green-800' },
    fechado: { label: 'Fechado', icon: Lock, color: 'bg-gray-100 text-gray-800' }
  };

  const ticketsFiltrados = tickets.filter(t => 
    t.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    t.solicitanteEmail.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold dark:text-white">Gerenciador de Tickets</h1>
        <p className="text-gray-600 dark:text-gray-400">Gerencie todos os tickets de suporte</p>
      </div>

      {/* Filtros */}
      <Card className="dark:bg-slate-900 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg dark:text-white">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {['todos', 'aberto', 'em_progresso', 'resolvido', 'fechado'].map(status => (
              <Button
                key={status}
                onClick={() => setFiltroStatus(status)}
                variant={filtroStatus === status ? 'default' : 'outline'}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </Button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" aria-hidden="true" />
            <Input
              placeholder="Buscar por título ou email..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
              aria-label="Buscar tickets"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Tickets */}
      <Card className="dark:bg-slate-900 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="dark:text-white">Tickets ({ticketsFiltrados.length})</CardTitle>
            <CardDescription className="dark:text-gray-400">Todos os tickets de suporte</CardDescription>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Ticket
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TicketsLoadingState count={3} />
          ) : ticketsFiltrados.length === 0 ? (
            <Alert>
              <AlertDescription>Nenhum ticket encontrado</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3" data-testid="tickets-list">
              {ticketsFiltrados.map(ticket => {
                const config = statusConfig[ticket.status];
                const Icon = config?.icon;

                return (
                  <div
                    key={ticket.id}
                    className="border dark:border-slate-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                    data-testid="ticket-item"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg dark:text-white">{ticket.titulo}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {ticket.solicitanteEmail}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Badge variant="outline">{ticket.categoria}</Badge>
                          <Badge
                            className={config?.color}
                          >
                            {config?.label}
                          </Badge>
                          {ticket.prioridade && (
                            <Badge variant="secondary">{ticket.prioridade}</Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-gray-500">
                          {new Date(ticket.dataCriacao).toLocaleDateString()}
                        </span>
                        <select
                           value={ticket.status}
                           onChange={(e) => updateMutation.mutate({ id: ticket.id, novoStatus: e.target.value })}
                           className="px-3 py-1 text-sm border rounded dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                           data-testid="status-button"
                           aria-label="Alterar status do ticket"
                           disabled={updateMutation.isPending}
                         >
                          <option value="aberto">Aberto</option>
                          <option value="em_progresso">Em Progresso</option>
                          <option value="resolvido">Resolvido</option>
                          <option value="fechado">Fechado</option>
                        </select>
                      </div>
                    </div>

                    {ticket.agenteeNome && (
                      <p className="text-xs text-gray-500 mt-2">
                        Agente: {ticket.agenteeNome}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Abertos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {tickets.filter(t => t.status === 'aberto').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">
              {tickets.filter(t => t.status === 'em_progresso').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolvidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {tickets.filter(t => t.status === 'resolvido').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {tickets.length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}