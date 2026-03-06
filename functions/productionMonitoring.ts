import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Coleta de métricas paralelas
    const [tickets, errorLogs, analyticsEvents, performanceMetrics, launchMonitors] = await Promise.all([
      base44.asServiceRole.entities.Ticket.list(),
      base44.asServiceRole.entities.ErrorLog.list(),
      base44.asServiceRole.entities.AnalyticsEvent.list(),
      base44.asServiceRole.entities.PerformanceMetrics.list(),
      base44.asServiceRole.entities.LaunchMonitor.list()
    ]);

    // Erros recentes
    const errorsLast24h = errorLogs.filter(e => new Date(e.created_date) > oneDayAgo);
    const errorsLast1h = errorLogs.filter(e => new Date(e.created_date) > oneHourAgo);
    const criticalErrors = errorsLast24h.filter(e => e.severity === 'critical');

    // Eventos de analytics últimos 7 dias
    const recentEvents = analyticsEvents.filter(e => new Date(e.created_date) > sevenDaysAgo);

    // Métricas de performance
    const recentMetrics = performanceMetrics.filter(m => new Date(m.created_date) > oneDayAgo);
    const avgLoadTime = recentMetrics.length > 0
      ? Math.round(recentMetrics.reduce((s, m) => s + (m.load_time || 0), 0) / recentMetrics.length)
      : null;

    // Status geral
    let overallStatus = 'healthy';
    if (criticalErrors.length > 0) overallStatus = 'critical';
    else if (errorsLast1h.length > 5) overallStatus = 'degraded';
    else if (errorsLast24h.length > 20) overallStatus = 'warning';

    const report = {
      timestamp: now.toISOString(),
      overall_status: overallStatus,
      uptime_estimate: overallStatus === 'critical' ? '< 99%' : overallStatus === 'degraded' ? '99.5%' : '99.9%',

      tickets: {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
      },

      errors: {
        last_1h: errorsLast1h.length,
        last_24h: errorsLast24h.length,
        critical_24h: criticalErrors.length,
        rate_per_hour: errorsLast1h.length
      },

      analytics: {
        events_7d: recentEvents.length,
        unique_users: [...new Set(recentEvents.map(e => e.user_email))].length
      },

      performance: {
        avg_load_time_ms: avgLoadTime,
        samples: recentMetrics.length,
        status: avgLoadTime && avgLoadTime > 3000 ? 'warning' : 'ok'
      },

      monitoring: {
        total_checks: launchMonitors.length,
        last_check: launchMonitors[0]?.date || null
      },

      alerts: [
        ...(criticalErrors.length > 0 ? [`🚨 ${criticalErrors.length} erros críticos nas últimas 24h`] : []),
        ...(errorsLast1h.length > 5 ? [`⚠️ Alta taxa de erros: ${errorsLast1h.length}/hora`] : []),
        ...(avgLoadTime && avgLoadTime > 3000 ? [`⏱️ Performance degradada: ${avgLoadTime}ms`] : [])
      ]
    };

    // Salvar no LaunchMonitor
    await base44.asServiceRole.entities.LaunchMonitor.create({
      date: now.toISOString(),
      overall_status: overallStatus,
      error_rate: errorsLast1h.length,
      avg_load_time: avgLoadTime
    });

    return Response.json({ success: true, report });

  } catch (error) {
    console.error('Production monitoring error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});