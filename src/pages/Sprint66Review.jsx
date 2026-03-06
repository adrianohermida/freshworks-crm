import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, TrendingUp, Users, Target, Zap } from 'lucide-react';

export default function Sprint66Review() {
  const [sprintData, setSprintData] = useState({
    sprintNumber: 6,
    title: 'Growth, Analytics & Community',
    startDate: '2026-03-05',
    endDate: '2026-03-12',
    totalTasks: 8,
    completedTasks: 0,
    inProgress: 0
  });

  const tasks = [
    {
      id: 1,
      name: 'Growth Hacking Framework',
      description: 'Implementar tracking de conversão, A/B testing, viral loops',
      status: 'planned',
      priority: 'high',
      estimatedDays: 2
    },
    {
      id: 2,
      name: 'Advanced Analytics Dashboard',
      description: 'Cohort analysis, retention curves, user journey tracking',
      status: 'planned',
      priority: 'high',
      estimatedDays: 2
    },
    {
      id: 3,
      name: 'Community Features',
      description: 'Comments, likes, sharing, user profiles, badges',
      status: 'planned',
      priority: 'medium',
      estimatedDays: 2
    },
    {
      id: 4,
      name: 'Email Marketing Integration',
      description: 'Newsletter, drip campaigns, automation',
      status: 'planned',
      priority: 'medium',
      estimatedDays: 1.5
    },
    {
      id: 5,
      name: 'Content Recommendation Engine',
      description: 'ML-based suggestions, personalization',
      status: 'planned',
      priority: 'medium',
      estimatedDays: 2.5
    },
    {
      id: 6,
      name: 'Performance Optimization',
      description: 'Bundle optimization, code splitting, lazy loading',
      status: 'planned',
      priority: 'high',
      estimatedDays: 1.5
    },
    {
      id: 7,
      name: 'Webhook & Integrations',
      description: 'Zapier, Make, IFTTT, custom webhooks',
      status: 'planned',
      priority: 'medium',
      estimatedDays: 2
    },
    {
      id: 8,
      name: 'User Onboarding Flow',
      description: 'Interactive tutorials, contextual help, product tours',
      status: 'planned',
      priority: 'high',
      estimatedDays: 1.5
    }
  ];

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">🚀 Sprint 6: Growth & Analytics</h1>
        <p className="text-gray-600">Período: {sprintData.startDate} até {sprintData.endDate}</p>
      </div>

      {/* Sprint Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Total de Tarefas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{sprintData.totalTasks}</p>
            </div>
            <Target className="w-8 h-8 text-blue-600 opacity-30" />
          </div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Concluídas</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{sprintData.completedTasks}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-600 opacity-30" />
          </div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Em Progresso</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{sprintData.inProgress}</p>
            </div>
            <Zap className="w-8 h-8 text-yellow-600 opacity-30" />
          </div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Conclusão</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">0%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600 opacity-30" />
          </div>
        </Card>
      </div>

      {/* Task List */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Planejamento das Tarefas</h2>
        
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{task.name}</h3>
                    <Badge className={
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {task.priority === 'high' ? '🔴 Alta' : task.priority === 'medium' ? '🟡 Média' : '🟢 Baixa'}
                    </Badge>
                    <Badge variant="outline">{task.estimatedDays}d</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                </div>
                <Badge className="bg-gray-100 text-gray-800 ml-4">Planejada</Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>📊 Estimativa Total:</strong> 15.5 dias de trabalho | <strong>Duração:</strong> 8 dias (2 devs) | <strong>Risco:</strong> 🟢 Baixo
          </p>
        </div>
      </Card>

      {/* Dependencies & Blockers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">✅ Dependências Resolvidas</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              API endpoints disponíveis
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Database otimizado
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Infrastructure escalável
            </li>
          </ul>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">⚠️ Riscos Identificados</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <span>Requer expertise em ML (Tarefa #5)</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <span>Email setup pode ter delays (Tarefa #4)</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* Action Button */}
      <div className="flex gap-3">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
          Iniciar Sprint 6
        </button>
        <button className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition">
          Revisar Backlog
        </button>
      </div>
    </div>
  );
}