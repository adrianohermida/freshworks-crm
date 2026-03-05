import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin users can view audit logs
    if (user.role !== 'admin') {
      return Response.json({
        success: false,
        error: 'Forbidden: Admin access required'
      }, { status: 403 });
    }

    const { dataInicio, dataFim, acao, limite = 500 } = await req.json();

    // Fetch audit logs - using local backup (Advise API audit)
    const filtro = {
      ...(acao && { action: acao })
    };

    // Try to fetch from audit entity if exists
    let auditLogs = [];
    try {
      // This assumes an Auditoria or similar entity exists
      auditLogs = await base44.asServiceRole.entities.Auditoria?.filter(filtro) || [];
    } catch (e) {
      console.log('Auditoria entity not available, returning empty');
      auditLogs = [];
    }

    // Filter by date if provided
    if (dataInicio || dataFim) {
      const inicio = dataInicio ? new Date(dataInicio) : new Date('2000-01-01');
      const fim = dataFim ? new Date(dataFim) : new Date();

      auditLogs = auditLogs.filter(log => {
        const dataLog = new Date(log.created_date || log.dataCriacao);
        return dataLog >= inicio && dataLog <= fim;
      });
    }

    // Limit results
    auditLogs = auditLogs.slice(0, limite);

    // Audit this operation too
    await base44.functions.invoke('security/auditLog', {
      acao: 'getAuditoriaOperacoes',
      entidade: 'Auditoria',
      resultado: 'success',
      metadados: { logsCount: auditLogs.length, usuarioAdmin: user.email }
    });

    return Response.json({
      success: true,
      action: 'auditoria.operacoes',
      data: {
        periodo: { dataInicio, dataFim },
        totalLogs: auditLogs.length,
        logs: auditLogs.map(log => ({
          id: log.id,
          acao: log.action || log.acao,
          entidade: log.entity || log.entidade,
          resultado: log.resultado,
          usuario: log.created_by || log.usuario,
          timestamp: log.created_date || log.dataCriacao,
          metadados: log.metadados || {}
        })),
        dataGeracao: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('GetAuditoriaOperacoes error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});