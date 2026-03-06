import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tickets = await base44.entities.Ticket.list();
    const slaData = await base44.entities.SLAPolicy.list();

    const slaMetrics = {
      total_tickets: tickets.length,
      sla_breaches: 0,
      at_risk: 0,
      compliant: 0,
      by_priority: {},
      breaches: []
    };

    // Group by priority
    const now = new Date();
    
    tickets.forEach(ticket => {
      const createdDate = new Date(ticket.created_date);
      const age = (now - createdDate) / (1000 * 60 * 60); // hours
      
      slaMetrics.by_priority[ticket.priority] = slaMetrics.by_priority[ticket.priority] || {
        total: 0,
        breached: 0,
        at_risk: 0
      };
      
      slaMetrics.by_priority[ticket.priority].total++;

      // Estimate SLA based on priority (example thresholds)
      const slaThreshold = ticket.priority === 'urgent' ? 4 : 
                          ticket.priority === 'high' ? 8 : 
                          ticket.priority === 'medium' ? 24 : 72;

      if (age > slaThreshold) {
        slaMetrics.sla_breaches++;
        slaMetrics.by_priority[ticket.priority].breached++;
        slaMetrics.breaches.push({
          ticket_id: ticket.freshdesk_id,
          subject: ticket.subject,
          hours_overdue: Math.round(age - slaThreshold),
          priority: ticket.priority
        });
      } else if (age > slaThreshold * 0.8) {
        slaMetrics.at_risk++;
        slaMetrics.by_priority[ticket.priority].at_risk++;
      } else {
        slaMetrics.compliant++;
      }
    });

    const breachRate = tickets.length > 0 
      ? Math.round((slaMetrics.sla_breaches / tickets.length) * 100)
      : 0;

    return Response.json({
      success: true,
      metrics: slaMetrics,
      breach_rate: breachRate,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('getSLAMonitoring error:', error);
    return Response.json({
      error: error.message || 'Failed to get SLA metrics',
      details: error.details || error
    }, { status: error.status || 500 });
  }
});