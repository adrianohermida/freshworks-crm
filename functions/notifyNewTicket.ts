import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const ticketId = body?.ticketId || body?.event?.entity_id;
    const ticketData = body?.ticketData || body?.data || {};

    if (!ticketId) {
      return Response.json({ success: true, skipped: true, reason: 'No ticketId' });
    }

    const subject = ticketData?.subject || 'Sem assunto';
    const customer = ticketData?.customer_name || 'Cliente';
    const priority = ticketData?.priority || 'medium';

    await base44.integrations.Core.SendEmail({
      to: 'adrianohermida@gmail.com',
      subject: `🎫 Novo Ticket: ${subject}`,
      body: `Novo ticket criado no Freshdesk Manager.\n\nAssunto: ${subject}\nCliente: ${customer}\nPrioridade: ${priority}\nTicket ID: ${ticketId}\nData: ${new Date().toLocaleString('pt-BR')}`
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});