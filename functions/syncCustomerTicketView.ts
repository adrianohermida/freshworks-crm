import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all tickets for this customer
    const tickets = await base44.entities.Ticket.filter({
      customer_email: user.email
    });

    // Create or update CustomerTicketView for each ticket
    for (const ticket of tickets) {
      // Check if view already exists
      const existing = await base44.entities.CustomerTicketView.filter({
        ticket_id: ticket.id,
        customer_email: user.email
      });

      if (existing.length === 0) {
        // Create new view
        await base44.entities.CustomerTicketView.create({
          ticket_id: ticket.id,
          customer_email: user.email,
          subject: ticket.subject,
          description: ticket.description,
          status: ticket.status === 'resolved' ? 'resolved' : ticket.status === 'closed' ? 'closed' : 'open',
          priority: ticket.priority,
          response_count: 0
        });
      } else {
        // Update existing view
        await base44.entities.CustomerTicketView.update(existing[0].id, {
          subject: ticket.subject,
          status: ticket.status === 'resolved' ? 'resolved' : ticket.status === 'closed' ? 'closed' : 'open',
          priority: ticket.priority
        });
      }
    }

    return Response.json({
      success: true,
      synced: tickets.length,
      message: `${tickets.length} tickets sincronizados`
    });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});