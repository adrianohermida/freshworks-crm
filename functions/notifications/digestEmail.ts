import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const frequency = body.frequency || 'daily'; // daily | weekly

    const since = new Date(Date.now() - (frequency === 'weekly' ? 7 : 1) * 24 * 60 * 60 * 1000);

    const [publicacoes, tarefas] = await Promise.all([
      base44.asServiceRole.entities.PublicacaoAdvise.list('-created_date', 50),
      base44.asServiceRole.entities.TarefaAgendada.list('-created_date', 50),
    ]);

    const novas = publicacoes.filter(p => new Date(p.created_date) >= since);
    const atrasadas = tarefas.filter(t => t.status === 'atrasada');
    const pendentes = tarefas.filter(t => t.status === 'pendente' && new Date(t.created_date) >= since);

    const digestBody = `
<h2>📊 Digest LegalPush — ${frequency === 'weekly' ? 'Semanal' : 'Diário'}</h2>
<p>Olá, ${user.full_name || user.email}!</p>
<h3>📋 Publicações</h3>
<p>${novas.length} nova(s) publicação(ões) no período.</p>
<h3>⚠️ Tarefas Atrasadas</h3>
<p>${atrasadas.length} tarefa(s) em atraso — ação imediata necessária.</p>
<h3>📌 Tarefas Pendentes</h3>
<p>${pendentes.length} tarefa(s) criada(s) recentemente.</p>
<hr/>
<p><small>LegalPush · ${new Date().toLocaleString('pt-BR')}</small></p>
    `.trim();

    // Send email via integration
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: user.email,
      subject: `LegalPush — Digest ${frequency === 'weekly' ? 'Semanal' : 'Diário'} — ${new Date().toLocaleDateString('pt-BR')}`,
      body: digestBody,
      from_name: 'LegalPush'
    });

    return Response.json({
      success: true,
      frequency,
      sentTo: user.email,
      summary: { novasPublicacoes: novas.length, tarefasAtrasadas: atrasadas.length, tarefasPendentes: pendentes.length },
      message: `Digest ${frequency} enviado para ${user.email}`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});