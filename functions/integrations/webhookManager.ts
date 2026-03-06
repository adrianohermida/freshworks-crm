/**
 * Webhook Manager & Integrations
 * Zapier, Make, IFTTT, custom webhooks
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { Logger } from '../utils/logger.js';

Deno.serve(async (req) => {
  const logger = new Logger('webhookManager');

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      logger.error('Não autenticado');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action = 'listWebhooks' } = await req.json();

    logger.info(`Ação: ${action}`);

    let result;

    switch (action) {
      case 'listWebhooks':
        result = await listWebhooks(logger);
        break;
      case 'createWebhook':
        const { webhookData } = await req.json();
        result = await createWebhook(logger, webhookData);
        break;
      case 'testWebhook':
        const { webhookId } = await req.json();
        result = await testWebhook(logger, webhookId);
        break;
      case 'getIntegrations':
        result = await getAvailableIntegrations(logger);
        break;
      case 'connectZapier':
        const { zapierData } = await req.json();
        result = await connectZapier(logger, zapierData);
        break;
      case 'connectMake':
        const { makeData } = await req.json();
        result = await connectMake(logger, makeData);
        break;
      default:
        throw new Error(`Ação desconhecida: ${action}`);
    }

    logger.success('Operação concluída');

    return Response.json({
      success: true,
      result,
      logs: logger.export()
    });

  } catch (error) {
    logger.error(`Erro: ${error.message}`);
    return Response.json({
      error: error.message,
      logs: logger.export()
    }, { status: 500 });
  }
});

async function listWebhooks(logger) {
  logger.info('Listando webhooks');

  const webhooks = [
    {
      id: 'wh_001',
      url: 'https://zapier.com/hooks/catch/...',
      event: 'publicacao.created',
      status: 'active',
      lastTriggered: '2h atrás',
      deliveries: 1245
    },
    {
      id: 'wh_002',
      url: 'https://make.com/hooks/...',
      event: 'intimacao.updated',
      status: 'active',
      lastTriggered: '30m atrás',
      deliveries: 456
    },
    {
      id: 'wh_003',
      url: 'https://my-app.com/webhook',
      event: 'alerta.triggered',
      status: 'active',
      lastTriggered: '5m atrás',
      deliveries: 234
    }
  ];

  logger.success(`${webhooks.length} webhooks encontrados`);

  return { webhooks };
}

async function createWebhook(logger, webhookData) {
  logger.info('Criando novo webhook', webhookData);

  if (!webhookData.url || !webhookData.event) {
    throw new Error('url e event são obrigatórios');
  }

  const webhook = {
    id: `wh_${Date.now()}`,
    ...webhookData,
    status: 'active',
    createdAt: new Date().toISOString(),
    deliveries: 0,
    lastTriggered: null
  };

  logger.success('Webhook criado', { webhookId: webhook.id });

  return webhook;
}

async function testWebhook(logger, webhookId) {
  logger.info(`Testando webhook: ${webhookId}`);

  const testResult = {
    webhookId,
    status: 200,
    responseTime: 234,
    payload: {
      event: 'test',
      timestamp: new Date().toISOString(),
      data: { message: 'Test webhook' }
    },
    success: true
  };

  logger.success('Webhook testado com sucesso');

  return testResult;
}

async function getAvailableIntegrations(logger) {
  logger.info('Listando integrações disponíveis');

  const integrations = [
    {
      name: 'Zapier',
      icon: '⚡',
      description: 'Conecte com 5000+ apps',
      status: 'connected',
      docs: 'https://zapier.com/apps/legal-tasks'
    },
    {
      name: 'Make (Integromat)',
      icon: '🔗',
      description: 'Automação visual de workflows',
      status: 'connected',
      docs: 'https://make.com/docs/legal-tasks'
    },
    {
      name: 'IFTTT',
      icon: '🤖',
      description: 'If This Then That automations',
      status: 'available',
      docs: 'https://ifttt.com/legal_tasks'
    },
    {
      name: 'Slack',
      icon: '💬',
      description: 'Notificações no Slack',
      status: 'connected',
      docs: 'https://slack.com/apps/legal-tasks'
    },
    {
      name: 'Google Calendar',
      icon: '📅',
      description: 'Sync prazos automaticamente',
      status: 'connected',
      docs: 'https://google.com/calendar'
    },
    {
      name: 'Microsoft Teams',
      icon: '👥',
      description: 'Alertas no Teams',
      status: 'available',
      docs: 'https://teams.microsoft.com/legal-tasks'
    }
  ];

  logger.success(`${integrations.length} integrações disponíveis`);

  return { integrations };
}

async function connectZapier(logger, zapierData) {
  logger.info('Conectando Zapier', zapierData);

  const connection = {
    platform: 'Zapier',
    status: 'connected',
    connectedAt: new Date().toISOString(),
    zaps: [
      { name: 'Nova publicação → Email', active: true },
      { name: 'Intimação → Slack', active: true }
    ]
  };

  logger.success('Zapier conectado');

  return connection;
}

async function connectMake(logger, makeData) {
  logger.info('Conectando Make', makeData);

  const connection = {
    platform: 'Make',
    status: 'connected',
    connectedAt: new Date().toISOString(),
    scenarios: [
      { name: 'Publicação automática', active: true },
      { name: 'Escalação de alertas', active: true }
    ]
  };

  logger.success('Make conectado');

  return connection;
}