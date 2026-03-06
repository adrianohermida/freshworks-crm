import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, TrendingUp, TrendingDown, Download, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MonitoringDashboard() {
  const [metrics, setMetrics] = useState({
    cpu: 45,
    memory: 62,
    errorRate: 0.12,
    responseTime: 185,
    activeUsers: 1247,
    apiCalls: 15840,
    dbConnections: 8,
    failedSync: 2
  });

  const [history, setHistory] = useState([
    { time: '00:00', cpu: 35, memory: 50, errorRate: 0.08, responseTime: 150 },
    { time: '04:00', cpu: 42, memory: 58, errorRate: 0.10, responseTime: 175 },
    { time: '08:00', cpu: 48, memory: 65, errorRate: 0.15, responseTime: 195 },
    { time: '12:00', cpu: 52, memory: 68, errorRate: 0.18, responseTime: 210 },
    { time: '16:00', cpu: 45, memory: 62, errorRate: 0.12, responseTime: 185 }
  ]);

  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.max(20, Math.min(85, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(90, prev.memory + (Math.random() - 0.5) * 8)),
        errorRate: Math.max(0, Math.min(2, prev.errorRate + (Math.random() - 0.5) * 0.3)),
        responseTime: Math.max(100, Math.min(500, prev.responseTime + (Math.random() - 0.5) * 30)),
        activeUsers: Math.max(800, Math.min(2000, Math.round(prev.activeUsers + (Math.random() - 0.5) * 200))),
        apiCalls: Math.round(prev.apiCalls + Math.random() * 5000),
        dbConnections: Math.max(5, Math.min(15, Math.round(prev.dbConnections + (Math.random() - 0.5) * 4))),
        failedSync: Math.max(0, Math.min(5, Math.round(prev.failedSync + (Math.random() - 0.5) * 2)))
      }));
      setLastUpdated(new Date().toLocaleTimeString());
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusColor = (metric, value) => {
    const thresholds = {
      cpu: { warning: 70, critical: 85 },
      memory: { warning: 75, critical: 90 },
      errorRate: { warning: 0.5, critical: 1 },
      responseTime: { warning: 300, critical: 500 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'bg-green-100 text-green-800';

    if (value >= threshold.critical) return 'bg-red-100 text-red-800';
    if (value >= threshold.warning) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getAlertBadge = (metric, value) => {
    const thresholds = {
      cpu: { warning: 70, critical: 85 },
      memory: { warning: 75, critical: 90 },
      errorRate: { warning: 0.5, critical: 1 },
      responseTime: { warning: 300, critical: 500 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return null;

    if (value >= threshold.critical) return <Badge className="bg-red-600 text-xs">CRÍTICO</Badge>;
    if (value >= threshold.warning) return <Badge className="bg-yellow-600 text-xs">AVISO</Badge>;
    return <Badge className="bg-green-600 text-xs">OK</Badge>;
  };

  const exportMetrics = () => {
    const data = JSON.stringify({ metrics, timestamp: new Date().toISOString() }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monitoring-${new Date().toISOString()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* HEADER & CONTROLS */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">📊 Real-time System Monitoring</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Last updated: {lastUpdated} {autoRefresh && '(auto-refresh enabled)'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={autoRefresh ? 'default' : 'outline'}
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="gap-1"
          >
            <RefreshCw className="w-4 h-4" />
            {autoRefresh ? 'Refresh ON' : 'Refresh OFF'}
          </Button>
          <Button size="sm" onClick={exportMetrics} className="gap-1">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* CRITICAL ALERTS */}
      {(metrics.cpu > 85 || metrics.errorRate > 1 || metrics.failedSync > 3) && (
        <Card className="border-l-4 border-l-red-600 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-900 dark:text-red-100">⚠️ Alertas Críticos Detectados</p>
                <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                  {metrics.cpu > 85 && 'CPU > 85%'}
                  {metrics.errorRate > 1 && (metrics.cpu > 85 ? ' | ' : '') + 'Error Rate > 1%'}
                  {metrics.failedSync > 3 && (metrics.cpu > 85 || metrics.errorRate > 1 ? ' | ' : '') + 'Sync Failures > 3'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KEY METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* CPU */}
        <Card className={getStatusColor('cpu', metrics.cpu)}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cpu.toFixed(1)}%</div>
            <Progress value={metrics.cpu} className="mt-2 h-1.5" />
            <div className="mt-2">{getAlertBadge('cpu', metrics.cpu)}</div>
          </CardContent>
        </Card>

        {/* Memory */}
        <Card className={getStatusColor('memory', metrics.memory)}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.memory.toFixed(1)}%</div>
            <Progress value={metrics.memory} className="mt-2 h-1.5" />
            <div className="mt-2">{getAlertBadge('memory', metrics.memory)}</div>
          </CardContent>
        </Card>

        {/* Error Rate */}
        <Card className={getStatusColor('errorRate', metrics.errorRate)}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.errorRate.toFixed(2)}%</div>
            <Progress value={Math.min(metrics.errorRate * 50, 100)} className="mt-2 h-1.5" />
            <div className="mt-2">{getAlertBadge('errorRate', metrics.errorRate)}</div>
          </CardContent>
        </Card>

        {/* Response Time */}
        <Card className={getStatusColor('responseTime', metrics.responseTime)}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.responseTime.toFixed(0)}ms</div>
            <Progress value={Math.min(metrics.responseTime / 5, 100)} className="mt-2 h-1.5" />
            <div className="mt-2">{getAlertBadge('responseTime', metrics.responseTime)}</div>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className="bg-blue-100 text-blue-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers.toLocaleString()}</div>
            <p className="text-xs mt-2 text-blue-600">Live users</p>
          </CardContent>
        </Card>

        {/* API Calls */}
        <Card className="bg-purple-100 text-purple-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">API Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics.apiCalls / 1000).toFixed(1)}k</div>
            <p className="text-xs mt-2 text-purple-600">Last 24h</p>
          </CardContent>
        </Card>

        {/* DB Connections */}
        <Card className="bg-cyan-100 text-cyan-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">DB Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.dbConnections}/15</div>
            <Progress value={(metrics.dbConnections / 15) * 100} className="mt-2 h-1.5" />
            <p className="text-xs mt-2 text-cyan-600">Pool: 15</p>
          </CardContent>
        </Card>

        {/* Failed Syncs */}
        <Card className={metrics.failedSync > 0 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Failed Syncs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.failedSync}</div>
            <p className="text-xs mt-2">{metrics.failedSync === 0 ? '✅ Healthy' : '⚠️ Check logs'}</p>
          </CardContent>
        </Card>
      </div>

      {/* TREND CHART */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="cpu" stroke="#ef4444" name="CPU %" />
              <Line yAxisId="left" type="monotone" dataKey="memory" stroke="#3b82f6" name="Memory %" />
              <Line yAxisId="right" type="monotone" dataKey="responseTime" stroke="#8b5cf6" name="Response Time (ms)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* RECOMMENDATIONS */}
      <Card>
        <CardHeader>
          <CardTitle>📋 System Health Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {metrics.cpu > 70 && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200">
              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                🔍 High CPU Usage Detected
              </p>
              <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-1">
                Consider enabling auto-scaling or optimizing queries.
              </p>
            </div>
          )}
          {metrics.memory > 75 && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200">
              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                💾 High Memory Usage Detected
              </p>
              <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-1">
                Consider clearing cache or restarting services.
              </p>
            </div>
          )}
          {metrics.failedSync > 0 && (
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200">
              <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">
                🔄 Sync Operations Failing
              </p>
              <p className="text-xs text-orange-800 dark:text-orange-200 mt-1">
                Check DataJud API connectivity and retry failed operations.
              </p>
            </div>
          )}
          {metrics.cpu <= 70 && metrics.memory <= 75 && metrics.failedSync === 0 && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200">
              <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                ✅ System Running Smoothly
              </p>
              <p className="text-xs text-green-800 dark:text-green-200 mt-1">
                No immediate actions required. Keep monitoring.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}