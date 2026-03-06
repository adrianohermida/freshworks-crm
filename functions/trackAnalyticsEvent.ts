import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Registra evento de analytics
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      event_type,
      entity_type,
      entity_id,
      action,
      value,
      metadata,
      status = 'success'
    } = await req.json();

    if (!event_type || !entity_type) {
      return Response.json(
        { error: 'event_type and entity_type are required' },
        { status: 400 }
      );
    }

    const event = await base44.entities.Analytics.create({
      user_id: user.email,
      event_type,
      entity_type,
      entity_id,
      action,
      value,
      metadata,
      status,
      timestamp: new Date().toISOString()
    });

    return Response.json({
      success: true,
      eventId: event.id
    });
  } catch (error) {
    console.error('[TrackAnalyticsEvent] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});