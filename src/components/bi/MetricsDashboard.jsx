import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MetricsDashboard() {
  const [period, setPeriod] = useState('monthly');

  const { data: metrics = [], isLoading } = useQuery({
    queryKey: ['biMetrics', period],
    queryFn: () => base44.entities.BiMetric.list(),
    initialData: []
  });

  const { data: tickets = [] } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => base44.entities.Ticket.list(),
    initialData: []
  });

  // Simulated data for charts
  const trendData = [
    { month: 'Jan', value: 120 },
    { month: 'Fev', value: 150 },
    { month: 'Mar', value: 180 },
    { month: 'Abr', value: 165 },
    { month: 'Mai', value: 195 },
    { month: 'Jun', value: 220 }
  ];

  const statusData = [
    { name: 'Abertos', value: tickets.filter(t => t.status === 'open').length },
    { name: 'Em Progresso', value: tickets.filter(t => t.status === 'in_progress').length },
    { name: 'Resolvidos', value: tickets.filter(t => t.status === 'resolved').length },
    { name: 'Fechados', value: tickets.filter(t => t.status === 'closed').length }
  ];

  const priorityData = [
    { priority: 'Baixa', count: tickets.filter(t => t.priority === 'low').length },
    { priority: 'Média', count: tickets.filter(t => t.priority === 'medium').length },
    { priority: 'Alta', count: tickets.filter(t => t.priority === 'high').length },
    { priority: 'Urgente', count: tickets.filter(t => t.priority === 'urgent').length }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  const kpis = [
    { label: 'Total de Tickets', value: tickets.length, trend: 12 },
    { label: 'Taxa de Resolução', value: '78%', trend: -5 },
    { label: 'Tempo Médio', value: '4.2h', trend: 3 },
    { label: 'Satisfação', value: '4.7★', trend: 8 }
  ];

  if (isLoading) {
    return <p className="text-center text-gray-500 py-8">Carregando métricas...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Period Filter */}
      <div className="flex gap-2">
        {['daily', 'weekly', 'monthly', 'yearly'].map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded text-sm font-medium transition-all ${
              period === p
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {p === 'daily' && 'Diário'}
            {p === 'weekly' && 'Semanal'}
            {p === 'monthly' && 'Mensal'}
            {p === 'yearly' && 'Anual'}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <p className="text-xs text-gray-600 mb-2">{kpi.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold">{kpi.value}</p>
                <div className={`flex items-center gap-1 text-sm ${kpi.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.trend > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(kpi.trend)}%
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>📈 Tendência de Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" dot={{ fill: '#3B82F6' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Distribuição por Prioridade</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="priority" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>🥧 Status dos Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Metrics Table */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Métricas Customizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics.slice(0, 5).map(metric => (
                <div key={metric.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium">{metric.name}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {metric.metric_type}
                    </Badge>
                  </div>
                  <p className="text-lg font-bold text-blue-600">—</p>
                </div>
              ))}
              {metrics.length === 0 && (
                <p className="text-sm text-gray-500 py-4">Nenhuma métrica configurada</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}