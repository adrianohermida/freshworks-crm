import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role?.includes('admin')) {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { tableName, data } = await req.json();

    if (!tableName || !data) {
      return Response.json({ error: 'tableName e data são obrigatórios' }, { status: 400 });
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

    // Criar registro na entidade
    const result = await base44.asServiceRole.entities[entityName].create(data);

    return Response.json({
      success: true,
      message: `Registro criado em ${tableName}`,
      data: result
    });
  } catch (error) {
    console.error('[tpuTableCreate] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});