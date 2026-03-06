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

    const { diasAtras = 30, paginaAtual = 1, registrosPorPagina = 50 } = await req.json();

    // GET /audiencias - listar audiências agendadas
    const response = await fetch(
      `${adviseApiUrl}/core/v1/audiencias?diasAtras=${diasAtras}&page=${paginaAtual}&pageSize=${registrosPorPagina}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adviseToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Advise API error: ${response.statusText}`);
    }

    const data = await response.json();
    const audiencias = data.audiencias || data.data || [];

    // Sincronizar com banco de dados
    for (const aud of audiencias) {
      const existente = await base44.entities.Audiencia.filter({
        idProcessoAdvise: aud.processoId
      });

      if (existente.length === 0) {
        await base44.entities.Audiencia.create({
          idProcessoAdvise: aud.processoId,
          numeroProcesso: aud.numeroProcesso,
          dataAudiencia: aud.dataAudiencia,
          tipo: aud.tipo || 'otra',
          juiz: aud.juiz || '',
          sala: aud.sala || '',
          descricao: aud.descricao || '',
          comparecimento: 'pendente',
          data_criacao: new Date().toISOString()
        });
      }
    }

    return Response.json({
      success: true,
      action: 'audiencias.listar',
      data: {
        audiencias: audiencias,
        totalAudiencias: audiencias.length,
        paginacao: {
          paginaAtual,
          registrosPorPagina,
          total: data.total || audiencias.length
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