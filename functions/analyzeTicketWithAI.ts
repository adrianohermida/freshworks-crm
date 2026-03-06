import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ticketId } = await req.json();

    if (!ticketId) {
      return Response.json({ error: 'ticketId required' }, { status: 400 });
    }

    // Get ticket from Base44
    const ticketList = await base44.entities.Ticket.filter({ id: ticketId });
    if (ticketList.length === 0) {
      return Response.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const ticket = ticketList[0];
    const content = `${ticket.subject}\n\n${ticket.description}`;

    // Use IA to analyze ticket
    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é um assistente de suporte técnico. Analise o seguinte ticket de suporte:

Assunto: ${ticket.subject}
Cliente: ${ticket.customer_name} (${ticket.customer_email})
Descrição: ${ticket.description}

Por favor, forneça em JSON:
1. Um resumo conciso do problema (max 100 palavras)
2. Análise de sentimento (positive, neutral, negative)
3. Uma resposta profissional e educada ao cliente

Responda APENAS em JSON válido, sem markdown.`,
      response_json_schema: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          sentiment: { type: 'string' },
          suggested_response: { type: 'string' }
        },
        required: ['summary', 'sentiment', 'suggested_response']
      }
    });

    // Validate analysis response
    if (!analysis || !analysis.summary || !analysis.sentiment || !analysis.suggested_response) {
      return Response.json({ 
        error: 'Invalid AI response structure',
        received: analysis 
      }, { status: 500 });
    }

    // Update ticket with AI analysis
    await base44.entities.Ticket.update(ticketId, {
      ai_summary: analysis.summary,
      ai_sentiment: analysis.sentiment,
      ai_suggested_response: analysis.suggested_response
    });

    return Response.json({
      success: true,
      analysis: analysis
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});