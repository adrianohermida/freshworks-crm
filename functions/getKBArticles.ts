/**
 * GET /solutions/articles - Get KB articles with search and filtering
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
    const categoryId = url.searchParams.get('category_id');
    const search = url.searchParams.get('search');
    const status = url.searchParams.get('status') || 'all';

    const domain = Deno.env.get('FRESHDESK_DOMAIN');
    const apiKey = Deno.env.get('FRESHDESK_API_KEY');

    let endpoint = `https://${domain}.freshdesk.com/api/v2/solutions/articles?per_page=100`;
    
    if (categoryId) endpoint += `&category_id=${categoryId}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (status !== 'all') endpoint += `&status=${status}`;

    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Basic ${btoa(apiKey + ':x')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Freshdesk API error: ${response.statusText}`);
    }

    const data = await response.json();

    return Response.json({ articles: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});