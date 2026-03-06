import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Teste Avançado de Endpoints DataJud
 * - Busca real de processos em qualquer tribunal
 * - Suporta paginação com search_after
 * - Busca por classe processual e órgão julgador
 * - Análise de performance e dados
 */

const BASE_URL = Deno.env.get('DATAJUD_BASE_URL') || 'https://api-publica.datajud.cnj.jus.br';
const API_KEY = Deno.env.get('DATAJUD_API_KEY') || '';

// Mapa de tribunais conhecidos
const TRIBUNAIS = {
  tjsp: { nome: 'TJSP', api: 'api_publica_tjsp' },
  tjdft: { nome: 'TJDFT', api: 'api_publica_tjdft' },
  trf1: { nome: 'TRF1', api: 'api_publica_trf1' },
  trf2: { nome: 'TRF2', api: 'api_publica_trf2' },
  tjmg: { nome: 'TJMG', api: 'api_publica_tjmg' },
  tjrj: { nome: 'TJRJ', api: 'api_publica_tjrj' },
  tjrs: { nome: 'TJRS', api: 'api_publica_tjrs' },
  tjba: { nome: 'TJBA', api: 'api_publica_tjba' }
};

// Classes processuais e órgãos comuns para testes
const TEST_CONFIGS = {
  tjdft: { classe_codigo: 1116, orgao_codigo: 13597, descricao: 'Execução Fiscal - TJDFT' },
  tjsp: { classe_codigo: 1116, orgao_codigo: null, descricao: 'Execução Fiscal - TJSP' }
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      action = 'test',
      tribunal_alias,
      classe_codigo,
      orgao_codigo,
      page_size = 100,
      search_after = null,
      pages = 1
    } = await req.json();

    if (!tribunal_alias) {
      return Response.json(
        { error: 'tribunal_alias is required' },
        { status: 400 }
      );
    }

    const tribunal = TRIBUNAIS[tribunal_alias.toLowerCase()];
    if (!tribunal) {
      return Response.json(
        { error: `Tribunal não suportado: ${tribunal_alias}. Suportados: ${Object.keys(TRIBUNAIS).join(', ')}` },
        { status: 400 }
      );
    }

    // TEST: Testar endpoint com busca real
    if (action === 'test') {
      return await testEndpoint(base44, tribunal, tribunal_alias, classe_codigo, orgao_codigo, page_size);
    }

    // PAGINATE: Buscar múltiplas páginas com search_after
    if (action === 'paginate') {
      return await paginateResults(base44, tribunal, tribunal_alias, classe_codigo, orgao_codigo, page_size, pages, search_after);
    }

    // LIST_TRIBUNALS: Listar tribunais disponíveis
    if (action === 'list_tribunals') {
      return Response.json({
        success: true,
        tribunals: Object.entries(TRIBUNAIS).map(([alias, info]) => ({
          alias,
          nome: info.nome,
          api: info.api,
          test_config: TEST_CONFIGS[alias] || null
        }))
      });
    }

    // ANALYZE: Análise detalhada de tribunal
    if (action === 'analyze') {
      return await analyzeEndpoint(tribunal, tribunal_alias, classe_codigo, orgao_codigo);
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[TestDatajudEndpoint] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// Testar endpoint único
async function testEndpoint(base44, tribunal, tribunal_alias, classe_codigo, orgao_codigo, page_size) {
  const startTime = Date.now();
  let status = 'success';
  let statusCode = 0;
  let errorMessage = null;
  let recordsFound = 0;
  let metadata = null;
  let sample_record = null;

  try {
    // Usar config padrão se não especificar
    const config = TEST_CONFIGS[tribunal_alias.toLowerCase()] || {};
    const classe = classe_codigo || config.classe_codigo;
    const orgao = orgao_codigo || config.orgao_codigo;

    // Construir query DSL
    const query = {
      size: Math.min(page_size, 10000),
      query: {
        bool: {
          must: []
        }
      },
      sort: [{ '@timestamp': { order: 'asc' } }]
    };

    if (classe) query.query.bool.must.push({ match: { 'classe.codigo': classe } });
    if (orgao) query.query.bool.must.push({ match: { 'orgaoJulgador.codigo': orgao } });

    if (query.query.bool.must.length === 0) {
      query.query = { match_all: {} };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(
      `${BASE_URL}/${tribunal.api}/_search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `ApiKey ${API_KEY}`
        },
        body: JSON.stringify(query),
        signal: controller.signal
      }
    );

    clearTimeout(timeout);
    statusCode = response.status;

    if (!response.ok) {
      status = 'failed';
      errorMessage = `HTTP ${response.status}`;
    } else {
      const data = await response.json();
      recordsFound = data.hits?.hits?.length || 0;
      const totalValue = data.hits?.total?.value || 0;
      
      metadata = {
        total: totalValue,
        total_relation: data.hits?.total?.relation || 'eq',
        took_ms: data.took || 0,
        timed_out: data.timed_out || false,
        page_size,
        has_more: recordsFound === page_size,
        shards: data._shards || {}
      };

      if (recordsFound > 0) {
        const last_record = data.hits.hits[recordsFound - 1];
        sample_record = {
          id: last_record._id,
          numero_processo: last_record._source?.numeroProcesso,
          classe: last_record._source?.classe?.nome,
          tribunal: last_record._source?.tribunal,
          data_ajuizamento: last_record._source?.dataAjuizamento,
          sort_value: last_record.sort?.[0] || null
        };
        metadata.last_sort = last_record.sort?.[0] || null;
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      status = 'timeout';
      errorMessage = 'Requisição expirou (15s)';
    } else {
      status = 'failed';
      errorMessage = err.message;
    }
  }

  const responseTime = Date.now() - startTime;

  // Registrar teste
  const test = await base44.asServiceRole.entities.EndpointTest.create({
    court_alias: tribunal_alias,
    status,
    response_time: responseTime,
    status_code: statusCode,
    error_message: errorMessage,
    records_found: recordsFound,
    test_query: `classe=${classe_codigo || 'any'}, orgao=${orgao_codigo || 'any'}`,
    tested_at: new Date().toISOString(),
    metadata
  });

  return Response.json({
    success: status === 'success',
    tribunal: tribunal.nome,
    status,
    responseTime,
    recordsFound,
    metadata,
    sample_record,
    pagination: {
      can_load_more: metadata?.has_more,
      search_after: sample_record?.sort_value
    }
  });
}

// Paginar com search_after
async function paginateResults(base44, tribunal, tribunal_alias, classe_codigo, orgao_codigo, page_size, pages, search_after) {
  const results = [];
  const startTime = Date.now();
  let current_search_after = search_after;
  let total_records = 0;

  for (let page = 0; page < pages; page++) {
    try {
      const config = TEST_CONFIGS[tribunal_alias.toLowerCase()] || {};
      const classe = classe_codigo || config.classe_codigo;
      const orgao = orgao_codigo || config.orgao_codigo;

      const query = {
        size: Math.min(page_size, 10000),
        query: {
          bool: {
            must: []
          }
        },
        sort: [{ '@timestamp': { order: 'asc' } }]
      };

      if (classe) query.query.bool.must.push({ match: { 'classe.codigo': classe } });
      if (orgao) query.query.bool.must.push({ match: { 'orgaoJulgador.codigo': orgao } });

      if (current_search_after) {
        query.search_after = [current_search_after];
      }

      const response = await fetch(
        `${BASE_URL}/${tribunal.api}/_search`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `ApiKey ${API_KEY}`
          },
          body: JSON.stringify(query)
        }
      );

      const data = await response.json();
      const hits = data.hits?.hits || [];
      
      if (hits.length === 0) break;

      total_records += hits.length;
      results.push({
        page: page + 1,
        records: hits.length,
        first_record: hits[0]._source?.numeroProcesso,
        last_record: hits[hits.length - 1]._source?.numeroProcesso,
        took_ms: data.took
      });

      if (hits.length < page_size) break;
      
      current_search_after = hits[hits.length - 1].sort?.[0];
    } catch (err) {
      results.push({
        page: page + 1,
        error: err.message
      });
      break;
    }
  }

  return Response.json({
    success: true,
    tribunal: tribunal.nome,
    total_records,
    pages_fetched: results.length,
    response_time_ms: Date.now() - startTime,
    pagination_results: results,
    next_search_after: current_search_after
  });
}

// Análise detalhada
async function analyzeEndpoint(tribunal, tribunal_alias, classe_codigo, orgao_codigo) {
  const config = TEST_CONFIGS[tribunal_alias.toLowerCase()];
  
  return Response.json({
    success: true,
    tribunal: tribunal.nome,
    api_endpoint: `${BASE_URL}/${tribunal.api}/_search`,
    recommended_config: config || {
      classe_codigo: null,
      orgao_codigo: null,
      descricao: 'Configure classe_codigo e orgao_codigo para resultados melhores'
    },
    pagination: {
      recommended_size: 100,
      max_size: 10000,
      method: 'search_after com @timestamp'
    },
    query_example: {
      size: 100,
      query: {
        bool: {
          must: [
            { match: { 'classe.codigo': classe_codigo || config?.classe_codigo || 1116 } },
            { match: { 'orgaoJulgador.codigo': orgao_codigo || config?.orgao_codigo || 13597 } }
          ]
        }
      },
      sort: [{ '@timestamp': { order: 'asc' } }]
    }
  });
}