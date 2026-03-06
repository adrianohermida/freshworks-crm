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
    const { freshdesk_id, subject, description, status, priority } = body;

    if (!freshdesk_id) {
      return Response.json({ error: 'Missing freshdesk_id' }, { status: 400 });
    }

    const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
    const url = `${domain}api/v2/tickets/${freshdesk_id}`;

    const statusMap = {
      'open': 2,
      'pending': 3,
      'resolved': 4,
      'closed': 5
    };

    const priorityMap = {
      'low': 1,
      'medium': 2,
      'high': 3,
      'urgent': 4
    };

    const payload = {};
    if (subject) payload.subject = subject;
    if (description) payload.description = description;
    if (status) payload.status = statusMap[status] || 2;
    if (priority) payload.priority = priorityMap[priority] || 2;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${FRESHDESK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      return Response.json({ 
        error: error.description || error.message || 'Failed to update ticket',
        status: response.status
      }, { status: response.status });
    }

    const ticket = await response.json();

    // Update local database
    try {
      const localTickets = await base44.entities.Ticket.filter({
        freshdesk_id: freshdesk_id.toString()
      });
      
      if (localTickets.length > 0) {
        const updates = {};
        if (subject) updates.subject = subject;
        if (description) updates.description = description;
        if (status) updates.status = status;
        if (priority) updates.priority = priority;
        
        await base44.entities.Ticket.update(localTickets[0].id, {
          ...updates,
          last_sync: new Date().toISOString()
        });
      }
    } catch (dbError) {
      console.error('DB sync error:', dbError.message);
    }

    return Response.json({ 
      success: true, 
      ticket: { id: ticket.id, subject: ticket.subject }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});