import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Clock, TrendingUp, Target, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SprintExecutionControl() {
  const [executionState] = useState({
    currentDate: '2026-03-05',
    projectStart: '2026-03-01',
    totalDays: 10,
    elapsedDays: 4,
  });

  const sprintOverview = [
    {
      sprint: 'Sprint 9',
      phase: 'Security & RLS',
      status: 'COMPLETE',
      completion: 100,
      duration: '7 days',
      endDate: '2026-03-03',
      tasks: 7,
      completed: 7,
      link: 'SprintTracker'
    },
    {
      sprint: 'Sprint 10',
      phase: 'Post-Launch',
      status: 'IN_PROGRESS',
      completion: 73,
      duration: '10 days',
      endDate: '2026-03-10',
      tasks: 28,
      completed: 20,
      link: 'SprintTracker'
    },
    {
      sprint: 'Sprint 11',
      phase: 'Performance',
      status: 'LOCKED',
      completion: 0,
      duration: '14 days',
      endDate: '2026-03-24',
      tasks: 30,
      completed: 0,
      link: 'SprintTracker'
    }
  ];

  const phaseDetails = [
    {
      phase: 'Fase 1: Pre-Deploy',
      sprint: 'Sprint 10',
      duration: '2026-03-03',
      status: 'COMPLETE',
      completion: 100,
      tasks: [
        { name: 'Staging validation', status: 'completed' },
        { name: 'RLS security audit', status: 'completed' },
        { name: 'Database backup test', status: 'completed' },
        { name: 'Team briefing', status: 'completed' },
        { name: 'Go/No-Go decision', status: 'completed' }
      ],
      dashboard: 'SprintExecutionReview'
    },
    {
      phase: 'Fase 2: Deployment',
      sprint: 'Sprint 10',
      duration: '2026-03-04 14:00-15:00',
      status: 'COMPLETE',
      completion: 100,
      tasks: [
        { name: 'Code deployment', status: 'completed' },
        { name: 'Database migrations', status: 'completed' },
        { name: 'Smoke tests (47/47)', status: 'completed' },
        { name: 'Health checks', status: 'completed' },
        { name: 'Monitoring activation', status: 'completed' }
      ],
      dashboard: 'Sprint10Phase3Monitor'
    },
    {
      phase: 'Fase 3: 24h Monitoring',
      sprint: 'Sprint 10',
      duration: '2026-03-04 15:00 → 2026-03-05 15:00',
      status: 'COMPLETE',
      completion: 100,
      tasks: [
        { name: 'Error rate < 0.1%', status: 'completed' },
        { name: 'Response time < 300ms', status: 'completed' },
        { name: 'RLS enforcement verified', status: 'completed' },
        { name: 'Database integrity checked', status: 'completed' },
        { name: 'Critical issues: 0', status: 'completed' }
      ],
      dashboard: 'Sprint10Phase3Monitor'
    },
    {
      phase: 'Fase 4: Bug Fixes',
      sprint: 'Sprint 10',
      duration: '2026-03-05 → 2026-03-07',
      status: 'IN_PROGRESS',
      completion: 65,
      tasks: [
        { name: 'Issue triage (10 reviewed)', status: 'completed' },
        { name: 'Critical bug fixes (0 P1)', status: 'completed' },
        { name: 'Hotfix deployment (0 needed)', status: 'completed' },
        { name: 'Performance analysis', status: 'in_progress' },
        { name: 'Fase sign-off', status: 'pending' }
      ],
      dashboard: 'Sprint10Phase4BugFixes'
    },
    {
      phase: 'Fase 5: Performance',
      sprint: 'Sprint 10',
      duration: '2026-03-07 → 2026-03-09',
      status: 'BLOCKED',
      completion: 0,
      tasks: [
        { name: 'DataDog dashboard setup', status: 'pending' },
        { name: 'Cache strategy analysis', status: 'pending' },
        { name: 'Bundle optimization', status: 'pending' },
        { name: 'Sprint 11 materials prep', status: 'pending' },
        { name: 'Performance baseline lock', status: 'pending' }
      ],
      dashboard: null
    },
    {
      phase: 'Fase 6: Closure',
      sprint: 'Sprint 10',
      duration: '2026-03-09 → 2026-03-10',
      status: 'BLOCKED',
      completion: 0,
      tasks: [
        { name: 'Production audit', status: 'pending' },
        { name: 'Retrospective', status: 'pending' },
        { name: 'Sprint 11 kickoff', status: 'pending' },
        { name: 'Team alignment', status: 'pending' },
        { name: 'Update roadmap', status: 'pending' }
      ],
      dashboard: null
    }
  ];

  const completedItems = [
    { category: 'Sprints Completed', count: 1, total: 3, detail: 'Sprint 9 (Security & RLS)' },
    { category: 'Phases Completed', count: 3, total: 6, detail: 'F1 (Pre), F2 (Deploy), F3 (Monitor)' },
    { category: 'Critical Bugs', count: 0, total: 0, detail: 'Zero P1 issues found' },
    { category: 'Tasks Completed', count: 20, total: 28, detail: 'Sprint 10: 20/28 tasks done' },
    { category: 'Success Criteria', count: 6, total: 6, detail: 'All Fase 3 monitoring criteria met' },
    { category: 'Features Deployed', count: 1, total: 1, detail: 'Production deployment live' }
  ];

  const pendingItems = [
    { category: 'Phases Pending', count: 2, total: 6, detail: 'Fases 5-6 (blocked, waiting on 4)' },
    { category: 'Performance Tasks', count: 5, total: 5, detail: 'Cache, bundle, baseline, docs' },
    { category: 'Sprint 11 Initiatives', count: 0, total: 30, detail: '6 initiatives, 30 subtasks queued' },
    { category: 'Team Meetings', count: 1, total: 3, detail: 'Daily standups + S11 kickoff pending' },
    { category: 'Documentation', count: 2, total: 5, detail: 'Cache & perf strategy docs in progress' },
    { category: 'Sign-offs Required', count: 3, total: 4, detail: 'F4, F5, F6 closure pending' }
  ];

  const roadmapProgress = [
    { segment: 'Sprint 9 Complete', percentage: 33, status: 'done' },
    { segment: 'Sprint 10 (73%)', percentage: 40, status: 'in_progress' },
    { segment: 'Sprint 11 Ready', percentage: 5, status: 'locked' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'COMPLETE': return 'bg-green-600';
      case 'IN_PROGRESS': return 'bg-blue-600';
      case 'BLOCKED': return 'bg-gray-600';
      case 'LOCKED': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return '✅';
      case 'in_progress': return '🔄';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* EXECUTIVE HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              🎯 Sprint Execution Control Center
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Complete sprint tracking, phase management & roadmap execution
            </p>
          </div>
          <div className="text-right bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Project Timeline</p>
            <p className="text-xl font-bold text-cyan-600">{executionState.elapsedDays}/{executionState.totalDays} days</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{executionState.currentDate}</p>
            <Badge className="bg-blue-600 mt-2">{Math.round((executionState.elapsedDays/executionState.totalDays)*100)}% Elapsed</Badge>
          </div>
        </div>

        {/* CRITICAL SUMMARY */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 border-2 border-cyan-400 dark:border-cyan-600 rounded-lg p-6">
          <p className="text-sm font-bold text-cyan-900 dark:text-cyan-100">
            ✅ FASES 1-3 COMPLETE • 🔄 FASE 4 AT 65% • ⏳ FASES 5-6 BLOCKED • 🚀 SPRINT 11 READY
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1">
              <Progress value={73} className="h-3" />
              <p className="text-xs text-cyan-700 dark:text-cyan-300 mt-2">Sprint 10: 73% Complete (20/28 tasks)</p>
            </div>
            <p className="text-2xl font-bold text-cyan-600">+11% Today</p>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Completion</div>
              <div className="text-3xl font-bold text-cyan-600 mt-2">73%</div>
              <Progress value={73} className="mt-3" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Sprint 10 + 11 combined</p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</div>
              <div className="text-3xl font-bold text-green-600 mt-2">20/28</div>
              <Progress value={71} className="mt-3" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Sprint 10 active tasks</p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">Critical Issues</div>
              <div className="text-3xl font-bold text-green-600 mt-2">0</div>
              <Progress value={100} className="mt-3" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">System stable</p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">Next Milestone</div>
              <div className="text-3xl font-bold text-purple-600 mt-2">Fase 5</div>
              <Progress value={0} className="mt-3" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">2026-03-07 unlock</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">📊 Overview</TabsTrigger>
            <TabsTrigger value="phases">📋 Phases</TabsTrigger>
            <TabsTrigger value="completed">✅ Completed</TabsTrigger>
            <TabsTrigger value="pending">⏳ Pending</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-4">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Sprint Overview & Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sprintOverview.map((sprint, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{sprint.sprint}: {sprint.phase}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Duration: {sprint.duration} | End: {sprint.endDate}</p>
                      </div>
                      <Badge className={getStatusColor(sprint.status)}>{sprint.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Progress value={sprint.completion} />
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{sprint.completed}/{sprint.tasks} tasks</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{sprint.completion}%</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Overall Roadmap Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden flex">
                  {roadmapProgress.map((seg, idx) => (
                    <div 
                      key={idx}
                      className={`h-full flex items-center justify-center text-xs font-bold text-white ${
                        seg.status === 'done' ? 'bg-green-600' :
                        seg.status === 'in_progress' ? 'bg-blue-600' :
                        'bg-purple-600'
                      }`}
                      style={{width: `${seg.percentage}%`}}
                    >
                      {seg.percentage > 5 && seg.segment}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Sprint 9 (33%) | Sprint 10 (40%) | Sprint 11 Ready (5%) | Total: <strong>78% planning complete</strong>
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PHASES */}
          <TabsContent value="phases" className="space-y-4">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Sprint 10 Phase Execution Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {phaseDetails.map((phase, idx) => (
                  <div key={idx} className={`p-4 rounded border-l-4 ${
                    phase.status === 'COMPLETE' ? 'bg-green-50 dark:bg-green-900/20 border-l-green-500' :
                    phase.status === 'IN_PROGRESS' ? 'bg-blue-50 dark:bg-blue-900/20 border-l-blue-500' :
                    'bg-gray-50 dark:bg-gray-700 border-l-gray-500'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{phase.phase}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{phase.duration}</p>
                      </div>
                      <Badge className={getStatusColor(phase.status)}>{phase.status}</Badge>
                    </div>
                    
                    <Progress value={phase.completion} className="mb-3" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {phase.tasks.map((task, i) => (
                        <div key={i} className="text-xs flex items-center gap-2">
                          <span>{getStatusIcon(task.status)}</span>
                          <span className="text-gray-700 dark:text-gray-300">{task.name}</span>
                        </div>
                      ))}
                    </div>

                    {phase.dashboard && (
                      <Link 
                        to={createPageUrl(phase.dashboard)}
                        className="mt-3 text-xs font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400"
                      >
                        → View Dashboard
                      </Link>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* COMPLETED */}
          <TabsContent value="completed" className="space-y-4">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  What Has Been Completed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {completedItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-700">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900 dark:text-white">{item.category}</p>
                      <Badge className="bg-green-600">{item.count}/{item.total}</Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{item.detail}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* PENDING */}
          <TabsContent value="pending" className="space-y-4">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  What's Still Pending
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900 dark:text-white">{item.category}</p>
                      <Badge className="bg-yellow-600">{item.count}/{item.total} Pending</Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{item.detail}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* EXECUTION PLAN */}
        <Card className="dark:bg-gray-800 border-l-4 border-l-cyan-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Execution Plan: What Needs to Happen Next
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-700">
              <p className="font-semibold text-blue-900 dark:text-blue-100">📅 TODAY (2026-03-05) - FASE 4 COMPLETION</p>
              <ul className="text-xs text-blue-800 dark:text-blue-200 mt-2 space-y-1">
                <li>✅ Complete performance analysis documentation</li>
                <li>✅ Hand off cache strategy to Sprint 11</li>
                <li>✅ Finalize Fase 4 sign-off</li>
              </ul>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded border border-purple-200 dark:border-purple-700">
              <p className="font-semibold text-purple-900 dark:text-purple-100">👥 TOMORROW (2026-03-06) - TEAM HANDOFF</p>
              <ul className="text-xs text-purple-800 dark:text-purple-200 mt-2 space-y-1">
                <li>📊 Team standup with performance metrics</li>
                <li>🔄 Prepare Fase 5 kickoff materials</li>
                <li>🎯 Sprint 11 team briefing</li>
              </ul>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-700">
              <p className="font-semibold text-green-900 dark:text-green-100">🚀 2026-03-07 - FASE 5 UNLOCK</p>
              <ul className="text-xs text-green-800 dark:text-green-200 mt-2 space-y-1">
                <li>🔓 Unlock Performance Optimization phase</li>
                <li>📊 Activate DataDog monitoring dashboard</li>
                <li>⚡ Begin query & cache optimization</li>
              </ul>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded border border-indigo-200 dark:border-indigo-700">
              <p className="font-semibold text-indigo-900 dark:text-indigo-100">✨ 2026-03-10 - SPRINT 11 KICKOFF</p>
              <ul className="text-xs text-indigo-800 dark:text-indigo-200 mt-2 space-y-1">
                <li>🎉 Formal Sprint 11 kickoff meeting</li>
                <li>📋 Begin 6 initiatives (30 subtasks)</li>
                <li>📈 Target: 75% roadmap completion by 2026-03-20</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* FINAL STATUS */}
        <Card className="dark:bg-gray-800 bg-gradient-to-r from-cyan-50 to-green-50 dark:from-cyan-900/20 dark:to-green-900/20">
          <CardHeader>
            <CardTitle>🎯 Executor Final Status Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">✅ COMPLETED</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Sprint 9 + Fases 1-3 of Sprint 10</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">🔄 IN PROGRESS</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Fase 4: Bug Fixes (65%)</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">⏳ PENDING</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Fases 5-6 + Sprint 11 (locked)</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">📈 PROGRESS</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">+11% today (65% → 73%)</p>
              </div>
            </div>
            <p className="font-semibold text-cyan-700 dark:text-cyan-300 mt-3">
              🎯 ROADMAP COMPLETION: 73% | TARGET: 75%+ by Mar 20, 2026
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}