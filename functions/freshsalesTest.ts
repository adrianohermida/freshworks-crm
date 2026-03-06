import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const API_KEY = 'lSTacm1hnwx1fofzXXNZ0w';
const FRESHSALES_DOMAIN = 'https://hmadv-org.myfreshworks.com';

Deno.serve(async (req) => {
  try {
    // Test different endpoints
    const tests = [
      { label: "Contacts v2", url: `${FRESHSALES_DOMAIN}/crm/sales/api/v2/contacts?page=1&per_page=1` },
      { label: "Leads v2", url: `${FRESHSALES_DOMAIN}/crm/sales/api/v2/deals?page=1&per_page=1` },
      { label: "Opportunities", url: `${FRESHSALES_DOMAIN}/crm/sales/api/v2/sales_activities?page=1&per_page=1` },
      { label: "Accounts v2", url: `${FRESHSALES_DOMAIN}/crm/sales/api/v2/accounts?page=1&per_page=1` },
      { label: "Activities", url: `${FRESHSALES_DOMAIN}/crm/sales/api/v2/tasks?page=1&per_page=1` },
    ];

    const results = [];

    for (const t of tests) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      try {
        const res = await fetch(t.url, {
          headers: { "Authorization": `Token ${API_KEY}`, "Content-Type": "application/json" },
          signal: controller.signal
        });
        clearTimeout(timeout);
        const text = await res.text();
        results.push({ 
          label: t.label, 
          status: res.status, 
          body: text.slice(0, 300),
          parsed: tryParse(text)
        });
      } catch (e) {
        clearTimeout(timeout);
        results.push({ label: t.label, error: e.message });
      }
    }

    return Response.json({ results });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function tryParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}