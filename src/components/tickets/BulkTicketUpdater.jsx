import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const TYPES = [
  { value: 'incident', label: 'Incident' },
  { value: 'problem', label: 'Problem' },
  { value: 'feature_request', label: 'Feature Request' },
  { value: 'lead', label: 'Lead' }
];

export default function BulkTicketUpdater({ selectedIds, groups, onSuccess }) {
  const [operation, setOperation] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [tags, setTags] = useState('');
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async () => {
      let payload = { ticketIds: selectedIds };

      if (operation === 'group') {
        payload.groupId = selectedValue;
        const response = await base44.functions.invoke('bulkUpdateTicketGroup', payload);
        return response.data;
      } else if (operation === 'type') {
        payload.type = selectedValue;
        const response = await base44.functions.invoke('bulkUpdateTicketType', payload);
        return response.data;
      } else if (operation === 'tags') {
        payload.tags = tags.split(',').map(t => t.trim()).filter(Boolean);
        const response = await base44.functions.invoke('bulkUpdateTicketTags', payload);
        return response.data;
      }
    },
    onSuccess: (data) => {
      toast.success(`✓ ${data.updated}/${data.total} tickets atualizados`);
      if (data.failed > 0) {
        toast.error(`⚠️ ${data.failed} tickets falharam`);
      }
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setOperation('');
      setSelectedValue('');
      setTags('');
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    }
  });

  const handleApply = () => {
    if (!operation || (!selectedValue && operation !== 'tags') || (operation === 'tags' && !tags)) {
      toast.error('Selecione uma operação e um valor');
      return;
    }
    updateMutation.mutate();
  };

  return (
    <div className="flex gap-3 items-end flex-wrap">
      <div className="min-w-48">
        <label className="text-xs font-semibold text-muted-foreground mb-1 block">
          Operação
        </label>
        <Select value={operation} onValueChange={(val) => {
          setOperation(val);
          setSelectedValue('');
          setTags('');
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione operação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="group">Grupo</SelectItem>
            <SelectItem value="type">Tipo</SelectItem>
            <SelectItem value="tags">Tags</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {operation === 'group' && (
        <div className="min-w-48">
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">
            Grupo
          </label>
          <Select value={selectedValue} onValueChange={setSelectedValue}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione grupo" />
            </SelectTrigger>
            <SelectContent>
              {groups?.map(g => (
                <SelectItem key={g.id} value={String(g.id)}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {operation === 'type' && (
        <div className="min-w-48">
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">
            Tipo
          </label>
          <Select value={selectedValue} onValueChange={setSelectedValue}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione tipo" />
            </SelectTrigger>
            <SelectContent>
              {TYPES.map(t => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {operation === 'tags' && (
        <div className="flex-1 min-w-64">
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">
            Tags (separadas por vírgula)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="urgent, bug, follow-up"
            className="w-full px-3 py-2 border border-input rounded-md text-sm"
          />
        </div>
      )}

      <Button
        onClick={handleApply}
        disabled={updateMutation.isPending}
        className="gap-2"
      >
        {updateMutation.isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <AlertCircle className="w-4 h-4" />
        )}
        {updateMutation.isPending ? 'Aplicando...' : `Aplicar em ${selectedIds.length}`}
      </Button>
    </div>
  );
}