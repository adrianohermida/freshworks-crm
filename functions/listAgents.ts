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
    const { page = 1, per_page = 50, state = 'all' } = body;

    const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
    const url = `${domain}api/v2/agents?page=${page}&per_page=${per_page}&state=${state}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${FRESHDESK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return Response.json({ 
        error: 'Failed to fetch agents',
        status: response.status
      }, { status: response.status });
    }

    const data = await response.json();
    const agents = data.agents || [];

    return Response.json({ 
      success: true, 
      agents: agents.map(a => ({
        id: a.id,
        name: a.name,
        email: a.email,
        phone: a.phone,
        mobile: a.mobile,
        avatar: a.avatar,
        state: a.state,
        group_ids: a.group_ids || [],
        signature: a.signature,
        created_at: a.created_at,
        updated_at: a.updated_at
      })),
      total: data.total || agents.length,
      page,
      per_page
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});