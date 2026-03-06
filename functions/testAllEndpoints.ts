import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const API_KEY = 'lSTacm1hnwx1fofzXXNZ0w';
const DOMAIN = 'hmadv-org.myfreshworks.com';
const BASE = `https://${DOMAIN}/crm/sales/api`;

async function testEndpoint(label, url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      headers: { "Authorization": `Token ${API_KEY}`, "Content-Type": "application/json" },
      signal: controller.signal
    });
    clearTimeout(timeout);
    return { label, status: res.status, ok: res.ok };
  } catch (e) {
    return { label, error: e.message };
  }
}

Deno.serve(async (req) => {
  const tests = [
    // Contacts
    { label: "Contacts - Filters", url: `${BASE}/contacts/filters` },
    { label: "Contacts - View", url: `${BASE}/contacts/view/31003526173?per_page=1` },
    { label: "Contacts - Fields", url: `${BASE}/settings/contacts/fields` },
    
    // Deals/Leads
    { label: "Deals - List", url: `${BASE}/deals?per_page=1` },
    { label: "Deals - Stages", url: `${BASE}/deals/stages` },
    { label: "Deals - Filters", url: `${BASE}/deals/filters` },
    
    // Accounts
    { label: "Accounts - List", url: `${BASE}/accounts?per_page=1` },
    { label: "Accounts - Fields", url: `${BASE}/settings/accounts/fields` },
    
    // Activities
    { label: "Activities - Tasks", url: `${BASE}/tasks?per_page=1` },
    { label: "Activities - Calls", url: `${BASE}/calls?per_page=1` },
    { label: "Activities - Meetings", url: `${BASE}/meetings?per_page=1` },
    { label: "Activities - Notes", url: `${BASE}/notes?per_page=1` },
    
    // Users
    { label: "Users - List", url: `${BASE}/users?per_page=1` },
    { label: "Users - Teams", url: `${BASE}/teams?per_page=1` },
    
    // Products
    { label: "Products - List", url: `${BASE}/products?per_page=1` },
    
    // Pipelines
    { label: "Pipelines - List", url: `${BASE}/pipelines?per_page=1` },
    
    // Fields
    { label: "Fields - List", url: `${BASE}/fields?per_page=1` },
    
    // Custom Lists (Lookups)
    { label: "Lookups - List", url: `${BASE}/settings/lookups` },
    
    // Sales Activities (specific)
    { label: "Sales Activities - List", url: `${BASE}/sales_activities?per_page=1` },
  ];

  const results = await Promise.all(tests.map(t => testEndpoint(t.label, t.url)));

  return Response.json({ 
    total: results.length,
    working: results.filter(r => r.ok).length,
    results 
  });
});