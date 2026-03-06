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
    const { freshdesk_id } = body;

    if (!freshdesk_id) {
      return Response.json({ error: 'Missing freshdesk_id' }, { status: 400 });
    }

    const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
    const url = `${domain}api/v2/tickets/${freshdesk_id}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${FRESHDESK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return Response.json({ 
        error: 'Ticket not found or access denied',
        status: response.status
      }, { status: response.status });
    }

    const ticket = await response.json();

    // Map status
    const statusMap = {
      2: 'open',
      3: 'pending',
      4: 'resolved',
      5: 'closed'
    };

    const priorityMap = {
      1: 'low',
      2: 'medium',
      3: 'high',
      4: 'urgent'
    };

    return Response.json({ 
      success: true, 
      ticket: {
        id: ticket.id,
        subject: ticket.subject,
        description: ticket.description_text,
        status: statusMap[ticket.status] || 'open',
        priority: priorityMap[ticket.priority] || 'medium',
        customer_email: ticket.email,
        customer_name: ticket.name,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at,
        assigned_agent_id: ticket.responder_id,
        category: ticket.category,
        tags: ticket.tags || [],
        source: ticket.source
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});