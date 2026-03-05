/**
 * Retry com Exponential Backoff
 * Função utilitária para retentar operações com backoff inteligente
 */

export async function retryWithBackoff(
  operation,
  maxRetries = 3,
  initialDelayMs = 500,
  maxDelayMs = 30000
) {
  let lastError;
  let delayMs = initialDelayMs;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const isRateLimit = error.status === 429 || error.message?.includes('429');
      const isServerError = error.status >= 500;
      const shouldRetry = isRateLimit || isServerError || error.message?.includes('timeout');

      if (!shouldRetry || attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff com jitter
      const jitter = Math.random() * 0.1 * delayMs; // 10% jitter
      const actualDelay = Math.min(delayMs + jitter, maxDelayMs);

      console.log(`⏱️ Tentativa ${attempt} falhou, aguardando ${actualDelay.toFixed(0)}ms...`);
      await new Promise(resolve => setTimeout(resolve, actualDelay));

      // Dobrar delay para próxima tentativa
      delayMs = Math.min(delayMs * 2, maxDelayMs);
    }
  }

  throw lastError;
}

/**
 * Wrapper para funções que retornam Response
 */
export async function retryWithBackoffResponse(
  fetchFn,
  maxRetries = 3,
  initialDelayMs = 500
) {
  return retryWithBackoff(
    async () => {
      const response = await fetchFn();
      
      // Lançar erro se status inaceitável
      if (response.status === 429) {
        const error = new Error('Rate limit');
        error.status = 429;
        error.retryAfter = response.headers.get('retry-after');
        throw error;
      }
      
      if (response.status >= 500) {
        const error = new Error(`Server error ${response.status}`);
        error.status = response.status;
        throw error;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response;
    },
    maxRetries,
    initialDelayMs
  );
}