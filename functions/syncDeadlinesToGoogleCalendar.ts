import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Sync Deadlines to Google Calendar
 * Triggered by deadline creation/update in the database
 * Creates calendar events for all deadlines
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { accessToken, connectionConfig } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    // Fetch user's deadlines
    const deadlines = await base44.entities.Deadline.filter({ created_by: user.email }, '-deadline_date', 100);

    let syncedCount = 0;
    const errors = [];

    for (const deadline of deadlines) {
      try {
        // Check if event already exists
        if (deadline.calendar_event_id) {
          continue; // Skip if already synced
        }

        // Create calendar event
        const eventPayload = {
          summary: `[Prazo] ${deadline.title}`,
          description: deadline.notes || `Processo: ${deadline.process_id}\nPrioridade: ${deadline.priority}`,
          start: {
            date: deadline.deadline_date,
            timeZone: 'America/Manaus',
          },
          end: {
            date: new Date(new Date(deadline.deadline_date).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            timeZone: 'America/Manaus',
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 }, // 1 day before
              { method: 'popup', minutes: 60 }, // 1 hour before
            ],
          },
          colorId: deadline.priority === 'high' ? '11' : deadline.priority === 'medium' ? '5' : '2', // Red, Orange, Green
        };

        const response = await fetch(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventPayload),
          }
        );

        if (!response.ok) {
          throw new Error(`Google Calendar API error: ${response.status}`);
        }

        const eventData = await response.json();

        // Update deadline with calendar event ID
        await base44.entities.Deadline.update(deadline.id, {
          calendar_event_id: eventData.id,
        });

        syncedCount++;
      } catch (error) {
        errors.push(`Deadline ${deadline.id}: ${error.message}`);
      }
    }

    return Response.json({
      success: true,
      syncedCount,
      totalDeadlines: deadlines.length,
      errors: errors.length > 0 ? errors : null,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});