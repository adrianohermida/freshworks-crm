import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const STATUS_LABELS = {
  open: 'Aberto',
  pending: 'Pendente',
  resolved: 'Resolvido',
  closed: 'Fechado'
};

export default function StatusUpdater({ ticket, onSuccess }) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (newStatus) => {
      const response = await base44.functions.invoke('updateTicketStatus', {
        ticketId: ticket.id,
        status: newStatus
      });
      if (response.data?.error) {
        throw new Error(response.data.error);
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success('Status atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', ticket.id] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Erro ao atualizar: ' + (error.message || 'Tente novamente'));
    }
  });

  return (
    <Select
      value={ticket.status}
      onValueChange={(newStatus) => updateMutation.mutate(newStatus)}
      disabled={updateMutation.isPending}
    >
      <SelectTrigger className="w-full md:w-40">
        <SelectValue placeholder="Alterar status" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}