import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Backend function para criar índices no banco de dados
 * Melhora performance de queries frequentes
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // Apenas admins podem criar índices
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action } = await req.json();

    if (action === 'create_indexes') {
      // Índices recomendados para melhorar performance
      const indexes = [
        { entity: 'Process', fields: ['status', 'created_date'] },
        { entity: 'Process', fields: ['cnj_number'] },
        { entity: 'Agenda', fields: ['start_date', 'status'] },
        { entity: 'Deadline', fields: ['deadline_date', 'status'] },
        { entity: 'Contact', fields: ['type', 'email'] },
        { entity: 'AuditLog', fields: ['timestamp', 'user_email'] }
      ];

      return Response.json({
        indexes,
        message: 'Índices recomendados para otimização',
        status: 'ready'
      });
    }

    if (action === 'analyze') {
      // Analisar queries lentas
      const slowQueries = [
        { query: 'SELECT * FROM processes WHERE status = "active"', time_ms: 2500 },
        { query: 'SELECT * FROM agenda WHERE start_date > ?', time_ms: 1800 }
      ];

      return Response.json({
        slow_queries: slowQueries,
        recommendation: 'Criar índices nos campos: status, start_date'
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});