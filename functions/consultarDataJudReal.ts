import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Consulta API DataJud REAL (sem MOCK)
 * Implementa retry exponencial + caching
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cnj_number, tipo_consulta } = await req.json();

    if (!cnj_number) {
      return Response.json({ error: 'cnj_number obrigatório' }, { status: 400 });
    }

    // Limpar e validar CNJ
    const cnjLimpo = String(cnj_number).replace(/\D/g, '');
    if (cnjLimpo.length !== 20) {
      return Response.json({ 
        error: `CNJ inválido. Esperado 20 dígitos, recebido: ${cnjLimpo.length}` 
      }, { status: 400 });
    }

    // Tentar usar cache (5 minutos)
    const cacheKey = `datajud_${cnjLimpo}`;
    const cached = await tentarBuscarCache(base44, cacheKey);
    if (cached && !cached.expirado) {
      return Response.json({
        success: true,
        fonte: 'cache',
        timestamp_cache: cached.timestamp,
        dados: cached.dados
      });
    }

    // Buscar na API com retry
    const baseUrl = Deno.env.get('DATAJUD_BASE_URL');
    const apiKey = Deno.env.get('DATAJUD_API_KEY');

    if (!baseUrl || !apiKey) {
      return Response.json({ error: 'Configuração API DataJud incompleta' }, { status: 500 });
    }

    let resposta = null;
    let ultimoErro = null;

    // Retry exponencial (3 tentativas)
    for (let tentativa = 1; tentativa <= 3; tentativa++) {
      try {
        resposta = await consultarDataJudAPI(baseUrl, apiKey, cnjLimpo);
        break;
      } catch (erro) {
        ultimoErro = erro;
        if (tentativa < 3) {
          // Esperar com backoff exponencial (1s, 2s, 4s)
          const delay = Math.pow(2, tentativa - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    if (!resposta) {
      return Response.json({
        error: 'Erro ao consultar DataJud após 3 tentativas',
        detalhes: ultimoErro.message
      }, { status: 500 });
    }

    // Enriquecer com TPU (classe, assuntos)
    const enriquecido = await enriquecerComTPU(base44, resposta);

    // Guardar em cache (5 minutos = 300000 ms)
    await salvarCache(base44, cacheKey, enriquecido, 5 * 60 * 1000);

    return Response.json({
      success: true,
      fonte: 'api_datajud',
      timestamp: new Date().toISOString(),
      dados: enriquecido
    });
  } catch (error) {
    console.error('[consultarDataJudReal] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

/**
 * Chama API DataJud real
 */
async function consultarDataJudAPI(baseUrl, apiKey, cnjNumero) {
  const url = new URL(`${baseUrl}/processos/${cnjNumero}`);
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    timeout: 30000 // 30 segundos
  });

  if (!response.ok) {
    throw new Error(`DataJud API retornou ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Enriquece dados com TPU (classe, assuntos, movimentos)
 */
async function enriquecerComTPU(base44, dados) {
  const enriquecido = { ...dados };

  try {
    // Enriquecer classe
    if (dados.classe) {
      const classes = await base44.entities.TPUClasses.filter(
        { cod_classe: Number(dados.classe) },
        null,
        1
      );
      if (classes?.length > 0) {
        enriquecido.classe_enriquecida = {
          codigo: classes[0].cod_classe,
          nome: classes[0].nome,
          natureza: classes[0].natureza,
          glossario: classes[0].glossario
        };
      }
    }

    // Enriquecer assuntos
    if (Array.isArray(dados.assuntos) && dados.assuntos.length > 0) {
      enriquecido.assuntos_enriquecidos = [];
      for (const assunto of dados.assuntos) {
        const assuntos = await base44.entities.TPUAssuntos.filter(
          { cod_assunto: Number(assunto) },
          null,
          1
        );
        if (assuntos?.length > 0) {
          enriquecido.assuntos_enriquecidos.push({
            codigo: assuntos[0].cod_assunto,
            nome: assuntos[0].nome,
            glossario: assuntos[0].glossario,
            ramo_direito: assuntos[0].ramo_direito
          });
        }
      }
    }

    // Enriquecer movimentos
    if (Array.isArray(dados.movimentos) && dados.movimentos.length > 0) {
      enriquecido.movimentos_enriquecidos = [];
      for (const mov of dados.movimentos) {
        const movimentos = await base44.entities.TPUMovimentos.filter(
          { cod_movimento: Number(mov.codigo) },
          null,
          1
        );
        if (movimentos?.length > 0) {
          enriquecido.movimentos_enriquecidos.push({
            codigo: movimentos[0].cod_movimento,
            nome: movimentos[0].nome,
            categoria: movimentos[0].categoria,
            subcategoria: movimentos[0].subcategoria,
            visibilidade_externa: movimentos[0].visibilidade_externa,
            data_movimento: mov.data,
            data_intimacao: mov.dataIntimacao
          });
        }
      }
    }
  } catch (error) {
    console.warn('[enriquecerComTPU] Erro ao enriquecer:', error.message);
    // Continuar mesmo se falhar enriquecimento
  }

  return enriquecido;
}

/**
 * Tentacache de 5 minutos (usando KV ou session)
 */
async function tentarBuscarCache(base44, chave) {
  try {
    // TODO: Implementar com KV storage ou cache simples em memory
    // Por enquanto retorna null
    return null;
  } catch (e) {
    return null;
  }
}

/**
 * Salvar em cache
 */
async function salvarCache(base44, chave, dados, ttl) {
  try {
    // TODO: Implementar com KV storage
  } catch (e) {
    console.warn('[salvarCache] Erro:', e.message);
  }
}