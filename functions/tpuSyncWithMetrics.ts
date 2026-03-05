import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role?.includes('admin')) {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const TPU_BASE_URL = 'https://gateway.cloud.pje.jus.br/tpu';

    const results = {
      assuntos: { total: 0, local: 0, imported: 0, duplicates: 0, errors: [] },
      classes: { total: 0, local: 0, imported: 0, duplicates: 0, errors: [] },
      movimentos: { total: 0, local: 0, imported: 0, duplicates: 0, errors: [] },
      documentos: { total: 0, local: 0, imported: 0, duplicates: 0, errors: [] }
    };

    // Helper function para criar objeto de erro completo
    const createErrorObject = (message, requestData = null, responseData = null, status = null, stack = null) => ({
      message,
      request: requestData || {},
      response: responseData || {},
      status: status || 'DESCONHECIDO',
      stack: stack || message,
      timestamp: new Date().toISOString()
    });

    // Map TPU record fields to entity schema
     const mapRecord = (record, tableName) => {
      switch (tableName) {
        case 'Assuntos':
           return {
             cod_item: record.cod_item,
             cod_item_pai: record.cod_item_pai,
             nome: record.nome,
             descricao_glossario: record.descricao_glossario,
             artigo: record.artigo,
             norma: record.norma,
             sigiloso: record.sigiloso || 'N',
             assunto_secundario: record.assunto_secundario || 'N',
             situacao: record.situacao || 'A'
           };
         case 'Classes':
           return {
             cod_item: record.cod_item,
             cod_item_pai: record.cod_item_pai,
             nome: record.nome,
             sigla: record.sigla,
             descricao_glossario: record.descricao_glossario,
             natureza: record.natureza,
             polo_ativo: record.polo_ativo,
             polo_passivo: record.polo_passivo,
             numeracao_propria: record.numeracao_propria || 'S',
             sigiloso: record.sigiloso,
             situacao: record.situacao || 'A'
           };
         case 'Movimentos':
           return {
             cod_item: record.cod_item,
             cod_item_pai: record.cod_item_pai,
             nome: record.nome,
             descricao_glossario: record.descricao_glossario,
             sigiloso: record.sigiloso,
             situacao: record.situacao || 'A'
           };
         case 'Documentos':
           return {
             cod_item: record.cod_item,
             cod_item_pai: record.cod_item_pai,
             nome: record.nome,
             descricao_glossario: record.descricao_glossario,
             situacao: record.situacao || 'A'
           };
        default:
          return record;
      }
    };

    const tables = [
      { name: 'Assuntos', entity: 'TPUAssuntos', endpoint: 'api/v1/publico/consulta/detalhada/assuntos', keyField: 'cod_item' },
      { name: 'Classes', entity: 'TPUClasses', endpoint: 'api/v1/publico/consulta/detalhada/classes', keyField: 'cod_item' },
      { name: 'Movimentos', entity: 'TPUMovimentos', endpoint: 'api/v1/publico/consulta/detalhada/movimentos', keyField: 'cod_item' },
      { name: 'Documentos', entity: 'TPUDocumentos', endpoint: 'api/v1/publico/consulta/detalhada/documentos', keyField: 'cod_item' }
    ];

    // Process each table - Count local only
    // NOTA: TPU requer filtro obrigatório (código, nome ou glossário)
    // Sincronização em lote é IMPOSSÍVEL. Use enriquecerMovimentoComTPU.js para enriquecimento sob demanda.
    for (const table of tables) {
      const tableKey = table.name.toLowerCase();
      
      try {
         // Get local count ONLY
         const localData = await base44.asServiceRole.entities[table.entity].list();
         const records = Array.isArray(localData) ? localData : (localData?.data || []);
         results[tableKey].local = records.length;
         results[tableKey].total = records.length;
         results[tableKey].imported = 0; // Não há sync em lote possível
         
         console.log(`[${table.name}] Local count: ${records.length} (API sync não disponível para lote)`);
      } catch (error) {
        results[tableKey].errors = [
          createErrorObject(
            `Erro ao contar registros locais de ${table.name}`,
            { table: table.name },
            null,
            500,
            error.stack || error.message
          )
        ];
      }
    }

    return Response.json({
      success: true,
      message: 'Contagem de registros concluída. Sincronização em lote NÃO é possível (TPU requer filtros). Use enriquecerMovimentoComTPU.js para enriquecimento sob demanda ou tpuBuscaAvancada.js para busca com filtro.',
      metrics: results,
      summary: {
        totalLocal: Object.values(results).reduce((sum, t) => sum + t.local, 0),
        totalImported: 0,
        aviso: 'Sincronização em lote impossível - API TPU requer filtros obrigatórios (código, nome ou glossário)',
        proximosPassos: [
          'Use enriquecerMovimentoComTPU.js para enriquecer movimentos específicos',
          'Use tpuBuscaAvancada.js para buscas com filtro de nome',
          'Use tpuPaginacaoInteligente.js para iterar com paginação'
        ]
      }
    });
  } catch (error) {
    console.error('[tpuSyncWithMetrics] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});