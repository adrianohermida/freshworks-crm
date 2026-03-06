import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Loader2, Trash2 } from 'lucide-react';

const REPORT_TYPES = {
  summary: 'Resumo',
  detailed: 'Detalhado',
  agent_performance: 'Desempenho de Agentes',
  customer_satisfaction: 'Satisfação do Cliente',
  sla_compliance: 'Conformidade SLA'
};

const FORMATS = {
  pdf: 'PDF',
  excel: 'Excel',
  csv: 'CSV'
};

const PERIODS = {
  daily: 'Diário',
  weekly: 'Semanal',
  monthly: 'Mensal',
  custom: 'Customizado'
};

export default function ReportBuilder() {
  const queryClient = useQueryClient();
  const [newReport, setNewReport] = useState({
    report_name: '',
    report_type: 'summary',
    format: 'pdf',
    period: 'monthly',
    date_range: { start: '', end: '' },
    filters: {},
    scheduled: false,
    schedule_frequency: 'monthly'
  });
  const [editingId, setEditingId] = useState(null);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => base44.entities.Report.list('-generated_at', 50),
    initialData: []
  });

  const generateMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('generateReport', data),
    onSuccess: () => {
      toast.success('📊 Relatório gerado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      resetForm();
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Report.delete(id),
    onSuccess: () => {
      toast.success('❌ Relatório removido');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    }
  });

  const resetForm = () => {
    setNewReport({
      report_name: '',
      report_type: 'summary',
      format: 'pdf',
      period: 'monthly',
      date_range: { start: '', end: '' },
      filters: {},
      scheduled: false,
      schedule_frequency: 'monthly'
    });
    setEditingId(null);
  };

  const handleGenerate = () => {
    if (!newReport.report_name.trim()) {
      toast.error('Nome do relatório é obrigatório');
      return;
    }
    generateMutation.mutate(newReport);
  };

  const completedReports = reports.filter(r => r.status === 'completed');
  const pendingReports = reports.filter(r => ['pending', 'generating'].includes(r.status));

  return (
    <div className="space-y-6">
      {/* Generator Form */}
      <Card>
        <CardHeader>
          <CardTitle>📈 Gerar Novo Relatório</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome do Relatório *</label>
            <input
              type="text"
              value={newReport.report_name}
              onChange={(e) => setNewReport({ ...newReport, report_name: e.target.value })}
              placeholder="Ex: Relatório de Tickets Março"
              className="w-full px-3 py-2 border rounded-md text-sm mt-1"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <select
                value={newReport.report_type}
                onChange={(e) => setNewReport({ ...newReport, report_type: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm mt-1"
              >
                {Object.entries(REPORT_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Formato</label>
              <select
                value={newReport.format}
                onChange={(e) => setNewReport({ ...newReport, format: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm mt-1"
              >
                {Object.entries(FORMATS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Período</label>
              <select
                value={newReport.period}
                onChange={(e) => setNewReport({ ...newReport, period: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm mt-1"
              >
                {Object.entries(PERIODS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {newReport.period === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Data Inicial</label>
                <input
                  type="date"
                  value={newReport.date_range.start}
                  onChange={(e) => setNewReport({
                    ...newReport,
                    date_range: { ...newReport.date_range, start: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-md text-sm mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Data Final</label>
                <input
                  type="date"
                  value={newReport.date_range.end}
                  onChange={(e) => setNewReport({
                    ...newReport,
                    date_range: { ...newReport.date_range, end: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-md text-sm mt-1"
                />
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={newReport.scheduled}
              onChange={(e) => setNewReport({ ...newReport, scheduled: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm">Agendar este relatório</span>
          </label>

          {newReport.scheduled && (
            <div>
              <label className="text-sm font-medium">Frequência</label>
              <select
                value={newReport.schedule_frequency}
                onChange={(e) => setNewReport({ ...newReport, schedule_frequency: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm mt-1"
              >
                <option value="daily">Diariamente</option>
                <option value="weekly">Semanalmente</option>
                <option value="monthly">Mensalmente</option>
              </select>
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Gerando...
              </>
            ) : (
              '📊 Gerar Relatório'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Pending Reports */}
      {pendingReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>⏳ Relatórios em Processamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                <div>
                  <p className="font-medium text-sm">{report.report_name}</p>
                  <p className="text-xs text-gray-600">{REPORT_TYPES[report.report_type]}</p>
                </div>
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Completed Reports */}
      <Card>
        <CardHeader>
          <CardTitle>✅ Relatórios Gerados ({completedReports.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {completedReports.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">Nenhum relatório gerado</p>
          ) : (
            completedReports.slice(0, 20).map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-medium text-sm">{report.report_name}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {REPORT_TYPES[report.report_type]}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {FORMATS[report.format]}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(report.file_url, '_blank')}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(report.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}