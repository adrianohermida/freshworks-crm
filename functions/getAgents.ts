import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const FRESHDESK_BASIC_TOKEN = Deno.env.get("FRESHDESK_BASIC_TOKEN");
const FRESHDESK_DOMAIN = Deno.env.get("FRESHDESK_DOMAIN");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!FRESHDESK_BASIC_TOKEN || !FRESHDESK_DOMAIN) {
      return Response.json({ error: 'Freshdesk credentials not configured' }, { status: 500 });
    }

    const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
    const url = `${domain}api/v2/agents?per_page=100`;

    const response = await fetch(url, {
      headers: {
        'Authorization': FRESHDESK_BASIC_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return Response.json({ error: `Freshdesk API error: ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    const agents = (data || []).map(agent => ({
      id: agent.id,
      name: agent.name,
      email: agent.email,
      signature: agent.signature
    }));

    return Response.json({ agents });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});