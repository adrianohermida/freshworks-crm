import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FileText, Download } from 'lucide-react';

export default function RelatorioGerador() {
  const [tipoRelatorio, setTipoRelatorio] = useState('completo');
  const [gerando, setGerando] = useState(false);

  const tiposRelatorio = [
    { value: 'processos', label: '📋 Processos' },
    { value: 'tarefas', label: '⏰ Tarefas e Prazos' },
    { value: 'intimacoes', label: '📮 Intimações' },
    { value: 'completo', label: '📄 Relatório Completo' }
  ];

  const handleGerarRelatorio = async () => {
    try {
      setGerando(true);

      const response = await base44.functions.invoke('gerarRelatorioPDF', {
        tipo: tipoRelatorio,
        filtros: {}
      });

      // O response contém o PDF em formato arraybuffer
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio_${tipoRelatorio}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setGerando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Gerar Relatório em PDF
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Exporte seus dados em PDF para análise, compartilhamento ou arquivamento.
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Relatório
          </label>
          <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tiposRelatorio.map(tipo => (
                <SelectItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleGerarRelatorio}
          disabled={gerando}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {gerando ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Gerando relatório...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Gerar e Baixar PDF
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 space-y-1 pt-4 border-t">
          <p>✓ Inclui todas as informações relevantes</p>
          <p>✓ Formatado profissionalmente</p>
          <p>✓ Com data de geração e paginação</p>
        </div>
      </CardContent>
    </Card>
  );
}