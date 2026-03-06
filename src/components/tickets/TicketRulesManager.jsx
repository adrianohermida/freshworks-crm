import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Power } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function TicketRulesManager() {
  const [showAddNew, setShowAddNew] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    condition_type: 'priority',
    condition_value: '',
    action_type: 'assign_agent',
    action_value: '',
    priority: 0
  });

  const queryClient = useQueryClient();

  const { data: rules = [] } = useQuery({
    queryKey: ['ticket_rules'],
    queryFn: () => base44.entities.TicketRule.list(),
    initialData: []
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return base44.entities.TicketRule.create(data);
    },
    onSuccess: () => {
      toast.success('Regra criada!');
      queryClient.invalidateQueries({ queryKey: ['ticket_rules'] });
      setShowAddNew(false);
      resetForm();
    },
    onError: () => toast.error('Erro ao criar')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.TicketRule.delete(id),
    onSuccess: () => {
      toast.success('Deletado!');
      queryClient.invalidateQueries({ queryKey: ['ticket_rules'] });
    },
    onError: () => toast.error('Erro ao deletar')
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => {
      const rule = rules.find(r => r.id === id);
      return base44.entities.TicketRule.update(id, { enabled: !rule.enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket_rules'] });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      condition_type: 'priority',
      condition_value: '',
      action_type: 'assign_agent',
      action_value: '',
      priority: 0
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.condition_value.trim() || !formData.action_value.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }
    createMutation.mutate(formData);
  };

  const getConditionLabel = (type, value) => {
    const labels = {
      priority: `Prioridade = ${value}`,
      category: `Categoria = ${value}`,
      keywords: `Contém "${value}"`,
      status: `Status = ${value}`
    };
    return labels[type] || value;
  };

  const getActionLabel = (type, value) => {
    const labels = {
      assign_agent: `Atribuir a ${value}`,
      change_status: `Mudar para ${value}`,
      add_tag: `Adicionar tag ${value}`,
      send_response: `Enviar resposta`
    };
    return labels[type] || value;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Regras de Tickets</CardTitle>
        <Dialog open={showAddNew} onOpenChange={setShowAddNew}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1 bg-turquoise-600">
              <Plus className="w-4 h-4" />
              Nova Regra
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Regra</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <input
                placeholder="Nome da regra"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />

              <div>
                <label className="text-sm font-medium mb-1 block">Condição</label>
                <select
                  value={formData.condition_type}
                  onChange={(e) => setFormData({ ...formData, condition_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm mb-2"
                >
                  <option value="priority">Prioridade</option>
                  <option value="category">Categoria</option>
                  <option value="keywords">Palavras-chave</option>
                  <option value="status">Status</option>
                </select>
                <input
                  placeholder="Valor da condição"
                  value={formData.condition_value}
                  onChange={(e) => setFormData({ ...formData, condition_value: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Ação</label>
                <select
                  value={formData.action_type}
                  onChange={(e) => setFormData({ ...formData, action_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm mb-2"
                >
                  <option value="assign_agent">Atribuir Agente</option>
                  <option value="change_status">Mudar Status</option>
                  <option value="add_tag">Adicionar Tag</option>
                </select>
                <input
                  placeholder="Valor da ação"
                  value={formData.action_value}
                  onChange={(e) => setFormData({ ...formData, action_value: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Prioridade (0-10)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <Button onClick={handleSubmit} className="w-full bg-turquoise-600">
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {rules.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Nenhuma regra</p>
          ) : (
            rules
              .sort((a, b) => (b.priority || 0) - (a.priority || 0))
              .map(rule => (
                <div key={rule.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{rule.name}</p>
                      <div className="space-y-1 mt-1">
                        <p className="text-xs text-gray-600">
                          Se: {getConditionLabel(rule.condition_type, rule.condition_value)}
                        </p>
                        <p className="text-xs text-gray-600">
                          Então: {getActionLabel(rule.action_type, rule.action_value)}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs mt-2">
                        Prioridade: {rule.priority}
                      </Badge>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleMutation.mutate(rule.id)}
                        className="text-xs"
                      >
                        <Power className={`w-4 h-4 ${rule.enabled ? 'text-green-600' : 'text-gray-400'}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(rule.id)}
                        className="text-xs text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}