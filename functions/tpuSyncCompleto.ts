import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const TPU_BASE_URL = 'https://gateway.cloud.pje.jus.br/tpu';

/**
 * ENDPOINTS TPU DISPONIVEIS (CORRETOS):
 * 
 * BUSCA SIMPLES (até 10 registros):
 * GET /api/v1/publico/consulta/assuntos?codigo=xxx&nome=xxx&glossario=xxx
 * GET /api/v1/publico/consulta/classes?codigo=xxx&nome=xxx&glossario=xxx
 * GET /api/v1/publico/consulta/movimentos?codigo=xxx&nome=xxx&glossario=xxx
 * GET /api/v1/publico/consulta/documentos?codigo=xxx&nome=xxx&glossario=xxx
 * 
 * BUSCA DETALHADA (mais campos):
 * GET /api/v1/publico/consulta/detalhada/assuntos?codigo=xxx&nome=xxx&glossario=xxx
 * GET /api/v1/publico/consulta/detalhada/classes?codigo=xxx&nome=xxx&glossario=xxx
 * GET /api/v1/publico/consulta/detalhada/movimentos?codigo=xxx&nome=xxx&glossario=xxx
 * GET /api/v1/publico/consulta/detalhada/documentos?codigo=xxx&nome=xxx&glossario=xxx
 * 
 * NOTA: Paginação não é suportada - máximo 10 registros por consulta
 * Use filtros (codigo, nome, glossario) para refinar resultados
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role?.includes('admin')) {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { action } = body;

    if (action === 'sync_all') {
      return await syncAllTPUTables(base44);
    } else if (action === 'sync_assuntos') {
      return await syncTable(base44, 'assuntos', 'TPUAssuntos', 'cod_item');
    } else if (action === 'sync_classes') {
      return await syncTable(base44, 'classes', 'TPUClasses', 'cod_item');
    } else if (action === 'sync_movimentos') {
      return await syncTable(base44, 'movimentos', 'TPUMovimentos', 'cod_item');
    } else if (action === 'sync_documentos') {
      return await syncTable(base44, 'documentos', 'TPUDocumentos', 'cod_item');
    } else if (action === 'get_movimento_by_codigo') {
      return await getMovimentoByCodigo(body.codigo);
    } else if (action === 'get_assunto_by_codigo') {
      return await getAssuntoByCodigo(body.codigo);
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[tpuSyncCompleto] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

/**
 * Busca um movimento específico pelo código
 * Usado para enriquecer movimentações conforme chegam
 */
async function getMovimentoByCodigo(codigo) {
  try {
    const url = `${TPU_BASE_URL}/consulta/movimentos/${codigo}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      console.log(`Movimento ${codigo} não encontrado no TPU`);
      return Response.json({ 
        success: false, 
        message: `Movimento ${codigo} não encontrado`,
        statusCode: response.status 
      }, { status: 404 });
    }

    const data = await response.json();
    const movimento = data.result || data;

    return Response.json({
      success: true,
      data: movimento,
      mapped: mapMovimento(movimento)
    });
  } catch (error) {
    console.error(`[getMovimentoByCodigo ${codigo}]`, error.message);
    return Response.json({ 
      success: false, 
      error: error.message,
      codigo 
    }, { status: 500 });
  }
}

/**
 * Busca um assunto específico pelo código
 */
async function getAssuntoByCodigo(codigo) {
  try {
    const url = `${TPU_BASE_URL}/consulta/assuntos/${codigo}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      console.log(`Assunto ${codigo} não encontrado no TPU`);
      return Response.json({ 
        success: false, 
        message: `Assunto ${codigo} não encontrado`,
        statusCode: response.status 
      }, { status: 404 });
    }

    const data = await response.json();
    const assunto = data.result || data;

    return Response.json({
      success: true,
      data: assunto,
      mapped: mapAssunto(assunto)
    });
  } catch (error) {
    console.error(`[getAssuntoByCodigo ${codigo}]`, error.message);
    return Response.json({ 
      success: false, 
      error: error.message,
      codigo 
    }, { status: 500 });
  }
}

/**
 * Sincroniza uma tabela TPU completa com paginação
 */
