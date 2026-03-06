/**
 * DELETE /automation_rules/:id - Delete automation rule
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

    if (!ruleId) {
      return Response.json({ error: 'rule_id required' }, { status: 400 });
    }

    const domain = Deno.env.get('FRESHDESK_DOMAIN');
    const apiKey = Deno.env.get('FRESHDESK_API_KEY');

    const response = await fetch(
      `https://${domain}.freshdesk.com/api/v2/automation_rules/${ruleId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${btoa(apiKey + ':x')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Freshdesk API error: ${response.statusText}`);
    }

    return Response.json({ success: true, rule_id: ruleId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});