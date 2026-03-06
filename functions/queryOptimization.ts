import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Backend function para otimizar queries com indexing
 * Implementa select de campos, filtering otimizado, batch operations
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, entity_name, query, limit = 50, skip = 0, select = [] } = await req.json();

    switch (action) {
      case 'optimized_list':
        // List com select de campos específicos para reduzir payload
        const items = await base44.entities[entity_name].filter(query, '-updated_date', limit);
        
        // Retornar apenas campos solicitados
        const filtered = items.map(item => {
          if (select.length === 0) return item;
          return select.reduce((acc, field) => {
            acc[field] = item[field];
            return acc;
          }, { id: item.id });
        });

        return Response.json({
          data: filtered,
          total: items.length,
          limit,
          skip
        });

      case 'batch_get':
        // Get múltiplos registros em paralelo
        const ids = query.ids || [];
        const promises = ids.map(id => base44.entities[entity_name].get(id).catch(() => null));
        const results = await Promise.all(promises);
        
        return Response.json({
          data: results.filter(Boolean),
          count: results.filter(Boolean).length
        });

      case 'count':
        // Contar registros com filtro
        const all = await base44.entities[entity_name].filter(query);
        return Response.json({ count: all.length });

      case 'distinct':
        // Valores únicos de um campo
        const field = query.field;
        const records = await base44.entities[entity_name].filter(query.filter || {});
        const values = [...new Set(records.map(r => r[field]))];
        
        return Response.json({ values });

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});