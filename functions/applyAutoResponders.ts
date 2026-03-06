import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { ticket_id, auto_responder_id } = body;

    if (!ticket_id || !auto_responder_id) {
      return Response.json({ 
        error: 'Missing required fields: ticket_id, auto_responder_id' 
      }, { status: 400 });
    }

    // Simulate auto responder application
    return Response.json({ 
      success: true, 
      result: {
        ticket_id,
        auto_responder_id,
        response_sent: true,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});