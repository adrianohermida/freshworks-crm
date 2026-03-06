/**
 * POST /custom_fields - Create custom field
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { label, field_type, description, required, choices } = await req.json();

    if (!label || !field_type) {
      return Response.json({ error: 'label and field_type required' }, { status: 400 });
    }

    const domain = Deno.env.get('FRESHDESK_DOMAIN');
    const apiKey = Deno.env.get('FRESHDESK_API_KEY');

    const fieldData = {
      label,
      field_type, // text, number, dropdown, date, checkbox
      description: description || '',
      required: required || false,
      default_value: null
    };

    if (choices && choices.length > 0) {
      fieldData.choices = choices;
    }

    const response = await fetch(`https://${domain}.freshdesk.com/api/v2/custom_fields`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(apiKey + ':x')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fieldData)
    });

    if (!response.ok) {
      throw new Error(`Freshdesk API error: ${response.statusText}`);
    }

    const data = await response.json();

    return Response.json({ field: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});