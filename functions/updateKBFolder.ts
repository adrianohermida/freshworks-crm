/**
 * PUT /solutions/folders/:id - Update KB folder
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
    const folderId = url.searchParams.get('folder_id');
    const { name, description } = await req.json();

    if (!folderId) {
      return Response.json({ error: 'folder_id required' }, { status: 400 });
    }

    const domain = Deno.env.get('FRESHDESK_DOMAIN');
    const apiKey = Deno.env.get('FRESHDESK_API_KEY');

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;

    const response = await fetch(
      `https://${domain}.freshdesk.com/api/v2/solutions/folders/${folderId}`,
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

    return Response.json({ folder: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});