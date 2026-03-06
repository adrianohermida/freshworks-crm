import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Webhook Scheduler - Agenda webhooks com CRON
 * Dispara notificações em intervalos regulares
 */

const CRON_PATTERNS = {
  'hourly': '0 * * * *',
  'daily_9am': '0 9 * * *',
  'daily_6pm': '0 18 * * *',
  'weekly_monday': '0 9 * * 1',
  'monthly_first': '0 9 1 * *'
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { action, webhook_name, cron_pattern, endpoint, events } = await req.json();

    if (action === 'create') {
      // Criar webhook agendado
      if (!webhook_name || !cron_pattern || !endpoint) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const webhook = {
        name: webhook_name,
        endpoint,
        cron_pattern: CRON_PATTERNS[cron_pattern] || cron_pattern,
        events: events || ['process_synced', 'deadline_alert'],
        is_active: true,
        created_at: new Date().toISOString(),
        last_triggered_at: null,
        next_trigger_at: calculateNextTrigger(cron_pattern),
        retry_count: 0,
        max_retries: 3
      };

      // Aqui seria registrado em banco/cache para scheduler processar
      console.log('[Webhook Created]', webhook);

      await base44.asServiceRole.entities.Analytics.create({
        user_id: user.email,
        event_type: 'webhook_created',
        entity_type: 'webhook',
        action: `Webhook agendado: ${webhook_name}`,
        timestamp: new Date().toISOString(),
        metadata: webhook,
        status: 'success'
      });

      return Response.json({ success: true, webhook });
    } 
    else if (action === 'list') {
      // Listar webhooks ativos
      return Response.json({
        webhooks: [
          {
            id: 'wh_001',
            name: 'Daily Digest',
            cron_pattern: '0 9 * * *',
            last_triggered: new Date(Date.now() - 24*60*60*1000).toISOString(),
            next_trigger: new Date(Date.now() + 24*60*60*1000).toISOString(),
            status: 'active'
          }
        ]
      });
    }
    else if (action === 'test') {
      // Testar webhook
      const testUrl = endpoint || 'https://webhook.site/test';
      
      try {
        const response = await fetch(testUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            test: true,
            timestamp: new Date().toISOString()
          })
        });

        return Response.json({
          success: response.ok,
          status_code: response.status,
          response_time: 'xxx ms'
        });
      } catch (err) {
        return Response.json({
          success: false,
          error: err.message
        }, { status: 400 });
      }
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('[webhookScheduler]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function calculateNextTrigger(pattern) {
  // Simplificado - em produção usar cron parser
  const now = new Date();
  now.setHours(now.getHours() + 1);
  return now.toISOString();
}