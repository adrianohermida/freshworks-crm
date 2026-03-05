import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Send, Eye, Code } from 'lucide-react';

const EVENT_TYPES = [
  { id: 'ticket_created', label: '📌 Ticket Criado' },
  { id: 'ticket_updated', label: '✏️ Ticket Atualizado' },
  { id: 'ticket_closed', label: '✅ Ticket Fechado' },
  { id: 'response_added', label: '💬 Resposta Adicionada' },
  { id: 'review_submitted', label: '⭐ Avaliação Enviada' },
  { id: 'feedback_received', label: '💡 Feedback Recebido' }
];

export default function WebhookBuilder() {
  const queryClient = useQueryClient();
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [showPayloadPreview, setShowPayloadPreview] = useState(null);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [],
    headers: {},
    active: true,
    retry_count: 3,
    timeout: 30
  });

  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: ['webhooks'],
    queryFn: () => base44.entities.Webhook.list(),
    initialData: []
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Webhook.create(data),
    onSuccess: () => {
      toast.success('🪝 Webhook criado!');
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      setNewWebhook({
        name: '',
        url: '',
        events: [],
        headers: {},
        active: true,
        retry_count: 3,
        timeout: 30
      });
      setShowNewForm(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Webhook.delete(id),
    onSuccess: () => {
      toast.success('❌ Webhook removido');
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    }
  });

  const testMutation = useMutation({
    mutationFn: async (id) => {
      const webhook = webhooks.find(w => w.id === id);
      return fetch(webhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...webhook.headers },
        body: JSON.stringify({ test: true, timestamp: new Date().toISOString() })
      });
    },
    onSuccess: () => {
      toast.success('✅ Teste enviado com sucesso!');
    },
    onError: () => {
      toast.error('❌ Erro ao testar webhook');
    }
  });

  const toggleEventMutation = useMutation({
    mutationFn: (id) => {
      const webhook = webhooks.find(w => w.id === id);
      return base44.entities.Webhook.update(id, { active: !webhook.active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    }
  });

  const handleToggleEvent = (eventId) => {
    setNewWebhook({
      ...newWebhook,
      events: newWebhook.events.includes(eventId)
        ? newWebhook.events.filter(e => e !== eventId)
        : [...newWebhook.events, eventId]
    });
  };

  const handleCreateWebhook = () => {
    if (!newWebhook.name.trim() || !newWebhook.url.trim()) {
      toast.error('Preencha nome e URL');
      return;
    }
    if (newWebhook.events.length === 0) {
      toast.error('Selecione pelo menos um evento');
      return;
    }
    createMutation.mutate(newWebhook);
  };

  const payloadExample = {
    event: 'ticket_created',
    timestamp: '2026-03-03T10:30:00Z',
    data: {
      id: 'ticket_123',
      subject: 'Título do ticket',
      description: 'Descrição detalhada',
      status: 'open',
      priority: 'high'
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Form */}
      {showNewForm && (
        <Card>
          <CardHeader>
            <CardTitle>🪝 Novo Webhook</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nome do Webhook</label>
                <Input
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                  placeholder="Ex: Integração Slack"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">URL do Endpoint</label>
                <Input
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                  placeholder="https://example.com/webhook"
                  type="url"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Events */}
            <div>
              <label className="text-sm font-medium block mb-2">Eventos</label>
              <div className="grid grid-cols-2 gap-2">
                {EVENT_TYPES.map(event => (
                  <label key={event.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={newWebhook.events.includes(event.id)}
                      onCheckedChange={() => handleToggleEvent(event.id)}
                    />
                    <span className="text-sm">{event.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div>
                <label className="text-sm font-medium">Retry Count</label>
                <Input
                  type="number"
                  value={newWebhook.retry_count}
                  onChange={(e) => setNewWebhook({ ...newWebhook, retry_count: parseInt(e.target.value) })}
                  min="0"
                  max="10"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Timeout (segundos)</label>
                <Input
                  type="number"
                  value={newWebhook.timeout}
                  onChange={(e) => setNewWebhook({ ...newWebhook, timeout: parseInt(e.target.value) })}
                  min="5"
                  max="300"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Payload Preview */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Exemplo de Payload</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPayloadPreview(!showPayloadPreview)}
                  className="gap-1"
                >
                  {showPayloadPreview ? <Eye className="w-3 h-3" /> : <Code className="w-3 h-3" />}
                </Button>
              </div>
              {showPayloadPreview && (
                <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                  {JSON.stringify(payloadExample, null, 2)}
                </pre>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleCreateWebhook}
                disabled={createMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Criar Webhook
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNewForm(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Webhooks List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">🪝 Webhooks ({webhooks.length})</h3>
          {!showNewForm && (
            <Button
              onClick={() => setShowNewForm(true)}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Webhook
            </Button>
          )}
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500 py-4">Carregando webhooks...</p>
        ) : webhooks.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">Nenhum webhook configurado</p>
        ) : (
          <div className="space-y-2">
            {webhooks.map(webhook => (
              <Card key={webhook.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">🪝 {webhook.name}</p>
                        <Badge variant={webhook.active ? 'default' : 'secondary'}>
                          {webhook.active ? '✓ Ativo' : '○ Inativo'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 font-mono mb-2">{webhook.url}</p>
                      <div className="flex gap-2 flex-wrap">
                        {webhook.events.map(event => (
                          <Badge key={event} variant="outline" className="text-xs">
                            {EVENT_TYPES.find(e => e.id === event)?.label}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testMutation.mutate(webhook.id)}
                        className="gap-1"
                        disabled={testMutation.isPending}
                      >
                        <Send className="w-3 h-3" />
                        Testar
                      </Button>
                      <Button
                        size="sm"
                        variant={webhook.active ? 'outline' : 'secondary'}
                        onClick={() => toggleEventMutation.mutate(webhook.id)}
                      >
                        {webhook.active ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(webhook.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {webhook.last_triggered && (
                    <div className="text-xs text-gray-600 pt-2 border-t">
                      📅 Último disparo: {new Date(webhook.last_triggered).toLocaleDateString('pt-BR')} |
                      {webhook.last_status === 'success' ? ' ✅ Sucesso' : ' ❌ Falha'}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}