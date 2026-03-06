/**
 * AI Agent Bridge - Integração entre Freshdesk e AI Agents
 * Permite que AI agents interajam com Freshdesk de forma programática
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Actions disponíveis para AI Agent
 */
const AI_AGENT_ACTIONS = {
  // Ticket actions
  'ticket.list': async (params, context) => {
    const { base44 } = context;
    return await base44.functions.invoke('searchTickets', {
      query: params.query || '',
      status: params.status
    });
  },

  'ticket.get': async (params, context) => {
    const { base44 } = context;
    return await base44.functions.invoke('getTicketDetail', {
      ticket_id: params.ticket_id
    });
  },

  'ticket.create': async (params, context) => {
    const { base44 } = context;
    return await base44.functions.invoke('createTicket', {
      subject: params.subject,
      description: params.description,
      email: params.customer_email,
      priority: params.priority,
      status: params.status,
      group_id: params.group_id
    });
  },

  'ticket.update': async (params, context) => {
    const { base44 } = context;
    return await base44.functions.invoke('updateTicket', {
      ticket_id: params.ticket_id,
      status: params.status,
      priority: params.priority,
      description: params.description
    });
  },

  'ticket.addResponse': async (params, context) => {
    const { base44 } = context;
    return await base44.functions.invoke('addTicketResponse', {
      ticket_id: params.ticket_id,
      body: params.response_body,
      public: params.public !== false
    });
  },

  'ticket.addInternalNote': async (params, context) => {
    const { base44 } = context;
    return await base44.functions.invoke('createInternalComment', {
      ticket_id: params.ticket_id,
      body: params.note_body
    });
  },

  // Contact actions
  'contact.list': async (params, context) => {
    const { base44 } = context;
    return await base44.functions.invoke('searchContacts', {
      query: params.query || ''
    });
  },

  'contact.get': async (params, context) => {
    const { base44 } = context;
    return await base44.functions.invoke('getContact', {
      contact_id: params.contact_id
    });
  },

  'contact.create': async (params, context) => {
    const { base44 } = context;
    return await base44.functions.invoke('createContact', {
      name: params.name,
      email: params.email,
      phone: params.phone
    });
  },

  // Agent actions
  'agent.list': async (params, context) => {
    const { base44 } = context;
    return await base44.functions.invoke('listAgents', {});
  },

  'agent.get': async (params, context) => {
    const { base44 } = context;
    return await base44.functions.invoke('getAgent', {
      agent_id: params.agent_id
    });
  },

  // Survey actions
  'survey.list': async (params, context) => {
    const { base44 } = context;
    return await base44.functions.invoke('getSurveys', {});
  },

  'survey.getResponses': async (params, context) => {
    const { base44 } = context;
    return await base44.functions.invoke('getSurveyResponses', {
      survey_id: params.survey_id
    });
  },

  // Knowledge Base actions
  'kb.search': async (params, context) => {
    const { base44 } = context;
    return await base44.functions.invoke('getKnowledgeBase', {
      query: params.query
    });
  },

  'kb.getCategories': async (params, context) => {
    const { base44 } = context;
    return await base44.functions.invoke('getKBCategories', {});
  },

  // Analytics actions
  'analytics.getMetrics': async (params, context) => {
    const { base44 } = context;
    return await base44.functions.invoke('getPerformanceMetrics', {
      period: params.period || 'week'
    });
  },

  'analytics.getSLAStatus': async (params, context) => {
    const { base44 } = context;
    return await base44.functions.invoke('getSLAMonitoring', {});
  }
};

/**
 * Webhook para receber ações do AI Agent
 */
export async function handleAIAgentWebhook(req, base44Client) {
  const payload = await req.json();

  const { action, params, agent_id } = payload;

  if (!action || !AI_AGENT_ACTIONS[action]) {
    throw new Error(`Unknown action: ${action}`);
  }

  const context = {
    base44: base44Client,
    agent_id,
    timestamp: new Date().toISOString()
  };

  const result = await AI_AGENT_ACTIONS[action](params, context);

  return {
    success: true,
    action,
    result,
    timestamp: context.timestamp
  };
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await handleAIAgentWebhook(req, base44);

    return Response.json(result);
  } catch (error) {
    console.error('AI Agent Bridge Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});