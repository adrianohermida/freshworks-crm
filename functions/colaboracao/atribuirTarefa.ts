import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { idTarefa, emailResponsavel, prazo, prioridade = 'media', descricaoAtribuicao } = await req.json();

    if (!idTarefa || !emailResponsavel) {
      return Response.json({
        success: false,
        error: 'idTarefa e emailResponsavel são obrigatórios'
      }, { status: 400 });
    }

    // Get tarefa
    let tarefa;
    try {
      const tarefas = await base44.entities.TarefaAgendada.filter({ id: idTarefa });
      if (tarefas.length === 0) {
        return Response.json({
          success: false,
          error: 'Tarefa não encontrada'
        }, { status: 404 });
      }
      tarefa = tarefas[0];
    } catch (e) {
      return Response.json({
        success: false,
        error: 'Falha ao buscar tarefa'
      }, { status: 500 });
    }

    // Update tarefa with assignment
    const atribuicao = {
      ...tarefa,
      responsavelEmail: emailResponsavel,
      atribuidoPor: user.email,
      dataAtribuicao: new Date().toISOString(),
      prioridade,
      prazo,
      descricaoAtribuicao,
      status: 'atribuida'
    };

    await base44.entities.TarefaAgendada.update(idTarefa, atribuicao);

    // Create assignment record for timeline
    const assignment = {
      idTarefa,
      responsavel: emailResponsavel,
      atribuidoPor: user.email,
      dataAtribuicao: new Date().toISOString(),
      prioridade,
      prazo,
      descricao: descricaoAtribuicao,
      status: 'ativa'
    };

    await base44.entities.Atribuicao?.create(assignment);

    // Send notification to assigned user
    try {
      await base44.functions.invoke('notificacoes/enviarEmailTemplate', {
        templateId: 'tarefa_atribuida',
        destinatario: emailResponsavel,
        dados: {
          titulo: tarefa.titulo,
          atribuidoPor: user.full_name,
          prazo,
          prioridade
        }
      });
    } catch (e) {
      console.log(`Falha ao notificar ${emailResponsavel}`);
    }

    // Audit log
    await base44.functions.invoke('security/auditLog', {
      acao: 'atribuirTarefa',
      entidade: 'Atribuicao',
      resultado: 'success',
      metadados: { idTarefa, responsavel: emailResponsavel }
    });

    return Response.json({
      success: true,
      action: 'colaboracao.atribuirTarefa',
      data: {
        id: assignment.id,
        idTarefa,
        responsavel: emailResponsavel,
        atribuidoPor: user.full_name,
        prioridade,
        prazo,
        dataAtribuicao: assignment.dataAtribuicao,
        message: `Tarefa atribuída a ${emailResponsavel} com prioridade ${prioridade}`
      }
    });
  } catch (error) {
    console.error('AtribuirTarefa error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});