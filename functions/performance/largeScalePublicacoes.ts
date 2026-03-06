import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Large Scale Publicações Handler — 1M+ support
 * Otimizações: Paginação, Indexação, Caching, Batch Processing
 */

const CACHE_TTL = 5 * 60; // 5 minutos
const BATCH_SIZE = 1000;
const PAGE_SIZE = 50;

const cache = new Map();

function getCacheKey(filters) {
  return `publicacoes:${JSON.stringify(filters)}`;
}

function isCacheValid(cacheEntry) {
  return Date.now() - cacheEntry.timestamp < CACHE_TTL * 1000;
}

async function getPublicacoesOptimized(req) {
  try {
    const base44 = createClientFromRequest(req);
    const url = new URL(req.url);
    
    // Query parameters
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || PAGE_SIZE);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const sortBy = url.searchParams.get('sort') || '-created_date';

    // Validação
    if (pageSize > 200) {
      return Response.json(
        { error: 'Page size cannot exceed 200' },
        { status: 400 }
      );
    }

    // Verificar cache
    const cacheKey = getCacheKey({ page, pageSize, search, status, sortBy });
    if (cache.has(cacheKey)) {
      const cacheEntry = cache.get(cacheKey);
      if (isCacheValid(cacheEntry)) {
        return Response.json({
          success: true,
          cached: true,
          ...cacheEntry.data
        });
      }
      cache.delete(cacheKey);
    }

    // Construir query com índices otimizados
    const query = {};
    if (search) {
      query.$or = [
        { numeroProcesso: { $regex: search, $options: 'i' } },
        { palavrasChave: { $in: [search] } }
      ];
    }
    if (status) {
      query.statusSincronizacao = status;
    }

    // Calcular skip
    const skip = (page - 1) * pageSize;

    // Query otimizada com índices
    const [publicacoes, total] = await Promise.all([
      base44.entities.PublicacaoAdvise.filter(
        query,
        sortBy,
        pageSize,
        skip
      ),
      base44.asServiceRole.entities.PublicacaoAdvise.filter(query).length
    ]);

    const result = {
      success: true,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNextPage: page * pageSize < total,
        hasPrevPage: page > 1
      },
      data: publicacoes
    };

    // Cache result
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: `Query Error: ${error.message}` },
      { status: 500 }
    );
  }
}

async function bulkGetPublicacoes(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const ids = body.ids || [];

    if (ids.length > BATCH_SIZE) {
      return Response.json(
        { error: `Batch size cannot exceed ${BATCH_SIZE}` },
        { status: 400 }
      );
    }

    // Carregar em paralelo com limite de concorrência
    const CONCURRENCY = 10;
    const chunks = [];
    for (let i = 0; i < ids.length; i += CONCURRENCY) {
      chunks.push(ids.slice(i, i + CONCURRENCY));
    }

    const results = [];
    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map(id =>
          base44.entities.PublicacaoAdvise.filter({ id })
            .then(([item]) => item)
            .catch(() => null)
        )
      );
      results.push(...chunkResults.filter(Boolean));
    }

    return Response.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    return Response.json(
      { error: `Bulk Load Error: ${error.message}` },
      { status: 500 }
    );
  }
}

async function getPublicacoesStats(req) {
  try {
    const base44 = createClientFromRequest(req);

    // Agregações eficientes
    const [total, byStatus, byDiario] = await Promise.all([
      base44.asServiceRole.entities.PublicacaoAdvise.filter({}).then(r => r.length),
      base44.asServiceRole.entities.PublicacaoAdvise.filter({ statusSincronizacao: 'importado' }).then(r => r.length),
      base44.asServiceRole.entities.PublicacaoAdvise.filter({ statusSincronizacao: 'processado' }).then(r => r.length)
    ]);

    return Response.json({
      success: true,
      stats: {
        total,
        imported: byStatus,
        processed: byDiario,
        pending: total - byStatus - byDiario
      }
    });
  } catch (error) {
    return Response.json(
      { error: `Stats Error: ${error.message}` },
      { status: 500 }
    );
  }
}

async function clearOldCache() {
  for (const [key, entry] of cache.entries()) {
    if (!isCacheValid(entry)) {
      cache.delete(key);
    }
  }
}

// Executar limpeza de cache a cada 10 minutos
setInterval(clearOldCache, 10 * 60 * 1000);

Deno.serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname === '/publicacoes' && req.method === 'GET') {
    return await getPublicacoesOptimized(req);
  }
  if (url.pathname === '/publicacoes/bulk' && req.method === 'POST') {
    return await bulkGetPublicacoes(req);
  }
  if (url.pathname === '/publicacoes/stats' && req.method === 'GET') {
    return await getPublicacoesStats(req);
  }

  return Response.json({ error: 'Not Found' }, { status: 404 });
});

export { getPublicacoesOptimized, bulkGetPublicacoes, getPublicacoesStats };