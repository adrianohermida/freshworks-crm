import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { palavrasChave, filtros = {}, pagina = 1, limite = 20 } = await req.json();

    if (!palavrasChave || palavrasChave.length === 0) {
      return Response.json({
        success: false,
        error: 'palavrasChave é obrigatório (array)'
      }, { status: 400 });
    }

    // Call Escavador API via backend
    const escavadorApiKey = Deno.env.get('ESCAVADOR_API_KEY');
    
    if (!escavadorApiKey) {
      return Response.json({
        success: false,
        error: 'Escavador API key not configured'
      }, { status: 500 });
    }

    const escavadorUrl = 'https://api.escavador.com.br/v1';

    // Build query
    const queryParams = new URLSearchParams({
      keywords: palavrasChave.join(' '),
      sort: filtros.sort || 'relevance',
      order: filtros.order || 'desc',
      page: pagina,
      limit: limite,
      ...(filtros.tribunal && { tribunal: filtros.tribunal }),
      ...(filtros.dataInicio && { dataInicio: filtros.dataInicio }),
      ...(filtros.dataFim && { dataFim: filtros.dataFim })
    });

    const response = await fetch(`${escavadorUrl}/jurisprudencia/search?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${escavadorApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      return Response.json({
        success: false,
        error: `Escavador API error: ${error.message || 'Unknown error'}`
      }, { status: response.status });
    }

    const resultados = await response.json();
    const jurisprudencias = Array.isArray(resultados) ? resultados : resultados.data || [];

    // Store in cache (Redis or local entity)
    const cacheKey = `escavador:busca:${palabrasChave.join('-')}:${pagina}`;
    
    // Try to cache in Escavador search entity if exists
    try {
      await base44.entities.PesquisaEscavador?.create({
        palavrasChave,
        filtros,
        resultadosCount: jurisprudencias.length,
        pagina,
        dataPesquisa: new Date().toISOString(),
        resultados: jurisprudencias.slice(0, 5) // Store first 5 results
      });
    } catch (e) {
      console.log('PesquisaEscavador entity not available');
    }

    // Audit log
    await base44.functions.invoke('security/auditLog', {
      acao: 'buscaJurisprudencia',
      entidade: 'Escavador',
      resultado: 'success',
      metadados: { palavrasChaveCount: palavrasChave.length, resultadosCount: jurisprudencias.length }
    });

    return Response.json({
      success: true,
      action: 'escavador.buscaJurisprudencia',
      data: {
        palavrasChave,
        pagina,
        totalResultados: resultados.total || jurisprudencias.length,
        resultados: jurisprudencias.map(r => ({
          id: r.id,
          tribunal: r.tribunal,
          numero: r.numero,
          data: r.data,
          ementa: r.ementa,
          url: r.url,
          relevancia: r.relevancia || 0.5
        })),
        dataBusca: new Date().toISOString(),
        message: `${jurisprudencias.length} resultados encontrados para "${palavrasChave.join(' ')}"`
      }
    });
  } catch (error) {
    console.error('BuscaJurisprudencia error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});