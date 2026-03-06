import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Webhook Handlers
 * - DataJud movement updates
 * - Zapier triggers
 * - Real-time notifications
 */

Deno.serve(async (req) => {
  try {
    const { pathname } = new URL(req.url);

    // DataJud Webhook
    if (pathname === '/webhooks/datajud') {
      return await handleDataJudWebhook(req);
    }

    // Zapier Webhook
    if (pathname === '/webhooks/zapier') {
      return await handleZapierWebhook(req);
    }

    // Generic webhook
    if (pathname === '/webhooks/generic') {
      return await handleGenericWebhook(req);
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('[WebhookHandlers] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function handleDataJudWebhook(req) {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const { event, process_id, movement_data } = payload;

    if (event === 'process_updated') {
      const process = await base44.asServiceRole.entities.Process.filter(
        { cnj_number: process_id },
        null,
        1
      );

      if (process.length > 0) {
        await base44.asServiceRole.entities.Process.update(process[0].id, {
          synced_at: new Date().toISOString(),
          movement_count: (process[0].movement_count || 0) + 1
        });

        if (movement_data) {
          await base44.asServiceRole.entities.ProcessMovement.create({
            process_id: process[0].id,
            movement_type: movement_data.type,
            movement_date: movement_data.date,
            description: movement_data.description,
            datajud_movement_id: movement_data.id
          });
        }

        // Track event
        await base44.asServiceRole.entities.Analytics.create({
          user_id: process[0].created_by,
          event_type: 'process_synced',
          entity_type: 'process',
          entity_id: process[0].id,
          action: 'Sincronização via webhook DataJud',
          timestamp: new Date().toISOString(),
          status: 'success'
        });
      }
    }

    return Response.json({ success: true, processed: true });
  } catch (error) {
    console.error('[DataJudWebhook] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

async function handleZapierWebhook(req) {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const { action, data } = payload;

    if (action === 'create_deadline') {
      const deadline = await base44.asServiceRole.entities.Deadline.create({
        process_id: data.process_id,
        title: data.title,
        deadline_date: data.deadline_date,
        priority: data.priority || 'medium'
      });

      return Response.json({ success: true, deadline });
    }

    if (action === 'create_notification') {
      const notification = await base44.asServiceRole.entities.Notification.create({
        user_id: data.user_id,
        type: data.type,
        title: data.title,
        message: data.message,
        channel: 'email',
        status: 'pending'
      });

      return Response.json({ success: true, notification });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('[ZapierWebhook] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

async function handleGenericWebhook(req) {
  try {
    const payload = await req.json();
    const signature = req.headers.get('x-webhook-signature');

    // Validate signature
    const webhook_secret = Deno.env.get('WEBHOOK_SECRET') || '';
    const expected_signature = new TextEncoder().encode(
      JSON.stringify(payload) + webhook_secret
    );

    if (!signature || signature !== btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest('SHA-256', expected_signature))))) {
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }

    return Response.json({ success: true, processed: true });
  } catch (error) {
    console.error('[GenericWebhook] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}