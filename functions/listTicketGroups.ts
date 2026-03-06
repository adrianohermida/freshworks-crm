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

    const url = `${domain}/api/v2/groups`;
    const res = await fetch(url, {
      headers: {
        'Authorization': FRESHDESK_BASIC_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({ error: `Freshdesk API ${res.status}`, hint: errText.slice(0, 200) }, { status: res.status });
    }

    const data = await res.json();
    const groups = Array.isArray(data) ? data : data.groups || [];

    return Response.json({ success: true, groups });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});