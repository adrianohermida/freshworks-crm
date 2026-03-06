/**
 * GET /surveys/:id/responses - Get survey responses
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const surveyId = url.searchParams.get('survey_id');

    if (!surveyId) {
      return Response.json({ error: 'survey_id required' }, { status: 400 });
    }

    const domain = Deno.env.get('FRESHDESK_DOMAIN');
    const apiKey = Deno.env.get('FRESHDESK_API_KEY');

    const response = await fetch(
      `https://${domain}.freshdesk.com/api/v2/surveys/${surveyId}/responses?per_page=100`,
      {
        headers: {
          'Authorization': `Basic ${btoa(apiKey + ':x')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Freshdesk API error: ${response.statusText}`);
    }

    const data = await response.json();

    return Response.json({ responses: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});