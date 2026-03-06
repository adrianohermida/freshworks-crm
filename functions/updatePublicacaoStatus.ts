import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Marca uma publicação como lida ou não lida na API Advise
 * e atualiza o status local no banco
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { idPublicacaoAdvise, idPublicacao, lido } = await req.json();
    const id = idPublicacaoAdvise || idPublicacao;

    if (!id) {
      return Response.json({ error: 'ID da publicação é obrigatório' }, { status: 400 });
    }

    // Atualizar status local no banco
    const publicacao = await base44.asServiceRole.entities.PublicacaoAdvise.filter(
      { idPublicacaoAdvise: id }
    );

    if (!publicacao || publicacao.length === 0) {
      return Response.json({ error: 'Publicação não encontrada' }, { status: 404 });
    }

    await base44.asServiceRole.entities.PublicacaoAdvise.update(publicacao[0].id, {
      lido: lido === true || lido === 'true',
      statusSincronizacao: 'processado',
      dataSincronizacao: new Date().toISOString()
    });

    return Response.json({
      success: true,
      message: `Publicação marcada como ${lido ? 'lida' : 'não lida'}`,
      idPublicacaoAdvise: id,
      lido
    });

  } catch (error) {
    console.error('Erro ao atualizar publicação:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});