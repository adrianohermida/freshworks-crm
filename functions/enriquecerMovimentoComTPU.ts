import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const TPU_BASE_URL = 'https://gateway.cloud.pje.jus.br/tpu';

/**
 * Função para enriquecer movimentações conforme são recebidas
 * 
 * WORKFLOW:
 * 1. DataJud retorna movimento com código (ex: 1001)
 * 2. Esta função busca o movimento correspondente no TPU
 * 3. Armazena a descrição completa, glossário, categorias, etc
 * 4. Retorna movimento enriquecido para ser gravado
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { codigoMovimento, nomeMovimento, processoId, action } = body;

    if (action === 'enriquecer') {
      return await enriquecerMovimento(base44, codigoMovimento, nomeMovimento, processoId);
    } else if (action === 'buscar_movimento_cache') {
      return await buscarMovimentoCache(base44, codigoMovimento);
    } else if (action === 'bulk_enriquecer') {
      return await bulkEnriquecerMovimentos(base44, body.movimentos);
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[enriquecerMovimentoComTPU]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

/**
 * Enriquece um movimento individual
 */
async function enriquecerMovimento(base44, codigoMovimento, nomeMovimento, processoId) {
  try {
    // 1. Verificar se já existe em cache local
    const cached = await buscarMovimentoLocal(base44, codigoMovimento);
    if (cached) {
      console.log(`[${codigoMovimento}] Encontrado em cache local`);
      return Response.json({
        success: true,
        source: 'cache',
        movimento: cached,
        enriquecimento: formatarEnriquecimento(cached)
      });
    }

    // 2. Buscar no TPU
    const tpuMovimento = await buscarMovimentoTPU(codigoMovimento);
    if (!tpuMovimento.success) {
      console.log(`[${codigoMovimento}] Não encontrado no TPU, usando dados básicos`);
      return Response.json({
        success: false,
        source: 'datajud',
        movimento: {
          codigo: codigoMovimento,
          nome: nomeMovimento,
          enriquecido: false
        },
        message: 'Movimento não encontrado no TPU'
      });
    }

    // 3. Armazenar em cache local para próximas vezes
    const movimentoData = tpuMovimento.data;
    try {
      await base44.asServiceRole.entities.TPUMovimentos.create({
        cod_item: movimentoData.cod_item,
        cod_item_pai: movimentoData.cod_item_pai,
        nome: movimentoData.nome,
        descricao_glossario: movimentoData.descricao_glossario || movimentoData.glossario,
        movimento: movimentoData.movimento,
        glossario: movimentoData.glossario,
        dispositivoLegal: movimentoData.dispositivoLegal,
        artigo: movimentoData.artigo,
        norma: movimentoData.norma,
        monocratico: movimentoData.monocratico,
        presidenteVice: movimentoData.presidenteVice,
        colegiado: movimentoData.colegiado,
        flgEletronico: movimentoData.flgEletronico,
        flgPapel: movimentoData.flgPapel,
        sigiloso: movimentoData.sigiloso,
        visibilidadeExterna: movimentoData.visibilidadeExterna,
        situacao: movimentoData.situacao || 'A',
        data_inclusao: movimentoData.data_inclusao,
        data_alteracao: movimentoData.data_alteracao,
        usuario_inclusao: 'datajud-enriquecimento'
      });
      console.log(`[${codigoMovimento}] Armazenado em cache`);
    } catch (cacheError) {
      console.warn(`[${codigoMovimento}] Falha ao armazenar em cache:`, cacheError.message);
    }

    return Response.json({
      success: true,
      source: 'tpu',
      movimento: movimentoData,
      enriquecimento: formatarEnriquecimento(movimentoData),
      processoId
    });
  } catch (error) {
    console.error(`[enriquecerMovimento ${codigoMovimento}]`, error);
    return Response.json({
      success: false,
      error: error.message,
      codigo: codigoMovimento
    }, { status: 500 });
  }
}

/**
 * Busca movimento no banco local (cache)
 */
async function buscarMovimentoLocal(base44, codigoMovimento) {
  try {
    const result = await base44.asServiceRole.entities.TPUMovimentos.filter({
      cod_item: codigoMovimento
    });
    
    if (result && result.length > 0) {
      return result[0];
    }
    return null;
  } catch (error) {
    console.warn(`[buscarMovimentoLocal] Erro:`, error.message);
    return null;
  }
}

/**
 * Busca movimento no TPU API
 */
async function buscarMovimentoTPU(codigoMovimento) {
  try {
    // TPU requer filtro obrigatório - usar código como parâmetro
    const url = `${TPU_BASE_URL}/api/v1/publico/consulta/detalhada/movimentos?codigo=${codigoMovimento}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      console.log(`[TPU] Movimento ${codigoMovimento} retornou ${response.status}`);
      return { success: false, status: response.status };
    }

    const data = await response.json();
    // API retorna em formato de consulta - extrair primeiro resultado
    const records = data.content || (Array.isArray(data) ? data : []);
    const movimento = records[0] || data.result || data;

    if (!movimento || !movimento.cod_item) {
      return { success: false, status: 404 };
    }

    return {
      success: true,
      data: movimento
    };
  } catch (error) {
    console.error(`[buscarMovimentoTPU ${codigoMovimento}]`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Enriquecimento em lote para múltiplos movimentos
 */
async function bulkEnriquecerMovimentos(base44, movimentos) {
  const resultados = [];
  const erros = [];

  for (const mov of movimentos) {
    try {
      const resultado = await enriquecerMovimento(
        base44,
        mov.codigo,
        mov.nome,
        mov.processoId
      );
      resultados.push(await resultado.json());
    } catch (error) {
      erros.push({
        codigo: mov.codigo,
        error: error.message
      });
    }
  }

  return Response.json({
    success: erros.length === 0,
    processados: resultados.length,
    erros: erros,
    resultados: resultados.slice(0, 10) // Limita resposta
  });
}

/**
 * Busca movimento em cache (sem armazenar novo)
 */
async function buscarMovimentoCache(base44, codigoMovimento) {
  const resultado = await buscarMovimentoLocal(base44, codigoMovimento);
  
  if (resultado) {
    return Response.json({
      success: true,
      source: 'cache',
      movimento: resultado
    });
  }

  return Response.json({
    success: false,
    message: 'Movimento não encontrado em cache'
  }, { status: 404 });
}

/**
 * Formata enriquecimento para ser usado na aplicação
 */
function formatarEnriquecimento(movimento) {
  return {
    codigo: movimento.cod_item,
    nome: movimento.nome,
    descricao: movimento.descricao_glossario || movimento.glossario,
    tipo: movimento.movimento,
    sigiloso: movimento.sigiloso === 'S',
    eletronico: movimento.flgEletronico === 'S',
    papel: movimento.flgPapel === 'S',
    visivel: movimento.visibilidadeExterna === 'S',
    categorias: {
      estadual_1grau: movimento.justica_estadual_1grau === 'S',
      estadual_2grau: movimento.justica_estadual_2grau === 'S',
      federal_1grau: movimento.justica_federal_1grau === 'S',
      federal_2grau: movimento.justica_federal_2grau === 'S',
      trabalho_1grau: movimento.justica_trabalho_1grau === 'S',
      trabalho_2grau: movimento.justica_trabalho_2grau === 'S'
    }
  };
}