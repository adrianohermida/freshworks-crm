import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import jsPDF from 'npm:jspdf@4.0.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tipo = 'completo', periodo = 30 } = await req.json();

    // Buscar dados
    const processos = await base44.entities.ProcessoAdvise.list('-dataSincronizacao', 100);
    const prazos = await base44.entities.PrazoProcessual.list('-dataVencimento', 100);
    const alertas = await base44.entities.Alerta.list('-dataOcorrencia', 100);
    const movimentos = await base44.entities.MovimentoProcesso.list('-dataMovimento', 50);

    // Filtrar por período
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - periodo);

    const filtrados = {
      processos: processos.filter(p => new Date(p.dataSincronizacao) >= dataLimite),
      prazos: prazos.filter(p => new Date(p.dataVencimento) >= dataLimite),
      alertas: alertas.filter(a => new Date(a.dataOcorrencia) >= dataLimite),
      movimentos: movimentos.filter(m => new Date(m.dataMovimento) >= dataLimite)
    };

    // Criar PDF
    const doc = new jsPDF();
    let yPos = 20;

    // Header
    doc.setFontSize(20);
    doc.text('Relatório Legal - Processos & Alertas', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, yPos);
    doc.text(`Período: Últimos ${periodo} dias`, 20, yPos + 5);
    doc.text(`Por: ${user.full_name || user.email}`, 20, yPos + 10);
    doc.setTextColor(0, 0, 0);
    yPos += 25;

    // Seção: KPIs
    if (tipo === 'completo' || tipo === 'resumo') {
      doc.setFontSize(14);
      doc.text('Indicadores Principais', 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      const processosAtivos = processos.filter(p => p.statusProcesso === 'ativo').length;
      const prazosVencidos = prazos.filter(p => p.status === 'vencido').length;
      const alertasCriticos = alertas.filter(a => a.severidade === 'critica').length;

      const kpis = [
        `• Processos Ativos: ${processosAtivos} de ${processos.length}`,
        `• Prazos Vencidos: ${prazosVencidos}`,
        `• Alertas Críticos: ${alertasCriticos}`,
        `• Movimentações (período): ${filtrados.movimentos.length}`
      ];

      kpis.forEach((kpi, idx) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(kpi, 20, yPos);
        yPos += 8;
      });
      yPos += 5;
    }

    // Seção: Processos
    if (tipo === 'completo' || tipo === 'processos') {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.text('Processos', 20, yPos);
      yPos += 8;

      doc.setFontSize(9);
      const processosAtivos = processos.filter(p => p.statusProcesso === 'ativo').slice(0, 5);

      processosAtivos.forEach((p, idx) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        doc.text(`${idx + 1}. ${p.numeroProcesso}`, 20, yPos);
        doc.setTextColor(128, 128, 128);
        doc.setFontSize(8);
        doc.text(`Tribunal: ${p.tribunal} | Status: ${p.statusProcesso}`, 20, yPos + 4);
        if (p.dataUltimo) {
          doc.text(`Último movimento: ${new Date(p.dataUltimo).toLocaleDateString('pt-BR')}`, 20, yPos + 8);
        }
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        yPos += 14;
      });
      yPos += 5;
    }

    // Seção: Prazos
    if (tipo === 'completo' || tipo === 'prazos') {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.text('Prazos Relevantes', 20, yPos);
      yPos += 8;

      doc.setFontSize(9);
      const prazosRelevantes = prazos
        .filter(p => p.status !== 'cumprido')
        .slice(0, 5);

      prazosRelevantes.forEach((p, idx) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        doc.text(`${idx + 1}. ${p.tipo} - ${p.numeroProcesso}`, 20, yPos);
        doc.setTextColor(128, 128, 128);
        doc.setFontSize(8);
        doc.text(`Vencimento: ${new Date(p.dataVencimento).toLocaleDateString('pt-BR')} | Status: ${p.status}`, 20, yPos + 4);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        yPos += 10;
      });
      yPos += 5;
    }

    // Seção: Alertas
    if (tipo === 'completo' || tipo === 'alertas') {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.text('Alertas', 20, yPos);
      yPos += 8;

      doc.setFontSize(9);
      const alertasRelevantes = alertas.filter(a => !a.resolvido).slice(0, 5);

      alertasRelevantes.forEach((a, idx) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        doc.text(`${idx + 1}. ${a.titulo}`, 20, yPos);
        doc.setTextColor(128, 128, 128);
        doc.setFontSize(8);
        doc.text(`Severidade: ${a.severidade} | Tipo: ${a.tipo}`, 20, yPos + 4);
        if (a.numeroProcesso) {
          doc.text(`Processo: ${a.numeroProcesso}`, 20, yPos + 8);
        }
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        yPos += 14;
      });
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    const pdfBytes = doc.output('arraybuffer');

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio-${new Date().toISOString().split('T')[0]}.pdf"`
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});