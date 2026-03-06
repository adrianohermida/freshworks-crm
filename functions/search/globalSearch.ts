import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { query = '', limit = 20 } = body;

    if (!query.trim()) return Response.json({ success: true, results: [], total: 0 });

    const q = query.toLowerCase();

    const [publicacoes, processos, tarefas, tickets] = await Promise.all([
      base44.asServiceRole.entities.PublicacaoAdvise.list('-created_date', 100),
      base44.asServiceRole.entities.ProcessoAdvise.list('-created_date', 100),
      base44.asServiceRole.entities.TarefaAgendada.list('-created_date', 100),
      base44.asServiceRole.entities.Ticket.list('-created_date', 100),
    ]);

    const results = [
      ...publicacoes.filter(p =>
        (p.numeroProcesso || '').toLowerCase().includes(q) ||
        (p.conteudo || '').toLowerCase().includes(q) ||
        (p.municipio || '').toLowerCase().includes(q)
      ).slice(0, 10).map(p => ({ type: 'publicacao', id: p.id, title: p.numeroProcesso, subtitle: (p.conteudo || '').substring(0, 80), date: p.dataPublicacao })),

      ...processos.filter(p =>
        (p.numeroProcesso || '').toLowerCase().includes(q) ||
        (p.tribunal || '').toLowerCase().includes(q) ||
        (p.assunto || '').toLowerCase().includes(q)
      ).slice(0, 10).map(p => ({ type: 'processo', id: p.id, title: p.numeroProcesso, subtitle: `${p.tribunal || '-'} · ${p.statusProcesso}`, date: p.dataDistribuicao })),

      ...tarefas.filter(t =>
        (t.titulo || '').toLowerCase().includes(q) ||
        (t.numeroProcesso || '').toLowerCase().includes(q)
      ).slice(0, 5).map(t => ({ type: 'tarefa', id: t.id, title: t.titulo, subtitle: `Prazo: ${t.dataPrazo} · ${t.status}`, date: t.dataPrazo })),

      ...tickets.filter(t =>
        (t.titulo || '').toLowerCase().includes(q) ||
        (t.descricao || '').toLowerCase().includes(q)
      ).slice(0, 5).map(t => ({ type: 'ticket', id: t.id, title: t.titulo, subtitle: `${t.status} · ${t.prioridade}`, date: t.dataCriacao })),
    ].slice(0, limit);

    return Response.json({ success: true, query, total: results.length, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});