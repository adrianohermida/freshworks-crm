import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * TPU SYNC INTEGRITY MONITOR
 * Coleta métricas: volume, erros, latência, schema comparison
 */

class TPUSyncMonitor {
  constructor() {
    this.metrics = {
      timestamp: new Date().toISOString(),
      volume: { synced: 0, failed: 0, duplicates: 0 },
      errors: { tpu: [], datajud: [], schema_mismatch: [] },
      latency: { min: Infinity, max: 0, avg: 0 },
      schemaComparison: { matches: 0, mismatches: 0, totalChecks: 0 },
      anomalies: []
    };
  }

  /**
   * Coleta métricas de sincronização
   */
  async collectSyncMetrics(base44) {
    const now = Date.now();

    // 1. VOLUME DE DADOS
    try {
      const processes = await base44.asServiceRole.entities.Process.list();
      const movements = await base44.asServiceRole.entities.AndamentoProcessual.list();
      
      this.metrics.volume.synced = processes.length + movements.length;
      this.metrics.volume.failed = processes.filter(p => p.status === 'synchronized_error').length;
      
      // Calcular duplicatas
      const movementMap = {};
      movements.forEach(m => {
        const hash = m.hash || `${m.processo_id}_${m.codigo_movimento}`;
        movementMap[hash] = (movementMap[hash] || 0) + 1;
      });
      this.metrics.volume.duplicates = Object.values(movementMap).filter(c => c > 1).length;
    } catch (error) {
      this.metrics.errors.datajud.push({
        type: 'volume_collection',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }

    // 2. TAXA DE ERROS
    try {
      const errorLog = await base44.asServiceRole.entities.Analytics.filter({
        event_type: 'process_synced',
        status: { $in: ['error', 'failed'] }
      });

      errorLog.forEach(err => {
        this.metrics.errors.tpu.push({
          process: err.entity_id,
          error: err.metadata?.error || 'Unknown',
          timestamp: err.timestamp
        });
      });

      const errorRate = errorLog.length > 0 
        ? (errorLog.length / (this.metrics.volume.synced + errorLog.length) * 100).toFixed(2)
        : 0;

      this.metrics.errorRate = parseFloat(errorRate);
    } catch (error) {
      this.metrics.errors.tpu.push({
        type: 'error_collection',
        message: error.message
      });
    }

    // 3. LATÊNCIA DE SINCRONIZAÇÃO
    try {
      const syncEvents = await base44.asServiceRole.entities.TPUSincronizacao.filter({
        status: 'sucesso'
      }, '-data_sincronizacao', 100);

      const latencies = syncEvents
        .filter(s => s.tempo_execucao_ms)
        .map(s => s.tempo_execucao_ms);

      if (latencies.length > 0) {
        this.metrics.latency.min = Math.min(...latencies);
        this.metrics.latency.max = Math.max(...latencies);
        this.metrics.latency.avg = Math.round(
          latencies.reduce((a, b) => a + b) / latencies.length
        );
      }
    } catch (error) {
      this.metrics.errors.tpu.push({
        type: 'latency_collection',
        message: error.message
      });
    }

    // 4. COMPARAÇÃO DE SCHEMA
    await this.compareSchemas(base44);

    // 5. DETECTAR ANOMALIAS
    this.detectAnomalies();

    return this.metrics;
  }

  /**
   * Compara schemas entre DataJud e TPU
   */
  async compareSchemas(base44) {
    try {
      const tpuClasses = await base44.asServiceRole.entities.TPUClasses.list();
      const tpuAssuntos = await base44.asServiceRole.entities.TPUAssuntos.list();
      const tpuMovimentos = await base44.asServiceRole.entities.TPUMovimentos.list();

      const datajudClasses = await base44.asServiceRole.entities.Process.list();
      
      // Validar estrutura
      const checks = [
        this.validateSchema(tpuClasses, ['cod_classe', 'nome', 'sigla']),
        this.validateSchema(tpuAssuntos, ['cod_assunto', 'nome', 'ramo_direito']),
        this.validateSchema(tpuMovimentos, ['cod_movimento', 'nome', 'categoria']),
        this.validateSchema(datajudClasses, ['cnj_number', 'title', 'status'])
      ];

      this.metrics.schemaComparison.totalChecks = checks.length;
      this.metrics.schemaComparison.matches = checks.filter(c => c.valid).length;
      this.metrics.schemaComparison.mismatches = checks.filter(c => !c.valid).length;

      // Armazenar mismatches para alertas
      checks.filter(c => !c.valid).forEach(c => {
        this.metrics.errors.schema_mismatch.push({
          entity: c.entity,
          missingFields: c.missing,
          timestamp: new Date().toISOString()
        });
      });
    } catch (error) {
      this.metrics.errors.schema_mismatch.push({
        type: 'schema_comparison',
        message: error.message
      });
    }
  }

  /**
   * Valida se schema contém campos requeridos
   */
  validateSchema(data, requiredFields) {
    if (!Array.isArray(data) || data.length === 0) {
      return { valid: false, entity: data?.name || 'unknown', missing: requiredFields };
    }

    const firstItem = data[0];
    const missing = requiredFields.filter(field => !(field in firstItem));

    return {
      valid: missing.length === 0,
      entity: data[0]?.name || 'unknown',
      missing: missing
    };
  }

  /**
   * Detecta anomalias nos dados
   */
  detectAnomalies() {
    const anomalies = [];

    // Anomalia 1: Taxa de erro alta
    if (this.metrics.errorRate > 5) {
      anomalies.push({
        level: 'CRITICAL',
        type: 'high_error_rate',
        message: `Taxa de erro acima de 5%: ${this.metrics.errorRate}%`,
        threshold: '5%',
        current: `${this.metrics.errorRate}%`
      });
    }

    // Anomalia 2: Latência alta
    if (this.metrics.latency.avg > 10000) {
      anomalies.push({
        level: 'WARNING',
        type: 'high_latency',
        message: `Latência média acima de 10s: ${this.metrics.latency.avg}ms`,
        threshold: '10s',
        current: `${this.metrics.latency.avg}ms`
      });
    }

    // Anomalia 3: Muitas duplicatas
    if (this.metrics.volume.duplicates > this.metrics.volume.synced * 0.1) {
      anomalies.push({
        level: 'WARNING',
        type: 'high_duplicates',
        message: `Mais de 10% duplicatas detectadas`,
        threshold: '10%',
        current: `${((this.metrics.volume.duplicates / this.metrics.volume.synced) * 100).toFixed(2)}%`
      });
    }

    // Anomalia 4: Schema mismatch
    if (this.metrics.schemaComparison.mismatches > 0) {
      anomalies.push({
        level: 'WARNING',
        type: 'schema_mismatch',
        message: `${this.metrics.schemaComparison.mismatches} schemas com mismatch`,
        threshold: '0',
        current: this.metrics.schemaComparison.mismatches
      });
    }

    // Anomalia 5: Sem sincronização recente
    const lastSync = new Date().getTime() - new Date(this.metrics.timestamp).getTime();
    if (lastSync > 86400000) { // 24h
      anomalies.push({
        level: 'INFO',
        type: 'no_recent_sync',
        message: 'Última sincronização > 24 horas',
        threshold: '24h',
        current: `${(lastSync / 3600000).toFixed(1)}h`
      });
    }

    this.metrics.anomalies = anomalies;
    this.metrics.anomalyCount = anomalies.length;
    this.metrics.criticalCount = anomalies.filter(a => a.level === 'CRITICAL').length;
    this.metrics.warningCount = anomalies.filter(a => a.level === 'WARNING').length;
  }

  /**
   * Gera relatório HTML
   */
  generateReport() {
    return {
      timestamp: this.metrics.timestamp,
      summary: {
        totalSynced: this.metrics.volume.synced,
        failed: this.metrics.volume.failed,
        errorRate: `${this.metrics.errorRate}%`,
        avgLatency: `${this.metrics.latency.avg}ms`,
        schemaMatches: this.metrics.schemaComparison.matches,
        anomalies: this.metrics.anomalyCount
      },
      metrics: this.metrics
    };
  }
}

// Deno Server Handler
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized - Admin only' }, { status: 401 });
    }

    const monitor = new TPUSyncMonitor();
    const metrics = await monitor.collectSyncMetrics(base44);
    const report = monitor.generateReport();

    return Response.json(report);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});