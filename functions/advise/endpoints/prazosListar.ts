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

    const { 
      status = 'aberto', 
      diasRestantes, 
      paginaAtual = 1, 
      registrosPorPagina = 50 
    } = await req.json();

    // GET /prazos - listar prazos processuais
    let url = `${adviseApiUrl}/core/v1/prazos?status=${status}&page=${paginaAtual}&pageSize=${registrosPorPagina}`;
    if (diasRestantes) {
      url += `&diasRestantes=${diasRestantes}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adviseToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Advise API error: ${response.statusText}`);
    }

    const data = await response.json();
    const prazos = data.prazos || data.data || [];

    // Sincronizar com banco de dados
    for (const prazo of prazos) {
      const existente = await base44.entities.PrazoProcessual.filter({
        numeroProcesso: prazo.numeroProcesso,
        tipo: prazo.tipo
      });

      if (existente.length === 0) {
        await base44.entities.PrazoProcessual.create({
          idProcessoAdvise: prazo.processoId || '',
          numeroProcesso: prazo.numeroProcesso,
          tipo: prazo.tipo || 'outro',
          descricao: prazo.descricao || '',
          dataInicio: prazo.dataInicio,
          dataVencimento: prazo.dataVencimento,
          diasUteis: prazo.diasUteis || 0,
          status: prazo.status || 'aberto',
          acao_requerida: prazo.acaoRequerida || '',
          documentos_necessarios: prazo.documentosNecessarios || []
        });
      }
    }

    return Response.json({
      success: true,
      action: 'prazos.listar',
      data: {
        prazos: prazos,
        totalPrazos: prazos.length,
        filtro: {
          status,
          diasRestantes: diasRestantes || 'todos'
        },
        paginacao: {
          paginaAtual,
          registrosPorPagina,
          total: data.total || prazos.length
        },
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