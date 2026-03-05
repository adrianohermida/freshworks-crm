import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role?.includes('admin')) {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { tableName, recordId } = await req.json();

    if (!tableName || !recordId) {
      return Response.json({ error: 'tableName e recordId são obrigatórios' }, { status: 400 });
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

    // Deletar registro na entidade
    await base44.asServiceRole.entities[entityName].delete(recordId);

    return Response.json({
      success: true,
      message: `Registro deletado de ${tableName}`
    });
  } catch (error) {
    console.error('[tpuTableDelete] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});