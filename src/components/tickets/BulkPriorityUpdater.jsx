import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function BulkPriorityUpdater({ ticketIds, onSuccess, onCancel }) {
  const queryClient = useQueryClient();
  const [newPriority, setNewPriority] = useState('');

  const updateMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('bulkUpdateTicketsPriority', {
        ticket_ids: ticketIds,
        new_priority: newPriority
      });
      if (response.data?.error) throw new Error(response.data.error);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(
        `${data.summary.successful}/${data.summary.total} tickets atualizados com sucesso!`
      );
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Erro ao atualizar prioridades: ' + error.message);
    }
  });

  const handleSubmit = () => {
    if (!newPriority) {
      toast.error('Selecione uma prioridade');
      return;
    }
    updateMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atualizar Prioridade em Massa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            Você está prestes a atualizar a prioridade de <strong>{ticketIds.length} ticket(s)</strong>
          </p>
        </div>

        <Select value={newPriority} onValueChange={setNewPriority}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione nova prioridade..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Baixa</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="urgent">Urgente</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onCancel} disabled={updateMutation.isPending}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!newPriority || updateMutation.isPending}
            className="gap-2"
          >
            {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Atualizar {ticketIds.length} Ticket(s)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}