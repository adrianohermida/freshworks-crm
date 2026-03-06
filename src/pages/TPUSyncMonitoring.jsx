import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, AlertCircle, CheckCircle2, Loader2, RefreshCw, TrendingUp } from 'lucide-react';

export default function TPUSyncMonitoring() {
  const [refreshing, setRefreshing] = useState(false);

  const { data: metrics, refetch } = useQuery({
    queryKey: ['tpu-sync-metrics'],
    queryFn: async () => {
      const response = await base44.functions.invoke('tpuSyncIntegrityMonitor', {});
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: true
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (!metrics) return <div>Carregando...</div>;

  const getAnomalySeverity = (level) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-100 border-red-500 text-red-700';
      case 'WARNING': return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      default: return 'bg-blue-100 border-blue-500 text-blue-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              🔍 TPU Sync Integrity Monitor
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitoramento em tempo real: Volume, Erros, Latência, Schemas
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            size="lg"
            className="gap-2"
          >
            {refreshing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </>
            )}
          </Button>
        </div>

        {/* KEY METRICS CARDS */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4 dark:bg-gray-800 bg-blue-50 dark:bg-blue-900">
            <div className="text-sm text-gray-600">Volume Sincronizado</div>
            <div className="text-3xl font-bold text-blue-600">
              {metrics.summary.totalSynced}
            </div>
            <p className="text-xs text-gray-500 mt-1">registros</p>
          </Card>

          <Card className="p-4 dark:bg-gray-800 bg-red-50 dark:bg-red-900">
            <div className="text-sm text-gray-600">Taxa de Erro</div>
            <div className={`text-3xl font-bold ${metrics.summary.errorRate > '5%' ? 'text-red-600' : 'text-green-600'}`}>
              {metrics.summary.errorRate}
            </div>
            <p className="text-xs text-gray-500 mt-1">{metrics.metrics.volume.failed} falhas</p>
          </Card>

          <Card className="p-4 dark:bg-gray-800 bg-purple-50 dark:bg-purple-900">
            <div className="text-sm text-gray-600">Latência Média</div>
            <div className="text-3xl font-bold text-purple-600">
              {metrics.summary.avgLatency}
            </div>
            <p className="text-xs text-gray-500 mt-1">tempo de sync</p>
          </Card>

          <Card className="p-4 dark:bg-gray-800 bg-green-50 dark:bg-green-900">
            <div className="text-sm text-gray-600">Schema Matches</div>
            <div className="text-3xl font-bold text-green-600">
              {metrics.summary.schemaMatches}/{metrics.metrics.schemaComparison.totalChecks}
            </div>
            <p className="text-xs text-gray-500 mt-1">validados</p>
          </Card>

          <Card className={`p-4 dark:bg-gray-800 ${metrics.summary.anomalies > 0 ? 'bg-orange-50 dark:bg-orange-900' : 'bg-green-50 dark:bg-green-900'}`}>
            <div className="text-sm text-gray-600">Anomalias</div>
            <div className={`text-3xl font-bold ${metrics.summary.anomalies > 0 ? 'text-orange-600' : 'text-green-600'}`}>
              {metrics.summary.anomalies}
            </div>
            <p className="text-xs text-gray-500 mt-1">detectadas</p>
          </Card>
        </div>

        {/* ALERTS */}
        {metrics.metrics.anomalies && metrics.metrics.anomalies.length > 0 && (
          <Card className="p-6 dark:bg-gray-800 mb-8 border-l-4 border-orange-500">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              {metrics.metrics.criticalCount > 0 ? (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-orange-600" />
              )}
              Alertas de Anomalias ({metrics.metrics.anomalies.length})
            </h2>

            <div className="space-y-3">
              {metrics.metrics.anomalies.map((anomaly, idx) => (
                <Alert key={idx} className={`border-2 ${getAnomalySeverity(anomaly.level)}`}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-semibold">{anomaly.message}</div>
                    <div className="text-sm mt-1">
                      Limite: {anomaly.threshold} | Atual: {anomaly.current}
                    </div>
                  </AlertDescription>
                  <Badge className={
                    anomaly.level === 'CRITICAL' ? 'bg-red-600' :
                    anomaly.level === 'WARNING' ? 'bg-yellow-600' :
                    'bg-blue-600'
                  }>
                    {anomaly.level}
                  </Badge>
                </Alert>
              ))}
            </div>
          </Card>
        )}

        {/* TABS */}
        <Tabs defaultValue="volume" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="latency">Latência</TabsTrigger>
            <TabsTrigger value="schema">Schemas</TabsTrigger>
            <TabsTrigger value="errors">Erros</TabsTrigger>
          </TabsList>

          {/* VOLUME TAB */}
          <TabsContent value="volume" className="space-y-6">
            <Card className="p-6 dark:bg-gray-800">
              <h3 className="text-xl font-bold mb-6">Volume de Dados Sincronizados</h3>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Total Sincronizado</span>
                    <span className="text-sm font-mono">{metrics.metrics.volume.synced}</span>
                  </div>
                  <Progress value={100} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Taxa de Sucesso</span>
                    <span className="text-sm font-mono">
                      {((metrics.metrics.volume.synced - metrics.metrics.volume.failed) / metrics.metrics.volume.synced * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={((metrics.metrics.volume.synced - metrics.metrics.volume.failed) / metrics.metrics.volume.synced * 100)}
                    className="h-3 bg-green-200"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Duplicatas Detectadas</span>
                    <span className="text-sm font-mono">{metrics.metrics.volume.duplicates}</span>
                  </div>
                  <Progress 
                    value={Math.min((metrics.metrics.volume.duplicates / metrics.metrics.volume.synced * 100), 100)}
                    className="h-3"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                  <div className="p-4 bg-green-50 dark:bg-green-900 rounded">
                    <p className="text-sm text-gray-600">Sucesso</p>
                    <p className="text-2xl font-bold text-green-600">
                      {metrics.metrics.volume.synced - metrics.metrics.volume.failed}
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900 rounded">
                    <p className="text-sm text-gray-600">Falhas</p>
                    <p className="text-2xl font-bold text-red-600">
                      {metrics.metrics.volume.failed}
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded">
                    <p className="text-sm text-gray-600">Duplicatas</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {metrics.metrics.volume.duplicates}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* LATENCY TAB */}
          <TabsContent value="latency" className="space-y-6">
            <Card className="p-6 dark:bg-gray-800">
              <h3 className="text-xl font-bold mb-6">Métricas de Latência</h3>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-50 dark:bg-blue-900 rounded-lg border-l-4 border-blue-600">
                  <p className="text-sm text-gray-600 mb-2">Latência Mínima</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {metrics.metrics.latency.min === Infinity ? 'N/A' : `${metrics.metrics.latency.min}ms`}
                  </p>
                </div>

                <div className="p-6 bg-green-50 dark:bg-green-900 rounded-lg border-l-4 border-green-600">
                  <p className="text-sm text-gray-600 mb-2">Latência Média</p>
                  <p className="text-3xl font-bold text-green-600">
                    {metrics.metrics.latency.avg}ms
                  </p>
                </div>

                <div className="p-6 bg-orange-50 dark:bg-orange-900 rounded-lg border-l-4 border-orange-600">
                  <p className="text-sm text-gray-600 mb-2">Latência Máxima</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {metrics.metrics.latency.max}ms
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm font-semibold mb-2">Performance Status</p>
                <p className="text-sm text-gray-600">
                  {metrics.metrics.latency.avg > 10000 
                    ? '⚠️ Latência acima do esperado (>10s)' 
                    : '✅ Latência dentro dos padrões'}
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* SCHEMA TAB */}
          <TabsContent value="schema" className="space-y-6">
            <Card className="p-6 dark:bg-gray-800">
              <h3 className="text-xl font-bold mb-6">Comparação de Schemas</h3>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="p-6 bg-green-50 dark:bg-green-900 rounded-lg border-l-4 border-green-600">
                  <p className="text-sm text-gray-600 mb-2">Schemas Válidos</p>
                  <p className="text-3xl font-bold text-green-600">
                    {metrics.summary.schemaMatches}/{metrics.metrics.schemaComparison.totalChecks}
                  </p>
                </div>

                <div className="p-6 bg-red-50 dark:bg-red-900 rounded-lg border-l-4 border-red-600">
                  <p className="text-sm text-gray-600 mb-2">Schemas com Mismatch</p>
                  <p className="text-3xl font-bold text-red-600">
                    {metrics.metrics.schemaComparison.mismatches}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Detalhes</h4>
                {metrics.metrics.errors.schema_mismatch && metrics.metrics.errors.schema_mismatch.map((mismatch, idx) => (
                  <div key={idx} className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded border-l-4 border-yellow-600">
                    <p className="font-semibold text-sm">{mismatch.entity}</p>
                    {mismatch.missingFields && (
                      <p className="text-xs text-gray-600 mt-1">
                        Campos faltantes: {mismatch.missingFields.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* ERRORS TAB */}
          <TabsContent value="errors" className="space-y-6">
            <Card className="p-6 dark:bg-gray-800">
              <h3 className="text-xl font-bold mb-6">Log de Erros</h3>

              {metrics.metrics.errors.datajud && metrics.metrics.errors.datajud.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-red-600">DataJud Errors ({metrics.metrics.errors.datajud.length})</h4>
                  <div className="space-y-2">
                    {metrics.metrics.errors.datajud.slice(0, 5).map((err, idx) => (
                      <div key={idx} className="p-3 bg-red-50 dark:bg-red-900 rounded text-sm">
                        <p className="font-mono text-xs">{err.type}</p>
                        <p className="text-gray-600 mt-1">{err.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {metrics.metrics.errors.tpu && metrics.metrics.errors.tpu.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-orange-600">TPU Errors ({metrics.metrics.errors.tpu.length})</h4>
                  <div className="space-y-2">
                    {metrics.metrics.errors.tpu.slice(0, 5).map((err, idx) => (
                      <div key={idx} className="p-3 bg-orange-50 dark:bg-orange-900 rounded text-sm">
                        <p className="font-mono text-xs">{err.type || 'sync_error'}</p>
                        <p className="text-gray-600 mt-1">{err.message || err.error}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* FOOTER */}
        <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg text-center text-sm text-gray-600">
          <p>Última atualização: {new Date(metrics.timestamp).toLocaleString('pt-BR')}</p>
          <p className="mt-2 text-xs">Atualiza automaticamente a cada 5 minutos</p>
        </div>
      </div>
    </div>
  );
}