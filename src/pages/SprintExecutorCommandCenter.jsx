import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, Clock, AlertCircle, Zap, TrendingUp, Play, 
  ChevronDown, ChevronUp, Loader2, Flag, Target
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SprintExecutorCommandCenter() {
  const [expandedPhase, setExpandedPhase] = useState(1);
  const [executingTasks, setExecutingTasks] = useState({});
  const [completedTasks, setCompletedTasks] = useState({});

  const [sprintData, setSprintData] = useState({
    current: 10,
    next: 11,
    currentStatus: 'execution',
    overallProgress: 73,
    lastUpdate: '2026-03-04T17:30:00',
    phases: [
      {
        id: 1,
        name: 'Pre-Deploy Validation',
        status: 'completed',
        progress: 100,
        completedDate: '2026-03-04T13:00:00',
        tasks: [
          { id: '1-1', name: 'Final staging validation', completed: true },
          { id: '1-2', name: 'Security final check (RLS audit)', completed: true },
          { id: '1-3', name: 'Database backup test', completed: true },
          { id: '1-4', name: 'Team briefing', completed: true },
          { id: '1-5', name: 'Go/No-Go decision', completed: true },
        ]
      },
      {
        id: 2,
        name: 'Production Deployment',
        status: 'completed',
        progress: 100,
        completedDate: '2026-03-04T15:00:00',
        tasks: [
          { id: '2-1', name: 'Deploy code to production', completed: true },
          { id: '2-2', name: 'Run database migrations', completed: true },
          { id: '2-3', name: 'Execute smoke tests', completed: true },
          { id: '2-4', name: 'Monitor health checks', completed: true },
          { id: '2-5', name: 'Enable production alerts', completed: true },
        ]
      },
      {
        id: 3,
        name: '24h Monitoring ON-CALL',
        status: 'completed',
        progress: 100,
        completedDate: '2026-03-05T15:00:00',
        tasks: [
          { id: '3-1', name: 'Monitor error rate < 0.1%', completed: true },
          { id: '3-2', name: 'Monitor response time < 300ms avg', completed: true },
          { id: '3-3', name: 'Verify RLS enforcement (audit logs)', completed: true },
          { id: '3-4', name: 'Collect & triage user feedback', completed: true },
          { id: '3-5', name: 'Daily standup + log review', completed: true },
        ]
      },
      {
        id: 4,
        name: 'Bug Fixes & Hotfixes',
        status: 'in_progress',
        progress: 75,
        tasks: [
          { id: '4-1', name: 'Triage post-deploy issues', completed: true },
          { id: '4-2', name: 'Fix critical bugs (P1 only)', completed: true },
          { id: '4-3', name: 'Deploy hotfixes with monitoring', completed: true },
          { id: '4-4', name: 'Analyze slow query patterns', completed: false, blocking: true },
          { id: '4-5', name: 'Implement query optimizations', completed: false, blocking: false },
        ]
      },
      {
        id: 5,
        name: 'Performance Tuning Baseline',
        status: 'pending',
        progress: 0,
        tasks: [
          { id: '5-1', name: 'Establish DataDog baseline metrics', completed: false },
          { id: '5-2', name: 'Document performance indicators', completed: false },
          { id: '5-3', name: 'Identify optimization opportunities', completed: false },
          { id: '5-4', name: 'Cache strategy analysis', completed: false },
        ]
      },
      {
        id: 6,
        name: 'Sprint Closure & S11 Kickoff',
        status: 'pending',
        progress: 0,
        tasks: [
          { id: '6-1', name: 'Production stability final audit', completed: false },
          { id: '6-2', name: 'Compile user feedback & metrics summary', completed: false },
          { id: '6-3', name: 'Retrospective & lessons learned', completed: false },
          { id: '6-4', name: 'Sprint 11 formal kickoff', completed: false },
        ]
      }
    ]
  });

  const handleCompleteTask = (phaseId, taskId) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: true
    }));
    
    // Simulate task execution
    setExecutingTasks(prev => ({
      ...prev,
      [taskId]: true
    }));

    setTimeout(() => {
      setExecutingTasks(prev => ({
        ...prev,
        [taskId]: false
      }));
    }, 1500);
  };

  const totalTasks = sprintData.phases.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTasksCount = sprintData.phases.reduce((sum, p) => 
    sum + p.tasks.filter(t => t.completed || completedTasks[t.id]).length, 0
  );
  const blockingTasks = sprintData.phases.flatMap(p => 
    p.tasks.filter(t => t.blocking && !t.completed)
  );

  const pendingPhases = sprintData.phases.filter(p => p.status === 'pending').length;
  const inProgressPhases = sprintData.phases.filter(p => p.status === 'in_progress').length;

  const completionPercentage = Math.round((completedTasksCount / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Sprint Execution Command Center</h1>
            <p className="text-slate-600 mt-2">Sprint 10 → Sprint 11 | Real-time Execution Tracking</p>
          </div>
          <div className="text-right">
            <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700">
              {completionPercentage}% Complete
            </Badge>
            <p className="text-sm text-slate-600 mt-2">
              Last update: {new Date(sprintData.lastUpdate).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-slate-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedTasksCount}/{totalTasks}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-slate-600 text-sm">Phases Done</p>
                <p className="text-3xl font-bold text-blue-600">3/6</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-slate-600 text-sm">In Progress</p>
                <p className="text-3xl font-bold text-yellow-600">{inProgressPhases}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-gray-400">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-slate-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-gray-600">{pendingPhases}</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-l-4 ${blockingTasks.length > 0 ? 'border-l-red-500' : 'border-l-green-500'}`}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-slate-600 text-sm">Blockers</p>
                <p className={`text-3xl font-bold ${blockingTasks.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {blockingTasks.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Sprint 10 Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">Completion Rate</span>
                  <span className="text-lg font-bold text-slate-900">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-3" />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-700 font-semibold">COMPLETED PHASES</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">3</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700 font-semibold">IN PROGRESS</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">1</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-700 font-semibold">PENDING</p>
                  <p className="text-2xl font-bold text-gray-600 mt-1">2</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Blockers Alert */}
        {blockingTasks.length > 0 && (
          <Card className="border-2 border-red-300 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-900">
                <AlertCircle className="w-5 h-5" />
                ⚠️ BLOCKING TASKS DETECTED
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {blockingTasks.map(task => (
                  <div key={task.id} className="p-3 bg-white rounded border-l-4 border-l-red-500">
                    <p className="font-semibold text-red-900">{task.name}</p>
                    <p className="text-sm text-red-700 mt-1">⚡ This task is blocking sprint progress</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Phase Execution */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Flag className="w-5 h-5" />
            Phase Execution Status
          </h2>

          {sprintData.phases.map((phase) => (
            <Card 
              key={phase.id}
              className={`cursor-pointer transition-all border-l-4 ${
                phase.status === 'completed' ? 'border-l-green-500 bg-green-50' :
                phase.status === 'in_progress' ? 'border-l-blue-500 bg-blue-50' :
                'border-l-gray-300 bg-gray-50'
              }`}
              onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {phase.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                    {phase.status === 'in_progress' && <Zap className="w-5 h-5 text-blue-600" />}
                    {phase.status === 'pending' && <Clock className="w-5 h-5 text-gray-400" />}
                    
                    <div>
                      <CardTitle className="text-base">
                        Fase {phase.id}: {phase.name}
                      </CardTitle>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={phase.status === 'completed' ? 'default' : 'outline'}>
                      {phase.progress}%
                    </Badge>
                    {expandedPhase === phase.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                <Progress value={phase.progress} className="mt-3" />
              </CardHeader>

              {expandedPhase === phase.id && (
                <CardContent className="border-t pt-4">
                  <div className="space-y-2">
                    {phase.tasks.map(task => (
                      <div 
                        key={task.id}
                        className={`flex items-center gap-3 p-3 rounded border transition-all ${
                          task.completed || completedTasks[task.id] ? 'bg-green-100 border-green-300' :
                          task.blocking ? 'bg-red-100 border-red-300' :
                          'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {executingTasks[task.id] ? (
                          <Loader2 className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
                        ) : task.completed || completedTasks[task.id] ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded border border-slate-300 flex-shrink-0"></div>
                        )}

                        <span className={`flex-1 text-sm ${
                          task.completed || completedTasks[task.id] ? 'line-through text-slate-400' : 'text-slate-700'
                        }`}>
                          {task.name}
                        </span>

                        {task.blocking && (
                          <Badge className="bg-red-600 text-xs">BLOCKER</Badge>
                        )}

                        {!task.completed && !completedTasks[task.id] && phase.status !== 'pending' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompleteTask(phase.id, task.id);
                            }}
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            ✓ Done
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Next Steps */}
        <Card className="border-2 border-purple-300 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Target className="w-5 h-5" />
              Próximas Ações Críticas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-white rounded-lg border-l-4 border-l-red-500">
              <p className="font-semibold text-red-900">🔴 [HOJE] Complete Fase 4 - Query Analysis</p>
              <p className="text-sm text-red-700 mt-2">Finalize slow query analysis to unblock Fase 5</p>
              <div className="mt-2 flex gap-2">
                <button className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                  Execute Now
                </button>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border-l-4 border-l-yellow-500">
              <p className="font-semibold text-yellow-900">🟡 [2026-03-05] Start Fase 5 - Performance Baseline</p>
              <p className="text-sm text-yellow-700 mt-2">Establish DataDog metrics and optimization strategy</p>
            </div>

            <div className="p-4 bg-white rounded-lg border-l-4 border-l-green-500">
              <p className="font-semibold text-green-900">🟢 [2026-03-10] Fase 6 - Sprint Closure + S11 Kickoff</p>
              <p className="text-sm text-green-700 mt-2">Final audit, retrospective, and Sprint 11 launch</p>
            </div>
          </CardContent>
        </Card>

        {/* Sprint 11 Preview */}
        <Card className="border-2 border-indigo-300 bg-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <Play className="w-5 h-5" />
              Sprint 11 Ready to Launch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-indigo-700 mb-4">
              Performance Optimization & Scaling (2026-03-10 → 2026-03-24)
            </p>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(phase => (
                <div key={phase} className="p-3 bg-white rounded border border-indigo-200 text-center">
                  <p className="text-2xl font-bold text-indigo-600">F{phase}</p>
                  <p className="text-xs text-indigo-700 mt-1">Ready</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}