import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const API_KEY = 'lSTacm1hnwx1fofzXXNZ0w';
const DOMAIN = 'hmadv-org.myfreshworks.com';
const BASE = `https://${DOMAIN}/crm/sales/api`;

async function fetchFS(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, {
      headers: { "Authorization": `Token ${API_KEY}`, "Content-Type": "application/json" },
      signal: controller.signal
    });
    clearTimeout(timeout);
    const text = await res.text();
    try {
      return { status: res.status, data: JSON.parse(text) };
    } catch {
      return { status: res.status, data: text.slice(0, 300) };
    }
  } catch (e) {
    clearTimeout(timeout);
    return { error: e.message };
  }
}

Deno.serve(async (req) => {
  try {
    const results = {};

    // Get filters first
    const filtersRes = await fetchFS(`${BASE}/contacts/filters`);
    results.filters = filtersRes;

    // Try to use each filter ID as a view
    if (filtersRes.data?.filters) {
      for (let i = 0; i < Math.min(3, filtersRes.data.filters.length); i++) {
        const filterId = filtersRes.data.filters[i].id;
        const filterName = filtersRes.data.filters[i].name;
        results[`view_${filterName}`] = await fetchFS(`${BASE}/contacts/view/${filterId}?per_page=2`);
      }
    }

    // Try scroll API
    if (filtersRes.data?.filters?.length > 0) {
      const firstFilterId = filtersRes.data.filters[0].id;
      results.scroll = await fetchFS(`${BASE}/contacts/scroll/${firstFilterId}?limit=2`);
    }

    // Try contact fields
    results.fields = await fetchFS(`${BASE}/settings/contacts/fields`);

    return Response.json(results);

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});