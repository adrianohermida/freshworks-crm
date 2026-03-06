import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Power } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function AutoResponderManager() {
  const [showAddNew, setShowAddNew] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    keywords: '',
    response: '',
    match_type: 'any',
    apply_to_status: 'open'
  });

  const queryClient = useQueryClient();

  const { data: responders = [] } = useQuery({
    queryKey: ['auto_responders'],
    queryFn: () => base44.entities.AutoResponder.list(),
    initialData: []
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return base44.entities.AutoResponder.create({
        name: data.name,
        keywords: data.keywords.split(',').map(k => k.trim()).filter(Boolean),
        response: data.response,
        match_type: data.match_type,
        apply_to_status: [data.apply_to_status],
        enabled: true
      });
    },
    onSuccess: () => {
      toast.success('Auto-responder criado!');
      queryClient.invalidateQueries({ queryKey: ['auto_responders'] });
      setShowAddNew(false);
      resetForm();
    },
    onError: () => toast.error('Erro ao criar')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.AutoResponder.delete(id),
    onSuccess: () => {
      toast.success('Deletado!');
      queryClient.invalidateQueries({ queryKey: ['auto_responders'] });
    },
    onError: () => toast.error('Erro ao deletar')
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => {
      const responder = responders.find(r => r.id === id);
      return base44.entities.AutoResponder.update(id, { enabled: !responder.enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto_responders'] });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      keywords: '',
      response: '',
      match_type: 'any',
      apply_to_status: 'open'
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.keywords.trim() || !formData.response.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Auto-Responders</CardTitle>
        <Dialog open={showAddNew} onOpenChange={setShowAddNew}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1 bg-turquoise-600">
              <Plus className="w-4 h-4" />
              Novo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Auto-Responder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <input
                placeholder="Nome da regra"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <input
                placeholder="Palavras-chave (separadas por vírgula)"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <select
                value={formData.match_type}
                onChange={(e) => setFormData({ ...formData, match_type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="any">Qualquer palavra-chave</option>
                <option value="all">Todas as palavras-chave</option>
              </select>
              <select
                value={formData.apply_to_status}
                onChange={(e) => setFormData({ ...formData, apply_to_status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="open">Aberto</option>
                <option value="pending">Pendente</option>
              </select>
              <Textarea
                placeholder="Resposta automática..."
                value={formData.response}
                onChange={(e) => setFormData({ ...formData, response: e.target.value })}
                className="min-h-24"
              />
              <Button onClick={handleSubmit} className="w-full bg-turquoise-600">
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {responders.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Nenhum auto-responder</p>
          ) : (
            responders.map(responder => (
              <div key={responder.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{responder.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {responder.keywords?.slice(0, 3).map(kw => (
                        <Badge key={kw} variant="secondary" className="text-xs">
                          {kw}
                        </Badge>
                      ))}
                      {responder.keywords?.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{responder.keywords.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleMutation.mutate(responder.id)}
                      className="text-xs"
                    >
                      <Power className={`w-4 h-4 ${responder.enabled ? 'text-green-600' : 'text-gray-400'}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate(responder.id)}
                      className="text-xs text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{responder.response}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}