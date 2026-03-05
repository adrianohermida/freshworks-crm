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

    const body = await req.json();
    const { report_type = 'summary', start_date, end_date } = body;

    const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
    
    // Fetch all tickets for analysis
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

    // Calculate metrics
    const total = allTickets.length;
    const resolved = allTickets.filter(t => t.status === 5).length;
    const open = allTickets.filter(t => t.status === 2).length;
    const pending = allTickets.filter(t => t.status === 3).length;

    const statusDistribution = {
      open,
      pending,
      resolved,
      closed: total - open - pending - resolved
    };

    const priorityDistribution = {
      low: allTickets.filter(t => t.priority === 1).length,
      medium: allTickets.filter(t => t.priority === 2).length,
      high: allTickets.filter(t => t.priority === 3).length,
      urgent: allTickets.filter(t => t.priority === 4).length
    };

    return Response.json({ 
      success: true, 
      report: {
        type: report_type,
        generated_at: new Date().toISOString(),
        total_tickets: total,
        status_distribution: statusDistribution,
        priority_distribution: priorityDistribution,
        resolution_rate: total > 0 ? ((resolved / total) * 100).toFixed(2) + '%' : '0%'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});