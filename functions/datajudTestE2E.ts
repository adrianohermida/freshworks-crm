import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * DataJud E2E Tests - Validação de Endpoints
 * Testa: CNJ, Litigante, Classe/Órgão com autenticação correta
 */

const DATAJUD_API_KEY = Deno.env.get('DATAJUD_API_KEY');
const DATAJUD_BASE_URL = 'https://api-publica.datajud.cnj.jus.br';

const tests = {
  cnj: {
    name: 'Busca por CNJ',
    description: 'Busca processo pelo número CNJ (ElasticSearch Query)',
    tribunal: 'tjsp',
    query: {
      query: {
        match: {
          numeroProcesso: '0000001-00.0000.0.00000.0000000'
        }
      }
    }
  },
  litigante: {
    name: 'Busca por Litigante',
    description: 'Busca processos por nome de parte/litigante',
    tribunal: 'tjsp',
    query: {
      query: {
        match: {
          nomeParteProcesso: 'Silva'
        }
      }
    }
  },
  classe: {
    name: 'Busca por Classe/Órgão',
    description: 'Busca processos por classe processual e órgão julgador',
    tribunal: 'tjsp',
    query: {
      query: {
        bool: {
          must: [
            { match: { codigoClasse: '1' } },
            { match: { codigoOrgao: '0000000' } }
          ]
        }
      }
    }
  }
};

async function executeTest(testKey, testConfig) {
  const startTime = performance.now();
  
  try {
    const endpoint = `${DATAJUD_BASE_URL}/api_publica_${testConfig.tribunal}/_search`;
    const response = await fetch(endpoint, {
      method: 'POST',
      timeout: 15000,
      headers: {
        'Authorization': `APIKey ${DATAJUD_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testConfig.query)
    });

    const latency = Math.round(performance.now() - startTime);
    const data = await response.json().catch(() => null);

    return {
      status: response.ok ? 'success' : 'error',
      statusCode: response.status,
      latency: `${latency}ms`,
      endpoint,
      schema: response.ok ? {
        hits: data?.hits?.total?.value || 0,
        total: `${data?.hits?.hits?.length || 0} resultados`
      } : {
        error: data?.error?.reason || data?.error || 'Erro desconhecido'
      },
      success: response.ok
    };
  } catch (error) {
    const latency = Math.round(performance.now() - startTime);
    return {
      status: 'error',
      statusCode: 'TIMEOUT',
      latency: `${latency}ms`,
      schema: { error: error.message },
      success: false
    };
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!DATAJUD_API_KEY) {
      return Response.json(
        { error: 'DATAJUD_API_KEY não configurada' },
        { status: 500 }
      );
    }

    const { testType, testAll } = await req.json();

    if (testAll) {
      const results = {};
      for (const [key, config] of Object.entries(tests)) {
        results[key] = {
          name: config.name,
          description: config.description,
          ...(await executeTest(key, config))
        };
      }
      return Response.json({ results, success: true });
    }

    if (testType && tests[testType]) {
      const result = await executeTest(testType, tests[testType]);
      return Response.json({
        result: {
          name: tests[testType].name,
          description: tests[testType].description,
          ...result
        },
        success: result.success
      });
    }

    return Response.json(
      { error: 'testType inválido ou não fornecido' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[datajudTestE2E] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});