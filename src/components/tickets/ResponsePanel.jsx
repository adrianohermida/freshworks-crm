import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function ResponsePanel({ ticketId, onResponseAdded }) {
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: conversations = [], refetch } = useQuery({
    queryKey: ['conversations', ticketId],
    queryFn: async () => {
      const response = await base44.functions.invoke('getConversations', { 
        ticket_id: ticketId 
      });
      return response.data?.conversations || [];
    },
    enabled: !!ticketId
  });

  const handleAddResponse = async () => {
    if (!responseText.trim()) return;

    setLoading(true);
    try {
      const response = await base44.functions.invoke('addTicketResponse', {
        ticket_id: ticketId,
        body: responseText
      });

      if (response.data?.success) {
        toast.success('Resposta adicionada!');
        setResponseText('');
        refetch();
        onResponseAdded?.();
      } else {
        toast.error(response.data?.error || 'Erro ao adicionar resposta');
      }
    } catch (error) {
      toast.error('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Conversas</h3>

      <div className="max-h-60 overflow-y-auto space-y-3 bg-gray-50 dark:bg-slate-900 rounded-lg p-4">
        {conversations.length === 0 ? (
          <p className="text-center text-gray-500 py-4">Nenhuma conversa</p>
        ) : (
          conversations.map(conv => (
            <div key={conv.id} className="bg-white dark:bg-slate-800 rounded p-3">
              <p className="text-sm text-gray-800 dark:text-gray-200">{conv.body_text || conv.body}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(conv.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Digite sua resposta..."
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg"
          disabled={loading}
        />
        <Button
          onClick={handleAddResponse}
          disabled={loading || !responseText.trim()}
          className="gap-2"
        >
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Enviar
        </Button>
      </div>
    </div>
  );
}