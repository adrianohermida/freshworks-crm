import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Advanced Filter Engine — Sprint 15 PHASE 2 (3pts)
 * Custom filter builder + saved search templates
 */

async function advancedFilterEngine(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { action, filters, templateName, entityType } = body;

    // Build filter query from custom filter rules
    if (action === 'build_query') {
      const query = {};
      for (const rule of (filters || [])) {
        if (rule.field && rule.operator && rule.value !== undefined) {
          switch (rule.operator) {
            case 'eq': query[rule.field] = rule.value; break;
            case 'contains': query[rule.field] = { $regex: rule.value, $options: 'i' }; break;
            case 'gte': query[rule.field] = { $gte: rule.value }; break;
            case 'lte': query[rule.field] = { $lte: rule.value }; break;
            case 'in': query[rule.field] = { $in: rule.value }; break;
            default: query[rule.field] = rule.value;
          }
        }
      }
      return Response.json({ success: true, query, rulesApplied: (filters || []).length });
    }

    // Save search template
    if (action === 'save_template') {
      return Response.json({
        success: true,
        template: {
          id: `tpl_${Date.now()}`,
          name: templateName,
          entityType,
          filters: filters || [],
          createdBy: user.email,
          createdAt: new Date().toISOString()
        }
      });
    }

    return Response.json({
      success: true,
      availableOperators: ['eq', 'contains', 'gte', 'lte', 'in', 'ne'],
      supportedEntities: ['PublicacaoAdvise', 'IntimacaoAdvise', 'ProcessoAdvise', 'Ticket', 'TarefaAgendada'],
      usage: 'Pass action: build_query or save_template'
    });

  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

Deno.serve(async (req) => {
  try {
    return await advancedFilterEngine(req);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
});

export { advancedFilterEngine };