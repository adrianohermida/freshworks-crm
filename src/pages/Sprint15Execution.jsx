import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Search, Zap, Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function Sprint15Execution() {
  const [expandedPhase, setExpandedPhase] = useState('phase1');

  const phases = [
    {
      id: 'phase1',
      name: 'Mobile App Foundation',
      icon: Smartphone,
      points: 4,
      tasks: [
        { id: 1, name: 'Mobile App MVP (MobileApp page + UI)', points: 2, status: 'completed' },
        { id: 2, name: 'Offline-first sync + push tokens', points: 2, status: 'completed' }
      ],
      functions: [
        'mobile/mobileAppInitialize',
        'mobile/mobileOfflineSync'
      ]
    },
    {
      id: 'phase2',
      name: 'Advanced Filtering & Search',
      icon: Search,
      points: 3,
      tasks: [
        { id: 4, name: 'Custom filter builder UI', points: 1.5, status: 'completed' },
        { id: 5, name: 'Saved search templates', points: 1.5, status: 'completed' }
      ],
      functions: ['filters/advancedFilterEngine']
    },
    {
      id: 'phase3',
      name: 'Custom Workflow Engine',
      icon: Zap,
      points: 3,
      tasks: [
        { id: 6, name: 'Workflow visual builder', points: 2, status: 'completed' },
        { id: 7, name: 'Automation rules engine', points: 1, status: 'completed' }
      ],
      functions: ['workflows/workflowEngine']
    },
    {
      id: 'phase4',
      name: 'Community Features',
      icon: Users,
      points: 3,
      tasks: [
        { id: 8, name: 'Discussion forums beta', points: 1.5, status: 'completed' },
        { id: 9, name: 'Knowledge base + comments', points: 1.5, status: 'completed' }
      ],
      functions: ['community/communityEngine']
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPhaseProgress = (phase) => {
    const completed = phase.tasks.filter(t => t.status === 'completed').length;
    return Math.round((completed / phase.tasks.length) * 100);
  };

  const completedPoints = phases.reduce((acc, phase) => {
    return acc + phase.tasks.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.points, 0);
  }, 0);

  const totalPoints = phases.reduce((acc, phase) => acc + phase.points, 0);
  const overallProgress = Math.round((completedPoints / totalPoints) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Sprint 15: Advanced Features & Growth
          </h1>
          <p className="text-gray-600">
            Mobile MVP, Advanced Filtering, Custom Workflows, Community Features
          </p>
        </div>

        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Sprint Progress</span>
              <Badge variant="outline">{overallProgress}%</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{completedPoints}/{totalPoints} Story Points</span>
                  <span className="text-gray-600">{totalPoints - completedPoints} remaining</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {phases.map(phase => (
                  <div key={phase.id} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{getPhaseProgress(phase)}%</div>
                    <div className="text-xs text-gray-600">{phase.name.split(' ')[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phases */}
        <div className="space-y-4">
          {phases.map(phase => {
            const PhaseIcon = phase.icon;
            const progress = getPhaseProgress(phase);

            return (
              <Card
                key={phase.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <PhaseIcon className="w-5 h-5" />
                      <span>{phase.name}</span>
                      <Badge>{phase.points}pts</Badge>
                    </div>
                    <div className="text-sm font-normal text-gray-600">{progress}%</div>
                  </CardTitle>
                </CardHeader>

                {expandedPhase === phase.id && (
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {phase.tasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3 flex-1">
                            {getStatusIcon(task.status)}
                            <span className="text-sm font-medium">{task.name}</span>
                            <Badge variant="secondary">{task.points}pts</Badge>
                          </div>
                          <Badge
                            variant={task.status === 'completed' ? 'default' : task.status === 'in_progress' ? 'outline' : 'secondary'}
                          >
                            {task.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    {phase.functions.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-semibold mb-2">Backend Functions</h4>
                        <div className="space-y-2">
                          {phase.functions.map(fn => (
                            <div key={fn} className="text-xs bg-blue-50 p-2 rounded border border-blue-200">
                              <code className="text-blue-700">{fn}</code>
                              <span className="ml-2 text-green-600">✅ Deployed</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Next Steps */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">✅ Sprint 15 — 100% COMPLETO</CardTitle>
          </CardHeader>
          <CardContent className="text-green-800 space-y-2">
            <p>✅ <strong>PHASE 1:</strong> mobile/mobileAppInitialize + mobile/mobileOfflineSync</p>
            <p>✅ <strong>PHASE 2:</strong> filters/advancedFilterEngine + AdvancedFilterBuilder.jsx</p>
            <p>✅ <strong>PHASE 3:</strong> workflows/workflowEngine + WorkflowBuilder.jsx</p>
            <p>✅ <strong>PHASE 4:</strong> community/communityEngine + CommunityForumWidget.jsx</p>
            <p className="font-semibold mt-2">→ Projeto LegalPush: ~100% concluído. Pronto para iniciar Sprint 16.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}