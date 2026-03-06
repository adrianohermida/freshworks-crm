import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const testSuite = await req.json();

    const results = {
      passed: 0,
      failed: 0,
      tests: []
    };

    // Test 1: Data integrity
    try {
      const tickets = await base44.asServiceRole.entities.Ticket.list();
      if (tickets.length > 0) {
        results.passed++;
        results.tests.push({ name: 'Ticket list retrieval', status: 'PASS' });
      } else {
        results.failed++;
        results.tests.push({ name: 'Ticket list retrieval', status: 'FAIL', reason: 'No tickets' });
      }
    } catch (e) {
      results.failed++;
      results.tests.push({ name: 'Ticket list retrieval', status: 'FAIL', reason: e.message });
    }

    // Test 2: Contact retrieval
    try {
      const contacts = await base44.asServiceRole.entities.Contact.list();
      results.passed++;
      results.tests.push({ name: 'Contact list retrieval', status: 'PASS' });
    } catch (e) {
      results.failed++;
      results.tests.push({ name: 'Contact list retrieval', status: 'FAIL', reason: e.message });
    }

    // Test 3: Analytics event tracking
    try {
      const analyticsEvents = await base44.asServiceRole.entities.AnalyticsEvent.list();
      results.passed++;
      results.tests.push({ name: 'Analytics event tracking', status: 'PASS' });
    } catch (e) {
      results.failed++;
      results.tests.push({ name: 'Analytics event tracking', status: 'FAIL', reason: e.message });
    }

    // Test 4: Error logging
    try {
      const errorLogs = await base44.asServiceRole.entities.ErrorLog.list();
      results.passed++;
      results.tests.push({ name: 'Error logging', status: 'PASS' });
    } catch (e) {
      results.failed++;
      results.tests.push({ name: 'Error logging', status: 'FAIL', reason: e.message });
    }

    // Test 5: Performance metrics
    try {
      const metrics = await base44.asServiceRole.entities.PerformanceMetrics.list();
      results.passed++;
      results.tests.push({ name: 'Performance metrics', status: 'PASS' });
    } catch (e) {
      results.failed++;
      results.tests.push({ name: 'Performance metrics', status: 'FAIL', reason: e.message });
    }

    // Calcular score
    const total = results.passed + results.failed;
    const score = total > 0 ? (results.passed / total * 100).toFixed(2) : 0;

    return Response.json({
      success: true,
      totalTests: total,
      passed: results.passed,
      failed: results.failed,
      score: `${score}%`,
      tests: results.tests,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('QA tests error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});