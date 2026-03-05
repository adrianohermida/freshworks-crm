import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Clock, TrendingUp } from 'lucide-react';

export default function SprintExecutor() {
  const [sprintData, setSprintData] = useState({
    sprint: 3,
    startDate: '2026-02-01',
    endDate: '2026-03-15',
    status: 'in_progress',
    phases: [
      {
        id: 1,
        name: 'Google Calendar Integration',
        status: 'in_progress',
        completionPercentage: 40,
        tasks: [
          { id: 1, name: 'Authorize Google Calendar OAuth', completed: true },
          { id: 2, name: 'Create syncDeadlineToGoogleCalendar function', completed: true },
          { id: 3, name: 'Create SyncToCalendarButton component', completed: true },
          { id: 4, name: 'Integrate button in DeadlineCard', completed: true },
          { id: 5, name: 'Test calendar sync functionality', completed: false },
          { id: 6, name: 'Add event update/delete handlers', completed: false },
          { id: 7, name: 'Auto-sync reminder notifications', completed: false },
          { id: 8, name: 'Documentation & user guide', completed: false },
        ]
      },
      {
        id: 2,
        name: 'Deadline Management (Phase 2)',
        status: 'completed',
        completionPercentage: 100,
        tasks: [
          { id: 1, name: 'Create DeadlineCard component', completed: true },
          { id: 2, name: 'Create DeadlineDialog component', completed: true },
          { id: 3, name: 'Create Deadlines page with filtering', completed: true },
          { id: 4, name: 'Implement deadline statistics', completed: true },
        ]
      },
      {
        id: 3,
        name: 'Notification Hub (Phase 3)',
        status: 'completed',
        completionPercentage: 100,
        tasks: [
          { id: 1, name: 'Create NotificationCenter component', completed: true },
          { id: 2, name: 'Create NotificationCenter page', completed: true },
          { id: 3, name: 'Implement notification filtering', completed: true },
          { id: 4, name: 'Bulk notification actions', completed: true },
        ]
      }
    ]
  });

  const calculateSprintProgress = () => {
    const avgCompletion = sprintData.phases.reduce((sum, phase) => sum + phase.completionPercentage, 0) / sprintData.phases.length;
    return Math.round(avgCompletion);
  };

  const countCompletedTasks = () => {
    return sprintData.phases.reduce((sum, phase) => {
      return sum + phase.tasks.filter(t => t.completed).length;
    }, 0);
  };

  const countTotalTasks = () => {
    return sprintData.phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
  };

  const completedPhases = sprintData.phases.filter(p => p.status === 'completed').length;
  const totalPhases = sprintData.phases.length;
  const overallProgress = calculateSprintProgress();
  const completedTasks = countCompletedTasks();
  const totalTasks = countTotalTasks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Sprint Executor</h1>
          <p className="text-slate-600">Monitore o progresso e execute as ações necessárias para finalizar o sprint</p>
        </div>

        {/* Overall Progress */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 font-medium">Progresso Geral</span>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{overallProgress}%</div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 font-medium">Fases Completas</span>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{completedPhases}/{totalPhases}</div>
            <p className="text-sm text-slate-500 mt-2">{Math.round((completedPhases/totalPhases)*100)}% das fases</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 font-medium">Tarefas Concluídas</span>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{completedTasks}/{totalTasks}</div>
            <p className="text-sm text-slate-500 mt-2">{Math.round((completedTasks/totalTasks)*100)}% das tarefas</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 font-medium">Sprint Ativo</span>
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900">Sprint {sprintData.sprint}</div>
            <p className="text-sm text-slate-500 mt-2">Em progresso</p>
          </div>
        </div>

        {/* Phases Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {sprintData.phases.map((phase) => (
            <div key={phase.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Phase Header */}
              <div className={`p-4 ${phase.status === 'completed' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-blue-50 border-l-4 border-orange-500'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900">{phase.name}</h3>
                  {phase.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${phase.status === 'completed' ? 'text-green-700' : 'text-orange-700'}`}>
                    {phase.status === 'completed' ? '✓ Completa' : '⏳ Em Progresso'}
                  </span>
                  <span className="text-lg font-bold text-slate-900">{phase.completionPercentage}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-4 py-2">
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${phase.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}`}
                    style={{ width: `${phase.completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Tasks List */}
              <div className="p-4 border-t">
                <div className="space-y-2">
                  {phase.tasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-2 text-sm">
                      <input 
                        type="checkbox" 
                        checked={task.completed}
                        disabled
                        className="mt-0.5 w-4 h-4"
                      />
                      <span className={task.completed ? 'line-through text-slate-400' : 'text-slate-700'}>
                        {task.name}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  {phase.tasks.filter(t => t.completed).length}/{phase.tasks.length} tarefas
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pending Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Ações Pendentes</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-900">Fase 1: Google Calendar Integration</p>
                <p className="text-sm text-blue-700 mt-1">Pendências: Testar sincronização, adicionar handlers de atualização/exclusão, implementar notificações automáticas, documentação</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-900">Fase 2: Deadline Management</p>
                <p className="text-sm text-green-700 mt-1">✓ Completo - DeadlineCard, DeadlineDialog, página com filtros e estatísticas</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-900">Fase 3: Notification Hub</p>
                <p className="text-sm text-green-700 mt-1">✓ Completo - NotificationCenter com filtros, ações em massa e gerenciamento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Sprint Preview */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow p-6 border border-purple-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">📋 Sprint 4 - Planejamento</h2>
          <p className="text-slate-600 mb-4">Próxima evolução do produto após conclusão de Sprint 3</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border border-purple-200">
              <h3 className="font-semibold text-slate-900 mb-2">Fase 1: Integrações Avançadas</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Sincronização Slack</li>
                <li>• Webhooks para alertas</li>
                <li>• Integração WhatsApp</li>
              </ul>
            </div>
            <div className="p-4 bg-white rounded-lg border border-purple-200">
              <h3 className="font-semibold text-slate-900 mb-2">Fase 2: Analytics Avançados</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Dashboard de KPIs</li>
                <li>• Relatórios customizados</li>
                <li>• Análise preditiva</li>
              </ul>
            </div>
            <div className="p-4 bg-white rounded-lg border border-purple-200">
              <h3 className="font-semibold text-slate-900 mb-2">Fase 3: Performance</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Otimização de cache</li>
                <li>• Sincronização offline</li>
                <li>• PWA enhancement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}