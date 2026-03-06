import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      operation_type,
      ticket_ids = [],
      filter_criteria = {},
      target_value,
      scheduled_for = null
    } = await req.json();

    // Se está agendado, criar apenas o registro
    if (scheduled_for) {
      const bulkOp = await base44.entities.BulkOperation.create({
        operation_type,
        status: 'pending',
        ticket_ids,
        filter_criteria,
        target_value,
        executed_by: user.email,
        scheduled_for,
        total_count: ticket_ids.length
      });

      return Response.json({
        success: true,
        scheduled: true,
        operation_id: bulkOp.id,
        message: `Operação agendada para ${scheduled_for}`
      });
    }

    // Executar imediatamente
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const ticketId of ticket_ids) {
      try {
        const ticket = (await base44.entities.Ticket.filter({ id: ticketId }))[0];
        if (!ticket) {
          throw new Error(`Ticket ${ticketId} não encontrado`);
        }

        const updateData = {};

        switch (operation_type) {
          case 'status_change':
            updateData.status = target_value;
            break;
          case 'priority_change':
            updateData.priority = target_value;
            break;
          case 'assignment':
            updateData.assigned_agent_name = target_value;
            break;
          case 'tag_add':
            updateData.tags = [...(ticket.tags || []), target_value];
            break;
          case 'category_change':
            updateData.category = target_value;
            break;
          case 'delete':
            await base44.entities.Ticket.delete(ticketId);
            successCount++;
            continue;
        }

        await base44.entities.Ticket.update(ticketId, updateData);
        successCount++;
      } catch (error) {
        errorCount++;
        errors.push(`${ticketId}: ${error.message}`);
      }
    }

    // Criar registro da operação
    const bulkOp = await base44.entities.BulkOperation.create({
      operation_type,
      status: 'completed',
      ticket_ids,
      filter_criteria,
      target_value,
      executed_by: user.email,
      total_count: ticket_ids.length,
      success_count: successCount,
      error_count: errorCount,
      completed_at: new Date().toISOString(),
      error_log: errors.join('\n')
    });

    return Response.json({
      success: true,
      operation_id: bulkOp.id,
      total: ticket_ids.length,
      success_count: successCount,
      error_count: errorCount,
      message: `${successCount} tickets atualizados com sucesso`
    });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});