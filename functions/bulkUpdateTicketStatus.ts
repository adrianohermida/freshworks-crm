import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const FRESHDESK_BASIC_TOKEN = Deno.env.get("FRESHDESK_BASIC_TOKEN");
const FRESHDESK_DOMAIN = Deno.env.get("FRESHDESK_DOMAIN");

const statusMap = {
  'open': 2,
  'pending': 3,
  'resolved': 4,
  'closed': 5
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ticketIds, newStatus } = await req.json();

    if (!Array.isArray(ticketIds) || ticketIds.length === 0) {
      return Response.json({ error: 'ticketIds must be a non-empty array' }, { status: 400 });
    }

    if (!newStatus || !statusMap[newStatus]) {
      return Response.json({ error: 'Invalid status' }, { status: 400 });
    }

    if (!FRESHDESK_BASIC_TOKEN || !FRESHDESK_DOMAIN) {
      return Response.json({ error: 'Freshdesk credentials not configured' }, { status: 500 });
    }

    const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
    const freshdeskStatus = statusMap[newStatus];

    // Get all tickets from Base44
    const allTickets = await base44.entities.Ticket.list();
    const tickets = allTickets.filter(t => ticketIds.includes(t.id));
    
    let successCount = 0;
    let errors = [];

    // Update each ticket in Freshdesk and Base44
    for (const ticket of tickets) {
      try {
        // Update in Freshdesk
        const url = `${domain}api/v2/tickets/${ticket.freshdesk_id}`;
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': FRESHDESK_BASIC_TOKEN,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: freshdeskStatus })
        });

        if (response.ok) {
          // Update in Base44
          await base44.entities.Ticket.update(ticket.id, {
            status: newStatus,
            last_sync: new Date().toISOString()
          });
          successCount++;
        } else {
          errors.push({ ticketId: ticket.freshdesk_id, error: `HTTP ${response.status}` });
        }
      } catch (error) {
        errors.push({ ticketId: ticket.freshdesk_id, error: error.message });
      }
    }

    return Response.json({
      success: true,
      updated: successCount,
      total: ticketIds.length,
      errors: errors.length > 0 ? errors : null
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});