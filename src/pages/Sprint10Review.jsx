import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react';

export default function Sprint10Review() {
  const sprintData = {
    number: 10,
    status: 'COMPLETING',
    startDate: '2026-02-24',
    endDate: '2026-03-09',
    theme: 'SECURITY & PERFORMANCE (1M+ PUBLICAÇÕES)',
    completionPercentage: 84,
    storyPoints: {
      total: 38,
      completed: 32,
      pending: 6
    }
  };

  const completedItems = [
    { title: 'RBAC Middleware (Auth)', pts: 8, status: 'done', date: '02/28' },
    { title: 'Encryption Middleware', pts: 8, status: 'done', date: '02/28' },
    { title: 'Audit Log Service', pts: 8, status: 'done', date: '03/01' },
    { title: 'LGPD Rights Handler (Básico)', pts: 8, status: 'done', date: '03/02' },
    { title: 'Database Indexing (7 índices)', pts: 0, status: 'done', date: '03/04' },
    { title: 'Infinite Scroll + Virtual List', pts: 0, status: 'done', date: '03/04' },
    { title: 'Query Optimization Service', pts: 0, status: 'done', date: '03/04' },
    { title: 'Performance Handler (1M+)', pts: 0, status: 'done', date: '03/04' }
  ];

  const pendingItems = [
    { title: 'Rate Limiting Tests', pts: 1, priority: 'HIGH', blocker: false },
    { title: 'Encryption Key Rotation', pts: 2, priority: 'HIGH', blocker: false },
    { title: 'LGPD Audit Trail Finals', pts: 3, priority: 'MEDIUM', blocker: false }
  ];

  const riskItems = [
    { title: 'E2E Tests coverage', status: 'AT_RISK', estimate: '3 dias' },
    { title: 'Performance load tests', status: 'BLOCKED', estimate: '2 dias' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Sprint 10 Review & Closure</h1>
        <p className="text-gray-600 mt-2">Security & Performance (1M+ Publicações) • 24/Feb - 09/Mar</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{sprintData.completionPercentage}%</div>
              <p className="text-sm text-gray-600 mt-2">Sprint Completude</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{sprintData.storyPoints.completed}/{sprintData.storyPoints.total}</div>
              <p className="text-sm text-gray-600 mt-2">Story Points</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{sprintData.storyPoints.pending}</div>
              <p className="text-sm text-gray-600 mt-2">Pendências</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">8 FUNCS</div>
              <p className="text-sm text-gray-600 mt-2">Entregues (Perf)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completion Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Progresso Sprint 10
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Completude Geral</span>
              <span className="text-sm font-bold">{sprintData.completionPercentage}%</span>
            </div>
            <Progress value={sprintData.completionPercentage} className="h-3" />
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm mt-4">
            <div>
              <span className="text-gray-600">Concluído</span>
              <div className="text-2xl font-bold text-green-600">{sprintData.storyPoints.completed} pts</div>
            </div>
            <div>
              <span className="text-gray-600">Pendente</span>
              <div className="text-2xl font-bold text-yellow-600">{sprintData.storyPoints.pending} pts</div>
            </div>
            <div>
              <span className="text-gray-600">Total</span>
              <div className="text-2xl font-bold text-blue-600">{sprintData.storyPoints.total} pts</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completed Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Concluídos (32 pts)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {completedItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-gray-500">Entregue {item.date}</div>
                  </div>
                </div>
                {item.pts > 0 && <span className="text-sm font-bold text-green-700">{item.pts}pts</span>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            Pendências (6 pts)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{item.title}</div>
                  <div className="text-xs text-gray-500">Prioridade: {item.priority}</div>
                </div>
                <span className="text-sm font-bold text-yellow-700">{item.pts}pts</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Items */}
      {riskItems.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              Itens em Risco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {riskItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white border border-red-200 rounded">
                  <div>
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-gray-500">Estimativa: {item.estimate}</div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${item.status === 'BLOCKED' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendation */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="w-4 h-4 text-blue-700" />
        <AlertDescription className="text-blue-900">
          <strong>Recomendação:</strong> Sprint 10 pode ser fechado com 84% de completude. As 6pts pendentes (Rate Limiting, Encryption Key Rotation, LGPD Audit) devem ser movidas para Sprint 11 com prioridade HIGH.
        </AlertDescription>
      </Alert>
    </div>
  );
}