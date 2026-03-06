import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

export default function AnalyticsReporter() {
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Simular dados de analytics
      const mockData = generateMockAnalytics(timeRange);
      setAnalytics(mockData);
      
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar analytics:', err);
      setLoading(false);
    }
  };

  const generateMockAnalytics = (range) => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 365;
    const trendData = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      trendData.push({
        date: date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
        publicacoes: Math.floor(Math.random() * 500 + 200),
        intimacoes: Math.floor(Math.random() * 200 + 50),
        processados: Math.floor(Math.random() * 300 + 100)
      });
    }

    return {
      totalPublicacoes: 15234,
      totalIntimacoes: 3421,
      totalProcessados: 8912,
      growth: {
        publicacoes: 12.5,
        intimacoes: -3.2,
        processados: 18.7
      },
      statusDistribution: [
        { name: 'Importado', value: 6500, color: '#3b82f6' },
        { name: 'Processado', value: 5200, color: '#10b981' },
        { name: 'Pendente', value: 3534, color: '#f59e0b' }
      ],
      trendData,
      topDiarios: [
        { name: 'DJSP', count: 4231 },
        { name: 'DJRJ', count: 2145 },
        { name: 'DJMG', count: 1876 },
        { name: 'DJBA', count: 1234 },
        { name: 'DJPE', count: 948 }
      ]
    };
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-40 flex items-center justify-center text-gray-500">
          Carregando analytics...
        </div>
      </Card>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-4">
      {/* Time Range Selector */}
      <div className="flex gap-2">
        {['7d', '30d', '1y'].map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              timeRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {range === '7d' ? 'Últimos 7 dias' : range === '30d' ? 'Últimos 30 dias' : 'Últimos 12 meses'}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Publicações</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalPublicacoes.toLocaleString('pt-BR')}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600 opacity-20" />
          </div>
          <p className={`text-sm font-medium mt-2 ${analytics.growth.publicacoes > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {analytics.growth.publicacoes > 0 ? '+' : ''}{analytics.growth.publicacoes}%
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Intimações</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalIntimacoes.toLocaleString('pt-BR')}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-600 opacity-20" />
          </div>
          <p className={`text-sm font-medium mt-2 ${analytics.growth.intimacoes > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {analytics.growth.intimacoes > 0 ? '+' : ''}{analytics.growth.intimacoes}%
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Processados</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalProcessados.toLocaleString('pt-BR')}</p>
            </div>
            <PieChartIcon className="w-8 h-8 text-purple-600 opacity-20" />
          </div>
          <p className={`text-sm font-medium mt-2 ${analytics.growth.processados > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {analytics.growth.processados > 0 ? '+' : ''}{analytics.growth.processados}%
          </p>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card className="p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Tendência de Documentos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="publicacoes" stroke="#3b82f6" strokeWidth={2} name="Publicações" />
            <Line type="monotone" dataKey="intimacoes" stroke="#f59e0b" strokeWidth={2} name="Intimações" />
            <Line type="monotone" dataKey="processados" stroke="#10b981" strokeWidth={2} name="Processados" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Distribution */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Distribuição por Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analytics.statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={entry => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={value => value.toLocaleString('pt-BR')} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Diários */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Top Diários Oficiais</h3>
          <div className="space-y-3">
            {analytics.topDiarios.map((diario, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{diario.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${(diario.count / analytics.topDiarios[0].count) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-12 text-right">
                    {diario.count.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}