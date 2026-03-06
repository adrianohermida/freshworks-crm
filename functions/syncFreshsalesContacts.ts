import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const FRESHSALES_API_KEY = Deno.env.get('FRESHSALES_API_KEY');
const FRESHSALES_WORKSPACE = Deno.env.get('FRESHSALES_WORKSPACE_ID');

const freshsalesApiUrl = `https://${FRESHSALES_WORKSPACE}.myfreshworks.com/crm/sales/api`;

async function fetchFreshsalesContacts() {
  const response = await fetch(`${freshsalesApiUrl}/contacts?include=addresses`, {
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

    const freshsalesData = await fetchFreshsalesContacts();
    const contacts = freshsalesData.contacts || [];

    let syncedCount = 0;
    let errorCount = 0;

    for (const contact of contacts) {
      try {
        const existingContact = await base44.entities.FreshsalesContact.filter({
          freshsales_id: contact.id.toString()
        }, null, 1);

        const contactData = {
          freshsales_id: contact.id.toString(),
          first_name: contact.first_name || '',
          last_name: contact.last_name || '',
          email: contact.email || '',
          phone: contact.phone || '',
          company_name: contact.company_name || '',
          mobile_number: contact.mobile_number || '',
          job_title: contact.job_title || '',
          last_sync: new Date().toISOString(),
          sync_status: 'synced',
          freshsales_data: contact
        };

        if (existingContact.length > 0) {
          await base44.entities.FreshsalesContact.update(existingContact[0].id, contactData);
        } else {
          await base44.entities.FreshsalesContact.create(contactData);
        }

        syncedCount++;
      } catch (error) {
        errorCount++;
        console.error(`Error syncing contact ${contact.id}:`, error.message);
      }
    }

    return Response.json({
      success: true,
      message: 'Contacts synchronized',
      synced: syncedCount,
      errors: errorCount,
      total: contacts.length
    });
  } catch (error) {
    console.error('Sync error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});