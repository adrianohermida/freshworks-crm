import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, Globe, Cpu, CheckCircle2, Clock, RefreshCw, Download, FileText } from 'lucide-react';

const PHASES = [
  {
    id: 'p1', name: 'Analytics & BI', icon: TrendingUp, points: 4, color: 'blue',
    tasks: [
      { id: 't1', name: 'Dashboard BI com KPIs executivos', pts: 2, fn: 'analytics/biDashboard', status: 'completed' },
      { id: 't2', name: 'Relatórios exportáveis (PDF)', pts: 1, fn: 'analytics/exportReport', status: 'completed' },
      { id: 't3', name: 'Métricas de uso e ROI', pts: 1, fn: 'analytics/biDashboard', status: 'completed' },
    ]
  },
  {
    id: 'p2', name: 'Segurança & LGPD', icon: Shield, points: 3, color: 'red',
    tasks: [
      { id: 't4', name: 'MFA (autenticação multi-fator)', pts: 1.5, fn: 'security/mfaService', status: 'completed' },
      { id: 't5', name: 'Auditoria forense LGPD avançado', pts: 1.5, fn: 'security/mfaService', status: 'completed' },
    ]
  },
  {
    id: 'p3', name: 'Integrações', icon: Globe, points: 3, color: 'green',
    tasks: [
      { id: 't6', name: 'Integração Microsoft Teams', pts: 1.5, fn: 'integrations/teamsNotification', status: 'completed' },
      { id: 't7', name: 'Integração WhatsApp Business API', pts: 1.5, fn: 'integrations/whatsappBusiness', status: 'completed' },
    ]
  },
  {
    id: 'p4', name: 'IA & Automação', icon: Cpu, points: 3, color: 'purple',
    tasks: [
      { id: 't8', name: 'Classificação automática por IA', pts: 2, fn: 'ai/publicacaoClassifier', status: 'completed' },
      { id: 't9', name: 'Sugestão de prazos por IA', pts: 1, fn: 'ai/prazoSugestor', status: 'completed' },
    ]
  }
];

const colorMap = {
  blue: { badge: 'bg-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-600' },
  red: { badge: 'bg-red-600', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-600' },
  green: { badge: 'bg-green-600', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-600' },
  purple: { badge: 'bg-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-600' },
};

export default function Sprint16Execution() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState({});
  const [expanded, setExpanded] = useState('p1');

  const totalPts = PHASES.reduce((s, p) => s + p.points, 0);
  const completedPts = PHASES.reduce((s, p) => s + p.tasks.filter(t => t.status === 'completed').reduce((a, t) => a + t.pts, 0), 0);
  const progress = Math.round((completedPts / totalPts) * 100);

  const testFunction = async (task) => {
    setLoading(l => ({ ...l, [task.id]: true }));
    const res = await base44.functions.invoke(task.fn, {});
    setTestResults(r => ({ ...r, [task.id]: res.data }));
    setLoading(l => ({ ...l, [task.id]: false }));
  };

  const exportPDF = async () => {
    setLoading(l => ({ ...l, export: true }));
    const res = await base44.functions.invoke('analytics/exportReport', { format: 'pdf' });
    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'relatorio-legalpush.pdf';
    document.body.appendChild(a); a.click(); URL.revokeObjectURL(url); a.remove();
    setLoading(l => ({ ...l, export: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Sprint 16: Execution Board</h1>
          <p className="text-gray-600">Analytics · Segurança · Integrações · IA</p>
        </div>

        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Sprint Progress</span>
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

        {/* Export CTA */}
        <div className="flex gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={exportPDF} disabled={loading.export}>
            {loading.export ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Exportar Relatório PDF
          </Button>
        </div>

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
                      <Badge className="bg-green-600">100% ✅</Badge>
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
                            onClick={(e) => { e.stopPropagation(); testFunction(task); }}>
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
              <h2 className="text-2xl font-bold text-green-900">Sprint 16 — 100% COMPLETO ✅</h2>
              <p className="text-green-700">13/13 story points entregues · 7 functions deployed · 0 pendências</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {['BI Dashboard', 'MFA Service', 'Teams + WhatsApp', 'IA Classifier'].map((item, i) => (
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