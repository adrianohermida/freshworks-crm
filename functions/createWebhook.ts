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
    const { url, events } = body;

    if (!url || !events || events.length === 0) {
      return Response.json({ 
        error: 'Missing required fields: url, events (array)' 
      }, { status: 400 });
    }

    const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
    const webhookUrl = `${domain}api/v2/webhooks`;

    const payload = {
      url,
      events,
      alert_notif_enabled: true
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${FRESHDESK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      return Response.json({ 
        error: error.description || error.message || 'Failed to create webhook',
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
        created_at: webhook.created_at
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});