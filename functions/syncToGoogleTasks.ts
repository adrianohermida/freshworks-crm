import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const GOOGLE_TASKS_API = 'https://www.googleapis.com/tasks/v1';

async function createTaskInGoogle(accessToken, taskData) {
  const payload = {
    title: taskData.titulo,
    notes: taskData.descricao,
    due: taskData.dataPrazo, // Formato: YYYY-MM-DD ou RFC 3339
    status: 'needsAction'
  };

  const response = await fetch(
    `${GOOGLE_TASKS_API}/lists/@default/tasks`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    throw new Error(`Google Tasks API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

async function updateTaskInGoogle(accessToken, taskId, taskData) {
  const payload = {
    title: taskData.titulo,
    notes: taskData.descricao,
    due: taskData.dataPrazo,
    status: taskData.status === 'concluida' ? 'completed' : 'needsAction'
  };

  const response = await fetch(
    `${GOOGLE_TASKS_API}/lists/@default/tasks/${taskId}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    throw new Error(`Google Tasks API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Busca token do Google (precisa estar configurado pelo usuário)
    let accessToken;
    try {
      accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');
    } catch (error) {
      return Response.json({
        error: 'Google não autorizado. Configure a integração nas configurações da app.',
        details: 'Necessário autorização com Google para sincronizar tarefas.'
      }, { status: 401 });
    }

    // Busca tarefas pendentes de sincronização
    const tarefas = await base44.entities.TarefaAgendada.filter({
      status: { $in: ['pendente'] },
      integracao: 'google_tasks'
    });

    const sincronizadas = [];

    for (const tarefa of tarefas) {
      try {
        const googleTask = await createTaskInGoogle(accessToken, {
          titulo: tarefa.titulo,
          descricao: tarefa.descricao,
          dataPrazo: tarefa.dataPrazo
        });

        // Atualiza tarefa com ID externo
        await base44.entities.TarefaAgendada.update(tarefa.id, {
          idTarefaExterna: googleTask.id,
          status: 'sincronizada',
          integracao: 'google_tasks'
        });

        sincronizadas.push({
          tarefaId: tarefa.id,
          googleTaskId: googleTask.id,
          processo: tarefa.numeroProcesso
        });
      } catch (error) {
        console.error(`Erro ao sincronizar tarefa ${tarefa.id}:`, error.message);
        
        // Marca como erro
        await base44.entities.TarefaAgendada.update(tarefa.id, {
          status: 'erro'
        });
      }
    }

    return Response.json({
      success: true,
      message: 'Tarefas sincronizadas com Google Tasks',
      sincronizadas: sincronizadas.length,
      detalhes: sincronizadas,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro na sincronização Google Tasks:', error);
    return Response.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
});