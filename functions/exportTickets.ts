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
    const { format = 'json', filter_status } = body;

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
        const tickets = data.tickets || [];
        
        // Filter if status is specified
        const filtered = filter_status 
          ? tickets.filter(t => {
              const statusMap = { 2: 'open', 3: 'pending', 5: 'resolved', 4: 'closed' };
              return statusMap[t.status] === filter_status;
            })
          : tickets;
        
        allTickets = [...allTickets, ...filtered];
        hasMore = tickets.length === 100;
        page++;
      } else {
        hasMore = false;
      }
    }

    if (format === 'csv') {
      const headers = ['ID', 'Subject', 'Status', 'Priority', 'Customer Email', 'Created At'];
      const rows = allTickets.map(t => [
        t.id,
        t.subject || '',
        ['', 'Open', 'Pending', '', 'Resolved', 'Closed'][t.status] || '',
        ['', 'Low', 'Medium', 'High', 'Urgent'][t.priority] || '',
        t.requester_id || '',
        new Date(t.created_at).toISOString()
      ]);

      const csv = [headers, ...rows].map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ).join('\n');

      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=tickets.csv'
        }
      });
    }

    // Default JSON format
    return Response.json({ 
      success: true, 
      data: allTickets,
      count: allTickets.length
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});