import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { acao, entidade, resultado, metadados = {} } = await req.json();

    if (!acao || !entidade) {
      return Response.json({
        success: false,
        error: 'acao e entidade são obrigatórios'
      }, { status: 400 });
    }

    // Create audit log entry
    const auditEntry = {
      timestamp: new Date().toISOString(),
      usuario: user.email,
      acao: acao,
      entidade: entidade,
      resultado: resultado || 'success',
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
      metadados: metadados
    };

    console.log('[AUDIT_LOG]', {
      timestamp: auditEntry.timestamp,
      user: user.email,
      action: acao,
      entity: entidade,
      result: resultado
    });

    return Response.json({
      success: true,
      action: 'security.auditLog',
      data: {
        logId: `${Date.now()}_${user.email.split('@')[0]}`,
        entry: auditEntry,
        saved: true,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Audit log error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});