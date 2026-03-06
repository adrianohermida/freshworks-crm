import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle2, AlertCircle, Trash2, Plus, Eye, EyeOff } from 'lucide-react';

export default function WebhookManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    url: '',
    events: ['process.created']
  });
  const [showSecret, setShowSecret] = useState({});

  const queryClient = useQueryClient();

  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: ['webhooks'],
    queryFn: () => base44.functions.invoke('webhooksV3API', { action: 'list' })
      .then(res => res.data.webhooks || [])
  });

  const createMutation = useMutation({
    mutationFn: (webhook) =>
      base44.functions.invoke('webhooksV3API', { action: 'register', webhook }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      setIsDialogOpen(false);
      setNewWebhook({ url: '', events: ['process.created'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) =>
      base44.functions.invoke('webhooksV3API', { action: 'delete', webhook: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    }
  });

  const handleCreate = async () => {
    if (!newWebhook.url) return;
    await createMutation.mutateAsync(newWebhook);
  };

  const events = [
    'process.created',
    'process.updated',
    'process.deleted',
    'deadline.approaching',
    'deadline.expired',
    'movement.received',
    'publication.new'
  ];

  if (isLoading) {
    return <div className="text-center py-8">Carregando webhooks...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Webhook Manager</h2>
          <p className="text-sm text-gray-600">API V3 - Event-driven integration</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2 bg-blue-600">
          <Plus className="w-4 h-4" /> Novo Webhook
        </Button>
      </div>

      {/* Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Novo Webhook</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={newWebhook.url}
                onChange={(e) => setNewWebhook({...newWebhook, url: e.target.value})}
                placeholder="https://example.com/webhook"
              />
            </div>

            <div className="space-y-2">
              <Label>Eventos</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {events.map(event => (
                  <label key={event} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={newWebhook.events.includes(event)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewWebhook({
                            ...newWebhook,
                            events: [...newWebhook.events, event]
                          });
                        } else {
                          setNewWebhook({
                            ...newWebhook,
                            events: newWebhook.events.filter(ev => ev !== event)
                          });
                        }
                      }}
                    />
                    <span className="text-sm">{event}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} className="bg-blue-600">Criar Webhook</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Webhooks List */}
      <div className="space-y-3">
        {webhooks.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Nenhum webhook registrado. Crie um novo para começar.</AlertDescription>
          </Alert>
        ) : (
          webhooks.map(webhook => (
            <Card key={webhook.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-mono text-sm truncate">{webhook.url}</p>
                      <Badge className={webhook.active ? 'bg-green-600' : 'bg-red-600'}>
                        {webhook.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {webhook.events.slice(0, 3).map(event => (
                        <Badge key={event} className="bg-blue-100 text-blue-800 text-xs">
                          {event}
                        </Badge>
                      ))}
                      {webhook.events.length > 3 && (
                        <Badge className="bg-gray-100 text-gray-800 text-xs">
                          +{webhook.events.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>Secret: {showSecret[webhook.id] ? webhook.secret : '••••••••'}</p>
                      <p>Criado: {new Date(webhook.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSecret({
                        ...showSecret,
                        [webhook.id]: !showSecret[webhook.id]
                      })}
                    >
                      {showSecret[webhook.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
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

      {/* Webhook Events Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Eventos Disponíveis</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          {events.map(event => (
            <p key={event} className="text-gray-600">• {event}</p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}