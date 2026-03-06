import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import jsPDF from 'npm:jspdf@4.0.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const deadlines = await base44.entities.Deadline.list();
    const today = new Date();

    const doc = new jsPDF();
    let yPosition = 20;

    // Title
    doc.setFontSize(16);
    doc.text('Relatório de Prazos', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Total de Prazos: ${deadlines.length}`, 20, yPosition);
    yPosition += 10;

    // Summary
    const completed = deadlines.filter(d => d.status === 'completed').length;
    const pending = deadlines.filter(d => d.status === 'pending').length;
    const overdue = deadlines.filter(d => new Date(d.due_date) < today && d.status !== 'completed').length;

    doc.setFontSize(11);
    doc.text('Resumo Geral:', 20, yPosition);
    yPosition += 7;

    const summaryData = [
      ['Métrica', 'Valor'],
      ['Total Prazos', deadlines.length.toString()],
      ['Concluídos', completed.toString()],
      ['Pendentes', pending.toString()],
      ['Vencidos', overdue.toString()],
      ['Taxa de Conclusão', `${Math.round((completed / deadlines.length) * 100)}%`]
    ];

    doc.autoTable({
      startY: yPosition,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9 }
    });

    yPosition = doc.lastAutoTable.finalY + 10;

    // Overdue Deadlines
    const overdueList = deadlines.filter(d => new Date(d.due_date) < today && d.status !== 'completed');
    if (overdueList.length > 0) {
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(11);
      doc.setTextColor(220, 38, 38);
      doc.text('⚠️ Prazos Vencidos:', 20, yPosition);
      doc.setTextColor(0, 0, 0);
      yPosition += 7;

      const overdueData = overdueList.slice(0, 10).map(d => [
        new Date(d.due_date).toLocaleDateString('pt-BR'),
        d.description?.substring(0, 30) || 'N/A',
        d.process_id || 'N/A'
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [['Data Vencimento', 'Descrição', 'Processo']],
        body: overdueData,
        margin: { left: 20, right: 20 },
        styles: { fontSize: 8 }
      });
    }

    const pdfBytes = doc.output('arraybuffer');

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=relatorio-prazos.pdf'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});