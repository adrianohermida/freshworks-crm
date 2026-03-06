import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, FileText, Scale, CheckSquare, DollarSign, RefreshCw, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function BIDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await base44.functions.invoke('analytics/biDashboard', {});
    setData(res.data);
    setLoading(false);
  };

  const exportPDF = async () => {
    const res = await base44.functions.invoke('analytics/exportReport', { format: 'pdf' });
    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'relatorio-legalpush.pdf';
    document.body.appendChild(a); a.click(); URL.revokeObjectURL(url); a.remove();
  };

  useEffect(() => { fetchData(); }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-48">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Carregando analytics...</span>
      </div>
    );
  }

  const { kpis, roi, trend } = data;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: 'Publicações', value: kpis.publicacoes.total, sub: `${kpis.publicacoes.naoLidas} não lidas`, color: 'text-blue-600' },
          { icon: Scale, label: 'Processos', value: kpis.processos.total, sub: `${kpis.processos.ativos} ativos`, color: 'text-purple-600' },
          { icon: CheckSquare, label: 'Tarefas', value: kpis.tarefas.total, sub: `${kpis.tarefas.atrasadas} atrasadas`, color: 'text-orange-600' },
          { icon: TrendingUp, label: 'Tickets', value: kpis.tickets.total, sub: `${kpis.tickets.abertos} abertos`, color: 'text-green-600' },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <Card key={i}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-1">
                  <Icon className={`w-5 h-5 ${k.color}`} />
                  <span className="text-2xl font-bold">{k.value}</span>
                </div>
                <p className="text-sm font-medium text-gray-700">{k.label}</p>
                <p className="text-xs text-gray-400">{k.sub}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ROI */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <DollarSign className="w-5 h-5" />
            ROI & Eficiência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Horas Economizadas', value: `${roi.horasEconomizadas}h` },
              { label: 'Valor Estimado (R$)', value: `R$ ${roi.valorEstimadoBRL.toLocaleString('pt-BR')}` },
              { label: 'Ganho de Eficiência', value: `${roi.eficienciaGanho}%` },
              { label: 'Satisfação Cliente', value: `${roi.satisfacaoCliente}%` },
            ].map((r, i) => (
              <div key={i} className="text-center bg-green-50 rounded-lg p-3">
                <p className="text-xl font-bold text-green-700">{r.value}</p>
                <p className="text-xs text-gray-600">{r.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência — Últimos 7 dias</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="publicacoes" fill="#7E57FF" name="Publicações" radius={[4, 4, 0, 0]} />
              <Bar dataKey="processos" fill="#3B82F6" name="Processos" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={exportPDF}>
          <Download className="w-4 h-4" />
          Exportar PDF
        </Button>
        <Button variant="outline" onClick={fetchData} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </Button>
      </div>
    </div>
  );
}