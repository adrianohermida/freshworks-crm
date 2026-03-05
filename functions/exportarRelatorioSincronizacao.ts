import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { jsPDF } from 'npm:jspdf@4.0.0';

/**
 * Exportar relatório de sincronizações em PDF ou CSV
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { formato, periodo } = await req.json();

    if (!formato || !['pdf', 'csv'].includes(formato)) {
      return Response.json({ error: 'Formato inválido (pdf ou csv)' }, { status: 400 });
    }

    // Buscar dados
    const dias = periodo === '7d' ? 7 : periodo === '30d' ? 30 : 90;
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);

    const sincs = await base44.entities.TPUSincronizacao.list('-data_sincronizacao', 500);
    const syncsFiltradas = sincs.filter(s => new Date(s.data_sincronizacao) >= dataLimite);

    if (formato === 'csv') {
      return gerarCSV(syncsFiltradas, user);
    } else {
      return gerarPDF(syncsFiltradas, user, periodo);
    }
  } catch (error) {
    console.error('[exportarRelatorioSincronizacao] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

/**
 * Gerar CSV
 */
function gerarCSV(sincs, user) {
  const headers = ['Data', 'Processo ID', 'Tipo', 'Status', 'Movimentos', 'Novos', 'Duplicatas', 'Tempo (ms)', 'Erro'];
  
  const rows = sincs.map(s => [
    new Date(s.data_sincronizacao).toLocaleString('pt-BR'),
    s.processo_id || '-',
    s.tipo,
    s.status,
    s.total_movimentos_sincronizados || 0,
    s.total_novos || 0,
    s.total_duplicatas || 0,
    s.tempo_execucao_ms || 0,
    s.mensagem_erro || '-'
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename=relatorio-sincronizacoes-${new Date().toISOString().split('T')[0]}.csv`
    }
  });
}

/**
 * Gerar PDF
 */
function gerarPDF(sincs, user, periodo) {
  const doc = new jsPDF();
  
  // Cabeçalho
  doc.setFontSize(16);
  doc.text('Relatório de Sincronizações DataJud', 20, 20);
  
  doc.setFontSize(10);
  doc.text(`Período: ${periodo}`, 20, 30);
  doc.text(`Gerado: ${new Date().toLocaleString('pt-BR')}`, 20, 37);
  doc.text(`Usuário: ${user.full_name}`, 20, 44);

  // Estatísticas
  const sucessos = sincs.filter(s => s.status === 'sucesso').length;
  const erros = sincs.filter(s => s.status === 'erro').length;
  const pendentes = sincs.filter(s => s.status === 'pendente').length;
  const taxa = sincs.length > 0 ? Math.round((sucessos / sincs.length) * 100) : 0;

  doc.setFontSize(12);
  doc.text('Resumo Executivo', 20, 55);
  
  doc.setFontSize(10);
  doc.text(`Total de Sincronizações: ${sincs.length}`, 30, 65);
  doc.text(`✓ Sucessos: ${sucessos} (${taxa}%)`, 30, 72);
  doc.text(`✗ Erros: ${erros}`, 30, 79);
  doc.text(`⏳ Pendentes: ${pendentes}`, 30, 86);

  // Tabela
  let y = 100;
  doc.setFontSize(10);
  doc.text('Detalhes das Sincronizações', 20, y);
  y += 10;

  const colWidths = [30, 30, 20, 20, 20, 20, 20];
  const headers = ['Data', 'Processo', 'Tipo', 'Status', 'Mov.', 'Novos', 'Tempo'];

  // Cabeçalho tabela
  doc.setFont(undefined, 'bold');
  let x = 20;
  headers.forEach((h, i) => {
    doc.text(h, x, y);
    x += colWidths[i];
  });
  doc.setFont(undefined, 'normal');
  y += 7;

  // Linhas tabela
  sincs.slice(0, 40).forEach(s => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }

    x = 20;
    const data = new Date(s.data_sincronizacao).toLocaleDateString('pt-BR');
    const cells = [
      data,
      s.processo_id?.substring(0, 8) || '-',
      s.tipo,
      s.status,
      s.total_movimentos_sincronizados || 0,
      s.total_novos || 0,
      s.tempo_execucao_ms || 0
    ];

    cells.forEach((cell, i) => {
      doc.text(String(cell), x, y);
      x += colWidths[i];
    });
    y += 7;
  });

  // Rodapé
  doc.setFontSize(8);
  doc.text(`Página 1 de ${doc.internal.pages.length - 1}`, 20, doc.internal.pageSize.height - 10);

  const pdfBytes = doc.output('arraybuffer');

  return new Response(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=relatorio-sincronizacoes-${new Date().toISOString().split('T')[0]}.pdf`
    }
  });
}