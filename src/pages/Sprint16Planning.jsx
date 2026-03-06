import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, TrendingUp, Shield, Globe, Cpu, ArrowRight, Star } from 'lucide-react';

const SPRINT15_DELIVERABLES = [
  { name: 'Mobile App Initialize (backend)', status: 'completed' },
  { name: 'Mobile Offline Sync + Push Tokens', status: 'completed' },
  { name: 'Mobile MVP UI (MobileApp page)', status: 'completed' },
  { name: 'Advanced Filter Engine (backend)', status: 'completed' },
  { name: 'AdvancedFilterBuilder (component)', status: 'completed' },
  { name: 'Workflow Engine (backend)', status: 'completed' },
  { name: 'WorkflowBuilder (component)', status: 'completed' },
  { name: 'Community Engine (backend)', status: 'completed' },
  { name: 'CommunityForumWidget (component)', status: 'completed' },
  { name: 'Sprint15Features (demo page)', status: 'completed' }
];

const SPRINT16_PHASES = [
  {
    id: 'p1',
    icon: TrendingUp,
    name: 'Analytics & Business Intelligence',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    points: 4,
    tasks: [
      { name: 'Dashboard BI com KPIs executivos', pts: 2 },
      { name: 'Relatórios exportáveis (PDF/Excel)', pts: 1 },
      { name: 'Métricas de uso e ROI', pts: 1 }
    ]
  },
  {
    id: 'p2',
    icon: Shield,
    name: 'Segurança & Compliance Avançado',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    points: 3,
    tasks: [
      { name: 'MFA (autenticação multi-fator)', pts: 1.5 },
      { name: 'Auditoria forense e LGPD avançado', pts: 1.5 }
    ]
  },
  {
    id: 'p3',
    icon: Globe,
    name: 'Integrações de Terceiros',
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    points: 3,
    tasks: [
      { name: 'Integração Microsoft Teams', pts: 1.5 },
      { name: 'Integração WhatsApp Business API', pts: 1.5 }
    ]
  },
  {
    id: 'p4',
    icon: Cpu,
    name: 'IA & Automação Inteligente',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    points: 3,
    tasks: [
      { name: 'Classificação automática de publicações por IA', pts: 2 },
      { name: 'Sugestão de prazos processuais por IA', pts: 1 }
    ]
  }
];

export default function Sprint16Planning() {
  const [activePhase, setActivePhase] = useState('p1');
  const totalPoints = SPRINT16_PHASES.reduce((s, p) => s + p.points, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Sprint 16 Planning</h1>
            <Badge className="bg-blue-600">Iniciando 05/03/2026</Badge>
            <Badge variant="outline">{totalPoints} story points</Badge>
          </div>
          <p className="text-gray-600">Analytics · Segurança · Integrações · IA</p>
        </div>

        {/* Sprint 15 Review */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <CheckCircle2 className="w-5 h-5" />
              Sprint 15 — Revisão Final (100% ✅)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-2">
              {SPRINT15_DELIVERABLES.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-green-800">{d.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <p className="text-green-900 font-semibold text-sm">
                🎯 13/13 story points entregues · 10 artefatos criados · 0 pendências
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sprint 16 Roadmap */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sprint 16 — Roadmap</h2>

          {/* Phase Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {SPRINT16_PHASES.map(phase => {
              const Icon = phase.icon;
              return (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(phase.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    activePhase === phase.id
                      ? `${phase.bg} ${phase.border}`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1 ${activePhase === phase.id ? phase.color : 'text-gray-400'}`} />
                  <p className={`text-xs font-semibold ${activePhase === phase.id ? phase.color : 'text-gray-600'}`}>
                    {phase.name.split(' ')[0]}
                  </p>
                  <p className="text-xs text-gray-400">{phase.points}pts</p>
                </button>
              );
            })}
          </div>

          {/* Active Phase Detail */}
          {SPRINT16_PHASES.filter(p => p.id === activePhase).map(phase => {
            const Icon = phase.icon;
            return (
              <Card key={phase.id} className={`${phase.bg} ${phase.border} border-2`}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-3 ${phase.color}`}>
                    <Icon className="w-6 h-6" />
                    {phase.name}
                    <Badge variant="outline" className={phase.color}>{phase.points} pts</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {phase.tasks.map((task, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/70 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <Star className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-800">{task.name}</span>
                      </div>
                      <Badge variant="secondary">{task.pts}pts</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Sprint Overview */}
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Story Points', value: totalPoints, color: 'text-blue-600' },
            { label: 'Duração Estimada', value: '10 dias', color: 'text-purple-600' },
            { label: 'Fases', value: '4', color: 'text-green-600' },
            { label: 'Progresso Projeto', value: '100%', color: 'text-orange-600' }
          ].map((m, i) => (
            <Card key={i}>
              <CardContent className="pt-4 text-center">
                <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                <p className="text-xs text-gray-500 mt-1">{m.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="flex gap-3 flex-wrap">
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <ArrowRight className="w-4 h-4" />
            Iniciar Sprint 16 — Analytics
          </Button>
          <Button variant="outline">Ver Sprint 15 Features</Button>
        </div>
      </div>
    </div>
  );
}