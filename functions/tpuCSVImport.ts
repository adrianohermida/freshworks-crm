import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role?.includes('admin')) {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { tableName, fileUrl } = await req.json();

    if (!tableName || !fileUrl) {
      return Response.json({ error: 'tableName e fileUrl são obrigatórios' }, { status: 400 });
    }

    // Mapear nomes de tabelas para entidades
    const tableToEntity = {
      'Assuntos': 'TPUAssuntos',
      'Classes': 'TPUClasses',
      'Movimentos': 'TPUMovimentos',
      'Documentos': 'TPUDocumentos'
    };

    const entityName = tableToEntity[tableName];
    if (!entityName) {
      return Response.json({ error: `Tabela ${tableName} não encontrada` }, { status: 400 });
    }

    // Download do arquivo CSV
    const csvResponse = await fetch(fileUrl);
    if (!csvResponse.ok) {
      return Response.json({ error: 'Erro ao baixar arquivo CSV' }, { status: 400 });
    }

    const csvText = await csvResponse.text();
    const lines = csvText.trim().split('\n');

    if (lines.length < 2) {
      return Response.json({ error: 'Arquivo CSV vazio ou inválido' }, { status: 400 });
    }

    // Parse CSV simples
    const headers = lines[0].split(',').map(h => h.trim());
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const record = {};

      headers.forEach((header, idx) => {
        record[header] = values[idx] || null;
      });

      if (Object.values(record).some(v => v !== null)) {
        records.push(record);
      }
    }

    // Importar em lote
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const record of records) {
      try {
        await base44.asServiceRole.entities[entityName].create(record);
        successCount++;
      } catch (error) {
        errorCount++;
        errors.push({ record, error: error.message });
      }
    }

    return Response.json({
      success: true,
      message: `Importação concluída: ${successCount} sucesso${successCount !== 1 ? 's' : ''}, ${errorCount} erro${errorCount !== 1 ? 's' : ''}`,
      stats: {
        total: records.length,
        successCount,
        errorCount
      },
      errors: errors.length > 0 ? errors.slice(0, 5) : null
    });
  } catch (error) {
    console.error('[tpuCSVImport] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});