import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Rate Limiter - Proteção contra abuso de API
 * Implementa limite por usuário e por IP
 */

const requestCounts = new Map();

class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  getKey(userId, ip) {
    return `${userId}:${ip}`;
  }

  isAllowed(userId, ip) {
    const key = this.getKey(userId, ip);
    const now = Date.now();

    if (!requestCounts.has(key)) {
      requestCounts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    const record = requestCounts.get(key);

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + this.windowMs;
      return true;
    }

    record.count++;
    return record.count <= this.maxRequests;
  }

  getRemaining(userId, ip) {
    const key = this.getKey(userId, ip);
    if (!requestCounts.has(key)) return this.maxRequests;
    const record = requestCounts.get(key);
    return Math.max(0, this.maxRequests - record.count);
  }
}

const limiter = new RateLimiter(100, 60000);

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    const allowed = limiter.isAllowed(user.email, clientIp);
    const remaining = limiter.getRemaining(user.email, clientIp);

    const headers = {
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Remaining': remaining.toString()
    };

    if (!allowed) {
      return Response.json(
        {
          error: 'Too Many Requests',
          remaining: 0
        },
        { status: 429, headers }
      );
    }

    return Response.json({ success: true, remaining }, { headers });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});