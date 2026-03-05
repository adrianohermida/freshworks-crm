import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const FRESHDESK_DOMAIN = Deno.env.get("FRESHDESK_DOMAIN");
const FRESHDESK_BASIC_TOKEN = Deno.env.get("FRESHDESK_BASIC_TOKEN");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { ticketId, response_body } = body;

    if (!ticketId || typeof ticketId !== 'string') {
      return Response.json({ error: 'ticketId (string) required' }, { status: 400 });
    }
    if (!response_body || typeof response_body !== 'string' || response_body.trim().length === 0) {
      return Response.json({ error: 'response_body (non-empty string) required' }, { status: 400 });
    }

    // Validate credentials
    if (!FRESHDESK_DOMAIN || !FRESHDESK_BASIC_TOKEN) {
      return Response.json({ 
        error: 'Freshdesk credentials not configured'
      }, { status: 500 });
    }

    // Get ticket from Base44
    const ticketList = await base44.entities.Ticket.filter({ id: ticketId });
    if (ticketList.length === 0) {
      return Response.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const ticket = ticketList[0];
    const freshdeskId = ticket.freshdesk_id;

    if (!freshdeskId) {
      return Response.json({ 
        error: 'Ticket missing freshdesk_id - cannot post response'
      }, { status: 400 });
    }

    // Post response to Freshdesk
    const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
    const url = `${domain}api/v2/tickets/${freshdeskId}/notes`;

    const headers = {
      'Authorization': `${FRESHDESK_BASIC_TOKEN}`,
      'Content-Type': 'application/json'
    };

    const fdResponse = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        body: response_body.trim(),
        notify_emails: [ticket.customer_email]
      })
    });

    if (!fdResponse.ok) {
      const errorText = await fdResponse.text();
      return Response.json({ 
        error: 'Failed to post response to Freshdesk',
        status: fdResponse.status,
        details: errorText
      }, { status: fdResponse.status });
    }

    // Update ticket status
    await base44.entities.Ticket.update(ticketId, {
      status: 'pending',
      notes: `Resposta enviada: ${new Date().toLocaleString('pt-BR')}`
    });

    return Response.json({
      success: true,
      message: 'Response posted to Freshdesk'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});