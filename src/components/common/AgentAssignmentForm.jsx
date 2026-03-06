import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function AgentAssignmentForm({ ticketId, onAssignSuccess, onCancel }) {
  const queryClient = useQueryClient();
  const [selectedAgent, setSelectedAgent] = useState('');

  const { data: agents, isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await base44.functions.invoke('listAgents', { per_page: 100 });
      return response.data;
    }
  });

  const assignMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('updateTicket', {
        ticket_id: ticketId,
        assigned_agent_id: selectedAgent
      });
      if (response.data?.error) throw new Error(response.data.error);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Agente atribuído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['tickets', ticketId] });
      onAssignSuccess?.();
    },
    onError: (error) => {
      toast.error('Erro ao atribuir agente: ' + error.message);
    }
  });

  const handleAssign = () => {
    if (!selectedAgent) {
      toast.error('Selecione um agente');
      return;
    }
    assignMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Atribuir Agente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um agente..." />
              </SelectTrigger>
              <SelectContent>
                {(agents?.agents || []).map(agent => (
                  <SelectItem key={agent.freshdesk_id} value={agent.freshdesk_id}>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        agent.availability_status === 'available' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      {agent.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="bg-blue-50 p-3 rounded text-sm text-blue-700">
              {agents?.agents?.find(a => a.freshdesk_id === selectedAgent)?.email && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {agents.agents.find(a => a.freshdesk_id === selectedAgent)?.email}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={onCancel} disabled={assignMutation.isPending}>
                Cancelar
              </Button>
              <Button onClick={handleAssign} disabled={!selectedAgent || assignMutation.isPending}>
                {assignMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Atribuir
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}