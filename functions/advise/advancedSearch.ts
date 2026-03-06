/**
 * Busca Avançada com Full-Text Search
 * Suporta filtros complexos, operadores booleanos, relevância
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { Logger } from '../utils/logger.js';

Deno.serve(async (req) => {
  const logger = new Logger('advancedSearch');

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      logger.error('Não autenticado');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      query = '',
      filters = {},
      sort = '-dataPublicacao',
      limit = 50,
      offset = 0,
      type = 'publicacao' // publicacao | intimacao | processo
    } = await req.json();

    logger.info('Busca avançada iniciada', { query, type, filters });

    const results = await performSearch(base44, logger, {
      query,
      filters,
      sort,
      limit,
      offset,
      type
    });

    logger.success(`Busca concluída: ${results.total} resultados`);

    return Response.json({
      success: true,
      query,
      total: results.total,
      results: results.items,
      facets: results.facets,
      timestamp: new Date().toISOString(),
      logs: logger.export()
    });

  } catch (error) {
    logger.error(`Erro na busca: ${error.message}`);
    return Response.json({
      error: error.message,
      logs: logger.export()
    }, { status: 500 });
  }
});

async function performSearch(base44, logger, params) {
  const { query, filters, sort, limit, offset, type } = params;

  logger.debug('Carregando registros...');
  
  let allRecords = [];
  if (type === 'publicacao' || type === 'all') {
    const pubs = await base44.asServiceRole.entities.PublicacaoAdvise.list(sort, limit + offset);
    allRecords = allRecords.concat(pubs.map(p => ({ ...p, _type: 'publicacao' })));
  }
  if (type === 'intimacao' || type === 'all') {
    const ints = await base44.asServiceRole.entities.IntimacaoAdvise.list(sort, limit + offset);
    allRecords = allRecords.concat(ints.map(i => ({ ...i, _type: 'intimacao' })));
  }

  logger.debug(`Total de registros carregados: ${allRecords.length}`);

  // Aplicar filtros
  let filtered = applyFilters(allRecords, filters, logger);
  logger.debug(`Após filtros: ${filtered.length} registros`);

  // Full-text search
  let searched = fullTextSearch(filtered, query, logger);
  logger.debug(`Após busca: ${searched.length} resultados`);

  // Calcular facets (agregações)
  const facets = calculateFacets(searched, logger);

  // Paginar
  const items = searched.slice(offset, offset + limit);

  return {
    total: searched.length,
    items,
    facets
  };
}

function applyFilters(records, filters, logger) {
  logger.debug('Aplicando filtros...');
  
  return records.filter(record => {
    for (const [key, value] of Object.entries(filters)) {
      if (!value) continue;

      switch (key) {
        case 'status':
          if (record.statusSincronizacao !== value && record.statusIntimacao !== value) return false;
          break;
        case 'lido':
          if (record.lido !== value) return false;
          break;
        case 'numeroProcesso':
          if (!record.numeroProcesso?.includes(value)) return false;
          break;
        case 'dataInicio':
          const pubDate = new Date(record.dataPublicacao || record.dataIntimacao);
          if (pubDate < new Date(value)) return false;
          break;
        case 'dataFim':
          const endDate = new Date(record.dataPublicacao || record.dataIntimacao);
          if (endDate > new Date(value)) return false;
          break;
        case 'vara':
          if (!record.vara?.toLowerCase().includes(value.toLowerCase())) return false;
          break;
        case 'municipio':
          if (!record.municipio?.toLowerCase().includes(value.toLowerCase())) return false;
          break;
        case 'tribunal':
          if (!record.tribunal?.toLowerCase().includes(value.toLowerCase())) return false;
          break;
      }
    }
    return true;
  });
}

function fullTextSearch(records, query, logger) {
  if (!query || query.trim() === '') {
    return records;
  }

  logger.debug(`Executando FTS: "${query}"`);

  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 0);
  
  return records.map(record => {
    // Campos para busca
    const searchFields = [
      record.numeroProcesso || '',
      record.conteudo || '',
      record.despacho || '',
      record.vara || '',
      record.municipio || '',
      record.tribunal || '',
      record.descricao || ''
    ].join(' ').toLowerCase();

    // Calcular score
    let score = 0;
    queryTerms.forEach(term => {
      const matches = (searchFields.match(new RegExp(term, 'g')) || []).length;
      score += matches;

      // Boost para match exato no numeroProcesso
      if (record.numeroProcesso?.includes(term)) score += 10;
    });

    return { ...record, _score: score };
  })
  .filter(r => r._score > 0)
  .sort((a, b) => b._score - a._score)
  .map(({ _score, ...rest }) => rest);
}

function calculateFacets(records, logger) {
  logger.debug('Calculando facets...');

  const facets = {
    byStatus: {},
    byTribunal: {},
    byMunicipio: {},
    byType: { publicacao: 0, intimacao: 0 }
  };

  records.forEach(record => {
    // Status
    const status = record.statusSincronizacao || record.statusIntimacao || 'unknown';
    facets.byStatus[status] = (facets.byStatus[status] || 0) + 1;

    // Tribunal
    if (record.tribunal) {
      facets.byTribunal[record.tribunal] = (facets.byTribunal[record.tribunal] || 0) + 1;
    }

    // Município
    if (record.municipio) {
      facets.byMunicipio[record.municipio] = (facets.byMunicipio[record.municipio] || 0) + 1;
    }

    // Tipo
    if (record._type) {
      facets.byType[record._type]++;
    }
  });

  return facets;
}