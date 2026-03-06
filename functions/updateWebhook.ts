import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const FRESHDESK_DOMAIN = Deno.env.get("FRESHDESK_DOMAIN");
const FRESHDESK_API_KEY = Deno.env.get("FRESHDESK_API_KEY");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    if (!FRESHDESK_DOMAIN || !FRESHDESK_API_KEY) {
      return Response.json({ error: 'Freshdesk credentials not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { webhook_id, url, events, active } = body;

    if (!webhook_id) {
      return Response.json({ error: 'Missing webhook_id' }, { status: 400 });
    }

    const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
    const webhookUrl = `${domain}api/v2/webhooks/${webhook_id}`;

    const payload = {};
    if (url) payload.url = url;
    if (events) payload.events = events;
    if (active !== undefined) payload.active = active;

    const response = await fetch(webhookUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${FRESHDESK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      return Response.json({ 
        error: error.description || error.message || 'Failed to update webhook',
        status: response.status
      }, { status: response.status });
    }

    const webhook = await response.json();

    return Response.json({ 
      success: true, 
      webhook: {
        id: webhook.id,
        url: webhook.url,
        events: webhook.events,
        active: webhook.active
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});