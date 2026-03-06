import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função para consultar informações adicionais do processo
 * GET /core/v1/processos-clientes/informacoes-adicionais
 * Retorna: dados complementares do processo
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const numeroProcesso = url.searchParams.get('numeroProcesso');

    if (!numeroProcesso) {
      return Response.json(
        { error: 'numeroProcesso é obrigatório' },
        { status: 400 }
      );
    }

    // Chamar API Advise
    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseUrl = Deno.env.get('ADVISE_API_URL') || 'https://api.advise.com.br';

    const response = await fetch(
      `${adviseUrl}/core/v1/processos-clientes/informacoes-adicionais?campos=*&numeroProcesso=${numeroProcesso}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adviseToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(
        { error: errorData.message || 'Erro ao consultar informações adicionais' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Estruturar informações adicionais
    const informacoes = {
      numeroProcesso,
      statusProcesso: data.statusProcesso,
      dataInicio: data.dataInicio,
      dataUltimo: data.dataUltimo,
      dataUltimoAndamento: data.dataUltimoAndamento,
      ultimoAndamento: data.ultimoAndamento || 'Sem movimentação',
      percentualAndamento: data.percentualAndamento || 0,
      totalMovimentos: data.totalMovimentos || 0,
      tempoMedioResposta: data.tempoMedioResposta,
      proximoEvento: data.proximoEvento,
      dataProximoEvento: data.dataProximoEvento,
      prazosAbertos: data.prazosAbertos || [],
      audienciasProximas: data.audienciasProximas || [],
      documentos: data.documentos || [],
      metadados: data.metadados || {}
    };

    return new Response(JSON.stringify({
      success: true,
      informacoes,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=900' // 15 minutos
      }
    });

  } catch (error) {
    console.error('Erro ao consultar informações adicionais:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});