import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const FRESHDESK_DOMAIN = Deno.env.get("FRESHDESK_DOMAIN");
const FRESHDESK_BASIC_TOKEN = Deno.env.get("FRESHDESK_BASIC_TOKEN");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { ticketIds, groupId } = body;

    if (!Array.isArray(ticketIds) || ticketIds.length === 0 || !groupId) {
      return Response.json({ error: 'ticketIds (array) e groupId required' }, { status: 400 });
    }

    let domain = FRESHDESK_DOMAIN.trim().replace(/\/+$/, '');
    if (!domain.startsWith('http')) domain = `https://${domain}`;

    const results = [];
    const errors = [];

    for (const ticketId of ticketIds) {
      try {
        const url = `${domain}/api/v2/tickets/${ticketId}`;
        const res = await fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': FRESHDESK_BASIC_TOKEN,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ group_id: parseInt(groupId) })
        });

        if (!res.ok) {
          errors.push({ ticketId, error: `HTTP ${res.status}` });
          continue;
        }

        const ticket = await res.json();
        
        // Update local DB
        await base44.asServiceRole.entities.Ticket.update(ticketId, {
          group_id: parseInt(groupId),
          last_sync: new Date().toISOString()
        });

        results.push({ ticketId, success: true });
      } catch (err) {
        errors.push({ ticketId, error: err.message });
      }
    }

    return Response.json({
      success: true,
      total: ticketIds.length,
      updated: results.length,
      failed: errors.length,
      errors
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});