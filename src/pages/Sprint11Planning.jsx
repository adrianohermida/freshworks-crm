import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Rocket, Target, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Sprint11Planning() {
  const sprintData = {
    number: 11,
    status: 'PLANNED',
    startDate: '2026-03-10',
    endDate: '2026-03-23',
    theme: 'SECURITY FINALIZATION & STABILITY',
    estimatedCompletion: 92,
    totalStoryPoints: 32,
    dependencies: {
      from: 'Sprint 10',
      carryover: 6
    }
  };

  const plannedItems = [
    {
      category: 'CARRYOVER (Sprint 10)',
      items: [
        { title: 'Rate Limiting Tests', pts: 1, priority: 'HIGH', days: 1 },
        { title: 'Encryption Key Rotation', pts: 2, priority: 'HIGH', days: 2 },
        { title: 'LGPD Audit Trail Finalization', pts: 3, priority: 'HIGH', days: 2 }
      ]
    },
    {
      category: 'NEW TASKS',
      items: [
        { title: 'CORS Protection Implementation', pts: 2, priority: 'HIGH', days: 1 },
        { title: 'Rate Limiter Middleware Tests', pts: 3, priority: 'HIGH', days: 2 },
        { title: 'Field Encryption for Sensitive Data', pts: 5, priority: 'HIGH', days: 3 },
        { title: 'E2E Security Tests Suite', pts: 8, priority: 'CRITICAL', days: 4 },
        { title: 'Database Query Performance Tests', pts: 2, priority: 'MEDIUM', days: 1 },
        { title: 'Load Testing (100K+ concurrent)', pts: 4, priority: 'HIGH', days: 3 },
        { title: 'Cache Strategy Validation', pts: 1, priority: 'MEDIUM', days: 1 }
      ]
    }
  ];

  const riskFactors = [
    { risk: 'E2E Tests complexity', mitigation: 'Paralle execution com 4 testers' },
    { risk: 'Load testing infra', mitigation: 'Usar Locust + Cloud infra' },
    { risk: 'Encryption key rotation', mitigation: 'Blue-green deployment' }
  ];

  const successCriteria = [
    '✅ 100% auth endpoints com RBAC validado',
    '✅ Encryption em todos dados sensíveis (LGPD-ready)',
    '✅ Rate limiting funcionando (50 req/min)',
    '✅ Load test: 100K+ concurrent (p99 < 500ms)',
    '✅ E2E tests: 90%+ coverage',
    '✅ Zero security vulnerabilities (OWASP A06:2021)'
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-6">
        <div className="flex items-center gap-3">
          <Rocket className="w-8 h-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sprint 11 Planning</h1>
            <p className="text-gray-600 mt-1">Security Finalization & Stability • 10/Mar - 23/Mar</p>
          </div>
        </div>
      </div>

      {/* Sprint Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">32 pts</div>
              <p className="text-sm text-gray-600 mt-2">Story Points</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">14 dias</div>
              <p className="text-sm text-gray-600 mt-2">Duração</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">6 pts</div>
              <p className="text-sm text-gray-600 mt-2">Carryover (S10)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">92%</div>
              <p className="text-sm text-gray-600 mt-2">Projeto (Est.)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planned Items by Category */}
      {plannedItems.map((section, sectionIdx) => (
        <Card key={sectionIdx}>
          <CardHeader>
            <CardTitle className="text-lg">{section.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {section.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-1">Estimativa: {item.days} dia(s)</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      item.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                      item.priority === 'HIGH' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {item.priority}
                    </span>
                    <span className="text-sm font-bold text-purple-600 w-12 text-right">{item.pts}pts</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Success Criteria */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Target className="w-5 h-5" />
            Critérios de Sucesso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {successCriteria.map((criterion, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{criterion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertTriangle className="w-5 h-5" />
            Riscos & Mitigações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {riskFactors.map((factor, idx) => (
              <div key={idx} className="p-3 border border-orange-200 rounded bg-white">
                <div className="font-medium text-sm text-gray-900">{factor.risk}</div>
                <div className="text-sm text-gray-600 mt-1">↳ {factor.mitigation}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline Estimado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Week 1 (10-16/Mar): Security Core</span>
              <span className="text-xs text-gray-500">Rate Limit, Encryption, CORS</span>
            </div>
            <Progress value={33} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Week 2 (17-23/Mar): Testing & Validation</span>
              <span className="text-xs text-gray-500">E2E, Load, Performance</span>
            </div>
            <Progress value={66} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertDescription className="text-blue-900">
          <strong>Após Sprint 11:</strong> Projeto chegará a <strong>92% completude</strong>. Apenas Sprint 12 (Growth & Scaling) + Sprint 13 (Final Polish) restantes.
        </AlertDescription>
      </Alert>
    </div>
  );
}