import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      entity_type,
      entity_id,
      action,
      changes = {},
      reason = ''
    } = await req.json();

    // Validar campos obrigatórios
    if (!entity_type || !entity_id || !action) {
      return Response.json(
        { error: 'Missing required fields: entity_type, entity_id, action' },
        { status: 400 }
      );
    }

    // Obter IP do cliente
    const ipAddress = req.headers.get('x-forwarded-for') 
      || req.headers.get('x-real-ip')
      || 'unknown';

    // Criar registro de auditoria
    const auditLog = await base44.entities.AuditLog.create({
      entity_type,
      entity_id,
      action,
      user_email: user.email,
      user_name: user.full_name,
      changes,
      ip_address: ipAddress.split(',')[0].trim(),
      status: 'success',
      reason,
      timestamp: new Date().toISOString()
    });

    return Response.json({
      success: true,
      log_id: auditLog.id,
      message: `Auditoria registrada para ${entity_type} ${entity_id}`
    });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});