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
    const { ticket_id, time_spent, note, billable } = body;

    if (!ticket_id || !time_spent) {
      return Response.json({ 
        error: 'Missing required fields: ticket_id, time_spent' 
      }, { status: 400 });
    }

    const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
    const url = `${domain}api/v2/tickets/${ticket_id}/time_entries`;

    const payload = {
      time_spent,
      ...(note && { note }),
      ...(billable !== undefined && { billable })
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${FRESHDESK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      return Response.json({ 
        error: error.description || error.message || 'Failed to track time',
        status: response.status
      }, { status: response.status });
    }

    const timeEntry = await response.json();

    return Response.json({ 
      success: true, 
      time_entry: {
        id: timeEntry.id,
        ticket_id: timeEntry.ticket_id,
        time_spent: timeEntry.time_spent,
        note: timeEntry.note,
        billable: timeEntry.billable,
        created_at: timeEntry.created_at
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});