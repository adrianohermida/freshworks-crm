import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, RefreshCw, FileText, Users, Bell, BarChart2, Layers } from 'lucide-react';

const PHASES = [
  {
    id: 'p1', name: 'Multi-Tenancy & Onboarding', icon: Layers, points: 4, color: 'indigo',
    tasks: [
      { id: 't1', name: 'Tenant isolation engine', pts: 2, fn: 'multitenancy/tenantIsolation', status: 'completed' },
      { id: 't2', name: 'Onboarding wizard automatizado', pts: 2, fn: 'multitenancy/onboardingWizard', status: 'completed' },
    ]
  },
  {
    id: 'p2', name: 'Notificações Avançadas', icon: Bell, points: 3, color: 'orange',
    tasks: [
      { id: 't3', name: 'Canal de notificações in-app em tempo real', pts: 1.5, fn: 'notifications/realtimeNotifications', status: 'completed' },
      { id: 't4', name: 'Digest diário/semanal por email', pts: 1.5, fn: 'notifications/digestEmail', status: 'completed' },
    ]
  },
  {
    id: 'p3', name: 'Colaboração em Equipe', icon: Users, points: 3, color: 'teal',
    tasks: [
      { id: 't5', name: 'Comentários em publicações/processos', pts: 1.5, fn: 'collaboration/comentariosEngine', status: 'completed' },
      { id: 't6', name: 'Atribuição e menções de usuários', pts: 1.5, fn: 'collaboration/atribuicaoEngine', status: 'completed' },
    ]
  },
  {
    id: 'p4', name: 'Relatórios Avançados', icon: BarChart2, points: 3, color: 'cyan',
    tasks: [
      { id: 't7', name: 'Relatório de produtividade por advogado', pts: 1.5, fn: 'reports/produtividadeAdvogado', status: 'completed' },
      { id: 't8', name: 'Painel de SLA e conformidade', pts: 1.5, fn: 'reports/slaConformidade', status: 'completed' },
    ]
  }
];

const colorMap = {
  indigo: { badge: 'bg-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: 'text-indigo-600' },
  orange: { badge: 'bg-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-600' },
  teal:   { badge: 'bg-teal-600', bg: 'bg-teal-50', border: 'border-teal-200', icon: 'text-teal-600' },
  cyan:   { badge: 'bg-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200', icon: 'text-cyan-600' },
};

export default function Sprint17Execution() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState({});
  const [expanded, setExpanded] = useState('p1');

  const totalPts = PHASES.reduce((s, p) => s + p.points, 0);
  const completedPts = PHASES.reduce((s, p) =>
    s + p.tasks.filter(t => t.status === 'completed').reduce((a, t) => a + t.pts, 0), 0);
  const progress = Math.round((completedPts / totalPts) * 100);

  const testFn = async (task) => {
    setLoading(l => ({ ...l, [task.id]: true }));
    const res = await base44.functions.invoke(task.fn, {});
    setTestResults(r => ({ ...r, [task.id]: res.data }));
    setLoading(l => ({ ...l, [task.id]: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Sprint 17: Execution Board</h1>
          <p className="text-gray-600">Multi-Tenancy · Notificações · Colaboração · Relatórios</p>
        </div>

        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Sprint 17 — Progress</span>
              <Badge className={progress === 100 ? 'bg-green-600' : 'bg-blue-600'}>{progress}%</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">{completedPts}/{totalPts} Story Points</span>
                <span className="text-gray-500">{totalPts - completedPts} remaining</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {PHASES.map(p => {
                const done = p.tasks.filter(t => t.status === 'completed').length;
                const pct = Math.round((done / p.tasks.length) * 100);
                return (
                  <div key={p.id} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{pct}%</div>
                    <div className="text-xs text-gray-500">{p.name.split(' ')[0]}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sprint 16 Review Banner */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3 flex-wrap">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-900">Sprint 16 — Revisão: 100% ✅</span>
              <span className="text-green-700 text-sm">Analytics BI · MFA · Teams/WhatsApp · IA Classifier · Prazo Sugestor — 13/13pts</span>
            </div>
          </CardContent>
        </Card>

        {/* Phase Cards */}
        <div className="space-y-4">
          {PHASES.map(phase => {
            const Icon = phase.icon;
            const c = colorMap[phase.color];
            const isOpen = expanded === phase.id;
            const phasePts = phase.tasks.filter(t => t.status === 'completed').reduce((a, t) => a + t.pts, 0);

            return (
              <Card key={phase.id} className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setExpanded(isOpen ? null : phase.id)}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${c.icon}`} />
                      <span>{phase.name}</span>
                      <Badge className={c.badge}>{phase.points}pts</Badge>
                      <Badge className="bg-green-600">✅ 100%</Badge>
                    </div>
                    <span className="text-sm font-normal text-gray-500">{phasePts}/{phase.points}pts</span>
                  </CardTitle>
                </CardHeader>
                {isOpen && (
                  <CardContent className="space-y-3">
                    {phase.tasks.map(task => (
                      <div key={task.id} className={`p-3 rounded-lg ${c.bg} ${c.border} border`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium">{task.name}</span>
                            <Badge variant="secondary">{task.pts}pts</Badge>
                          </div>
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1"
                            disabled={loading[task.id]}
                            onClick={e => { e.stopPropagation(); testFn(task); }}>
                            {loading[task.id] ? <RefreshCw className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3" />}
                            Testar
                          </Button>
                        </div>
                        <div className="text-xs text-gray-500 font-mono">fn: {task.fn}</div>
                        {testResults[task.id] && (
                          <div className="mt-2 bg-black/10 rounded p-2 text-xs font-mono max-h-28 overflow-auto">
                            {JSON.stringify(testResults[task.id], null, 2).substring(0, 400)}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Completion Banner */}
        <Card className="bg-green-50 border-green-300 border-2">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-green-900">Sprint 17 — 100% COMPLETO ✅</h2>
              <p className="text-green-700">13/13 story points · 8 functions · 0 pendências</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {['Multi-Tenancy', 'Notificações RT', 'Colaboração', 'Relatórios SLA'].map((item, i) => (
                  <div key={i} className="bg-green-100 rounded-lg p-2 text-green-800 text-sm font-medium">✅ {item}</div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}