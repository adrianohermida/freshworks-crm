import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Clock, Zap } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function PerformanceMetrics() {
  const [timeRange, setTimeRange] = useState('week');

  const { data: tickets = [] } = useQuery({
    queryKey: ['ticketsMetrics'],
    queryFn: () => base44.entities.Ticket.list(),
    initialData: []
  });

  const { data: agents = [] } = useQuery({
    queryKey: ['usersPerformance'],
    queryFn: () => base44.entities.User.list(),
    initialData: []
  });

  const { data: timeTracking = [] } = useQuery({
    queryKey: ['timeTrackingMetrics'],
    queryFn: () => base44.entities.TimeTracking.list(),
    initialData: []
  });

  // Calcular métricas de desempenho
  const getMetricsData = () => {
    const totalTickets = tickets.length;
    const resolvedTickets = tickets.filter(t => ['resolved', 'closed'].includes(t.status)).length;
    const resolutionRate = totalTickets > 0 ? ((resolvedTickets / totalTickets) * 100).toFixed(1) : 0;
    
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const urgentTickets = tickets.filter(t => t.priority === 'urgent').length;
    
    const avgResolutionTime = timeTracking.length > 0
      ? (timeTracking.reduce((sum, t) => sum + (t.duration_seconds || 0), 0) / timeTracking.length / 3600).toFixed(1)
      : 0;

    return {
      totalTickets,
      resolvedTickets,
      resolutionRate,
      openTickets,
      urgentTickets,
      avgResolutionTime
    };
  };

  // Dados para gráfico de tendência
  const getTrendData = () => {
    const data = {};
    const now = new Date();
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      data[dateStr] = { date: dateStr, created: 0, resolved: 0 };
    }

    tickets.forEach(t => {
      const dateStr = new Date(t.created_date).toISOString().split('T')[0];
      if (data[dateStr]) {
        data[dateStr].created++;
      }
      if (t.updated_date) {
        const updateStr = new Date(t.updated_date).toISOString().split('T')[0];
        if (data[updateStr] && ['resolved', 'closed'].includes(t.status)) {
          data[updateStr].resolved++;
        }
      }
    });

    return Object.values(data).slice(-7); // Últimos 7 dias
  };

  // Performance por agente
  const getAgentPerformance = () => {
    const agentMap = {};
    tickets.forEach(t => {
      if (t.assigned_agent_name) {
        if (!agentMap[t.assigned_agent_name]) {
          agentMap[t.assigned_agent_name] = { name: t.assigned_agent_name, total: 0, resolved: 0 };
        }
        agentMap[t.assigned_agent_name].total++;
        if (['resolved', 'closed'].includes(t.status)) {
          agentMap[t.assigned_agent_name].resolved++;
        }
      }
    });
    return Object.values(agentMap).slice(0, 8);
  };

  // Distribuição por prioridade
  const getPriorityDistribution = () => {
    const priorities = ['low', 'medium', 'high', 'urgent'];
    return priorities.map(p => ({
      name: p.charAt(0).toUpperCase() + p.slice(1),
      value: tickets.filter(t => t.priority === p).length
    }));
  };

  const metrics = getMetricsData();
  const trendData = getTrendData();
  const agentPerformance = getAgentPerformance();
  const priorityData = getPriorityDistribution();

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Resolução</p>
                <p className="text-3xl font-bold text-green-600">{metrics.resolutionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tickets em Aberto</p>
                <p className="text-3xl font-bold text-blue-600">{metrics.openTickets}</p>
              </div>
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgentes</p>
                <p className="text-3xl font-bold text-red-600">{metrics.urgentTickets}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tempo Médio</p>
                <p className="text-3xl font-bold text-purple-600">{metrics.avgResolutionTime}h</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="created" stroke="#8884d8" name="Criados" />
              <Line type="monotone" dataKey="resolved" stroke="#82ca9d" name="Resolvidos" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Agent Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Desempenho dos Agentes</CardTitle>
        </CardHeader>
        <CardContent>
          {agentPerformance.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhum dado de agentes</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agentPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" name="Total" />
                <Bar dataKey="resolved" fill="#82ca9d" name="Resolvidos" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Priority Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Prioridade</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// Placeholder para AlertTriangle
function AlertTriangle(props) {
  return <div {...props}>⚠️</div>;
}