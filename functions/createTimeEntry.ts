/**
 * POST /time_entries - Create time entry
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ticket_id, time_spent, billable, note } = await req.json();

    if (!ticket_id || !time_spent) {
      return Response.json({ error: 'ticket_id and time_spent required' }, { status: 400 });
    }

    const domain = Deno.env.get('FRESHDESK_DOMAIN');
    const apiKey = Deno.env.get('FRESHDESK_API_KEY');

    const timeEntryData = { ticket_id, time_spent, billable: billable || false };
    if (note) timeEntryData.note = note;

    const response = await fetch(
      `https://${domain}.freshdesk.com/api/v2/time_entries`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(apiKey + ':x')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(timeEntryData)
      }
    );

    if (!response.ok) {
      throw new Error(`Freshdesk API error: ${response.statusText}`);
    }

    const data = await response.json();

    return Response.json({ time_entry: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});