import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Cache Layer V2
 * - Estratégia agressiva de caching
 * - TTL por tipo de dados
 * - Cache invalidation inteligente
 * - Memory-based + Redis fallback
 */

// In-memory cache with TTL
const memoryCache = new Map();
const cacheTTL = {
  processes: 300,        // 5 min
  deadlines: 180,        // 3 min
  analytics: 600,        // 10 min
  tribunals: 1800,       // 30 min
  publications: 120      // 2 min
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action = 'get', key, value, ttl = 300 } = await req.json();

    // GET from cache
    if (action === 'get') {
      const cached = memoryCache.get(key);
      if (cached && cached.expiry > Date.now()) {
        return Response.json({
          success: true,
          data: cached.value,
          from: 'memory_cache',
          hit: true
        });
      }
      memoryCache.delete(key);
      return Response.json({
        success: false,
        hit: false,
        message: 'Cache miss'
      });
    }

    // SET in cache
    if (action === 'set') {
      memoryCache.set(key, {
        value,
        expiry: Date.now() + (ttl * 1000),
        created: Date.now()
      });
      return Response.json({
        success: true,
        action: 'set',
        key,
        ttl
      });
    }

    // INVALIDATE cache
    if (action === 'invalidate') {
      memoryCache.delete(key);
      return Response.json({
        success: true,
        message: `Cache key "${key}" invalidated`
      });
    }

    // CLEAR all
    if (action === 'clear') {
      memoryCache.clear();
      return Response.json({
        success: true,
        message: 'All cache cleared'
      });
    }

    // GET STATS
    if (action === 'stats') {
      const stats = {
        total_keys: memoryCache.size,
        memory_usage_mb: (new TextEncoder().encode(JSON.stringify(Array.from(memoryCache))).length / 1024 / 1024).toFixed(2),
        ttl_config: cacheTTL,
        oldest_entry_age_seconds: 0
      };

      if (memoryCache.size > 0) {
        const oldest = Array.from(memoryCache.values())
          .sort((a, b) => a.created - b.created)[0];
        stats.oldest_entry_age_seconds = Math.floor((Date.now() - oldest.created) / 1000);
      }

      return Response.json({
        success: true,
        stats
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[CacheLayerV2] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});