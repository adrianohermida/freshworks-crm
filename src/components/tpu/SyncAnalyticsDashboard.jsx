import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, AlertCircle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import RelatorioBotao from './RelatorioBotao';

export default function SyncAnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [periodo, setPeriodo] = useState('7d'); // 7d, 30d, 90d

  useEffect(() => {
    carregarAnalytics();
  }, [periodo]);

  const carregarAnalytics = async () => {
    try {
      setIsLoading(true);
      const sincs = await base44.entities.TPUSincronizacao.list('-data_sincronizacao', 500);

      // Filtrar por período
      const dataLimite = new Date();
      const dias = periodo === '7d' ? 7 : periodo === '30d' ? 30 : 90;
      dataLimite.setDate(dataLimite.getDate() - dias);

      const sincsFiltradas = sincs.filter(s => new Date(s.data_sincronizacao) >= dataLimite);

      // Calcular métricas
      const metricas = processarMetricas(sincsFiltradas);
      setData(metricas);
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processarMetricas = (sincs) => {
    // Por dia
    const porDia = {};
    sincs.forEach(s => {
      const data = new Date(s.data_sincronizacao).toLocaleDateString('pt-BR');
      if (!porDia[data]) {
        porDia[data] = { data, sucesso: 0, erro: 0, pendente: 0, total: 0 };
      }
      porDia[data][s.status]++;
      porDia[data].total++;
    });

    const chartData = Object.values(porDia).sort((a, b) => new Date(a.data) - new Date(b.data));

    // Status distribution
    const sucessos = sincs.filter(s => s.status === 'sucesso').length;
    const erros = sincs.filter(s => s.status === 'erro').length;
    const pendentes = sincs.filter(s => s.status === 'pendente').length;

    // Tempo médio
    const tempoMedio = sincs.length > 0
      ? Math.round(sincs.reduce((sum, s) => sum + (s.tempo_execucao_ms || 0), 0) / sincs.length)
      : 0;

    // Top movimentos
    const totalMovimentos = sincs.reduce((sum, s) => sum + (s.total_movimentos_sincronizados || 0), 0);
    const totalNovos = sincs.reduce((sum, s) => sum + (s.total_novos || 0), 0);

    return {
      chartData,
      sucessos,
      erros,
      pendentes,
      total: sincs.length,
      tempoMedio,
      totalMovimentos,
      totalNovos,
      taxaSucesso: sincs.length > 0 ? Math.round((sucessos / sincs.length) * 100) : 0
    };
  };

  if (isLoading || !data) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="w-12 h-12 mx-auto text-gray-400 animate-pulse mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Carregando análises...</p>
      </div>
    );
  }

  const statusData = [
    { name: 'Sucesso', value: data.sucessos, fill: '#10b981' },
    { name: 'Erro', value: data.erros, fill: '#ef4444' },
    { name: 'Pendente', value: data.pendentes, fill: '#eab308' }
  ];

  const verificarAlertas = async () => {
    try {
      const resultado = await base44.functions.invoke('alertarPerformanceSincronizacao', {});
      alert(`Status: ${resultado.status}\n\nAlertas: ${resultado.alertas.length}`);
    } catch (error) {
      alert('Erro ao verificar alertas: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER COM PERÍODO E ACTIONS */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h3 className="text-xl font-bold">Análise de Sincronizações</h3>
        </div>
        <div className="flex items-center gap-3">
          <RelatorioBotao />
          <Button
            variant="outline"
            size="sm"
            onClick={verificarAlertas}
            className="gap-2"
          >
            <Bell className="w-4 h-4" />
            Verificar Alertas
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{data.total}</p>
        </Card>
        <Card className="p-4 border-green-200 dark:border-green-700">
          <p className="text-sm text-green-600 dark:text-green-400">✓ Sucessos</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{data.sucessos}</p>
        </Card>
        <Card className="p-4 border-red-200 dark:border-red-700">
          <p className="text-sm text-red-600 dark:text-red-400">✗ Erros</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{data.erros}</p>
        </Card>
        <Card className="p-4 border-blue-200 dark:border-blue-700">
          <p className="text-sm text-blue-600 dark:text-blue-400">⏱ Tempo Médio</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{data.tempoMedio}ms</p>
        </Card>
        <Card className="p-4 border-purple-200 dark:border-purple-700">
          <p className="text-sm text-purple-600 dark:text-purple-400">Taxa Sucesso</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">{data.taxaSucesso}%</p>
        </Card>
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LINHA: Trend ao longo do tempo */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Trend de Sincronizações</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" style={{ fontSize: '12px' }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sucesso" stroke="#10b981" name="Sucesso" strokeWidth={2} />
              <Line type="monotone" dataKey="erro" stroke="#ef4444" name="Erro" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* PIE: Distribuição de Status */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Distribuição de Status</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* BARRAS: Volume de movimentos */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Volume de Movimentos</h4>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Sincronizado</p>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-8 flex items-center px-3">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {data.totalMovimentos} movimentos
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Registros Novos</p>
              <div className="bg-green-200 dark:bg-green-900 rounded-full h-8 flex items-center px-3">
                <div className="text-sm font-semibold text-green-900 dark:text-green-100">
                  {data.totalNovos} novos
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* INSIGHTS */}
        <Card className="p-6 bg-blue-50 dark:bg-blue-900">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Insights
          </h4>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li className="flex items-start gap-2">
              <span className="font-bold">→</span>
              Taxa de sucesso está em <strong>{data.taxaSucesso}%</strong>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">→</span>
              Tempo médio de sincronização: <strong>{data.tempoMedio}ms</strong>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">→</span>
              Total de <strong>{data.totalMovimentos}</strong> movimentos sincronizados
            </li>
            {data.erros > 0 && (
              <li className="flex items-start gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <strong>{data.erros}</strong> falhas detectadas neste período
              </li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}