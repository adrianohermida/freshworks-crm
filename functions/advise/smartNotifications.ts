/**
 * Notificações Inteligentes
 * Sistema de notificações com regras customizadas e segmentação
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { Logger } from '../utils/logger.js';

Deno.serve(async (req) => {
  const logger = new Logger('smartNotifications');

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      logger.error('Não autenticado');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action = 'getTriggers' } = await req.json();

    logger.info(`Ação: ${action}`);

    let result;

    switch (action) {
      case 'getTriggers':
        result = getAvailableTriggers();
        break;
      case 'createRule':
        const { rule } = await req.json();
        result = await createNotificationRule(base44, logger, rule);
        break;
      case 'evaluateRules':
        result = await evaluateAllRules(base44, logger);
        break;
      case 'sendNotification':
        const { userId, message, type } = await req.json();
        result = await sendNotification(base44, logger, userId, message, type);
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

function getAvailableTriggers() {
  return {
    triggers: [
      {
        id: 'new_publication',
        name: 'Nova Publicação',
        description: 'Disparado quando nova publicação é sincronizada',
        parameters: ['tribunal', 'vara', 'keywords']
      },
      {
        id: 'deadline_approaching',
        name: 'Prazo Próximo',
        description: 'Disparado quando prazo está próximo',
        parameters: ['daysThreshold']
      },
      {
        id: 'intimation_received',
        name: 'Intimação Recebida',
        description: 'Disparado quando nova intimação é recebida',
        parameters: ['fonte', 'tipo']
      },
      {
        id: 'sync_failed',
        name: 'Sincronização Falhou',
        description: 'Disparado quando sincronização falha',
        parameters: ['retryCount']
      },
      {
        id: 'sla_violation',
        name: 'Violação de SLA',
        description: 'Disparado quando SLA é violado',
        parameters: ['metric', 'threshold']
      }
    ],
    actions: [
      { id: 'email', name: 'Enviar Email' },
      { id: 'push', name: 'Push Notification' },
      { id: 'sms', name: 'SMS' },
      { id: 'inApp', name: 'Notificação In-App' },
      { id: 'webhook', name: 'Webhook' }
    ]
  };
}

async function createNotificationRule(base44, logger, rule) {
  logger.info('Criando regra de notificação', { ruleName: rule.name });

  // Validar regra
  if (!rule.name || !rule.trigger || !rule.action) {
    throw new Error('Regra inválida: name, trigger e action são obrigatórios');
  }

  // Salvar regra (simular persistência)
  const savedRule = {
    id: `rule_${Date.now()}`,
    ...rule,
    createdAt: new Date().toISOString(),
    enabled: true
  };

  logger.success('Regra criada', { ruleId: savedRule.id });

  return savedRule;
}

async function evaluateAllRules(base44, logger) {
  logger.info('Avaliando todas as regras');

  const publicacoes = await base44.asServiceRole.entities.PublicacaoAdvise.list('-dataPublicacao', 100);
  const intimacoes = await base44.asServiceRole.entities.IntimacaoAdvise.list('-dataIntimacao', 100);

  const notifications = [];

  // Avaliação de triggers (simulado)
  
  // Trigger: Nova publicação não lida
  const unread = publicacoes.filter(p => !p.lido);
  if (unread.length > 0) {
    logger.info(`Detectadas ${unread.length} publicações não lidas`);
    notifications.push({
      trigger: 'new_publication',
      count: unread.length,
      action: 'Enviar email para usuário',
      priority: 'ALTA'
    });
  }

  // Trigger: Intimações pendentes
  const pending = intimacoes.filter(i => i.statusIntimacao === 'pendente');
  if (pending.length > 0) {
    logger.info(`Detectadas ${pending.length} intimações pendentes`);
    notifications.push({
      trigger: 'intimation_received',
      count: pending.length,
      action: 'Push notification + Email',
      priority: 'CRÍTICA'
    });
  }

  logger.success(`Avaliação concluída: ${notifications.length} notificações a disparar`);

  return {
    toNotify: notifications.length,
    notifications
  };
}

async function sendNotification(base44, logger, userId, message, type = 'inApp') {
  logger.info('Enviando notificação', { userId, type });

  // Validar usuário
  if (!userId || !message) {
    throw new Error('userId e message são obrigatórios');
  }

  // Simular envio
  const notification = {
    id: `notif_${Date.now()}`,
    userId,
    message,
    type,
    status: 'sent',
    sentAt: new Date().toISOString()
  };

  logger.success('Notificação enviada', { notifId: notification.id });

  return notification;
}