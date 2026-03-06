import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, User } from 'lucide-react';
import { toast } from 'sonner';
import AgentSelect from './AgentSelect';

export default function AgentAssignmentPanel({ ticket, onAssignmentChange }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(ticket.assigned_agent_id || '');

  const assignMutation = useMutation({
    mutationFn: async (agentId) => {
      // Update in Base44 (this would normally call a backend function)
      // For now, we update locally and sync with Freshdesk via the ticket update
      await base44.entities.Ticket.update(ticket.id, {
        assigned_agent_id: agentId || null,
        last_sync: new Date().toISOString()
      });
      return true;
    },
    onSuccess: () => {
      toast.success('Agente atribuído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', ticket.id] });
      setIsEditing(false);
      onAssignmentChange?.();
    },
    onError: (error) => {
      toast.error('Erro ao atribuir: ' + (error.message || 'Tente novamente'));
    }
  });

  const handleAssign = async () => {
    await assignMutation.mutateAsync(selectedAgentId);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Atribuição
        </CardTitle>
        {!isEditing && ticket.assigned_agent_name && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            Alterar
          </Button>
        )}
      </CardHeader>
      
      <CardContent>
        {!isEditing ? (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            {ticket.assigned_agent_name ? (
              <p className="text-sm">{ticket.assigned_agent_name}</p>
            ) : (
              <p className="text-sm text-gray-500">Não atribuído</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <AgentSelect
              value={selectedAgentId}
              onChange={setSelectedAgentId}
              disabled={assignMutation.isPending}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAssign}
                disabled={assignMutation.isPending}
                className="bg-turquoise-600 hover:bg-turquoise-700"
              >
                {assignMutation.isPending ? 'Atribuindo...' : 'Atribuir'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedAgentId(ticket.assigned_agent_id || '');
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}