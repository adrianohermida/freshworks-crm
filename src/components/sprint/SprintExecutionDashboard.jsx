import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Clock, TrendingUp } from 'lucide-react';

export default function SprintExecutionDashboard() {
  const [sprintHistory, setSprintHistory] = useState([
    {
      number: 1,
      title: 'Core Setup & Advise Integration',
      status: 'completed',
      tasks: 8,
      duration: '3d',
      velocity: 20,
      date: 'Jan 15-18'
    },
    {
      number: 2,
      title: 'Resilience & Monitoring',
      status: 'completed',
      tasks: 8,
      duration: '3d',
      velocity: 25,
      date: 'Jan 19-22'
    },
    {
      number: 3,
      title: 'QA & Optimization',
      status: 'completed',
      tasks: 6,
      duration: '2.5d',
      velocity: 18,
      date: 'Jan 23-26'
    },
    {
      number: 4,
      title: 'Advanced Features & Scale',
      status: 'completed',
      tasks: 5,
      duration: '3.5d',
      velocity: 22,
      date: 'Jan 27-31'
    },
    {
      number: 5,
      title: 'Security & Deployment',
      status: 'completed',
      tasks: 4,
      duration: '2d',
      velocity: 20,
      date: 'Feb 1-3'
    },
    {
      number: 6,
      title: 'Growth, Analytics & Community',
      status: 'completed',
      tasks: 8,
      duration: '8d',
      velocity: 31,
      date: 'Mar 4-12'
    },
    {
      number: 7,
      title: 'Platform Expansion',
      status: 'planned',
      tasks: 6,
      duration: '8d',
      velocity: 37,
      date: 'Mar 12-19'
    }
  ]);

  const projectStats = {
    totalTasks: 45,
    completedTasks: 39,
    completionRate: 86.7,
    totalVelocity: 156,
    avgVelocity: 26,
    quality: 'A+',
    testCoverage: '100%'
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white">
          <p className="text-xs text-gray-500 uppercase">Tarefas Completadas</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{projectStats.completedTasks}/{projectStats.totalTasks}</p>
          <p className="text-xs text-gray-500 mt-2">{projectStats.completionRate}% do projeto</p>
        </Card>

        <Card className="p-4 bg-white">
          <p className="text-xs text-gray-500 uppercase">Velocity Total</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{projectStats.totalVelocity}</p>
          <p className="text-xs text-gray-500 mt-2">Média: {projectStats.avgVelocity} pts/sprint</p>
        </Card>

        <Card className="p-4 bg-white">
          <p className="text-xs text-gray-500 uppercase">Qualidade</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">{projectStats.quality}</p>
          <p className="text-xs text-gray-500 mt-2">{projectStats.testCoverage} test coverage</p>
        </Card>

        <Card className="p-4 bg-white">
          <p className="text-xs text-gray-500 uppercase">Status Geral</p>
          <div className="flex items-center gap-2 mt-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <span className="font-bold text-green-600">ON TRACK</span>
          </div>
        </Card>
      </div>

      {/* Sprint Timeline */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">📅 Histórico de Sprints</h2>
        
        <div className="space-y-3">
          {sprintHistory.map(sprint => (
            <div
              key={sprint.number}
              className={`p-4 rounded-lg border-2 transition ${
                sprint.status === 'completed'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">Sprint {sprint.number}: {sprint.title}</h3>
                    <Badge className={
                      sprint.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }>
                      {sprint.status === 'completed' ? '✅ Concluído' : '⏳ Planejado'}
                    </Badge>
                  </div>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span>📋 {sprint.tasks} tarefas</span>
                    <span>⏱️ {sprint.duration}</span>
                    <span>🔥 {sprint.velocity} pts</span>
                    <span>📅 {sprint.date}</span>
                  </div>
                </div>

                {sprint.status === 'completed' && (
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 ml-4" />
                )}
                {sprint.status === 'planned' && (
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 ml-4" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Velocity Trend */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">📈 Evolução do Velocity</h2>
        
        <div className="flex items-end justify-between h-40 gap-2 px-2">
          {sprintHistory.slice(0, 6).map((sprint, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-600 rounded-t-lg transition hover:bg-blue-700"
                style={{ height: `${(sprint.velocity / 31) * 100}%` }}
              />
              <p className="text-xs font-medium text-gray-900 mt-2">S{sprint.number}</p>
              <p className="text-xs text-gray-600">{sprint.velocity}</p>
            </div>
          ))}
          <div className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-yellow-500 rounded-t-lg opacity-60"
              style={{ height: `${(37 / 31) * 100}%` }}
            />
            <p className="text-xs font-medium text-gray-900 mt-2">S7</p>
            <p className="text-xs text-gray-600">37 (Est.)</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 mt-4 text-center">
          Tendência: ↗️ Crescente | Próximo Sprint: +19% (37 pts)
        </p>
      </Card>

      {/* Next Steps */}
      <Card className="p-6 border-2 border-blue-400 bg-blue-50">
        <h3 className="text-lg font-bold text-gray-900 mb-3">🚀 Próximos Passos</h3>
        
        <ol className="space-y-2 text-sm text-gray-700">
          <li>✅ <strong>Sprint 6:</strong> Validação final e aprovação (Concluído)</li>
          <li>→ <strong>Sprint 7 Kickoff:</strong> 2026-03-12 09:00 (Amanhã)</li>
          <li>→ <strong>Focus:</strong> Mobile App, Advanced Search, Billing</li>
          <li>→ <strong>Meta Velocity:</strong> 37 story points (+19%)</li>
          <li>→ <strong>Completion Target:</strong> 100% do roadmap mapeado</li>
        </ol>

        <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
          Ver Sprint 7 Detalhes
        </button>
      </Card>
    </div>
  );
}