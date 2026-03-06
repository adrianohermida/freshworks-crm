/**
 * POST /agents/:id/skills - Assign skills to agent
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { agent_id, skill_ids } = await req.json();

    if (!agent_id || !skill_ids || !Array.isArray(skill_ids)) {
      return Response.json({ error: 'agent_id and skill_ids array required' }, { status: 400 });
    }

    const domain = Deno.env.get('FRESHDESK_DOMAIN');
    const apiKey = Deno.env.get('FRESHDESK_API_KEY');

    const response = await fetch(
      `https://${domain}.freshdesk.com/api/v2/agents/${agent_id}/skills`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(apiKey + ':x')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ skill_ids })
      }
    );

    if (!response.ok) {
      throw new Error(`Freshdesk API error: ${response.statusText}`);
    }

    const data = await response.json();

    return Response.json({ success: true, agent_skills: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});