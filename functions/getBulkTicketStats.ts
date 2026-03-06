import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { date_range = 'week' } = await req.json();

    const tickets = await base44.entities.Ticket.list();
    
    const now = new Date();
    let fromDate = new Date();
    
    switch (date_range) {
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

    const stats = {
      total_tickets: tickets.length,
      recent_tickets: recentTickets.length,
      by_status: {},
      by_priority: {},
      average_resolution_time: 0,
      open_count: 0,
      closed_count: 0,
      high_priority_count: 0
    };

    tickets.forEach(ticket => {
      stats.by_status[ticket.status] = (stats.by_status[ticket.status] || 0) + 1;
      stats.by_priority[ticket.priority] = (stats.by_priority[ticket.priority] || 0) + 1;
      
      if (ticket.status === 'open') stats.open_count++;
      if (ticket.status === 'closed') stats.closed_count++;
      if (ticket.priority === 'urgent') stats.high_priority_count++;
    });

    return Response.json({ success: true, stats });
  } catch (error) {
    console.error('getBulkTicketStats error:', error);
    return Response.json({
      error: error.message || 'Failed to get stats',
      details: error.details || error
    }, { status: error.status || 500 });
  }
});