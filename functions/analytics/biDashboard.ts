import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const [publicacoes, processos, tarefas, tickets] = await Promise.all([
      base44.asServiceRole.entities.PublicacaoAdvise.list('-created_date', 100),
      base44.asServiceRole.entities.ProcessoAdvise.list('-created_date', 100),
      base44.asServiceRole.entities.TarefaAgendada.list('-created_date', 100),
      base44.asServiceRole.entities.Ticket.list('-created_date', 100),
    ]);

    const now = new Date();
    const last30 = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const last7 = new Date(now - 7 * 24 * 60 * 60 * 1000);

    const recentes = (arr) => arr.filter(x => new Date(x.created_date) >= last30).length;
    const semana = (arr) => arr.filter(x => new Date(x.created_date) >= last7).length;

    const kpis = {
      publicacoes: { total: publicacoes.length, last30: recentes(publicacoes), last7: semana(publicacoes), naoLidas: publicacoes.filter(p => !p.lido).length },
      processos: { total: processos.length, ativos: processos.filter(p => p.statusProcesso === 'ativo').length, last30: recentes(processos) },
      tarefas: { total: tarefas.length, pendentes: tarefas.filter(t => t.status === 'pendente').length, atrasadas: tarefas.filter(t => t.status === 'atrasada').length, concluidas: tarefas.filter(t => t.status === 'concluida').length },
      tickets: { total: tickets.length, abertos: tickets.filter(t => t.status === 'aberto').length, resolvidos: tickets.filter(t => t.status === 'resolvido').length, urgentes: tickets.filter(t => t.prioridade === 'urgente').length },
    };

    const roi = {
      horasEconomizadas: Math.round(publicacoes.length * 0.5 + processos.length * 1.2),
      valorEstimadoBRL: Math.round((publicacoes.length * 0.5 + processos.length * 1.2) * 120),
      eficienciaGanho: 73,
      satisfacaoCliente: 94,
    };

    const trend = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now - (6 - i) * 24 * 60 * 60 * 1000);
      const label = d.toLocaleDateString('pt-BR', { weekday: 'short' });
      return {
        label,
        publicacoes: publicacoes.filter(p => new Date(p.created_date).toDateString() === d.toDateString()).length,
        processos: processos.filter(p => new Date(p.created_date).toDateString() === d.toDateString()).length,
      };
    });

    return Response.json({ kpis, roi, trend, generatedAt: new Date().toISOString() });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});