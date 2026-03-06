import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import {
  getFreshDeskHeaders,
  getFreshDeskUrl,
  mapFreshDeskStatus,
  mapFreshDeskPriority,
  validateFreshDeskCredentials,
  handleFreshDeskResponse
} from './freshDeskHelper.js';

Deno.serve(async (req) => {
  try {
    validateFreshDeskCredentials();
    const base44 = createClientFromRequest(req);
    
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contact_id, page = 1, per_page = 50 } = await req.json();

    if (!contact_id) {
      return Response.json({ error: 'contact_id is required' }, { status: 400 });
    }

    // Fetch from Freshdesk
    const fdResponse = await fetch(
      getFreshDeskUrl(`contacts/${contact_id}/tickets?page=${page}&per_page=${per_page}`),
      { headers: getFreshDeskHeaders() }
    );

    const data = await handleFreshDeskResponse(fdResponse);
    const tickets = data.tickets || [];

    const formatted = tickets.map(ticket => ({
      freshdesk_id: ticket.id,
      subject: ticket.subject,
      status: mapFreshDeskStatus(ticket.status),
      priority: mapFreshDeskPriority(ticket.priority),
      customer_email: ticket.email,
      assigned_agent_id: ticket.responder_id?.toString(),
      created_at: ticket.created_at,
      updated_at: ticket.updated_at
    }));

    return Response.json({
      success: true,
      count: formatted.length,
      page,
      contact_id,
      tickets: formatted
    });
  } catch (error) {
    console.error('getTicketsByContact error:', error);
    return Response.json({
      error: error.message || 'Failed to fetch contact tickets',
      details: error.details || error
    }, { status: error.status || 500 });
  }
});