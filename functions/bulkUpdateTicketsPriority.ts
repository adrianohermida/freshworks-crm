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
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ticket_ids, new_priority } = await req.json();

    if (!ticket_ids || ticket_ids.length === 0 || !new_priority) {
      return Response.json({ 
        error: 'ticket_ids array and new_priority are required' 
      }, { status: 400 });
    }

    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (!validPriorities.includes(new_priority)) {
      return Response.json({ 
        error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}` 
      }, { status: 400 });
    }

    let successful = 0;
    let failed = 0;
    const errors = [];

    for (const ticketId of ticket_ids) {
      try {
        const fdResponse = await fetch(getFreshDeskUrl(`tickets/${ticketId}`), {
          method: 'PUT',
          headers: getFreshDeskHeaders(),
          body: JSON.stringify({ priority: new_priority })
        });

        if (fdResponse.ok) {
          successful++;
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
        failed,
        new_priority
      },
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('bulkUpdateTicketsPriority error:', error);
    return Response.json({
      error: error.message || 'Failed to bulk update tickets',
      details: error.details || error
    }, { status: error.status || 500 });
  }
});