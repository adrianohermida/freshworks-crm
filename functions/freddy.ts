/**
 * FREDDY IA INTEGRATION
 * Análise preditiva, recomendações de leads e insights de vendas
 * Status: TEMPLATE - Integração com InvokeLLM da Base44
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, lead_id, conversation_id, context } = await req.json();

    if (action === "analyze_lead") {
      // Análise de lead: qualificação, score, próximas ações
      const lead = await base44.entities.FreshsalesLead.list({ id: lead_id });
      
      if (lead.length === 0) {
        return Response.json({ error: 'Lead not found' }, { status: 404 });
      }

      const leadData = lead[0];

      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this sales lead and provide:
1. Lead qualification score (0-100)
2. Risk assessment (low/medium/high)
3. Top 3 recommended next actions
4. Estimated probability of conversion

Lead data:
- Title: ${leadData.title}
- Value: R$ ${leadData.value}
- Status: ${leadData.status}
- Expected close: ${leadData.expected_close_date}
- Current probability: ${leadData.probability}%

Respond in Portuguese (pt-BR).`,
        response_json_schema: {
          type: "object",
          properties: {
            freddy_score: { type: "number" },
            risk_level: { type: "string" },
            next_actions: { type: "array", items: { type: "string" } },
            conversion_probability: { type: "number" }
          }
        }
      });

      // Atualizar lead com insights de Freddy
      await base44.entities.FreshsalesLead.update(lead_id, {
        freddy_score: analysis.freddy_score,
        next_action: analysis.next_actions[0]
      });

      return Response.json(analysis);
    }

    if (action === "analyze_conversation") {
      // Análise de conversa: sentimento, intenção, recomendações
      const conversation = await base44.entities.ChatConversation.list({ 
        id: conversation_id 
      });

      if (conversation.length === 0) {
        return Response.json({ error: 'Conversation not found' }, { status: 404 });
      }

      const conv = conversation[0];
      const messagesText = (conv.messages || [])
        .map(m => `${m.sender}: ${m.content}`)
        .join('\n');

      const insights = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this customer conversation and provide:
1. Overall sentiment (positive/neutral/negative)
2. Customer intent (inquiry/complaint/purchase_intent/other)
3. Recommended response action
4. Suggested follow-up topics
5. Lead qualification assessment

Conversation:
${messagesText}

Respond in Portuguese (pt-BR).`,
        response_json_schema: {
          type: "object",
          properties: {
            sentiment: { type: "string" },
            intent: { type: "string" },
            recommended_action: { type: "string" },
            follow_up_topics: { type: "array", items: { type: "string" } },
            lead_potential: { type: "string" }
          }
        }
      });

      // Atualizar conversa com insights
      await base44.entities.ChatConversation.update(conversation_id, {
        freddy_insights: insights
      });

      return Response.json(insights);
    }

    if (action === "generate_lead_recommendations") {
      // Recomendações de priorização de leads para vendedor
      const leads = await base44.entities.FreshsalesLead.list({
        status: { $in: ["new", "qualified"] },
        tenant_id: user.email.split("@")[1] // tenant_id baseado no domínio do email
      });

      const leadsText = leads
        .slice(0, 10)
        .map(l => `${l.title} - R$${l.value} - ${l.probability}% prob`)
        .join('\n');

      const recommendations = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on these leads, provide sales recommendations:

Leads:
${leadsText}

Generate:
1. Top 3 leads to prioritize today
2. Risk analysis for each
3. Suggested approach/talking points
4. Pipeline health assessment

Respond in Portuguese (pt-BR).`,
        response_json_schema: {
          type: "object",
          properties: {
            priority_leads: { type: "array", items: { type: "string" } },
            risks: { type: "object" },
            approaches: { type: "object" },
            pipeline_health: { type: "string" }
          }
        }
      });

      return Response.json(recommendations);
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Freddy error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});