import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const TPU_BASE_URL = 'https://gateway.cloud.pje.jus.br/tpu';

const TPU_TABLES = {
  classes: '/consulta/classes',
  assuntos: '/consulta/assuntos',
  movimentos: '/consulta/movimentos',
  documentos: '/consulta/documentos',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const url = new URL(req.url);
    const table = url.searchParams.get('table') || 'assuntos';
    const pageSize = url.searchParams.get('pageSize') || '1000';
    const page = url.searchParams.get('page') || '0';

    if (!TPU_TABLES[table]) {
      return Response.json(
        { error: `Invalid table. Available: ${Object.keys(TPU_TABLES).join(', ')}` },
        { status: 400 }
      );
    }

    const endpoint = `${TPU_BASE_URL}${TPU_TABLES[table]}?size=${pageSize}&page=${page}`;

    console.log(`Fetching TPU ${table}...`);
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`TPU API error: ${response.status}`, error);
      return Response.json(
        { error: `TPU API returned ${response.status}`, details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    const records = data.content || [];

    if (records.length === 0) {
      return Response.json({ table, records: [], total: 0, status: 'success' });
    }

    let imported = 0;
    let duplicates = 0;
    let errors = 0;

    for (const record of records) {
      try {
        await importRecordByType(base44, table, record);
        imported++;
      } catch (err) {
        if (err.message?.includes('duplicate')) {
          duplicates++;
        } else {
          errors++;
          console.error(`Error importing ${table} record:`, err.message);
        }
      }
    }

    await base44.asServiceRole.entities.TPUSincronizacao.create({
      tipo: 'tpu',
      status: 'sucesso',
      total_movimentos_sincronizados: imported,
      total_novos: imported,
      total_duplicatas: duplicates,
      data_sincronizacao: new Date().toISOString(),
      mensagem_erro: errors > 0 ? `${errors} records failed to import` : null,
    });

    return Response.json({
      status: 'success',
      table,
      imported,
      duplicates,
      errors,
      total: data.totalElements || records.length,
      hasMore: data.hasNext || false,
    });
  } catch (error) {
    console.error('TPU sync error:', error);
    return Response.json({ error: error.message, status: 'error' }, { status: 500 });
  }
});

async function importRecordByType(base44, table, record, hash) {
  switch (table) {
    case 'classes':
      await base44.entities.TPUClasses.create({
        cod_classe: record.codigo,
        nome: record.nome,
        sigla: record.sigla,
        natureza: record.natureza,
        polo_ativo: record.poloAtivo,
        polo_passivo: record.poloPassivo,
        glossario: record.glossario,
        numeracao_propria: record.numeracaoPropria ? 'S' : 'N',
        situacao: 'A',
      });
      break;

    case 'assuntos':
      await base44.entities.TPUAssuntos.create({
        cod_assunto: record.codigo,
        nome: record.nome,
        ramo_direito: record.ramoDireito,
        glossario: record.glossario,
        sigiloso: record.sigiloso ? 'S' : 'N',
        assunto_secundario: record.secundario ? 'S' : 'N',
        situacao: 'A',
      });
      break;

    case 'movimentos':
      await base44.entities.TPUMovimentos.create({
        codigo_movimento: record.codigo,
        nome: record.nome,
        categoria: record.categoria,
        situacao: 'A',
      });
      break;

    case 'documentos':
      await base44.entities.TPUDocumentos.create({
        cod_documento_processual: record.codigo,
        txt_glossario: record.glossario,
        usu_inclusao: 'tpu-sync',
        dat_inclusao: new Date().toISOString(),
        situacao: 'A',
      });
      break;
  }
}

function generateHash(data) {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}