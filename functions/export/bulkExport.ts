import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { entities = ['publicacoes', 'processos', 'tarefas'], format = 'json' } = body;

    const results = {};

    if (entities.includes('publicacoes')) {
      const data = await base44.asServiceRole.entities.PublicacaoAdvise.list('-created_date', 500);
      results.publicacoes = data;
    }
    if (entities.includes('processos')) {
      const data = await base44.asServiceRole.entities.ProcessoAdvise.list('-created_date', 500);
      results.processos = data;
    }
    if (entities.includes('tarefas')) {
      const data = await base44.asServiceRole.entities.TarefaAgendada.list('-created_date', 500);
      results.tarefas = data;
    }
    if (entities.includes('tickets')) {
      const data = await base44.asServiceRole.entities.Ticket.list('-created_date', 500);
      results.tickets = data;
    }

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      exportedBy: user.email,
      version: '18.0.0',
      counts: Object.fromEntries(Object.entries(results).map(([k, v]) => [k, v.length])),
      data: results,
    };

    if (format === 'csv') {
      // Simple CSV for publicacoes
      const pub = results.publicacoes || [];
      const headers = ['id', 'numeroProcesso', 'dataPublicacao', 'municipio', 'diario', 'lido'];
      const rows = pub.map(p => headers.map(h => JSON.stringify(p[h] ?? '')).join(','));
      const csv = [headers.join(','), ...rows].join('\n');
      return new Response(csv, {
        headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=legalpush-export.csv' }
      });
    }

    return Response.json({ success: true, ...exportPayload });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});