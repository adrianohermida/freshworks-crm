import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Cache Optimization para GA
 * LRU Cache com TTL por tipo de entity
 * Reduz latência e queryKey para endpoints críticos
 */

const CACHE_CONFIG = {
  'Process': { ttl: 5 * 60 * 1000, maxSize: 500 },
  'TPUAssuntos': { ttl: 60 * 60 * 1000, maxSize: 5000 },
  'TPUClasses': { ttl: 60 * 60 * 1000, maxSize: 3000 },
  'TPUMovimentos': { ttl: 60 * 60 * 1000, maxSize: 10000 },
  'TPUDocumentos': { ttl: 60 * 60 * 1000, maxSize: 8000 },
  'Deadline': { ttl: 30 * 60 * 1000, maxSize: 1000 },
  'Publication': { ttl: 30 * 60 * 1000, maxSize: 1000 }
};

// In-memory LRU cache
const cache = new Map();

function getOrSetCache(key, ttl, maxSize) {
  if (cache.has(key)) {
    const entry = cache.get(key);
    if (Date.now() - entry.timestamp < ttl) {
      entry.hits = (entry.hits || 0) + 1;
      return entry.data;
    }
    cache.delete(key);
  }

  // Evict oldest entry if cache is full
  if (cache.size >= maxSize) {
    const oldestKey = [...cache.entries()].sort((a, b) => 
      (a[1].timestamp || 0) - (b[1].timestamp || 0)
    )[0][0];
    cache.delete(oldestKey);
  }

  return null;
}

function setCache(key, data, ttl) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { action, entity, entityId } = await req.json();

    if (!action) {
      return Response.json({ error: 'Missing action parameter' }, { status: 400 });
    }

    const result = {
      action,
      timestamp: new Date().toISOString(),
      cacheStatus: {}
    };

    if (action === 'status') {
      // Retornar status do cache
      for (const [key, entry] of cache.entries()) {
        result.cacheStatus[key] = {
          hits: entry.hits || 0,
          age_ms: Date.now() - entry.timestamp,
          size: JSON.stringify(entry.data).length
        };
      }

      result.stats = {
        total_entries: cache.size,
        total_memory_bytes: JSON.stringify(Object.fromEntries(cache)).length
      };
    } else if (action === 'clear') {
      // Limpar cache
      const clearedSize = cache.size;
      cache.clear();
      result.cleared = clearedSize;
    } else if (action === 'invalidate' && entity) {
      // Invalidar cache de uma entidade
      let invalidated = 0;
      for (const key of cache.keys()) {
        if (key.includes(entity)) {
          cache.delete(key);
          invalidated++;
        }
      }
      result.invalidated = invalidated;
    } else if (action === 'config') {
      // Retornar configuração de cache
      result.config = CACHE_CONFIG;
    }

    // Track optimization
    await base44.asServiceRole.entities.Analytics.create({
      user_id: user.email,
      event_type: 'cache_optimization',
      entity_type: 'system',
      action: `Cache operation: ${action}`,
      timestamp: new Date().toISOString(),
      metadata: result,
      status: 'success'
    });

    return Response.json(result);

  } catch (error) {
    console.error('[cacheOptimization]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});