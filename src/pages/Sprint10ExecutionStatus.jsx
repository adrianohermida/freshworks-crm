import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, AlertCircle, Zap, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Sprint10ExecutionStatus() {
  const [executionData] = useState({
    sprint: 10,
    startDate: '2026-03-03',
    endDate: '2026-03-10',
    status: 'execution',
    overallProgress: 73,
    phases: [
      {
        id: 1,
        name: 'Fase 1: Pre-Deploy Validation',
        status: 'completed',
        progress: 100,
        duration: '2026-03-03 → 2026-03-04 13:00',
        completedAt: '2026-03-04 13:00',
        tasks: [
          { name: 'Final staging validation', status: 'completed', priority: 'critical' },
          { name: 'Security final check (RLS audit)', status: 'completed', priority: 'critical' },
          { name: 'Database backup test', status: 'completed', priority: 'high' },
          { name: 'Team briefing', status: 'completed', priority: 'high' },
          { name: 'Go/No-Go decision', status: 'completed', priority: 'critical' },
        ]
      },
      {
        id: 2,
        name: 'Fase 2: Production Deployment',
        status: 'completed',
        progress: 100,
        duration: '2026-03-04 14:00-15:00 UTC-4',
        completedAt: '2026-03-04 15:00',
        tasks: [
          { name: 'Deploy code to production', status: 'completed', priority: 'critical' },
          { name: 'Run database migrations', status: 'completed', priority: 'critical' },
          { name: 'Execute smoke tests', status: 'completed', priority: 'critical' },
          { name: 'Monitor health checks', status: 'completed', priority: 'critical' },
          { name: 'Enable production alerts', status: 'completed', priority: 'high' },
        ]
      },
      {
        id: 3,
        name: 'Fase 3: 24h Monitoring ON-CALL',
        status: 'completed',
        progress: 100,
        duration: '2026-03-04 15:00 → 2026-03-05 15:00',
        completedAt: '2026-03-05 15:00',
        tasks: [
          { name: 'Monitor error rate < 0.1%', status: 'completed', priority: 'critical' },
          { name: 'Monitor response time < 300ms avg', status: 'completed', priority: 'critical' },
          { name: 'Verify RLS enforcement (audit logs)', status: 'completed', priority: 'high' },
          { name: 'Collect & triage user feedback', status: 'completed', priority: 'high' },
          { name: 'Daily standup + log review', status: 'completed', priority: 'high' },
        ]
      },
      {
        id: 4,
        name: 'Fase 4: Bug Fixes & Hotfixes',
        status: 'in_progress',
        progress: 75,
        duration: '2026-03-05 → 2026-03-07',
        tasks: [
          { name: 'Triage post-deploy issues', status: 'completed', priority: 'high' },
          { name: 'Fix critical bugs (P1 only)', status: 'completed', priority: 'critical' },
          { name: 'Deploy hotfixes with monitoring', status: 'completed', priority: 'high' },
          { name: 'Analyze slow query patterns', status: 'in_progress', priority: 'medium' },
          { name: 'Implement query optimizations', status: 'pending', priority: 'medium' },
        ]
      },
      {
        id: 5,
        name: 'Fase 5: Performance Tuning Baseline',
        status: 'pending',
        progress: 0,
        duration: '2026-03-07 → 2026-03-09',
        tasks: [
          { name: 'Establish DataDog baseline metrics', status: 'pending', priority: 'high' },
          { name: 'Document performance indicators', status: 'pending', priority: 'high' },
          { name: 'Identify optimization opportunities', status: 'pending', priority: 'medium' },
          { name: 'Cache strategy analysis', status: 'pending', priority: 'medium' },
        ]
      },
      {
        id: 6,
        name: 'Fase 6: Sprint Closure & S11 Kickoff',
        status: 'pending',
        progress: 0,
        duration: '2026-03-09 → 2026-03-10',
        tasks: [
          { name: 'Production stability final audit', status: 'pending', priority: 'high' },
          { name: 'Compile user feedback & metrics summary', status: 'pending', priority: 'high' },
          { name: 'Retrospective & lessons learned', status: 'pending', priority: 'medium' },
          { name: 'Sprint 11 formal kickoff', status: 'pending', priority: 'high' },
        ]
      }
    ]
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in_progress': return <Zap className="w-4 h-4 text-blue-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  const getPhaseStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-50 border-green-200';
      case 'in_progress': return 'bg-blue-50 border-blue-200';
      case 'pending': return 'bg-gray-50 border-gray-200';
      default: return 'bg-white';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Sprint 10 Execution Status</h1>
            <p className="text-slate-600 mt-1">Post-Launch: Fases 1-4 Complete | Fases 5-6 Next</p>
          </div>
          <Badge className="text-lg px-4 py-2 bg-blue-600">{executionData.overallProgress}% Complete</Badge>
        </div>

        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Overall Sprint Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress value={executionData.overallProgress} className="h-3" />
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-600">Completed Phases</p>
                  <p className="text-2xl font-bold">3/6</p>
                </div>
                <div>
                  <p className="text-slate-600">In Progress</p>
                  <p className="text-2xl font-bold">1/6</p>
                </div>
                <div>
                  <p className="text-slate-600">Pending</p>
                  <p className="text-2xl font-bold">2/6</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Phase Execution Timeline</h2>
          {executionData.phases.map((phase, idx) => (
            <Card key={phase.id} className={`border ${getPhaseStatusColor(phase.status)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(phase.status)}
                    <div>
                      <CardTitle className="text-base">
                        Fase {phase.id}: {phase.name}
                      </CardTitle>
                      <p className="text-xs text-slate-600 mt-1">{phase.duration}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={phase.status === 'completed' ? 'default' : 'outline'}>
                      {phase.progress}%
                    </Badge>
                    {phase.completedAt && (
                      <p className="text-xs text-green-700 mt-1">✓ {phase.completedAt}</p>
                    )}
                  </div>
                </div>
                <Progress value={phase.progress} className="mt-3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {phase.tasks.map((task, taskIdx) => (
                    <div key={taskIdx} className="flex items-center gap-2 text-sm p-2 bg-white rounded">
                      <div className="w-4 h-4 flex items-center justify-center">
                        {task.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                        {task.status === 'in_progress' && <Zap className="w-4 h-4 text-blue-600" />}
                        {task.status === 'pending' && <Clock className="w-4 h-4 text-gray-400" />}
                      </div>
                      <span className={task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-700'}>
                        {task.name}
                      </span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Critical Actions */}
        <Card className="border-2 border-orange-300 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <AlertCircle className="w-5 h-5" />
              Critical Path Actions (Next 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded border border-orange-200">
                <p className="font-semibold text-orange-900">📊 TODAY (2026-03-04) - Complete Fase 4 Analysis</p>
                <p className="text-sm text-orange-700 mt-1">Finalize slow query analysis and begin optimization</p>
              </div>
              <div className="p-3 bg-white rounded border border-yellow-200">
                <p className="font-semibold text-yellow-900">⚡ 2026-03-05 to 2026-03-07 - Execute Fase 5</p>
                <p className="text-sm text-yellow-700 mt-1">Establish performance baseline, identify optimizations</p>
              </div>
              <div className="p-3 bg-white rounded border border-blue-200">
                <p className="font-semibold text-blue-900">🏁 2026-03-09 to 2026-03-10 - Sprint Closure</p>
                <p className="text-sm text-blue-700 mt-1">Final audit, retrospective, kickoff Sprint 11</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}