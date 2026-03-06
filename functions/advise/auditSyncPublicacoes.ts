import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tipo = 'todos', dataInicio, dataFim, limit = 100 } = await req.json();

    // Buscar logs de auditoria
    let query = {};
    if (tipo !== 'todos') {
      query.tipoEvento = tipo; // 'sucesso', 'erro', 'duplicata'
    }
    if (dataInicio || dataFim) {
      query.dataEvento = {};
      if (dataInicio) query.dataEvento.$gte = dataInicio;
      if (dataFim) query.dataEvento.$lte = dataFim;
    }

    const auditLogs = await base44.asServiceRole.entities.AuditSincPublicacoes.filter(
      query,
      '-dataEvento',
      limit
    );

    // Calcular estatísticas
    const stats = {
      total: auditLogs.length,
      sucessos: auditLogs.filter(l => l.tipoEvento === 'sucesso').length,
      erros: auditLogs.filter(l => l.tipoEvento === 'erro').length,
      duplicatas: auditLogs.filter(l => l.tipoEvento === 'duplicata').length,
      ultimoSync: auditLogs[0]?.dataEvento || null,
      taxaSucesso: auditLogs.length > 0 
        ? Math.round((auditLogs.filter(l => l.tipoEvento === 'sucesso').length / auditLogs.length) * 100)
        : 0
    };

    return Response.json({
      success: true,
      stats,
      logs: auditLogs
    });
  } catch (error) {
    return Response.json({ 
      error: error.message,
      success: false
    }, { status: 500 });
  }
});