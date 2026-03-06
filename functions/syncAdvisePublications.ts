import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Sincroniza publicações da API Advise usando o orquestrador centralizado
 * Usa retry automático e salva apenas registros novos/atualizados
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Invocar orquestrador de publicações
    const response = await base44.functions.invoke('advise/publicacoes', {
      acao: 'sincronizar',
      params: {
        paginaInicial: 1,
        paginasAoMesmo: 5
      }
    });

    return Response.json(response.data);

  } catch (error) {
    console.error('SyncAdvisePublications error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});