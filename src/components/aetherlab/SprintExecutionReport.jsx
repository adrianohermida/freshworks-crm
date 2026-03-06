import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, AlertCircle, Zap, TrendingUp, Target } from 'lucide-react';

export default function SprintExecutionReport() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [activeTab, setActiveTab] = useState('overview');

  // SPRINT 5 DETAILED BREAKDOWN
  const sprint5Data = {
    name: 'Sprint 5: Global Expansion',
    startDate: 'Jan 20, 2026',
    endDate: 'Mar 7, 2026',
    duration: '6 weeks',
    currentProgress: 48,
    targetProgress: 85,
    daysRemaining: 4,
    status: 'CRITICAL - FINAL EXECUTION'
  };

  // COMPLETED WORK (25 tasks)
  const completedTasks = [
    { phase: 'Phase 1: Stabilization', tasks: 5, status: '100%', icon: '✅' },
    { phase: 'Phase 2: Optimization', tasks: 6, status: '100%', icon: '✅' },
    { phase: 'Phase 3: Roadmap v3.1', tasks: 5, status: '100%', icon: '✅' },
    { phase: 'Phase 4: Growth & Dominance', tasks: 4, status: '100%', icon: '✅' },
    { phase: 'Phase 5: Sprint Progress', tasks: 5, status: '100%', icon: '✅' },
    { phase: '  → i18n Manager (5 languages)', subtask: true, status: '100%', icon: '🌐' },
    { phase: '  → Regional Compliance Matrix', subtask: true, status: '100%', icon: '📋' },
    { phase: '  → Global Support Hub 24/7', subtask: true, status: '100%', icon: '🌍' },
    { phase: '  → Multi-Region Deployment', subtask: true, status: '100%', icon: '🚀' },
    { phase: '  → Design Refactor (Minimalist)', subtask: true, status: '100%', icon: '🎨' }
  ];

  // PENDING WORK (7 tasks in Sprint 5)
  const pendingTasks = [
    {
      id: 1,
      name: 'Go-to-Market Regional (4 mercados)',
      current: 45,
      target: 100,
      criticalPath: true,
      daysLeft: 4,
      priority: 'CRITICAL',
      team: 'Marketing + Product',
      deliverables: [
        'Brasil market page (copy + visuals)',
        'Europe market page (compliance focus)',
        'USA market page (enterprise messaging)',
        'LATAM consolidated strategy'
      ]
    },
    {
      id: 2,
      name: 'Certifications Tracker (automations)',
      current: 50,
      target: 100,
      criticalPath: true,
      daysLeft: 5,
      priority: 'HIGH',
      team: 'Backend + DevOps',
      deliverables: [
        'SOC 2 Type II automation',
        'ISO 27001 tracking dashboard',
        'GDPR compliance checkpoints',
        'Email notifications + updates'
      ]
    },
    {
      id: 3,
      name: 'Enterprise Partnerships (pipeline)',
      current: 25,
      target: 100,
      criticalPath: true,
      daysLeft: 7,
      priority: 'HIGH',
      team: 'Sales + BD',
      deliverables: [
        'Partnership pipeline dashboard',
        'Lead scoring automation',
        'Integration readiness checklist'
      ]
    },
    {
      id: 4,
      name: 'i18n Integration (all pages)',
      current: 40,
      target: 100,
      criticalPath: false,
      daysLeft: 10,
      priority: 'MEDIUM',
      team: 'Frontend',
      deliverables: [
        'Home + Pricing page i18n',
        'Dashboard translations (5 languages)',
        'RTL layout fixes',
        'Language switcher in all headers'
      ]
    },
    {
      id: 5,
      name: 'Multi-region AWS deployment',
      current: 30,
      target: 100,
      criticalPath: false,
      daysLeft: 14,
      priority: 'MEDIUM',
      team: 'DevOps + Infrastructure',
      deliverables: [
        'US-East region setup',
        'EU-West region setup',
        'BR-South region setup',
        'CDN + Load balancing'
      ]
    }
  ];

  // PROJECT-WIDE METRICS
  const projectMetrics = {
    totalPhases: 6,
    completedPhases: 4,
    inProgressPhases: 1,
    plannedPhases: 1,
    totalTasks: 40,
    completedTasks: 25,
    inProgressTasks: 7,
    plannedTasks: 8,
    totalCompletion: 62.5,
    estimatedFinalCompletion: '100% (May 26, 2026)'
  };

  // PHASE 6 PLANNED (8 tasks)
  const phase6Tasks = [
    { id: 1, name: 'AI Document Analysis', weeks: 4, priority: 'CRITICAL', startDate: 'Mar 10' },
    { id: 2, name: 'Mobile App (iOS+Android)', weeks: 8, priority: 'CRITICAL', startDate: 'Mar 10' },
    { id: 3, name: 'Zapier + Make Integrations', weeks: 4, priority: 'HIGH', startDate: 'Mar 24' },
    { id: 4, name: 'Advanced Webhooks', weeks: 4, priority: 'MEDIUM', startDate: 'Mar 31' },
    { id: 5, name: 'PDF Reports & Analytics', weeks: 6, priority: 'MEDIUM', startDate: 'Apr 7' },
    { id: 6, name: 'REST API v2', weeks: 5, priority: 'HIGH', startDate: 'Apr 7' },
    { id: 7, name: 'ML Forecasting Models', weeks: 6, priority: 'MEDIUM', startDate: 'Apr 21' },
    { id: 8, name: 'Security Audit + Launch', weeks: 6, priority: 'CRITICAL', startDate: 'May 5' }
  ];

  const executionPlan = [
    {
      day: 'Monday (Mar 3)',
      focus: 'Go-to-Market Regional Sprint',
      tasks: [
        '✏️ Finalize Brasil market page copy',
        '🎨 Complete Europe market visuals',
        '📍 Start USA market messaging'
      ]
    },
    {
      day: 'Tuesday (Mar 4)',
      focus: 'Marketing + Certs Push',
      tasks: [
        '✏️ Finish USA market page',
        '🏆 Complete SOC 2 automation',
        '📊 Start ISO 27001 dashboard'
      ]
    },
    {
      day: 'Wednesday (Mar 5)',
      focus: 'Certifications + i18n',
      tasks: [
        '🏆 ISO 27001 tracking live',
        '🌐 Home page i18n complete',
        '📄 Pricing page translations'
      ]
    },
    {
      day: 'Thursday (Mar 6)',
      focus: 'Enterprise + Dashboards',
      tasks: [
        '🤝 Partnership dashboard live',
        '📱 Dashboard i18n (5 languages)',
        '✅ RTL layout fixes'
      ]
    },
    {
      day: 'Friday (Mar 7)',
      focus: 'QA & Production Release',
      tasks: [
        '🧪 Complete QA across all items',
        '🚀 Production deployment',
        '✅ Sprint 5 = 85% COMPLETE'
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER - EXECUTIVE SUMMARY */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-700' : 'bg-gradient-to-r from-indigo-100 to-purple-100 border-indigo-400'}`}>
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-10 h-10" />
            🎯 SPRINT EXECUTION REPORT - FINAL PUSH
          </h1>
          <p className={`text-lg mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Sprint 5: Global Expansion | Current: 48% | Target: 85% (Mar 7) | Project Total: 62.5%
          </p>
          <div className="grid md:grid-cols-5 gap-4">
            <div>
              <Badge className="bg-orange-600 mb-2">Sprint 5 Progress</Badge>
              <p className="text-3xl font-bold text-orange-600">{sprint5Data.currentProgress}%</p>
            </div>
            <div>
              <Badge className="bg-red-600 mb-2">Target This Week</Badge>
              <p className="text-3xl font-bold text-red-600">{sprint5Data.targetProgress}%</p>
            </div>
            <div>
              <Badge className="bg-purple-600 mb-2">Project Total</Badge>
              <p className="text-3xl font-bold text-purple-600">{projectMetrics.totalCompletion.toFixed(1)}%</p>
            </div>
            <div>
              <Badge className="bg-red-700 animate-pulse mb-2">Days to Deadline</Badge>
              <p className="text-3xl font-bold text-red-600">{sprint5Data.daysRemaining}d</p>
            </div>
            <div>
              <Badge className="bg-blue-600 mb-2">Phase 6 Start</Badge>
              <p className="text-3xl font-bold text-blue-600">Mar 10</p>
            </div>
          </div>
        </section>

        {/* MAIN TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">📊 Overview</TabsTrigger>
            <TabsTrigger value="completed">✅ Done (25)</TabsTrigger>
            <TabsTrigger value="pending">⏳ Pending (7)</TabsTrigger>
            <TabsTrigger value="execution">🎯 Execution Plan</TabsTrigger>
            <TabsTrigger value="phase6">Phase 6</TabsTrigger>
          </TabsList>

          {/* TAB 1: OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Project Completion Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Overall Project Progress</span>
                    <span className="text-2xl font-bold">{projectMetrics.totalCompletion.toFixed(1)}%</span>
                  </div>
                  <Progress value={projectMetrics.totalCompletion} className="h-4" />
                  <p className="text-xs mt-2">{projectMetrics.completedTasks}/{projectMetrics.totalTasks} tasks complete | Target: 100% by May 26, 2026</p>
                </div>

                <div className="grid md:grid-cols-6 gap-4 mt-6">
                  <div className="text-center p-3 rounded-lg bg-opacity-50 border">
                    <p className="text-2xl font-bold text-green-600">{projectMetrics.completedPhases}</p>
                    <p className="text-xs">Phases Done</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-opacity-50 border">
                    <p className="text-2xl font-bold text-orange-600">1</p>
                    <p className="text-xs">In Progress</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-opacity-50 border">
                    <p className="text-2xl font-bold text-purple-600">1</p>
                    <p className="text-xs">Planned</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-opacity-50 border">
                    <p className="text-2xl font-bold text-green-600">{projectMetrics.completedTasks}</p>
                    <p className="text-xs">Tasks Done</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-opacity-50 border">
                    <p className="text-2xl font-bold text-orange-600">{projectMetrics.inProgressTasks}</p>
                    <p className="text-xs">In Progress</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-opacity-50 border">
                    <p className="text-2xl font-bold text-purple-600">{projectMetrics.plannedTasks}</p>
                    <p className="text-xs">Planned</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`border-2 ${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-400'}`}>
              <CardHeader>
                <CardTitle>Sprint 5 Status Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-bold mb-2">Sprint 5 Progress</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Progress value={48} className="h-3 flex-1" />
                      <span className="font-bold">48%</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold mb-2">Target by Mar 7</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Progress value={85} className="h-3 flex-1" />
                      <span className="font-bold">85%</span>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Items Complete</p>
                    <p className="text-2xl font-bold">5/7</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Items Pending</p>
                    <p className="text-2xl font-bold">7/7</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Days Left</p>
                    <p className="text-2xl font-bold">{sprint5Data.daysRemaining}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: COMPLETED */}
          <TabsContent value="completed" className="space-y-4">
            <Card className={`border-2 ${isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-400'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ✅ 25 Completed Tasks (100%)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {completedTasks.map((task, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{task.icon}</span>
                        <div>
                          <p className={`${task.subtask ? 'text-sm' : 'font-bold'}`}>{task.phase}</p>
                          {!task.subtask && <p className="text-xs text-gray-600 dark:text-gray-400">{task.tasks} tasks</p>}
                        </div>
                      </div>
                      <Badge className="bg-green-600">{task.status}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: PENDING */}
          <TabsContent value="pending" className="space-y-6">
            <Card className={`border-2 ${isDark ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-400'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  🔴 7 Pending Tasks (Critical Path to 85%)
                </CardTitle>
              </CardHeader>
            </Card>

            {pendingTasks.map((task) => (
              <Card key={task.id} className={`border-2 ${task.criticalPath ? isDark ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-400' : isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-400'}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{task.name}</CardTitle>
                      <div className="flex gap-2 flex-wrap">
                        <Badge className={task.priority === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-600'}>
                          {task.priority}
                        </Badge>
                        <Badge className="bg-gray-600">{task.daysLeft}d</Badge>
                        <Badge className="bg-purple-600">{task.team}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{task.current}%</p>
                      <p className="text-xs">→ {task.target}%</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={task.current} className="h-3" />
                  <div>
                    <h4 className="font-bold mb-2">Deliverables:</h4>
                    <ul className="space-y-1">
                      {task.deliverables.map((d, idx) => (
                        <li key={idx} className="text-sm flex items-center gap-2">
                          <span>⬜</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* TAB 4: EXECUTION PLAN */}
          <TabsContent value="execution" className="space-y-6">
            <Card className={`border-2 ${isDark ? 'bg-cyan-900/20 border-cyan-700' : 'bg-cyan-50 border-cyan-400'}`}>
              <CardHeader>
                <CardTitle>📅 Daily Execution Plan (Mar 3-7)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {executionPlan.map((day, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border-2 ${idx === 4 ? isDark ? 'bg-green-900/30 border-green-700' : 'bg-green-100 border-green-500' : isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                    <h3 className="font-bold mb-2">{day.day}</h3>
                    <p className="text-sm font-semibold mb-2">🎯 Focus: {day.focus}</p>
                    <ul className="space-y-1">
                      {day.tasks.map((task, tidx) => (
                        <li key={tidx} className="text-sm">{task}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-red-900/60 to-orange-900/60 border-red-600' : 'bg-gradient-to-r from-red-100 to-orange-100 border-red-600'}`}>
              <CardContent className="pt-8 space-y-4">
                <h3 className="text-2xl font-bold">⚡ Critical Path Requirements</h3>
                <div className={`space-y-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  <p>✅ <strong>Mon-Tue:</strong> Go-to-Market reach 70% (critical for marketing launch)</p>
                  <p>✅ <strong>Wed-Thu:</strong> Certifications + Partnerships reach 80%+ (critical for enterprise sales)</p>
                  <p>✅ <strong>Fri:</strong> All items 75%+ → QA & deploy → 85% achievement</p>
                  <p className="pt-2">❌ <strong>If delayed:</strong> Phase 6 kickoff pushed from Mar 10 to Mar 17 (-1 week) = risk to May 26 launch</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: PHASE 6 */}
          <TabsContent value="phase6" className="space-y-6">
            <Card className={`border-2 ${isDark ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-400'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-purple-600" />
                  🚀 Phase 6: Premium Features (Mar 10 - May 26)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">8 Critical Tasks | 10-week cycle | Full team allocation</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {phase6Tasks.map((task) => (
                    <Card key={task.id} className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold">{task.id}. {task.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{task.weeks} weeks | Starts {task.startDate}</p>
                          </div>
                        </div>
                        <Badge className={task.priority === 'CRITICAL' ? 'bg-red-600' : task.priority === 'HIGH' ? 'bg-orange-600' : 'bg-blue-600'}>
                          {task.priority}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* FINAL SUMMARY */}
        <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border-purple-600' : 'bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-600'}`}>
          <CardContent className="pt-8 space-y-6">
            <h3 className="text-3xl font-bold">📋 Sprint Execution Summary</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold mb-2">✅ O QUE FOI FEITO</h4>
                <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  <li>✓ 4 Phases Complete</li>
                  <li>✓ 25 Tasks Done</li>
                  <li>✓ Design 100%</li>
                  <li>✓ Base infraestrutura</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">⏳ O QUE FALTA</h4>
                <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  <li>• Go-to-Market (45%)</li>
                  <li>• Certs Tracker (50%)</li>
                  <li>• Partnerships (25%)</li>
                  <li>• i18n Pages (40%)</li>
                  <li>• Multi-region (30%)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">📊 MÉTRICAS</h4>
                <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  <li>Sprint 5: 48% → 85%</li>
                  <li>Project: 62.5% → 100%</li>
                  <li>4 days left</li>
                  <li>Phase 6 start: Mar 10</li>
                </ul>
              </div>
            </div>

            <div className={`border-t pt-6 ${isDark ? 'border-purple-700' : 'border-purple-500'}`}>
              <p className="text-xl font-bold mb-3">🎯 AÇÃO IMEDIATA REQUERIDA:</p>
              <p className={`${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                <strong>Dedique 120 horas (Mar 3-7)</strong> para completar 5 tarefas críticas. Se completado, Phase 6 kickoff garantido em Mar 10 com full team. Se atrasado, timeline para Q1 2027 launch fica em risco. <strong>DECISÃO: GO/NO-GO para Mar 10 é HOJE.</strong>
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}