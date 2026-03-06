import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function BulkActionBar({ selectedCount, selectedIds, onClear, onSuccess }) {
   const [bulkStatus, setBulkStatus] = useState('');
  const queryClient = useQueryClient();

  const bulkMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('bulkUpdateTicketStatus', {
        ticketIds: selectedIds,
        newStatus: bulkStatus
      });
      if (response.data?.error) {
        throw new Error(response.data.error);
      }
      return response.data;
    },
    onSuccess: (data) => {
       if (data.updated > 0) {
         toast.success(`✅ ${data.updated} ticket(s) atualizado(s) com sucesso!`);
       }
       if (data.errors?.length > 0) {
         toast.error(`⚠️ ${data.errors.length} erro(s) na atualização`);
       }
       queryClient.invalidateQueries({ queryKey: ['tickets'] });
       onSuccess?.();
       onClear();
       setBulkStatus('');
     },
     onError: (error) => {
       toast.error('❌ Erro ao atualizar: ' + (error.message || 'Tente novamente'));
     }
  });

  const handleApply = () => {
    if (!bulkStatus) {
      toast.error('Selecione um status');
      return;
    }
    bulkMutation.mutate();
  };

  return (
    <div className="fixed bottom-6 left-6 right-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-4 flex items-center justify-between gap-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 flex-1">
        <span className="text-sm font-medium">{selectedCount} selecionados</span>
        <Select value={bulkStatus} onValueChange={setBulkStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Novo status..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Aberto</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="resolved">Resolvido</SelectItem>
            <SelectItem value="closed">Fechado</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={handleApply}
          disabled={!bulkStatus || bulkMutation.isPending}
          className="bg-turquoise-600 hover:bg-turquoise-700 gap-2"
        >
          <Zap className="w-4 h-4" />
          {bulkMutation.isPending ? 'Atualizando...' : 'Aplicar'}
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClear}
        disabled={bulkMutation.isPending}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}