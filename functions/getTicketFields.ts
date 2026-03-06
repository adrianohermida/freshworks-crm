import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const FRESHDESK_DOMAIN = Deno.env.get("FRESHDESK_DOMAIN");
const FRESHDESK_API_KEY = Deno.env.get("FRESHDESK_API_KEY");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!FRESHDESK_DOMAIN || !FRESHDESK_API_KEY) {
      return Response.json({ error: 'Freshdesk credentials not configured' }, { status: 500 });
    }

    const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
    const url = `${domain}api/v2/ticket_fields`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${FRESHDESK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return Response.json({ 
        error: 'Failed to fetch ticket fields',
        status: response.status
      }, { status: response.status });
    }

    const data = await response.json();
    const fields = data.ticket_fields || [];

    return Response.json({ 
      success: true, 
      fields: fields.map(f => ({
        id: f.id,
        name: f.name,
        label: f.label,
        description: f.description,
        field_type: f.field_type,
        required: f.required,
        customers_can_edit: f.customers_can_edit,
        customers_can_view: f.customers_can_view
      })),
      total: fields.length
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});