import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Webhook: Publicação Advise → Cria Ticket Freshdesk
 * Triggered quando nova publicação é sincronizada
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { event } = await req.json();
    
    // Apenas processa criação de publicações
    if (event.type !== 'create' || event.entity_name !== 'PublicacaoAdvise') {
      return Response.json({ skip: true });
    }

    const publicacao = await base44.asServiceRole.entities.PublicacaoAdvise.list(1, 1, { 
      id: event.entity_id 
    });

    if (!publicacao.length) {
      return Response.json({ error: 'Publicação não encontrada' }, { status: 404 });
    }

    const pub = publicacao[0];

    // Criar ticket Freshdesk
    const ticketRes = await base44.functions.invoke('freshdesk', {
      action: 'criar',
      payload: {
        titulo: `[${pub.diario}] ${pub.numeroProcesso}`,
        descricao: `Publicação no diário ${pub.diario}.\n\nConteúdo:\n${pub.conteudo?.substring(0, 500) || 'Sem conteúdo'}...`,
        email: user.email,
        prioridade: 2,
        canal: 'portal'
      }
    });

    // Vincular publicação ao ticket criado
    const ticket = ticketRes.data.data.ticket;
    await base44.asServiceRole.entities.Ticket.update(ticket.id, {
      idPublicacaoAdvise: pub.id,
      numeroProcessoRelacionado: pub.numeroProcesso
    });

    return Response.json({
      success: true,
      ticketCriado: ticket.id,
      publicacaoId: pub.id
    });

  } catch (error) {
    console.error('Erro webhook publicação:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});