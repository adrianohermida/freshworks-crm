import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const FRESHSALES_API_KEY = Deno.env.get('FRESHSALES_API_KEY');
const FRESHSALES_WORKSPACE = Deno.env.get('FRESHSALES_WORKSPACE_ID');

const freshsalesApiUrl = `https://${FRESHSALES_WORKSPACE}.myfreshworks.com/crm/sales/api`;

async function fetchFreshsalesLeads() {
  const response = await fetch(`${freshsalesApiUrl}/leads`, {
    method: 'GET',
    headers: {
      'Authorization': `Token token=${FRESHSALES_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Freshsales API error: ${response.statusText}`);
  }

  return response.json();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const freshsalesData = await fetchFreshsalesLeads();
    const leads = freshsalesData.leads || [];

    let syncedCount = 0;
    let errorCount = 0;

    for (const lead of leads) {
      try {
        const existingLead = await base44.entities.FreshsalesLead.filter({
          freshsales_id: lead.id.toString()
        }, null, 1);

        const leadData = {
          freshsales_id: lead.id.toString(),
          first_name: lead.first_name || '',
          last_name: lead.last_name || '',
          email: lead.email || '',
          phone: lead.phone || '',
          company_name: lead.company_name || '',
          lead_source: lead.source || '',
          lead_status: lead.status || 'new',
          conversion_status: lead.conversion_status || 'unconverted',
          last_sync: new Date().toISOString(),
          freshsales_data: lead
        };

        if (existingLead.length > 0) {
          await base44.entities.FreshsalesLead.update(existingLead[0].id, leadData);
        } else {
          await base44.entities.FreshsalesLead.create(leadData);
        }

        syncedCount++;
      } catch (error) {
        errorCount++;
        console.error(`Error syncing lead ${lead.id}:`, error.message);
      }
    }

    return Response.json({
      success: true,
      message: 'Leads synchronized',
      synced: syncedCount,
      errors: errorCount,
      total: leads.length
    });
  } catch (error) {
    console.error('Sync error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});