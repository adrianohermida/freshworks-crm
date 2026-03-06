/**
 * PUT /automation_rules/:id - Update automation rule
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const url = new URL(req.url);
    const ruleId = url.searchParams.get('rule_id');
    const { name, description, conditions, actions, enabled } = await req.json();

    if (!ruleId) {
      return Response.json({ error: 'rule_id required' }, { status: 400 });
    }

    const domain = Deno.env.get('FRESHDESK_DOMAIN');
    const apiKey = Deno.env.get('FRESHDESK_API_KEY');

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (conditions) updateData.conditions = conditions;
    if (actions) updateData.actions = actions;
    if (enabled !== undefined) updateData.enabled = enabled;

    const response = await fetch(
      `https://${domain}.freshdesk.com/api/v2/automation_rules/${ruleId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${btoa(apiKey + ':x')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      }
    );

    if (!response.ok) {
      throw new Error(`Freshdesk API error: ${response.statusText}`);
    }

    const data = await response.json();

    return Response.json({ rule: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});