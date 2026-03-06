import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const payload = await req.json();
    // Support both direct calls and entity automation payloads
    const eventType = payload?.eventType || payload?.event?.type || 'unknown';
    const entityData = payload?.entityData || payload?.data || {};
    const entityId = payload?.entityId || payload?.event?.entity_id;

    // Fetch active webhooks for this event
    const webhooks = await base44.entities.Webhook.filter({
      active: true,
      events: { $in: [eventType] }
    });

    const results = [];

    for (const webhook of webhooks) {
      let lastStatus = 'failed';
      let error = null;

      for (let attempt = 1; attempt <= webhook.retry_count; attempt++) {
        try {
          const response = await fetch(webhook.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...webhook.headers
            },
            body: JSON.stringify({
              event: eventType,
              timestamp: new Date().toISOString(),
              data: entityData,
              entityId
            }),
            signal: AbortSignal.timeout(webhook.timeout * 1000)
          });

          if (response.ok) {
            lastStatus = 'success';
            error = null;
            break;
          } else {
            error = `HTTP ${response.status}: ${response.statusText}`;
          }
        } catch (err) {
          error = err.message;
          if (attempt === webhook.retry_count) {
            lastStatus = 'failed';
          }
        }

        // Wait before retry
        if (attempt < webhook.retry_count) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }

      // Update webhook status
      await base44.asServiceRole.entities.Webhook.update(webhook.id, {
        last_triggered: new Date().toISOString(),
        last_status: lastStatus
      });

      results.push({
        webhookId: webhook.id,
        webhookName: webhook.name,
        status: lastStatus,
        error: error || null
      });
    }

    return Response.json({ success: true, triggered: results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});