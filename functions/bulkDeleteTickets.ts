import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import {
  getFreshDeskHeaders,
  getFreshDeskUrl,
  validateFreshDeskCredentials,
  handleFreshDeskResponse
} from './freshDeskHelper.js';

Deno.serve(async (req) => {
  try {
    validateFreshDeskCredentials();
    const base44 = createClientFromRequest(req);
    
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { ticket_ids } = await req.json();

    if (!ticket_ids || ticket_ids.length === 0) {
      return Response.json({ 
        error: 'ticket_ids array is required' 
      }, { status: 400 });
    }

    let successful = 0;
    let failed = 0;
    const errors = [];

    for (const ticketId of ticket_ids) {
      try {
        const fdResponse = await fetch(getFreshDeskUrl(`tickets/${ticketId}`), {
          method: 'DELETE',
          headers: getFreshDeskHeaders()
        });

        if (fdResponse.ok || fdResponse.status === 204) {
          successful++;
          
          // Try to delete from Base44 as well
          try {
            const base44Tickets = await base44.entities.Ticket.list();
            const ticketToDelete = base44Tickets.find(t => t.freshdesk_id === ticketId.toString());
            if (ticketToDelete) {
              await base44.entities.Ticket.delete(ticketToDelete.id);
            }
          } catch (err) {
            console.warn(`Could not delete ticket ${ticketId} from Base44:`, err.message);
          }
        } else {
          failed++;
          errors.push({ ticketId, error: `HTTP ${fdResponse.status}` });
        }
      } catch (err) {
        failed++;
        errors.push({ ticketId, error: err.message });
      }
    }

    return Response.json({
      success: true,
      summary: {
        total: ticket_ids.length,
        successful,
        failed
      },
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('bulkDeleteTickets error:', error);
    return Response.json({
      error: error.message || 'Failed to bulk delete tickets',
      details: error.details || error
    }, { status: error.status || 500 });
  }
});