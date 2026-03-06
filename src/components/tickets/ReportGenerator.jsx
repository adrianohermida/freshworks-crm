import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Loader } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function ReportGenerator({ tickets }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    if (!dateFrom || !dateTo) {
      toast.error('Selecione um período');
      return;
    }

    if (new Date(dateFrom) >= new Date(dateTo)) {
      toast.error('Data inicial deve ser menor que data final');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await base44.functions.invoke('generateTicketReport', {
        dateFrom,
        dateTo
      });

      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-tickets-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      toast.success('Relatório gerado com sucesso!');
      setIsOpen(false);
      setDateFrom('');
      setDateTo('');
    } catch (error) {
      toast.error('Erro ao gerar relatório: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-turquoise-600 hover:bg-turquoise-700">
          <Download className="w-4 h-4" />
          Gerar Relatório
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerar Relatório de Tickets</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Data Inicial</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Data Final</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-xs text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">O relatório incluirá:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Métricas principais (total, resolvidos, taxa resolução)</li>
              <li>Distribuição por status</li>
              <li>Distribuição por prioridade</li>
              <li>Desempenho por agente</li>
              <li>Análise de sentimento</li>
            </ul>
          </div>

          <Button
            onClick={handleGenerateReport}
            disabled={isGenerating || !dateFrom || !dateTo}
            className="w-full bg-turquoise-600"
          >
            {isGenerating ? (
              <>
                <Loader className="w-4 h-4 animate-spin mr-2" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Gerar PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}