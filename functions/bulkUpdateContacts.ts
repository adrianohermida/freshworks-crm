/**
 * Bulk update contacts (workaround para API que não suporta bulk)
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contact_ids, update_data } = await req.json();

    if (!contact_ids || contact_ids.length === 0 || !update_data) {
      return Response.json({ error: 'contact_ids and update_data required' }, { status: 400 });
    }

    const domain = Deno.env.get('FRESHDESK_DOMAIN');
    const apiKey = Deno.env.get('FRESHDESK_API_KEY');

    const results = [];

    for (const contactId of contact_ids) {
      try {
        const response = await fetch(
          `https://${domain}.freshdesk.com/api/v2/contacts/${contactId}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Basic ${btoa(apiKey + ':x')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(update_data)
          }
        );

        if (response.ok) {
          const data = await response.json();
          results.push({ contact_id: contactId, success: true, data });
        } else {
          results.push({ contact_id: contactId, success: false, error: response.statusText });
        }
      } catch (error) {
        results.push({ contact_id: contactId, success: false, error: error.message });
      }
    }

    return Response.json({
      total: contact_ids.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});