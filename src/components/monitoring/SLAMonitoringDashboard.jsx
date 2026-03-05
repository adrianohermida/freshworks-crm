import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Clock, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

export default function SLAMonitoringDashboard() {
  const { data: slaData, isLoading } = useQuery({
    queryKey: ['sla-monitoring'],
    queryFn: async () => {
      const response = await base44.functions.invoke('getSLAMonitoring', {});
      return response.data;
    },
    refetchInterval: 60000 // Refresh every minute
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const metrics = slaData?.metrics || {};
  const breachRate = slaData?.breach_rate || 0;

  const priorityChartData = Object.entries(metrics.by_priority || {}).map(([priority, data]) => ({
    name: priority,
    total: data.total,
    breached: data.breached,
    at_risk: data.at_risk
  }));

  const getStatusColor = (rate) => {
    if (rate === 0) return 'bg-green-50';
    if (rate < 10) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const getStatusIcon = (rate) => {
    if (rate === 0) return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    if (rate < 10) return <Clock className="h-5 w-5 text-yellow-600" />;
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {breachRate > 0 && (
        <Alert variant={breachRate > 20 ? "destructive" : "default"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {breachRate}% dos tickets estão violando SLA. {metrics.sla_breaches} tickets precisam de atenção imediata.
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={getStatusColor(breachRate)}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {getStatusIcon(breachRate)}
              Taxa de Violação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{breachRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              Violações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{metrics.sla_breaches || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              Em Risco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{metrics.at_risk || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Compliant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{metrics.compliant || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>SLA por Prioridade</CardTitle>
          <CardDescription>Status de cumprimento por nível de prioridade</CardDescription>
        </CardHeader>
        <CardContent>
          {priorityChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#3b82f6" name="Total" />
                <Bar dataKey="breached" fill="#ef4444" name="Violações" />
                <Bar dataKey="at_risk" fill="#f59e0b" name="Em Risco" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">Nenhum dado disponível</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Breaches */}
      {metrics.breaches && metrics.breaches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Violações Recentes</CardTitle>
            <CardDescription>Tickets que violaram SLA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {metrics.breaches.slice(0, 10).map((breach, idx) => (
                <div key={idx} className="border rounded-lg p-3 flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{breach.subject}</p>
                    <p className="text-xs text-gray-500">#{breach.ticket_id}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">{breach.hours_overdue}h atraso</Badge>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{breach.priority}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}