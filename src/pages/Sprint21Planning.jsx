import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Zap,
  Target,
  TrendingUp,
  Users,
  Code,
  Shield,
  AlertCircle,
  CheckCircle2,
  Rocket
} from 'lucide-react';

export default function Sprint21Planning() {
  const [expandedPhase, setExpandedPhase] = useState(null);

  const phases = [
    {
      id: 1,
      name: 'AI & Automation',
      points: 5,
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      tasks: [
        'AI-powered publication classification',
        'Smart deadline recommendations',
        'Automated alert system',
        'Machine learning model training',
        'Predictive analytics dashboard'
      ]
    },
    {
      id: 2,
      name: 'Enterprise Features',
      points: 4,
      icon: Shield,
      color: 'from-indigo-500 to-purple-500',
      tasks: [
        'White-label solution',
        'Custom branding',
        'Advanced RBAC',
        'SSO/OAuth integration',
        'Audit trail customization'
      ]
    },
    {
      id: 3,
      name: 'Global Expansion',
      points: 5,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      tasks: [
        'Multi-language support',
        'Regional compliance (GDPR, LGPD, CCPA)',
        'Multi-currency support',
        'International payment methods',
        'Regional data centers'
      ]
    },
    {
      id: 4,
      name: 'Developer Ecosystem',
      points: 4,
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      tasks: [
        'Public REST API',
        'GraphQL endpoint',
        'SDK for multiple languages',
        'Webhook framework',
        'Developer portal & docs'
      ]
    },
    {
      id: 5,
      name: 'Community & Support',
      points: 3,
      icon: Users,
      color: 'from-pink-500 to-rose-500',
      tasks: [
        'Community forum launch',
        'Knowledge base articles',
        '24/7 customer support',
        'Training academy',
        'Partner program'
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
            <h1 className="text-3xl font-bold text-gray-900">Sprint 21 — Inovação & Escala Global</h1>
            <p className="text-gray-600">IA, Enterprise Features, Expansão Global, Developer Ecosystem</p>
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
              <div className="text-xs text-gray-600 mt-1">Fases Estratégicas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">4</div>
              <div className="text-xs text-gray-600 mt-1">Semanas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">25+</div>
              <div className="text-xs text-gray-600 mt-1">Tarefas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">5M+</div>
              <div className="text-xs text-gray-600 mt-1">Users Target</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Alert className="border-blue-200 bg-blue-50">
        <Target className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900 ml-2">
          <strong>Objetivos Sprint 21:</strong> Transformar LegalPush em plataforma AI-primeira, oferecer soluções enterprise-grade, expandir globalmente e construir um ecossistema de desenvolvedores vibrante.
        </AlertDescription>
      </Alert>

      {/* Strategic Phases */}
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
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Sucesso Sprint 21</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700">AI Adoption</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">60%+</div>
              <div className="text-xs text-gray-600 mt-1">usuários usando features AI</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700">Global Reach</div>
              <div className="text-2xl font-bold text-green-600 mt-1">15+</div>
              <div className="text-xs text-gray-600 mt-1">países suportados</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700">Developer Apps</div>
              <div className="text-2xl font-bold text-purple-600 mt-1">50+</div>
              <div className="text-xs text-gray-600 mt-1">apps terceiras</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700">User Growth</div>
              <div className="text-2xl font-bold text-orange-600 mt-1">3x</div>
              <div className="text-xs text-gray-600 mt-1">crescimento em base</div>
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
              { week: 'Semana 1', focus: 'AI Models & Training', tasks: 'Classification, Recommendations' },
              { week: 'Semana 2', focus: 'Enterprise & SSO', tasks: 'White-label, RBAC, OAuth' },
              { week: 'Semana 3', focus: 'Global Expansion', tasks: 'i18n, Compliance, Payments' },
              { week: 'Semana 4', focus: 'Developer Ecosystem', tasks: 'API, SDK, Portal, Community' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                <div className="w-24 font-semibold text-purple-600">{item.week}</div>
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
          <CardTitle>Pré-requisitos Sprint 21</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Sprint 20 — 100% Concluído</p>
              <p className="text-sm text-gray-600">Monitoramento, sucesso de clientes, primeiro ciclo de crescimento</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Infraestrutura Global</p>
              <p className="text-sm text-gray-600">CDN multi-região, databases replicados, DNS global</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">ML Pipeline Ready</p>
              <p className="text-sm text-gray-600">Data warehouse, feature store, model serving ready</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Rumo à Escala Global</h3>
            <p className="text-white/90">Sprint 21 marca a transição de plataforma madura para ecossistema global com AI e inovação contínua.</p>
          </div>
          <Button className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-2">
            Iniciar Sprint 21
          </Button>
        </div>
      </div>
    </div>
  );
}