/**
 * Métricas de Sincronização
 * Rastreia sucesso/falha de sincronizações
 */

export class SyncMetrics {
  constructor(functionName) {
    this.functionName = functionName;
    this.startTime = Date.now();
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalItems: 0,
      itemsProcessed: 0,
      itemsFailed: 0,
      errors: [],
      rateLimitHits: 0,
      timeouts: 0
    };
  }

  recordRequest(success = true) {
    this.stats.totalRequests++;
    if (success) {
      this.stats.successfulRequests++;
    } else {
      this.stats.failedRequests++;
    }
  }

  recordItems(total, processed, failed = 0) {
    this.stats.totalItems += total;
    this.stats.itemsProcessed += processed;
    this.stats.itemsFailed += failed;
  }

  recordError(error) {
    const errorMsg = error.message || String(error);
    this.stats.errors.push({
      message: errorMsg,
      timestamp: new Date().toISOString()
    });

    if (errorMsg.includes('429') || errorMsg.includes('rate')) {
      this.stats.rateLimitHits++;
    }
    if (errorMsg.includes('timeout')) {
      this.stats.timeouts++;
    }
  }

  getSummary() {
    const duration = Date.now() - this.startTime;
    const successRate = this.stats.totalRequests === 0 
      ? 0 
      : Math.round((this.stats.successfulRequests / this.stats.totalRequests) * 100);

    return {
      functionName: this.functionName,
      duration: duration,
      durationSeconds: (duration / 1000).toFixed(2),
      successRate: `${successRate}%`,
      stats: this.stats,
      summary: {
        totalRequests: this.stats.totalRequests,
        successful: this.stats.successfulRequests,
        failed: this.stats.failedRequests,
        itemsProcessed: this.stats.itemsProcessed,
        itemsFailed: this.stats.itemsFailed,
        rateLimitHits: this.stats.rateLimitHits,
        timeouts: this.stats.timeouts,
        totalErrors: this.stats.errors.length
      }
    };
  }

  log() {
    const summary = this.getSummary();
    console.log(`\n📊 Métricas: ${this.functionName}`);
    console.log(`⏱️  Duração: ${summary.durationSeconds}s`);
    console.log(`✅ Taxa de sucesso: ${summary.successRate}`);
    console.log(`📦 Items: ${summary.itemsProcessed}/${summary.stats.totalItems}`);
    if (summary.rateLimitHits > 0) {
      console.log(`⚠️  Rate limits: ${summary.rateLimitHits}`);
    }
    if (summary.timeouts > 0) {
      console.log(`⏳ Timeouts: ${summary.timeouts}`);
    }
    return summary;
  }
}