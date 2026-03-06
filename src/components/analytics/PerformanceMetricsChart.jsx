import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, Users, Star, CheckCircle2 } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function PerformanceMetricsChart() {
  const [period, setPeriod] = useState('week');

  const { data: result, isLoading, refetch } = useQuery({
    queryKey: ['performance-metrics', period],
    queryFn: async () => {
      const response = await base44.functions.invoke('getPerformanceMetrics', { period });
      return response.data;
    }
  });

  const metrics = result?.metrics || {};

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  // Sample data for trend charts (in production, this would come from historical data)
  const trendData = [
    { day: 'Seg', resolution_time: 12, response_time: 2.5, satisfaction: 4.2 },
    { day: 'Ter', resolution_time: 14, response_time: 2.8, satisfaction: 4.1 },
    { day: 'Qua', resolution_time: 11, response_time: 2.3, satisfaction: 4.3 },
    { day: 'Qui', resolution_time: 13, response_time: 2.6, satisfaction: 4.2 },
    { day: 'Sex', resolution_time: 10, response_time: 2.1, satisfaction: 4.4 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Métricas de Performance</h2>
        <Select value={period} onValueChange={(value) => setPeriod(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Último dia</SelectItem>
            <SelectItem value="week">Última semana</SelectItem>
            <SelectItem value="month">Último mês</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Taxa de Resolução
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.resolution_rate || 0}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Tempo Resolução
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{metrics.avg_resolution_time_hours || 0}h</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              1ª Resposta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{metrics.avg_first_response_time_hours || 0}h</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-600" />
              Satisfação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{metrics.avg_customer_satisfaction || 0}/5</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" />
              Tickets Criados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{metrics.total_tickets_created || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Tempo (últimos 5 dias)</CardTitle>
            <CardDescription>Tempo de resolução vs Tempo de resposta</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="resolution_time" stroke="#3b82f6" name="Resolução (h)" />
                <Line type="monotone" dataKey="response_time" stroke="#f59e0b" name="Resposta (h)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Satisfação do Cliente</CardTitle>
            <CardDescription>Rating médio por dia (últimos 5 dias)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="satisfaction" fill="#10b981" name="Rating" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Período</CardTitle>
          <CardDescription>{period === 'day' ? 'Últimas 24 horas' : period === 'week' ? 'Últimos 7 dias' : 'Últimos 30 dias'}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total de Tickets Resolvidos</p>
              <p className="text-2xl font-bold mt-1">{metrics.total_resolved || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Avaliações</p>
              <p className="text-2xl font-bold mt-1">{metrics.total_reviews || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dados até</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(metrics.timestamp).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}