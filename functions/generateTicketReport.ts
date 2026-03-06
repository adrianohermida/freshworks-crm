import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { jsPDF } from 'npm:jspdf@4.0.0';
import 'npm:jspdf-autotable@3.8.1';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { dateFrom, dateTo } = await req.json();

    // Get all tickets
    const allTickets = await base44.entities.Ticket.list();
    
    // Filter by date if provided
    const tickets = allTickets.filter(t => {
      const createdDate = new Date(t.created_date);
      if (dateFrom && createdDate < new Date(dateFrom)) return false;
      if (dateTo && createdDate > new Date(dateTo)) return false;
      return true;
    });

    // Calculate metrics
    const metrics = {
      total: tickets.length,
      byStatus: {},
      byPriority: {},
      byAgent: {},
      avgResolutionTime: 0,
      sentimentBreakdown: {},
      totalResolved: 0
    };

    tickets.forEach(ticket => {
      // By status
      metrics.byStatus[ticket.status] = (metrics.byStatus[ticket.status] || 0) + 1;
      
      // By priority
      metrics.byPriority[ticket.priority] = (metrics.byPriority[ticket.priority] || 0) + 1;
      
      // By agent
      if (ticket.assigned_agent_name) {
        metrics.byAgent[ticket.assigned_agent_name] = (metrics.byAgent[ticket.assigned_agent_name] || 0) + 1;
      }

      // Sentiment
      if (ticket.ai_sentiment) {
        metrics.sentimentBreakdown[ticket.ai_sentiment] = (metrics.sentimentBreakdown[ticket.ai_sentiment] || 0) + 1;
      }

      // Resolution count
      if (ticket.status === 'resolved' || ticket.status === 'closed') {
        metrics.totalResolved++;
      }
    });

    metrics.resolutionRate = ((metrics.totalResolved / metrics.total) * 100).toFixed(1);

    // Create PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    doc.setFontSize(24);
    doc.text('Relatório de Tickets', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    doc.setFontSize(10);
    doc.setTextColor(100);
    const dateRange = dateFrom && dateTo 
      ? `${new Date(dateFrom).toLocaleDateString('pt-BR')} a ${new Date(dateTo).toLocaleDateString('pt-BR')}`
      : 'Período completo';
    doc.text(`Período: ${dateRange}`, pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 15;
    doc.setTextColor(0);

    // Key Metrics
    doc.setFontSize(14);
    doc.text('Métricas Principais', 20, yPosition);
    yPosition += 10;

    const metricsData = [
      ['Métrica', 'Valor'],
      ['Total de Tickets', metrics.total.toString()],
      ['Tickets Resolvidos', metrics.totalResolved.toString()],
      ['Taxa de Resolução', `${metrics.resolutionRate}%`],
      ['Abertos', metrics.byStatus['open']?.toString() || '0'],
      ['Pendentes', metrics.byStatus['pending']?.toString() || '0'],
      ['Fechados', metrics.byStatus['closed']?.toString() || '0']
    ];

    doc.autoTable({
      startY: yPosition,
      head: [metricsData[0]],
      body: metricsData.slice(1),
      margin: { left: 20, right: 20 },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [32, 201, 201], textColor: 255 }
    });

    yPosition = doc.lastAutoTable.finalY + 15;

    // Status Breakdown
    doc.setFontSize(14);
    doc.text('Distribuição por Status', 20, yPosition);
    yPosition += 10;

    const statusData = [
      ['Status', 'Quantidade', '%'],
      ...Object.entries(metrics.byStatus).map(([status, count]) => [
        status.charAt(0).toUpperCase() + status.slice(1),
        count.toString(),
        ((count / metrics.total) * 100).toFixed(1) + '%'
      ])
    ];

    doc.autoTable({
      startY: yPosition,
      head: [statusData[0]],
      body: statusData.slice(1),
      margin: { left: 20, right: 20 },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [32, 201, 201], textColor: 255 }
    });

    yPosition = doc.lastAutoTable.finalY + 15;

    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // Priority Breakdown
    doc.setFontSize(14);
    doc.text('Distribuição por Prioridade', 20, yPosition);
    yPosition += 10;

    const priorityData = [
      ['Prioridade', 'Quantidade', '%'],
      ...Object.entries(metrics.byPriority).map(([priority, count]) => [
        priority.charAt(0).toUpperCase() + priority.slice(1),
        count.toString(),
        ((count / metrics.total) * 100).toFixed(1) + '%'
      ])
    ];

    doc.autoTable({
      startY: yPosition,
      head: [priorityData[0]],
      body: priorityData.slice(1),
      margin: { left: 20, right: 20 },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [32, 201, 201], textColor: 255 }
    });

    yPosition = doc.lastAutoTable.finalY + 15;

    // Agent Performance
    if (Object.keys(metrics.byAgent).length > 0) {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text('Desempenho por Agente', 20, yPosition);
      yPosition += 10;

      const agentData = [
        ['Agente', 'Tickets Atribuídos', '%'],
        ...Object.entries(metrics.byAgent).map(([agent, count]) => [
          agent,
          count.toString(),
          ((count / metrics.total) * 100).toFixed(1) + '%'
        ])
      ];

      doc.autoTable({
        startY: yPosition,
        head: [agentData[0]],
        body: agentData.slice(1),
        margin: { left: 20, right: 20 },
        styles: { fontSize: 10 },
        headStyles: { fillColor: [32, 201, 201], textColor: 255 }
      });

      yPosition = doc.lastAutoTable.finalY + 15;
    }

    // Sentiment Breakdown
    if (Object.keys(metrics.sentimentBreakdown).length > 0) {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text('Análise de Sentimento', 20, yPosition);
      yPosition += 10;

      const sentimentData = [
        ['Sentimento', 'Quantidade', '%'],
        ...Object.entries(metrics.sentimentBreakdown).map(([sentiment, count]) => [
          sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
          count.toString(),
          ((count / metrics.total) * 100).toFixed(1) + '%'
        ])
      ];

      doc.autoTable({
        startY: yPosition,
        head: [sentimentData[0]],
        body: sentimentData.slice(1),
        margin: { left: 20, right: 20 },
        styles: { fontSize: 10 },
        headStyles: { fillColor: [32, 201, 201], textColor: 255 }
      });
    }

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Página ${i} de ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    const pdfBytes = doc.output('arraybuffer');

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=relatorio-tickets.pdf'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});