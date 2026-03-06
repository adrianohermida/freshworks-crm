import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { ACCOUNTS_OAUTH } from './FRESHSALES_OAUTH_CREDENTIALS.js';

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

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenant_id = user.id;
    const accessToken = ACCOUNTS_OAUTH.clientSecret; // In production, use OAuth token from connector

    // Fetch accounts from Freshsales
    let allAccounts = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const data = await fetchFromFreshsales(
        `/api/sales_accounts?page=${page}&per_page=100`,
        accessToken
      );

      if (data.sales_accounts && data.sales_accounts.length > 0) {
        allAccounts = [...allAccounts, ...data.sales_accounts];
        page++;
        hasMore = data.sales_accounts.length === 100;
      } else {
        hasMore = false;
      }
    }

    // Sync accounts to Base44
    const syncedAccounts = [];
    for (const account of allAccounts) {
      try {
        const existingAccount = await base44.entities.FreshsalesAccount.filter(
          { freshsales_id: account.id, tenant_id }
        );

        if (existingAccount.length > 0) {
          // Update existing
          await base44.entities.FreshsalesAccount.update(existingAccount[0].id, {
            name: account.name,
            email: account.email,
            phone: account.phone,
            website: account.website,
            industry: account.industry,
            employees_count: account.employees_count,
            revenue: account.revenue,
            last_synced_at: new Date().toISOString(),
            sync_status: 'synced',
          });
          syncedAccounts.push({ id: account.id, action: 'updated' });
        } else {
          // Create new
          await base44.entities.FreshsalesAccount.create({
            freshsales_id: account.id,
            name: account.name,
            email: account.email,
            phone: account.phone,
            website: account.website,
            industry: account.industry,
            employees_count: account.employees_count,
            revenue: account.revenue,
            last_synced_at: new Date().toISOString(),
            sync_status: 'synced',
            tenant_id,
          });
          syncedAccounts.push({ id: account.id, action: 'created' });
        }
      } catch (error) {
        console.error(`Error syncing account ${account.id}:`, error.message);
        syncedAccounts.push({ id: account.id, action: 'failed', error: error.message });
      }
    }

    return Response.json({
      success: true,
      message: `Synced ${syncedAccounts.length} accounts`,
      synced: syncedAccounts,
      totalAccounts: allAccounts.length,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});