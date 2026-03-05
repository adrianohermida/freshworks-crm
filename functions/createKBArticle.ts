/**
 * POST /solutions/articles - Create KB article
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, folder_id, category_id, status } = await req.json();

    if (!title || !description) {
      return Response.json({ error: 'title and description required' }, { status: 400 });
    }

    const domain = Deno.env.get('FRESHDESK_DOMAIN');
    const apiKey = Deno.env.get('FRESHDESK_API_KEY');

    const articleData = {
      title,
      description,
      folder_id: folder_id || null,
      category_id: category_id || null,
      status: status || 1 // 1 = draft, 2 = published
    };

    const response = await fetch(`https://${domain}.freshdesk.com/api/v2/solutions/articles`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(apiKey + ':x')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(articleData)
    });

    if (!response.ok) {
      throw new Error(`Freshdesk API error: ${response.statusText}`);
    }

    const data = await response.json();

    return Response.json({ article: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});