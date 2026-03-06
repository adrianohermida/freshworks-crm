/**
 * POST /contacts/:id/merge - Merge two contacts
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
    const contactId = url.searchParams.get('contact_id');
    const { other_contact_id } = await req.json();

    if (!contactId || !other_contact_id) {
      return Response.json({ error: 'contact_id and other_contact_id required' }, { status: 400 });
    }

    const domain = Deno.env.get('FRESHDESK_DOMAIN');
    const apiKey = Deno.env.get('FRESHDESK_API_KEY');

    const mergeData = {
      other_contact_id
    };

    const response = await fetch(
      `https://${domain}.freshdesk.com/api/v2/contacts/${contactId}/merge`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(apiKey + ':x')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mergeData)
      }
    );

    if (!response.ok) {
      throw new Error(`Freshdesk API error: ${response.statusText}`);
    }

    const data = await response.json();

    return Response.json({ contact: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});