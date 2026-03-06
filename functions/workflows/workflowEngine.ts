import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const action = body.action || '';
    const workflow = body.workflow || {};

    if (action === 'validate') {
      const errors = [];
      if (!workflow.name) errors.push('name required');
      if (!workflow.trigger) errors.push('trigger required');
      if (!workflow.steps || workflow.steps.length === 0) errors.push('steps required');
      return Response.json({ valid: errors.length === 0, errors });
    }

    if (action === 'create') {
      return Response.json({
        success: true,
        workflow: {
          id: `wf_${Date.now()}`,
          name: workflow.name || 'Untitled',
          trigger: workflow.trigger,
          steps: workflow.steps || [],
          status: 'active',
          createdBy: user.email,
          createdAt: new Date().toISOString(),
          executionCount: 0
        }
      });
    }

    if (action === 'execute') {
      const steps = workflow.steps || [];
      return Response.json({
        success: true,
        executionId: `exec_${Date.now()}`,
        stepsExecuted: steps.length,
        results: steps.map((s, i) => ({ step: i + 1, type: s.type, status: 'executed' }))
      });
    }

    return Response.json({
      success: true,
      triggers: ['publicacao_criada', 'intimacao_recebida', 'prazo_vencendo', 'processo_atualizado', 'tarefa_atrasada'],
      actions: ['send_email', 'create_task', 'create_ticket', 'notify_user', 'update_status']
    });

  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
});