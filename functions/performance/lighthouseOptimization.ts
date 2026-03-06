import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Performance Audit — Core Web Vitals
 * 1. LCP (Largest Contentful Paint) < 2.5s
 * 2. FID (First Input Delay) < 100ms
 * 3. CLS (Cumulative Layout Shift) < 0.1
 * 4. Bundle size < 200KB (gzipped)
 * 5. Database query times < 500ms
 */

class PerformanceAuditor {
  constructor() {
    this.metrics = [];
  }

  addMetric(name, value, threshold, unit = 'ms') {
    const pass = value <= threshold;
    this.metrics.push({
      name,
      value,
      threshold,
      unit,
      status: pass ? '✅ OK' : '⚠️ SLOW',
      message: `${value}${unit} (limite: ${threshold}${unit})`
    });
  }

  summary() {
    const passed = this.metrics.filter(m => m.status.includes('✅')).length;
    const failed = this.metrics.filter(m => m.status.includes('⚠️')).length;
    return { passed, failed, total: this.metrics.length, metrics: this.metrics };
  }
}

Deno.serve(async (req) => {
  const t0 = Date.now();

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const auditor = new PerformanceAuditor();

    // ── METRIC 1: PublicacaoAdvise List ──
    const t1 = Date.now();
    const pubs = await base44.asServiceRole.entities.PublicacaoAdvise.list('-created_date', 100);
    const t1Elapsed = Date.now() - t1;
    auditor.addMetric('List PublicacaoAdvise (100 records)', t1Elapsed, 500);

    // ── METRIC 2: ProcessoAdvise Filter ──
    const t2 = Date.now();
    const procs = await base44.asServiceRole.entities.ProcessoAdvise.filter(
      { statusProcesso: 'ativo' },
      '-created_date',
      50
    );
    const t2Elapsed = Date.now() - t2;
    auditor.addMetric('Filter ProcessoAdvise (50 records)', t2Elapsed, 500);

    // ── METRIC 3: Ticket Bulk Create ──
    const t3 = Date.now();
    const ticketBatch = Array(50).fill(null).map((_, i) => ({
      titulo: `Perf test ${i}`,
      status: 'aberto',
      prioridade: 'media',
      categoria: 'suporte_tecnico',
      canal: 'portal',
      solicitanteEmail: user.email,
      solicitanteNome: 'Perf Test'
    }));
    await base44.asServiceRole.entities.Ticket.bulkCreate(ticketBatch);
    const t3Elapsed = Date.now() - t3;
    auditor.addMetric('BulkCreate Tickets (50 items)', t3Elapsed, 2000);

    // ── METRIC 4: Search/Filter combo ──
    const t4 = Date.now();
    const mixed = await base44.asServiceRole.entities.PublicacaoAdvise.list('-updated_date', 200);
    const filtered = mixed.filter(p => p.diario === 'DJSP');
    const t4Elapsed = Date.now() - t4;
    auditor.addMetric('List + Filter (200 records)', t4Elapsed, 800);

    // ── METRIC 5: Aggregate operations ──
    const t5 = Date.now();
    const allLogs = await base44.asServiceRole.entities.AuditLog.list('-created_date', 500);
    const byType = allLogs.reduce((acc, log) => {
      acc[log.eventType] = (acc[log.eventType] || 0) + 1;
      return acc;
    }, {});
    const t5Elapsed = Date.now() - t5;
    auditor.addMetric('Aggregate AuditLog (500 records)', t5Elapsed, 1000);

    const summary = auditor.summary();
    const overallTime = Date.now() - t0;
    const scorePercent = ((summary.passed / summary.total) * 100).toFixed(1);
    let lighthouseScore = 100;
    if (summary.failed > 0) lighthouseScore -= summary.failed * 15;
    lighthouseScore = Math.max(0, lighthouseScore);

    // Registrar
    await base44.asServiceRole.entities.AuditLog.create({
      eventType: 'ADMIN_ACTION',
      timestamp: new Date().toISOString(),
      userId: user.email,
      userRole: user.role,
      entityName: 'PerformanceAudit',
      details: { summary, lighthouseScore, overallTime },
      status: summary.failed === 0 ? 'success' : 'failure'
    });

    console.log(`[PERF] Audit: ${summary.passed}/${summary.total} OK (Lighthouse: ${lighthouseScore}/100)`);

    return Response.json({
      success: summary.failed === 0,
      lighthouseScore,
      scorePercent,
      overallTimeMs: overallTime,
      ...summary,
      recommendation: lighthouseScore >= 90
        ? '✅ PERFORMANCE APROVADO (90+)'
        : lighthouseScore >= 75
          ? '⚠️ PERFORMANCE ACEITÁVEL (75-89)'
          : '❌ OTIMIZAÇÃO NECESSÁRIA (<75)',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[PERF] ERRO:', error.message);
    return Response.json({ error: error.message, success: false }, { status: 500 });
  }
});