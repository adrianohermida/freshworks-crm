import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

function generateEventDescription(tarefa) {
  return `Processo: ${tarefa.numeroProcesso}\n${tarefa.descricao || ''}\n\nTipo de Prazo: ${tarefa.tipoPrazo}\nDias Úteis: ${tarefa.diasUteis}`;
}

async function createGoogleCalendarEvent(accessToken, tarefa) {
  const event = {
    summary: `Prazo: ${tarefa.numeroProcesso}`,
    description: generateEventDescription(tarefa),
    start: {
      date: tarefa.dataPrazo.split('T')[0],
      timeZone: 'America/Manaus'
    },
    end: {
      date: new Date(new Date(tarefa.dataPrazo).getTime() + 86400000).toISOString().split('T')[0],
      timeZone: 'America/Manaus'
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 1440 }, // 1 dia antes
        { method: 'email', minutes: 120 }   // 2 horas antes
      ]
    },
    location: tarefa.metadados?.municipio || ''
  };

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  });

  if (!response.ok) {
    throw new Error(`Erro ao criar evento: ${response.status}`);
  }

  const data = await response.json();
  return data.id;
}

async function updateGoogleCalendarEvent(accessToken, eventId, tarefa) {
  const event = {
    summary: `Prazo: ${tarefa.numeroProcesso}`,
    description: generateEventDescription(tarefa),
    start: {
      date: tarefa.dataPrazo.split('T')[0],
      timeZone: 'America/Manaus'
    },
    end: {
      date: new Date(new Date(tarefa.dataPrazo).getTime() + 86400000).toISOString().split('T')[0],
      timeZone: 'America/Manaus'
    }
  };

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    }
  );

  if (!response.ok) {
    throw new Error(`Erro ao atualizar evento: ${response.status}`);
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get Google Calendar access token
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');

    // Fetch pending tasks
    const tarefas = await base44.entities.TarefaAgendada.filter({
      status: 'criada',
      integracao: 'google_calendar'
    });

    let eventoscriados = 0;
    let eventosatualizados = 0;
    const erros = [];

    for (const tarefa of tarefas) {
      try {
        if (tarefa.idTarefaExterna) {
          // Update existing event
          await updateGoogleCalendarEvent(accessToken, tarefa.idTarefaExterna, tarefa);
          eventosatualizados++;
        } else {
          // Create new event
          const eventId = await createGoogleCalendarEvent(accessToken, tarefa);
          await base44.entities.TarefaAgendada.update(tarefa.id, {
            idTarefaExterna: eventId,
            status: 'sincronizada'
          });
          eventosriados++;
        }
      } catch (error) {
        console.error(`Erro ao sincronizar tarefa ${tarefa.id}:`, error.message);
        await base44.entities.TarefaAgendada.update(tarefa.id, {
          status: 'erro'
        });
        erros.push({
          tarefaId: tarefa.id,
          erro: error.message
        });
      }
    }

    return Response.json({
      success: true,
      message: 'Tarefas sincronizadas com Google Calendar',
      eventosriados,
      eventosatualizados,
      erros: erros.length > 0 ? erros : null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro na sincronização:', error);
    return Response.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
});