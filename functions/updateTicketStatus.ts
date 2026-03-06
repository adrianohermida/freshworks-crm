import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const FRESHDESK_BASIC_TOKEN = Deno.env.get("FRESHDESK_BASIC_TOKEN");
const FRESHDESK_DOMAIN = Deno.env.get("FRESHDESK_DOMAIN");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ticketId, status } = await req.json();

    if (!ticketId || !status) {
      return Response.json({ error: 'Missing ticketId or status' }, { status: 400 });
    }

    if (!FRESHDESK_BASIC_TOKEN || !FRESHDESK_DOMAIN) {
      return Response.json({ error: 'Freshdesk credentials not configured' }, { status: 500 });
    }

    // Map status to Freshdesk status codes
    const statusMap = {
      open: 2,
      pending: 3,
      resolved: 4,
      closed: 5
    };

    const freshdeskStatusCode = statusMap[status];
    if (!freshdeskStatusCode) {
      return Response.json({ error: 'Invalid status value' }, { status: 400 });
    }

    // Get Base44 ticket to find Freshdesk ID
    const tickets = await base44.entities.Ticket.filter({ id: ticketId });
    if (!tickets || tickets.length === 0) {
      return Response.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const ticket = tickets[0];
    const freshdeskId = ticket.freshdesk_id;

    if (!freshdeskId) {
      return Response.json({ error: 'Freshdesk ID not found' }, { status: 400 });
    }

    // Update in Freshdesk
    const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
    const url = `${domain}api/v2/tickets/${freshdeskId}`;

    const updateResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': FRESHDESK_BASIC_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: freshdeskStatusCode
      })
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.text();
      return Response.json({ error: `Freshdesk API error: ${updateResponse.status}` }, { status: 500 });
    }

    // Update Base44 ticket
    await base44.entities.Ticket.update(ticketId, {
      status: status,
      last_sync: new Date().toISOString()
    });

    return Response.json({ success: true, status });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});