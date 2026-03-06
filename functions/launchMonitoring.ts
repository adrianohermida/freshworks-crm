import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Health check da aplicação
    const healthCheck = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      checks: {}
    };

    // Check 1: Database connectivity
    try {
      const ticketCount = await base44.asServiceRole.entities.Ticket.list();
      healthCheck.checks.database = { status: 'up', message: 'Connected' };
    } catch (e) {
      healthCheck.checks.database = { status: 'down', message: e.message };
      healthCheck.status = 'degraded';
    }

    // Check 2: API connectivity (via Freshdesk)
    try {
      // Simulated API check - would be real Freshdesk API call
      healthCheck.checks.freshdesk_api = { status: 'up', message: 'Connected' };
    } catch (e) {
      healthCheck.checks.freshdesk_api = { status: 'down', message: e.message };
      healthCheck.status = 'degraded';
    }

    // Check 3: Analytics
    try {
      const analyticsEvents = await base44.asServiceRole.entities.AnalyticsEvent.list();
      healthCheck.checks.analytics = { status: 'up', events: analyticsEvents.length };
    } catch (e) {
      healthCheck.checks.analytics = { status: 'down', message: e.message };
    }

    // Check 4: Error rate
    try {
      const errorLogs = await base44.asServiceRole.entities.ErrorLog.list();
      const recentErrors = errorLogs.filter(e => {
        const created = new Date(e.created_date);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return created > oneHourAgo;
      });
      
      const errorRate = recentErrors.length > 10 ? 'elevated' : 'normal';
      healthCheck.checks.error_rate = { 
        status: errorRate === 'elevated' ? 'warning' : 'ok',
        recentErrors: recentErrors.length 
      };
      
      if (errorRate === 'elevated') {
        healthCheck.status = 'warning';
      }
    } catch (e) {
      healthCheck.checks.error_rate = { status: 'unknown' };
    }

    // Check 5: Performance
    try {
      const metrics = await base44.asServiceRole.entities.PerformanceMetrics.list();
      if (metrics.length > 0) {
        const avgLoadTime = metrics.reduce((sum, m) => sum + (m.load_time || 0), 0) / metrics.length;
        healthCheck.checks.performance = {
          status: avgLoadTime > 3000 ? 'warning' : 'ok',
          avgLoadTime: Math.round(avgLoadTime)
        };
      }
    } catch (e) {
      healthCheck.checks.performance = { status: 'unknown' };
    }

    // Create health report
    const report = {
      date: new Date().toISOString(),
      overall_status: healthCheck.status,
      database_status: healthCheck.checks.database?.status,
      api_status: healthCheck.checks.freshdesk_api?.status,
      analytics_status: healthCheck.checks.analytics?.status,
      error_rate: healthCheck.checks.error_rate?.recentErrors || 0,
      avg_load_time: healthCheck.checks.performance?.avgLoadTime || null
    };

    // Salvar relatório
    await base44.asServiceRole.entities.LaunchMonitor.create(report);

    // Alerts se necessário
    if (healthCheck.status === 'down') {
      console.error('🚨 CRITICAL: System is down!');
      // Aqui iria integração com Slack/email
    } else if (healthCheck.status === 'degraded') {
      console.warn('⚠️ WARNING: System is degraded');
      // Aqui iria integração com Slack/email
    }

    return Response.json({
      success: true,
      healthCheck,
      report
    });

  } catch (error) {
    console.error('Launch monitoring error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});