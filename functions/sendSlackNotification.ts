import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    // Support both direct calls and entity automation payloads
    const eventType = body?.eventType || body?.event?.type || 'unknown';
    const ticketId = body?.ticketId || body?.event?.entity_id;
    const message = body?.message;
    const channel = body?.channel;

    // Buscar configuração Slack
    const slackConfigs = await base44.asServiceRole.entities.SlackConfig.list();
    const slackConfig = slackConfigs[0];

    if (!slackConfig || !slackConfig.enabled) {
      return Response.json({ 
        success: false, 
        message: 'Slack not configured' 
      });
    }

    // Determinar webhook URL
    const webhookUrl = slackConfig.webhook_url;

    if (!webhookUrl) {
      return Response.json({ 
        success: false, 
        message: 'Webhook URL not set' 
      });
    }

    // Buscar ticket para contexto
    let ticket = null;
    if (ticketId) {
      const tickets = await base44.asServiceRole.entities.Ticket.list();
      ticket = tickets.find(t => t.id === ticketId) || null;
    }

    // Construir payload Slack
    let slackMessage = {};

    switch (eventType) {
      case 'ticket_created':
        slackMessage = {
          channel: slackConfig.channel_tickets,
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: '🎫 Novo Ticket Criado',
                emoji: true
              }
            },
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: `*Assunto:*\n${ticket?.subject || 'N/A'}`
                },
                {
                  type: 'mrkdwn',
                  text: `*Cliente:*\n${ticket?.customer_name || 'N/A'}`
                },
                {
                  type: 'mrkdwn',
                  text: `*Prioridade:*\n${ticket?.priority || 'medium'}`
                },
                {
                  type: 'mrkdwn',
                  text: `*Status:*\n${ticket?.status || 'open'}`
                }
              ]
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: ticket?.ai_summary ? `_${ticket.ai_summary}_` : ''
              }
            }
          ]
        };
        break;

      case 'ticket_updated':
        slackMessage = {
          channel: slackConfig.channel_tickets,
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: '🔄 Ticket Atualizado',
                emoji: true
              }
            },
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: `*Assunto:*\n${ticket?.subject || 'N/A'}`
                },
                {
                  type: 'mrkdwn',
                  text: `*Novo Status:*\n${ticket?.status || 'N/A'}`
                }
              ]
            }
          ]
        };
        break;

      case 'response_added':
        slackMessage = {
          channel: slackConfig.channel_responses,
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: '💬 Nova Resposta',
                emoji: true
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Ticket:* ${ticket?.subject || 'N/A'}\n*Resposta:*\n${message || 'N/A'}`
              }
            }
          ]
        };
        break;

      default:
        slackMessage = {
          text: message || 'Notificação de Ticket'
        };
    }

    // Enviar para Slack
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(slackMessage)
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.statusText}`);
    }

    return Response.json({ 
      success: true, 
      message: 'Notification sent to Slack' 
    });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});