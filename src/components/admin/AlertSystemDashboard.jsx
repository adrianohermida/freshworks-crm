import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, Plus, Edit, Trash2 } from 'lucide-react';

export default function AlertSystemDashboard() {
  const [rules, setRules] = useState([
    { id: 'rule_1', name: 'Falha de Sincronização', trigger: 'sync_failed', action: 'notify_admin', channels: ['email', 'slack'], enabled: true },
    { id: 'rule_2', name: 'Latência Alta', trigger: 'high_latency', action: 'notify_admin', channels: ['email'], enabled: true },
    { id: 'rule_3', name: 'Fallback Ativado', trigger: 'fallback_used', action: 'notify_team', channels: ['email', 'slack', 'sms'], enabled: true },
    { id: 'rule_4', name: 'Taxa de Sucesso Baixa', trigger: 'low_success_rate', action: 'escalate', channels: ['email', 'slack'], enabled: true }
  ]);
  const [showNewRule, setShowNewRule] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    trigger: 'sync_failed',
    condition: '',
    action: 'notify_admin',
    channels: ['email']
  });

  const triggerOptions = [
    { id: 'sync_failed', label: 'Falha de Sincronização' },
    { id: 'high_latency', label: 'Latência Alta' },
    { id: 'fallback_used', label: 'Fallback Ativado' },
    { id: 'low_success_rate', label: 'Taxa Baixa de Sucesso' },
    { id: 'database_error', label: 'Erro no Banco de Dados' }
  ];

  const actionOptions = [
    { id: 'notify_admin', label: 'Notificar Admin' },
    { id: 'notify_team', label: 'Notificar Time' },
    { id: 'escalate', label: 'Escalar' }
  ];

  const channelOptions = [
    { id: 'email', label: '📧 Email' },
    { id: 'slack', label: '💬 Slack' },
    { id: 'sms', label: '📱 SMS' }
  ];

  const recentAlerts = [
    { id: 1, rule: 'Falha de Sincronização', severity: 'high', time: '2 min atrás', status: 'active' },
    { id: 2, rule: 'Latência Alta', severity: 'medium', time: '15 min atrás', status: 'resolved' },
    { id: 3, rule: 'Fallback Ativado', severity: 'low', time: '1h atrás', status: 'resolved' }
  ];

  const handleCreateRule = () => {
    if (!newRule.name || !newRule.trigger) {
      alert('Preencha nome e trigger');
      return;
    }
    const rule = {
      id: `rule_${Date.now()}`,
      ...newRule,
      enabled: true
    };
    setRules([...rules, rule]);
    setNewRule({ name: '', trigger: 'sync_failed', condition: '', action: 'notify_admin', channels: ['email'] });
    setShowNewRule(false);
  };

  const handleDeleteRule = (ruleId) => {
    setRules(rules.filter(r => r.id !== ruleId));
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Alert System</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Regras personalizáveis multi-canal</p>
          </div>
        </div>
        <Dialog open={showNewRule} onOpenChange={setShowNewRule}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4" />
              Nova Regra
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Regra de Alerta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-2">Nome da Regra *</label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="Ex: Falha de Sincronização"
                />
              </div>

              <div>
                <label className="text-sm font-semibold block mb-2">Trigger *</label>
                <select
                  value={newRule.trigger}
                  onChange={(e) => setNewRule({...newRule, trigger: e.target.value})}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  {triggerOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold block mb-2">Ação</label>
                <select
                  value={newRule.action}
                  onChange={(e) => setNewRule({...newRule, action: e.target.value})}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  {actionOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold block mb-2">Canais de Notificação</label>
                <div className="space-y-2">
                  {channelOptions.map(ch => (
                    <label key={ch.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newRule.channels.includes(ch.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewRule({...newRule, channels: [...newRule.channels, ch.id]});
                          } else {
                            setNewRule({...newRule, channels: newRule.channels.filter(c => c !== ch.id)});
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{ch.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button onClick={handleCreateRule} className="w-full bg-red-600">
                Criar Regra
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* RULES LIST */}
      <Card>
        <CardHeader>
          <CardTitle>Regras de Alerta Ativas ({rules.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rules.map(rule => (
            <div key={rule.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{rule.name}</p>
                    <Badge className={rule.enabled ? 'bg-green-600' : 'bg-gray-400'}>
                      {rule.enabled ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                    <div>
                      <p className="font-mono text-gray-500">Trigger</p>
                      <p>{triggerOptions.find(o => o.id === rule.trigger)?.label}</p>
                    </div>
                    <div>
                      <p className="font-mono text-gray-500">Ação</p>
                      <p>{actionOptions.find(o => o.id === rule.action)?.label}</p>
                    </div>
                    <div>
                      <p className="font-mono text-gray-500">Canais</p>
                      <p>{rule.channels.join(', ')}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* RECENT ALERTS */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas Recentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentAlerts.map(alert => (
            <div key={alert.id} className="p-3 border rounded-lg flex items-center justify-between">
              <div className="flex-1">
                <p className="font-semibold text-sm">{alert.rule}</p>
                <p className="text-xs text-gray-600">{alert.time}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={
                  alert.severity === 'high' ? 'bg-red-600' :
                  alert.severity === 'medium' ? 'bg-yellow-600' : 'bg-blue-600'
                }>
                  {alert.severity === 'high' ? 'Alto' : alert.severity === 'medium' ? 'Médio' : 'Baixo'}
                </Badge>
                <Badge className={alert.status === 'active' ? 'bg-orange-600' : 'bg-green-600'}>
                  {alert.status === 'active' ? 'Ativo' : 'Resolvido'}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* INFO */}
      <Card className="bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="pt-6 text-sm text-blue-900 dark:text-blue-100 space-y-2">
          <p>✓ <strong>Regras Personalizáveis:</strong> Crie regras baseadas em triggers e condições</p>
          <p>✓ <strong>Multi-canal:</strong> Email, Slack, SMS</p>
          <p>✓ <strong>Ações Automáticas:</strong> Notificar, Escalar, Retry</p>
          <p>✓ <strong>Histórico Completo:</strong> Rastreie todos os alertas disparados</p>
        </CardContent>
      </Card>
    </div>
  );
}