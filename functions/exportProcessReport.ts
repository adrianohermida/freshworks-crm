import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import jsPDF from 'npm:jspdf@4.0.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const processes = await base44.entities.Process.list();
    const syncs = await base44.entities.TPUSincronizacao.list();

    const doc = new jsPDF();
    let yPosition = 20;

    // Title
    doc.setFontSize(16);
    doc.text('Relatório de Processos', 20, yPosition);
    yPosition += 10;

    // Header Info
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Total de Processos: ${processes.length}`, 20, yPosition);
    yPosition += 10;

    // Summary Table
    doc.setFontSize(11);
    doc.text('Resumo Geral:', 20, yPosition);
    yPosition += 7;

    const summaryData = [
      ['Métrica', 'Valor'],
      ['Total Processos', processes.length.toString()],
      ['Processos Ativos', processes.filter(p => p.status === 'active').length.toString()],
      ['Sincronizados', processes.filter(p => p.synced_at).length.toString()],
      ['Taxa de Sincronização', `${Math.round((processes.filter(p => p.synced_at).length / processes.length) * 100)}%`],
      ['Sincronizações Sucesso', syncs.filter(s => s.status === 'sucesso').length.toString()],
      ['Sincronizações Erro', syncs.filter(s => s.status === 'erro').length.toString()]
    ];

    doc.autoTable({
      startY: yPosition,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9 }
    });

    yPosition = doc.lastAutoTable.finalY + 10;

    // Recent Processes
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(11);
    doc.text('Processos Recentes:', 20, yPosition);
    yPosition += 7;

    const processData = processes.slice(0, 10).map(p => [
      p.cnj_number,
      p.title?.substring(0, 30) || 'N/A',
      p.status,
      p.movement_count?.toString() || '0'
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [['CNJ', 'Título', 'Status', 'Movimentos']],
      body: processData,
      margin: { left: 20, right: 20 },
      styles: { fontSize: 8 }
    });

    const pdfBytes = doc.output('arraybuffer');

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=relatorio-processos.pdf'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});