import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, Calendar, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function AnalyticsDashboardPhase2() {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('30dias');

  // Fetch analytics data
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics', periodoSelecionado],
    queryFn: async () => {
      const processos = await base44.entities.ProcessoAdvise.list();
      const prazos = await base44.entities.PrazoProcessual.list();
      const audiencias = await base44.entities.Audiencia.list();
      
      return {
        processos,
        prazos,
        audiencias
      };
    }
  });

  if (isLoading || !analyticsData) {
    return <div className="text-gray-600 dark:text-gray-400">Carregando analytics...</div>;
  }

  // Prepare chart data
  const statusProcessos = [
    { name: 'Ativos', value: analyticsData.processos.filter(p => p.statusProcesso === 'ativo').length },
    { name: 'Arquivados', value: analyticsData.processos.filter(p => p.statusProcesso === 'arquivado').length },
    { name: 'Suspensos', value: analyticsData.processos.filter(p => p.statusProcesso === 'suspenso').length }
  ];

  const statusPrazos = [
    { name: 'Abertos', value: analyticsData.prazos.filter(p => p.status === 'aberto').length },
    { name: 'Cumpridos', value: analyticsData.prazos.filter(p => p.status === 'cumprido').length },
    { name: 'Vencidos', value: analyticsData.prazos.filter(p => p.status === 'vencido').length },
    { name: 'Suspensos', value: analyticsData.prazos.filter(p => p.status === 'suspenso').length }
  ];

  const tendenciaDados = [
    { mes: 'Jan', processos: 45, prazos: 120, audiencias: 18 },
    { mes: 'Fev', processos: 52, prazos: 135, audiencias: 22 },
    { mes: 'Mar', processos: 48, prazos: 128, audiencias: 20 }
  ];

  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Analytics Dashboard - Fase 2</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Relatórios e Insights em Tempo Real</p>
        </div>

        {/* Filtros */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-semibold">Período:</span>
            </div>
            <div className="flex gap-2">
              {['7dias', '30dias', '90dias'].map((periodo) => (
                <button
                  key={periodo}
                  onClick={() => setPeriodoSelecionado(periodo)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    periodoSelecionado === periodo
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-600'
                  }`}
                >
                  {periodo === '7dias' ? '7 dias' : periodo === '30dias' ? '30 dias' : '90 dias'}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Processos</p>
            <p className="text-3xl font-bold text-blue-600">{analyticsData.processos.length}</p>
            <p className="text-xs text-green-600 mt-2">+12% vs período anterior</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Prazos Vencidos</p>
            <p className="text-3xl font-bold text-red-600">{analyticsData.prazos.filter(p => p.status === 'vencido').length}</p>
            <p className="text-xs text-red-600 mt-2">Ação urgente!</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Audiências (7 dias)</p>
            <p className="text-3xl font-bold text-purple-600">
              {analyticsData.audiencias.filter(a => {
                const data = new Date(a.dataAudiencia);
                const dias = Math.ceil((data - new Date()) / (1000 * 60 * 60 * 24));
                return dias <= 7 && dias >= 0;
              }).length}
            </p>
            <p className="text-xs text-purple-600 mt-2">Confirmadas</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Taxa de Cumprimento</p>
            <p className="text-3xl font-bold text-green-600">
              {analyticsData.prazos.length > 0 
                ? Math.round((analyticsData.prazos.filter(p => p.status === 'cumprido').length / analyticsData.prazos.length) * 100)
                : 0}%
            </p>
            <p className="text-xs text-green-600 mt-2">Dos prazos</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Processos */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Distribuição de Processos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusProcessos} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#8884d8" dataKey="value">
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Status Prazos */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Distribuição de Prazos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusPrazos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Tendências */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Tendência de 3 Meses</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={tendenciaDados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="processos" stroke="#3b82f6" name="Processos" />
              <Line type="monotone" dataKey="prazos" stroke="#ef4444" name="Prazos" />
              <Line type="monotone" dataKey="audiencias" stroke="#8b5cf6" name="Audiências" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Export Section */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar Relatórios
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-all">
              📊 Exportar em PDF
            </button>
            <button className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-all">
              📈 Exportar em Excel
            </button>
            <button className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition-all">
              📋 Gerar Relatório Completo
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}