import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, Zap } from 'lucide-react';

export default function RateLimitingDashboard() {
  const [settings, setSettings] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [settingsRes, statsRes] = await Promise.all([
        base44.functions.invoke('rateLimitingSystem', { action: 'settings' }),
        base44.functions.invoke('rateLimitingSystem', { action: 'stats' })
      ]);
      setSettings(settingsRes.data.settings);
      setStats(statsRes.data.stats);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Sample data
  const hourlyData = [
    { hour: '09:00', requests: 450, limited: 2 },
    { hour: '10:00', requests: 520, limited: 5 },
    { hour: '11:00', requests: 680, limited: 8 },
    { hour: '12:00', requests: 920, limited: 15 },
    { hour: '13:00', requests: 1050, limited: 22 },
    { hour: '14:00', requests: 1250, limited: 34 },
    { hour: '15:00', requests: 1180, limited: 28 }
  ];

  const planComparison = [
    { plan: 'Free', rpm: 10, burst: 20 },
    { plan: 'Pro', rpm: 100, burst: 200 },
    { plan: 'Enterprise', rpm: 1000, burst: 2000 }
  ];

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-8 h-8 text-yellow-500" />
            Rate Limiting System
          </h1>
          <p className="text-gray-600 mt-1">Proteção contra abuso e controle de uso</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-2">Requisições (24h)</p>
              <p className="text-3xl font-bold text-blue-600">{stats?.total_requests_24h.toLocaleString()}</p>
              <p className="text-xs text-gray-600 mt-2">Média por hora: {Math.round(stats?.total_requests_24h / 24)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-2">Taxa Limitada</p>
              <p className="text-3xl font-bold text-orange-600">{stats?.rate_limited_requests}</p>
              <p className="text-xs text-gray-600 mt-2">{stats?.percentage_limited}% do total</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-2">Plano Atual</p>
              <Badge className="bg-purple-600 mb-2">{settings?.current_tier.toUpperCase()}</Badge>
              <p className="text-xs text-gray-600">{settings?.current_limit} req/min</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-2">Latência Média</p>
              <p className="text-3xl font-bold text-green-600">{stats?.avg_response_time_ms}ms</p>
              <Badge className="bg-green-100 text-green-800 mt-2 text-xs">Saudável</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Alert */}
        {stats?.percentage_limited > 1 && (
          <Alert className="bg-orange-50 border-orange-200">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Taxa de rate limiting acima do esperado ({stats?.percentage_limited}%). Considere fazer upgrade de plano.
            </AlertDescription>
          </Alert>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Requisições por Hora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="requests" stroke="#3b82f6" name="Requisições" />
                  <Line type="monotone" dataKey="limited" stroke="#f59e0b" name="Limitadas" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comparação de Planos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={planComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="plan" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rpm" fill="#3b82f6" name="Req/Minuto" />
                  <Bar dataKey="burst" fill="#10b981" name="Burst Size" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Rate Limit Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Planos de Rate Limiting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {settings?.plans?.map(plan => (
              <div key={plan.tier} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold capitalize">{plan.tier}</p>
                    <p className="text-sm text-gray-600">{plan.requests_per_minute} req/min, {plan.burst_size} burst</p>
                  </div>
                  {plan.tier === settings?.current_tier && (
                    <Badge className="bg-green-600">Atual</Badge>
                  )}
                </div>
                <Progress value={Math.min(100, (plan.requests_per_minute / 100) * 50)} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">💡 Melhores Práticas</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-900 space-y-2">
            <p>• Implemente exponential backoff com retry logic</p>
            <p>• Monitore headers X-RateLimit-* nas respostas</p>
            <p>• Cache respostas para reduzir requisições</p>
            <p>• Use batch requests quando possível</p>
            <p>• Implemente circuit breakers para falhas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}