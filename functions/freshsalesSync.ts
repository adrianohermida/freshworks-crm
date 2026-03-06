/**
 * FRESHSALES SYNC FUNCTION
 * Sincroniza dados entre Freshsales e Base44
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const FRESHSALES_TOKEN = 'Token lSTacm1hnwx1fofzXXNZ0w';
const FRESHSALES_DOMAIN = 'https://hmadv-org.myfreshworks.com';
const BASE_URL = `${FRESHSALES_DOMAIN}/crm/sales/api`;

async function fetchFromFreshsales(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Authorization": FRESHSALES_TOKEN,
      "Content-Type": "application/json"
    }
  };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Freshsales API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action, tenant_id } = await req.json();

    if (action === "test_connection") {
      const data = await fetchFromFreshsales("/v2/contacts?page=1&per_page=1");
      return Response.json({ success: true, message: "Conexão OK", sample: data });
    }

    if (action === "sync_contacts") {
      let page = 1;
      let synced = 0;
      let hasMore = true;

      while (hasMore) {
        const data = await fetchFromFreshsales(`/v2/contacts?page=${page}&per_page=50`);
        const contacts = data.contacts || [];

        if (contacts.length === 0) {
          hasMore = false;
          break;
        }

        for (const contact of contacts) {
          // Check if contact already exists
          const existing = await base44.asServiceRole.entities.FreshsalesContact.filter({
            freshsales_id: contact.id.toString(),
            tenant_id
          });

          const contactData = {
            freshsales_id: contact.id.toString(),
            first_name: contact.first_name || "",
            last_name: contact.last_name || "",
            email: contact.email || "",
            phone: contact.mobile_number || contact.work_number || "",
            company_name: contact.company?.name || contact.company_name || "",
            lead_score: contact.lead_score || 0,
            status: "prospect",
            source: "api",
            last_synced_at: new Date().toISOString(),
            sync_status: "synced",
            tenant_id
          };

          if (existing.length > 0) {
            await base44.asServiceRole.entities.FreshsalesContact.update(existing[0].id, contactData);
          } else {
            await base44.asServiceRole.entities.FreshsalesContact.create(contactData);
          }
          synced++;
        }

        if (contacts.length < 50) hasMore = false;
        page++;
      }

      return Response.json({ success: true, action: "sync_contacts", synced });
    }

    if (action === "sync_deals") {
      let page = 1;
      let synced = 0;
      let hasMore = true;

      while (hasMore) {
        const data = await fetchFromFreshsales(`/v2/deals?page=${page}&per_page=50`);
        const deals = data.deals || [];

        if (deals.length === 0) {
          hasMore = false;
          break;
        }

        for (const deal of deals) {
          // Find the associated contact
          const contacts = await base44.asServiceRole.entities.FreshsalesContact.filter({
            freshsales_id: deal.contact_id?.toString(),
            tenant_id
          });

          const contactId = contacts.length > 0 ? contacts[0].id : null;

          if (contactId) {
            const existing = await base44.asServiceRole.entities.FreshsalesLead.filter({
              freshsales_id: deal.id.toString(),
              tenant_id
            });

            const leadData = {
              freshsales_id: deal.id.toString(),
              contact_id: contactId,
              title: deal.name || "Sem título",
              value: deal.amount || 0,
              status: mapDealStage(deal.deal_stage?.name),
              owner_id: deal.owner?.id?.toString() || "",
              expected_close_date: deal.expected_close || null,
              probability: deal.probability || 0,
              notes: deal.description || "",
              last_synced_at: new Date().toISOString(),
              tenant_id
            };

            if (existing.length > 0) {
              await base44.asServiceRole.entities.FreshsalesLead.update(existing[0].id, leadData);
            } else {
              await base44.asServiceRole.entities.FreshsalesLead.create(leadData);
            }
            synced++;
          }
        }

        if (deals.length < 50) hasMore = false;
        page++;
      }

      return Response.json({ success: true, action: "sync_deals", synced });
    }

    if (action === "sync_all") {
      // Sync contacts first, then deals
      const contactsResult = await runSyncContacts(base44, tenant_id);
      const dealsResult = await runSyncDeals(base44, tenant_id);

      return Response.json({
        success: true,
        action: "sync_all",
        contacts_synced: contactsResult,
        deals_synced: dealsResult
      });
    }

    return Response.json({ error: `Invalid action: ${action}` }, { status: 400 });

  } catch (error) {
    console.error('Sync error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function mapDealStage(stageName) {
  if (!stageName) return "new";
  const name = stageName.toLowerCase();
  if (name.includes("qualif")) return "qualified";
  if (name.includes("proposta") || name.includes("proposal")) return "proposal";
  if (name.includes("negoc")) return "negotiation";
  if (name.includes("ganho") || name.includes("won")) return "won";
  if (name.includes("perdido") || name.includes("lost")) return "lost";
  if (name.includes("contact")) return "contacted";
  return "new";
}

async function runSyncContacts(base44, tenant_id) {
  let page = 1, synced = 0, hasMore = true;
  while (hasMore) {
    const data = await fetchFromFreshsales(`/v2/contacts?page=${page}&per_page=50`);
    const contacts = data.contacts || [];
    if (contacts.length === 0) break;
    for (const contact of contacts) {
      const existing = await base44.asServiceRole.entities.FreshsalesContact.filter({
        freshsales_id: contact.id.toString(), tenant_id
      });
      const contactData = {
        freshsales_id: contact.id.toString(),
        first_name: contact.first_name || "",
        last_name: contact.last_name || "",
        email: contact.email || "",
        phone: contact.mobile_number || contact.work_number || "",
        company_name: contact.company?.name || "",
        lead_score: contact.lead_score || 0,
        status: "prospect", source: "api",
        last_synced_at: new Date().toISOString(), sync_status: "synced", tenant_id
      };
      if (existing.length > 0) {
        await base44.asServiceRole.entities.FreshsalesContact.update(existing[0].id, contactData);
      } else {
        await base44.asServiceRole.entities.FreshsalesContact.create(contactData);
      }
      synced++;
    }
    if (contacts.length < 50) hasMore = false;
    page++;
  }
  return synced;
}

async function runSyncDeals(base44, tenant_id) {
  let page = 1, synced = 0, hasMore = true;
  while (hasMore) {
    const data = await fetchFromFreshsales(`/v2/deals?page=${page}&per_page=50`);
    const deals = data.deals || [];
    if (deals.length === 0) break;
    for (const deal of deals) {
      const contacts = await base44.asServiceRole.entities.FreshsalesContact.filter({
        freshsales_id: deal.contact_id?.toString(), tenant_id
      });
      if (contacts.length > 0) {
        const existing = await base44.asServiceRole.entities.FreshsalesLead.filter({
          freshsales_id: deal.id.toString(), tenant_id
        });
        const leadData = {
          freshsales_id: deal.id.toString(), contact_id: contacts[0].id,
          title: deal.name || "Sem título", value: deal.amount || 0,
          status: mapDealStage(deal.deal_stage?.name),
          owner_id: deal.owner?.id?.toString() || "",
          expected_close_date: deal.expected_close || null,
          probability: deal.probability || 0,
          last_synced_at: new Date().toISOString(), tenant_id
        };
        if (existing.length > 0) {
          await base44.asServiceRole.entities.FreshsalesLead.update(existing[0].id, leadData);
        } else {
          await base44.asServiceRole.entities.FreshsalesLead.create(leadData);
        }
        synced++;
      }
    }
    if (deals.length < 50) hasMore = false;
    page++;
  }
  return synced;
}