async function syncTable(base44, tableName, entityName, keyField) {
  const startTime = Date.now();
  let totalRecords = 0;
  let importedRecords = 0;
  let duplicates = 0;
  let errors = [];
  let pageNum = 0;
  const pageSize = 100;

  try {
    // Obter registros locais existentes
    const localRecords = await base44.asServiceRole.entities[entityName].list();
    const localKeys = new Set(
      Array.isArray(localRecords) ? localRecords.map(r => r[keyField]) : []
    );

    console.log(`[${tableName}] Local count: ${localKeys.size}`);

    // TPU API retorna máximo 10 registros - usar loop sem paginação
      const url = `${TPU_BASE_URL}/api/v1/publico/consulta/detalhada/${tableName}`;
      console.log(`[${tableName}] Fetching all records`);

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorText = await response.text();
        errors.push({
          status: response.status,
          message: errorText.substring(0, 200)
        });
        console.log(`[${tableName}] HTTP ${response.status} - Usando apenas registros em cache`);
      } else {
        const data = await response.json();
        const records = Array.isArray(data) ? data : (data.content || []);
        
        if (records && records.length > 0) {
          totalRecords = records.length;
          console.log(`[${tableName}] API retornou ${records.length} registros`);

          // Processar registros
          for (const record of records) {
            const key = record[keyField];

            if (localKeys.has(key)) {
              duplicates++;
              continue;
            }

            try {
              const mapped = mapRecord(record, tableName);
              await base44.asServiceRole.entities[entityName].create(mapped);
              importedRecords++;
              localKeys.add(key);
            } catch (error) {
              errors.push({
                record: key,
                error: error.message
              });
            }
          }
        } else {
          console.log(`[${tableName}] API retornou 0 registros`);
        }
      }

    const executionTime = Date.now() - startTime;

    return Response.json({
      success: true,
      table: tableName,
      stats: {
        totalRecords,
        importedRecords,
        duplicates,
        errorCount: errors.length,
        executionMs: executionTime
      },
      errors: errors.slice(0, 10)
    });
  } catch (error) {
    console.error(`[syncTable ${tableName}]`, error);
    return Response.json({
      success: false,
      table: tableName,
      error: error.message
    }, { status: 500 });
  }
}

/**
 * Sincroniza todas as tabelas TPU em paralelo
 */
async function syncAllTPUTables(base44) {
  const tables = [
    { name: 'assuntos', entity: 'TPUAssuntos', key: 'cod_item' },
    { name: 'classes', entity: 'TPUClasses', key: 'cod_item' },
    { name: 'movimentos', entity: 'TPUMovimentos', key: 'cod_item' },
    { name: 'documentos', entity: 'TPUDocumentos', key: 'cod_item' }
  ];

  const results = {};
  const startTime = Date.now();

  for (const table of tables) {
    const tableStart = Date.now();
    
    try {
      const response = await syncTable(base44, table.name, table.entity, table.key);
      const data = await response.json();
      results[table.name] = {
        ...data,
        stats: {
          ...data.stats,
          tableExecutionMs: Date.now() - tableStart
        }
      };
    } catch (error) {
      results[table.name] = {
        success: false,
        error: error.message,
        tableExecutionMs: Date.now() - tableStart
      };
    }
  }

  return Response.json({
    success: Object.values(results).every(r => r.success),
    summary: {
      totalExecutionMs: Date.now() - startTime,
      timestamp: new Date().toISOString()
    },
    tables: results
  });
}

/**
 * Mapeia registro genérico para a estrutura da entidade
 */
function mapRecord(record, tableName) {
  switch (tableName) {
    case 'assuntos':
      return mapAssunto(record);
    case 'classes':
      return mapClasse(record);
    case 'movimentos':
      return mapMovimento(record);
    case 'documentos':
      return mapDocumento(record);
    default:
      return record;
  }
}

function mapAssunto(record) {
  return {
    cod_item: record.cod_item,
    cod_item_pai: record.cod_item_pai,
    nome: record.nome,
    descricao_glossario: record.descricao_glossario || record.glossario,
    artigo: record.artigo,
    norma: record.norma,
    sigiloso: record.sigiloso || 'N',
    assunto_secundario: record.assunto_secundario || 'N',
    crime_antecedente: record.crime_antecedente || 'N',
    justica_estadual_1grau: record.justica_estadual_1grau,
    justica_estadual_2grau: record.justica_estadual_2grau,
    justica_federal_1grau: record.justica_federal_1grau,
    justica_federal_2grau: record.justica_federal_2grau,
    justica_trabalho_1grau: record.justica_trabalho_1grau,
    justica_trabalho_2grau: record.justica_trabalho_2grau,
    justica_eleitoral_tre: record.justica_eleitoral_tre,
    justica_eleitoral_tse: record.justica_eleitoral_tse,
    outras_justicas_stf: record.outras_justicas_stf,
    outras_justicas_stj: record.outras_justicas_stj,
    situacao: record.situacao || 'A',
    data_inclusao: record.data_inclusao,
    data_alteracao: record.data_alteracao,
    usuario_inclusao: record.usuario_inclusao || 'tpu-sync',
    usuario_alteracao: record.usuario_alteracao || 'tpu-sync'
  };
}

