/**
 * Validação de Integridade de Dados
 * Detecta duplicatas, corrupção, inconsistências
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { Logger } from '../utils/logger.js';

Deno.serve(async (req) => {
  const logger = new Logger('validateDataIntegrity');

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      logger.error('Não autenticado');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.info('Iniciando validação de integridade');

    const publicacoes = await base44.asServiceRole.entities.PublicacaoAdvise.list();
    logger.info(`Total de registros: ${publicacoes.length}`);

    const validation = {
      duplicates: findDuplicates(publicacoes, logger),
      corruption: findCorruption(publicacoes, logger),
      inconsistencies: findInconsistencies(publicacoes, logger),
      stats: calculateStats(publicacoes)
    };

    const totalIssues = 
      validation.duplicates.count + 
      validation.corruption.count + 
      validation.inconsistencies.count;

    const healthStatus = totalIssues === 0 ? 'HEALTHY' : 'WARNING';

    logger.success(`Validação concluída: ${totalIssues} problemas encontrados`);

    return Response.json({
      healthStatus,
      totalRecords: publicacoes.length,
      totalIssues,
      validation,
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

function findDuplicates(records, logger) {
  logger.info('Verificando duplicatas...');
  
  const seen = new Map();
  const duplicates = [];

  records.forEach(record => {
    const key = record.idPublicacaoAdvise;
    
    if (seen.has(key)) {
      duplicates.push({
        id: record.idPublicacaoAdvise,
        count: (seen.get(key) || 0) + 1
      });
      seen.set(key, (seen.get(key) || 0) + 1);
    } else {
      seen.set(key, 1);
    }
  });

  if (duplicates.length > 0) {
    logger.warn(`⚠️ ${duplicates.length} IDs duplicados encontrados`);
  } else {
    logger.success('✅ Nenhuma duplicata encontrada');
  }

  return {
    count: duplicates.length,
    details: duplicates.slice(0, 10)
  };
}

function findCorruption(records, logger) {
  logger.info('Verificando corrupção de dados...');
  
  const corrupted = [];

  records.forEach(record => {
    const issues = [];

    // Validar campos obrigatórios
    if (!record.numeroProcesso || record.numeroProcesso.trim() === '') {
      issues.push('numeroProcesso vazio');
    }

    if (!record.idPublicacaoAdvise || record.idPublicacaoAdvise.trim() === '') {
      issues.push('idPublicacaoAdvise vazio');
    }

    // Validar datas
    if (record.dataPublicacao) {
      try {
        new Date(record.dataPublicacao);
      } catch (e) {
        issues.push('dataPublicacao inválida');
      }
    }

    // Validar tamanho de conteúdo
    if (record.conteudo && record.conteudo.length > 100000) {
      issues.push('conteudo muito grande (>100KB)');
    }

    if (issues.length > 0) {
      corrupted.push({
        id: record.id,
        issues
      });
    }
  });

  if (corrupted.length > 0) {
    logger.warn(`⚠️ ${corrupted.length} registros com dados corrompidos`);
  } else {
    logger.success('✅ Nenhuma corrupção detectada');
  }

  return {
    count: corrupted.length,
    details: corrupted.slice(0, 10)
  };
}

function findInconsistencies(records, logger) {
  logger.info('Verificando inconsistências...');
  
  const inconsistencies = [];

  // Data de sincronização mais recente que data de publicação
  records.forEach(record => {
    if (record.dataSincronizacao && record.dataPublicacao) {
      const syncDate = new Date(record.dataSincronizacao);
      const pubDate = new Date(record.dataPublicacao);
      
      if (syncDate < pubDate) {
        inconsistencies.push({
          id: record.id,
          issue: 'dataSincronizacao anterior à dataPublicacao'
        });
      }
    }

    // Status inválido
    if (record.statusSincronizacao && !['importado', 'processado', 'pendente'].includes(record.statusSincronizacao)) {
      inconsistencies.push({
        id: record.id,
        issue: `statusSincronizacao inválido: ${record.statusSincronizacao}`
      });
    }
  });

  if (inconsistencies.length > 0) {
    logger.warn(`⚠️ ${inconsistencies.length} inconsistências encontradas`);
  } else {
    logger.success('✅ Nenhuma inconsistência encontrada');
  }

  return {
    count: inconsistencies.length,
    details: inconsistencies.slice(0, 10)
  };
}

function calculateStats(records) {
  const now = new Date();
  const stats = {
    total: records.length,
    read: records.filter(r => r.lido).length,
    unread: records.filter(r => !r.lido).length,
    byStatus: {},
    oldestRecord: null,
    newestRecord: null,
    averageAgeHours: 0
  };

  // Por status
  ['importado', 'processado', 'pendente'].forEach(status => {
    stats.byStatus[status] = records.filter(r => r.statusSincronizacao === status).length;
  });

  // Datas
  if (records.length > 0) {
    const dates = records
      .map(r => r.dataPublicacao ? new Date(r.dataPublicacao) : null)
      .filter(d => d !== null)
      .sort((a, b) => a - b);

    if (dates.length > 0) {
      stats.oldestRecord = dates[0].toISOString();
      stats.newestRecord = dates[dates.length - 1].toISOString();
      
      const totalHours = dates.reduce((sum, d) => sum + (now - d) / (1000 * 60 * 60), 0);
      stats.averageAgeHours = (totalHours / dates.length).toFixed(1);
    }
  }

  return stats;
}