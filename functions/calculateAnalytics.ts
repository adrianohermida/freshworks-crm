import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const FRESHDESK_DOMAIN = Deno.env.get("FRESHDESK_DOMAIN");
const FRESHDESK_API_KEY = Deno.env.get("FRESHDESK_API_KEY");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!FRESHDESK_DOMAIN || !FRESHDESK_API_KEY) {
      return Response.json({ error: 'Freshdesk credentials not configured' }, { status: 500 });
    }

    const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
    
    // Fetch all tickets
    let allTickets = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const url = `${domain}api/v2/tickets?page=${page}&per_page=100`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Basic ${FRESHDESK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        allTickets = [...allTickets, ...(data.tickets || [])];
        hasMore = data.tickets?.length === 100;
        page++;
      } else {
        hasMore = false;
      }
    }

    // Calculate analytics
    const resolved = allTickets.filter(t => t.status === 5);
    const avgResolutionTime = resolved.length > 0
      ? resolved.reduce((sum, t) => {
          const created = new Date(t.created_at);
          const updated = new Date(t.updated_at);
          return sum + (updated - created);
        }, 0) / resolved.length / (1000 * 60 * 60) // convert to hours
      : 0;

    const overdueSLA = allTickets.filter(t => {
      const created = new Date(t.created_at);
      const now = new Date();
      const ageHours = (now - created) / (1000 * 60 * 60);
      return ageHours > 24 && t.status !== 5;
    }).length;

    const byAgent = {};
    allTickets.forEach(t => {
      const agentId = t.responder_id || 'Unassigned';
      byAgent[agentId] = (byAgent[agentId] || 0) + 1;
    });

    return Response.json({ 
      success: true, 
      analytics: {
        total_tickets: allTickets.length,
        resolved_tickets: resolved.length,
        open_tickets: allTickets.filter(t => t.status === 2).length,
        avg_resolution_time_hours: avgResolutionTime.toFixed(2),
        overdue_sla: overdueSLA,
        by_agent: byAgent,
        generated_at: new Date().toISOString()
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});