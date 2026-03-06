import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Audit Log Service — Desbloqueador para LGPD Rights
 * Registra todas as operações de dados sensíveis
 */

async function logAuditEvent(req, eventType, details) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      console.error('Audit Log: User not authenticated');
      return;
    }

    const auditEvent = {
      eventType,
      timestamp: new Date().toISOString(),
      userId: user.email,
      userRole: user.role,
      details,
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown'
    };

    // Salvar no banco de dados
    try {
      await base44.asServiceRole.entities.AuditLog.create(auditEvent);
    } catch (error) {
      // Fallback: salvar em arquivo se DB falhar
      console.log(`[AUDIT] ${JSON.stringify(auditEvent)}`);
    }

    return auditEvent;
  } catch (error) {
    console.error('Audit Log Error:', error.message);
  }
}

async function getAuditLog(req, filters = {}) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Apenas admins podem acessar logs completos
    if (user.role !== 'admin') {
      return Response.json(
        { error: 'Forbidden: Only admins can access audit logs' },
        { status: 403 }
      );
    }

    // Construir query com filtros
    const query = {};
    if (filters.eventType) query.eventType = filters.eventType;
    if (filters.userId) query.userId = filters.userId;
    if (filters.startDate || filters.endDate) {
      query.timestamp = {};
      if (filters.startDate) {
        query.timestamp.$gte = new Date(filters.startDate).toISOString();
      }
      if (filters.endDate) {
        query.timestamp.$lte = new Date(filters.endDate).toISOString();
      }
    }

    const logs = await base44.asServiceRole.entities.AuditLog.filter(
      query,
      '-timestamp',
      100
    );

    return {
      success: true,
      total: logs.length,
      logs
    };
  } catch (error) {
    return Response.json(
      { error: `Audit Log Error: ${error.message}` },
      { status: 500 }
    );
  }
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  
  if (req.method === 'GET' && url.pathname === '/audit-log') {
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const eventType = url.searchParams.get('eventType');
    
    return Response.json(
      await getAuditLog(req, { startDate, endDate, eventType })
    );
  }

  // Default: log the request
  const result = await logAuditEvent(req, 'API_CALL', {
    method: req.method,
    path: url.pathname
  });

  return Response.json({ success: true, auditId: result?.id });
});

export { logAuditEvent, getAuditLog };