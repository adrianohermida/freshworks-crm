/**
 * POST /agents - Create a new agent
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { email, name, phone, mobile, job_title, group_ids, role_id } = await req.json();

    if (!email || !name) {
      return Response.json({ error: 'email and name required' }, { status: 400 });
    }

    const domain = Deno.env.get('FRESHDESK_DOMAIN');
    const apiKey = Deno.env.get('FRESHDESK_API_KEY');

    const agentData = {
      email,
      name,
      phone: phone || null,
      mobile: mobile || null,
      job_title: job_title || null,
      group_ids: group_ids || [],
      role_id: role_id || null
    };

    const response = await fetch(`https://${domain}.freshdesk.com/api/v2/agents`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(apiKey + ':x')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(agentData)
    });

    if (!response.ok) {
      throw new Error(`Freshdesk API error: ${response.statusText}`);
    }

    const data = await response.json();

    return Response.json({ agent: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});