import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { process, movements = [] } = await req.json();

    if (!process) {
      return Response.json({ error: 'No process provided' }, { status: 400 });
    }

    // Dynamic import jsPDF
    const { jsPDF } = await import('npm:jspdf@4.0.0');

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Title
    doc.setFontSize(18);
    doc.setTextColor(126, 87, 255); // Primary color
    doc.text('RELATÓRIO DE PROCESSO', margin, yPosition);
    yPosition += 12;

    // Line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Process Header
    doc.setFontSize(11);
    doc.setTextColor(8, 24, 40); // Heading color

    const processData = [
      { label: 'Número CNJ:', value: process.cnj_number },
      { label: 'Título:', value: process.title || 'N/A' },
      { label: 'Tribunal:', value: process.tribunal_nome || 'N/A' },
      { label: 'Classe:', value: process.classe_nome || 'N/A' },
      { label: 'Assunto:', value: process.assunto_nome || 'N/A' },
      { label: 'Status:', value: process.status_repositorio || 'N/A' },
    ];

    processData.forEach(({ label, value }) => {
      doc.setFont(undefined, 'bold');
      doc.text(label, margin, yPosition);
      doc.setFont(undefined, 'normal');
      
      const wrappedText = doc.splitTextToSize(value, contentWidth - 60);
      wrappedText.forEach((line, index) => {
        doc.text(line, margin + 50, yPosition + (index * 5));
      });
      yPosition += Math.max(5, wrappedText.length * 5) + 3;

      if (yPosition > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yPosition = margin;
      }
    });

    // Movements
    if (movements && movements.length > 0) {
      yPosition += 5;
      doc.setFontSize(12);
      doc.setTextColor(126, 87, 255);
      doc.text('HISTÓRICO DE MOVIMENTOS', margin, yPosition);
      yPosition += 8;

      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setTextColor(8, 24, 40);

      movements.slice(0, 50).forEach((movement, index) => {
        if (yPosition > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFont(undefined, 'bold');
        const date = movement.movement_date ? new Date(movement.movement_date).toLocaleDateString('pt-BR') : 'N/A';
        doc.text(`${index + 1}. ${date}`, margin, yPosition);
        yPosition += 5;

        doc.setFont(undefined, 'normal');
        const wrappedText = doc.splitTextToSize(movement.description || 'N/A', contentWidth - 10);
        wrappedText.forEach((line) => {
          doc.text(line, margin + 5, yPosition);
          yPosition += 4;
        });
        yPosition += 2;
      });
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.text(
        `Página ${i} de ${totalPages}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    // Generate PDF bytes
    const pdfBytes = doc.output('arraybuffer');

    // Return as file download
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Processo_${process.cnj_number.replace(/\//g, '_')}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});