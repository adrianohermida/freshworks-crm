import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get Advise config
    const configs = await base44.entities.AdviseConfig.filter({ ativa: true });
    if (configs.length === 0) {
      return Response.json({
        error: 'Integração Advise não configurada',
        fontes: []
      }, { status: 400 });
    }

    const config = configs[0];

    // Fetch sources from Advise API
    const response = await fetch(
      `${config.adviseApiUrl}/core/v1/intimacao/ConsultaFonteIntimacoes?RegistrosPorPagina=100&PaginaAtual=1`,
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
        error: `Erro ao buscar fontes de intimações: ${response.status}`,
        fontes: []
      }, { status: response.status });
    }

    const data = await response.json();

    return Response.json({
      success: true,
      fontes: data || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao buscar fontes:', error);
    return Response.json({
      error: error.message,
      fontes: []
    }, { status: 500 });
  }
});