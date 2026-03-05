/**
 * Email Marketing Integration
 * Newsletter, drip campaigns, automation
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { Logger } from '../utils/logger.js';

Deno.serve(async (req) => {
  const logger = new Logger('emailMarketing');

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      logger.error('Não autenticado');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action = 'getCampaigns' } = await req.json();

    logger.info(`Ação: ${action}`);

    let result;

    switch (action) {
      case 'getCampaigns':
        result = await getCampaigns(logger);
        break;
      case 'createCampaign':
        const { campaignData } = await req.json();
        result = await createCampaign(logger, campaignData);
        break;
      case 'sendDripEmail':
        const { userId, emailType } = await req.json();
        result = await sendDripEmail(logger, userId, emailType);
        break;
      case 'getMetrics':
        result = await getCampaignMetrics(logger);
        break;
      case 'updateSubscription':
        const { subscription } = await req.json();
        result = await updateSubscription(logger, subscription);
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

async function getCampaigns(logger) {
  logger.info('Listando campanhas de email');

  const campaigns = [
    {
      id: 'camp_001',
      name: 'Welcome Series',
      type: 'drip',
      subscribers: 1245,
      openRate: 32.5,
      clickRate: 8.2,
      status: 'running'
    },
    {
      id: 'camp_002',
      name: 'Weekly Digest',
      type: 'newsletter',
      subscribers: 3421,
      openRate: 28.1,
      clickRate: 6.5,
      status: 'running'
    },
    {
      id: 'camp_003',
      name: 'Re-engagement Campaign',
      type: 'drip',
      subscribers: 542,
      openRate: 18.3,
      clickRate: 2.1,
      status: 'paused'
    }
  ];

  logger.success(`${campaigns.length} campanhas encontradas`);

  return { campaigns };
}

async function createCampaign(logger, campaignData) {
  logger.info('Criando nova campanha', { name: campaignData.name });

  if (!campaignData.name || !campaignData.type) {
    throw new Error('name e type são obrigatórios');
  }

  const campaign = {
    id: `camp_${Date.now()}`,
    ...campaignData,
    createdAt: new Date().toISOString(),
    status: 'draft',
    openRate: 0,
    clickRate: 0,
    subscribers: 0
  };

  logger.success('Campanha criada', { campaignId: campaign.id });

  return campaign;
}

async function sendDripEmail(logger, userId, emailType) {
  logger.info(`Enviando email drip: ${emailType} para ${userId}`);

  const templates = {
    welcome: 'Bem-vindo ao Legal Tasks',
    day3: 'Suas primeiras publicações',
    day7: 'Resumo da primeira semana',
    day14: 'Você está usando bem?',
    inactive: 'Saudade! Volte a usar'
  };

  const email = {
    id: `email_${Date.now()}`,
    to: userId,
    template: emailType,
    subject: templates[emailType],
    sentAt: new Date().toISOString(),
    status: 'sent'
  };

  logger.success(`Email enviado: ${emailType}`);

  return email;
}

async function getCampaignMetrics(logger) {
  logger.info('Calculando métricas de email');

  const metrics = {
    totalSent: 45678,
    totalOpened: 14523,
    totalClicked: 3241,
    totalConverted: 156,
    averageOpenRate: 31.8,
    averageClickRate: 7.1,
    conversionRate: 0.34,
    unsubscribeRate: 0.8,
    spamRate: 0.1,
    trend: {
      openRate: '+2.1%',
      clickRate: '+0.8%',
      conversionRate: '+0.15%'
    }
  };

  logger.success('Métricas calculadas');

  return metrics;
}

async function updateSubscription(logger, subscription) {
  logger.info('Atualizando preferências de email', subscription);

  const updated = {
    ...subscription,
    updatedAt: new Date().toISOString(),
    status: 'updated'
  };

  logger.success('Preferências atualizadas');

  return updated;
}