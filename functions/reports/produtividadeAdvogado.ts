import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const [tarefas, processos, publicacoes, usuarios] = await Promise.all([
      base44.asServiceRole.entities.TarefaAgendada.list('-created_date', 200),
      base44.asServiceRole.entities.ProcessoAdvise.list('-created_date', 200),
      base44.asServiceRole.entities.PublicacaoAdvise.list('-created_date', 200),
      base44.asServiceRole.entities.User.list(),
    ]);

    const relatorio = usuarios.map(u => {
      const minhasTarefas = tarefas.filter(t => t.emailDestino === u.email || t.created_by === u.email);
      const concluidas = minhasTarefas.filter(t => t.status === 'concluida');
      const atrasadas = minhasTarefas.filter(t => t.status === 'atrasada');
      const eficiencia = minhasTarefas.length > 0 ? Math.round((concluidas.length / minhasTarefas.length) * 100) : 0;

      return {
        advogado: u.full_name || u.email,
        email: u.email,
        role: u.role,
        tarefasTotal: minhasTarefas.length,
        tarefasConcluidas: concluidas.length,
        tarefasAtrasadas: atrasadas.length,
        eficiencia: `${eficiencia}%`,
        publicacoesLidas: publicacoes.filter(p => p.lido && p.created_by === u.email).length,
      };
    });

    return Response.json({
      success: true,
      periodo: 'Todos os registros',
      geradoEm: new Date().toISOString(),
      totalAdvogados: usuarios.length,
      relatorio,
      resumo: {
        totalTarefas: tarefas.length,
        totalConcluidas: tarefas.filter(t => t.status === 'concluida').length,
        totalAtrasadas: tarefas.filter(t => t.status === 'atrasada').length,
        eficienciaMedia: `${Math.round(tarefas.length > 0 ? (tarefas.filter(t => t.status === 'concluida').length / tarefas.length) * 100 : 0)}%`
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});