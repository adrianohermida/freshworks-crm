import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { action, rule, ruleId } = await req.json();

    if (action === 'create') {
      return Response.json({
        success: true,
        ruleId: `rule_${Date.now()}`,
        rule: validateRule(rule),
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'list') {
      return Response.json({
        success: true,
        rules: getDefaultRules()
      });
    }

    if (action === 'delete') {
      return Response.json({
        success: true,
        deletedRuleId: ruleId,
        timestamp: new Date().toISOString()
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function validateRule(rule) {
  const required = ['name', 'trigger', 'condition', 'action', 'channels'];
  const missing = required.filter(field => !rule[field]);

  if (missing.length > 0) {
    throw new Error(`Campos obrigatórios: ${missing.join(', ')}`);
  }

  return {
    ...rule,
    enabled: true,
    createdAt: new Date().toISOString()
  };
}

function getDefaultRules() {
  return [
    {
      id: 'rule_1',
      name: 'Falha de Sincronização',
      trigger: 'sync_failed',
      condition: { attempts: 3, failureRate: '> 50%' },
      action: 'notify_admin',
      channels: ['email', 'slack'],
      enabled: true
    },
    {
      id: 'rule_2',
      name: 'Latência Alta',
      trigger: 'high_latency',
      condition: { latency: '> 5000ms' },
      action: 'notify_admin',
      channels: ['email'],
      enabled: true
    },
    {
      id: 'rule_3',
      name: 'Fallback Ativado',
      trigger: 'fallback_used',
      condition: { fallbackCount: '> 5' },
      action: 'notify_team',
      channels: ['email', 'slack', 'sms'],
      enabled: true
    },
    {
      id: 'rule_4',
      name: 'Taxa de Sucesso Baixa',
      trigger: 'low_success_rate',
      condition: { successRate: '< 85%' },
      action: 'escalate',
      channels: ['email', 'slack'],
      enabled: true
    }
  ];
}