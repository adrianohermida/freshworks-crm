import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET") || "freshdesk-webhook-key";

Deno.serve(async (req) => {
  try {
    const body = await req.text();
    
    // Parse JSON
    let event;
    try {
      event = JSON.parse(body);
    } catch (e) {
      return Response.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    // Handle different event types
    const { action, data } = event;
    
    if (!action || !data) {
      return Response.json({ error: 'Missing action or data' }, { status: 400 });
    }

    // Log webhook event
    try {
      await base44.asServiceRole.entities.WebhookEvent.create({
        event_type: action,
        entity_type: data.ticket ? 'Ticket' : data.contact ? 'Contact' : 'Unknown',
        entity_id: data.ticket?.id || data.contact?.id || '',
        payload: JSON.stringify(event),
        status: 'success',
        received_at: new Date().toISOString()
      });
    } catch (e) {
      console.error('Error logging webhook event:', e);
    }

    // Process ticket updates
    if (data.ticket) {
      const ticket = data.ticket;
      
      try {
        // Check if ticket exists locally
        const existing = await base44.asServiceRole.entities.Ticket.filter({
          freshdesk_id: String(ticket.id)
        });

        if (existing.length > 0) {
          // Update existing ticket
          await base44.asServiceRole.entities.Ticket.update(existing[0].id, {
            subject: ticket.subject,
            description: ticket.description,
            status: ticket.status,
            priority: ticket.priority,
            assigned_agent_name: ticket.responder_id ? `Agent ${ticket.responder_id}` : null,
            customer_name: ticket.requester?.name || '',
            customer_email: ticket.requester?.email || '',
            last_sync: new Date().toISOString()
          });
        } else {
          // Create new ticket
          await base44.asServiceRole.entities.Ticket.create({
            freshdesk_id: String(ticket.id),
            subject: ticket.subject,
            description: ticket.description,
            status: ticket.status,
            priority: ticket.priority,
            assigned_agent_name: ticket.responder_id ? `Agent ${ticket.responder_id}` : null,
            customer_name: ticket.requester?.name || '',
            customer_email: ticket.requester?.email || '',
            last_sync: new Date().toISOString()
          });
        }
      } catch (e) {
        console.error('Error processing ticket webhook:', e);
      }
    }

    // Process contact updates
    if (data.contact) {
      const contact = data.contact;
      
      try {
        const existing = await base44.asServiceRole.entities.Contact.filter({
          freshdesk_id: String(contact.id)
        });

        if (existing.length > 0) {
          await base44.asServiceRole.entities.Contact.update(existing[0].id, {
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            company_name: contact.company_id ? `Company ${contact.company_id}` : null,
            last_sync: new Date().toISOString()
          });
        } else {
          await base44.asServiceRole.entities.Contact.create({
            freshdesk_id: String(contact.id),
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            company_name: contact.company_id ? `Company ${contact.company_id}` : null,
            last_sync: new Date().toISOString()
          });
        }
      } catch (e) {
        console.error('Error processing contact webhook:', e);
      }
    }

    return Response.json({
      success: true,
      message: `Webhook processed: ${action}`,
      entity: data.ticket ? 'Ticket' : data.contact ? 'Contact' : 'Unknown'
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});