/**
 * GET /time_entries - List time entries
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const ticketId = url.searchParams.get('ticket_id');
    const agentId = url.searchParams.get('agent_id');
    const page = url.searchParams.get('page') || 1;

    const domain = Deno.env.get('FRESHDESK_DOMAIN');
    const apiKey = Deno.env.get('FRESHDESK_API_KEY');

    let apiUrl = `https://${domain}.freshdesk.com/api/v2/time_entries?page=${page}`;
    if (ticketId) {
      apiUrl = `https://${domain}.freshdesk.com/api/v2/tickets/${ticketId}/time_entries?page=${page}`;
    }
    if (agentId) {
      apiUrl += `&agent_id=${agentId}`;
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(apiKey + ':x')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Freshdesk API error: ${response.statusText}`);
    }

    const data = await response.json();

    return Response.json({ time_entries: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});