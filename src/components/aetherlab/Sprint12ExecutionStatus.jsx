import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

export default function Sprint12ExecutionStatus() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const sprintGoals = [
    { 
      goal: 'Enterprise Excellence Program',
      tasks: 12,
      completed: 2,
      inProgress: 3,
      pending: 7,
      progress: 42,
      owner: 'Enterprise Team',
      description: 'Custom implementations, SLA guarantees, dedicated support'
    },
    { 
      goal: 'Infrastructure Scaling & Reliability',
      tasks: 14,
      completed: 1,
      inProgress: 3,
      pending: 10,
      progress: 29,
      owner: 'DevOps & SRE',
      description: '99.999% uptime, auto-scaling, disaster recovery'
    },
    { 
      goal: 'AI & ML Feature Acceleration',
      tasks: 11,
      completed: 1,
      inProgress: 2,
      pending: 8,
      progress: 27,
      owner: 'Product & Engineering',
      description: 'Predictive analytics, ML models, intelligent automation'
    },
    { 
      goal: 'Global Market Expansion',
      tasks: 10,
      completed: 0,
      inProgress: 0,
      pending: 10,
      progress: 0,
      owner: 'Growth & Marketing',
      description: 'New regions, localization, market partnerships'
    }
  ];

  const keyInitiatives = [
    { name: 'Advanced Security Framework v3', task: 'Zero-trust architecture', status: 'in_progress', progress: 40, owner: 'Security Team' },
    { name: 'AI Predictive Analytics Engine', task: 'ML-powered customer insights', status: 'in_progress', progress: 35, owner: 'ML Team' },
    { name: 'Global SLA Infrastructure', task: '99.999% uptime guarantee', status: 'in_progress', progress: 30, owner: 'SRE' },
    { name: 'Enterprise Custom Integrations', task: 'Salesforce, SAP, Oracle', status: 'in_progress', progress: 25, owner: 'Integration Team' },
    { name: 'SOC2 & HIPAA Certification', task: 'Healthcare & finance compliance', status: 'pending', progress: 0, owner: 'Compliance' },
    { name: '20+ Regional Expansion', task: 'New market launches', status: 'pending', progress: 0, owner: 'Regional Ops' }
  ];

  const totalTasks = sprintGoals.reduce((acc, g) => acc + g.tasks, 0);
  const totalCompleted = sprintGoals.reduce((acc, g) => acc + g.completed, 0);
  const totalInProgress = sprintGoals.reduce((acc, g) => acc + g.inProgress, 0);
  const totalPending = sprintGoals.reduce((acc, g) => acc + g.pending, 0);
  const overallProgress = Math.round(((totalCompleted + totalInProgress * 0.5) / totalTasks) * 100);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className={`p-6 rounded-lg border-2 ${isDark ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 border-purple-400'}`}>
          <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">
            <TrendingUp className="w-8 h-8" />
            Sprint 12 - Current Execution Status
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            JUN 16-30, 2026 | Enterprise Excellence Phase | Week 1-2 Active
          </p>
        </div>

        {/* Overall Sprint Status */}
        <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-700' : 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-500'}`}>
          <CardContent className="pt-6 space-y-4">
            <div className="grid md:grid-cols-5 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold">{totalTasks}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">✅ Completed</p>
                <p className="text-3xl font-bold text-green-600">{totalCompleted}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">🔄 In Progress</p>
                <p className="text-3xl font-bold text-orange-600">{totalInProgress}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">⏳ Pending</p>
                <p className="text-3xl font-bold text-gray-600">{totalPending}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">Progress</p>
                <p className="text-3xl font-bold text-purple-600">{overallProgress}%</p>
              </div>
            </div>
            <div>
              <Progress value={overallProgress} className="h-4" />
            </div>
          </CardContent>
        </Card>

        {/* Goals Status */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>🎯 Sprint 12 Goals - Detailed Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sprintGoals.map((goal, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-sm">{goal.goal}</p>
                    <p className="text-xs text-gray-600 mt-1">{goal.description}</p>
                  </div>
                  <Badge className="bg-purple-600">{goal.progress}%</Badge>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                  <div><span className="text-gray-600">Completed:</span> <span className="font-bold text-green-600">{goal.completed}/{goal.tasks}</span></div>
                  <div><span className="text-gray-600">In Progress:</span> <span className="font-bold text-orange-600">{goal.inProgress}</span></div>
                  <div><span className="text-gray-600">Pending:</span> <span className="font-bold text-gray-600">{goal.pending}</span></div>
                  <div><span className="text-gray-600">Owner:</span> <span className="font-bold">{goal.owner}</span></div>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Key Initiatives Progress */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>⚡ Key Initiatives - Implementation Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {keyInitiatives.map((init, idx) => (
              <div key={idx} className={`p-3 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-purple-50 border-purple-300'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{init.name}</p>
                    <p className="text-xs text-gray-600">{init.task} • Owner: {init.owner}</p>
                  </div>
                  <Badge className={init.status === 'in_progress' ? 'bg-orange-600' : 'bg-gray-600'}>
                    {init.progress}%
                  </Badge>
                </div>
                <Progress value={init.progress} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Timeline & Milestones */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>📅 Sprint 12 Timeline & Upcoming Milestones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className={`p-3 rounded border font-semibold flex items-center gap-2 ${
              isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-300'
            }`}>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>JUN 16-20: Enterprise Framework Setup [COMPLETED]</span>
            </div>
            <div className={`p-3 rounded border font-semibold flex items-center gap-2 ${
              isDark ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-300'
            }`}>
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <span>JUN 21-25: Security & AI Implementation [IN PROGRESS]</span>
            </div>
            <div className={`p-3 rounded border font-semibold flex items-center gap-2 ${
              isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
            }`}>
              <span>⏳</span>
              <span>JUN 26-30: Market Expansion & Final Validation [PENDING]</span>
            </div>
          </CardContent>
        </Card>

        {/* Current Blockers & Risks */}
        <Card className={`border-2 ${isDark ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-300'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Known Blockers & Risks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="text-yellow-600">⚠️</span>
              <span>SOC2 audit coordination - 2-3 days adjustment expected</span>
            </div>
            <div className="flex gap-2">
              <span className="text-yellow-600">⚠️</span>
              <span>Regional compliance review in Brazil - legal review pending</span>
            </div>
            <div className="flex gap-2">
              <span className="text-green-600">✅</span>
              <span>Security framework v3 on track - 40% progress</span>
            </div>
            <div className="flex gap-2">
              <span className="text-green-600">✅</span>
              <span>AI predictive analytics - engineering ahead of schedule</span>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}