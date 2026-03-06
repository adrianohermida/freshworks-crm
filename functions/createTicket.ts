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
    const { subject, description, email, name, priority, category } = body;

    if (!subject || !description || !email) {
      return Response.json({ 
        error: 'Missing required fields: subject, description, email' 
      }, { status: 400 });
    }

    const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
    const url = `${domain}api/v2/tickets`;

    const priorityMap = {
      'low': 1,
      'medium': 2,
      'high': 3,
      'urgent': 4
    };

    const ticketPayload = {
      subject,
      description,
      email,
      name: name || 'Usuário App',
      priority: priorityMap[priority] || 2,
      status: 2,
      ...(category && { category })
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${FRESHDESK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ticketPayload)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      return Response.json({ 
        error: error.description || error.message || 'Failed to create ticket',
        status: response.status
      }, { status: response.status });
    }

    const ticket = await response.json();

    // Sync to local database
    try {
      await base44.entities.Ticket.create({
        freshdesk_id: ticket.id.toString(),
        subject: ticket.subject,
        description: ticket.description_text || description,
        status: 'open',
        priority: priority || 'medium',
        customer_email: email,
        customer_name: name || 'Usuário App',
        category: category,
        tags: ticket.tags || [],
        last_sync: new Date().toISOString()
      });
    } catch (dbError) {
      console.error('DB sync error:', dbError.message);
    }

    return Response.json({ 
      success: true, 
      ticket: {
        id: ticket.id,
        freshdesk_id: ticket.id,
        subject: ticket.subject,
        status: 'open'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});