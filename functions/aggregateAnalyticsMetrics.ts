import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Agrega métricas de analytics por período
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      startDate,
      endDate,
      eventType,
      entityType
    } = await req.json();

    const start = new Date(startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const end = new Date(endDate || new Date());

    // Construir query filter
    const query = {
      timestamp: {
        $gte: start.toISOString(),
        $lte: end.toISOString()
      }
    };

    if (eventType) query.event_type = eventType;
    if (entityType) query.entity_type = entityType;
    if (user.role !== 'admin') query.user_id = user.email;

    const events = await base44.entities.Analytics.filter(query, '-timestamp', 1000);

    // Agregar dados
    const metrics = {
      totalEvents: events.length,
      period: { start: start.toISOString(), end: end.toISOString() },
      eventsByType: {},
      eventsByEntity: {},
      successRate: 0,
      averageValue: 0,
      topActions: []
    };

    let successCount = 0;
    let totalValue = 0;
    const actionCounts = {};

    events.forEach(event => {
      // Por tipo de evento
      metrics.eventsByType[event.event_type] = (metrics.eventsByType[event.event_type] || 0) + 1;

      // Por tipo de entidade
      metrics.eventsByEntity[event.entity_type] = (metrics.eventsByEntity[event.entity_type] || 0) + 1;

      // Taxa de sucesso
      if (event.status === 'success') successCount++;

      // Média de valores
      if (event.value) totalValue += event.value;

      // Top actions
      if (event.action) {
        actionCounts[event.action] = (actionCounts[event.action] || 0) + 1;
      }
    });

    // Calcular métricas finais
    metrics.successRate = metrics.totalEvents > 0 
      ? ((successCount / metrics.totalEvents) * 100).toFixed(2) 
      : 0;

    metrics.averageValue = totalValue > 0 
      ? (totalValue / events.filter(e => e.value).length).toFixed(2) 
      : 0;

    // Top 5 actions
    metrics.topActions = Object.entries(actionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([action, count]) => ({ action, count }));

    return Response.json({
      success: true,
      metrics,
      rawEvents: events.slice(0, 100) // Últimos 100 eventos
    });
  } catch (error) {
    console.error('[AggregateAnalyticsMetrics] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});