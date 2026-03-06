import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * AUDITORIA COMPLETA DO MÓDULO TPU
 * Verifica: conectividade, entidades, mapeamento, sincronização
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const audit = {
      timestamp: new Date().toISOString(),
      status: 'iniciado',
      resultados: {
        conectividade: {},
        entidades: {},
        mapeamento: {},
        sincronizacao: {}
      }
    };

    // =====================================================================
    // 1. TESTE DE CONECTIVIDADE COM APIs DA CNJ
    // =====================================================================
    console.log('[AUDIT] 1. Testando conectividade com APIs CNJ...');
    
    const URLS_CNJ = {
      'Assuntos': 'https://www.cnj.jus.br/webservices/buscacnj/api/publico/tabelas/assuntos',
      'Classes': 'https://www.cnj.jus.br/webservices/buscacnj/api/publico/tabelas/classes',
      'Movimentos': 'https://www.cnj.jus.br/webservices/buscacnj/api/publico/tabelas/movimentos',
      'Documentos': 'https://www.cnj.jus.br/webservices/buscacnj/api/publico/tabelas/documentos'
    };

    for (const [tipo, url] of Object.entries(URLS_CNJ)) {
      try {
        const response = await fetch(url, {
          headers: { 'Accept': 'application/json', 'User-Agent': 'DataJud-Audit/1.0' },
          signal: AbortSignal.timeout(15000)
        });

        audit.resultados.conectividade[tipo] = {
          acessivel: response.ok,
          statusCode: response.status,
          statusText: response.statusText,
          url: url,
          headers: {
            contentType: response.headers.get('content-type'),
            contentLength: response.headers.get('content-length')
          }
        };

        if (response.ok) {
          const data = await response.json();
          const itens = Array.isArray(data) ? data : (data?.data || data?.itens || []);
          audit.resultados.conectividade[tipo].registrosAPI = itens.length;
          audit.resultados.conectividade[tipo].primeiroCampo = itens.length > 0 ? Object.keys(itens[0]) : [];
        }
      } catch (err) {
        audit.resultados.conectividade[tipo] = {
          acessivel: false,
          erro: err.message,
          url: url
        };
      }
    }

    // =====================================================================
    // 2. VERIFICAR ENTIDADES NO BANCO DE DADOS
    // =====================================================================
    console.log('[AUDIT] 2. Verificando entidades TPU...');

    const ENTIDADES = {
      'TPUAssuntos': 'Assuntos',
      'TPUClasses': 'Classes',
      'TPUMovimentos': 'Movimentos',
      'TPUDocumentos': 'Documentos'
    };

    for (const [nomeEntidade, tipo] of Object.entries(ENTIDADES)) {
      try {
        const schema = await base44.asServiceRole.entities[nomeEntidade].schema();
        const registros = await base44.asServiceRole.entities[nomeEntidade].list();

        audit.resultados.entidades[nomeEntidade] = {
          existe: true,
          totalRegistros: Array.isArray(registros) ? registros.length : 0,
          campos: schema ? Object.keys(schema.properties || {}) : [],
          schema: schema ? JSON.stringify(schema, null, 2) : 'N/A'
        };
      } catch (err) {
        audit.resultados.entidades[nomeEntidade] = {
          existe: false,
          erro: err.message
        };
      }
    }

    // =====================================================================
    // 3. VALIDAR MAPEAMENTO DE CAMPOS
    // =====================================================================
    console.log('[AUDIT] 3. Validando mapeamento de campos...');

    audit.resultados.mapeamento = {
      TPUAssuntos: {
        esperados: ['cod_assunto', 'nome', 'ramo_direito', 'glossario', 'situacao'],
        mapeamento: 'cod_assunto (PK) → nome → ramo_direito → glossario'
      },
      TPUClasses: {
        esperados: ['cod_classe', 'nome', 'sigla', 'glossario', 'situacao'],
        mapeamento: 'cod_classe (PK) → nome → sigla → glossario'
      },
      TPUMovimentos: {
        esperados: ['cod_movimento', 'nome', 'categoria', 'subcategoria', 'glossario', 'situacao'],
        mapeamento: 'cod_movimento (PK) → nome → categoria → subcategoria → glossario'
      },
      TPUDocumentos: {
        esperados: ['cod_documento_processual', 'txt_glossario', 'situacao'],
        mapeamento: 'cod_documento_processual (PK) → txt_glossario'
      }
    };

    // =====================================================================
    // 4. TESTE DE SINCRONIZAÇÃO (AMOSTRA)
    // =====================================================================
    console.log('[AUDIT] 4. Testando sincronização com amostra...');

    const testeSync = {
      Assuntos: { url: URLS_CNJ['Assuntos'], entity: 'TPUAssuntos', chaveId: 'cod_assunto' },
      Classes: { url: URLS_CNJ['Classes'], entity: 'TPUClasses', chaveId: 'cod_classe' },
      Movimentos: { url: URLS_CNJ['Movimentos'], entity: 'TPUMovimentos', chaveId: 'cod_movimento' },
      Documentos: { url: URLS_CNJ['Documentos'], entity: 'TPUDocumentos', chaveId: 'cod_documento_processual' }
    };

    for (const [tipo, config] of Object.entries(testeSync)) {
      try {
        const response = await fetch(config.url, {
          headers: { 'Accept': 'application/json', 'User-Agent': 'DataJud-Audit/1.0' },
          signal: AbortSignal.timeout(15000)
        });

        if (!response.ok) {
          audit.resultados.sincronizacao[tipo] = {
            sucesso: false,
            erro: `HTTP ${response.status}: ${response.statusText}`
          };
          continue;
        }

        const data = await response.json();
        const itens = Array.isArray(data) ? data : (data?.data || data?.itens || []);

        if (itens.length === 0) {
          audit.resultados.sincronizacao[tipo] = {
            sucesso: false,
            erro: 'API retornou lista vazia',
            resposta: data
          };
          continue;
        }

        // Pegar primeira amostra
        const amostra = itens[0];
        const camposAmostra = Object.keys(amostra);

        // Validar chave ID
        const temChaveId = config.chaveId in amostra;

        audit.resultados.sincronizacao[tipo] = {
          sucesso: temChaveId,
          totalItens: itens.length,
          camposAmostra: camposAmostra,
          temChaveId: temChaveId,
          chaveId: config.chaveId,
          primeiroRegistro: amostra,
          avisos: []
        };

        // Avisos
        if (!temChaveId) {
          audit.resultados.sincronizacao[tipo].avisos.push(
            `⚠️ Campo chave '${config.chaveId}' não encontrado na API. Campos disponíveis: ${camposAmostra.join(', ')}`
          );
        }

        // Tentar inserir amostra
        try {
          const testData = {
            [config.chaveId]: amostra[config.chaveId] || amostra.codigo || 'TEST_' + Math.random(),
            nome: amostra.nome || 'Teste',
            glossario: amostra.glossario || amostra.dsc_glossario || amostra.descricao || 'Teste',
            situacao: amostra.situacao || 'A'
          };

          // Verificar se já existe
          const existe = await base44.asServiceRole.entities[config.entity].filter(
            { [config.chaveId]: testData[config.chaveId] },
            null,
            1
          );

          if (!existe || existe.length === 0) {
            await base44.asServiceRole.entities[config.entity].create(testData);
            audit.resultados.sincronizacao[tipo].inserucaoTeste = 'sucesso';
          } else {
            audit.resultados.sincronizacao[tipo].inserucaoTeste = 'já existe';
          }
        } catch (err) {
          audit.resultados.sincronizacao[tipo].inserucaoTeste = `erro: ${err.message}`;
        }

      } catch (err) {
        audit.resultados.sincronizacao[tipo] = {
          sucesso: false,
          erro: err.message
        };
      }
    }

    // =====================================================================
    // 5. RELATÓRIO FINAL
    // =====================================================================
    console.log('[AUDIT] 5. Gerando relatório final...');

    const conectividadeOk = Object.values(audit.resultados.conectividade).filter(c => c.acessivel).length;
    const entidadesOk = Object.values(audit.resultados.entidades).filter(e => e.existe).length;
    const sincOk = Object.values(audit.resultados.sincronizacao).filter(s => s.sucesso).length;

    audit.resumo = {
      conectividadeAPICNJ: `${conectividadeOk}/4 acessíveis`,
      entidadesLocal: `${entidadesOk}/4 existem`,
      sincronizacaoAmostra: `${sincOk}/4 funcionando`,
      statusGeral: conectividadeOk > 0 && entidadesOk === 4 ? 'PROBLEMAS DETECTADOS' : 'CRÍTICO'
    };

    // Recomendações
    audit.recomendacoes = [];

    if (conectividadeOk < 4) {
      audit.recomendacoes.push({
        severidade: 'CRÍTICA',
        problema: 'APIs CNJ indisponíveis ou lentas',
        solucao: 'Verificar conectividade com cnj.jus.br, testar URLs manualmente, considerar cache local'
      });
    }

    if (entidadesOk < 4) {
      audit.recomendacoes.push({
        severidade: 'CRÍTICA',
        problema: 'Algumas entidades TPU não existem',
        solucao: 'Criar entidades faltantes: ' + Object.keys(ENTIDADES).filter(
          e => !audit.resultados.entidades[e]?.existe
        ).join(', ')
      });
    }

    if (sincOk < 4) {
      audit.recomendacoes.push({
        severidade: 'ALTA',
        problema: 'Erro no mapeamento de campos ou chaves ID',
        solucao: 'Validar campos esperados vs campos da API, ajustar chaveId'
      });
    }

    return Response.json(audit);

  } catch (error) {
    console.error('[auditTPUModule]', error);
    return Response.json({ 
      error: error.message, 
      stack: error.stack,
      timestamp: new Date().toISOString() 
    }, { status: 500 });
  }
});