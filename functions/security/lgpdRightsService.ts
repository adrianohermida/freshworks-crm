import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { logAuditEvent } from './auditLogService.js';

/**
 * LGPD Rights Service — Lei Geral de Proteção de Dados
 * Implementa: Right to Access, Right to Erasure, Data Portability
 */

async function handleLGPDRequest(req, requestType) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const targetUserId = body.targetUserId || user.email;

    // Validar: usuário só pode acessar seus próprios dados (exceto admins)
    if (user.role !== 'admin' && targetUserId !== user.email) {
      await logAuditEvent(req, 'LGPD_REQUEST', {
        type: requestType,
        status: 'DENIED',
        reason: 'Unauthorized access to other user data'
      });
      return Response.json(
        { error: 'Forbidden: Can only access your own data' },
        { status: 403 }
      );
    }

    switch (requestType) {
      case 'ACCESS':
        return await handleDataAccess(base44, req, targetUserId);
      case 'ERASURE':
        return await handleDataErasure(base44, req, targetUserId);
      case 'PORTABILITY':
        return await handleDataPortability(base44, req, targetUserId);
      default:
        return Response.json(
          { error: 'Unknown LGPD request type' },
          { status: 400 }
        );
    }
  } catch (error) {
    return Response.json(
      { error: `LGPD Error: ${error.message}` },
      { status: 500 }
    );
  }
}

async function handleDataAccess(base44, req, userId) {
  try {
    // Coletar dados do usuário de múltiplas entidades
    const userData = {
      user: await base44.entities.User.filter({ email: userId }),
      publicacoes: await base44.entities.PublicacaoAdvise.filter(
        { created_by: userId },
        '-created_date',
        50
      ),
      tickets: await base44.entities.Ticket.filter(
        { solicitanteEmail: userId },
        '-dataCriacao',
        50
      ),
      tarefas: await base44.entities.TarefaAgendada.filter(
        { created_by: userId },
        '-created_date',
        50
      )
    };

    await logAuditEvent(req, 'LGPD_REQUEST', {
      type: 'ACCESS',
      status: 'SUCCESS',
      dataCount: Object.values(userData).reduce((acc, arr) => acc + (arr?.length || 0), 0)
    });

    return Response.json({
      success: true,
      requestType: 'DATA_ACCESS',
      timestamp: new Date().toISOString(),
      data: userData
    });
  } catch (error) {
    await logAuditEvent(req, 'LGPD_REQUEST', {
      type: 'ACCESS',
      status: 'FAILURE',
      error: error.message
    });
    throw error;
  }
}

async function handleDataErasure(base44, req, userId) {
  try {
    // Deletar dados do usuário
    const deletedEntities = {
      publicacoes: 0,
      tickets: 0,
      tarefas: 0
    };

    // Deletar publicações
    const publicacoes = await base44.asServiceRole.entities.PublicacaoAdvise.filter(
      { created_by: userId }
    );
    for (const pub of publicacoes) {
      await base44.asServiceRole.entities.PublicacaoAdvise.delete(pub.id);
      deletedEntities.publicacoes++;
    }

    // Deletar tickets
    const tickets = await base44.asServiceRole.entities.Ticket.filter(
      { solicitanteEmail: userId }
    );
    for (const ticket of tickets) {
      await base44.asServiceRole.entities.Ticket.delete(ticket.id);
      deletedEntities.tickets++;
    }

    // Deletar tarefas
    const tarefas = await base44.asServiceRole.entities.TarefaAgendada.filter(
      { created_by: userId }
    );
    for (const tarefa of tarefas) {
      await base44.asServiceRole.entities.TarefaAgendada.delete(tarefa.id);
      deletedEntities.tarefas++;
    }

    await logAuditEvent(req, 'LGPD_ERASURE', {
      type: 'ERASURE',
      status: 'SUCCESS',
      deletedCount: Object.values(deletedEntities).reduce((a, b) => a + b, 0),
      details: deletedEntities,
      lgpdRelated: true
    });

    return Response.json({
      success: true,
      requestType: 'DATA_ERASURE',
      timestamp: new Date().toISOString(),
      deletedEntities
    });
  } catch (error) {
    await logAuditEvent(req, 'LGPD_ERASURE', {
      type: 'ERASURE',
      status: 'FAILURE',
      error: error.message,
      lgpdRelated: true
    });
    throw error;
  }
}

async function handleDataPortability(base44, req, userId) {
  try {
    const userData = {
      user: await base44.entities.User.filter({ email: userId }),
      publicacoes: await base44.entities.PublicacaoAdvise.filter(
        { created_by: userId }
      ),
      tickets: await base44.entities.Ticket.filter(
        { solicitanteEmail: userId }
      ),
      tarefas: await base44.entities.TarefaAgendada.filter(
        { created_by: userId }
      )
    };

    // Converter para JSON estruturado
    const exportData = JSON.stringify(userData, null, 2);

    await logAuditEvent(req, 'LGPD_REQUEST', {
      type: 'PORTABILITY',
      status: 'SUCCESS',
      dataSize: exportData.length
    });

    return new Response(exportData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="user_data_${userId}_${Date.now()}.json"`
      }
    });
  } catch (error) {
    await logAuditEvent(req, 'LGPD_REQUEST', {
      type: 'PORTABILITY',
      status: 'FAILURE',
      error: error.message
    });
    throw error;
  }
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  
  if (url.pathname === '/lgpd/access' && req.method === 'POST') {
    return await handleLGPDRequest(req, 'ACCESS');
  }
  if (url.pathname === '/lgpd/erasure' && req.method === 'POST') {
    return await handleLGPDRequest(req, 'ERASURE');
  }
  if (url.pathname === '/lgpd/portability' && req.method === 'POST') {
    return await handleLGPDRequest(req, 'PORTABILITY');
  }

  return Response.json({ error: 'Not Found' }, { status: 404 });
});

export { handleLGPDRequest };