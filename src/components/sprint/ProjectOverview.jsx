import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Calendar, AlertCircle } from 'lucide-react';

export default function ProjectOverview() {
  const projectMetrics = {
    totalSprints: 7,
    completedSprints: 6,
    currentSprint: 7,
    completedTasks: 39,
    totalTasks: 45,
    completedVelocity: 156,
    totalVelocity: 193,
    timeline: { actual: 26, planned: 30 },
    quality: 'A+',
    riskLevel: 'Low'
  };

  const calculatePercentage = (completed, total) => Math.round((completed / total) * 100);

  const tasksPercentage = calculatePercentage(projectMetrics.completedTasks, projectMetrics.totalTasks);
  const velocityPercentage = calculatePercentage(projectMetrics.completedVelocity, projectMetrics.totalVelocity);
  const timelinePercentage = calculatePercentage(projectMetrics.timeline.actual, projectMetrics.timeline.planned);

  return (
    <div className="space-y-6">
      {/* Project Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">Legal Tasks - Project Overview</h1>
        <p className="text-gray-600">Enterprise-grade legal document management platform</p>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-start justify-between mb-3">
            <Calendar className="w-6 h-6 text-blue-600" />
            <Badge className="bg-blue-600 text-white">On Track</Badge>
          </div>
          <p className="text-sm text-gray-600">Sprints Completados</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{projectMetrics.completedSprints}/7</p>
          <p className="text-xs text-gray-600 mt-2">{timelinePercentage}% do tempo planejado</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-start justify-between mb-3">
            <Target className="w-6 h-6 text-green-600" />
            <Badge className="bg-green-600 text-white">{tasksPercentage}%</Badge>
          </div>
          <p className="text-sm text-gray-600">Tarefas Concluídas</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{projectMetrics.completedTasks}/45</p>
          <p className="text-xs text-gray-600 mt-2">6 tarefas em progresso</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-start justify-between mb-3">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <Badge className="bg-purple-600 text-white">{velocityPercentage}%</Badge>
          </div>
          <p className="text-sm text-gray-600">Velocity (Story Points)</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{projectMetrics.completedVelocity}/{projectMetrics.totalVelocity}</p>
          <p className="text-xs text-gray-600 mt-2">Média: 26 pts/sprint</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100">
          <div className="flex items-start justify-between mb-3">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <Badge className="bg-amber-600 text-white">A+</Badge>
          </div>
          <p className="text-sm text-gray-600">Qualidade & Cobertura</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">100% Tests</p>
          <p className="text-xs text-gray-600 mt-2">0 critical bugs</p>
        </Card>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Tarefas</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progresso</span>
              <span className="font-medium">{tasksPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all"
                style={{ width: `${tasksPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-600">{projectMetrics.completedTasks} de {projectMetrics.totalTasks} concluídas</p>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Velocity</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progresso</span>
              <span className="font-medium">{velocityPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-purple-600 h-3 rounded-full transition-all"
                style={{ width: `${velocityPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-600">{projectMetrics.completedVelocity} de {projectMetrics.totalVelocity} pontos</p>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Timeline</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progresso</span>
              <span className="font-medium">{timelinePercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${timelinePercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-600">{projectMetrics.timeline.actual} de {projectMetrics.timeline.planned} dias</p>
          </div>
        </Card>
      </div>

      {/* Key Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-green-50 border border-green-200">
          <h3 className="font-semibold text-gray-900 mb-2">✅ Completado Até Agora</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Sprint 5: Security & Deployment</li>
            <li>• Sprint 6: Growth, Analytics & Community</li>
            <li>• 39 tarefas entregues</li>
            <li>• 156 story points completados</li>
            <li>• 100% test coverage mantido</li>
          </ul>
        </Card>

        <Card className="p-4 bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-2">🚀 Próximos Passos</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Sprint 7: Platform Expansion (Em andamento)</li>
            <li>• Mobile App (React Native) - tarefa crítica</li>
            <li>• Billing & Subscription (Stripe)</li>
            <li>• Advanced Search Filters</li>
            <li>• 6 tarefas, 16 dias-dev estimados</li>
          </ul>
        </Card>
      </div>

      {/* Status Alert */}
      <Card className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300">
        <p className="text-sm font-medium text-green-900">
          ✅ <strong>Status Geral:</strong> Projeto 86.7% completo | On-time | Zero critical blockers | Ready for Sprint 7 execution
        </p>
      </Card>
    </div>
  );
}