import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Calcula dias úteis entre duas datas
 * Considerando finais de semana
 */
function calculateWorkDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    // 0 = domingo, 6 = sábado
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

/**
 * Determina status do prazo baseado em dias restantes
 */
function getDeadlineStatus(daysUntil, isCompleted) {
  if (isCompleted) return 'completed';
  if (daysUntil < 0) return 'overdue';
  if (daysUntil <= 3) return 'alert';
  return 'pending';
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { startDate, endDate, deadlineDate } = await req.json();

    if (deadlineDate) {
      // Calcular dias até vencimento
      const today = new Date();
      const deadline = new Date(deadlineDate);
      const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

      return Response.json({
        daysUntil,
        workDaysUntil: calculateWorkDays(today.toISOString().split('T')[0], deadlineDate),
        status: getDeadlineStatus(daysUntil, false)
      });
    }

    if (startDate && endDate) {
      // Calcular dias úteis entre duas datas
      const workDays = calculateWorkDays(startDate, endDate);
      return Response.json({ workDays, startDate, endDate });
    }

    return Response.json({
      error: 'Provide either deadlineDate or (startDate and endDate)'
    }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});