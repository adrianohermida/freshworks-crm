import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { DEALS_OAUTH } from './FRESHSALES_OAUTH_CREDENTIALS.js';

const fetchFromFreshsales = async (endpoint, accessToken) => {
  const response = await fetch(`https://api.freshsales.io${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Freshsales API error: ${response.statusText}`);
  }

  return response.json();
};

const mapStageToStatus = (stage) => {
  const stageMap = {
    'qualification': 'new',
    'proposal': 'proposal',
    'negotiation': 'negotiation',
    'won': 'won',
    'lost': 'lost',
  };
  return stageMap[stage] || 'new';
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenant_id = user.id;
    const accessToken = DEALS_OAUTH.clientSecret; // In production, use OAuth token

    // Fetch deals from Freshsales
    let allDeals = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const data = await fetchFromFreshsales(
        `/api/deals?page=${page}&per_page=100`,
        accessToken
      );

      if (data.deals && data.deals.length > 0) {
        allDeals = [...allDeals, ...data.deals];
        page++;
        hasMore = data.deals.length === 100;
      } else {
        hasMore = false;
      }
    }

    // Sync deals to Base44
    const syncedDeals = [];
    for (const deal of allDeals) {
      try {
        const existingDeal = await base44.entities.FreshsalesLead.filter(
          { freshsales_id: deal.id, tenant_id }
        );

        const dealData = {
          title: deal.name,
          value: deal.amount,
          currency: deal.currency || 'BRL',
          status: mapStageToStatus(deal.stage),
          pipeline_id: deal.pipeline_id,
          owner_id: deal.owner_id,
          expected_close_date: deal.expected_close_date,
          probability: deal.probability,
          freddy_score: deal.freddy_score,
          next_action: deal.next_action,
          notes: deal.notes,
          last_synced_at: new Date().toISOString(),
          sync_status: 'synced',
        };

        if (existingDeal.length > 0) {
          // Update existing
          await base44.entities.FreshsalesLead.update(existingDeal[0].id, dealData);
          syncedDeals.push({ id: deal.id, action: 'updated' });
        } else {
          // Create new
          await base44.entities.FreshsalesLead.create({
            ...dealData,
            freshsales_id: deal.id,
            contact_id: deal.owner_id,
            tenant_id,
          });
          syncedDeals.push({ id: deal.id, action: 'created' });
        }
      } catch (error) {
        console.error(`Error syncing deal ${deal.id}:`, error.message);
        syncedDeals.push({ id: deal.id, action: 'failed', error: error.message });
      }
    }

    return Response.json({
      success: true,
      message: `Synced ${syncedDeals.length} deals`,
      synced: syncedDeals,
      totalDeals: allDeals.length,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});