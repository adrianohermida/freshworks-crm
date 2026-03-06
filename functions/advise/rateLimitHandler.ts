/**
 * Rate Limit Handler
 * Detecta e respeita headers retry-after automaticamente
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const RATE_LIMIT_STORE = new Map();

function getRetryAfter(response) {
  const retryAfter = response.headers.get('retry-after');
  if (!retryAfter) return 60; // Default 60 segundos

  // retry-after pode ser segundos (número) ou HTTP-date
  const seconds = parseInt(retryAfter);
  return isNaN(seconds) ? 60 : seconds;
}

function shouldWait(apiUrl) {
  const state = RATE_LIMIT_STORE.get(apiUrl);
  if (!state) return false;

  const elapsedSeconds = (Date.now() - state.timestamp) / 1000;
  return elapsedSeconds < state.waitUntilSeconds;
}

function getWaitTime(apiUrl) {
  const state = RATE_LIMIT_STORE.get(apiUrl);
  if (!state) return 0;

  const elapsedSeconds = (Date.now() - state.timestamp) / 1000;
  return Math.max(0, state.waitUntilSeconds - elapsedSeconds);
}

function recordRateLimit(apiUrl, retryAfterSeconds) {
  RATE_LIMIT_STORE.set(apiUrl, {
    timestamp: Date.now(),
    waitUntilSeconds: retryAfterSeconds
  });
  console.log(`⏱️  Rate limit: aguardar ${retryAfterSeconds}s antes de continuar`);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { apiUrl = Deno.env.get('ADVISE_API_URL') } = await req.json();

    if (!apiUrl) {
      return Response.json({ error: 'API URL não fornecida' }, { status: 400 });
    }

    const waitTime = getWaitTime(apiUrl);
    const isWaiting = shouldWait(apiUrl);

    return Response.json({
      apiUrl,
      isRateLimited: isWaiting,
      waitTimeSeconds: Math.ceil(waitTime),
      readyAt: isWaiting ? new Date(Date.now() + waitTime * 1000).toISOString() : null,
      message: isWaiting 
        ? `⏱️  API em rate limit, aguarde ${Math.ceil(waitTime)}s`
        : '✅ API disponível para requisições'
    });

  } catch (error) {
    return Response.json({
      error: error.message,
      isRateLimited: false
    }, { status: 500 });
  }
});

export { getRetryAfter, shouldWait, getWaitTime, recordRateLimit };