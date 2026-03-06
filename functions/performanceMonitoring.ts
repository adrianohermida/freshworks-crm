import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const metrics = await req.json();

    // Validar métricas obrigatórias
    const requiredMetrics = ['fcp', 'lcp', 'cls', 'tti', 'loadTime'];
    const hasRequired = requiredMetrics.some(m => metrics[m] !== undefined);

    if (!hasRequired) {
      return Response.json({ error: 'At least one metric required' }, { status: 400 });
    }

    // Armazenar métricas de performance
    const performanceRecord = {
      user_email: user.email,
      page_url: metrics.pageUrl,
      fcp: metrics.fcp || null,
      lcp: metrics.lcp || null,
      cls: metrics.cls || null,
      tti: metrics.tti || null,
      load_time: metrics.loadTime || null,
      memory_usage: metrics.memoryUsage || null,
      device_type: metrics.deviceType || 'unknown',
      connection_type: metrics.connectionType || 'unknown',
      is_mobile: metrics.isMobile || false,
      browser: metrics.browser || null,
      os: metrics.os || null,
      timestamp: new Date().toISOString()
    };

    // Salvar para análise
    const result = await base44.asServiceRole.entities.PerformanceMetrics.create(performanceRecord);

    // Avisar se performance está ruim
    const alerts = [];
    if (metrics.fcp && metrics.fcp > 1500) alerts.push('FCP > 1.5s');
    if (metrics.lcp && metrics.lcp > 2500) alerts.push('LCP > 2.5s');
    if (metrics.cls && metrics.cls > 0.1) alerts.push('CLS > 0.1');
    if (metrics.tti && metrics.tti > 3000) alerts.push('TTI > 3s');

    return Response.json({
      success: true,
      recorded: true,
      metrics: performanceRecord,
      alerts: alerts.length > 0 ? alerts : null
    });

  } catch (error) {
    console.error('Performance monitoring error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});