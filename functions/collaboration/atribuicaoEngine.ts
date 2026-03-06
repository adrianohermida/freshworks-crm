import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { action, tarefaId, atribuirPara, prioridade, observacao } = body;

    if (action === 'atribuir' && tarefaId && atribuirPara) {
      if (tarefaId !== 'demo') {
        await base44.asServiceRole.entities.TarefaAgendada.update(tarefaId, {
          emailDestino: atribuirPara,
          metadados: { atribuidoPor: user.email, atribuidoEm: new Date().toISOString(), observacao }
        });
      }

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: atribuirPara,
        subject: `LegalPush — Tarefa atribuída a você por ${user.full_name || user.email}`,
        body: `Uma tarefa foi atribuída a você.\n\nID: ${tarefaId}\nPrioridade: ${prioridade || 'normal'}\nObservação: ${observacao || '-'}\n\nAcesse o LegalPush para ver os detalhes.`,
        from_name: 'LegalPush'
      });

      return Response.json({
        success: true,
        assignment: { tarefaId, atribuidoPara: atribuirPara, atribuidoPor: user.email, prioridade, timestamp: new Date().toISOString() },
        message: `Tarefa atribuída a ${atribuirPara} com notificação enviada.`
      });
    }

    const usuarios = await base44.asServiceRole.entities.User.list();
    return Response.json({
      success: true,
      availableUsers: usuarios.map(u => ({ email: u.email, nome: u.full_name, role: u.role })),
      message: 'Engine de atribuição ativo.'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});