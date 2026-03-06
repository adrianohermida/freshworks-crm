import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * AUDITORIA COMPLETA DE ENDPOINTS DATAJUD
 * Verifica: Conectividade, Volume de dados, Paginação, Pesquisas Avançadas
 * 
 * Tipos de pesquisa:
 * - Por número CNJ
 * - Por nome completo (partes)
 * - Por CPF (pessoa física)
 * - Por CNPJ (pessoa jurídica)
 * - Por nome de advogado
 * - Por número OAB
 * - Por número de juiz
 * - Por classe processual
 * - Por órgão julgador
 * - Por termo genérico
 */

const BASE_URL = Deno.env.get('DATAJUD_BASE_URL') || 'https://api-publica.datajud.cnj.jus.br';
const API_KEY = Deno.env.get('DATAJUD_API_KEY') || '';

const TRIBUNAIS = {
  tjsp: { nome: 'Tribunal de Justiça de São Paulo', api: 'api_publica_tjsp' },
  tjdft: { nome: 'Tribunal de Justiça do DF', api: 'api_publica_tjdft' },
  trf1: { nome: 'Tribunal Regional Federal 1ª Região', api: 'api_publica_trf1' },
  trf2: { nome: 'Tribunal Regional Federal 2ª Região', api: 'api_publica_trf2' },
  tjmg: { nome: 'Tribunal de Justiça de Minas Gerais', api: 'api_publica_tjmg' },
  tjrj: { nome: 'Tribunal de Justiça do Rio de Janeiro', api: 'api_publica_tjrj' },
  tjrs: { nome: 'Tribunal de Justiça do Rio Grande do Sul', api: 'api_publica_tjrs' },
  tjba: { nome: 'Tribunal de Justiça da Bahia', api: 'api_publica_tjba' }
};

