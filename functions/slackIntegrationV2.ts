import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Slack Integration V2
 * - Real-time notifications para eventos críticos
 * - Deadline alerts
 * - Process updates
 * - Daily digests
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action = 'config' } = await req.json();

    // GET SLACK CONFIG
    if (action === 'config') {
      const config = await base44.auth.updateMe?.({ slack_webhook_url: null });
      return Response.json({
        success: true,
        config: {
          webhook_url: config?.slack_webhook_url || null,
          events_enabled: [
            'process_synced',
            'deadline_alert',
            'publication_found',
            'movement_detected'
          ],
          digest_time: '09:00'
        }
      });
    }

    // SET WEBHOOK URL
    if (action === 'set_webhook') {
      const { webhook_url } = await req.json();
      await base44.auth.updateMe({ slack_webhook_url: webhook_url });
      return Response.json({ success: true, configured: true });
    }

    // SEND NOTIFICATION
    if (action === 'notify') {
      const { event_type, title, message, metadata } = await req.json();
      const webhook = await getSlackWebhook(user.email);

      if (!webhook) {
        return Response.json({ error: 'Slack not configured' }, { status: 400 });
      }

      const payload = buildSlackMessage(event_type, title, message, metadata);
      await sendToSlack(webhook, payload);

      return Response.json({ success: true, sent: true });
    }

    // LIST EVENTS
    if (action === 'events') {
      return Response.json({
        success: true,
        events: [
          {
            id: 'process_synced',
            name: 'Processo Sincronizado',
            description: 'Notifica quando um processo é sincronizado com DataJud'
          },
          {
            id: 'deadline_alert',
            name: 'Alerta de Prazo',
            description: 'Notifica sobre prazos próximos de vencer'
          },
          {
            id: 'publication_found',
            name: 'Publicação Encontrada',
            description: 'Notifica quando há novas publicações'
          },
          {
            id: 'movement_detected',
            name: 'Movimento Detectado',
            description: 'Notifica sobre novos movimentos processuais'
          }
        ]
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[SlackIntegrationV2] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function getSlackWebhook(userEmail) {
  // In production, fetch from user settings
  return Deno.env.get('SLACK_WEBHOOK_URL') || null;
}

function buildSlackMessage(eventType, title, message, metadata) {
  const colors = {
    process_synced: '#00CED1',
    deadline_alert: '#FF6B6B',
    publication_found: '#51CF66',
    movement_detected: '#4C6EF5'
  };

  return {
    attachments: [
      {
        color: colors[eventType] || '#888888',
        title: title,
        text: message,
        fields: Object.entries(metadata || {}).map(([key, value]) => ({
          title: key.charAt(0).toUpperCase() + key.slice(1),
          value: String(value),
          short: true
        })),
        ts: Math.floor(Date.now() / 1000)
      }
    ]
  };
}

async function sendToSlack(webhook, payload) {
  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Slack API error: ${response.statusText}`);
  }

  return response.json();
}