import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const WEBHOOK_EVENTS = [
  { id: 'ticket.created', label: 'Ticket Criado' },
  { id: 'ticket.updated', label: 'Ticket Atualizado' },
  { id: 'ticket.closed', label: 'Ticket Fechado' },
  { id: 'conversation.created', label: 'Resposta Adicionada' },
  { id: 'customer.created', label: 'Cliente Criado' },
  { id: 'agent.status.updated', label: 'Status do Agente Alterado' }
];

export default function WebhookConfiguratorForm({ onSuccess, onCancel }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    events: [],
    retryCount: 3,
    timeout: 30
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await base44.functions.invoke('createWebhook', {
        name: data.name,
        url: data.url,
        events: data.events,
        retry_count: data.retryCount,
        timeout: data.timeout
      });
      if (response.data?.error) throw new Error(response.data.error);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Webhook criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      setFormData({
        name: '',
        url: '',
        events: [],
        retryCount: 3,
        timeout: 30
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Erro ao criar webhook: ' + error.message);
    }
  });

  const handleToggleEvent = (eventId) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter(e => e !== eventId)
        : [...prev.events, eventId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.url || formData.events.length === 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Novo Webhook</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Nome do Webhook"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            placeholder="URL de Destino (https://...)"
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            required
          />

          <div className="space-y-3">
            <label className="text-sm font-medium">Eventos para Disparar</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {WEBHOOK_EVENTS.map(event => (
                <label key={event.id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.events.includes(event.id)}
                    onCheckedChange={() => handleToggleEvent(event.id)}
                  />
                  <span className="text-sm">{event.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Tentativas</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={formData.retryCount}
                onChange={(e) => setFormData({ ...formData, retryCount: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Timeout (s)</label>
              <Input
                type="number"
                min="5"
                max="60"
                value={formData.timeout}
                onChange={(e) => setFormData({ ...formData, timeout: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onCancel} disabled={createMutation.isPending}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar Webhook
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}