import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, Table2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const STATUS_LABELS = {
  aberto: 'Aberto',
  em_audiencia: 'Em Audiência',
  acordo: 'Acordo',
  finalizado: 'Finalizado',
  cancelado: 'Cancelado',
};

function escapeCsv(val) {
  if (val == null) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function exportToCSV(processos) {
  const headers = ['Tipo', 'Número', 'Status', 'Tribunal', 'Classe', 'Cliente', 'Consultor', 'Data Abertura', 'Próx. Audiência', 'Assuntos', 'Movimentações'];
  const rows = processos.map(p => [
    p.tipo?.toUpperCase() || '',
    p.numero_processo || '',
    STATUS_LABELS[p.status] || p.status || '',
    p.tribunal || '',
    p.classe_judicial || '',
    p.cliente_nome || '',
    p.consultor_responsavel_nome || p.consultor_responsavel_email || '',
    p.data_abertura || '',
    p.data_proxima_audiencia || '',
    (p.assuntos || []).join('; '),
    (p.movimentos || []).length,
  ]);

  const csv = [headers, ...rows].map(row => row.map(escapeCsv).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `processos_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
  toast.success('CSV exportado com sucesso!');
}

function exportToJSON(processos) {
  const data = JSON.stringify(processos, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `processos_${format(new Date(), 'yyyy-MM-dd')}.json`;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
  toast.success('JSON exportado com sucesso!');
}

async function exportToPDF(processos) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'landscape' });

  doc.setFontSize(16);
  doc.setTextColor(33, 35, 115);
  doc.text('Relatório de Processos Judiciais', 14, 16);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')} — Total: ${processos.length} processo(s)`, 14, 23);

  // Tabela
  const cols = ['Tipo', 'Número', 'Status', 'Cliente', 'Tribunal', 'Data Abertura'];
  const colWidths = [20, 60, 30, 50, 20, 28];
  let y = 32;

  // Header da tabela
  doc.setFillColor(33, 35, 115);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.rect(14, y, colWidths.reduce((a, b) => a + b, 0), 8, 'F');
  let x = 14;
  cols.forEach((col, i) => {
    doc.text(col, x + 2, y + 5.5);
    x += colWidths[i];
  });
  y += 8;

  // Linhas
  doc.setTextColor(30, 30, 30);
  processos.forEach((p, idx) => {
    if (y > 185) { doc.addPage(); y = 15; }
    const bg = idx % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
    doc.setFillColor(...bg);
    const rowH = 7;
    doc.rect(14, y, colWidths.reduce((a, b) => a + b, 0), rowH, 'F');

    const cells = [
      (p.tipo || '').toUpperCase(),
      p.numero_processo || '',
      STATUS_LABELS[p.status] || p.status || '',
      p.cliente_nome || '',
      p.tribunal || '',
      p.data_abertura || '',
    ];
    x = 14;
    cells.forEach((cell, i) => {
      const maxWidth = colWidths[i] - 4;
      const truncated = doc.getStringUnitWidth(cell) * 8 / doc.internal.scaleFactor > maxWidth
        ? cell.slice(0, Math.floor(maxWidth * doc.internal.scaleFactor / 8) - 1) + '…'
        : cell;
      doc.text(truncated, x + 2, y + 5);
      x += colWidths[i];
    });
    y += rowH;
  });

  doc.save(`processos_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  toast.success('PDF exportado com sucesso!');
}

export default function ProcessosExport({ processos = [] }) {
  const [exporting, setExporting] = useState(false);

  const handlePDF = async () => {
    setExporting(true);
    try { await exportToPDF(processos); }
    catch (e) { toast.error('Erro ao gerar PDF: ' + e.message); }
    finally { setExporting(false); }
  };

  if (processos.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={exporting}>
          {exporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Exportar ({processos.length})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handlePDF} className="gap-2">
          <FileText className="w-4 h-4 text-red-500" /> Exportar PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToCSV(processos)} className="gap-2">
          <Table2 className="w-4 h-4 text-green-600" /> Exportar CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToJSON(processos)} className="gap-2">
          <FileText className="w-4 h-4 text-blue-500" /> Exportar JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}