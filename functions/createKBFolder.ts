/**
 * POST /solutions/folders - Create KB folder
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, category_id } = await req.json();

    if (!name) {
      return Response.json({ error: 'name required' }, { status: 400 });
    }

    const domain = Deno.env.get('FRESHDESK_DOMAIN');
    const apiKey = Deno.env.get('FRESHDESK_API_KEY');

    const folderData = { name, description, category_id };

    const response = await fetch(
      `https://${domain}.freshdesk.com/api/v2/solutions/folders`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(apiKey + ':x')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(folderData)
      }
    );

    if (!response.ok) {
      throw new Error(`Freshdesk API error: ${response.statusText}`);
    }

    const data = await response.json();

    return Response.json({ folder: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});