/**
 * SLA Monitoring
 * Rastreia violações de SLA e alertas críticos
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { Logger } from '../utils/logger.js';

Deno.serve(async (req) => {
  const logger = new Logger('slaMonitoring');

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      logger.error('Não autenticado');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.info('Verificando violações de SLA');

    // SLA Definitions
    const SLA_DEFINITIONS = {
      SYNC_LATENCY: { threshold: 5 * 60 * 1000, name: 'Latência Sync' }, // 5 min
      DATA_STALENESS: { threshold: 24 * 60 * 60 * 1000, name: 'Dados Obsoletos' }, // 24h
      ERROR_RATE: { threshold: 5, name: 'Taxa de Erro' }, // 5%
      AVAILABILITY: { threshold: 99.5, name: 'Disponibilidade' } // 99.5%
    };

    const violations = {
      syncLatency: await checkSyncLatency(base44, logger, SLA_DEFINITIONS.SYNC_LATENCY),
      dataFreshness: await checkDataFreshness(base44, logger, SLA_DEFINITIONS.DATA_STALENESS),
      errorRate: await checkErrorRate(base44, logger, SLA_DEFINITIONS.ERROR_RATE),
      availability: await checkAvailability(base44, logger, SLA_DEFINITIONS.AVAILABILITY)
    };

    const violationCount = Object.values(violations).filter(v => v.violated).length;
    const slaStatus = violationCount === 0 ? 'HEALTHY' : violationCount <= 1 ? 'WARNING' : 'CRITICAL';

    logger.success(`SLA check concluído: ${violationCount} violações detectadas`);

    return Response.json({
      slaStatus,
      violationCount,
      violations,
      timestamp: new Date().toISOString(),
      logs: logger.export()
    });

  } catch (error) {
    logger.error(`Erro fatal: ${error.message}`);
    return Response.json({
      error: error.message,
      logs: logger.export()
    }, { status: 500 });
  }
});

async function checkSyncLatency(base44, logger, sla) {
  logger.info(`Verificando ${sla.name}...`);
  
  try {
    const config = await base44.asServiceRole.entities.AdviseConfig.list();
    if (!config.length) {
      return { violated: false, reason: 'Sem configuração', lastSync: null };
    }

    const lastSync = config[0].ultimaSincronizacao;
    if (!lastSync) {
      return { violated: true, reason: 'Nunca sincronizou', lastSync: null };
    }

    const timeSinceSync = Date.now() - new Date(lastSync).getTime();
    const violated = timeSinceSync > sla.threshold;

    logger.info(`${sla.name}: ${(timeSinceSync / 1000).toFixed(0)}s (limiar: ${(sla.threshold / 1000).toFixed(0)}s)`);

    return {
      violated,
      lastSync,
      timeSinceSyncMs: timeSinceSync,
      thresholdMs: sla.threshold,
      reason: violated ? 'Acima do limiar' : 'Dentro do limiar'
    };
  } catch (error) {
    logger.error(`Erro ao verificar ${sla.name}: ${error.message}`);
    return { violated: true, reason: error.message };
  }
}

async function checkDataFreshness(base44, logger, sla) {
  logger.info(`Verificando ${sla.name}...`);
  
  try {
    const publicacoes = await base44.asServiceRole.entities.PublicacaoAdvise.list('-dataPublicacao');
    if (!publicacoes.length) {
      return { violated: false, reason: 'Sem dados', oldestRecord: null };
    }

    const oldest = publicacoes[publicacoes.length - 1];
    const oldestDate = new Date(oldest.dataPublicacao || oldest.dataSincronizacao);
    const ageMs = Date.now() - oldestDate.getTime();
    const violated = ageMs > sla.threshold;

    logger.info(`${sla.name}: Registro mais antigo tem ${(ageMs / (60 * 60 * 1000)).toFixed(1)}h`);

    return {
      violated,
      oldestRecord: oldestDate.toISOString(),
      ageHours: (ageMs / (60 * 60 * 1000)).toFixed(1),
      thresholdHours: (sla.threshold / (60 * 60 * 1000)).toFixed(1),
      reason: violated ? 'Dados muito antigos' : 'Dados frescos'
    };
  } catch (error) {
    logger.error(`Erro ao verificar ${sla.name}: ${error.message}`);
    return { violated: true, reason: error.message };
  }
}

async function checkErrorRate(base44, logger, sla) {
  logger.info(`Verificando ${sla.name}...`);
  
  try {
    // Simular taxa de erro (em produção, vir de logs real)
    const errorRate = Math.random() * 8;
    const violated = errorRate > sla.threshold;

    logger.info(`${sla.name}: ${errorRate.toFixed(2)}% (limiar: ${sla.threshold}%)`);

    return {
      violated,
      errorRate: errorRate.toFixed(2),
      threshold: sla.threshold,
      reason: violated ? 'Taxa acima do limiar' : 'Taxa normal'
    };
  } catch (error) {
    logger.error(`Erro ao verificar ${sla.name}: ${error.message}`);
    return { violated: true, reason: error.message };
  }
}

async function checkAvailability(base44, logger, sla) {
  logger.info(`Verificando ${sla.name}...`);
  
  try {
    // Simular disponibilidade (em produção, calcular de uptime real)
    const availability = 99.8;
    const violated = availability < sla.threshold;

    logger.info(`${sla.name}: ${availability}% (limiar: ${sla.threshold}%)`);

    return {
      violated,
      availability: availability.toFixed(2),
      threshold: sla.threshold,
      reason: violated ? 'Abaixo do limiar' : 'Acima do limiar'
    };
  } catch (error) {
    logger.error(`Erro ao verificar ${sla.name}: ${error.message}`);
    return { violated: true, reason: error.message };
  }
}