import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Webhook: Movimento Processo → Atualiza/Cria Ticket Freshdesk
 * Triggered quando há novo movimento em processo
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { event } = await req.json();
    
    if (event.type !== 'create' || event.entity_name !== 'MovimentoProcesso') {
      return Response.json({ skip: true });
    }

    const movimento = await base44.asServiceRole.entities.MovimentoProcesso.list(1, 1, {
      id: event.entity_id
    });

    if (!movimento.length) return Response.json({ error: 'Movimento não encontrado' }, { status: 404 });

    const mov = movimento[0];

    // Procurar ticket existente para este processo
    const ticketsExistentes = await base44.asServiceRole.entities.Ticket.filter({
      numeroProcessoRelacionado: mov.numeroProcesso
    });

    if (ticketsExistentes.length > 0) {
      // Atualizar ticket existente
      const ticket = ticketsExistentes[0];
      await base44.functions.invoke('freshdesk', {
        action: 'adicionarComentario',
        payload: {
          idTicket: ticket.idTicketFreshdesk,
          conteudo: `[NOVO MOVIMENTO]\n\n${mov.descricaoMovimento}\n\nData: ${new Date(mov.dataMovimento).toLocaleDateString('pt-BR')}\nTribunal: ${mov.tribunal}`,
          privado: false
        }
      });

      return Response.json({
        success: true,
        acao: 'comentario_adicionado',
        ticketId: ticket.id
      });
    }

    // Criar novo ticket se não houver
    const processoData = await base44.asServiceRole.entities.ProcessoAdvise.filter({
      numeroProcesso: mov.numeroProcesso
    });

    if (!processoData.length) {
      return Response.json({ warning: 'Processo não encontrado' });
    }

    const processo = processoData[0];

    const ticketRes = await base44.functions.invoke('freshdesk', {
      action: 'criar',
      payload: {
        titulo: `Processo ${mov.numeroProcesso} - Novo Movimento`,
        descricao: `Movimento em processo judicial.\n\nProcesso: ${mov.numeroProcesso}\nTribunal: ${mov.tribunal}\n\nMovimento:\n${mov.descricaoMovimento}`,
        email: user.email,
        prioridade: 3,
        canal: 'portal'
      }
    });

    const ticket = ticketRes.data.data.ticket;
    
    // Vincular processo ao ticket
    await base44.asServiceRole.entities.Ticket.update(ticket.id, {
      idProcessoAdvise: processo.id,
      numeroProcessoRelacionado: mov.numeroProcesso
    });

    return Response.json({
      success: true,
      acao: 'ticket_criado',
      ticketId: ticket.id,
      processoId: processo.id
    });

  } catch (error) {
    console.error('Erro webhook processo:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});