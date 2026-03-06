import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Busca processos no DataJud usando Query DSL
 * Suporta busca por: número de processo, partes, assunto, tribunal
 */
const rateLimiter = new Map();

function checkRateLimit(key, maxRequests = 5, windowMs = 60000) {
  const now = Date.now();
  const userLimit = rateLimiter.get(key) || [];
  const recentRequests = userLimit.filter(time => now - time < windowMs);

  if (recentRequests.length >= maxRequests) {
    return false;
  }

  recentRequests.push(now);
  rateLimiter.set(key, recentRequests);
  return true;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      processNumber,
      courtAlias,
      searchTerm,
      searchField = 'numeroProcesso'
    } = await req.json();

    if (!processNumber && !searchTerm) {
      return Response.json(
        { error: 'processNumber or searchTerm is required' },
        { status: 400 }
      );
    }

    // Rate limiting: 5 requests por minuto por usuário
    const rateLimitKey = `${user.email}:search`;
    if (!checkRateLimit(rateLimitKey, 5, 60000)) {
      return Response.json(
        { error: 'Rate limit exceeded. Máximo 5 buscas por minuto.' },
        { status: 429 }
      );
    }

    const datajudApiKey = Deno.env.get('DATAJUD_API_KEY');
    const datajudBaseUrl = Deno.env.get('DATAJUD_BASE_URL');

    if (!datajudApiKey || !datajudBaseUrl) {
      return Response.json(
        { error: 'DataJud credentials not configured' },
        { status: 500 }
      );
    }

    // Determinar alias do tribunal ou usar padrão
    const tribunal = courtAlias || 'trf1';
    const endpoint = `${datajudBaseUrl}api_publica_${tribunal}/_search`;

    // Construir query DSL
    let queryDSL = {};

    if (processNumber) {
      // Busca exata por número de processo
      queryDSL = {
        query: {
          match: {
            numeroProcesso: processNumber.replace(/\D/g, '')
          }
        }
      };
    } else if (searchTerm) {
      // Busca em múltiplos campos
      queryDSL = {
        query: {
          multi_match: {
            query: searchTerm,
            fields: [
              'numeroProcesso^3',
              'classe.nome^2',
              'assuntos.nome^2',
              'orgaoJulgador.nome',
              'dataAjuizamento'
            ],
            fuzziness: 'AUTO'
          }
        },
        size: 50
      };
    }

    // Fazer requisição ao DataJud
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const datajudResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `APIKey ${datajudApiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(queryDSL),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!datajudResponse.ok) {
      const errorText = await datajudResponse.text();
      return Response.json(
        {
          error: 'Failed to search in DataJud',
          details: errorText,
          statusCode: datajudResponse.status
        },
        { status: 502 }
      );
    }

    const datajudData = await datajudResponse.json();

    if (!datajudData.hits) {
      return Response.json(
        { error: 'Invalid response from DataJud' },
        { status: 502 }
      );
    }

    // Processar resultados
    const results = datajudData.hits.hits.map(hit => {
      const source = hit._source;
      return {
        id: hit._id,
        score: hit._score,
        numeroProcesso: source.numeroProcesso,
        classe: source.classe,
        assuntos: source.assuntos,
        tribunal: source.tribunal,
        grau: source.grau,
        formato: source.formato,
        dataAjuizamento: source.dataAjuizamento,
        dataAtualizacao: source.dataHoraUltimaAtualizacao,
        orgaoJulgador: source.orgaoJulgador,
        movimentos: source.movimentos,
        sistema: source.sistema,
        nivelSigilo: source.nivelSigilo
      };
    });

    return Response.json({
      success: true,
      total: datajudData.hits.total.value,
      took: datajudData.took,
      results,
      tribunal
    });
  } catch (error) {
    console.error('[SearchDatajudProcess] Error:', error);

    if (error.name === 'AbortError') {
      return Response.json(
        { error: 'Search timeout (15s)' },
        { status: 504 }
      );
    }

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});