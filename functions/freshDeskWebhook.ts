import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    // Apenas POST permitido
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const body = await req.json();
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenant_id = user.email.split('@')[1];
    const event = body.action;
    const data = body.data;

    // Processar diferentes tipos de eventos
    if (event === 'ticket_create') {
      // Novo ticket criado - inserir no FreshDeskTicket
      await base44.asServiceRole.entities.FreshDeskTicket.create({
        freshdesk_id: data.ticket.id?.toString(),
        subject: data.ticket.subject || 'Sem assunto',
        description: data.ticket.description || '',
        requester_email: data.ticket.requester?.email || '',
        requester_name: data.ticket.requester?.name || '',
        status: data.ticket.status_label?.toLowerCase() || 'open',
        priority: data.ticket.priority_label?.toLowerCase() || 'medium',
        sync_status: 'synced',
        tenant_id
      });
    } else if (event === 'ticket_update') {
      // Ticket atualizado - fazer sync via função sync
      await base44.functions.invoke('syncFreshDeskTickets', {});
    } else if (event === 'agent_available' || event === 'agent_busy' || event === 'agent_offline') {
      // Status de agente mudou - sync de agentes
      await base44.functions.invoke('syncFreshDeskAgents', {});
    }

    return Response.json({
      success: true,
      event_type: event,
      processed_at: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});