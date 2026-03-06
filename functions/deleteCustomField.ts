/**
 * DELETE /custom_fields/:id - Delete custom field
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
    const fieldId = url.searchParams.get('field_id');

    if (!fieldId) {
      return Response.json({ error: 'field_id required' }, { status: 400 });
    }

    const domain = Deno.env.get('FRESHDESK_DOMAIN');
    const apiKey = Deno.env.get('FRESHDESK_API_KEY');

    const response = await fetch(
      `https://${domain}.freshdesk.com/api/v2/custom_fields/${fieldId}`,
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

    return Response.json({ success: true, field_id: fieldId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});