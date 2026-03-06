/**
 * POST /surveys - Create a new survey
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { name, description, questions, target_audience } = await req.json();

    if (!name || !questions || questions.length === 0) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const domain = Deno.env.get('FRESHDESK_DOMAIN');
    const apiKey = Deno.env.get('FRESHDESK_API_KEY');

    const surveyData = {
      name,
      description: description || '',
      questions: questions.map((q, idx) => ({
        position: idx,
        question_text: q.text,
        question_type: q.type, // nps, csat, ces, custom
        options: q.options || []
      })),
      target_audience: target_audience || 'after_ticket_resolved'
    };

    const response = await fetch(`https://${domain}.freshdesk.com/api/v2/surveys`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(apiKey + ':x')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(surveyData)
    });

    if (!response.ok) {
      throw new Error(`Freshdesk API error: ${response.statusText}`);
    }

    const data = await response.json();

    return Response.json({ survey: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});