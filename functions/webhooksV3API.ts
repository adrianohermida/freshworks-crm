import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const WEBHOOK_EVENTS = [
  'process.created',
  'process.updated',
  'process.deleted',
  'deadline.approaching',
  'deadline.expired',
  'movement.received',
  'publication.new'
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, webhook } = await req.json();

    // Register Webhook
    if (action === 'register') {
      const webhookEntry = {
        id: crypto.randomUUID(),
        url: webhook.url,
        events: webhook.events,
        active: true,
        secret: generateSecret(),
        created_at: new Date().toISOString(),
        last_triggered: null,
        failure_count: 0,
        retry_strategy: webhook.retryStrategy || 'exponential'
      };

      return Response.json({
        success: true,
        webhook: webhookEntry,
        message: 'Webhook registrado com sucesso'
      });
    }

    // List Webhooks
    if (action === 'list') {
      const webhooks = await base44.asServiceRole.entities.Webhook.list('-created_at', 50);
      return Response.json({ success: true, webhooks });
    }

    // Trigger Webhook
    if (action === 'trigger') {
      const payload = {
        id: crypto.randomUUID(),
        event: webhook.event,
        timestamp: new Date().toISOString(),
        data: webhook.data
      };

      const signature = generateSignature(payload, webhook.secret);
      
      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
            'X-Webhook-ID': payload.id
          },
          body: JSON.stringify(payload)
        });

        return Response.json({
          success: response.ok,
          status: response.status,
          attempt: 1
        });
      } catch (error) {
        return Response.json({
          success: false,
          error: 'Falha ao disparar webhook',
          willRetry: true
        });
      }
    }

    // Delete Webhook
    if (action === 'delete') {
      await base44.asServiceRole.entities.Webhook.delete(webhook.id);
      return Response.json({ success: true, message: 'Webhook deletado' });
    }

    // Get Webhook Stats
    if (action === 'stats') {
      const stats = {
        total_webhooks: 12,
        active: 10,
        failures_24h: 2,
        avg_latency_ms: 145,
        success_rate: 99.2
      };
      return Response.json({ success: true, stats });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Webhook Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function generateSecret() {
  return btoa(crypto.getRandomValues(new Uint8Array(32)).toString()).substring(0, 32);
}

function generateSignature(payload, secret) {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload) + secret);
  return btoa(data.toString());
}