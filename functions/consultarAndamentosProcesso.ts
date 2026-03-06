import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    const { numeroProcesso, idProcessoAdvise } = payload;

    if (!numeroProcesso && !idProcessoAdvise) {
      return Response.json(
        { error: 'numeroProcesso ou idProcessoAdvise é obrigatório' },
        { status: 400 }
      );
    }

    // Get Advise config
    const configs = await base44.entities.AdviseConfig.filter({ ativa: true });
    if (configs.length === 0) {
      return Response.json({
        error: 'Integração Advise não configurada',
        success: false
      }, { status: 400 });
    }

    const config = configs[0];
    const processId = idProcessoAdvise;

    // Fetch movements from Advise API
    const response = await fetch(
      `${config.adviseApiUrl}/core/v1/processos/${processId}/movimentos?pagina=1&registrosPorPagina=100`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.adviseApiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      return Response.json({
        success: false,
        error: `Erro ao consultar movimentos: ${response.status}`,
        timestamp: new Date().toISOString()
      }, { status: response.status });
    }

    const movimentos = await response.json();
    const mov = Array.isArray(movimentos) ? movimentos : movimentos.movimentos || [];

    // Save/update movements locally
    for (const movimento of mov) {
      const existentes = await base44.entities.MovimentoProcesso.filter({
        idMovimento: movimento.id || movimento.idMovimento
      });

      if (existentes.length === 0) {
        await base44.entities.MovimentoProcesso.create({
          idMovimento: movimento.id || movimento.idMovimento,
          idProcessoAdvise: processId,
          numeroProcesso: numeroProcesso,
          dataMovimento: movimento.data || movimento.dataMovimento,
          descricaoMovimento: movimento.descricao || movimento.titulo,
          tipoMovimento: movimento.tipo || 'Movimento',
          conteudo: movimento.conteudo || '',
          lido: false,
          importante: false,
          dataSincronizacao: new Date().toISOString(),
          sequencia: movimento.sequencia || 0
        });
      }
    }

    return Response.json({
      success: true,
      message: 'Andamentos consultados',
      movimentos: mov,
      total: Array.isArray(mov) ? mov.length : 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao consultar andamentos:', error);
    return Response.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
});