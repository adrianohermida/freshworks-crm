import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const FRESHDESK_API_KEY = Deno.env.get("FRESHDESK_API_KEY");
const FRESHDESK_DOMAIN = Deno.env.get("FRESHDESK_DOMAIN");
const FRESHDESK_API_URL = `https://${FRESHDESK_DOMAIN}/api/v2`;

async function fetchFreshDeskAgents() {
  const response = await fetch(`${FRESHDESK_API_URL}/agents?per_page=100`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${btoa(FRESHDESK_API_KEY + ':X')}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) throw new Error(`Freshdesk API error: ${response.status}`);
  const data = await response.json();
  return data.agents || [];
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const tenant_id = user.email.split('@')[1];
    const agents = await fetchFreshDeskAgents();
    
    let syncedCount = 0;
    let errorCount = 0;

    for (const agent of agents) {
      try {
        await base44.asServiceRole.entities.FreshDeskAgent.create({
          freshdesk_id: agent.id?.toString(),
          name: agent.name || '',
          email: agent.email || '',
          phone: agent.mobile || '',
          role: (agent.role === 'admin' ? 'admin' : agent.role === 'supervisor' ? 'team_lead' : 'support_agent'),
          status: agent.available ? 'available' : 'offline',
          rating: agent.rating || 0,
          tickets_assigned: agent.tickets?.assigned_count || 0,
          tickets_resolved: agent.tickets?.resolved_count || 0,
          skills: agent.skill_ids || [],
          groups: agent.group_ids || [],
          last_synced_at: new Date().toISOString(),
          tenant_id
        });
        syncedCount++;
      } catch (error) {
        errorCount++;
      }
    }

    return Response.json({
      success: true,
      synced: syncedCount,
      errors: errorCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});