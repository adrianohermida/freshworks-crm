import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Webhook Sync Notification
 * Notificações em tempo real para atualizações de movimentos e enriquecimento
 */

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const payload = await req.json();

    // Validate webhook payload
    if (!payload.eventType || !payload.data) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
    }

    const { eventType, data } = payload;

    // Process event types
    switch (eventType) {
      case 'movement_captured':
        return await handleMovementCaptured(base44, user, data);
      case 'movement_deduplicated':
        return await handleMovementDeduplicated(base44, user, data);
      case 'process_enriched':
        return await handleProcessEnriched(base44, user, data);
      case 'sync_completed':
        return await handleSyncCompleted(base44, user, data);
      default:
        return new Response(JSON.stringify({ error: 'Unknown event type' }), { status: 400 });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});

async function handleMovementCaptured(base44, user, data) {
  const notification = {
    user_id: user.email,
    type: 'new_movement',
    title: 'Novo Movimento Capturado',
    message: `Movimento ${data.movement_code} capturado para processo ${data.process_cnj}`,
    process_id: data.process_cnj,
    data: {
      movement_code: data.movement_code,
      movement_name: data.movement_name,
      timestamp: new Date().toISOString()
    },
    read: false,
    timestamp: new Date().toISOString()
  };

  await base44.asServiceRole.entities.Notification.create(notification);

  return new Response(JSON.stringify({
    status: 'success',
    message: 'Movement notification created',
    notification_id: notification.user_id
  }), { status: 200 });
}

async function handleMovementDeduplicated(base44, user, data) {
  const notification = {
    user_id: user.email,
    type: 'process_synced',
    title: 'Movimento Duplicado Detectado',
    message: `Duplicata removida: ${data.movement_name} (${data.movement_code})`,
    process_id: data.process_cnj,
    data: {
      movement_hash: data.hash,
      duplicate_of: data.original_movement_id,
      timestamp: new Date().toISOString()
    },
    read: false,
    timestamp: new Date().toISOString()
  };

  await base44.asServiceRole.entities.Notification.create(notification);

  return new Response(JSON.stringify({
    status: 'success',
    message: 'Deduplication notification created'
  }), { status: 200 });
}

async function handleProcessEnriched(base44, user, data) {
  const notification = {
    user_id: user.email,
    type: 'process_synced',
    title: 'Processo Enriquecido',
    message: `Processo ${data.process_cnj} enriquecido com confiança ${data.confidence}%`,
    process_id: data.process_cnj,
    data: {
      class: data.class,
      subject: data.subject,
      confidence: data.confidence,
      timestamp: new Date().toISOString()
    },
    read: false,
    timestamp: new Date().toISOString()
  };

  await base44.asServiceRole.entities.Notification.create(notification);

  return new Response(JSON.stringify({
    status: 'success',
    message: 'Enrichment notification created'
  }), { status: 200 });
}

async function handleSyncCompleted(base44, user, data) {
  const notification = {
    user_id: user.email,
    type: 'system',
    title: 'Sincronização Concluída',
    message: `${data.total} movimentos sincronizados. ${data.duplicates} duplicatas removidas.`,
    data: {
      total_movements: data.total,
      duplicates_removed: data.duplicates,
      new_records: data.new,
      timestamp: new Date().toISOString(),
      duration_ms: data.duration
    },
    read: false,
    timestamp: new Date().toISOString()
  };

  await base44.asServiceRole.entities.Notification.create(notification);

  return new Response(JSON.stringify({
    status: 'success',
    message: 'Sync completion notification created'
  }), { status: 200 });
}