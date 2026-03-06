import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, FileText, CheckCircle2, Download, Calendar } from 'lucide-react';
import { useTenant } from '@/components/TenantContext';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function AnalyticsDashboard() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const { tenantId } = useTenant();

  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Fetch analytics data
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics', tenantId, dateRange],
    queryFn: async () => {
      const registros = await base44.entities.RegistroBlockchain.filter({
        created_date: { $gte: dateRange.startDate, $lte: dateRange.endDate }
      }, '-created_date', 1000);
      
      const coletas = await base44.entities.ColetaDigital.filter({
        dataColeta: { $gte: dateRange.startDate, $lte: dateRange.endDate }
      }, '-dataColeta', 1000);

      return { registros, coletas };
    },
    enabled: !!tenantId
  });

  // Aggregate data
  const generateChartData = () => {
    if (!analyticsData) return { daily: [], status: [] };

    const dailyData = {};
    analyticsData.registros?.forEach(r => {
      const date = new Date(r.created_date).toLocaleDateString();
      dailyData[date] = (dailyData[date] || 0) + 1;
    });

    const daily = Object.entries(dailyData).map(([date, count]) => ({
      date,
      registros: count
    })).slice(-7);

    const statusCounts = {
      valido: 0,
      pendente: 0,
      expirado: 0
    };

    analyticsData.registros?.forEach(r => {
      if (statusCounts[r.status] !== undefined) {
        statusCounts[r.status]++;
      }
    });

    const status = Object.entries(statusCounts).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value
    }));

    return { daily, status };
  };

  const chartData = generateChartData();

  // KPI Cards
  const kpis = [
    {
      label: 'Total Registrados',
      value: analyticsData?.registros?.length || 0,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      label: 'Válidos & Ativos',
      value: analyticsData?.registros?.filter(r => r.status === 'valido').length || 0,
      icon: CheckCircle2,
      color: 'text-green-600'
    },
    {
      label: 'Coletas Digitais',
      value: analyticsData?.coletas?.length || 0,
      icon: Users,
      color: 'text-purple-600'
    },
    {
      label: 'Taxa de Sucesso',
      value: analyticsData?.registros?.length ? 
        Math.round((analyticsData.registros.filter(r => r.status === 'valido').length / analyticsData.registros.length) * 100) : 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      suffix: '%'
    }
  ];

  const handleExportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      dateRange,
      registros: analyticsData?.registros || [],
      coletas: analyticsData?.coletas || [],
      summary: {
        totalRegistros: analyticsData?.registros?.length || 0,
        validosAtivos: analyticsData?.registros?.filter(r => r.status === 'valido').length || 0,
        coletasDigitais: analyticsData?.coletas?.length || 0
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

  return (
    <div className="space-y-6 p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Button onClick={handleExportData} disabled={!analyticsData} className="gap-2">
          <Download className="w-4 h-4" />
          Export Data
        </Button>
      </div>

      {/* Date Range Filter */}
      <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
        <CardContent className="pt-6">
          <div className="flex items-end gap-4 flex-wrap">
            <div>
              <label className="block text-sm font-semibold mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-3 py-2 border rounded-lg dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="px-3 py-2 border rounded-lg dark:bg-gray-800"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Apply Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card key={idx} className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-sm font-medium opacity-70 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {kpi.label}
                    </p>
                    <p className="text-3xl font-bold mt-2">
                      {kpi.value.toLocaleString()}{kpi.suffix || ''}
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 ${kpi.color} opacity-20`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Registrations */}
        <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
          <CardHeader>
            <CardTitle>Daily Registrations (Last 7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="registros" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.status}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.status.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Coleções Statistics */}
      <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
        <CardHeader>
          <CardTitle>Collections by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: 'Screenshot', count: analyticsData?.coletas?.filter(c => c.tipo === 'screenshot').length || 0 },
              { type: 'Video', count: analyticsData?.coletas?.filter(c => c.tipo === 'video').length || 0 },
              { type: 'Audio', count: analyticsData?.coletas?.filter(c => c.tipo === 'audio').length || 0 },
              { type: 'Image', count: analyticsData?.coletas?.filter(c => c.tipo === 'imagem').length || 0 }
            ].map(item => (
              <div key={item.type} className="flex items-center justify-between p-3 rounded-lg" style={{
                backgroundColor: isDark ? '#374151' : '#f3f4f6'
              }}>
                <span className="font-medium">{item.type}</span>
                <span className="text-lg font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}