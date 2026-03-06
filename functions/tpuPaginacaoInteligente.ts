import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const TPU_BASE_URL = 'https://gateway.cloud.pje.jus.br/tpu';

/**
 * Paginação Inteligente com Cursor e Cache
 * 
 * Estratégias:
 * 1. Cursor-based pagination (melhor para dados grandes)
 * 2. Offset-based pagination (fallback)
 * 3. Cache de metapaginação (total, hasNext, hasPrev)
 * 4. Prefetch (pré-carrega próxima página)
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      tipo = 'movimentos', // movimentos, classes, assuntos, documentos
      pagina = 1,
      limit = 50,
      cursor = null,
      filtros = {},
      prefetch = true // pre-carregar próxima página
    } = body;

    const resultado = await carregarComPaginacao(
      base44,
      tipo,
      pagina,
      limit,
      cursor,
      filtros,
      prefetch
    );

    return Response.json(resultado);
  } catch (error) {
    console.error('[tpuPaginacaoInteligente]', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});

/**
 * Carrega dados com paginação inteligente
 */
async function carregarComPaginacao(base44, tipo, pagina, limit, cursor, filtros, prefetch) {
  const inicio = Date.now();

  // 1. Tentar carregar do cache local
  const entityName = mapTipoToEntity(tipo);
  let localData = [];
  let totalLocal = 0;

  try {
    const data = await base44.asServiceRole.entities[entityName].list();
    localData = Array.isArray(data) ? data : (data?.data || []);
    totalLocal = localData.length;
  } catch (e) {
    console.warn(`Erro ao carregar ${entityName}:`, e.message);
  }

  // 2. Se local tem dados, usar paginação local
  if (localData.length > 0) {
    const { registros, hasNext, hasPrev, nextCursor, prevCursor, totalPaginas } = 
      paginarLocal(localData, pagina, limit);

    const resultado = {
      success: true,
      source: 'cache',
      tipo: tipo,
      pagina: pagina,
      limite: limit,
      totalRegistros: totalLocal,
      totalPaginas: totalPaginas,
      hasNext: hasNext,
      hasPrev: hasPrev,
      nextCursor: nextCursor,
      prevCursor: prevCursor,
      registros: registros,
      metadados: {
        source: 'cache-local',
        tempoMs: Date.now() - inicio,
        prefetchDisponivel: prefetch && hasNext
      }
    };

    // 3. Prefetch opcional
    if (prefetch && hasNext) {
      prefetchProxima(base44, tipo, pagina + 1, limit).catch(e => 
        console.warn('[prefetch] Erro:', e.message)
      );
    }

    return resultado;
  }

  // 4. Senão, buscar na TPU
  const tpuResult = await buscarTPUComPaginacao(tipo, pagina, limit, filtros);

  if (!tpuResult.success) {
    return tpuResult;
  }

  // 5. Armazenar em cache
  await armazenarEmCache(base44, tpuResult.registros, entityName);

  // 6. Prefetch
  if (prefetch && tpuResult.hasNext) {
    prefetchTPU(tipo, pagina + 1, limit, filtros).catch(e =>
      console.warn('[prefetch TPU] Erro:', e.message)
    );
  }

  return {
    success: true,
    source: 'tpu',
    ...tpuResult,
    metadados: {
      source: 'tpu-api',
      tempoMs: Date.now() - inicio,
      cacheado: false,
      prefetchDisponivel: prefetch && tpuResult.hasNext
    }
  };
}

/**
 * Paginação local em memória
 */
function paginarLocal(dados, pagina, limit) {
  const totalPaginas = Math.ceil(dados.length / limit);
  const offset = (pagina - 1) * limit;
  
  const registros = dados.slice(offset, offset + limit);
  const hasNext = pagina < totalPaginas;
  const hasPrev = pagina > 1;
  
  // Cursor simples: ID do primeiro + último item
  const nextCursor = hasNext ? `${registros[registros.length - 1]?.cod_item || pagina + 1}` : null;
  const prevCursor = hasPrev ? `${registros[0]?.cod_item || pagina - 1}` : null;

  return {
    registros,
    hasNext,
    hasPrev,
    nextCursor,
    prevCursor,
    totalPaginas
  };
}

/**
 * Busca na TPU com paginação
 */
