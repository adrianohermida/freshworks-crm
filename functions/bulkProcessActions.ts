import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Bulk Process Actions - Executar ações em múltiplos processos
 * Sincronizar, exportar, deletar em batch
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, process_ids } = await req.json();

    if (!process_ids || process_ids.length === 0) {
      return Response.json({ error: 'No processes selected' }, { status: 400 });
    }

    let result = { success: true, action, count: process_ids.length };

    if (action === 'sync') {
      // Sincronizar múltiplos processos
      result.synced = [];
      result.failed = [];

      for (const id of process_ids) {
        try {
          const syncResult = await base44.functions.invoke('sincronizarProcessoDataJud', {
            process_id: id
          });
          result.synced.push(id);
        } catch (err) {
          result.failed.push({ id, error: err.message });
        }
      }

      result.status = `${result.synced.length} sincronizados, ${result.failed.length} falhados`;
    }
    else if (action === 'export') {
      // Exportar múltiplos processos como CSV
      const processes = await base44.entities.Process.filter({
        id: { $in: process_ids }
      });

      const csv = generateCSV(processes);
      result.csv_generated = true;
      result.row_count = processes.length;
      result.download_url = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    }
    else if (action === 'delete') {
      // Deletar múltiplos processos (apenas se user é admin)
      if (user.role !== 'admin') {
        return Response.json({ error: 'Admin access required' }, { status: 403 });
      }

      result.deleted = [];
      for (const id of process_ids) {
        try {
          await base44.entities.Process.delete(id);
          result.deleted.push(id);
        } catch (err) {
          result.failed = result.failed || [];
          result.failed.push({ id, error: err.message });
        }
      }
      result.status = `${result.deleted.length} deletados`;
    }
    else {
      return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log em Analytics
    await base44.asServiceRole.entities.Analytics.create({
      user_id: user.email,
      event_type: 'bulk_action',
      entity_type: 'processes',
      action: `Bulk ${action}: ${process_ids.length} items`,
      timestamp: new Date().toISOString(),
      value: process_ids.length,
      metadata: result,
      status: 'success'
    });

    return Response.json(result);

  } catch (error) {
    console.error('[bulkProcessActions]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function generateCSV(processes) {
  const headers = ['CNJ Number', 'Title', 'Status', 'Movements', 'Last Sync', 'Tribunal'];
  const rows = processes.map(p => [
    p.cnj_number,
    p.title,
    p.status,
    p.movement_count || 0,
    p.synced_at || 'Never',
    p.parsed_tribunal || 'N/A'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}