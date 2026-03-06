import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { period = 'week' } = await req.json();

    const tickets = await base44.entities.Ticket.list();
    const reviews = await base44.entities.CustomerReview.list();
    
    const now = new Date();
    let fromDate = new Date();
    
    switch (period) {
      case 'day':
        fromDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        fromDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        fromDate.setMonth(now.getMonth() - 1);
        break;
      default:
        fromDate.setDate(now.getDate() - 7);
    }

    const recentTickets = tickets.filter(t => new Date(t.created_date) >= fromDate);
    const recentReviews = reviews.filter(r => new Date(r.reviewed_at || r.created_date) >= fromDate);

    let totalResolutionTime = 0;
    let resolvedCount = 0;
    let avgResponseTime = 0;
    let responseCount = 0;

    recentTickets.forEach(ticket => {
      if (ticket.status === 'closed' && ticket.closed_date) {
        const resTime = (new Date(ticket.closed_date) - new Date(ticket.created_date)) / (1000 * 60 * 60);
        totalResolutionTime += resTime;
        resolvedCount++;
      }
      
      if (ticket.first_response_time) {
        avgResponseTime += parseFloat(ticket.first_response_time);
        responseCount++;
      }
    });

    const avgResolutionTime = resolvedCount > 0 ? totalResolutionTime / resolvedCount : 0;
    const avgFirstResponse = responseCount > 0 ? avgResponseTime / responseCount : 0;
    
    const avgSatisfaction = recentReviews.length > 0 
      ? (recentReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / recentReviews.length)
      : 0;

    const metrics = {
      total_tickets_created: recentTickets.length,
      total_resolved: resolvedCount,
      resolution_rate: recentTickets.length > 0 ? Math.round((resolvedCount / recentTickets.length) * 100) : 0,
      avg_resolution_time_hours: Math.round(avgResolutionTime),
      avg_first_response_time_hours: Math.round(avgFirstResponse),
      avg_customer_satisfaction: Math.round(avgSatisfaction * 10) / 10,
      total_reviews: recentReviews.length,
      period,
      timestamp: new Date().toISOString()
    };

    return Response.json({
      success: true,
      metrics
    });
  } catch (error) {
    console.error('getPerformanceMetrics error:', error);
    return Response.json({
      error: error.message || 'Failed to get performance metrics',
      details: error.details || error
    }, { status: error.status || 500 });
  }
});