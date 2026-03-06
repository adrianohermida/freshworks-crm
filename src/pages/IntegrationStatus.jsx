import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, Activity, Clock } from 'lucide-react';

function StatusBadge({ status }) {
  const map = {
    healthy: { color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Saudável' },
    warning: { color: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="w-3 h-3" />, label: 'Atenção' },
    degraded: { color: 'bg-orange-100 text-orange-800', icon: <AlertTriangle className="w-3 h-3" />, label: 'Degradado' },
    critical: { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-3 h-3" />, label: 'Crítico' },
    ok: { color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="w-3 h-3" />, label: 'OK' },
    up: { color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Online' },
    down: { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-3 h-3" />, label: 'Offline' },
    unknown: { color: 'bg-gray-100 text-gray-600', icon: <Activity className="w-3 h-3" />, label: 'Desconhecido' }
  };
  const cfg = map[status] || map['unknown'];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function MetricCard({ title, value, unit, status, icon: IconComp }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{title}</span>
          {IconComp && <IconComp className="w-4 h-4 text-gray-400" />}
        </div>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-2xl font-bold">{value ?? '—'}</span>
            {unit && <span className="text-sm text-gray-400 ml-1">{unit}</span>}
          </div>
          {status && <StatusBadge status={status} />}
        </div>
      </CardContent>
    </Card>
  );
}

export default function IntegrationStatusPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const runCheck = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke('productionMonitoring', {});
      setReport(res.data.report);
      setLastUpdate(new Date().toLocaleTimeString('pt-BR'));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runCheck();
    const interval = setInterval(runCheck, 5 * 60 * 1000); // a cada 5 min
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Monitoramento de Produção</h1>
          {lastUpdate && <p className="text-sm text-gray-500">Última atualização: {lastUpdate}</p>}
        </div>
        <div className="flex items-center gap-3">
          {report && <StatusBadge status={report.overall_status} />}
          <Button onClick={runCheck} disabled={loading} size="sm" variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Verificar
          </Button>
        </div>
      </div>

      {!report && !loading && (
        <Card>
          <CardContent className="py-12 text-center text-gray-400">
            <Activity className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Clique em "Verificar" para iniciar o monitoramento</p>
          </CardContent>
        </Card>
      )}

      {loading && !report && (
        <Card>
          <CardContent className="py-12 text-center text-gray-400">
            <RefreshCw className="w-10 h-10 mx-auto mb-3 animate-spin opacity-50" />
            <p>Coletando métricas...</p>
          </CardContent>
        </Card>
      )}

      {report && (
        <>
          {/* Alerts */}
          {report.alerts?.length > 0 && (
            <div className="space-y-2">
              {report.alerts.map((alert, i) => (
                <div key={i} className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                  {alert}
                </div>
              ))}
            </div>
          )}

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Total Tickets"
              value={report.tickets?.total}
              icon={Activity}
            />
            <MetricCard
              title="Erros (1h)"
              value={report.errors?.last_1h}
              status={report.errors?.last_1h > 5 ? 'warning' : 'ok'}
              icon={XCircle}
            />
            <MetricCard
              title="Tempo de Carga"
              value={report.performance?.avg_load_time_ms}
              unit="ms"
              status={report.performance?.status}
              icon={Clock}
            />
            <MetricCard
              title="Usuários Únicos (7d)"
              value={report.analytics?.unique_users}
              icon={Activity}
            />
          </div>

          {/* Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total</span>
                  <span className="font-medium">{report.tickets?.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Abertos</span>
                  <span className="font-medium text-orange-600">{report.tickets?.open}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Resolvidos</span>
                  <span className="font-medium text-green-600">{report.tickets?.resolved}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Erros (24h)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Últimas 24h</span>
                  <span className="font-medium">{report.errors?.last_24h}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Última 1h</span>
                  <span className="font-medium">{report.errors?.last_1h}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Críticos</span>
                  <span className={`font-medium ${report.errors?.critical_24h > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {report.errors?.critical_24h}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Analytics (7 dias)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Eventos</span>
                  <span className="font-medium">{report.analytics?.events_7d}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Usuários únicos</span>
                  <span className="font-medium">{report.analytics?.unique_users}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Health Checks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total executados</span>
                  <span className="font-medium">{report.monitoring?.total_checks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Uptime estimado</span>
                  <span className="font-medium text-green-600">{report.uptime_estimate}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}