import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, TrendingUp, RefreshCw } from 'lucide-react';
import { useAnalyticsCharts } from './useAnalyticsCharts';

const COLORS = ['#00bcd4', '#00e676', '#ff9800', '#f44336', '#2196f3'];

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState('7d');
  const { 
    syncTrendData, 
    syncByTribunalData, 
    eventTypesData,
    successRateData,
    isLoading,
    refetch 
  } = useAnalyticsCharts(period);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-cyan-600" />
            Dashboard de Analytics
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Visualize tendências de sincronização e performance do sistema
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="gap-2"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>

      {/* PERIOD SELECTOR */}
      <div className="flex gap-2">
        {[
          { value: '7d', label: 'Últimos 7 dias' },
          { value: '30d', label: 'Últimos 30 dias' },
          { value: '90d', label: 'Últimos 90 dias' }
        ].map(opt => (
          <Button
            key={opt.value}
            onClick={() => setPeriod(opt.value)}
            variant={period === opt.value ? 'default' : 'outline'}
            className="gap-2"
          >
            <Calendar className="w-4 h-4" />
            {opt.label}
          </Button>
        ))}
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="tribunals">Por Tribunal</TabsTrigger>
          <TabsTrigger value="events">Tipos de Evento</TabsTrigger>
          <TabsTrigger value="success">Taxa de Sucesso</TabsTrigger>
        </TabsList>

        {/* TRENDS TAB */}
        <TabsContent value="trends" className="mt-6">
          <Card className="p-6 dark:bg-gray-800">
            <h4 className="font-semibold mb-4">Sincronizações por Dia</h4>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center text-gray-500">
                Carregando gráfico...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={syncTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#00bcd4" 
                    name="Total Sincronizações"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sucesso" 
                    stroke="#00e676" 
                    name="Sucesso"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="erro" 
                    stroke="#f44336" 
                    name="Erros"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </TabsContent>

        {/* TRIBUNALS TAB */}
        <TabsContent value="tribunals" className="mt-6">
          <Card className="p-6 dark:bg-gray-800">
            <h4 className="font-semibold mb-4">Sincronizações por Tribunal</h4>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center text-gray-500">
                Carregando gráfico...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={syncByTribunalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tribunal" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#00bcd4" name="Total" />
                  <Bar dataKey="sucesso" fill="#00e676" name="Sucesso" />
                  <Bar dataKey="erro" fill="#f44336" name="Erro" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </TabsContent>

        {/* EVENTS TAB */}
        <TabsContent value="events" className="mt-6">
          <Card className="p-6 dark:bg-gray-800">
            <h4 className="font-semibold mb-4">Distribuição de Eventos</h4>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center text-gray-500">
                Carregando gráfico...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={eventTypesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {eventTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </TabsContent>

        {/* SUCCESS RATE TAB */}
        <TabsContent value="success" className="mt-6">
          <Card className="p-6 dark:bg-gray-800">
            <h4 className="font-semibold mb-4">Taxa de Sucesso por Dia</h4>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center text-gray-500">
                Carregando gráfico...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={successRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="taxa" 
                    stroke="#00e676" 
                    name="Taxa de Sucesso (%)"
                    strokeWidth={2}
                    dot={{ fill: '#00e676', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}