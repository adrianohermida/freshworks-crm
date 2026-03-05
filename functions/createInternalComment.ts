/**
 * POST /tickets/:id/internal_notes - Create internal comment
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
    const { body } = await req.json();

    if (!ticketId || !body) {
      return Response.json({ error: 'ticket_id and body required' }, { status: 400 });
    }

    const domain = Deno.env.get('FRESHDESK_DOMAIN');
    const apiKey = Deno.env.get('FRESHDESK_API_KEY');

    const commentData = {
      body,
      note_type: 3 // Internal note
    };

    const response = await fetch(
      `https://${domain}.freshdesk.com/api/v2/tickets/${ticketId}/conversations`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(apiKey + ':x')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
      }
    );

    if (!response.ok) {
      throw new Error(`Freshdesk API error: ${response.statusText}`);
    }

    const data = await response.json();

    return Response.json({ comment: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});