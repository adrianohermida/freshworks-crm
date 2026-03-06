/**
 * API REST Pública
 * Endpoints documentados para acesso externo com rate limiting
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { Logger } from '../utils/logger.js';

const RATE_LIMIT_STORE = new Map();
const RATE_LIMIT = { requests: 100, windowMs: 60000 }; // 100 req/min

Deno.serve(async (req) => {
  const logger = new Logger('publicAPI');

  try {
    // Rate limiting
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIp, logger)) {
      logger.warn(`Rate limit excedido para ${clientIp}`);
      return Response.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    logger.info(`${method} ${path}`);

    // Rotas públicas
    if (path === '/api/v1/publicacoes' && method === 'GET') {
      return handleGetPublicacoes(req, logger);
    }
    if (path === '/api/v1/intimacoes' && method === 'GET') {
      return handleGetIntimacoes(req, logger);
    }
    if (path === '/api/v1/processos' && method === 'GET') {
      return handleGetProcessos(req, logger);
    }
    if (path === '/api/v1/stats' && method === 'GET') {
      return handleGetStats(req, logger);
    }
    if (path === '/api/v1/docs' && method === 'GET') {
      return handleGetDocs(logger);
    }

    return Response.json(
      { error: 'Endpoint não encontrado' },
      { status: 404 }
    );

  } catch (error) {
    logger.error(`Erro: ${error.message}`);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});

function checkRateLimit(clientIp, logger) {
  const now = Date.now();
  const key = clientIp;

  if (!RATE_LIMIT_STORE.has(key)) {
    RATE_LIMIT_STORE.set(key, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return true;
  }

  const record = RATE_LIMIT_STORE.get(key);
  
  if (now > record.resetAt) {
    RATE_LIMIT_STORE.set(key, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return true;
  }

  if (record.count >= RATE_LIMIT.requests) {
    return false;
  }

  record.count++;
  return true;
}

async function handleGetPublicacoes(req, logger) {
  const base44 = createClientFromRequest(req);
  const url = new URL(req.url);
  
  const limit = Math.min(parseInt(url.searchParams.get('limit')) || 20, 100);
  const offset = parseInt(url.searchParams.get('offset')) || 0;
  const status = url.searchParams.get('status');

  logger.info('GET /publicacoes', { limit, offset, status });

  const publicacoes = await base44.asServiceRole.entities.PublicacaoAdvise.list('-dataPublicacao', limit + offset);
  const filtered = status 
    ? publicacoes.filter(p => p.statusSincronizacao === status)
    : publicacoes;

  return Response.json({
    success: true,
    data: filtered.slice(offset, offset + limit),
    pagination: {
      limit,
      offset,
      total: filtered.length
    },
    _links: {
      self: `/api/v1/publicacoes?limit=${limit}&offset=${offset}`,
      next: offset + limit < filtered.length ? `/api/v1/publicacoes?limit=${limit}&offset=${offset + limit}` : null,
      prev: offset > 0 ? `/api/v1/publicacoes?limit=${limit}&offset=${Math.max(0, offset - limit)}` : null
    }
  }, {
    headers: {
      'Content-Type': 'application/json',
      'X-Total-Count': filtered.length.toString(),
      'X-Rate-Limit-Remaining': '95'
    }
  });
}

async function handleGetIntimacoes(req, logger) {
  const base44 = createClientFromRequest(req);
  const url = new URL(req.url);

  const limit = Math.min(parseInt(url.searchParams.get('limit')) || 20, 100);
  const offset = parseInt(url.searchParams.get('offset')) || 0;

  logger.info('GET /intimacoes', { limit, offset });

  const intimacoes = await base44.asServiceRole.entities.IntimacaoAdvise.list('-dataIntimacao', limit + offset);

  return Response.json({
    success: true,
    data: intimacoes.slice(offset, offset + limit),
    pagination: { limit, offset, total: intimacoes.length }
  }, {
    headers: { 'X-Total-Count': intimacoes.length.toString() }
  });
}

async function handleGetProcessos(req, logger) {
  const base44 = createClientFromRequest(req);
  const url = new URL(req.url);

  const limit = Math.min(parseInt(url.searchParams.get('limit')) || 20, 100);
  const numeroProcesso = url.searchParams.get('numeroProcesso');

  logger.info('GET /processos', { limit, numeroProcesso });

  const processos = await base44.asServiceRole.entities.ProcessoAdvise.list('-dataDistribuicao', limit);

  return Response.json({
    success: true,
    data: processos,
    filters: { numeroProcesso }
  });
}

async function handleGetStats(req, logger) {
  const base44 = createClientFromRequest(req);

  logger.info('GET /stats');

  const pubs = await base44.asServiceRole.entities.PublicacaoAdvise.list();
  const ints = await base44.asServiceRole.entities.IntimacaoAdvise.list();

  return Response.json({
    success: true,
    stats: {
      totalPublicacoes: pubs.length,
      totalIntimacoes: ints.length,
      publicacoesNaoLidas: pubs.filter(p => !p.lido).length,
      intimacoesPendentes: ints.filter(i => i.statusIntimacao === 'pendente').length,
      lastSync: new Date().toISOString()
    }
  });
}

function handleGetDocs(logger) {
  logger.info('GET /docs (OpenAPI)');

  const docs = {
    openapi: '3.0.0',
    info: {
      title: 'Legal Tasks API',
      version: '1.0.0',
      description: 'API pública para acesso a publicações, intimações e processos'
    },
    servers: [{ url: '/api/v1' }],
    paths: {
      '/publicacoes': {
        get: {
          summary: 'Listar publicações',
          parameters: [
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20, maximum: 100 } },
            { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['importado', 'processado', 'pendente'] } }
          ],
          responses: { 200: { description: 'Lista de publicações' } }
        }
      },
      '/intimacoes': {
        get: {
          summary: 'Listar intimações',
          responses: { 200: { description: 'Lista de intimações' } }
        }
      },
      '/stats': {
        get: {
          summary: 'Estatísticas gerais',
          responses: { 200: { description: 'Estatísticas da plataforma' } }
        }
      }
    }
  };

  return Response.json(docs, {
    headers: { 'Content-Type': 'application/json' }
  });
}