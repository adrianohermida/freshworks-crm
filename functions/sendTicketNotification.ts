// sendTicketNotification v3 - handles entity automation payload correctly
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();

    // Entity automation payload: { event: { type, entity_name, entity_id }, data, old_data }
    // Direct call payload: { ticketId, eventType, ticketData }
    const ticketId = body?.ticketId || body?.event?.entity_id;
    const eventType = body?.eventType || body?.event?.type || 'create';

    if (!ticketId) {
      return Response.json({ success: true, skipped: true, reason: 'No ticketId' });
    }

    // Use data from payload if available, otherwise fetch from DB
    let ticketData = body?.ticketData || body?.data;

    if (!ticketData || !ticketData.subject) {
      const tickets = await base44.asServiceRole.entities.Ticket.list();
      ticketData = tickets.find(t => t.id === ticketId) || {};
    }

    const subject = ticketData?.subject || 'Sem assunto';
    const customer = ticketData?.customer_name || 'Cliente';
    const priority = ticketData?.priority || 'medium';
    const status = ticketData?.status || 'open';

    const isCreate = eventType === 'create' || eventType === 'ticket_created';
    const emailSubject = isCreate ? `🎫 Novo Ticket: ${subject}` : `🔄 Ticket Atualizado: ${subject}`;
    const emailBody = isCreate
      ? `Novo ticket criado no Freshdesk Manager.\n\nAssunto: ${subject}\nCliente: ${customer}\nPrioridade: ${priority}\nTicket ID: ${ticketId}\nData: ${new Date().toLocaleString('pt-BR')}`
      : `Ticket atualizado no Freshdesk Manager.\n\nAssunto: ${subject}\nCliente: ${customer}\nStatus: ${status}\nPrioridade: ${priority}\nTicket ID: ${ticketId}\nData: ${new Date().toLocaleString('pt-BR')}`;

    await base44.integrations.Core.SendEmail({
      to: 'adrianohermida@gmail.com',
      subject: emailSubject,
      body: emailBody
    });

    return Response.json({ success: true, notificationsSent: 1, ticketId, eventType });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});