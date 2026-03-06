import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const FRESHDESK_DOMAIN = Deno.env.get("FRESHDESK_DOMAIN");
const FRESHDESK_API_KEY = Deno.env.get("FRESHDESK_API_KEY");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!FRESHDESK_DOMAIN || !FRESHDESK_API_KEY) {
      return Response.json({ error: 'Freshdesk credentials not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { agent_id, state } = body;

    if (!agent_id || !state) {
      return Response.json({ error: 'Missing required fields: agent_id, state' }, { status: 400 });
    }

    if (!['busy', 'idle', 'offline'].includes(state)) {
      return Response.json({ 
        error: 'Invalid state. Must be one of: busy, idle, offline' 
      }, { status: 400 });
    }

    const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
    const url = `${domain}api/v2/agents/${agent_id}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${FRESHDESK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ state })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      return Response.json({ 
        error: error.description || error.message || 'Failed to update agent status',
        status: response.status
      }, { status: response.status });
    }

    const agent = await response.json();

    return Response.json({ 
      success: true, 
      agent: {
        id: agent.id,
        name: agent.name,
        state: agent.state,
        available: agent.available
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});