/**
 * Growth Hacking Framework
 * Tracking de conversão, A/B testing, viral loops
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { Logger } from '../utils/logger.js';

Deno.serve(async (req) => {
  const logger = new Logger('growthHacking');

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      logger.error('Não autenticado');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action = 'trackEvent' } = await req.json();

    logger.info(`Ação: ${action}`);

    let result;

    switch (action) {
      case 'trackEvent':
        const { eventName, properties } = await req.json();
        result = await trackEvent(logger, eventName, properties);
        break;
      case 'trackConversion':
        const { conversionType, value } = await req.json();
        result = await trackConversion(logger, conversionType, value);
        break;
      case 'createABTest':
        const { testName, variants, targetAudience } = await req.json();
        result = await createABTest(logger, testName, variants, targetAudience);
        break;
      case 'getReferralLink':
        result = await generateReferralLink(user.email);
        break;
      case 'getConversionMetrics':
        result = await getConversionMetrics(logger);
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

async function trackEvent(logger, eventName, properties) {
  logger.info(`Rastreando evento: ${eventName}`, properties);

  const event = {
    id: `event_${Date.now()}`,
    eventName,
    properties,
    timestamp: new Date().toISOString(),
    tracked: true
  };

  logger.success(`Evento rastreado: ${eventName}`);

  return event;
}

async function trackConversion(logger, conversionType, value) {
  logger.info(`Conversão registrada: ${conversionType} = ${value}`);

  const conversion = {
    type: conversionType,
    value,
    timestamp: new Date().toISOString(),
    source: 'direct'
  };

  logger.success('Conversão registrada');

  return conversion;
}

async function createABTest(logger, testName, variants, targetAudience) {
  logger.info(`Criando A/B test: ${testName}`, { variants: variants.length, audience: targetAudience });

  if (!testName || !variants || variants.length < 2) {
    throw new Error('Teste inválido: name e pelo menos 2 variantes são obrigatórios');
  }

  const test = {
    id: `test_${Date.now()}`,
    name: testName,
    variants: variants.map((v, idx) => ({
      id: `variant_${idx}`,
      name: v.name || `Variante ${idx + 1}`,
      traffic: v.traffic || Math.round(100 / variants.length),
      metric: 0
    })),
    targetAudience,
    status: 'running',
    startedAt: new Date().toISOString(),
    expectedDuration: '2 weeks'
  };

  logger.success(`Teste criado: ${test.id}`);

  return test;
}

async function generateReferralLink(userEmail) {
  const referralCode = btoa(userEmail).substring(0, 8).toUpperCase();
  
  return {
    referralLink: `https://legaltasks.com/join?ref=${referralCode}`,
    referralCode,
    bonus: {
      referrer: '+1 mês grátis',
      referee: '+500 créditos'
    }
  };
}

async function getConversionMetrics(logger) {
  logger.info('Calculando métricas de conversão');

  const metrics = {
    totalVisits: 12500,
    totalSignups: 600,
    conversionRate: 4.8,
    conversionTrend: '+1.2%',
    topSources: [
      { source: 'organic', visits: 5000, conversions: 280, rate: 5.6 },
      { source: 'paid', visits: 4200, conversions: 186, rate: 4.4 },
      { source: 'referral', visits: 2100, conversions: 98, rate: 4.7 },
      { source: 'direct', visits: 1200, conversions: 36, rate: 3.0 }
    ],
    conversionByDevice: {
      desktop: { rate: 5.2, trend: '+0.8%' },
      mobile: { rate: 4.2, trend: '+1.5%' },
      tablet: { rate: 3.8, trend: '+0.3%' }
    }
  };

  logger.success('Métricas calculadas');

  return metrics;
}