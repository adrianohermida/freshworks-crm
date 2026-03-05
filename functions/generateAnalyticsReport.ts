import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import jsPDF from 'npm:jspdf@4.0.0';

/**
 * Gera relatório de analytics em PDF
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
      format = 'pdf'
    } = await req.json();

    const start = new Date(startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const end = new Date(endDate || new Date());

    // Buscar eventos
    const query = {
      timestamp: {
        $gte: start.toISOString(),
        $lte: end.toISOString()
      }
    };

    if (user.role !== 'admin') query.user_id = user.email;

    const events = await base44.entities.Analytics.filter(query, '-timestamp', 500);

    if (format === 'json') {
      return Response.json({
        success: true,
        report: {
          period: { start: start.toISOString(), end: end.toISOString() },
          totalEvents: events.length,
          events
        }
      });
    }

    // Gerar PDF
    const doc = new jsPDF();
    let yPosition = 20;

    // Título
    doc.setFontSize(18);
    doc.text('Relatório de Analytics', 20, yPosition);
    yPosition += 15;

    // Período
    doc.setFontSize(12);
    doc.text(`Período: ${start.toLocaleDateString('pt-BR')} a ${end.toLocaleDateString('pt-BR')}`, 20, yPosition);
    yPosition += 10;

    // Sumário
    doc.setFontSize(14);
    doc.text('Sumário', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.text(`Total de Eventos: ${events.length}`, 20, yPosition);
    yPosition += 7;

    // Contagem por tipo
    const typeCount = {};
    events.forEach(e => {
      typeCount[e.event_type] = (typeCount[e.event_type] || 0) + 1;
    });

    doc.text('Eventos por Tipo:', 20, yPosition);
    yPosition += 6;

    Object.entries(typeCount).forEach(([type, count]) => {
      doc.text(`  • ${type}: ${count}`, 25, yPosition);
      yPosition += 5;
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });

    // Contagem por entidade
    yPosition += 5;
    const entityCount = {};
    events.forEach(e => {
      entityCount[e.entity_type] = (entityCount[e.entity_type] || 0) + 1;
    });

    doc.text('Eventos por Entidade:', 20, yPosition);
    yPosition += 6;

    Object.entries(entityCount).forEach(([type, count]) => {
      doc.text(`  • ${type}: ${count}`, 25, yPosition);
      yPosition += 5;
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });

    const pdfBytes = doc.output('arraybuffer');

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=analytics-report.pdf'
      }
    });
  } catch (error) {
    console.error('[GenerateAnalyticsReport] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});