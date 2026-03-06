import React, { useState, useMemo } from 'react';
import { CheckCircle2, AlertCircle, Clock, Zap, BarChart3, Smartphone, MessageCircle } from 'lucide-react';

export default function Sprint4Status() {
  const [expandedPhase, setExpandedPhase] = useState(null);

  const phases = [
    {
      id: 1,
      title: '📱 Mobile Optimization',
      description: 'Otimizar interface para celulares e tablets',
      status: 'in_progress',
      progress: 0,
      tasks: [
        { id: 1, title: 'Responsive Layout - Deadlines', status: 'pending', priority: 'high' },
        { id: 2, title: 'Responsive Layout - Notifications', status: 'pending', priority: 'high' },
        { id: 3, title: 'Touch-Friendly Buttons', status: 'pending', priority: 'medium' },
        { id: 4, title: 'Mobile Navigation', status: 'pending', priority: 'medium' },
        { id: 5, title: 'Viewport Optimization', status: 'pending', priority: 'low' },
      ],
      startDate: '2026-03-04',
      estimatedDays: 3,
    },
    {
      id: 2,
      title: '📊 Advanced Analytics Dashboard',
      description: 'Dashboard executivo com gráficos e métricas',
      status: 'pending',
      progress: 0,
      tasks: [
        { id: 1, title: 'Analytics Page - Setup', status: 'pending', priority: 'high' },
        { id: 2, title: 'Deadline Trends Chart', status: 'pending', priority: 'high' },
        { id: 3, title: 'Notification Stats', status: 'pending', priority: 'high' },
        { id: 4, title: 'Process Metrics', status: 'pending', priority: 'medium' },
        { id: 5, title: 'Export Reports (CSV/PDF)', status: 'pending', priority: 'medium' },
      ],
      startDate: '2026-03-07',
      estimatedDays: 4,
    },
    {
      id: 3,
      title: '💬 Slack Integration',
      description: 'Notificações em tempo real via Slack',
      status: 'pending',
      progress: 0,
      tasks: [
        { id: 1, title: 'Slack OAuth Setup', status: 'pending', priority: 'high' },
        { id: 2, title: 'Webhook Handler - Deadlines', status: 'pending', priority: 'high' },
        { id: 3, title: 'Webhook Handler - Notifications', status: 'pending', priority: 'high' },
        { id: 4, title: 'Slack Message Formatting', status: 'pending', priority: 'medium' },
        { id: 5, title: 'Integration Testing', status: 'pending', priority: 'medium' },
      ],
      startDate: '2026-03-11',
      estimatedDays: 3,
    },
  ];

  const stats = useMemo(() => {
    const totalTasks = phases.reduce((sum, p) => sum + p.tasks.length, 0);
    const completedTasks = phases.reduce((sum, p) => sum + p.tasks.filter(t => t.status === 'completed').length, 0);
    
    return {
      totalTasks,
      completedTasks,
      percentage: Math.round((completedTasks / totalTasks) * 100),
      inProgress: phases.filter(p => p.status === 'in_progress').length,
      pending: phases.filter(p => p.status === 'pending').length,
    };
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return '✅ Concluído';
      case 'in_progress':
        return '⏳ Em Andamento';
      case 'pending':
        return '⏱️ Pendente';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'in_progress':
        return 'bg-blue-50 border-blue-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🚀 Sprint 4 - Executor Status</h1>
          <p className="text-gray-600">Planejamento e execução das próximas features</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-gray-600 text-sm font-medium">Total de Tasks</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalTasks}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200 bg-green-50">
            <p className="text-green-600 text-sm font-medium">Completas</p>
            <p className="text-3xl font-bold text-green-900 mt-1">{stats.completedTasks}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200 bg-blue-50">
            <p className="text-blue-600 text-sm font-medium">Em Andamento</p>
            <p className="text-3xl font-bold text-blue-900 mt-1">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-200 bg-purple-50">
            <p className="text-purple-600 text-sm font-medium">Progresso Geral</p>
            <p className="text-3xl font-bold text-purple-900 mt-1">{stats.percentage}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
          <p className="text-sm font-medium text-gray-600 mb-3">Progresso do Sprint</p>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            {stats.completedTasks} de {stats.totalTasks} tasks completas ({stats.percentage}%)
          </p>
        </div>

        {/* Phases */}
        <div className="space-y-4">
          {phases.map((phase) => {
            const phaseTasks = phase.tasks;
            const completedInPhase = phaseTasks.filter(t => t.status === 'completed').length;
            const phaseProgress = Math.round((completedInPhase / phaseTasks.length) * 100);

            return (
              <div
                key={phase.id}
                className={`border rounded-lg p-6 transition ${getStatusColor(phase.status)}`}
              >
                {/* Phase Header */}
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {phase.id === 1 && <Smartphone className="w-6 h-6 text-blue-600" />}
                    {phase.id === 2 && <BarChart3 className="w-6 h-6 text-purple-600" />}
                    {phase.id === 3 && <MessageCircle className="w-6 h-6 text-green-600" />}
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{phase.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{phase.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{phaseProgress}%</p>
                      <p className="text-xs text-gray-600">
                        {completedInPhase}/{phaseTasks.length}
                      </p>
                    </div>
                    {getStatusIcon(phase.status)}
                  </div>
                </div>

                {/* Phase Progress Bar */}
                <div className="mt-4 mb-4">
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${phaseProgress}%` }}
                    />
                  </div>
                </div>

                {/* Expanded Tasks */}
                {expandedPhase === phase.id && (
                  <div className="mt-6 pt-6 border-t border-gray-300">
                    <p className="text-sm font-medium text-gray-600 mb-4">
                      Tarefas ({completedInPhase}/{phaseTasks.length})
                    </p>
                    <div className="space-y-3">
                      {phaseTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                          <div className="flex items-center gap-3 flex-1">
                            {getStatusIcon(task.status)}
                            <div>
                              <p className="font-medium text-gray-900">{task.title}</p>
                              <p className="text-xs text-gray-500">
                                {task.priority === 'high' && '🔴 Alta Prioridade'}
                                {task.priority === 'medium' && '🟡 Média Prioridade'}
                                {task.priority === 'low' && '🟢 Baixa Prioridade'}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-700">
                            {getStatusLabel(task.status)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-4 bg-gray-100 rounded border border-gray-300">
                      <p className="text-sm font-medium text-gray-900">
                        📅 Início: {phase.startDate} | ⏱️ Estimado: {phase.estimatedDays} dias
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>💡 Nota:</strong> Este dashboard rastreia o progresso de Sprint 4. As tasks podem ser expandidas/colapsadas
            para visualizar detalhes. Atualize o status conforme avança na implementação.
          </p>
        </div>
      </div>
    </div>
  );
}