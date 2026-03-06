import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Plus, Trash2, Edit2 } from 'lucide-react';

const TRIGGER_EVENTS = [
  { id: 'ticket.created', label: 'Ticket Criado' },
  { id: 'ticket.updated', label: 'Ticket Atualizado' },
  { id: 'ticket.closed', label: 'Ticket Fechado' },
  { id: 'priority.changed', label: 'Prioridade Alterada' },
  { id: 'status.changed', label: 'Status Alterado' }
];

const ACTIONS = [
  { id: 'send_email', label: 'Enviar Email' },
  { id: 'change_priority', label: 'Alterar Prioridade' },
  { id: 'change_status', label: 'Alterar Status' },
  { id: 'assign_agent', label: 'Atribuir Agente' },
  { id: 'add_tag', label: 'Adicionar Tag' },
  { id: 'send_slack', label: 'Notificar Slack' }
];

export default function WorkflowAutomationBuilder({ onClose }) {
  const queryClient = useQueryClient();
  const [workflows, setWorkflows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger_event: '',
    conditions: [],
    actions: [],
    enabled: true
  });

  const { data: storedWorkflows } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      return await base44.entities.TicketRule.list();
    },
    initialData: []
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.TicketRule.create({
        name: data.name,
        description: data.description,
        trigger_event: data.trigger_event,
        conditions: data.conditions,
        actions: data.actions,
        enabled: data.enabled
      });
    },
    onSuccess: () => {
      toast.success('Workflow criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      resetForm();
    },
    onError: (error) => {
      toast.error('Erro ao criar workflow: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await base44.entities.TicketRule.delete(id);
    },
    onSuccess: () => {
      toast.success('Workflow deletado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
    onError: (error) => {
      toast.error('Erro ao deletar workflow: ' + error.message);
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      trigger_event: '',
      conditions: [],
      actions: [],
      enabled: true
    });
    setEditingId(null);
  };

  const handleAddAction = () => {
    setFormData(prev => ({
      ...prev,
      actions: [...prev.actions, { type: '', value: '' }]
    }));
  };

  const handleRemoveAction = (idx) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.trigger_event || formData.actions.length === 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Workflow</CardTitle>
          <CardDescription>Configure automações para seus tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Nome do Workflow"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              placeholder="Descrição"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <Select value={formData.trigger_event} onValueChange={(value) => setFormData({ ...formData, trigger_event: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Evento Disparador" />
              </SelectTrigger>
              <SelectContent>
                {TRIGGER_EVENTS.map(event => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-3">
              <label className="text-sm font-medium">Ações</label>
              {formData.actions.map((action, idx) => (
                <div key={idx} className="flex gap-2">
                  <Select 
                    value={action.type} 
                    onValueChange={(value) => {
                      const newActions = [...formData.actions];
                      newActions[idx].type = value;
                      setFormData({ ...formData, actions: newActions });
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Tipo de Ação" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIONS.map(act => (
                        <SelectItem key={act.id} value={act.id}>
                          {act.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAction(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddAction}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Ação
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
              />
              <label className="text-sm font-medium">Ativado</label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={resetForm} disabled={createMutation.isPending}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Workflow
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Workflows List */}
      <Card>
        <CardHeader>
          <CardTitle>Workflows Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {storedWorkflows.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Nenhum workflow criado</p>
          ) : (
            <div className="space-y-3">
              {storedWorkflows.map((workflow) => (
                <div key={workflow.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{workflow.name}</p>
                      <p className="text-xs text-gray-500">{workflow.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(workflow.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    <strong>Trigger:</strong> {workflow.trigger_event}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}