const TEST_CASES = {
  cpf: { valor: '12345678901', descricao: 'Busca por CPF (pessoa física)', campo: 'partes.cpf' },
  cnpj: { valor: '12345678901234', descricao: 'Busca por CNPJ (pessoa jurídica)', campo: 'partes.cnpj' },
  nome_parte: { valor: 'Silva', descricao: 'Busca por nome (parte)', campo: 'partes.nome' },
  nome_advogado: { valor: 'Santos', descricao: 'Busca por nome de advogado', campo: 'representantes.nome' },
  oab: { valor: '123456', descricao: 'Busca por número OAB', campo: 'representantes.numeroOAB' },
  juiz: { valor: '1234567', descricao: 'Busca por número de juiz', campo: 'magistrado.numero' },
  classe: { valor: 1116, descricao: 'Busca por classe processual (Execução Fiscal)', campo: 'classe.codigo' },
  orgao: { valor: 13597, descricao: 'Busca por órgão julgador', campo: 'orgaoJulgador.codigo' }
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const auditReport = {
      timestamp: new Date().toISOString(),
      executor: user.email,
      fase: 'auditoria_completa',
      resultados: {
        conectividade: {},
        volume_dados: {},
        paginacao: {},
        pesquisas_avancadas: {}
      },
      resumo: {},
      recomendacoes: []
    };

    // =====================================================================
    // FASE 1: CONECTIVIDADE
    // =====================================================================
    console.log('[AUDIT] Fase 1: Testando conectividade...');
    
    for (const [alias, tribunal] of Object.entries(TRIBUNAIS)) {
      try {
        const startTime = Date.now();
        
        const query = {
          size: 1,
          query: { match_all: {} },
          sort: [{ '@timestamp': { order: 'asc' } }]
        };

        const response = await fetch(`${BASE_URL}/${tribunal.api}/_search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `ApiKey ${API_KEY}`
          },
          body: JSON.stringify(query),
          signal: AbortSignal.timeout(15000)
        });

        const responseTime = Date.now() - startTime;
        const data = response.ok ? await response.json() : null;
        const totalRecords = data?.hits?.total?.value || 0;

        auditReport.resultados.conectividade[alias] = {
          acessivel: response.ok,
          statusCode: response.status,
          tempoResposta: responseTime,
          totalRegistros: totalRecords,
          tribunal: tribunal.nome
        };
      } catch (err) {
        auditReport.resultados.conectividade[alias] = {
          acessivel: false,
          erro: err.message,
          tribunal: tribunal.nome
        };
      }
    }

    // =====================================================================
    // FASE 2: VOLUME DE DADOS (selecionar tribunal acessível)
    // =====================================================================
    console.log('[AUDIT] Fase 2: Auditando volume de dados...');

    const tribunalAcessivel = Object.entries(auditReport.resultados.conectividade)
      .find(([_, r]) => r.acessivel)?.[0];

    if (tribunalAcessivel) {
      const tribunal = TRIBUNAIS[tribunalAcessivel];
      
      try {
        // Buscar total de registros
        const queryTotal = {
          size: 0,
          query: { match_all: {} }
        };

        const responseTotal = await fetch(`${BASE_URL}/${tribunal.api}/_search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `ApiKey ${API_KEY}`
          },
          body: JSON.stringify(queryTotal),
          signal: AbortSignal.timeout(15000)
        });

        const dataTotal = await responseTotal.json();
        const totalRecords = dataTotal.hits?.total?.value || 0;
        const pageSize = 100;
        const totalPages = Math.ceil(totalRecords / pageSize);

        auditReport.resultados.volume_dados = {
          tribunal: tribunalAcessivel,
          totalRegistros: totalRecords,
          tamanhoPagePadrao: pageSize,
          totalPaginas: totalPages,
          status: totalRecords > 0 ? 'ok' : 'vazio',
          estimativaTempo: `${(totalPages * 0.5).toFixed(1)} minutos para sincronizar tudo`
        };
      } catch (err) {
        auditReport.resultados.volume_dados = {
          tribunal: tribunalAcessivel,
          erro: err.message
        };
      }
    }

    // =====================================================================
    // FASE 3: PAGINAÇÃO E PERFORMANCE
    // =====================================================================
    console.log('[AUDIT] Fase 3: Testando paginação...');

    if (tribunalAcessivel) {
      const tribunal = TRIBUNAIS[tribunalAcessivel];
      const pagSizes = [10, 50, 100, 500, 1000];
      const paginacaoTeste = {};

      for (const size of pagSizes) {
        try {
          const startTime = Date.now();
          const query = {
            size: Math.min(size, 10000),
            query: { match_all: {} },
            sort: [{ '@timestamp': { order: 'asc' } }]
          };

          const response = await fetch(`${BASE_URL}/${tribunal.api}/_search`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `ApiKey ${API_KEY}`
            },
            body: JSON.stringify(query),
            signal: AbortSignal.timeout(20000)
          });

          const responseTime = Date.now() - startTime;
          const data = await response.json();
          const recordsFetched = data.hits?.hits?.length || 0;

          paginacaoTeste[size] = {
            tamanho: size,
            recordsBuscados: recordsFetched,
            tempoMs: responseTime,
            tempoSegundos: (responseTime / 1000).toFixed(2),
            status: response.ok ? 'sucesso' : 'erro'
          };
        } catch (err) {
          paginacaoTeste[size] = {
            tamanho: size,
            erro: err.message
          };
        }
      }

      auditReport.resultados.paginacao = paginacaoTeste;
    }

    // =====================================================================
    // FASE 4: PESQUISAS AVANÇADAS
    // =====================================================================
    console.log('[AUDIT] Fase 4: Testando pesquisas avançadas...');

    if (tribunalAcessivel) {
      const tribunal = TRIBUNAIS[tribunalAcessivel];
      const pesquisasTeste = {};

      for (const [tipo, testCase] of Object.entries(TEST_CASES)) {
        try {
          const query = {
            size: 10,
            query: {
              bool: {
                must: [
                  { match: { [testCase.campo]: testCase.valor } }
                ]
              }
            },
            sort: [{ '@timestamp': { order: 'asc' } }]
          };

          const startTime = Date.now();
          const response = await fetch(`${BASE_URL}/${tribunal.api}/_search`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `ApiKey ${API_KEY}`
            },
            body: JSON.stringify(query),
            signal: AbortSignal.timeout(20000)
          });

          const responseTime = Date.now() - startTime;
          const data = await response.json();
          const recordsFound = data.hits?.total?.value || 0;

          pesquisasTeste[tipo] = {
            tipo: tipo,
            descricao: testCase.descricao,
            campo: testCase.campo,
            valorTeste: testCase.valor,
            registrosEncontrados: recordsFound,
            tempoMs: responseTime,
            status: response.ok ? 'funciona' : 'erro',
            exemplo: recordsFound > 0 ? {
              numero: data.hits.hits[0]?._source?.numeroProcesso,
              classe: data.hits.hits[0]?._source?.classe?.nome,
              tribunal: data.hits.hits[0]?._source?.tribunal
            } : null
          };
        } catch (err) {
          pesquisasTeste[tipo] = {
            tipo: tipo,
            descricao: testCase.descricao,
            campo: testCase.campo,
            status: 'erro',
            erro: err.message
          };
        }
      }

      auditReport.resultados.pesquisas_avancadas = pesquisasTeste;
    }

    // =====================================================================
    // RESUMO E RECOMENDAÇÕES
    // =====================================================================
    const conectividadeOk = Object.values(auditReport.resultados.conectividade)
      .filter(c => c.acessivel).length;

    auditReport.resumo = {
      tribunaisAcessiveis: `${conectividadeOk}/8`,
      dataAuditoria: new Date().toISOString(),
      statusGeral: conectividadeOk > 0 ? 'FUNCIONANDO' : 'CRÍTICO'
    };

    // Recomendações
    if (conectividadeOk === 0) {
      auditReport.recomendacoes.push({
        severidade: 'CRÍTICA',
        problema: 'Nenhum tribunal acessível',
        solucao: 'Verificar conectividade com DataJud, validar API_KEY, verificar firewall'
      });
    }

    const pesquisasOk = Object.values(auditReport.resultados.pesquisas_avancadas || {})
      .filter(p => p.status === 'funciona').length;

    if (pesquisasOk < 5) {
      auditReport.recomendacoes.push({
        severidade: 'ALTA',
        problema: `Apenas ${pesquisasOk}/8 tipos de pesquisa funcionando`,
        solucao: 'Implementar filtros faltantes no query DSL, validar mapeamento de campos'
      });
    }

    // Salvar auditoria
    try {
      await base44.asServiceRole.entities.Analytics.create({
        user_id: user.email,
        event_type: 'endpoint_audit_completed',
        entity_type: 'system',
        action: 'Auditoria completa de endpoints DataJud',
        timestamp: new Date().toISOString(),
        metadata: auditReport,
        status: conectividadeOk > 0 ? 'success' : 'error'
      });
    } catch (e) {
      console.warn('Erro ao salvar auditoria:', e.message);
    }

    return Response.json(auditReport);

  } catch (error) {
    console.error('[auditEndpointsDataJud]', error);
    return Response.json({
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
});