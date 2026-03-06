import React from 'react';
import { Download, FileJson, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Papa from 'papaparse';
import jsPDF from 'jspdf';

export default function DataExporter({ events, metrics, isLoading, startDate, endDate }) {
  const exportToCSV = () => {
    if (!events || events.length === 0) {
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { type: 'warning', message: 'Nenhum evento para exportar' }
      }));
      return;
    }

    const csvData = events.map(event => ({
      'Data/Hora': new Date(event.timestamp).toLocaleString('pt-BR'),
      'Tipo de Evento': event.event_type,
      'Entidade': event.entity_type,
      'Ação': event.action,
      'Status': event.status,
      'Valor': event.value || '-',
      'Usuário': event.user_id
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `analytics-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.dispatchEvent(new CustomEvent('toast', {
      detail: { type: 'success', message: 'CSV exportado com sucesso' }
    }));
  };

  const exportToJSON = () => {
    if (!events || events.length === 0) {
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { type: 'warning', message: 'Nenhum evento para exportar' }
      }));
      return;
    }

    const data = {
      exportedAt: new Date().toISOString(),
      period: {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      },
      summary: metrics,
      events: events
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `analytics-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.dispatchEvent(new CustomEvent('toast', {
      detail: { type: 'success', message: 'JSON exportado com sucesso' }
    }));
  };

  const exportToPDF = async () => {
    if (!metrics) {
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { type: 'warning', message: 'Nenhum dado para exportar' }
      }));
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;

      // Header
      doc.setFontSize(20);
      doc.text('Relatório de Analytics', 20, yPosition);
      yPosition += 15;

      // Period
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(
        `Período: ${startDate?.toLocaleDateString('pt-BR')} a ${endDate?.toLocaleDateString('pt-BR')}`,
        20,
        yPosition
      );
      yPosition += 10;

      // Metrics Summary
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('Resumo de Métricas', 20, yPosition);
      yPosition += 10;

      const metricsData = [
        ['Total de Eventos', metrics?.totalEvents || 0],
        ['Taxa de Sucesso', `${metrics?.successRate || 0}%`],
        ['Valor Médio', metrics?.averageValue || 0],
        ['Tipos de Evento', Object.keys(metrics?.eventsByType || {}).length]
      ];

      metricsData.forEach(([label, value]) => {
        doc.setFontSize(11);
        doc.text(label, 20, yPosition);
        doc.text(String(value), pageWidth - 40, yPosition, { align: 'right' });
        yPosition += 8;
      });

      yPosition += 10;

      // Top Actions
      if (metrics?.topActions && metrics.topActions.length > 0) {
        doc.setFontSize(14);
        doc.text('Ações Mais Frequentes', 20, yPosition);
        yPosition += 10;

        metrics.topActions.slice(0, 10).forEach((action, idx) => {
          doc.setFontSize(10);
          doc.text(`${idx + 1}. ${action.action}`, 20, yPosition);
          doc.text(String(action.count), pageWidth - 40, yPosition, { align: 'right' });
          yPosition += 7;
        });
      }

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(
        `Gerado em ${new Date().toLocaleString('pt-BR')}`,
        20,
        pageHeight - 10
      );

      doc.save(`analytics-${new Date().toISOString().split('T')[0]}.pdf`);

      window.dispatchEvent(new CustomEvent('toast', {
        detail: { type: 'success', message: 'PDF exportado com sucesso' }
      }));
    } catch (error) {
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { type: 'error', message: 'Erro ao exportar PDF' }
      }));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={isLoading}
          className="gap-2 bg-cyan-600 hover:bg-cyan-700 w-full sm:w-auto"
          aria-busy={isLoading}
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          <Download className="w-4 h-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dark:bg-gray-800 dark:border-gray-700">
        <DropdownMenuItem onClick={exportToCSV} className="gap-2 dark:text-gray-200">
          <Download className="w-4 h-4" />
          Exportar CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON} className="gap-2 dark:text-gray-200">
          <FileJson className="w-4 h-4" />
          Exportar JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} className="gap-2 dark:text-gray-200">
          <Download className="w-4 h-4" />
          Exportar PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}