import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

export default function DailyStatusTracker() {
  const [dailyUpdates] = useState([
    {
      day: 1,
      date: '2026-03-12',
      dayName: 'Quarta',
      updates: [
        { time: '09:00', person: 'Dev 1', action: '🚀 Iniciou Search Filters', status: 'completed' },
        { time: '09:15', person: 'Dev 2', action: '🚀 Iniciou Billing Integration (Stripe setup)', status: 'completed' },
        { time: '14:30', person: 'Dev 1', action: '✅ Search API endpoint pronto', status: 'completed' },
        { time: '16:45', person: 'Dev 2', action: '⚠️ Auth refactor needed para Team Collab', status: 'blocker' }
      ],
      metrics: { tasksCompleted: 0, tasksInProgress: 2, completion: 20, velocity: 0 }
    },
    {
      day: 2,
      date: '2026-03-13',
      dayName: 'Quinta',
      updates: [
        { time: 'Planejado', person: 'Dev 1', action: '→ Continuar Search Filters (target 70%)', status: 'planned' },
        { time: 'Planejado', person: 'Dev 2', action: '→ Stripe tests (target 60%)', status: 'planned' }
      ],
      metrics: { tasksCompleted: 0, tasksInProgress: 2, completion: 20, velocity: 0 }
    }
  ]);

  const sprintStats = {
    daysCompleted: 1,
    daysTotal: 8,
    tasksOnTrack: 2,
    tasksBehind: 0,
    criticalBlockers: 1,
    velocity: 0
  };

  return (
    <div className="space-y-6">
      {/* Sprint 7 Daily Tracker */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">📅 Daily Status - Sprint 7</h2>
        <p className="text-gray-600">Dia {sprintStats.daysCompleted} de {sprintStats.daysTotal}</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3 bg-blue-50">
          <p className="text-xs text-gray-600">Dias</p>
          <p className="text-2xl font-bold text-blue-600">{sprintStats.daysCompleted}/{sprintStats.daysTotal}</p>
        </Card>
        <Card className="p-3 bg-green-50">
          <p className="text-xs text-gray-600">No Alvo</p>
          <p className="text-2xl font-bold text-green-600">{sprintStats.tasksOnTrack}/6</p>
        </Card>
        <Card className="p-3 bg-red-50">
          <p className="text-xs text-gray-600">Blockers</p>
          <p className="text-2xl font-bold text-red-600">{sprintStats.criticalBlockers}</p>
        </Card>
        <Card className="p-3 bg-purple-50">
          <p className="text-xs text-gray-600">Velocity</p>
          <p className="text-2xl font-bold text-purple-600">{sprintStats.velocity}/37</p>
        </Card>
      </div>

      {/* Daily Updates Timeline */}
      {dailyUpdates.map(day => (
        <Card key={day.day} className="p-6">
          <div className="flex items-start justify-between mb-4 pb-4 border-b">
            <div>
              <h3 className="font-bold text-gray-900">
                Dia {day.day} • {day.dayName} ({day.date})
              </h3>
            </div>
            <Badge className={
              day.metrics.completion > 30 
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }>
              {day.metrics.completion}%
            </Badge>
          </div>

          {/* Updates Timeline */}
          <div className="space-y-3">
            {day.updates.map((update, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="pt-1">
                  {update.status === 'completed' && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                  {update.status === 'blocker' && (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  {update.status === 'planned' && (
                    <div className="w-5 h-5 rounded-full border-2 border-blue-400" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600">{update.time}</span>
                    <span className="text-xs text-gray-500">{update.person}</span>
                  </div>
                  <p className="text-sm text-gray-900 mt-1">{update.action}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* Next Steps */}
      <Card className="p-6 bg-blue-50 border-2 border-blue-200">
        <h3 className="font-bold text-gray-900 mb-3">📋 Próximas Ações (Hoje)</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✅ Validar Search Filters > 70%</li>
          <li>✅ Avançar Billing para 60%</li>
          <li>⚠️ Resolver Auth refactor com Dev 2</li>
          <li>📋 Preparar Mobile App para amanhã</li>
        </ul>
      </Card>
    </div>
  );
}