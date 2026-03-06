import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Automation Engine - Gerenciador de Sincronizações
 * Orquestra sincronizações automáticas com retry inteligente
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { action, triggerType, tribunals = 'all', time, retryPolicy, scheduleId } = await req.json();

    // SCHEDULE SYNC - Agendar sincronização
    if (action === 'schedule_sync') {
      const config = {
        id: crypto.randomUUID(),
        triggerType, // 'daily', 'hourly', 'on_demand'
        tribunals: tribunals === 'all' ? null : tribunals,
        scheduledTime: time || '02:00',
        retryPolicy: retryPolicy || { maxRetries: 3, backoffMultiplier: 2, initialDelay: 1000 },
        status: 'active',
        createdAt: new Date().toISOString(),
        createdBy: user.email
      };

      // Salvar agendamento
      await base44.asServiceRole.entities.Analytics.create({
        user_id: user.email,
        event_type: 'sync_scheduled',
        entity_type: 'system',
        action: `Agendou sincronização ${triggerType} às ${time}`,
        timestamp: new Date().toISOString(),
        metadata: config,
        status: 'success'
      });

      return Response.json({
        success: true,
        action: 'schedule_sync',
        scheduleId: config.id,
        message: `Sincronização agendada para ${time} diariamente`
      });
    }

    // CANCEL SYNC - Cancelar agendamento
    if (action === 'cancel_sync') {
      await base44.asServiceRole.entities.Analytics.create({
        user_id: user.email,
        event_type: 'sync_cancelled',
        entity_type: 'system',
        action: `Cancelou agendamento ${scheduleId}`,
        timestamp: new Date().toISOString(),
        metadata: { scheduleId },
        status: 'success'
      });

      return Response.json({
        success: true,
        action: 'cancel_sync',
        message: 'Agendamento cancelado com sucesso'
      });
    }

    // EXECUTE SYNC - Executar sincronização com retry
    if (action === 'execute_sync') {
      const courts = tribunals === 'all' 
        ? await base44.asServiceRole.entities.Court.list() 
        : [tribunals];

      const results = [];

      for (const court of courts) {
        let lastError = null;
        let success = false;

        // Retry loop
        for (let attempt = 0; attempt <= (retryPolicy?.maxRetries || 3); attempt++) {
          try {
            const startTime = performance.now();
            
            // Chamar sincronização
            const syncRes = await base44.asServiceRole.functions.invoke('consultarDataJud', {
              tribunalAlias: court.alias,
              action: 'sync_all'
            });

            const responseTime = Math.round(performance.now() - startTime);

            if (syncRes.data?.success) {
              success = true;
              results.push({
                tribunal: court.name,
                status: 'success',
                attempt: attempt + 1,
                responseTime,
                recordsSync: syncRes.data?.recordCount || 0
              });
              break;
            }
          } catch (error) {
            lastError = error;

            // Backoff exponencial
            if (attempt < (retryPolicy?.maxRetries || 3)) {
              const delay = (retryPolicy?.initialDelay || 1000) * 
                           Math.pow(retryPolicy?.backoffMultiplier || 2, attempt);
              await new Promise(r => setTimeout(r, delay));
            }
          }
        }

        if (!success && lastError) {
          results.push({
            tribunal: court.name,
            status: 'failed',
            error: lastError.message,
            attempts: (retryPolicy?.maxRetries || 3) + 1
          });
        }
      }

      // Log do resultado
      const successCount = results.filter(r => r.status === 'success').length;
      await base44.asServiceRole.entities.Analytics.create({
        user_id: user.email,
        event_type: 'process_synced',
        entity_type: 'system',
        action: `Sincronização automática: ${successCount}/${results.length} tribunais`,
        timestamp: new Date().toISOString(),
        metadata: { results, retryPolicy },
        status: successCount === results.length ? 'success' : 'error'
      });

      return Response.json({
        success: successCount === results.length,
        action: 'execute_sync',
        results,
        summary: {
          total: results.length,
          success: successCount,
          failed: results.length - successCount
        }
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[automationEngine]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});