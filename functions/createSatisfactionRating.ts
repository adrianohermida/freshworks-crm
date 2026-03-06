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

    const body = await req.json();
    const { ticket_id, rating, note } = body;

    if (!ticket_id || !rating) {
      return Response.json({ 
        error: 'Missing required fields: ticket_id, rating' 
      }, { status: 400 });
    }

    if (![1, 2, 3, 4, 5].includes(rating)) {
      return Response.json({ 
        error: 'Rating must be between 1 and 5' 
      }, { status: 400 });
    }

    const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
    const url = `${domain}api/v2/tickets/${ticket_id}/satisfaction-ratings`;

    const payload = {
      rating,
      ...(note && { note })
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${FRESHDESK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      return Response.json({ 
        error: error.description || error.message || 'Failed to create rating',
        status: response.status
      }, { status: response.status });
    }

    const rating_data = await response.json();

    return Response.json({ 
      success: true, 
      rating: {
        id: rating_data.id,
        ticket_id: rating_data.ticket_id,
        rating: rating_data.rating,
        note: rating_data.note,
        created_at: rating_data.created_at
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});