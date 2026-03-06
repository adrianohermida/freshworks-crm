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
    const { ticket_id, page = 1, per_page = 50 } = body;

    if (!ticket_id) {
      return Response.json({ error: 'Missing ticket_id' }, { status: 400 });
    }

    const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
    const url = `${domain}api/v2/tickets/${ticket_id}/conversations?page=${page}&per_page=${per_page}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${FRESHDESK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return Response.json({ 
        error: 'Failed to fetch conversations',
        status: response.status
      }, { status: response.status });
    }

    const data = await response.json();
    const conversations = data.conversations || [];

    return Response.json({ 
      success: true, 
      conversations: conversations.map(c => ({
        id: c.id,
        body: c.body,
        body_text: c.body_text,
        attachment_ids: c.attachment_ids || [],
        author_id: c.author_id,
        author_type: c.author_type,
        created_at: c.created_at,
        updated_at: c.updated_at,
        source: c.source,
        incoming: c.incoming
      })),
      total: data.total || conversations.length,
      page,
      per_page
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});