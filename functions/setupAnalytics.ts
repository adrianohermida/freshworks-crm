import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { eventName, properties = {} } = await req.json();

    if (!eventName) {
      return Response.json({ error: 'Event name required' }, { status: 400 });
    }

    // Track evento com Base44 Analytics
    await base44.analytics.track({
      eventName,
      properties: {
        ...properties,
        userId: user.id,
        userEmail: user.email,
        timestamp: new Date().toISOString(),
        userAgent: req.headers.get('user-agent'),
        referer: req.headers.get('referer')
      }
    });

    // Armazenar em AnalyticsEvent entity para histórico
    const analyticsEvent = {
      event_name: eventName,
      user_email: user.email,
      properties: JSON.stringify(properties),
      user_agent: req.headers.get('user-agent'),
      referer: req.headers.get('referer'),
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip'),
      timestamp: new Date().toISOString()
    };

    try {
      await base44.asServiceRole.entities.AnalyticsEvent.create(analyticsEvent);
    } catch (e) {
      console.log('Analytics event creation skipped:', e.message);
    }

    return Response.json({
      success: true,
      event: eventName,
      recorded: true
    });

  } catch (error) {
    console.error('Analytics setup error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});