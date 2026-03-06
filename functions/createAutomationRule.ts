/**
 * POST /automation_rules - Create automation rule
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { name, description, conditions, actions, enabled } = await req.json();

    if (!name || !conditions || !actions) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const domain = Deno.env.get('FRESHDESK_DOMAIN');
    const apiKey = Deno.env.get('FRESHDESK_API_KEY');

    const ruleData = {
      name,
      description: description || '',
      conditions: conditions, // Array of condition objects
      actions: actions, // Array of action objects
      enabled: enabled !== false
    };

    const response = await fetch(`https://${domain}.freshdesk.com/api/v2/automation_rules`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(apiKey + ':x')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ruleData)
    });

    if (!response.ok) {
      throw new Error(`Freshdesk API error: ${response.statusText}`);
    }

    const data = await response.json();

    return Response.json({ rule: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});