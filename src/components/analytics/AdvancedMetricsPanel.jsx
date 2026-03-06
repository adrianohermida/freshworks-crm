import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Loader2, RefreshCw } from 'lucide-react';

export default function AdvancedMetricsPanel() {
  const [period, setPeriod] = useState('daily');

  const { data: metrics = [], isLoading, refetch } = useQuery({
    queryKey: ['analyticsMetrics', period],
    queryFn: async () => {
      const all = await base44.entities.AnalyticsMetric.list();
      return all.filter(m => m.period === period).slice(0, 20);
    },
    initialData: []
  });

  const calculateMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('calculateAnalytics', {
        period,
        category: 'system'
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('📊 Métricas recalculadas!');
      refetch();
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    }
  });

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <div className="w-4 h-4" />;
  };

  const getStatusColor = (metric) => {
    if (!metric.target_value) return 'bg-blue-50';
    if (metric.metric_type === 'percentage') {
      return metric.value >= metric.target_value ? 'bg-green-50' : 'bg-red-50';
    }
    return metric.value <= metric.target_value ? 'bg-green-50' : 'bg-yellow-50';
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Analytics Avançadas</CardTitle>
            <div className="flex gap-2">
              {['daily', 'weekly', 'monthly', 'yearly'].map(p => (
                <Button
                  key={p}
                  variant={period === p ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPeriod(p)}
                  className="capitalize"
                >
                  {p === 'daily' && 'Diária'}
                  {p === 'weekly' && 'Semanal'}
                  {p === 'monthly' && 'Mensal'}
                  {p === 'yearly' && 'Anual'}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => calculateMutation.mutate()}
            disabled={calculateMutation.isPending}
            className="gap-2"
          >
            {calculateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Calculando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Recalcular Métricas
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-2 flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : metrics.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500">
            Nenhuma métrica calculada. Clique em "Recalcular Métricas"
          </div>
        ) : (
          metrics.map((metric) => (
            <Card key={metric.id} className={getStatusColor(metric)}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 capitalize">
                      {metric.metric_name.replace(/_/g, ' ')}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {metric.metric_type === 'duration'
                        ? `${metric.value}h`
                        : metric.metric_type === 'percentage'
                        ? `${metric.value.toFixed(1)}%`
                        : metric.value}
                    </p>
                  </div>
                  {getTrendIcon(metric.trend)}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <Badge variant="outline" className="capitalize">
                    {metric.category}
                  </Badge>
                  {metric.target_value && (
                    <span className="text-gray-600">
                      Target: {metric.metric_type === 'percentage' 
                        ? `${metric.target_value}%` 
                        : `${metric.target_value}h`}
                    </span>
                  )}
                </div>

                {metric.comparison_percentage && (
                  <p className="text-xs text-gray-600 mt-2">
                    {metric.comparison_percentage > 0 ? '↑' : '↓'} {Math.abs(metric.comparison_percentage).toFixed(1)}% vs período anterior
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}