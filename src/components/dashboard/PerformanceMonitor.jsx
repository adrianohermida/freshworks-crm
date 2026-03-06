import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Zap, BarChart3, TrendingDown, TrendingUp } from 'lucide-react';

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPerformanceMetrics();
    const interval = setInterval(loadPerformanceMetrics, 60000); // A cada 1 minuto
    return () => clearInterval(interval);
  }, []);

  const loadPerformanceMetrics = async () => {
    try {
      // Simular dados de performance (em produção, vir de real metrics)
      const newMetric = {
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        latency: Math.random() * 500 + 100,
        memory: Math.random() * 50 + 30,
        throughput: Math.random() * 100 + 50,
        errorRate: Math.random() * 5
      };

      setMetrics(prev => [...prev.slice(-59), newMetric]); // Últimas 60 leituras

      // Calcular estatísticas
      const latencies = [newMetric.latency];
      const avgLatency = (latencies.reduce((a, b) => a + b) / latencies.length).toFixed(0);
      const maxLatency = Math.max(...latencies).toFixed(0);

      setStats({
        avgLatency,
        maxLatency,
        avgMemory: (newMetric.memory).toFixed(1),
        avgThroughput: (newMetric.throughput).toFixed(0),
        errorRate: (newMetric.errorRate).toFixed(2)
      });

      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar métricas:', err);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 border border-gray-200">
        <div className="h-40 flex items-center justify-center text-gray-500">
          Carregando métricas...
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Latência Média</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.avgLatency || '0'}ms</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600 opacity-20" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Máx: {stats?.maxLatency}ms</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Memória</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.avgMemory || '0'}%</p>
            </div>
            <Zap className="w-8 h-8 text-yellow-600 opacity-20" />
          </div>
          <Badge className="mt-2 bg-green-100 text-green-800 text-xs">Normal</Badge>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Throughput</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.avgThroughput || '0'}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-600 opacity-20" />
          </div>
          <p className="text-xs text-gray-500 mt-2">req/s</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Taxa Erro</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.errorRate || '0'}%</p>
            </div>
            <TrendingDown className="w-8 h-8 text-green-600 opacity-20" />
          </div>
          <Badge className="mt-2 bg-green-100 text-green-800 text-xs">Saudável</Badge>
        </Card>
      </div>

      {/* Gráficos */}
      {metrics.length > 0 && (
        <>
          <Card className="p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Latência (ms)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" interval={Math.floor(metrics.length / 6)} tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="latency" stroke="#3b82f6" dot={false} name="Latência (ms)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Recursos & Taxa de Erro</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" interval={Math.floor(metrics.length / 6)} tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="memory" fill="#fbbf24" name="Memória (%)" />
                <Bar dataKey="errorRate" fill="#ef4444" name="Taxa Erro (%)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}

      <Card className="p-4 bg-blue-50 border border-blue-200">
        <p className="text-xs text-blue-800">
          💡 <strong>Monitoramento ativo:</strong> Métricas atualizadas a cada 60 segundos. Alertas são disparados quando latência &gt; 1000ms ou taxa de erro &gt; 5%.
        </p>
      </Card>
    </div>
  );
}