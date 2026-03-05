import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Star, Share2 } from 'lucide-react';

export default function SavedFiltersManager({ onApplyFilter }) {
  const queryClient = useQueryClient();
  const [newFilter, setNewFilter] = useState({
    filter_name: '',
    description: '',
    filter_criteria: {
      status: [],
      priority: [],
      category: [],
      search_text: ''
    },
    is_shared: false
  });

  const { data: savedFilters = [], isLoading } = useQuery({
    queryKey: ['savedFilters'],
    queryFn: () => base44.entities.SavedFilter.list(),
    initialData: []
  });

  const saveMutation = useMutation({
    mutationFn: (filter) => base44.entities.SavedFilter.create(filter),
    onSuccess: () => {
      toast.success('✅ Filtro salvo!');
      queryClient.invalidateQueries({ queryKey: ['savedFilters'] });
      setNewFilter({
        filter_name: '',
        description: '',
        filter_criteria: { status: [], priority: [], category: [], search_text: '' },
        is_shared: false
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SavedFilter.delete(id),
    onSuccess: () => {
      toast.success('❌ Filtro removido');
      queryClient.invalidateQueries({ queryKey: ['savedFilters'] });
    }
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id) => base44.entities.SavedFilter.update(id, { is_default: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedFilters'] });
    }
  });

  const handleSaveFilter = () => {
    if (!newFilter.filter_name.trim()) {
      toast.error('Nome do filtro é obrigatório');
      return;
    }
    saveMutation.mutate(newFilter);
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-4">
      {/* Save New Filter Form */}
      <Card>
        <CardHeader>
          <CardTitle>💾 Salvar Novo Filtro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-medium">Nome do Filtro *</label>
            <input
              type="text"
              value={newFilter.filter_name}
              onChange={(e) => setNewFilter({ ...newFilter, filter_name: e.target.value })}
              placeholder="Ex: Tickets Urgentes Meus"
              className="w-full px-3 py-2 border rounded-md text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Descrição</label>
            <input
              type="text"
              value={newFilter.description}
              onChange={(e) => setNewFilter({ ...newFilter, description: e.target.value })}
              placeholder="Descrição opcional"
              className="w-full px-3 py-2 border rounded-md text-sm mt-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newFilter.is_shared}
              onChange={(e) => setNewFilter({ ...newFilter, is_shared: e.target.checked })}
              className="w-4 h-4"
            />
            <label className="text-sm">Compartilhar com equipe</label>
          </div>
          <Button
            onClick={handleSaveFilter}
            disabled={saveMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Salvar Filtro
          </Button>
        </CardContent>
      </Card>

      {/* Saved Filters List */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Seus Filtros ({savedFilters.length})</h3>
        {savedFilters.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">Nenhum filtro salvo</p>
        ) : (
          savedFilters.map((filter) => (
            <Card key={filter.id} className="hover:bg-gray-50">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{filter.filter_name}</h4>
                      {filter.is_default && (
                        <Badge className="bg-yellow-100 text-yellow-800">Padrão</Badge>
                      )}
                      {filter.is_shared && (
                        <Badge className="bg-blue-100 text-blue-800">Compartilhado</Badge>
                      )}
                    </div>
                    {filter.description && (
                      <p className="text-xs text-gray-600 mb-2">{filter.description}</p>
                    )}
                    <div className="text-xs text-gray-600">
                      Status: {filter.filter_criteria.status?.length > 0 
                        ? filter.filter_criteria.status.join(', ') 
                        : 'Todos'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onApplyFilter?.(filter.filter_criteria);
                        toast.success(`✅ Filtro "${filter.filter_name}" aplicado`);
                      }}
                    >
                      Aplicar
                    </Button>
                    {!filter.is_default && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDefaultMutation.mutate(filter.id)}
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(filter.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}