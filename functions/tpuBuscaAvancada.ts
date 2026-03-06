import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const TPU_BASE_URL = 'https://gateway.cloud.pje.jus.br/tpu';

/**
 * Busca Textual Avançada com Paginação Inteligente
 * Suporta:
 * - Busca por nome/descrição
 * - Filtros por tipo (movimento, classe, assunto, documento)
 * - Paginação inteligente com cache
 * - Full-text search
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
      query, 
      tipo = 'todos', 
      pagina = 1, 
      limit = 20,
      campos = ['nome', 'descricao_glossario'],
      ordenar = 'relevancia' // 'relevancia', 'nome', 'data'
    } = body;

    if (!query || query.length < 2) {
      return Response.json({
        success: false,
        message: 'Query deve ter no mínimo 2 caracteres'
      }, { status: 400 });
    }

    // Busca local primeiro (cache)
    const localResults = await buscaLocal(base44, query, tipo, campos, pagina, limit);
    
    // Se tem resultados e está cacheado, retorna logo
    if (localResults.total > 0) {
      return Response.json({
        success: true,
        source: 'cache',
        total: localResults.total,
        pagina: pagina,
        limite: limit,
        registros: localResults.registros,
        tempoMs: localResults.tempoMs
      });
    }

    // Senão busca na TPU
    const tpuResults = await buscaTPU(base44, query, tipo, pagina, limit, ordenar);

    return Response.json({
      success: true,
      source: 'tpu',
      total: tpuResults.total,
      pagina: pagina,
      limite: limit,
      registros: tpuResults.registros,
      tempoMs: tpuResults.tempoMs
    });
  } catch (error) {
    console.error('[tpuBuscaAvancada]', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});

/**
 * Busca em banco de dados local (cache)
 */
async function buscaLocal(base44, query, tipo, campos, pagina, limit) {
  const inicio = Date.now();
  const offset = (pagina - 1) * limit;
  const queryRegex = new RegExp(query, 'i');

  const entities = {
    todos: ['TPUMovimentos', 'TPUClasses', 'TPUAssuntos', 'TPUDocumentos'],
    movimentos: ['TPUMovimentos'],
    classes: ['TPUClasses'],
    assuntos: ['TPUAssuntos'],
    documentos: ['TPUDocumentos']
  };

  const entitiesToSearch = entities[tipo] || entities.todos;
  let allResults = [];

  for (const entityName of entitiesToSearch) {
    try {
      const data = await base44.asServiceRole.entities[entityName].list();
      const records = Array.isArray(data) ? data : (data?.data || []);

      const filtered = records.filter(r => {
        return campos.some(campo => {
          const valor = r[campo];
          return valor && queryRegex.test(String(valor));
        });
      });

      allResults.push(...filtered.map(r => ({
        ...r,
        _entity: entityName,
        _relevancia: calcularRelevancia(r, query, campos)
      })));
    } catch (e) {
      console.warn(`Erro ao buscar em ${entityName}:`, e.message);
    }
  }

  // Ordenar por relevância
  allResults.sort((a, b) => b._relevancia - a._relevancia);

  const paginated = allResults.slice(offset, offset + limit);
  const tempoMs = Date.now() - inicio;

  return {
    total: allResults.length,
    registros: paginated,
    tempoMs
  };
}

/**
 * Busca na API TPU com paginação
 */
async function buscaTPU(base44, query, tipo, pagina, limit, ordenar) {
  const inicio = Date.now();
  
  // TPU requer filtro (nome/query) para qualquer busca
  if (!query) {
    return {
      total: 0,
      registros: [],
      tempoMs: 0
    };
  }

  const endpoints = {
    todos: [
      { endpoint: 'movimentos', entity: 'TPUMovimentos', campo: 'nome' },
      { endpoint: 'classes', entity: 'TPUClasses', campo: 'nome' },
      { endpoint: 'assuntos', entity: 'TPUAssuntos', campo: 'nome' },
      { endpoint: 'documentos', entity: 'TPUDocumentos', campo: 'nome' }
    ],
    movimentos: [{ endpoint: 'movimentos', entity: 'TPUMovimentos', campo: 'nome' }],
    classes: [{ endpoint: 'classes', entity: 'TPUClasses', campo: 'nome' }],
    assuntos: [{ endpoint: 'assuntos', entity: 'TPUAssuntos', campo: 'nome' }],
    documentos: [{ endpoint: 'documentos', entity: 'TPUDocumentos', campo: 'nome' }]
  };

  const targets = endpoints[tipo] || endpoints.todos;
  let allResults = [];

  for (const { endpoint, entity, campo } of targets) {
    try {
      const url = `${TPU_BASE_URL}/api/v1/publico/consulta/detalhada/${endpoint}?nome=${encodeURIComponent(query)}&pagina=1&tamanho=100`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) continue;

      const data = await response.json();
      const records = data.content || (Array.isArray(data) ? data : []);

      // Armazenar em cache
      for (const record of records) {
        try {
          const mappedRecord = mapRecord(record, endpoint);
          await base44.asServiceRole.entities[entity].create(mappedRecord).catch(() => {});
        } catch (e) {}
      }

      allResults.push(...records.map(r => ({
        ...r,
        _entity: entity,
        _relevancia: calcularRelevancia(r, query, [campo])
      })));
    } catch (error) {
      console.warn(`Erro ao buscar ${endpoint}:`, error.message);
    }
  }

  // Ordenar
  if (ordenar === 'relevancia') {
    allResults.sort((a, b) => b._relevancia - a._relevancia);
  } else if (ordenar === 'nome') {
    allResults.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
  }

  const offset = (pagina - 1) * limit;
  const paginated = allResults.slice(offset, offset + limit);
  const tempoMs = Date.now() - inicio;

  return {
    total: allResults.length,
    registros: paginated,
    tempoMs
  };
}

/**
 * Calcula score de relevância
 */
function calcularRelevancia(record, query, campos) {
  let score = 0;
  const queryLower = query.toLowerCase();

  campos.forEach(campo => {
    const valor = (record[campo] || '').toLowerCase();
    
    // Match exato: +10
    if (valor === queryLower) score += 10;
    // Começa com query: +5
    else if (valor.startsWith(queryLower)) score += 5;
    // Contém query: +2
    else if (valor.includes(queryLower)) score += 2;
  });

  return score;
}

/**
 * Map record conforme tipo
 */
function mapRecord(record, tipo) {
  const base = {
    cod_item: record.cod_item,
    nome: record.nome,
    descricao_glossario: record.descricao_glossario || record.glossario,
    situacao: record.situacao || 'A'
  };

  switch (tipo) {
    case 'movimentos':
      return {
        ...base,
        cod_item_pai: record.cod_item_pai,
        movimento: record.movimento,
        sigiloso: record.sigiloso
      };
    case 'classes':
      return {
        ...base,
        cod_item_pai: record.cod_item_pai,
        sigla: record.sigla,
        natureza: record.natureza
      };
    case 'assuntos':
      return {
        ...base,
        cod_item_pai: record.cod_item_pai,
        assunto_secundario: record.assunto_secundario
      };
    case 'documentos':
      return {
        ...base,
        cod_item_pai: record.cod_item_pai
      };
    default:
      return base;
  }
}