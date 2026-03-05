/**
 * Health Check Advise API
 * Verifica status da API antes de sincronizações
 * Implementa circuit breaker simples
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const HEALTH_CHECK_CACHE = new Map();
const CACHE_DURATION = 30000; // 30 segundos
const CIRCUIT_BREAKER_THRESHOLD = 3; // 3 falhas = circuit aberto
const CIRCUIT_BREAKER_RESET = 60000; // 1 minuto para resetar

class CircuitBreaker {
  constructor() {
    this.failureCount = 0;
    this.state = 'closed'; // closed, open, half-open
    this.lastFailureTime = null;
  }

  recordSuccess() {
    this.failureCount = 0;
    if (this.state !== 'closed') {
      this.state = 'closed';
      console.log('🟢 Circuit breaker: CLOSED (recuperado)');
    }
  }

  recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= CIRCUIT_BREAKER_THRESHOLD) {
      this.state = 'open';
      console.log('🔴 Circuit breaker: OPEN (muitas falhas)');
    }
  }

  canMakeRequest() {
    if (this.state === 'closed') return true;
    
    if (this.state === 'open') {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      if (timeSinceLastFailure > CIRCUIT_BREAKER_RESET) {
        this.state = 'half-open';
        console.log('🟡 Circuit breaker: HALF-OPEN (tentando recuperar)');
        return true;
      }
      return false;
    }
    
    return true; // half-open permite tentar
  }
}

const breaker = new CircuitBreaker();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ADVISE_TOKEN = Deno.env.get('ADVISE_TOKEN');
    const ADVISE_API_URL = Deno.env.get('ADVISE_API_URL');

    if (!ADVISE_TOKEN || !ADVISE_API_URL) {
      return Response.json({ 
        error: 'ADVISE_TOKEN ou ADVISE_API_URL não configurados',
        status: 'unavailable'
      }, { status: 500 });
    }

    // Verificar cache
    const cached = HEALTH_CHECK_CACHE.get('advise_health');
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return Response.json({
        ...cached.data,
        cached: true,
        cacheAge: Date.now() - cached.timestamp
      });
    }

    // Verificar circuit breaker
    if (!breaker.canMakeRequest()) {
      console.warn('🔴 Circuit breaker OPEN - rejeitando requisição');
      return Response.json({
        status: 'unavailable',
        reason: 'Circuit breaker open - API indisponível temporariamente',
        circuitBreakerState: breaker.state,
        failureCount: breaker.failureCount
      }, { status: 503 });
    }

    // Health check simples - fazer requisição GET rápida
    const healthUrl = new URL(ADVISE_API_URL.replace(/\/$/, ''));
    healthUrl.searchParams.append('operacao', 'consultaFonteProcesso');
    healthUrl.searchParams.append('numeroProcesso', '0000000000000000000000');

    const startTime = Date.now();
    const response = await Promise.race([
      fetch(healthUrl.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ADVISE_TOKEN}`,
          'Accept': 'application/json'
        }
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Health check timeout')), 5000)
      )
    ]);

    const responseTime = Date.now() - startTime;
    const healthStatus = {
      status: response.ok ? 'healthy' : 'degraded',
      statusCode: response.status,
      responseTime,
      timestamp: new Date().toISOString(),
      circuitBreakerState: breaker.state,
      failureCount: breaker.failureCount
    };

    // Atualizar circuit breaker baseado na resposta
    if (response.ok) {
      breaker.recordSuccess();
      HEALTH_CHECK_CACHE.set('advise_health', {
        data: healthStatus,
        timestamp: Date.now()
      });
      
      return Response.json({
        ...healthStatus,
        message: '✅ API Advise está saudável'
      });
    } else if (response.status === 429) {
      breaker.recordFailure();
      return Response.json({
        ...healthStatus,
        message: '⚠️ Rate limit detectado',
        retryAfter: response.headers.get('retry-after') || 'unknown'
      }, { status: 429 });
    } else if (response.status >= 500) {
      breaker.recordFailure();
      return Response.json({
        ...healthStatus,
        message: '❌ API Advise com erro de servidor'
      }, { status: 503 });
    } else {
      return Response.json({
        ...healthStatus,
        message: '⚠️ API Advise retornou status inesperado'
      }, { status: 503 });
    }

  } catch (error) {
    console.error('Erro no health check:', error.message);
    breaker.recordFailure();

    return Response.json({
      status: 'unavailable',
      error: error.message,
      circuitBreakerState: breaker.state,
      failureCount: breaker.failureCount,
      message: '❌ Não conseguiu verificar status da API Advise'
    }, { status: 503 });
  }
});