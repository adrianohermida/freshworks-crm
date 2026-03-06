import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Exporta processo e movimentos para PDF
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { processId } = await req.json();

    if (!processId) {
      return Response.json({ error: 'processId is required' }, { status: 400 });
    }

    // Buscar processo
    const process = await base44.entities.Process.filter(
      { id: processId },
      null,
      1
    );

    if (process.length === 0) {
      return Response.json({ error: 'Process not found' }, { status: 404 });
    }

    const proc = process[0];

    // Buscar movimentos
    const movements = await base44.entities.ProcessMovement.filter(
      { process_id: processId },
      'movement_date',
      100
    );

    // Buscar prazos
    const deadlines = await base44.entities.Deadline.filter(
      { process_id: processId },
      'deadline_date',
      100
    );

    // Buscar publicações
    const publications = await base44.entities.Publication.filter(
      { process_id: processId },
      '-publication_date',
      100
    );

    // Gerar HTML
    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 900px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; border-bottom: 2px solid #00bcd4; padding-bottom: 10px; }
    h2 { color: #666; margin-top: 30px; }
    .info { background: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background: #f5f5f5; font-weight: bold; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 3px; font-size: 12px; }
    .badge-active { background: #e8f5e9; color: #2e7d32; }
    .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📋 Relatório de Processo</h1>
    
    <div class="info">
      <strong>CNJ:</strong> ${proc.cnj_number}<br>
      <strong>Título:</strong> ${proc.title || 'N/A'}<br>
      <strong>Status:</strong> <span class="badge badge-active">${proc.status}</span><br>
      <strong>Última Sincronização:</strong> ${new Date(proc.synced_at).toLocaleDateString('pt-BR')}
    </div>

    ${movements.length > 0 ? `
    <h2>Movimentos (${movements.length})</h2>
    <table>
      <tr>
        <th>Data</th>
        <th>Tipo</th>
        <th>Descrição</th>
      </tr>
      ${movements.map(m => `
      <tr>
        <td>${new Date(m.movement_date).toLocaleDateString('pt-BR')}</td>
        <td>${m.movement_type}</td>
        <td>${m.description}</td>
      </tr>
      `).join('')}
    </table>
    ` : ''}

    ${deadlines.length > 0 ? `
    <h2>Prazos (${deadlines.length})</h2>
    <table>
      <tr>
        <th>Título</th>
        <th>Vencimento</th>
        <th>Prioridade</th>
        <th>Status</th>
      </tr>
      ${deadlines.map(d => `
      <tr>
        <td>${d.title}</td>
        <td>${new Date(d.deadline_date).toLocaleDateString('pt-BR')}</td>
        <td>${d.priority}</td>
        <td><span class="badge">${d.status}</span></td>
      </tr>
      `).join('')}
    </table>
    ` : ''}

    ${publications.length > 0 ? `
    <h2>Publicações (${publications.length})</h2>
    <table>
      <tr>
        <th>Título</th>
        <th>Data</th>
        <th>Diário</th>
        <th>Status</th>
      </tr>
      ${publications.map(p => `
      <tr>
        <td>${p.title}</td>
        <td>${new Date(p.publication_date).toLocaleDateString('pt-BR')}</td>
        <td>${p.dj}</td>
        <td><span class="badge">${p.status}</span></td>
      </tr>
      `).join('')}
    </table>
    ` : ''}

    <div class="footer">
      <p>Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} via DataJud</p>
    </div>
  </div>
</body>
</html>
    `;

    // Converter para PDF (seria feito no frontend com html2pdf)
    return Response.json({
      html,
      filename: `processo_${proc.cnj_number.replace(/\D/g, '')}.pdf`
    });
  } catch (error) {
    console.error('[ExportProcessToPDF] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});