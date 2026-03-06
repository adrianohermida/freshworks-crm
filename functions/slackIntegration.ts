import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Slack Integration - Sprint 14 Task 1
 * Enviar notificações de processos para Slack
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      slack_webhook_url, 
      event_type, 
      process_data,
      channel = '#datajud'
    } = await req.json();

    if (!slack_webhook_url) {
      return Response.json({ error: 'Missing Slack webhook URL' }, { status: 400 });
    }

    // Preparar mensagem Slack
    const slackMessage = buildSlackMessage(event_type, process_data);

    // Enviar para Slack
    const response = await fetch(slack_webhook_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel,
        ...slackMessage
      })
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.statusText}`);
    }

    // Log integração
    await base44.entities.Analytics.create({
      user_id: user.email,
      event_type: 'slack_notification_sent',
      entity_type: 'process',
      entity_id: process_data?.cnj_number || 'unknown',
      action: `Notificação enviada ao Slack para evento: ${event_type}`,
      timestamp: new Date().toISOString(),
      status: 'success'
    });

    return Response.json({
      success: true,
      message: 'Notificação enviada ao Slack',
      channel
    });

  } catch (error) {
    console.error('[slackIntegration]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function buildSlackMessage(eventType, data) {
  const messages = {
    movement: {
      text: `📌 Novo Movimento Registrado`,
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: '📌 Novo Movimento' }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Processo:*\n${data?.cnj_number}`
            },
            {
              type: 'mrkdwn',
              text: `*Tipo:*\n${data?.movement_type}`
            }
          ]
        }
      ]
    },
    publication: {
      text: `📢 Nova Publicação`,
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: '📢 Nova Publicação' }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Processo: ${data?.cnj_number}\nDiário: ${data?.dj}`
          }
        }
      ]
    },
    deadline: {
      text: `⏰ Alerta de Prazo`,
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: '⏰ Alerta de Prazo' }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Processo: ${data?.cnj_number}\nPrazo: ${data?.deadline_date}`
          }
        }
      ]
    }
  };

  return messages[eventType] || { text: 'Notificação DataJud' };
}