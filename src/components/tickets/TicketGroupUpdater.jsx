import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Loader } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TicketGroupUpdater({ ticket }) {
  const [selectedGroup, setSelectedGroup] = useState(ticket?.group_id?.toString() || '');
  const queryClient = useQueryClient();

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['ticketGroups'],
    queryFn: async () => {
      const response = await base44.functions.invoke('listTicketGroups', {});
      return response.data?.groups || [];
    }
  });

  const updateGroupMutation = useMutation({
    mutationFn: async (groupId) => {
      const response = await base44.functions.invoke('updateTicketGroup', {
        ticketId: ticket.freshdesk_id,
        groupId
      });
      if (response.data?.error) throw new Error(response.data.error);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Grupo atualizado!');
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    }
  });

  const handleGroupChange = (groupId) => {
    setSelectedGroup(groupId);
    updateGroupMutation.mutate(groupId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="w-4 h-4" /> Grupo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader className="w-4 h-4 animate-spin mr-2" />
            Carregando grupos...
          </div>
        ) : (
          <Select value={selectedGroup} onValueChange={handleGroupChange} disabled={updateGroupMutation.isPending}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um grupo" />
            </SelectTrigger>
            <SelectContent>
              {groups.map(g => (
                <SelectItem key={g.id} value={g.id.toString()}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardContent>
    </Card>
  );
}