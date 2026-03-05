import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, AlertCircle, Clock, Zap, TrendingUp } from 'lucide-react';

export default function SprintExecutorDashboard() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // SPRINT 5 - FINAL PUSH EXECUTION
  const sprint5Status = {
    overallCompletion: 48,
    targetCompletion: 85,
    daysLeft: 4,
    completedPhases: 4,
    inProgressTasks: 7,
    plannedPhase: 6
  };

  const completedInSprint5 = [
    { name: 'i18n Manager (5 idiomas)', percentage: 100, status: '✅ DONE' },
    { name: 'Regional Compliance Matrix', percentage: 100, status: '✅ DONE' },
    { name: 'Global Support Hub 24/7', percentage: 100, status: '✅ DONE' },
    { name: 'Multi-Region Deployment Setup', percentage: 100, status: '✅ DONE' },
    { name: 'Design Refactor (Minimalist UI)', percentage: 100, status: '✅ DONE' }
  ];

  const inProgressTasks = [
    {
      id: 1,
      name: 'Go-to-Market Regional (4 mercados)',
      current: 45,
      target: 100,
      priority: 'CRITICAL',
      daysLeft: 4,
      subtasks: [
        { task: 'Brasil market page', done: false },
        { task: 'Europe market page', done: false },
        { task: 'USA market page', done: false },
        { task: 'LATAM consolidated page', done: false }
      ]
    },
    {
      id: 2,
      name: 'Certifications Tracker (automations)',
      current: 50,
      target: 100,
      priority: 'HIGH',
      daysLeft: 5,
      subtasks: [
        { task: 'SOC 2 Type II setup', done: false },
        { task: 'ISO 27001 tracking', done: false },
        { task: 'GDPR compliance', done: false },
        { task: 'Email automations', done: false }
      ]
    },
    {
      id: 3,
      name: 'Enterprise Partnerships (pipeline)',
      current: 25,
      target: 100,
      priority: 'HIGH',
      daysLeft: 7,
      subtasks: [
        { task: 'Partnership dashboard', done: false },
        { task: 'Lead scoring', done: false },
        { task: 'Integration checklist', done: false }
      ]
    },
    {
      id: 4,
      name: 'i18n Integration (all pages)',
      current: 40,
      target: 100,
      priority: 'MEDIUM',
      daysLeft: 10,
      subtasks: [
        { task: 'Home page translations', done: false },
        { task: 'Pricing page i18n', done: false },
        { task: 'Dashboard (5 langs)', done: false },
        { task: 'RTL layout fixes', done: false }
      ]
    },
    {
      id: 5,
      name: 'Multi-region AWS setup',
      current: 30,
      target: 100,
      priority: 'MEDIUM',
      daysLeft: 14,
      subtasks: [
        { task: 'US-East infrastructure', done: false },
        { task: 'EU-West infrastructure', done: false },
        { task: 'BR-South infrastructure', done: false },
        { task: 'CDN + Load balancer', done: false }
      ]
    }
  ];

  const plannedPhase6 = [
    { id: 1, name: 'AI Document Analysis', weeks: 4, status: 'SCHEDULED', priority: 'CRITICAL' },
    { id: 2, name: 'Mobile App (iOS+Android)', weeks: 8, status: 'SCHEDULED', priority: 'CRITICAL' },
    { id: 3, name: 'Zapier + Make Integrations', weeks: 4, status: 'SCHEDULED', priority: 'HIGH' },
    { id: 4, name: 'Advanced Webhooks', weeks: 4, status: 'SCHEDULED', priority: 'MEDIUM' },
    { id: 5, name: 'PDF Reports & Analytics', weeks: 6, status: 'SCHEDULED', priority: 'MEDIUM' },
    { id: 6, name: 'REST API v2', weeks: 5, status: 'SCHEDULED', priority: 'HIGH' },
    { id: 7, name: 'ML Forecasting', weeks: 6, status: 'SCHEDULED', priority: 'MEDIUM' },
    { id: 8, name: 'Security Audit + Launch', weeks: 6, status: 'SCHEDULED', priority: 'CRITICAL' }
  ];

  // CALCULATE OVERALL PROJECT STATUS
  const projectMetrics = {
    totalPhases: 6,
    completedPhases: 4,
    inProgressPhase: 1,
    scheduledPhases: 1,
    totalTasks: 40,
    completedTasks: 25,
    inProgressTasks: 7,
    scheduledTasks: 8,
    currentProgress: 62.5,
    sprint5Progress: 48,
    sprint5Target: 85,
    targetFinalCompletion: 100
  };

  const dailyFocus = {
    monday: 'Go-to-Market Regional (Brasil + Europe focus)',
    tuesday: 'Go-to-Market USA | Certs SOC 2 start',
    wednesday: 'Certs ISO 27001 | i18n Home+Pricing',
    thursday: 'Enterprise Partnerships dashboard | Dashboard i18n',
    friday: 'QA all items | Production deployment'
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* EXECUTIVE SUMMARY */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-cyan-700' : 'bg-gradient-to-r from-cyan-100 to-blue-100 border-cyan-400'}`}>
          <div className="grid md:grid-cols-5 gap-6">
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Sprint 5 Progress</p>
              <p className="text-3xl font-bold text-orange-600">{projectMetrics.sprint5Progress}%</p>
              <p className="text-xs mt-1">Target: {projectMetrics.sprint5Target}%</p>
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Project Completion</p>
              <p className="text-3xl font-bold text-blue-600">{projectMetrics.currentProgress.toFixed(1)}%</p>
              <p className="text-xs mt-1">{projectMetrics.completedTasks}/{projectMetrics.totalTasks} tasks</p>
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Phases Status</p>
              <p className="text-3xl font-bold text-green-600">{projectMetrics.completedPhases}/{projectMetrics.totalPhases}</p>
              <p className="text-xs mt-1">Phases complete</p>
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Days to Deadline</p>
              <p className="text-3xl font-bold text-red-600">{sprint5Status.daysLeft}</p>
              <p className="text-xs mt-1">Until Mar 7</p>
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Phase 6 Start</p>
              <p className="text-3xl font-bold text-purple-600">Mar 10</p>
              <p className="text-xs mt-1">10-week cycle</p>
            </div>
          </div>
        </section>

        {/* MAIN TABS */}
        <Tabs defaultValue="sprint5" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="sprint5">Sprint 5 (Current)</TabsTrigger>
            <TabsTrigger value="completed">✅ Completed (25)</TabsTrigger>
            <TabsTrigger value="inprogress">⏳ In Progress (7)</TabsTrigger>
            <TabsTrigger value="phase6">Phase 6 (Planned)</TabsTrigger>
          </TabsList>

          {/* TAB 1: SPRINT 5 CURRENT STATUS */}
          <TabsContent value="sprint5" className="space-y-6">
            <Card className={`border-2 ${isDark ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-400'}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>🚨 SPRINT 5 FINAL EXECUTION (Mar 3-7)</span>
                  <Badge className="bg-red-600 animate-pulse">CRITICAL</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Overall Sprint 5 Progress</span>
                    <span className="font-bold text-lg">{projectMetrics.sprint5Progress}% → {projectMetrics.sprint5Target}%</span>
                  </div>
                  <Progress value={projectMetrics.sprint5Progress} className="h-4" />
                  <p className="text-xs mt-2">Need +{projectMetrics.sprint5Target - projectMetrics.sprint5Progress}% in 4 days</p>
                </div>

                <div>
                  <h3 className="font-bold mb-3">📅 Daily Focus Schedule</h3>
                  <div className="grid md:grid-cols-5 gap-3">
                    <div className={`p-3 rounded border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                      <p className="font-bold text-sm">Mon (3)</p>
                      <p className="text-xs">{dailyFocus.monday}</p>
                    </div>
                    <div className={`p-3 rounded border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                      <p className="font-bold text-sm">Tue (4)</p>
                      <p className="text-xs">{dailyFocus.tuesday}</p>
                    </div>
                    <div className={`p-3 rounded border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                      <p className="font-bold text-sm">Wed (5)</p>
                      <p className="text-xs">{dailyFocus.wednesday}</p>
                    </div>
                    <div className={`p-3 rounded border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                      <p className="font-bold text-sm">Thu (6)</p>
                      <p className="text-xs">{dailyFocus.thursday}</p>
                    </div>
                    <div className={`p-3 rounded border-2 border-green-600 ${isDark ? 'bg-green-900/30' : 'bg-green-50'}`}>
                      <p className="font-bold text-sm">Fri (7)</p>
                      <p className="text-xs font-bold">{dailyFocus.friday}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5 Critical Items to Complete</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {inProgressTasks.map((task) => (
                  <div key={task.id} className={`p-4 rounded-lg border-2 ${isDark ? 'bg-gray-900 border-gray-800' : 'border-gray-200'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold">{task.name}</h3>
                        <Badge className={task.priority === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-600'} style={{marginTop: '4px'}}>
                          {task.priority} • {task.daysLeft} days
                        </Badge>
                      </div>
                      <span className="text-2xl font-bold text-orange-600">{task.current}%</span>
                    </div>
                    <Progress value={task.current} className="mb-3" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: COMPLETED ITEMS */}
          <TabsContent value="completed" className="space-y-4">
            <Card className={`border-2 ${isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-400'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ✅ 25 Completed Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {completedInSprint5.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-opacity-50 hover:bg-opacity-70 transition">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-semibold">{item.name}</span>
                    </div>
                    <Badge className="bg-green-600">{item.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: IN PROGRESS */}
          <TabsContent value="inprogress" className="space-y-4">
            {inProgressTasks.map((task) => (
              <Card key={task.id} className={`border-2 ${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-400'}`}>
                <CardHeader>
                  <CardTitle className="text-lg">{task.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Progress</span>
                      <span className="font-bold">{task.current}% → {task.target}%</span>
                    </div>
                    <Progress value={task.current} className="h-3" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Subtasks:</h4>
                    <ul className="space-y-1">
                      {task.subtasks.map((st, idx) => (
                        <li key={idx} className="text-sm flex items-center gap-2">
                          <span className="text-lg">{st.done ? '✅' : '⬜'}</span>
                          {st.task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* TAB 4: PHASE 6 */}
          <TabsContent value="phase6" className="space-y-4">
            <Card className={`border-2 ${isDark ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-400'}`}>
              <CardHeader>
                <CardTitle>🚀 Phase 6 - Premium Features (Mar 10 - May 26)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-4 gap-3">
                  {plannedPhase6.map((task) => (
                    <Card key={task.id} className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
                      <CardContent className="pt-4">
                        <p className="font-bold text-sm">{task.id}. {task.name}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge className={task.priority === 'CRITICAL' ? 'bg-red-600' : task.priority === 'HIGH' ? 'bg-orange-600' : 'bg-blue-600'} style={{fontSize: '10px'}}>
                            {task.priority}
                          </Badge>
                          <Badge className="bg-gray-600" style={{fontSize: '10px'}}>{task.weeks}w</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* PROJECT COMPLETION ROADMAP */}
        <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-green-900/60 to-emerald-900/60 border-green-600' : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-600'}`}>
          <CardContent className="pt-8 space-y-6">
            <h3 className="text-3xl font-bold">📊 Complete Project Roadmap</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600">{projectMetrics.completedTasks}</p>
                <p className="font-bold">Tasks Completed</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">{projectMetrics.inProgressTasks}</p>
                <p className="font-bold">In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-600">{projectMetrics.scheduledTasks}</p>
                <p className="font-bold">Scheduled (Phase 6)</p>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-bold text-lg">Total Project Completion</span>
                <span className="text-2xl font-bold">{projectMetrics.currentProgress.toFixed(1)}% → 100%</span>
              </div>
              <Progress value={projectMetrics.currentProgress} className="h-4" />
            </div>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white/50'}`}>
              <p className="font-bold mb-2">🎯 Key Milestones:</p>
              <ul className="text-sm space-y-1">
                <li>✅ Mar 7: Sprint 5 Final (85%) + Phase 5 Completion</li>
                <li>🚀 Mar 10: Phase 6 Kickoff (AI + Mobile)</li>
                <li>🔜 May 26: Phase 6 Complete + Full Launch</li>
                <li>🌍 Q1 2027: Global market dominance</li>
              </ul>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}