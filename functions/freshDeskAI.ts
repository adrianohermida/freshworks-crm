import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenant_id = user.email.split('@')[1];
    const { action, ticket_id } = await req.json();

    if (action === 'analyze_ticket') {
      // Buscar ticket do banco
      const ticket = await base44.entities.FreshDeskTicket.get(ticket_id);
      
      // Chamar IA para análise
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analise este ticket de suporte e forneça:
1. Classificação de urgência (low/medium/high/critical)
2. Categoria do problema
3. Próximas ações recomendadas
4. Tempo estimado de resolução em horas

Ticket:
Assunto: ${ticket.subject}
Descrição: ${ticket.description}
Prioridade Atual: ${ticket.priority}
Status: ${ticket.status}`,
        response_json_schema: {
          type: 'object',
          properties: {
            urgency: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
            category: { type: 'string' },
            next_actions: { type: 'array', items: { type: 'string' } },
            estimated_hours: { type: 'number' }
          }
        }
      });

      return Response.json({
        success: true,
        ticket_id,
        analysis,
        analyzed_at: new Date().toISOString()
      });
    }

    if (action === 'get_agent_insights') {
      // Análise de desempenho de agentes
      const agents = await base44.entities.FreshDeskAgent.list({
        tenant_id
      }, '-rating', 10);

      const insights = await base44.integrations.Core.InvokeLLM({
        prompt: `Analise os seguintes agentes de suporte e forneça insights:
${agents.map(a => `
- ${a.name} (Email: ${a.email})
  Rating: ${a.rating}/5
  Tickets Resolvidos: ${a.tickets_resolved}
  Habilidades: ${a.skills?.join(', ')}
`).join('\n')}

Forneça:
1. Top 3 agentes por performance
2. Áreas de melhoria
3. Recomendações de treinamento`,
        response_json_schema: {
          type: 'object',
          properties: {
            top_performers: { type: 'array', items: { type: 'string' } },
            improvement_areas: { type: 'array', items: { type: 'string' } },
            training_recommendations: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      return Response.json({
        success: true,
        insights,
        analyzed_at: new Date().toISOString()
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});