function mapClasse(record) {
  return {
    cod_item: record.cod_item,
    cod_item_pai: record.cod_item_pai,
    nome: record.nome,
    sigla: record.sigla,
    sigla_antiga: record.sigla_antiga,
    descricao_glossario: record.descricao_glossario || record.glossario,
    natureza: record.natureza,
    polo_ativo: record.polo_ativo,
    polo_passivo: record.polo_passivo,
    artigo: record.artigo,
    norma: record.norma,
    numeracao_propria: record.numeracao_propria || 'S',
    sigiloso: record.sigiloso,
    justica_estadual_1grau: record.justica_estadual_1grau,
    justica_estadual_2grau: record.justica_estadual_2grau,
    justica_federal_1grau: record.justica_federal_1grau,
    justica_federal_2grau: record.justica_federal_2grau,
    justica_trabalho_1grau: record.justica_trabalho_1grau,
    justica_trabalho_2grau: record.justica_trabalho_2grau,
    justica_eleitoral_tre: record.justica_eleitoral_tre,
    justica_eleitoral_tse: record.justica_eleitoral_tse,
    outras_justicas_stf: record.outras_justicas_stf,
    outras_justicas_stj: record.outras_justicas_stj,
    situacao: record.situacao || 'A',
    data_inclusao: record.data_inclusao,
    data_alteracao: record.data_alteracao,
    usuario_inclusao: record.usuario_inclusao || 'tpu-sync',
    usuario_alteracao: record.usuario_alteracao || 'tpu-sync'
  };
}

function mapMovimento(record) {
  return {
    cod_item: record.cod_item,
    id: record.id,
    cod_item_pai: record.cod_item_pai,
    nome: record.nome,
    descricao_glossario: record.descricao_glossario || record.glossario,
    movimento: record.movimento,
    glossario: record.glossario,
    dispositivoLegal: record.dispositivoLegal,
    artigo: record.artigo,
    norma: record.norma,
    monocratico: record.monocratico,
    presidenteVice: record.presidenteVice,
    colegiado: record.colegiado,
    flgEletronico: record.flgEletronico,
    flgPapel: record.flgPapel,
    sigiloso: record.sigiloso,
    visibilidadeExterna: record.visibilidadeExterna,
    justica_estadual_1grau: record.justica_estadual_1grau,
    justica_estadual_2grau: record.justica_estadual_2grau,
    justica_federal_1grau: record.justica_federal_1grau,
    justica_federal_2grau: record.justica_federal_2grau,
    justica_trabalho_1grau: record.justica_trabalho_1grau,
    justica_trabalho_2grau: record.justica_trabalho_2grau,
    justica_eleitoral_tre: record.justica_eleitoral_tre,
    justica_eleitoral_tse: record.justica_eleitoral_tse,
    outras_justicas_stf: record.outras_justicas_stf,
    outras_justicas_stj: record.outras_justicas_stj,
    situacao: record.situacao || 'A',
    data_inclusao: record.data_inclusao,
    data_alteracao: record.data_alteracao,
    usuario_inclusao: record.usuario_inclusao || 'tpu-sync',
    usuario_alteracao: record.usuario_alteracao || 'tpu-sync'
  };
}

function mapDocumento(record) {
  return {
    cod_item: record.cod_item,
    cod_item_pai: record.cod_item_pai,
    nome: record.nome,
    descricao_documento: record.descricao_documento,
    descricao_glossario: record.descricao_glossario || record.glossario,
    situacao: record.situacao || 'A',
    data_inclusao: record.data_inclusao,
    data_alteracao: record.data_alteracao,
    usuario_inclusao: record.usuario_inclusao || 'tpu-sync',
    usuario_alteracao: record.usuario_alteracao || 'tpu-sync'
  };
}