import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { Loader } from 'lucide-react';

export default function AnalyticsTrendingChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await base44.functions.invoke('dashboardAnalyticsTrending', {});
        setData(response.data);
      } catch (error) {
        console.error('Erro ao carregar analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics - Últimos 7 dias</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics - Últimos 7 dias</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-gray-500 py-8">
          Dados não disponíveis
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Volume Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Volume de Tickets - Últimos 7 dias</CardTitle>
          <CardDescription>Tickets criados e resolvidos por dia</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.dailyVolume}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="created" fill="#3b82f6" name="Criados" />
              <Bar dataKey="resolved" fill="#10b981" name="Resolvidos" />
              <Bar dataKey="pending" fill="#f59e0b" name="Pendentes" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* SLA Trend */}
      <Card>
        <CardHeader>
          <CardTitle>SLA Compliance - Trending</CardTitle>
          <CardDescription>Percentual de tickets dentro do SLA por dia</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.slaTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="slaPercentage" 
                stroke="#8b5cf6" 
                name="SLA %" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>Forecast - Próximos Dias</CardTitle>
          <CardDescription>Previsão baseada em últimos 3 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Volume Estimado/Dia</p>
              <p className="text-2xl font-bold text-blue-600">{data.forecast.estimatedDailyVolume}</p>
              <p className="text-xs text-gray-500 mt-1">tickets</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Previsão Próximo Dia</p>
              <p className="text-2xl font-bold text-purple-600">{data.forecast.nextDayPrediction}</p>
              <p className="text-xs text-gray-500 mt-1">tickets</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Confiança</p>
              <p className="text-2xl font-bold text-green-600">{data.forecast.confidence}</p>
              <p className="text-xs text-gray-500 mt-1">modelo ML</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-gray-500 text-right">
        Atualizado em: {new Date(data.generatedAt).toLocaleString('pt-BR')}
      </div>
    </div>
  );
}