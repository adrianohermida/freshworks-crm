import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Target,
  TrendingUp,
  Users,
  Code,
  Zap,
  CheckCircle2,
  Rocket,
  AlertCircle,
  BarChart3
} from 'lucide-react';

export default function Sprint20Planning() {
  const [expandedPhase, setExpandedPhase] = useState(null);

  const phases = [
    {
      id: 1,
      name: 'Post-Launch Monitoring',
      points: 5,
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      tasks: [
        'Real-time error tracking (Sentry)',
        'Performance dashboards (Grafana)',
        'User analytics (Mixpanel)',
        'Incident response automation',
        'SLA monitoring (99.9%)'
      ]
    },
    {
      id: 2,
      name: 'Customer Success',
      points: 4,
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      tasks: [
        'Onboarding program',
        'User training videos',
        'Support ticket automation',
        'Community forum setup',
        'Feedback collection'
      ]
    },
    {
      id: 3,
      name: 'Growth & Expansion',
      points: 5,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      tasks: [
        'Multi-tenant scaling',
        'Regional CDN expansion',
        'API monetization',
        'Partner integration program',
        'International localization'
      ]
    },
    {
      id: 4,
      name: 'Advanced Features',
      points: 4,
      icon: Code,
      color: 'from-orange-500 to-red-500',
      tasks: [
        'AI-powered recommendations',
        'Blockchain audit trail',
        'Advanced analytics',
        'Custom workflows',
        'White-label solution'
      ]
    },
    {
      id: 5,
      name: 'Reliability & Scale',
      points: 3,
      icon: Zap,
      color: 'from-indigo-500 to-blue-500',
      tasks: [
        'Kubernetes auto-scaling',
        'Database sharding',
        'Cache optimization',
        'Load testing',
        'Disaster recovery'
      ]
    }
  ];

  const totalPoints = phases.reduce((sum, p) => sum + p.points, 0);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Rocket className="w-8 h-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sprint 20 — Crescimento & Expansão</h1>
            <p className="text-gray-600">Após produção: monitoramento, sucesso de clientes e novas funcionalidades</p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{totalPoints}</div>
              <div className="text-xs text-gray-600 mt-1">Total Story Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{phases.length}</div>
              <div className="text-xs text-gray-600 mt-1">Fases</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">4</div>
              <div className="text-xs text-gray-600 mt-1">Semanas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">20+</div>
              <div className="text-xs text-gray-600 mt-1">Tarefas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">0%</div>
              <div className="text-xs text-gray-600 mt-1">Concluído</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Goals */}
      <Alert className="border-blue-200 bg-blue-50">
        <Target className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900 ml-2">
          <strong>Objetivos Sprint 20:</strong> Consolidar produção com monitoring 24/7, garantir satisfação de clientes, e iniciar crescimento através de novos recursos e mercados.
        </AlertDescription>
      </Alert>

      {/* Phases */}
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
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{task}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-gray-900 hover:bg-black text-white">
                    Iniciar {phase.name}
                  </Button>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline Estimado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { week: 'Semana 1', focus: 'Post-Launch Monitoring Setup', tasks: 5 },
              { week: 'Semana 2', focus: 'Customer Success Onboarding', tasks: 5 },
              { week: 'Semana 3', focus: 'Growth & Advanced Features', tasks: 5 },
              { week: 'Semana 4', focus: 'Reliability & Review', tasks: 5 }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                <div className="w-20 font-semibold text-purple-600">{item.week}</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.focus}</p>
                  <p className="text-sm text-gray-600">{item.tasks} tarefas</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">{item.tasks} pts</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dependencies */}
      <Card>
        <CardHeader>
          <CardTitle>Dependências & Pré-requisitos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Sprint 19 — 100% Concluído</p>
              <p className="text-sm text-gray-600">E2E tests, Security Audit, Performance Optimization, Deployment</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Ambiente de Produção Ativo</p>
              <p className="text-sm text-gray-600">SSL/TLS, CDN, Load Balancer, Backups automáticos</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Monitoramento Básico</p>
              <p className="text-sm text-gray-600">Sentry, CloudWatch, Grafana em setup inicial</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Pronto para crescer?</h3>
            <p className="text-white/90">Sprint 20 marca o início da fase de expansão. Consolidaremos produção e iniciaremos novos mercados.</p>
          </div>
          <Button className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-2">
            Iniciar Sprint 20
          </Button>
        </div>
      </div>
    </div>
  );
}