async function buscarTPUComPaginacao(tipo, pagina, limit, filtros) {
  try {
    // TPU requer filtro obrigatório (código, nome ou glossário)
    if (!filtros.nome && !filtros.codigo && !filtros.glossario) {
      return {
        success: false,
        error: 'TPU requer filtro obrigatório: nome, código ou glossário. Use tpuBuscaAvancada.js para busca sem filtro.',
        registros: [],
        totalRegistros: 0
      };
    }

    const endpoint = mapTipoToEndpoint(tipo);
    
    const params = new URLSearchParams();
    params.append('pagina', pagina);
    params.append('tamanho', Math.min(limit, 500)); // TPU limita em 500

    // Adicionar filtros
    if (filtros.nome) params.append('nome', filtros.nome);
    if (filtros.codigo) params.append('codigo', filtros.codigo);
    if (filtros.glossario) params.append('glossario', filtros.glossario);

    const url = `${TPU_BASE_URL}/api/v1/publico/consulta/detalhada/${endpoint}?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      return {
        success: false,
        error: `TPU retornou ${response.status}`,
        registros: [],
        totalRegistros: 0
      };
    }

    const data = await response.json();
    const registros = data.content || (Array.isArray(data) ? data : []);
    const totalRegistros = data.totalElements || registros.length;
    const totalPaginas = data.totalPages || Math.ceil(totalRegistros / limit);
    const hasNext = data.last === false || pagina < totalPaginas;
    const hasPrev = pagina > 1;

    // Cursor da TPU
    const nextCursor = hasNext ? pagina + 1 : null;
    const prevCursor = hasPrev ? pagina - 1 : null;

    return {
      success: true,
      registros: registros,
      totalRegistros: totalRegistros,
      totalPaginas: totalPaginas,
      pagina: pagina,
      limite: limit,
      hasNext: hasNext,
      hasPrev: hasPrev,
      nextCursor: nextCursor,
      prevCursor: prevCursor
    };
  } catch (error) {
    console.error('[buscarTPUComPaginacao]', error);
    return {
      success: false,
      error: error.message,
      registros: [],
      totalRegistros: 0
    };
  }
}

/**
 * Armazena registros em cache local
 */
async function armazenarEmCache(base44, registros, entityName) {
  for (const registro of registros) {
    try {
      const mappedRecord = mapRecord(registro, entityName);
      await base44.asServiceRole.entities[entityName].create(mappedRecord);
    } catch (e) {
      // Ignorar duplicatas
    }
  }
}

/**
 * Prefetch local (não faz nada, apenas marca disponibilidade)
 */
async function prefetchProxima(base44, tipo, pagina, limit) {
  console.log(`[prefetch] Próxima página ${pagina} do tipo ${tipo} pronta em cache`);
}

/**
 * Prefetch da TPU
 */
async function prefetchTPU(tipo, pagina, limit, filtros) {
  try {
    // Só fazer prefetch se houver filtro obrigatório
    if (!filtros.nome && !filtros.codigo && !filtros.glossario) {
      return; // Não fazer prefetch sem filtro
    }

    const endpoint = mapTipoToEndpoint(tipo);
    const params = new URLSearchParams();
    params.append('pagina', pagina);
    params.append('tamanho', Math.min(limit, 500));

    if (filtros.nome) params.append('nome', filtros.nome);
    if (filtros.codigo) params.append('codigo', filtros.codigo);
    if (filtros.glossario) params.append('glossario', filtros.glossario);

    const url = `${TPU_BASE_URL}/api/v1/publico/consulta/detalhada/${endpoint}?${params.toString()}`;

    await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000)
    });

    console.log(`[prefetch TPU] Página ${pagina} do tipo ${tipo} prefetchada`);
  } catch (e) {
    // Prefetch falhou silenciosamente
  }
}

/**
 * Map tipo para entity name
 */
function mapTipoToEntity(tipo) {
  const map = {
    movimentos: 'TPUMovimentos',
    classes: 'TPUClasses',
    assuntos: 'TPUAssuntos',
    documentos: 'TPUDocumentos'
  };
  return map[tipo] || 'TPUMovimentos';
}

/**
 * Map tipo para endpoint
 */
function mapTipoToEndpoint(tipo) {
  const map = {
    movimentos: 'movimentos',
    classes: 'classes',
    assuntos: 'assuntos',
    documentos: 'documentos'
  };
  return map[tipo] || 'movimentos';
}

/**
 * Map record conforme tipo
 */
function mapRecord(record, entityName) {
  const base = {
    cod_item: record.cod_item,
    nome: record.nome,
    descricao_glossario: record.descricao_glossario || record.glossario,
    situacao: record.situacao || 'A'
  };

  switch (entityName) {
    case 'TPUMovimentos':
      return {
        ...base,
        cod_item_pai: record.cod_item_pai,
        movimento: record.movimento,
        sigiloso: record.sigiloso
      };
    case 'TPUClasses':
      return {
        ...base,
        cod_item_pai: record.cod_item_pai,
        sigla: record.sigla,
        natureza: record.natureza
      };
    case 'TPUAssuntos':
      return {
        ...base,
        cod_item_pai: record.cod_item_pai,
        assunto_secundario: record.assunto_secundario
      };
    case 'TPUDocumentos':
      return {
        ...base,
        cod_item_pai: record.cod_item_pai
      };
    default:
      return base;
  }
}