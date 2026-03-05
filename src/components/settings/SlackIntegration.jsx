import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Slack } from 'lucide-react';

export default function SlackIntegration() {
  const queryClient = useQueryClient();
  const [config, setConfig] = useState({
    webhook_url: '',
    bot_token: '',
    channel_tickets: '#tickets',
    channel_responses: '#responses',
    notify_on_create: true,
    notify_on_update: true,
    notify_on_response: true,
    include_ai_summary: true,
    enabled: false
  });
  const [testLoading, setTestLoading] = useState(false);

  const { data: slackConfig, isLoading } = useQuery({
    queryKey: ['slackConfig'],
    queryFn: async () => {
      const configs = await base44.entities.SlackConfig.list();
      return configs[0] || null;
    }
  });

  React.useEffect(() => {
    if (slackConfig) {
      setConfig(slackConfig);
    }
  }, [slackConfig]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (slackConfig?.id) {
        return base44.entities.SlackConfig.update(slackConfig.id, data);
      } else {
        return base44.entities.SlackConfig.create(data);
      }
    },
    onSuccess: () => {
      toast.success('Configuração Slack salva!');
      queryClient.invalidateQueries({ queryKey: ['slackConfig'] });
    },
    onError: (error) => {
      toast.error('Erro ao salvar: ' + error.message);
    }
  });

  const testMutation = useMutation({
    mutationFn: async () => {
      setTestLoading(true);
      const response = await base44.functions.invoke('sendSlackNotification', {
        eventType: 'test',
        message: '✅ Integração Slack testada com sucesso!'
      });
      setTestLoading(false);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Mensagem de teste enviada!');
    },
    onError: (error) => {
      toast.error('Erro ao enviar teste: ' + error.message);
    }
  });

  const handleSave = async () => {
    if (!config.webhook_url) {
      toast.error('Webhook URL é obrigatório');
      return;
    }
    saveMutation.mutate(config);
  };

  const handleTest = () => {
    if (!config.webhook_url) {
      toast.error('Configure o Webhook URL primeiro');
      return;
    }
    testMutation.mutate();
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      {/* Alert */}
      {config.enabled && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-900">Slack ativo</p>
            <p className="text-sm text-green-800">Integrações de notificação estão funcionando</p>
          </div>
        </div>
      )}

      {/* Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Slack className="w-5 h-5 text-blue-600" />
            <CardTitle>Configurar Slack</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Webhook URL *</label>
            <p className="text-xs text-gray-500 mb-2">
              Obtenha em Slack → Configurações → Integrações → Apps & Customizações
            </p>
            <Input
              type="password"
              value={config.webhook_url}
              onChange={(e) => setConfig({ ...config, webhook_url: e.target.value })}
              placeholder="https://hooks.slack.com/services/..."
            />
          </div>

          <div>
            <label className="text-sm font-medium">Bot Token (Opcional)</label>
            <Input
              type="password"
              value={config.bot_token}
              onChange={(e) => setConfig({ ...config, bot_token: e.target.value })}
              placeholder="xoxb-..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Canal Tickets</label>
              <Input
                value={config.channel_tickets}
                onChange={(e) => setConfig({ ...config, channel_tickets: e.target.value })}
                placeholder="#tickets"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Canal Respostas</label>
              <Input
                value={config.channel_responses}
                onChange={(e) => setConfig({ ...config, channel_responses: e.target.value })}
                placeholder="#responses"
              />
            </div>
          </div>

          <div className="space-y-2 border-t pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={config.notify_on_create}
                onCheckedChange={(checked) => 
                  setConfig({ ...config, notify_on_create: checked })
                }
              />
              <span className="text-sm">Notificar quando novo ticket é criado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={config.notify_on_update}
                onCheckedChange={(checked) => 
                  setConfig({ ...config, notify_on_update: checked })
                }
              />
              <span className="text-sm">Notificar quando ticket é atualizado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={config.notify_on_response}
                onCheckedChange={(checked) => 
                  setConfig({ ...config, notify_on_response: checked })
                }
              />
              <span className="text-sm">Notificar quando há nova resposta</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={config.include_ai_summary}
                onCheckedChange={(checked) => 
                  setConfig({ ...config, include_ai_summary: checked })
                }
              />
              <span className="text-sm">Incluir resumo IA nas notificações</span>
            </label>
          </div>

          <div className="space-y-2 border-t pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={config.enabled}
                onCheckedChange={(checked) => 
                  setConfig({ ...config, enabled: checked })
                }
              />
              <span className="font-medium text-sm">
                {config.enabled ? '✓ Ativo' : 'Inativo'}
              </span>
            </label>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Salvar Configuração
            </Button>
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={testLoading || !config.webhook_url}
            >
              Enviar Teste
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}