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
    const { ticket_id, responder_id } = body;

    if (!ticket_id || !responder_id) {
      return Response.json({ 
        error: 'Missing required fields: ticket_id, responder_id' 
      }, { status: 400 });
    }

    const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
    const url = `${domain}api/v2/tickets/${ticket_id}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${FRESHDESK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ responder_id })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      return Response.json({ 
        error: error.description || error.message || 'Failed to assign ticket',
        status: response.status
      }, { status: response.status });
    }

    const ticket = await response.json();

    return Response.json({ 
      success: true, 
      ticket: {
        id: ticket.id,
        responder_id: ticket.responder_id,
        subject: ticket.subject,
        status: ticket.status
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});