import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';

export default function DeleteTicketDialog({ isOpen, ticket, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const response = await base44.functions.invoke('deleteTicket', {
        freshdesk_id: ticket.freshdesk_id || ticket.id
      });

      if (response.data?.success) {
        toast.success('Ticket deletado com sucesso!');
        onSuccess?.();
        onClose?.();
      } else {
        toast.error(response.data?.error || 'Erro ao deletar ticket');
      }
    } catch (error) {
      toast.error('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-bold">Deletar Ticket</h2>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Tem certeza que deseja deletar este ticket? Esta ação não pode ser desfeita.
        </p>

        <p className="text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded mb-6">
          <strong>Assunto:</strong> {ticket.subject}
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
            Deletar
          </Button>
        </div>
      </div>
    </div>
  );
}