import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Star, Users, AlertTriangle, RefreshCw } from 'lucide-react';
import FeedbackForm from '../components/feedback/FeedbackForm';
import FeedbackList from '../components/feedback/FeedbackList';

export default function PerformancePage() {
  const [retro, setRetro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('overview');

  const loadRetro = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke('projectEvolutionStatus', {});
      setRetro(res.data.retrospective);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRetro(); }, []);

  const sprintData = retro ? [
    { sprint: 'Sprint 24', completion: retro.sprint_completion.sprint_24 },
    { sprint: 'Sprint 25', completion: retro.sprint_completion.sprint_25 },
    { sprint: 'Sprint 26', completion: retro.sprint_completion.sprint_26 },
  ] : [];

  const tabs = ['overview', 'feedback', 'sprints'];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Retrospectiva & Performance</h1>
          <p className="text-sm text-gray-500">Análise pós-lançamento · 7 dias de observação</p>
        </div>
        <Button onClick={loadRetro} disabled={loading} size="sm" variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'overview' ? 'Visão Geral' : t === 'feedback' ? 'Feedback' : 'Sprints'}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {tab === 'overview' && retro && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-5">
                <p className="text-xs text-gray-500 mb-1">Total Sprints</p>
                <p className="text-3xl font-bold">{retro.summary.total_sprints}</p>
                <p className="text-xs text-gray-400">concluídos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5">
                <p className="text-xs text-gray-500 mb-1">Features</p>
                <p className="text-3xl font-bold">{retro.summary.total_features}+</p>
                <p className="text-xs text-gray-400">implementadas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5">
                <p className="text-xs text-gray-500 mb-1">Satisfação</p>
                <p className="text-3xl font-bold text-yellow-500">
                  {retro.metrics_7d.avg_satisfaction ?? '—'}
                  <span className="text-base">/5</span>
                </p>
                <p className="text-xs text-gray-400">média geral</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5">
                <p className="text-xs text-gray-500 mb-1">Uptime</p>
                <p className="text-3xl font-bold text-green-600">{retro.metrics_7d.uptime_estimate}</p>
                <p className="text-xs text-gray-400">últimos 7 dias</p>
              </CardContent>
            </Card>
          </div>

          {/* Health Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Status de Saúde do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-32">Erros (7 dias)</span>
                    <span className="font-medium">{retro.metrics_7d.total_errors}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-32">Erros críticos</span>
                    <span className={`font-medium ${retro.metrics_7d.critical_errors > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {retro.metrics_7d.critical_errors}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-32">Eventos analytics</span>
                    <span className="font-medium">{retro.metrics_7d.analytics_events}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-32">Feedbacks</span>
                    <span className="font-medium">{retro.metrics_7d.total_feedbacks}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-6xl font-bold ${retro.health.score >= 95 ? 'text-green-600' : retro.health.score >= 85 ? 'text-yellow-500' : 'text-red-600'}`}>
                    {retro.health.score}
                  </div>
                  <p className="text-sm text-gray-500">Score de saúde</p>
                  <Badge className={retro.health.status === 'excellent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {retro.health.status === 'excellent' ? '✅ Excelente' : '⚠️ Atenção'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* FEEDBACK TAB */}
      {tab === 'feedback' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Deixe seu Feedback</h3>
            <FeedbackForm context="post-launch" />
          </div>
          <div>
            <h3 className="font-semibold mb-3">Feedbacks Recebidos</h3>
            <FeedbackList />
          </div>
        </div>
      )}

      {/* SPRINTS TAB */}
      {tab === 'sprints' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Completude por Sprint</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={sprintData}>
                  <XAxis dataKey="sprint" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Bar dataKey="completion" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-3">
            {[
              { name: 'Sprint 24 - Observação Pós-Launch', pct: 80, tasks: 5 },
              { name: 'Sprint 25 - UX & Infraestrutura', pct: 100, tasks: 6 },
              { name: 'Sprint 26 - Qualidade & Estabilidade', pct: 95, tasks: 7 },
            ].map((s, i) => (
              <Card key={i}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{s.name}</span>
                    <Badge className={s.pct === 100 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                      {s.pct}%
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${s.pct === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{s.tasks} tarefas</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}