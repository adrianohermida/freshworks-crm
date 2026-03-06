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
    const { agent_id } = body;

    if (!agent_id) {
      return Response.json({ error: 'Missing agent_id' }, { status: 400 });
    }

    const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
    const url = `${domain}api/v2/agents/${agent_id}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${FRESHDESK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return Response.json({ 
        error: 'Agent not found',
        status: response.status
      }, { status: response.status });
    }

    const agent = await response.json();

    return Response.json({ 
      success: true, 
      agent: {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        mobile: agent.mobile,
        avatar: agent.avatar,
        state: agent.state,
        group_ids: agent.group_ids || [],
        signature: agent.signature,
        available: agent.available,
        created_at: agent.created_at,
        updated_at: agent.updated_at
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});