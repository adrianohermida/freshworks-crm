/**
 * PUT /solutions/categories/:id - Update KB category
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
    const categoryId = url.searchParams.get('category_id');
    const { name, description } = await req.json();

    if (!categoryId) {
      return Response.json({ error: 'category_id required' }, { status: 400 });
    }

    const domain = Deno.env.get('FRESHDESK_DOMAIN');
    const apiKey = Deno.env.get('FRESHDESK_API_KEY');

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;

    const response = await fetch(
      `https://${domain}.freshdesk.com/api/v2/solutions/categories/${categoryId}`,
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

    return Response.json({ category: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});