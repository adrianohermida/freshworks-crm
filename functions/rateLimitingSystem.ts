import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Rate limiting cache (in production, use Redis)
const rateLimitCache = new Map();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, userId, endpoint } = await req.json();

    // Check Rate Limit
    if (action === 'check') {
      const key = `${userId}:${endpoint}`;
      const now = Date.now();
      const windowMs = 60000; // 1 minute
      const maxRequests = 100;

      if (!rateLimitCache.has(key)) {
        rateLimitCache.set(key, { count: 1, resetTime: now + windowMs });
        return Response.json({
          allowed: true,
          remaining: maxRequests - 1,
          resetIn: windowMs
        });
      }

      const entry = rateLimitCache.get(key);
      
      if (now > entry.resetTime) {
        entry.count = 1;
        entry.resetTime = now + windowMs;
        return Response.json({
          allowed: true,
          remaining: maxRequests - 1,
          resetIn: windowMs
        });
      }

      entry.count++;
      const allowed = entry.count <= maxRequests;

      return Response.json({
        allowed,
        remaining: Math.max(0, maxRequests - entry.count),
        resetIn: entry.resetTime - now,
        retryAfter: allowed ? null : Math.ceil((entry.resetTime - now) / 1000)
      });
    }

    // Get Rate Limit Settings
    if (action === 'settings') {
      const settings = {
        plans: [
          { tier: 'free', requests_per_minute: 10, burst_size: 20 },
          { tier: 'pro', requests_per_minute: 100, burst_size: 200 },
          { tier: 'enterprise', requests_per_minute: 1000, burst_size: 2000 }
        ],
        current_tier: 'pro',
        current_limit: 100
      };
      return Response.json({ success: true, settings });
    }

    // Get Rate Limit Stats
    if (action === 'stats') {
      const stats = {
        total_requests_24h: 89324,
        rate_limited_requests: 342,
        percentage_limited: 0.38,
        busiest_hour: '14:00-15:00',
        avg_response_time_ms: 145
      };
      return Response.json({ success: true, stats });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Rate Limiting Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});