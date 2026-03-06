import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função para consultar idFonteXTipoPesquisa e idValorParamFonteProc
 * GET /core/v1/processos-clientes/consulta-fonte-processo
 * Necessário para cadastrar processos em fonte específica
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parâmetros obrigatórios
    const url = new URL(req.url);
    const flAtivo = url.searchParams.get('flAtivo') === 'true';

    // Chamar API Advise
    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseUrl = Deno.env.get('ADVISE_API_URL') || 'https://api.advise.com.br';

    const response = await fetch(
      `${adviseUrl}/core/v1/processos-clientes/consulta-fonte-processo?flAtivo=${flAtivo}`,
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
        { error: errorData.message || 'Erro ao consultar fonte do processo' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Cache em browser via response headers
    return new Response(JSON.stringify({
      success: true,
      fontes: data.fontes || data,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=3600' // 1 hora de cache
      }
    });

  } catch (error) {
    console.error('Erro ao consultar fonte do processo:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});