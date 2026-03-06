import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Download, RefreshCw } from 'lucide-react';
import AnalyticsDashboard from '../components/dashboard/AnalyticsDashboard';
import AlertasTimeline from '../components/dashboard/AlertasTimeline';

export default function DashboardAnalytics() {
  const [loadingPDF, setLoadingPDF] = useState(false);

  const handleDownloadPDF = async (tipo = 'completo', periodo = 30) => {
    setLoadingPDF(true);
    try {
      const response = await base44.functions.invoke('gerarRelatorioPDF', {
        tipo,
        periodo
      });

      // Download do PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      alert('Erro ao gerar PDF: ' + error.message);
    } finally {
      setLoadingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Métricas e indicadores de processos e alertas</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadPDF('completo', 30)}
              disabled={loadingPDF}
              className="gap-2"
            >
              {loadingPDF ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  PDF Completo
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard />

        {/* Timeline */}
        <div className="space-y-6">
          <AlertasTimeline />
        </div>

        {/* Export Options */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Opções de Exportação</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleDownloadPDF('resumo', 7)}
                  className="w-full"
                  disabled={loadingPDF}
                >
                  📊 Resumo 7 dias
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownloadPDF('processos', 30)}
                  className="w-full"
                  disabled={loadingPDF}
                >
                  ⚖️ Processos 30 dias
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownloadPDF('prazos', 30)}
                  className="w-full"
                  disabled={loadingPDF}
                >
                  ⏰ Prazos 30 dias
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownloadPDF('alertas', 30)}
                  className="w-full"
                  disabled={loadingPDF}
                >
                  🚨 Alertas 30 dias
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}