import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { jsPDF } from 'npm:jspdf@4.0.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const format = body.format || 'pdf';

    const [publicacoes, processos, tarefas] = await Promise.all([
      base44.asServiceRole.entities.PublicacaoAdvise.list('-created_date', 50),
      base44.asServiceRole.entities.ProcessoAdvise.list('-created_date', 50),
      base44.asServiceRole.entities.TarefaAgendada.list('-created_date', 50),
    ]);

    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text('LegalPush — Relatório Executivo', 20, 20);
      doc.setFontSize(11);
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 30);
      doc.text(`Usuário: ${user.email}`, 20, 38);

      doc.setFontSize(14);
      doc.text('Resumo Geral', 20, 52);
      doc.setFontSize(11);
      doc.text(`• Publicações monitoradas: ${publicacoes.length}`, 25, 62);
      doc.text(`• Não lidas: ${publicacoes.filter(p => !p.lido).length}`, 25, 70);
      doc.text(`• Processos ativos: ${processos.filter(p => p.statusProcesso === 'ativo').length} / ${processos.length}`, 25, 78);
      doc.text(`• Tarefas pendentes: ${tarefas.filter(t => t.status === 'pendente').length}`, 25, 86);
      doc.text(`• Tarefas atrasadas: ${tarefas.filter(t => t.status === 'atrasada').length}`, 25, 94);

      doc.setFontSize(14);
      doc.text('Últimas Publicações', 20, 110);
      doc.setFontSize(9);
      let y = 120;
      publicacoes.slice(0, 15).forEach(p => {
        if (y > 270) { doc.addPage(); y = 20; }
        const date = p.dataPublicacao ? new Date(p.dataPublicacao).toLocaleDateString('pt-BR') : '-';
        doc.text(`${date} | ${p.numeroProcesso || '-'} | ${(p.diario || '-').substring(0, 30)}`, 20, y);
        y += 8;
      });

      const pdf = doc.output('arraybuffer');
      return new Response(pdf, {
        headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=relatorio-legalpush.pdf' }
      });
    }

    // JSON fallback
    return Response.json({
      report: { publicacoes: publicacoes.length, processos: processos.length, tarefas: tarefas.length },
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});