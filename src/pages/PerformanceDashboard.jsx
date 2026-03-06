import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Database, BarChart3, Settings } from 'lucide-react';
import { useAdminAuth } from '@/components/hooks/useAdminAuth';

export default function PerformanceDashboard() {
  const { user: adminUser, isLoading: authLoading } = useAdminAuth();
  const [metrics, setMetrics] = useState({
    cache_hit_rate: '-',
    avg_query_time: '-',
    db_connections: '-',
    memory_usage: '-'
  });

  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const result = await base44.functions.invoke('metricsCollector', {
          action: 'get_metrics'
        });
        setMetrics(result.data);
      } catch (error) {
        console.error('Erro ao buscar métricas:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const createIndexMutation = useMutation({
    mutationFn: () => base44.functions.invoke('indexDatabase', { action: 'create_indexes' }),
    onSuccess: (result) => {
      alert(`✓ Índices criados:\n${JSON.stringify(result.data.indexes, null, 2)}`);
    }
  });

  const analyzeQueries = useMutation({
    mutationFn: () => base44.functions.invoke('indexDatabase', { action: 'analyze' }),
    onSuccess: (result) => {
      alert(`⚠️ Queries Lentas:\n${JSON.stringify(result.data.slow_queries, null, 2)}`);
    }
  });

  const optimizeQuery = useMutation({
    mutationFn: (data) => base44.functions.invoke('queryOptimization', {
      action: 'optimized_list',
      ...data
    }),
    onSuccess: () => alert('✓ Query otimizada')
  });

  if (authLoading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Performance Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Otimizações de cache, query, e database indexing
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Cache Hit Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{metrics.cache_hit_rate}</p>
              <p className="text-xs text-gray-500">Atualizado em tempo real</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Avg Query Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{metrics.avg_query_time}</p>
              <p className="text-xs text-gray-500">Performance atual</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">DB Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">{metrics.db_connections}</p>
              <p className="text-xs text-gray-500">Conexões ativas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Memory Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">{metrics.memory_usage}</p>
              <p className="text-xs text-gray-500">Consumo atual</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Caching */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Caching Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Estratégias Ativas:</p>
                <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                  <li>✓ Query cache (5min TTL)</li>
                  <li>✓ User session cache (30min)</li>
                  <li>✓ Lazy image loading</li>
                  <li>✓ Virtual list rendering</li>
                </ul>
              </div>
              <Button className="w-full" variant="outline" size="sm">
                Clear Cache
              </Button>
            </CardContent>
          </Card>

          {/* Database */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Índices Criados:</p>
                <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                  <li>✓ Process (status, created_date)</li>
                  <li>✓ Process (cnj_number)</li>
                  <li>✓ Agenda (start_date, status)</li>
                  <li>✓ Deadline (deadline_date)</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => createIndexMutation.mutate()}
                  disabled={createIndexMutation.isPending}
                >
                  Criar Índices
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => analyzeQueries.mutate()}
                  disabled={analyzeQueries.isPending}
                >
                  Analisar Queries
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Query Optimization */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Query Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">Batch Get</p>
                  <p className="text-xs text-green-700 dark:text-green-200">Múltiplos registros em paralelo</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Select Fields</p>
                  <p className="text-xs text-blue-700 dark:text-blue-200">Retornar apenas campos necesários</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Distinct Values</p>
                  <p className="text-xs text-purple-700 dark:text-purple-200">Valores únicos de um campo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}