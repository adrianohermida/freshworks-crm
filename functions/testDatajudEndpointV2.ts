import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Test DataJud Endpoints - Versão 2
 * Testes 2 e 3 para descoberta de bases de dados por tribunal
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courtAlias, testType = 'discovery' } = await req.json();

    // TEST 2: Discovery de base de dados via padrão de URL
    if (testType === 'discovery') {
      const tribunalPatterns = {
        'tjsp': {
          urls: [
            'https://esaj.tjsp.jus.br/cjsg/consultaPublica.do',
            'https://www2.tjsp.jus.br/cjsg/',
            'https://www.tjsp.jus.br'
          ],
          testQueries: ['0000001-00.2023.8.26.0100', '1029242-18.2021.8.26.0562']
        },
        'trf1': {
          urls: [
            'https://processual.trf1.jus.br/consultapublica/',
            'https://dje.trf1.jus.br/djeservice/',
            'https://www.trf1.jus.br'
          ],
          testQueries: ['0000001-00.2023.1.01.0001', '0000001-00.2023.1.10.0001']
        },
        'stj': {
          urls: [
            'https://www.stj.jus.br/websecstj/cgi-bin/",
            'https://processo.stj.jus.br/ws/processo/pesquisa/obterListaProcessos',
            'https://www.stj.jus.br'
          ],
          testQueries: ['0000001-00.2023.0.00.0000', '0000001-00.2023.0.04.0000']
        },
        'tjdft': {
          urls: [
            'https://consulta.tjdft.jus.br/cgi-bin/consulta_colegiada',
            'https://tjdft.jus.br',
            'https://www.tjdft.jus.br/publicacoes/dje'
          ],
          testQueries: ['0000001-00.2023.8.07.0000', '0000001-00.2023.8.07.0001']
        }
      };

      const pattern = tribunalPatterns[courtAlias];
      if (!pattern) {
        return Response.json({
          success: false,
          testType: 'discovery',
          error: 'Tribunal pattern não encontrado'
        }, { status: 404 });
      }

      const discoveryResults = [];
      for (const url of pattern.urls) {
        try {
          const startTime = performance.now();
          const response = await fetch(url, {
            method: 'HEAD',
            timeout: 5000
          }).catch(() => ({ ok: false, status: 0 }));
          const responseTime = Math.round(performance.now() - startTime);

          discoveryResults.push({
            url,
            accessible: response.ok,
            status: response.status || 'timeout',
            responseTime
          });
        } catch (e) {
          discoveryResults.push({
            url,
            accessible: false,
            status: 'error',
            error: e.message
          });
        }
      }

      return Response.json({
        success: true,
        testType: 'discovery',
        tribunal: courtAlias,
        discovery: discoveryResults,
        accessibleCount: discoveryResults.filter(r => r.accessible).length
      });
    }

    // TEST 3: Query direto à base de dados do tribunal
    if (testType === 'query') {
      const queryPatterns = {
        'tjsp': {
          queryType: 'by_orgao_judiciario',
          endpoint: 'https://esaj.tjsp.jus.br/cjsg/consultaPublica.do',
          params: { numeroProcesso: '1029242-18.2021.8.26.0562' }
        },
        'trf1': {
          queryType: 'by_number',
          endpoint: 'https://processual.trf1.jus.br/consultapublica/',
          params: { processoNumero: '0000001-00.2023.1.01.0001' }
        },
        'stj': {
          queryType: 'by_number',
          endpoint: 'https://www.stj.jus.br/websecstj/',
          params: { numero: '0000001-00.2023.0.00.0000' }
        }
      };

      const queryConfig = queryPatterns[courtAlias];
      if (!queryConfig) {
        return Response.json({
          success: false,
          testType: 'query',
          error: 'Padrão de query não encontrado para tribunal'
        }, { status: 404 });
      }

      try {
        const startTime = performance.now();
        const queryUrl = new URL(queryConfig.endpoint);
        Object.entries(queryConfig.params).forEach(([key, value]) => {
          queryUrl.searchParams.append(key, value);
        });

        const response = await fetch(queryUrl.toString(), {
          method: 'GET',
          timeout: 10000,
          headers: {
            'User-Agent': 'DataJud-Integration-Test/1.0'
          }
        });

        const responseTime = Math.round(performance.now() - startTime);
        const text = await response.text();

        return Response.json({
          success: response.ok,
          testType: 'query',
          tribunal: courtAlias,
          queryType: queryConfig.queryType,
          endpoint: queryConfig.endpoint,
          status: response.status,
          responseTime,
          contentLength: text.length,
          dataFound: text.length > 100,
          sample: text.substring(0, 500)
        });
      } catch (error) {
        return Response.json({
          success: false,
          testType: 'query',
          tribunal: courtAlias,
          error: error.message,
          details: 'Falha ao executar query direto na base'
        });
      }
    }

    return Response.json({ error: 'Invalid testType' }, { status: 400 });
  } catch (error) {
    console.error('[testDatajudEndpointV2] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});