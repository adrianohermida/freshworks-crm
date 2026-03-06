import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Bug Triage Engine - Triagem automática de issues
 * Classifica, prioriza, atribui baseado em padrões
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, bug_report } = await req.json();

    if (action === 'triage') {
      // Triagem automática
      const { title, description, error_message } = bug_report;

      // Classificar severidade
      let severity = 'P3';
      if (error_message?.includes('database') || error_message?.includes('connection')) {
        severity = 'P1';
      } else if (error_message?.includes('null') || error_message?.includes('undefined')) {
        severity = 'P2';
      }

      // Classificar categoria
      let category = 'UI';
      if (error_message) {
        if (error_message.includes('query') || error_message.includes('database')) {
          category = 'BACKEND';
        } else if (error_message.includes('API') || error_message.includes('timeout')) {
          category = 'INTEGRATION';
        }
      }

      // Atribuir time (simplificado)
      const assigned_to = category === 'BACKEND' ? 'backend-team' : 'frontend-team';

      const triaged = {
        bug_id: `bug_${Date.now()}`,
        severity,
        category,
        assigned_to,
        status: 'new',
        created_at: new Date().toISOString(),
        estimated_fix_hours: severity === 'P1' ? 2 : severity === 'P2' ? 4 : 8
      };

      return Response.json({
        success: true,
        triaged,
        message: `Bug triaged: ${severity} - ${category}`
      });
    }
    else if (action === 'list_triage') {
      // Listar bugs para triage
      if (user.role !== 'admin') {
        return Response.json({ error: 'Admin access required' }, { status: 403 });
      }

      return Response.json({
        pending_triage: [
          {
            id: 'bug_1',
            title: 'Pagination breaks at 500 records',
            severity: 'P2',
            created: '2h ago',
            assigned: 'frontend-team'
          },
          {
            id: 'bug_2',
            title: 'Database query timeout on large datasets',
            severity: 'P1',
            created: '1h ago',
            assigned: 'backend-team'
          }
        ]
      });
    }
    else if (action === 'create_hotfix') {
      // Criar hotfix task
      return Response.json({
        success: true,
        hotfix_id: `hf_${Date.now()}`,
        branch: `hotfix/bug-${Date.now()}`,
        checklist: [
          'Fix code',
          'Write unit test',
          'Manual QA',
          'Code review',
          'Merge to main',
          'Tag release',
          'Deploy to prod'
        ]
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('[bugTriageEngine]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});