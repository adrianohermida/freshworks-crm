import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Clock, Zap, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Sprint7Execution() {
  const [currentDay] = useState(1);
  const [lastUpdate] = useState(new Date().toLocaleTimeString('pt-BR'));

  const sprintConfig = {
    name: 'Sprint 7',
    startDate: '2026-03-04',
    endDate: '2026-03-11',
    totalDays: 8,
    sprintGoal: 'Platform Expansion & Advanced Features',
    targetVelocity: 37,
  };

  const tasks = [
    {
      id: 1,
      name: 'Advanced Search Filters',
      priority: 'HIGH',
      status: 'in_progress',
      progress: 45,
      assignee: 'Dev 1',
      estimatedDays: 2.5,
      startDate: '2026-03-04',
      targetDate: '2026-03-06',
      blockers: [],
      storyPoints: 8,
    },
    {
      id: 2,
      name: 'Billing & Subscription',
      priority: 'HIGH',
      status: 'in_progress',
      progress: 30,
      assignee: 'Dev 2',
      estimatedDays: 3,
      startDate: '2026-03-04',
      targetDate: '2026-03-07',
      blockers: ['Auth refactor needed'],
      storyPoints: 10,
    },
    {
      id: 3,
      name: 'Mobile App (React Native)',
      priority: 'CRITICAL',
      status: 'planned',
      progress: 0,
      assignee: 'Mobile Team',
      estimatedDays: 4,
      startDate: '2026-03-08',
      targetDate: '2026-03-11',
      blockers: [],
      storyPoints: 12,
    },
    {
      id: 4,
      name: 'Team Collaboration',
      priority: 'MEDIUM',
      status: 'planned',
      progress: 0,
      assignee: 'Dev 3',
      estimatedDays: 2.5,
      startDate: '2026-03-08',
      targetDate: '2026-03-10',
      blockers: [],
      storyPoints: 5,
    },
    {
      id: 5,
      name: 'Custom Workflows',
      priority: 'MEDIUM',
      status: 'planned',
      progress: 0,
      assignee: 'Dev 4',
      estimatedDays: 3,
      startDate: '2026-03-08',
      targetDate: '2026-03-11',
      blockers: [],
      storyPoints: 8,
    },
    {
      id: 6,
      name: 'AI Copilot',
      priority: 'LOW',
      status: 'planned',
      progress: 0,
      assignee: 'DevOps',
      estimatedDays: 3,
      startDate: '2026-03-09',
      targetDate: '2026-03-11',
      blockers: ['LLM API setup'],
      storyPoints: 6,
    },
  ];

  const blockers = [
    {
      id: 1,
      title: 'Auth Refactor Required',
      severity: 'HIGH',
      impact: 'Blocking Billing feature',
      status: 'in_progress',
      assignee: 'DevOps',
      eta: '2026-03-06',
      mitigation: 'Parallelizar com Billing, resolve até Dia 3',
    },
    {
      id: 2,
      title: 'LLM API Setup',
      severity: 'MEDIUM',
      impact: 'Copilot cannot start',
      status: 'pending',
      assignee: 'DevOps',
      eta: '2026-03-06',
      mitigation: 'Pre-setup config, pode iniciar day 3',
    },
    {
      id: 3,
      title: 'Mobile Dev Learning Curve',
      severity: 'MEDIUM',
      impact: 'Timeline risk for Mobile',
      status: 'mitigated',
      assignee: 'Mobile Team',
      eta: '2026-03-07',
      mitigation: 'Boilerplate pronto, training completado',
    },
  ];

  const overallProgress = 20;
  const completedTasks = 0;
  const inProgressTasks = 2;
  const plannedTasks = 4;
  const totalStoryPoints = tasks.reduce((sum, t) => sum + t.storyPoints, 0);
  const completedStoryPoints = tasks
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.storyPoints, 0);

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      planned: 'bg-gray-100 text-gray-800',
      blocked: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      CRITICAL: 'bg-red-100 text-red-800',
      HIGH: 'bg-orange-100 text-orange-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      LOW: 'bg-gray-100 text-gray-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{sprintConfig.name}</h1>
              <p className="text-gray-600 mt-1">{sprintConfig.sprintGoal}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Dia {currentDay}/8</p>
              <p className="text-xs text-gray-400">Atualizado às {lastUpdate}</p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Badge className="bg-blue-600">Em Execução</Badge>
            <Badge className="bg-gray-600">2026-03-04 a 2026-03-11</Badge>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Progresso Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{overallProgress}%</div>
              <Progress value={overallProgress} className="mt-2" />
              <p className="text-xs text-gray-500 mt-2">{completedTasks} de 6 tarefas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Story Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {completedStoryPoints}/{totalStoryPoints}
              </div>
              <Progress value={(completedStoryPoints / totalStoryPoints) * 100} className="mt-2" />
              <p className="text-xs text-gray-500 mt-2">0% da meta {sprintConfig.targetVelocity}pts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Tarefas Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{inProgressTasks}</div>
              <p className="text-xs text-gray-500 mt-2">2 em andamento</p>
              <p className="text-xs text-gray-500">4 planejadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">🟢</div>
              <p className="text-sm font-medium text-green-700 mt-2">ON TRACK</p>
              <p className="text-xs text-gray-500 mt-1">Sem atrasos críticos</p>
            </CardContent>
          </Card>
        </div>

        {/* Blockers Alert */}
        {blockers.some(b => b.status === 'in_progress' || b.status === 'pending') && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800 ml-2">
              <strong>3 Blockers Identificados:</strong> 1 HIGH (Auth refactor - em resolução), 2 MEDIUM (LLM setup, Mobile learning). Mitigações ativas.
            </AlertDescription>
          </Alert>
        )}

        {/* Tasks Table */}
        <Card>
          <CardHeader>
            <CardTitle>Tarefas do Sprint</CardTitle>
            <CardDescription>Status detalhado de cada tarefa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{task.name}</h3>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status === 'in_progress' ? 'Em Andamento' : task.status === 'completed' ? 'Concluído' : 'Planejado'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Atribuído a: <span className="font-medium">{task.assignee}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{task.storyPoints}pts</div>
                      <div className="text-xs text-gray-500">Estimado: {task.estimatedDays}d</div>
                    </div>
                  </div>

                  {task.blockers.length > 0 && (
                    <Alert className="border-red-200 bg-red-50 py-2">
                      <AlertDescription className="text-red-800 text-sm">
                        🚫 {task.blockers.join(', ')}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progresso</span>
                      <span className="font-medium text-gray-900">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} />
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>Início: {task.startDate}</span>
                      <span>Alvo: {task.targetDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Blockers Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Blockers & Mitigações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {blockers.map(blocker => (
                <div key={blocker.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{blocker.title}</h4>
                      <p className="text-sm text-gray-600">Impact: {blocker.impact}</p>
                    </div>
                    <Badge
                      className={
                        blocker.severity === 'HIGH'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {blocker.severity}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Responsável:</span>
                      <p className="font-medium">{blocker.assignee}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">ETA:</span>
                      <p className="font-medium">{blocker.eta}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded p-2">
                    <p className="text-sm text-blue-900">
                      <strong>Mitigação:</strong> {blocker.mitigation}
                    </p>
                  </div>

                  <div className="flex gap-2 items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        blocker.status === 'mitigated'
                          ? 'bg-green-500'
                          : blocker.status === 'in_progress'
                          ? 'bg-blue-500'
                          : 'bg-orange-500'
                      }`}
                    />
                    <span className="text-xs font-medium text-gray-600">
                      {blocker.status === 'mitigated'
                        ? 'Mitigado'
                        : blocker.status === 'in_progress'
                        ? 'Em Resolução'
                        : 'Pendente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Checkpoint Dia {currentDay}</CardTitle>
            <CardDescription>Ações esperadas para hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Search Filters → 70%+</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Billing → 60%+</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                <Zap className="w-4 h-4 text-orange-600" />
                <span className="text-sm">Iniciar resolução Auth refactor</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm">Daily standup 09:00 (completado)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Path */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Caminho Crítico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 p-2 bg-red-50 rounded border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-red-900">Mobile App (Dia 4-7)</strong>
                  <p className="text-red-800">Crítico para Sprint 7. Boilerplate pronto, mitigações ativas. Monitorar daily.</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-yellow-900">Auth Refactor (resolve Dia 3)</strong>
                  <p className="text-yellow-800">Bloqueia Billing. Parallelizar com Dev 2. Crítico resolver até Dia 3.</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                <Target className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-yellow-900">Contingência Copilot</strong>
                  <p className="text-yellow-800">Pode mover para Sprint 8 se Mobile atrasar. Plano B pronto.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center text-sm text-gray-600">
          <p>
            <strong>Próximo Checkpoint:</strong> Amanhã 18:00 (Dia 2)
          </p>
          <p className="mt-1">
            Esperado: Search 90%+, Billing 100%, Mobile architecture review
          </p>
        </div>
      </div>
    </div>
  );
}