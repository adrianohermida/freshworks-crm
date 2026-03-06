import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ModuleCard from '@/components/shared/ModuleCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, User, Phone, Mail } from 'lucide-react';

export default function PartsCard({ processId }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: parts = [], isLoading } = useQuery({
    queryKey: ['parts', processId],
    queryFn: async () => {
      if (!processId) return [];
      const allContacts = await base44.entities.Contact.filter({
        type: 'parte'
      });
      return allContacts.filter(c => c.process_ids?.includes(processId));
    }
  });

  const deletePartMutation = useMutation({
    mutationFn: async (partId) => {
      const part = await base44.entities.Contact.filter({ id: partId });
      if (part.length > 0) {
        const updated = {
          ...part[0],
          process_ids: part[0].process_ids?.filter(id => id !== processId) || []
        };
        await base44.entities.Contact.update(partId, updated);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['parts', processId] })
  });

  const getTypeColor = (type) => {
    const colors = {
      parte: 'bg-blue-100 text-blue-800',
      cliente: 'bg-green-100 text-green-800',
      advogado: 'bg-purple-100 text-purple-800',
      contact: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <ModuleCard
      title="Partes do Processo"
      icon={User}
      action={<Button size="sm" variant="ghost" onClick={() => setIsOpen(!isOpen)} className="h-6 w-6 p-0"><Plus className="w-4 h-4" /></Button>}
    >
        {isLoading ? (
          <div className="text-sm text-gray-500">Carregando...</div>
        ) : parts.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-4">Nenhuma parte cadastrada</div>
        ) : (
          <div className="space-y-2">
            {parts.map(part => (
              <div key={part.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{part.name}</h4>
                      <Badge className={getTypeColor(part.type)}>{part.type}</Badge>
                    </div>
                    <div className="flex flex-col gap-1 mt-2 text-xs text-gray-600">
                      {part.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          {part.email}
                        </div>
                      )}
                      {part.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          {part.phone}
                        </div>
                      )}
                      {part.document && <div className="text-gray-500">Doc: {part.document}</div>}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deletePartMutation.mutate(part.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}