import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Target,
  TrendingUp,
  Users,
  Code,
  Shield,
  Zap,
  AlertCircle,
  CheckCircle2,
  Rocket
} from 'lucide-react';

export default function Sprint22Planning() {
  const [expandedPhase, setExpandedPhase] = useState(null);

  const phases = [
    {
      id: 1,
      name: 'Performance Optimization',
      points: 4,
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      tasks: [
        'Core Web Vitals optimization',
        'Database query optimization',
        'Frontend bundle size reduction',
        'Advanced caching strategies'
      ]
    },
    {
      id: 2,
      name: 'Security Hardening',
      points: 4,
      icon: Shield,
      color: 'from-red-500 to-orange-500',
      tasks: [
        'Advanced threat detection',
        'Penetration testing program',
        'Zero-trust architecture',
        'Automated security scanning'
      ]
    },
    {
      id: 3,
      name: 'User Experience',
      points: 4,
      icon: Users,
      color: 'from-pink-500 to-rose-500',
      tasks: [
        'Dark mode implementation',
        'Mobile-first redesign',
        'Accessibility compliance',
        'Personalization engine'
      ]
    },
    {
      id: 4,
      name: 'Data & Analytics',
      points: 3,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      tasks: [
        'Real-time data pipelines',
        'Advanced ML models',
        'Custom dashboards',
        'Data privacy compliance'
      ]
    },
    {
      id: 5,
      name: 'Infrastructure',
      points: 3,
      icon: Code,
      color: 'from-purple-500 to-indigo-500',
      tasks: [
        'Edge computing deployment',
        'Serverless architecture',
        'Infrastructure as Code',
        'Disaster recovery drills'
      ]
    }
  ];

  const totalPoints = phases.reduce((sum, p) => sum + p.points, 0);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Rocket className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sprint 22 — Consolidação & Inovação</h1>
            <p className="text-gray-600">Performance, Segurança, UX, Analytics, Infrastructure</p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totalPoints}</div>
              <div className="text-xs text-gray-600 mt-1">Story Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{phases.length}</div>
              <div className="text-xs text-gray-600 mt-1">Iniciativas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">2-3</div>
              <div className="text-xs text-gray-600 mt-1">Semanas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">18</div>
              <div className="text-xs text-gray-600 mt-1">Tarefas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">10M+</div>
              <div className="text-xs text-gray-600 mt-1">Usuários</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Alert className="border-blue-200 bg-blue-50">
        <Target className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900 ml-2">
          <strong>Sprint 22 Objectives:</strong> Consolidar tecnicamente a plataforma com otimizações extremas de performance, segurança impenetrável e UX excepcional, mantendo ritmo de inovação.
        </AlertDescription>
      </Alert>

      {/* Initiatives */}
      <div className="grid grid-cols-1 gap-4">
        {phases.map(phase => {
          const Icon = phase.icon;
          const isExpanded = expandedPhase === phase.id;

          return (
            <Card
              key={phase.id}
              className="hover:shadow-lg transition-all cursor-pointer overflow-hidden"
              onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
            >
              <CardHeader className={`bg-gradient-to-r ${phase.color} text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6" />
                    <div>
                      <CardTitle>{phase.name}</CardTitle>
                      <p className="text-sm text-white/80 mt-1">{phase.points} story points</p>
                    </div>
                  </div>
                  <div className="text-2xl">{isExpanded ? '▼' : '▶'}</div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {phase.tasks.map((task, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="font-medium text-gray-900">{task}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* KPIs */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Sucesso Sprint 22</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700">Performance</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">{'< 1.5s'}</div>
              <div className="text-xs text-gray-600 mt-1">LCP · 95 Lighthouse</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700">Security</div>
              <div className="text-2xl font-bold text-red-600 mt-1">A+</div>
              <div className="text-xs text-gray-600 mt-1">Security Score · Zero incidents</div>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700">UX</div>
              <div className="text-2xl font-bold text-pink-600 mt-1">4.9/5</div>
              <div className="text-xs text-gray-600 mt-1">User Rating · WCAG AAA</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700">Infrastructure</div>
              <div className="text-2xl font-bold text-green-600 mt-1">99.99%</div>
              <div className="text-xs text-gray-600 mt-1">Uptime · < 1ms edge latency</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline Estimado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { week: 'Semana 1', focus: 'Performance + Security', tasks: 'Optimization, Hardening' },
              { week: 'Semana 2', focus: 'UX + Analytics', tasks: 'Redesign, Data Pipelines' },
              { week: 'Semana 3', focus: 'Infrastructure', tasks: 'Edge, Serverless, IaC' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                <div className="w-24 font-semibold text-blue-600">{item.week}</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.focus}</p>
                  <p className="text-sm text-gray-600">{item.tasks}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dependencies */}
      <Card>
        <CardHeader>
          <CardTitle>Pré-requisitos Sprint 22</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Sprint 21 — 100% Concluído</p>
              <p className="text-sm text-gray-600">IA, Enterprise, Global, Developers, Community</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Análise Técnica Completa</p>
              <p className="text-sm text-gray-600">Bottlenecks identificados, roadmap técnico refinado</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Time Técnico em Foco</p>
              <p className="text-sm text-gray-600">Dedicação 100% para otimizações profundas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Consolidando Excelência Técnica</h3>
            <p className="text-white/90">Sprint 22 = Performance extrema, segurança impenetrável, UX excepcional e infraestrutura state-of-the-art.</p>
          </div>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2">
            Iniciar Sprint 22
          </Button>
        </div>
      </div>
    </div>
  );
}