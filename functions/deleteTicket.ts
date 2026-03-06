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

    if (user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    if (!FRESHDESK_DOMAIN || !FRESHDESK_API_KEY) {
      return Response.json({ error: 'Freshdesk credentials not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { freshdesk_id } = body;

    if (!freshdesk_id) {
      return Response.json({ error: 'Missing freshdesk_id' }, { status: 400 });
    }

    const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
    const url = `${domain}api/v2/tickets/${freshdesk_id}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${FRESHDESK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = response.status === 404 
        ? { message: 'Ticket not found' } 
        : await response.json().catch(() => ({ message: response.statusText }));
      
      return Response.json({ 
        error: error.description || error.message || 'Failed to delete ticket',
        status: response.status
      }, { status: response.status });
    }

    // Delete from local database
    try {
      const localTickets = await base44.entities.Ticket.filter({
        freshdesk_id: freshdesk_id.toString()
      });
      
      if (localTickets.length > 0) {
        await base44.entities.Ticket.delete(localTickets[0].id);
      }
    } catch (dbError) {
      console.error('DB sync error:', dbError.message);
    }

    return Response.json({ success: true, message: 'Ticket deleted' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});