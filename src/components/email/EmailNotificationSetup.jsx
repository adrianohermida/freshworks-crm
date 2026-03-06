import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Mail, BarChart3, AlertCircle } from 'lucide-react';

export default function EmailNotificationSetup() {
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState({
    customer_ticket_created: true,
    customer_response_added: true,
    agent_ticket_assigned: true,
    agent_response_added: true,
    admin_sla_breach: true,
    admin_daily_report: false
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['emailTemplates'],
    queryFn: () => base44.entities.EmailTemplate.list()
  });

  const { data: emailLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['emailLogs'],
    queryFn: () => base44.entities.EmailLog.filter({}, '-created_date', 20),
    initialData: []
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      // Store in user preferences or a settings entity
      await base44.auth.updateMe({
        email_notifications: data
      });
    },
    onSuccess: () => {
      toast.success('✅ Notificações configuradas!');
    }
  });

  const handleSave = () => {
    saveMutation.mutate(notifications);
  };

  const toggleNotification = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
  };

  const totalTemplates = templates.length;
  const enabledTemplates = templates.filter(t => t.enabled).length;

  const emailLogsStats = {
    total: emailLogs.length,
    sent: emailLogs.filter(l => l.status === 'sent').length,
    failed: emailLogs.filter(l => l.status === 'failed').length,
    pending: emailLogs.filter(l => l.status === 'pending').length
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-blue-600">{totalTemplates}</p>
            <p className="text-xs text-gray-600 mt-1">Templates</p>
            <p className="text-xs text-green-600 mt-0.5">{enabledTemplates} ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-green-600">{emailLogsStats.sent}</p>
            <p className="text-xs text-gray-600 mt-1">Enviados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-red-600">{emailLogsStats.failed}</p>
            <p className="text-xs text-gray-600 mt-1">Falhas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-orange-600">{emailLogsStats.pending}</p>
            <p className="text-xs text-gray-600 mt-1">Pendentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Configurar Notificações por Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium">👤 Notificações do Cliente</h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={notifications.customer_ticket_created}
                onCheckedChange={() => toggleNotification('customer_ticket_created')}
              />
              <span className="text-sm">Quando um novo ticket é criado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={notifications.customer_response_added}
                onCheckedChange={() => toggleNotification('customer_response_added')}
              />
              <span className="text-sm">Quando recebe uma resposta</span>
            </label>
          </div>

          <div className="space-y-3 border-t pt-4">
            <h4 className="text-sm font-medium">👨‍💼 Notificações do Agente</h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={notifications.agent_ticket_assigned}
                onCheckedChange={() => toggleNotification('agent_ticket_assigned')}
              />
              <span className="text-sm">Quando um ticket é atribuído</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={notifications.agent_response_added}
                onCheckedChange={() => toggleNotification('agent_response_added')}
              />
              <span className="text-sm">Quando há nova resposta em seus tickets</span>
            </label>
          </div>

          <div className="space-y-3 border-t pt-4">
            <h4 className="text-sm font-medium">⚙️ Notificações do Admin</h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={notifications.admin_sla_breach}
                onCheckedChange={() => toggleNotification('admin_sla_breach')}
              />
              <span className="text-sm">Alertas de violação SLA</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={notifications.admin_daily_report}
                onCheckedChange={() => toggleNotification('admin_daily_report')}
              />
              <span className="text-sm">Relatório diário de tickets</span>
            </label>
          </div>

          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
          >
            Salvar Preferências
          </Button>
        </CardContent>
      </Card>

      {/* Email Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Histórico de Emails Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logsLoading ? (
            <p className="text-center text-gray-500 py-8">Carregando histórico...</p>
          ) : emailLogs.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhum email enviado ainda</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {emailLogs.map(log => (
                <div key={log.id} className="border rounded p-3 text-xs">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-semibold">{log.subject}</p>
                      <p className="text-gray-600">{log.recipient_email}</p>
                    </div>
                    <Badge variant={log.status === 'sent' ? 'default' : 'destructive'}>
                      {log.status === 'sent' && '✓ Enviado'}
                      {log.status === 'failed' && '✗ Falha'}
                      {log.status === 'pending' && '⏳ Pendente'}
                      {log.status === 'bounced' && '⚠️ Retornado'}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>{log.template_name}</span>
                    {log.sent_at && (
                      <span>{new Date(log.sent_at).toLocaleDateString('pt-BR')}</span>
                    )}
                  </div>
                  {log.error_message && (
                    <div className="mt-1 p-2 bg-red-50 rounded border-l-2 border-red-500 text-red-700">
                      {log.error_message}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}