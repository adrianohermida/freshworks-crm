import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export default function TPUSyncAnalyticsDashboard() {
  const [metrics, setMetrics] = useState({
    totalSyncs: 1247,
    successRate: 94.2,
    avgLatency: 234,
    failureCount: 73,
    fallbackCount: 18,
    lastSync: new Date()
  });

  const [trendData] = useState([
    { time: '00:00', success: 92, failed: 8, fallback: 0 },
    { time: '04:00', success: 95, failed: 4, fallback: 1 },
    { time: '08:00', success: 91, failed: 7, fallback: 2 },
    { time: '12:00', success: 96, failed: 3, fallback: 1 },
    { time: '16:00', success: 93, failed: 5, fallback: 2 },
    { time: '20:00', success: 94, failed: 4, fallback: 2 }
  ]);

  const [retryData] = useState([
    { attempt: '1º', count: 1100, success: 1050 },
    { attempt: '2º', count: 150, success: 140 },
    { attempt: '3º', count: 50, success: 45 },
    { attempt: 'Fallback', count: 18, success: 12 }
  ]);

  const recentEvents = [
    { id: 1, type: 'success', message: 'Sincronização bem-sucedida', time: '2 min atrás', process: 'Proc #12345' },
    { id: 2, type: 'retry', message: 'Retry automático (tentativa 2)', time: '8 min atrás', process: 'Proc #12340' },
    { id: 3, type: 'fallback', message: 'Fallback para TPU Local', time: '15 min atrás', process: 'Proc #12335' },
    { id: 4, type: 'success', message: 'Sincronização bem-sucedida', time: '1h atrás', process: 'Proc #12330' }
  ];

  const getEventColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'retry': return 'bg-yellow-100 text-yellow-800';
      case 'fallback': return 'bg-blue-100 text-blue-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4" />;
      case 'retry': return <Clock className="w-4 h-4" />;
      case 'fallback': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Analytics TPU Sync</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Validação, Retry e Fallback em tempo real</p>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{metrics.totalSyncs}</p>
            <p className="text-xs text-gray-600 mt-2">Total Syncs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-600">{metrics.successRate.toFixed(1)}%</p>
            <p className="text-xs text-gray-600 mt-2">Taxa Sucesso</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-orange-600">{metrics.avgLatency}ms</p>
            <p className="text-xs text-gray-600 mt-2">Latência Média</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-red-600">{metrics.failureCount}</p>
            <p className="text-xs text-gray-600 mt-2">Falhas (1º Tentativa)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{metrics.fallbackCount}</p>
            <p className="text-xs text-gray-600 mt-2">Fallbacks Ativados</p>
          </CardContent>
        </Card>
      </div>

      {/* TREND CHART */}
      <Card>
        <CardHeader>
          <CardTitle>Taxa de Sucesso por Hora</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="success" stroke="#10b981" name="Sucesso %" />
              <Line type="monotone" dataKey="failed" stroke="#ef4444" name="Falha %" />
              <Line type="monotone" dataKey="fallback" stroke="#3b82f6" name="Fallback %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* RETRY EFFECTIVENESS */}
      <Card>
        <CardHeader>
          <CardTitle>Efetividade do Retry Automático</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={retryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="attempt" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" name="Tentativas" />
              <Bar dataKey="success" fill="#10b981" name="Sucesso" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* SYNC DETAILS */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes de Sincronização</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Taxa Sucesso 1ª Tentativa</p>
              <Progress value={88} />
              <p className="text-xs font-semibold mt-1">88%</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Taxa Sucesso c/ Retry</p>
              <Progress value={93} />
              <p className="text-xs font-semibold mt-1">93%</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Taxa Sucesso c/ Fallback</p>
              <Progress value={67} />
              <p className="text-xs font-semibold mt-1">67%</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Taxa Falha Total</p>
              <Progress value={5} />
              <p className="text-xs font-semibold mt-1">5.8%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RECENT EVENTS */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos Recentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentEvents.map(event => (
            <div key={event.id} className={`p-3 rounded-lg border flex items-start gap-3 ${getEventColor(event.type)}`}>
              {getEventIcon(event.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{event.message}</p>
                <p className="text-xs opacity-75">{event.process} • {event.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* INFO */}
      <Card className="bg-green-50 dark:bg-green-900/20">
        <CardContent className="pt-6 text-sm text-green-900 dark:text-green-100 space-y-2">
          <p>✓ <strong>Validação de Schema:</strong> Antes de sincronizar dados</p>
          <p>✓ <strong>Retry Automático:</strong> 3 tentativas com backoff exponencial</p>
          <p>✓ <strong>Fallback Inteligente:</strong> TPU Local quando DataJud falha</p>
          <p>✓ <strong>Analytics em Tempo Real:</strong> Rastreamento completo de cada sync</p>
        </CardContent>
      </Card>
    </div>
  );
}