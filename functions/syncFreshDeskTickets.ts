import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const FRESHDESK_DOMAIN = Deno.env.get("FRESHDESK_DOMAIN");
const FRESHDESK_BASIC_TOKEN = Deno.env.get("FRESHDESK_BASIC_TOKEN");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    if (!FRESHDESK_DOMAIN || !FRESHDESK_BASIC_TOKEN) {
      return Response.json({ error: 'Freshdesk credentials not configured' }, { status: 500 });
    }

    let domain = FRESHDESK_DOMAIN.trim().replace(/\/+$/, '');
    if (!domain.startsWith('http')) domain = `https://${domain}`;

    // Fetch only the latest 5 tickets to stay within CPU limits
    const url = `${domain}/api/v2/tickets?per_page=5&page=1&order_by=updated_at&order_type=desc`;

    const res = await fetch(url, {
      headers: {
        'Authorization': FRESHDESK_BASIC_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({
        error: `Freshdesk API ${res.status}: ${res.statusText}`,
        hint: errText.slice(0, 200)
      }, { status: res.status });
    }

    const tickets = await res.json();
    if (!Array.isArray(tickets)) {
      return Response.json({ error: 'Unexpected response', raw: JSON.stringify(tickets).slice(0, 200) }, { status: 500 });
    }

    // Fetch existing tickets index by freshdesk_id
    const existing = await base44.asServiceRole.entities.Ticket.list();
    const existingMap = {};
    for (const t of existing) {
      if (t.freshdesk_id) existingMap[t.freshdesk_id] = t.id;
    }

    let created = 0, updated = 0;

    for (const fd of tickets) {
      const data = {
        freshdesk_id: String(fd.id),
        subject: fd.subject || `Ticket #${fd.id}`,
        description: fd.description_text || '',
        status: ({ 2: 'open', 3: 'pending', 4: 'resolved', 5: 'closed' })[fd.status] || 'open',
        priority: ({ 1: 'low', 2: 'medium', 3: 'high', 4: 'urgent' })[fd.priority] || 'medium',
        customer_email: fd.email || `req_${fd.requester_id}@freshdesk.local`,
        customer_name: fd.name || 'Unknown',
        tags: fd.tags || [],
        last_sync: new Date().toISOString()
      };

      const existingId = existingMap[String(fd.id)];
      if (existingId) {
        await base44.asServiceRole.entities.Ticket.update(existingId, data);
        updated++;
      } else {
        await base44.asServiceRole.entities.Ticket.create(data);
        created++;
      }
    }

    return Response.json({ success: true, total: tickets.length, created, updated });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});