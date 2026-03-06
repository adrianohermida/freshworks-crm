import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2, Clock, Zap, Target } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Sprint10Phase4BugFixes() {
  const [phaseData] = useState({
    phaseName: 'Sprint 10 Fase 4: Bug Fixes & Hotfixes',
    startDate: '2026-03-05',
    endDate: '2026-03-07',
    duration: '2 days',
    status: 'IN_PROGRESS',
  });

  const bugTriage = [
    {
      severity: 'info',
      title: 'Feature Request: Bulk Export to PDF',
      issueId: 'FR-001',
      submitter: 'User Feedback',
      status: 'logged',
      priority: 'LOW',
      action: 'Log for Sprint 11'
    },
    {
      severity: 'info',
      title: 'UI Enhancement: Sidebar Collapse Animation',
      issueId: 'FR-002',
      submitter: 'User Feedback',
      status: 'logged',
      priority: 'LOW',
      action: 'Log for Sprint 11'
    },
    {
      severity: 'info',
      title: 'Performance: Cache Strategy Analysis',
      issueId: 'PERF-001',
      submitter: '24h Monitoring',
      status: 'documented',
      priority: 'MEDIUM',
      action: 'Hand off to Sprint 11 (Fase 5)'
    },
    {
      severity: 'none',
      title: 'Critical P1 Bugs',
      issueId: 'CRIT-*',
      submitter: 'Production Monitor',
      status: 'none',
      priority: 'NONE',
      action: 'ZERO - System stable ✓'
    }
  ];

  const triageResults = [
    { category: 'P1 Critical Bugs', count: 0, action: 'None - System stable' },
    { category: 'P2 High Priority Bugs', count: 0, action: 'None - Production clean' },
    { category: 'Feature Requests', count: 2, action: 'Log for Sprint 11 backlog' },
    { category: 'Performance Findings', count: 3, action: 'Documented for Sprint 11 Fase 5' },
    { category: 'Low Priority Enhancements', count: 5, action: 'Scheduled for future sprints' },
  ];

  const fase4Tasks = [
    {
      task: 'Issue Triage & Categorization',
      assignee: 'QA Team',
      status: 'completed',
      completion: 100,
      details: '✅ 10 issues reviewed | ✅ 0 P1 bugs found | ✅ All categorized'
    },
    {
      task: 'Critical Bug Fix Assessment',
      assignee: 'Dev Team',
      status: 'completed',
      completion: 100,
      details: '✅ Zero P1 critical bugs | ✅ Production stable | ✅ No hotfixes needed'
    },
    {
      task: 'Performance Analysis & Documentation',
      assignee: 'Backend Team',
      status: 'in_progress',
      completion: 75,
      details: '✅ Baseline metrics established | ✅ Slow queries identified | ⏳ Cache strategy doc pending'
    },
    {
      task: 'Team Synchronization & Handoff',
      assignee: 'Tech Lead',
      status: 'in_progress',
      completion: 50,
      details: '✅ Daily standup active | ⏳ Fase 5 handoff prep | ⏳ Sprint 11 kickoff scheduling'
    },
    {
      task: 'Fase 4 Sign-off & Documentation',
      assignee: 'Project Manager',
      status: 'pending',
      completion: 0,
      details: '⏳ Complete performance report | ⏳ Sign off readiness | ⏳ Update tracker'
    }
  ];

  const fase5Prep = [
    {
      initiative: 'Performance Optimization',
      status: 'queued',
      tasks: ['Query optimization', 'Cache strategy', 'Bundle optimization'],
      readiness: 'Documentation pending'
    },
    {
      initiative: 'Mobile Responsiveness',
      status: 'queued',
      tasks: ['Final UI pass', 'Mobile testing', 'Browser compatibility'],
      readiness: 'Ready to start'
    },
    {
      initiative: 'Monitoring & Alerting',
      status: 'queued',
      tasks: ['DataDog dashboard', 'Alert rules setup', 'Incident response'],
      readiness: 'Ready to start'
    },
    {
      initiative: 'Advanced Search & Filtering',
      status: 'queued',
      tasks: ['Full-text search', 'Advanced filters', 'Saved searches'],
      readiness: 'Design ready'
    },
    {
      initiative: 'Bulk Actions & Automation',
      status: 'queued',
      tasks: ['Bulk operations', 'Automation rules', 'Webhook integration'],
      readiness: 'Design ready'
    },
    {
      initiative: 'Documentation & Knowledge Base',
      status: 'queued',
      tasks: ['User guide', 'API docs', 'Admin handbook'],
      readiness: 'Outline ready'
    }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in_progress': return <Zap className="w-4 h-4 text-blue-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {phaseData.phaseName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Post-deployment issue triage, bug fixes & performance analysis
            </p>
          </div>
          <div className="text-right bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Phase Duration</p>
            <p className="text-xl font-bold text-cyan-600">{phaseData.startDate}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">to {phaseData.endDate} ({phaseData.duration})</p>
            <Badge className="bg-blue-600 mt-2">IN PROGRESS</Badge>
          </div>
        </div>

        {/* STATUS ALERT */}
        <div className="bg-green-50 dark:bg-green-900/30 border-2 border-green-400 dark:border-green-600 rounded-lg p-4">
          <p className="text-sm font-bold text-green-900 dark:text-green-100">
            ✅ FASE 3 (24h Monitoring) COMPLETE - All success criteria passed
          </p>
          <p className="text-xs text-green-800 dark:text-green-200 mt-2">
            Now in Fase 4: Issue triage shows ZERO critical bugs | Production stable | Ready for Fase 5
          </p>
        </div>

        {/* PROGRESS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <div className="text-sm text-gray-600 dark:text-gray-400">Issues Triaged</div>
              <div className="text-3xl font-bold text-blue-600 mt-2">10</div>
              <Progress value={100} className="mt-3" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">All categorized</p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">Fase 4 Progress</div>
              <div className="text-3xl font-bold text-purple-600 mt-2">65%</div>
              <Progress value={65} className="mt-3" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Tasks in flight</p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">Hotfixes Deployed</div>
              <div className="text-3xl font-bold text-green-600 mt-2">0</div>
              <Progress value={100} className="mt-3" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">None needed</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="triage" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="triage">🔍 Issue Triage</TabsTrigger>
            <TabsTrigger value="tasks">📋 Fase 4 Tasks</TabsTrigger>
            <TabsTrigger value="results">📊 Summary</TabsTrigger>
            <TabsTrigger value="sprint11">🚀 Sprint 11 Prep</TabsTrigger>
          </TabsList>

          {/* ISSUE TRIAGE */}
          <TabsContent value="triage" className="space-y-4">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Post-Deployment Issue Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {bugTriage.map((issue, idx) => (
                  <div key={idx} className={`p-4 rounded border ${
                    issue.severity === 'none' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' :
                    'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{issue.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">ID: {issue.issueId} | From: {issue.submitter}</p>
                      </div>
                      <Badge className={
                        issue.severity === 'none' ? 'bg-green-600' :
                        issue.priority === 'LOW' ? 'bg-blue-600' :
                        'bg-yellow-600'
                      }>
                        {issue.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Action:</strong> {issue.action}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* FASE 4 TASKS */}
          <TabsContent value="tasks" className="space-y-4">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Fase 4 Task Execution Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fase4Tasks.map((task, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          {getStatusIcon(task.status)}
                          {task.task}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Assignee: {task.assignee}</p>
                      </div>
                      <Badge className={
                        task.status === 'completed' ? 'bg-green-600' :
                        task.status === 'in_progress' ? 'bg-blue-600' :
                        'bg-yellow-600'
                      }>
                        {task.completion}%
                      </Badge>
                    </div>
                    <Progress value={task.completion} className="mb-2" />
                    <p className="text-xs text-gray-700 dark:text-gray-300">{task.details}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SUMMARY */}
          <TabsContent value="results" className="space-y-4">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Issue Triage Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {triageResults.map((result, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{result.category}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{result.action}</p>
                        </div>
                        <Badge className={result.count === 0 ? 'bg-green-600' : 'bg-blue-600'}>
                          {result.count} {result.count === 1 ? 'item' : 'items'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20">
              <CardHeader>
                <CardTitle className="text-green-900 dark:text-green-100">🎉 Fase 4 Key Finding</CardTitle>
              </CardHeader>
              <CardContent className="text-green-800 dark:text-green-200">
                <p className="font-semibold">Zero Critical P1 Bugs Detected</p>
                <p className="text-sm mt-2">
                  Production deployment stable. No hotfixes required. All issues are low-priority feature requests or performance optimization tasks to be scheduled in Sprint 11.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SPRINT 11 PREP */}
          <TabsContent value="sprint11" className="space-y-4">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Sprint 11 Initiatives - Ready Queue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fase5Prep.map((init, idx) => (
                  <div key={idx} className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-700">
                    <div className="flex items-start justify-between mb-3">
                      <p className="font-semibold text-gray-900 dark:text-white">{init.initiative}</p>
                      <Badge className="bg-purple-600">Queued</Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Tasks</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {init.tasks.map((t, i) => (
                            <Badge key={i} variant="outline" className="text-purple-600 border-purple-600">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-purple-700 dark:text-purple-300 mt-2">
                        <strong>Readiness:</strong> {init.readiness}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* NEXT ACTIONS */}
        <Card className="dark:bg-gray-800 border-l-4 border-l-cyan-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Remaining Fase 4 Actions (Today → 2026-03-07)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-700">
              <p className="font-semibold text-blue-900 dark:text-blue-100">📊 Performance Analysis (TODAY)</p>
              <p className="text-xs text-blue-800 dark:text-blue-200 mt-2">
                Complete slow query analysis | Finalize cache strategy document | Hand off findings to Sprint 11 Fase 5
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded border border-purple-200 dark:border-purple-700">
              <p className="font-semibold text-purple-900 dark:text-purple-100">👥 Team Handoff (2026-03-06)</p>
              <p className="text-xs text-purple-800 dark:text-purple-200 mt-2">
                Daily standup with all teams | Prepare Sprint 11 kickoff materials | Final sign-off on Fase 4 completion
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-700">
              <p className="font-semibold text-green-900 dark:text-green-100">✅ Fase 4 Sign-off (2026-03-07)</p>
              <p className="text-xs text-green-800 dark:text-green-200 mt-2">
                Complete documentation | Update Sprint tracker | Unlock Sprint 10 Fase 5 | Prepare Fase 6 closure
              </p>
            </div>
          </CardContent>
        </Card>

        {/* PHASE FLOW */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Sprint 10 Phase Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between overflow-x-auto gap-2">
              <div className="flex flex-col items-center gap-2">
                <Badge className="bg-green-600">✅ F1</Badge>
                <p className="text-xs text-gray-600">Pre-Deploy</p>
              </div>
              <div className="flex-1 h-1 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex flex-col items-center gap-2">
                <Badge className="bg-green-600">✅ F2</Badge>
                <p className="text-xs text-gray-600">Deploy</p>
              </div>
              <div className="flex-1 h-1 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex flex-col items-center gap-2">
                <Badge className="bg-green-600">✅ F3</Badge>
                <p className="text-xs text-gray-600">Monitor</p>
              </div>
              <div className="flex-1 h-1 bg-blue-400 dark:bg-blue-600"></div>
              <div className="flex flex-col items-center gap-2">
                <Badge className="bg-blue-600">🔄 F4</Badge>
                <p className="text-xs text-gray-600">Bugs</p>
              </div>
              <div className="flex-1 h-1 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex flex-col items-center gap-2">
                <Badge className="bg-gray-600">⏳ F5</Badge>
                <p className="text-xs text-gray-600">Perf</p>
              </div>
              <div className="flex-1 h-1 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex flex-col items-center gap-2">
                <Badge className="bg-gray-600">⏳ F6</Badge>
                <p className="text-xs text-gray-600">Close</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}