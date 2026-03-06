import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

function generateEventDescription(tarefa) {
  return `Processo: ${tarefa.numeroProcesso}\n\nDescrição: ${tarefa.descricao || 'Sem descrição'}\n\nDias Úteis: ${tarefa.diasUteis}\nTipo de Prazo: ${tarefa.tipoPrazo}`;
}

async function createEventInGoogle(accessToken, tarefa) {
  const deadlineDate = new Date(tarefa.dataPrazo);
  
  // Cria evento no dia do prazo com alarme de 3 dias antes
  const event = {
    summary: `📋 Prazo: ${tarefa.numeroProcesso}`,
    description: generateEventDescription(tarefa),
    start: {
      date: tarefa.dataPrazo
    },
    end: {
      date: new Date(deadlineDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 72 },    // 3 dias antes
        { method: 'email', minutes: 1440 },  // 1 dia antes
        { method: 'email', minutes: 0 }      // No dia
      ]
    }
  };

  const response = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/primary/events`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    }
  );

  if (!response.ok) {
    throw new Error(`Google Calendar API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

async function updateEventInGoogle(accessToken, eventId, tarefa) {
  const deadlineDate = new Date(tarefa.dataPrazo);
  
  const event = {
    summary: `📋 Prazo: ${tarefa.numeroProcesso}`,
    description: generateEventDescription(tarefa),
    start: {
      date: tarefa.dataPrazo
    },
    end: {
      date: new Date(deadlineDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 72 },
        { method: 'email', minutes: 1440 },
        { method: 'email', minutes: 0 }
      ]
    }
  };

  const response = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/primary/events/${eventId}`,
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
    throw new Error(`Google Calendar API error: ${response.status} ${response.statusText}`);
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

    // Busca token do Google
    let accessToken;
    try {
      accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');
    } catch (error) {
      return Response.json({
        error: 'Google Calendar não autorizado. Configure a integração nas configurações.',
        details: 'Necessário autorização com Google Calendar'
      }, { status: 401 });
    }

    // Busca tarefas pendentes de sincronização
    const tarefas = await base44.entities.TarefaAgendada.filter({
      status: { $in: ['pendente'] },
      integracao: 'google_calendar'
    });

    const sincronizadas = [];

    for (const tarefa of tarefas) {
      try {
        const googleEvent = await createEventInGoogle(accessToken, tarefa);

        await base44.entities.TarefaAgendada.update(tarefa.id, {
          idTarefaExterna: googleEvent.id,
          status: 'sincronizada',
          integracao: 'google_calendar'
        });

        sincronizadas.push({
          tarefaId: tarefa.id,
          googleEventId: googleEvent.id,
          processo: tarefa.numeroProcesso,
          link: googleEvent.htmlLink
        });
      } catch (error) {
        console.error(`Erro ao sincronizar tarefa ${tarefa.id}:`, error.message);
        
        await base44.entities.TarefaAgendada.update(tarefa.id, {
          status: 'erro'
        });
      }
    }

    return Response.json({
      success: true,
      message: 'Tarefas sincronizadas com Google Calendar',
      sincronizadas: sincronizadas.length,
      detalhes: sincronizadas,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro na sincronização Google Calendar:', error);
    return Response.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
});