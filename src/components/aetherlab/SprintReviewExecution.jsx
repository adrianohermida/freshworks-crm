import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Zap, TrendingUp, Target } from 'lucide-react';

export default function SprintReviewExecution() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [activeTab, setActiveTab] = useState('review');

  // SPRINT 5 REVIEW
  const sprint5Completed = [
    { task: 'i18n Manager (5 idiomas + RTL)', completion: 40, status: 'DONE' },
    { task: 'Regional Compliance Matrix', completion: 35, status: 'DONE' },
    { task: 'Global Support Hub (24/7)', completion: 40, status: 'DONE' },
    { task: 'Multi-Region Deployment', completion: 30, status: 'DONE' }
  ];

  const sprint5InProgress = [
    { task: 'Go-to-Market Regional (4 mercados)', completion: 45, status: 'COMPLETE THIS WEEK', priority: 'CRITICAL' },
    { task: 'Certifications Tracker (SOC 2, ISO)', completion: 50, status: 'COMPLETE THIS WEEK', priority: 'HIGH' },
    { task: 'Enterprise Partnerships', completion: 25, status: 'COMPLETE THIS WEEK', priority: 'HIGH' }
  ];

  const designRefactorCompleted = [
    { name: 'MinimalHeader', status: '✅' },
    { name: 'Home Redesign', status: '✅' },
    { name: 'Pricing Page', status: '✅' },
    { name: 'Layout Integration', status: '✅' }
  ];

  const sprint6Tasks = [
    { id: 1, name: 'AI Document Analysis', weeks: 4, priority: 'CRITICAL', status: 'SCHEDULED' },
    { id: 2, name: 'Mobile App (iOS+Android)', weeks: 8, priority: 'CRITICAL', status: 'SCHEDULED' },
    { id: 3, name: 'Zapier + Make Integrations', weeks: 4, priority: 'HIGH', status: 'SCHEDULED' },
    { id: 4, name: 'Advanced Webhooks', weeks: 4, priority: 'MEDIUM', status: 'SCHEDULED' },
    { id: 5, name: 'PDF Reports & Analytics', weeks: 6, priority: 'MEDIUM', status: 'SCHEDULED' },
    { id: 6, name: 'REST API v2', weeks: 5, priority: 'HIGH', status: 'SCHEDULED' },
    { id: 7, name: 'Advanced Analytics + ML', weeks: 6, priority: 'MEDIUM', status: 'SCHEDULED' },
    { id: 8, name: 'Security Audit & Launch', weeks: 6, priority: 'CRITICAL', status: 'SCHEDULED' }
  ];

  const allProjectMetrics = [
    { phase: 'Phase 1 - Stabilization', completion: 100, tasks: '5/5' },
    { phase: 'Phase 2 - Optimization', completion: 100, tasks: '6/6' },
    { phase: 'Phase 3 - Roadmap v3.1', completion: 100, tasks: '5/5' },
    { phase: 'Phase 4 - Growth & Dominance', completion: 100, tasks: '4/4' },
    { phase: 'Phase 5 - Global Expansion (Sprint)', completion: 48, tasks: '7/7 created' },
    { phase: 'Phase 6 - Premium Features (Next)', completion: 0, tasks: '8/8 planned' }
  ];

  const projectCalculations = {
    completedPhases: 4,
    completedTasks: 25,
    inProgressTasks: 7,
    plannedTasks: 8,
    totalTasks: 40,
    completionPercentage: 62.5,
    projectedFinalCompletion: 100
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-700' : 'bg-gradient-to-r from-indigo-100 to-purple-100 border-indigo-400'}`}>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Target className="w-10 h-10" />
              🚀 Sprint Review & Execution
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Sprint 5 Final Review + Sprint 6/Phase 6 Kickoff
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-orange-600">Sprint 5: 48% → Target 85%</Badge>
              <Badge className="bg-blue-600">5 Items to Complete</Badge>
              <Badge className="bg-purple-600">Project: 62.5%</Badge>
            </div>
          </div>
        </section>

        {/* TAB NAVIGATION */}
        <div className="flex gap-4 border-b border-gray-300 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('review')}
            className={`px-6 py-3 font-bold border-b-2 transition ${
              activeTab === 'review'
                ? `border-indigo-600 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`
                : `border-transparent ${isDark ? 'text-gray-400' : 'text-gray-600'}`
            }`}
          >
            📋 Sprint 5 Review
          </button>
          <button
            onClick={() => setActiveTab('execution')}
            className={`px-6 py-3 font-bold border-b-2 transition ${
              activeTab === 'execution'
                ? `border-indigo-600 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`
                : `border-transparent ${isDark ? 'text-gray-400' : 'text-gray-600'}`
            }`}
          >
            ⚡ Execution Plan
          </button>
          <button
            onClick={() => setActiveTab('sprint6')}
            className={`px-6 py-3 font-bold border-b-2 transition ${
              activeTab === 'sprint6'
                ? `border-indigo-600 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`
                : `border-transparent ${isDark ? 'text-gray-400' : 'text-gray-600'}`
            }`}
          >
            🎯 Sprint 6 Kickoff
          </button>
        </div>

        {/* TAB 1: SPRINT 5 REVIEW */}
        {activeTab === 'review' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                ✅ Sprint 5 Completed
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {sprint5Completed.map((task, idx) => (
                  <Card key={idx} className={`border-2 ${isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-400'}`}>
                    <CardContent className="pt-4">
                      <h3 className="font-bold mb-2">{task.task}</h3>
                      <Badge className="bg-green-600 mb-3">DONE</Badge>
                      <Progress value={100} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-orange-600" />
                🔴 Sprint 5 Pending (Due Mar 7)
              </h2>
              <div className="space-y-3">
                {sprint5InProgress.map((task, idx) => (
                  <Card key={idx} className={`border-2 ${isDark ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-400'}`}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold">{task.task}</h3>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{task.status}</p>
                        </div>
                        <Badge className={task.priority === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-600'}>
                          {task.priority}
                        </Badge>
                      </div>
                      <Progress value={task.completion} className="h-2" />
                      <p className="text-xs text-right mt-1 font-semibold">{task.completion}% → 100% (this week)</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">🎨 Design Refactor (Parallel - 100%)</h2>
              <div className="grid md:grid-cols-4 gap-4">
                {designRefactorCompleted.map((item, idx) => (
                  <Card key={idx} className={`border-2 ${isDark ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-400'}`}>
                    <CardContent className="pt-6 text-center">
                      <p className="font-bold text-lg">{item.name}</p>
                      <p className="text-2xl mt-2">{item.status}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: EXECUTION PLAN */}
        {activeTab === 'execution' && (
          <div className="space-y-8">
            <Card className={`border-2 ${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-400'}`}>
              <CardHeader>
                <CardTitle>📅 Sprint 5 Final Week (Mar 3-7)</CardTitle>
              </CardHeader>
              <CardContent className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} border`}>
                    <p className="font-bold mb-2">Monday-Tuesday (Mar 3-4)</p>
                    <ul className="text-sm space-y-1">
                      <li>✅ Go-to-Market finalize</li>
                      <li>✅ Partnerships pipeline</li>
                    </ul>
                  </div>
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} border`}>
                    <p className="font-bold mb-2">Wednesday-Thursday (Mar 5-6)</p>
                    <ul className="text-sm space-y-1">
                      <li>✅ Certifications dashboards</li>
                      <li>✅ Automations setup</li>
                    </ul>
                  </div>
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} border`}>
                    <p className="font-bold mb-2">Friday (Mar 7)</p>
                    <ul className="text-sm space-y-1">
                      <li>✅ Final testing & QA</li>
                      <li>✅ Production deployment</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`border-2 ${isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-400'}`}>
              <CardHeader>
                <CardTitle>🎯 Success Metrics</CardTitle>
              </CardHeader>
              <CardContent className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                <p><strong>✅ Mon:</strong> Go-to-Market page 100% feature complete</p>
                <p><strong>✅ Wed:</strong> Certifications tracker fully automated</p>
                <p><strong>✅ Thu:</strong> Enterprise pipeline dashboard live</p>
                <p><strong>✅ Fri:</strong> All 5 items in production → Sprint 5 = 85%</p>
                <p className="text-lg font-bold mt-4">🚀 Result: Sprint 5 Final: 48% → 85%</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 3: SPRINT 6 KICKOFF */}
        {activeTab === 'sprint6' && (
          <div className="space-y-8">
            <Card className={`border-2 ${isDark ? 'bg-cyan-900/20 border-cyan-700' : 'bg-cyan-50 border-cyan-400'}`}>
              <CardHeader>
                <CardTitle>🚀 Sprint 6 / Phase 6 - Premium Features</CardTitle>
              </CardHeader>
              <CardContent className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                <p><strong>Duration:</strong> Mar 10 - May 26, 2026 (10 weeks)</p>
                <p><strong>Kickoff:</strong> Monday, March 10, 2026</p>
                <p><strong>Teams:</strong> Full capacity - Frontend, Backend, AI/ML, Mobile, DevOps</p>
              </CardContent>
            </Card>

            <section>
              <h2 className="text-2xl font-bold mb-4">📋 8 Critical Tasks</h2>
              <div className="space-y-3">
                {sprint6Tasks.map((task) => (
                  <Card key={task.id} className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold">{task.id}. {task.name}</h3>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{task.weeks} weeks estimated</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={task.priority === 'CRITICAL' ? 'bg-red-600' : task.priority === 'HIGH' ? 'bg-orange-600' : 'bg-blue-600'}>
                            {task.priority}
                          </Badge>
                          <Badge className="bg-purple-600">{task.status}</Badge>
                        </div>
                      </div>
                      <Progress value={0} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-cyan-900/60 to-teal-900/60 border-cyan-600' : 'bg-gradient-to-r from-cyan-100 to-teal-100 border-cyan-600'}`}>
              <CardContent className="pt-8">
                <h3 className="text-2xl font-bold mb-4">📊 Timeline Overview</h3>
                <div className={`grid md:grid-cols-5 gap-3 text-sm ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  <div>
                    <p className="font-bold">W1-2 (Mar 10-24)</p>
                    <p>AI + Mobile Kickoff</p>
                  </div>
                  <div>
                    <p className="font-bold">W3-4 (Mar 24-Apr 7)</p>
                    <p>Beta Release</p>
                  </div>
                  <div>
                    <p className="font-bold">W5-6 (Apr 7-21)</p>
                    <p>API v2 + Integrations</p>
                  </div>
                  <div>
                    <p className="font-bold">W7-8 (Apr 21-May 5)</p>
                    <p>Analytics + Reports</p>
                  </div>
                  <div>
                    <p className="font-bold">W9-10 (May 5-26)</p>
                    <p>Security + Launch</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* PROJECT OVERVIEW - ALWAYS VISIBLE */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            📊 Complete Project Status
          </h2>
          <div className="space-y-4">
            {allProjectMetrics.map((phase, idx) => (
              <Card key={idx} className={`border-2 ${
                phase.completion === 100
                  ? isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-400'
                  : phase.completion > 0
                  ? isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-400'
                  : isDark ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-400'
              }`}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold">{phase.phase}</h3>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{phase.tasks}</p>
                    </div>
                    <span className="text-2xl font-bold">{phase.completion}%</span>
                  </div>
                  <Progress value={phase.completion} className="h-3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FINAL CALCULATION */}
        <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-purple-900/60 to-pink-900/60 border-purple-600' : 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-600'}`}>
          <CardContent className="pt-8 space-y-6">
            <h3 className="text-3xl font-bold">📈 Complete Project Breakdown</h3>
            <div className={`grid md:grid-cols-4 gap-4 text-center ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              <div>
                <p className="text-3xl font-bold text-green-600">{projectCalculations.completedPhases}/6</p>
                <p className="text-sm">Phases Complete</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">{projectCalculations.completedTasks}</p>
                <p className="text-sm">Tasks Done</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-600">{projectCalculations.inProgressTasks}</p>
                <p className="text-sm">In Progress</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">{projectCalculations.completionPercentage}%</p>
                <p className="text-sm">Project Progress</p>
              </div>
            </div>
            <div className="border-t border-current pt-4">
              <p className="text-xl font-bold">
                🎯 Sprint 5 Target: 48% → 85% (by Mar 7) | Phase 6 Start: Mar 10 | Project Completion: 100% (May 26, 2026)
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}