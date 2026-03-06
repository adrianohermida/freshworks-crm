import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const DATAJUD_BASE_URL = Deno.env.get('DATAJUD_BASE_URL');
const DATAJUD_API_KEY = Deno.env.get('DATAJUD_API_KEY');

const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { processId, syncType } = await req.json();

    const result = await syncWithFallback(processId, syncType);

    return Response.json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function syncWithFallback(processId, syncType) {
  const syncLog = {
    processId,
    syncType,
    startTime: new Date().toISOString(),
    attempts: [],
    fallbackUsed: false,
    finalStatus: null
  };

  // Tentar sync com DataJud
  for (let attempt = 1; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const result = await fetchFromDataJud(processId);
      syncLog.attempts.push({
        attempt,
        status: 'success',
        timestamp: new Date().toISOString()
      });
      syncLog.finalStatus = 'success';
      return syncLog;
    } catch (error) {
      const delay = calculateBackoffDelay(attempt - 1);
      syncLog.attempts.push({
        attempt,
        status: 'failed',
        error: error.message,
        nextRetryIn: delay + 'ms',
        timestamp: new Date().toISOString()
      });

      if (attempt < RETRY_CONFIG.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // Fallback: tentar TPU local
  try {
    syncLog.fallbackUsed = true;
    const result = await fetchFromTPULocal(processId);
    syncLog.attempts.push({
      attempt: 'fallback',
      status: 'success',
      source: 'TPU_LOCAL',
      timestamp: new Date().toISOString()
    });
    syncLog.finalStatus = 'success_fallback';
    return syncLog;
  } catch (fallbackError) {
    syncLog.attempts.push({
      attempt: 'fallback',
      status: 'failed',
      error: fallbackError.message,
      timestamp: new Date().toISOString()
    });
    syncLog.finalStatus = 'failed_all';
    return syncLog;
  }
}

async function fetchFromDataJud(processId) {
  const url = new URL(`/api/consultaprocesso`, DATAJUD_BASE_URL);
  url.searchParams.append('numeroProcesso', processId);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${DATAJUD_API_KEY}`,
      'Content-Type': 'application/json'
    },
    signal: AbortSignal.timeout(10000)
  });

  if (!response.ok) {
    throw new Error(`DataJud API error: ${response.status}`);
  }

  return await response.json();
}

async function fetchFromTPULocal(processId) {
  // Simulação de busca local TPU
  // Em produção, buscaria do banco de dados local
  return {
    processId,
    source: 'TPU_LOCAL',
    data: { cached: true }
  };
}

function calculateBackoffDelay(retryCount) {
  const delay = Math.min(
    RETRY_CONFIG.initialDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, retryCount),
    RETRY_CONFIG.maxDelay
  );
  return Math.floor(delay);
}