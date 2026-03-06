import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função scheduled ou entity automation
 * Atualiza status de prazos baseado em data de vencimento
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch todos os prazos não-completos
    const deadlines = await base44.entities.Deadline.filter(
      { status: { $ne: 'completed' } },
      '-deadline_date',
      1000
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let updated = 0;

    // Atualizar status de cada prazo
    for (const deadline of deadlines) {
      const deadlineDate = new Date(deadline.deadline_date);
      deadlineDate.setHours(0, 0, 0, 0);
      
      const daysUntil = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
      
      let newStatus = 'pending';
      if (daysUntil < 0) {
        newStatus = 'overdue';
      } else if (daysUntil <= 3) {
        newStatus = 'alert';
      }

      if (newStatus !== deadline.status) {
        await base44.entities.Deadline.update(deadline.id, {
          status: newStatus,
          days_until: daysUntil
        });
        updated++;
      }
    }

    return Response.json({
      message: `Atualizado ${updated} prazos`,
      processed: deadlines.length,
      updated
    });
  } catch (error) {
    console.error('[DeadlineAlerts] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});