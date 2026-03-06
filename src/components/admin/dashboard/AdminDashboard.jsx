import React, { useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import StatCard from '../shared/StatCard';
import SystemHealth from './SystemHealth';
import TenantOverview from './TenantOverview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Zap, TrendingUp, AlertCircle, Activity, FileText, Clock, RefreshCw } from 'lucide-react';

export default function AdminDashboard({ isSuperAdmin }) {
  const { data: users = [] } = useQuery({
    queryKey: ['admin_users'],
    queryFn: () => base44.entities.User.list('-created_date', 100)
  });

  const { data: processes = [] } = useQuery({
    queryKey: ['admin_processes'],
    queryFn: () => base44.entities.Process.list('-created_date', 200)
  });

  const { data: deadlines = [] } = useQuery({
    queryKey: ['admin_deadlines'],
    queryFn: () => base44.entities.Deadline.list('-created_date', 200)
  });

  const { data: publications = [] } = useQuery({
    queryKey: ['admin_publications'],
    queryFn: () => base44.entities.Publication.list('-created_date', 200)
  });

  const { data: syncs = [] } = useQuery({
    queryKey: ['admin_syncs'],
    queryFn: () => base44.entities.TPUSincronizacao.list('-data_sincronizacao', 50)
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['admin_alerts'],
    queryFn: () => base44.entities.DeadlineAlert.filter({ status: 'pending' }, '-alert_date', 50)
  });

  const { data: analytics = [] } = useQuery({
    queryKey: ['admin_analytics'],
    queryFn: () => base44.entities.Analytics.list('-timestamp', 100)
  });

  // Métricas calculadas
  const metrics = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now - 60 * 24 * 60 * 60 * 1000);

    const recentUsers = users.filter(u => new Date(u.created_date) > thirtyDaysAgo).length;
    const prevUsers = users.filter(u => { const d = new Date(u.created_date); return d > sixtyDaysAgo && d <= thirtyDaysAgo; }).length;
    const userTrendVal = prevUsers > 0 ? Math.round(((recentUsers - prevUsers) / prevUsers) * 100) : 0;

    const syncSuccessRate = syncs.length > 0
      ? Math.round((syncs.filter(s => s.status === 'sucesso').length / syncs.length) * 100) : 0;
    const deadlineCompletionRate = deadlines.length > 0
      ? Math.round((deadlines.filter(d => d.status === 'completed').length / deadlines.length) * 100) : 0;
    const overdueDeadlines = deadlines.filter(d => new Date(d.due_date) < now && d.status !== 'completed').length;

    return {
      totalUsers: users.length,
      userTrend: userTrendVal >= 0 ? 'up' : 'down',
      userTrendValue: `${userTrendVal >= 0 ? '+' : ''}${userTrendVal}%`,
      totalProcesses: processes.length,
      activeProcesses: processes.filter(p => p.status === 'active').length,
      syncedProcesses: processes.filter(p => p.synced_at).length,
      totalDeadlines: deadlines.length,
      overdueDeadlines,
      deadlineCompletionRate,
      totalPublications: publications.length,
      pendingAlerts: alerts.length,
      syncSuccessRate,
      syncErrors: syncs.filter(s => s.status === 'erro').length,
    };
  }, [users, processes, deadlines, publications, syncs, alerts]);

  // Chart data
  const processStatusData = [
    { name: 'Ativos', value: metrics.activeProcesses, fill: '#10b981' },
    { name: 'Arquivados', value: processes.filter(p => p.status === 'archived').length, fill: '#6b7280' },
    { name: 'Pausados', value: processes.filter(p => p.status === 'paused').length, fill: '#f59e0b' },
    { name: 'Erro Sync', value: processes.filter(p => p.status === 'synchronized_error').length, fill: '#ef4444' },
  ].filter(d => d.value > 0);

  const usageData = useMemo(() => {
    const grouped = analytics.reduce((acc, event) => {
      const existing = acc.find(e => e.name === event.event_type);
      if (existing) existing.value += 1;
      else if (event.event_type) acc.push({ name: event.event_type, value: 1 });
      return acc;
    }, []);
    return grouped.sort((a, b) => b.value - a.value).slice(0, 6);
  }, [analytics]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Usuários" value={metrics.totalUsers} icon={Users} trend={metrics.userTrend} trendValue={metrics.userTrendValue} />
          <StatCard title="Processos" value={metrics.totalProcesses} icon={Activity} />
          <StatCard title="Prazos" value={metrics.totalDeadlines} icon={Clock} />
          <StatCard title="Alertas Pendentes" value={metrics.pendingAlerts} icon={AlertCircle} />
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Taxa de Sincronização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{metrics.syncSuccessRate}%</p>
              <Progress value={metrics.syncSuccessRate} className="mt-2 h-2" />
              <p className="text-xs text-gray-500 mt-1">{metrics.syncErrors} erros registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Conclusão de Prazos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{metrics.deadlineCompletionRate}%</p>
              <Progress value={metrics.deadlineCompletionRate} className="mt-2 h-2" />
              {metrics.overdueDeadlines > 0 && (
                <p className="text-xs text-red-600 mt-1">⚠ {metrics.overdueDeadlines} vencidos</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Publicações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">{metrics.totalPublications}</p>
              <p className="text-xs text-gray-500 mt-1">
                Processos sincronizados: {metrics.syncedProcesses}/{metrics.totalProcesses}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Distribuição de Processos */}
            {processStatusData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Distribuição de Processos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={processStatusData} cx="50%" cy="50%" outerRadius={90}
                        label={({ name, value }) => `${name}: ${value}`} dataKey="value">
                        {processStatusData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Métricas de Uso (Analytics) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Métricas de Uso
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usageData.length === 0 ? (
                  <p className="text-sm text-gray-500">Sem dados de analytics ainda</p>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <SystemHealth />
            <TenantOverview isSuperAdmin={isSuperAdmin} />
          </div>
        </div>

        {/* Alertas críticos */}
        {metrics.overdueDeadlines > 0 && (
          <Card className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                ⚠️ {metrics.overdueDeadlines} prazos vencidos necessitam de ação imediata
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}