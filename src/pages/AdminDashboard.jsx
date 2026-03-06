import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, AlertCircle, Activity, Users } from 'lucide-react';

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7d');

  const { data: processes = [] } = useQuery({
    queryKey: ['admin_processes_all'],
    queryFn: () => base44.entities.Process.list()
  });

  const { data: deadlines = [] } = useQuery({
    queryKey: ['admin_deadlines_all'],
    queryFn: () => base44.entities.Deadline.list()
  });

  const { data: publications = [] } = useQuery({
    queryKey: ['admin_publications_all'],
    queryFn: () => base44.entities.Publication.list()
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['admin_contacts_all'],
    queryFn: () => base44.entities.Contact.list()
  });

  const { data: syncs = [] } = useQuery({
    queryKey: ['admin_syncs_all'],
    queryFn: () => base44.entities.TPUSincronizacao.list()
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['admin_alerts_all'],
    queryFn: () => base44.entities.DeadlineAlert.list()
  });

  // Calculate metrics
  const metrics = {
    processes: {
      total: processes.length,
      active: processes.filter(p => p.status === 'active').length,
      synced: processes.filter(p => p.synced_at).length,
      syncRate: processes.length > 0 ? Math.round((processes.filter(p => p.synced_at).length / processes.length) * 100) : 0
    },
    deadlines: {
      total: deadlines.length,
      pending: deadlines.filter(d => d.status === 'pending').length,
      overdue: deadlines.filter(d => new Date(d.due_date) < new Date() && d.status !== 'completed').length,
      completionRate: deadlines.length > 0 ? Math.round((deadlines.filter(d => d.status === 'completed').length / deadlines.length) * 100) : 0
    },
    publications: {
      total: publications.length,
      dje: publications.filter(p => p.source === 'dje').length,
      tribunal: publications.filter(p => p.source === 'tribunal').length
    },
    contacts: {
      total: contacts.length,
      advogados: contacts.filter(c => c.type === 'advogado').length,
      clientes: contacts.filter(c => c.type === 'cliente').length
    },
    syncs: {
      success: syncs.filter(s => s.status === 'sucesso').length,
      errors: syncs.filter(s => s.status === 'erro').length,
      successRate: syncs.length > 0 ? Math.round((syncs.filter(s => s.status === 'sucesso').length / syncs.length) * 100) : 0
    },
    alerts: {
      pending: alerts.filter(a => a.status === 'pending').length,
      sent: alerts.filter(a => a.status === 'sent').length
    }
  };

  // Chart data
  const statusDistribution = [
    { name: 'Ativos', value: metrics.processes.active, fill: '#10b981' },
    { name: 'Arquivados', value: processes.filter(p => p.status === 'archived').length, fill: '#6b7280' },
    { name: 'Pausados', value: processes.filter(p => p.status === 'paused').length, fill: '#f59e0b' }
  ];

  const deadlineStatus = [
    { name: 'Concluídos', value: deadlines.filter(d => d.status === 'completed').length, fill: '#10b981' },
    { name: 'Pendentes', value: metrics.deadlines.pending, fill: '#3b82f6' },
    { name: 'Vencidos', value: metrics.deadlines.overdue, fill: '#ef4444' }
  ];

  const syncTrend = [
    { date: '6d atrás', sucesso: 15, erro: 2 },
    { date: '5d atrás', sucesso: 18, erro: 1 },
    { date: '4d atrás', sucesso: 22, erro: 2 },
    { date: '3d atrás', sucesso: 20, erro: 3 },
    { date: '2d atrás', sucesso: 25, erro: 1 },
    { date: 'ontem', sucesso: 28, erro: 2 },
    { date: 'hoje', sucesso: syncs.filter(s => s.status === 'sucesso').length, erro: syncs.filter(s => s.status === 'erro').length }
  ];

  const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Visão consolidada de todos os módulos</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Processos</p>
                  <p className="text-3xl font-bold text-cyan-600">{metrics.processes.total}</p>
                </div>
                <Activity className="w-8 h-8 text-cyan-200" />
              </div>
              <p className="text-xs text-gray-500 mt-2">{metrics.processes.syncRate}% sincronizados</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Prazos</p>
                  <p className="text-3xl font-bold text-green-600">{metrics.deadlines.total}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-200" />
              </div>
              <p className="text-xs text-red-600 mt-2">{metrics.deadlines.overdue} vencidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Publicações</p>
                  <p className="text-3xl font-bold text-blue-600">{metrics.publications.total}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-200" />
              </div>
              <p className="text-xs text-gray-500 mt-2">DJe: {metrics.publications.dje} | Tribunal: {metrics.publications.tribunal}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Contatos</p>
                  <p className="text-3xl font-bold text-purple-600">{metrics.contacts.total}</p>
                </div>
                <Users className="w-8 h-8 text-purple-200" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Advogados: {metrics.contacts.advogados}</p>
            </CardContent>
          </Card>
        </div>

        {/* Health Metrics */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Taxa de Sincronização</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{metrics.syncs.successRate}%</p>
              <Progress value={metrics.syncs.successRate} className="mt-3" />
              <p className="text-xs text-gray-600 mt-2">{metrics.syncs.success} sucessos, {metrics.syncs.errors} erros</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Completação de Prazos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{metrics.deadlines.completionRate}%</p>
              <Progress value={metrics.deadlines.completionRate} className="mt-3" />
              <p className="text-xs text-gray-600 mt-2">{deadlines.filter(d => d.status === 'completed').length} concluídos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Alertas Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">{metrics.alerts.pending}</p>
              <div className="mt-3 text-xs text-gray-600 space-y-1">
                <p>✓ Enviados: {metrics.alerts.sent}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Processos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Deadline Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status de Prazos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deadlineStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deadlineStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Sync Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Sincronizações</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={syncTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sucesso" stroke="#10b981" name="Sucesso" strokeWidth={2} />
                <Line type="monotone" dataKey="erro" stroke="#ef4444" name="Erro" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        {metrics.deadlines.overdue > 0 && (
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-900">⚠️ Atenção: Prazos Vencidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">{metrics.deadlines.overdue} prazos vencidos necessitam de ação imediata</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}