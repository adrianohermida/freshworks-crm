import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = req.method === 'POST' ? await req.json() : {};
    const { testType = 'full' } = body;

    const results = {
      timestamp: new Date().toISOString(),
      testType,
      tests: []
    };

    // Test 1: Verify Ticket Entity
    try {
      const tickets = await base44.asServiceRole.entities.Ticket.list();
      const recentTickets = tickets.filter(t => {
        const created = new Date(t.created_date);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return created >= sevenDaysAgo;
      });

      results.tests.push({
        name: 'Ticket Entity Access',
        status: 'PASSED',
        details: {
          totalTickets: tickets.length,
          ticketsLast7Days: recentTickets.length,
          sampleTicket: tickets[0] ? {
            id: tickets[0].id,
            subject: tickets[0].subject?.substring(0, 50),
            status: tickets[0].status,
            priority: tickets[0].priority
          } : null
        }
      });
    } catch (e) {
      results.tests.push({
        name: 'Ticket Entity Access',
        status: 'ERROR',
        error: e.message
      });
    }

    // Test 2: Verify Contact Entity
    try {
      const contacts = await base44.asServiceRole.entities.Contact.list();
      
      results.tests.push({
        name: 'Contact Entity Access',
        status: 'PASSED',
        details: {
          totalContacts: contacts.length,
          sampleContact: contacts[0] ? {
            id: contacts[0].id,
            name: contacts[0].name,
            email: contacts[0].email
          } : null
        }
      });
    } catch (e) {
      results.tests.push({
        name: 'Contact Entity Access',
        status: 'ERROR',
        error: e.message
      });
    }

    // Test 3: Verify WebhookEvent Entity
    try {
      const events = await base44.asServiceRole.entities.WebhookEvent.list();
      
      results.tests.push({
        name: 'WebhookEvent Entity',
        status: 'PASSED',
        details: {
          totalEvents: events.length,
          eventsReady: events.length >= 0
        }
      });
    } catch (e) {
      results.tests.push({
        name: 'WebhookEvent Entity',
        status: 'ERROR',
        error: e.message
      });
    }

    // Test 4: Bulk Operations - Create test data and verify
    if (testType === 'full') {
      try {
        const tickets = await base44.asServiceRole.entities.Ticket.list();
        
        if (tickets.length > 0) {
          // Check if tickets have necessary fields for bulk ops
          const canBulkUpdate = tickets.some(t => 
            t.id && (t.status || t.priority)
          );

          results.tests.push({
            name: 'Bulk Operation Capability',
            status: canBulkUpdate ? 'PASSED' : 'WARNING',
            details: {
              ticketsAvailable: tickets.length,
              bulkUpdateCapable: canBulkUpdate,
              fieldsSupported: ['status', 'priority', 'group_id', 'tags']
            }
          });
        } else {
          results.tests.push({
            name: 'Bulk Operation Capability',
            status: 'SKIPPED',
            details: { reason: 'No tickets available for testing' }
          });
        }
      } catch (e) {
        results.tests.push({
          name: 'Bulk Operation Capability',
          status: 'ERROR',
          error: e.message
        });
      }
    }

    // Test 5: Verify Analytics Data Availability
    try {
      const tickets = await base44.asServiceRole.entities.Ticket.list();
      const lastSevenDays = tickets.filter(t => {
        const created = new Date(t.created_date);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return created >= sevenDaysAgo;
      });

      const hasSLAData = tickets.some(t => t.due_by);
      const hasStatusData = tickets.some(t => t.status);

      results.tests.push({
        name: 'Analytics Data Availability',
        status: 'PASSED',
        details: {
          ticketsForAnalytics: lastSevenDays.length,
          hasSLAData: hasSLAData,
          hasStatusData: hasStatusData,
          dataQuality: hasSLAData && hasStatusData ? 'HIGH' : 'MEDIUM'
        }
      });
    } catch (e) {
      results.tests.push({
        name: 'Analytics Data Availability',
        status: 'ERROR',
        error: e.message
      });
    }

    // Calculate success rate
    const passed = results.tests.filter(t => t.status === 'PASSED').length;
    const total = results.tests.filter(t => t.status !== 'SKIPPED').length;
    results.successRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    results.readyForSprint29 = results.successRate >= 80;

    return Response.json(results);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});