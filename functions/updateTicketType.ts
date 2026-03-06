import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const FRESHDESK_DOMAIN = Deno.env.get("FRESHDESK_DOMAIN");
const FRESHDESK_BASIC_TOKEN = Deno.env.get("FRESHDESK_BASIC_TOKEN");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { ticketId, type } = body;

    if (!ticketId || !type) {
      return Response.json({ error: 'ticketId e type required' }, { status: 400 });
    }

    let domain = FRESHDESK_DOMAIN.trim().replace(/\/+$/, '');
    if (!domain.startsWith('http')) domain = `https://${domain}`;

    const url = `${domain}/api/v2/tickets/${ticketId}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': FRESHDESK_BASIC_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type })
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({ error: `Freshdesk API ${res.status}`, hint: errText.slice(0, 200) }, { status: res.status });
    }

    const ticket = await res.json();
    
    await base44.asServiceRole.entities.Ticket.update(ticketId, {
      type,
      last_sync: new Date().toISOString()
    });

    return Response.json({ success: true, ticket });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});