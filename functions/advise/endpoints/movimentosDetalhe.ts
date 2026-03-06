import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseApiUrl = Deno.env.get('ADVISE_API_URL') || 'https://api.advise.com.br';

    const { movimentoId, numeroProcesso } = await req.json();

    if (!movimentoId) {
      return Response.json({
        success: false,
        error: 'movimentoId é obrigatório'
      }, { status: 400 });
    }

    // GET /movimentos/:id - detalhe do movimento
    const response = await fetch(`${adviseApiUrl}/movimentos/${movimentoId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adviseToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Advise API error: ${response.statusText}`);
    }

    const movimento = await response.json();

    // Sincronizar com banco de dados
    const existente = await base44.entities.MovimentoProcesso.filter({
      idMovimento: movimentoId
    });

    if (existente.length === 0) {
      await base44.entities.MovimentoProcesso.create({
        idMovimento: movimentoId,
        idProcessoAdvise: movimento.processoId || '',
        numeroProcesso: numeroProcesso || movimento.numeroProcesso || '',
        dataMovimento: movimento.dataMovimento,
        descricaoMovimento: movimento.descricao || movimento.descricaoMovimento,
        tipoMovimento: movimento.tipo || 'outro',
        tribunal: movimento.tribunal || '',
        conteudo: movimento.conteudo || '',
        lido: movimento.lido === true,
        importante: movimento.importante === true,
        dataSincronizacao: new Date().toISOString(),
        sequencia: movimento.sequencia || 0
      });
    } else {
      await base44.entities.MovimentoProcesso.update(existente[0].id, {
        lido: movimento.lido === true,
        importante: movimento.importante === true,
        dataSincronizacao: new Date().toISOString()
      });
    }

    return Response.json({
      success: true,
      action: 'movimentos.detalhe',
      data: {
        movimento: movimento,
        movimentoId: movimentoId,
        numeroProcesso: numeroProcesso || movimento.numeroProcesso,
        dataMovimento: movimento.dataMovimento,
        tipo: movimento.tipo,
        conteudo: movimento.conteudo,
        tribunal: movimento.tribunal,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});