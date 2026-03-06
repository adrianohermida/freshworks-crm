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

    // Fetch contacts from Freshdesk (paginated)
    const allContacts = [];
    let page = 1;
    const perPage = 100;
    let hasMore = true;

    while (hasMore) {
      const url = `${domain}/api/v2/contacts?per_page=${perPage}&page=${page}`;
      const res = await fetch(url, {
        headers: {
          'Authorization': FRESHDESK_BASIC_TOKEN,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        break;
      }

      const data = await res.json();
      const contacts = Array.isArray(data) ? data : data.contacts || [];
      allContacts.push(...contacts);

      if (contacts.length < perPage) {
        hasMore = false;
      } else {
        page++;
      }
    }

    // Fetch existing contacts from DB
    const existing = await base44.asServiceRole.entities.Contact.list();
    const existingMap = {};
    for (const c of existing) {
      if (c.freshdesk_id) existingMap[c.freshdesk_id] = c.id;
    }

    let created = 0, updated = 0;

    for (const fd of allContacts) {
      const data = {
        freshdesk_id: String(fd.id),
        name: fd.name || 'Sem nome',
        email: fd.email || `contact_${fd.id}@freshdesk.local`,
        phone: fd.phone,
        company_name: fd.company_id ? `Company ${fd.company_id}` : null,
        last_sync: new Date().toISOString()
      };

      const existingId = existingMap[String(fd.id)];
      if (existingId) {
        await base44.asServiceRole.entities.Contact.update(existingId, data);
        updated++;
      } else {
        await base44.asServiceRole.entities.Contact.create(data);
        created++;
      }
    }

    return Response.json({
      success: true,
      total: allContacts.length,
      created,
      updated,
      message: `Sincronização concluída: ${created} novo(s), ${updated} atualizado(s)`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});