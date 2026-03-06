import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const EVENT_TYPES = [
  { value: 'ticket_created', label: 'Ticket Criado' },
  { value: 'ticket_updated', label: 'Ticket Atualizado' },
  { value: 'ticket_closed', label: 'Ticket Fechado' },
  { value: 'response_added', label: 'Resposta Adicionada' }
];

export default function WebhookManager() {
  const queryClient = useQueryClient();
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [],
    headers: {},
    retry_count: 3,
    timeout: 30
  });
  const [editingId, setEditingId] = useState(null);

  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: ['webhooks'],
    queryFn: () => base44.entities.Webhook.list(),
    initialData: []
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Webhook.create(data),
    onSuccess: () => {
      toast.success('Webhook criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      resetForm();
    },
    onError: (error) => {
      toast.error('Erro ao criar: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Webhook.delete(id),
    onSuccess: () => {
      toast.success('Webhook removido!');
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    },
    onError: (error) => {
      toast.error('Erro ao deletar: ' + error.message);
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, active }) => 
      base44.entities.Webhook.update(id, { active: !active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    },
    onError: (error) => {
      toast.error('Erro ao atualizar: ' + error.message);
    }
  });

  const resetForm = () => {
    setNewWebhook({
      name: '',
      url: '',
      events: [],
      headers: {},
      retry_count: 3,
      timeout: 30
    });
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    createMutation.mutate(newWebhook);
  };

  const toggleEvent = (eventValue) => {
    const updated = newWebhook.events.includes(eventValue)
      ? newWebhook.events.filter(e => e !== eventValue)
      : [...newWebhook.events, eventValue];
    setNewWebhook({ ...newWebhook, events: updated });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Novo Webhook</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome *</label>
              <Input
                value={newWebhook.name}
                onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                placeholder="Ex: Webhook Slack"
              />
            </div>

            <div>
              <label className="text-sm font-medium">URL *</label>
              <Input
                value={newWebhook.url}
                onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                placeholder="https://example.com/webhook"
                type="url"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Eventos *</label>
              <div className="space-y-2 mt-2">
                {EVENT_TYPES.map(event => (
                  <label key={event.value} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={newWebhook.events.includes(event.value)}
                      onCheckedChange={() => toggleEvent(event.value)}
                    />
                    <span className="text-sm">{event.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tentativas</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={newWebhook.retry_count}
                  onChange={(e) => setNewWebhook({ ...newWebhook, retry_count: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Timeout (seg)</label>
                <Input
                  type="number"
                  min="5"
                  max="120"
                  value={newWebhook.timeout}
                  onChange={(e) => setNewWebhook({ ...newWebhook, timeout: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Webhook
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Webhooks Ativos ({webhooks.length})</h3>
        {webhooks.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum webhook configurado</p>
        ) : (
          webhooks.map(webhook => (
            <Card key={webhook.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{webhook.name}</h4>
                      {getStatusIcon(webhook.last_status)}
                      <Badge variant={webhook.active ? 'default' : 'secondary'}>
                        {webhook.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{webhook.url}</p>
                    <div className="flex gap-2 mt-2">
                      {webhook.events.map(event => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {EVENT_TYPES.find(e => e.value === event)?.label}
                        </Badge>
                      ))}
                    </div>
                    {webhook.last_triggered && (
                      <p className="text-xs text-gray-500 mt-2">
                        Último disparo: {new Date(webhook.last_triggered).toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActiveMutation.mutate({ id: webhook.id, active: webhook.active })}
                    >
                      {webhook.active ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(webhook.id)}
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