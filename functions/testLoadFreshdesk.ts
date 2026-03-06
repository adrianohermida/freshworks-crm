import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Teste de carga para validar performance com 100+ tickets
 * Simula criação de múltiplos tickets e mede tempo de resposta
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { ticketCount = 50, testDuration = 30 } = await req.json();

    // Métrica de teste
    const metrics = {
      startTime: Date.now(),
      ticketsCreated: 0,
      ticketsUpdated: 0,
      errors: 0,
      averageResponseTime: 0,
      responseTimes: []
    };

    // Simular criação de múltiplos tickets
    for (let i = 0; i < ticketCount; i++) {
      const iterStart = performance.now();

      try {
        await base44.entities.Ticket.create({
          titulo: `Ticket Teste Carga #${i + 1}`,
          descricao: `Teste de carga - ${new Date().toISOString()}`,
          status: 'aberto',
          prioridade: 'media',
          solicitanteEmail: `teste${i}@example.com`,
          canal: 'api'
        });

        const iterTime = performance.now() - iterStart;
        metrics.responseTimes.push(iterTime);
        metrics.ticketsCreated++;
      } catch (err) {
        metrics.errors++;
        console.error(`Erro ao criar ticket ${i}:`, err.message);
      }

      // Verificar timeout
      if (Date.now() - metrics.startTime > testDuration * 1000) {
        break;
      }
    }

    // Simular atualizações
    const tickets = await base44.entities.Ticket.list();
    for (const ticket of tickets.slice(0, Math.min(10, tickets.length))) {
      const iterStart = performance.now();

      try {
        await base44.entities.Ticket.update(ticket.id, {
          status: 'em_progresso'
        });

        const iterTime = performance.now() - iterStart;
        metrics.responseTimes.push(iterTime);
        metrics.ticketsUpdated++;
      } catch (err) {
        metrics.errors++;
      }
    }

    // Calcular médias
    metrics.averageResponseTime = metrics.responseTimes.length > 0
      ? metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length
      : 0;

    metrics.maxResponseTime = Math.max(...metrics.responseTimes, 0);
    metrics.minResponseTime = Math.min(...metrics.responseTimes, Infinity);
    metrics.totalDuration = Date.now() - metrics.startTime;

    return Response.json({
      success: true,
      metrics,
      status: 'Teste de carga concluído'
    });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});