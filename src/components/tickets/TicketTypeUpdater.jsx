import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TYPES = [
  { value: 'question', label: 'Pergunta' },
  { value: 'incident', label: 'Incidente' },
  { value: 'problem', label: 'Problema' },
  { value: 'feature_request', label: 'Solicitação de Recurso' }
];

export default function TicketTypeUpdater({ ticket }) {
  const [selectedType, setSelectedType] = useState(ticket?.type || '');
  const queryClient = useQueryClient();

  const updateTypeMutation = useMutation({
    mutationFn: async (type) => {
      const response = await base44.functions.invoke('updateTicketType', {
        ticketId: ticket.freshdesk_id,
        type
      });
      if (response.data?.error) throw new Error(response.data.error);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Tipo atualizado!');
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    }
  });

  const handleTypeChange = (type) => {
    setSelectedType(type);
    updateTypeMutation.mutate(type);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Tag className="w-4 h-4" /> Tipo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedType} onValueChange={handleTypeChange} disabled={updateTypeMutation.isPending}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um tipo" />
          </SelectTrigger>
          <SelectContent>
            {TYPES.map(t => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}