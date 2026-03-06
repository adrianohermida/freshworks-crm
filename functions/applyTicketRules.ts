import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { ticket_id, rule_type, action } = body;

    if (!ticket_id || !rule_type || !action) {
      return Response.json({ 
        error: 'Missing required fields: ticket_id, rule_type, action' 
      }, { status: 400 });
    }

    // Validate rule types
    const validRuleTypes = ['auto_assign', 'auto_tag', 'auto_status', 'notify_agent'];
    if (!validRuleTypes.includes(rule_type)) {
      return Response.json({ 
        error: 'Invalid rule_type. Must be one of: auto_assign, auto_tag, auto_status, notify_agent' 
      }, { status: 400 });
    }

    // Simulate rule application (would integrate with actual ticket updates)
    return Response.json({ 
      success: true, 
      result: {
        ticket_id,
        rule_type,
        action,
        applied: true,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});