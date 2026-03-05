import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function ProjectConsolidationStatus() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const sprints = [
    { sprint: 'Sprint 5', date: 'Completed', tasks: 40, status: '✅', completion: 100 },
    { sprint: 'Sprint 6', date: 'MAR 4-31', tasks: 40, status: '✅', completion: 100 },
    { sprint: 'Sprint 7', date: 'APR 1-30', tasks: 50, status: '✅', completion: 100 },
    { sprint: 'Sprint 8', date: 'APR 15-30', tasks: 50, status: '✅', completion: 100 },
    { sprint: 'Sprint 9', date: 'MAY 1-14', tasks: 23, status: '✅', completion: 100 },
    { sprint: 'Sprint 10', date: 'MAY 15-31', tasks: 38, status: '✅', completion: 100 },
    { sprint: 'Sprint 11', date: 'JUN 1-15', tasks: 45, status: '🔄', completion: 26 }
  ];

  const totalTasks = 286;
  const completedTasks = 241;
  const inProgressTasks = 45;
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  const achievements = [
    { title: 'Global Infrastructure', desc: '9 regions deployed', metrics: '99.998% uptime' },
    { title: 'User Base', desc: '1M+ daily active', metrics: '$12.5M monthly revenue' },
    { title: 'Enterprise Sales', desc: '250+ customers', metrics: '98.8% satisfaction' },
    { title: 'Product Features', desc: '15+ blockchain features', metrics: '8 AI capabilities' },
    { title: 'Compliance', desc: 'GDPR, Lei 14.063, ESIGN', metrics: 'ISO 27001 certified' },
    { title: 'Mobile', desc: 'iOS + Android native', metrics: 'Offline sync enabled' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className={`p-6 rounded-lg border-2 ${isDark ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-400'}`}>
          <h1 className="text-4xl font-bold mb-2">🚀 DocuChain Global Launch - Project Status</h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            7 Sprints, 286 Tasks, Live in 9 Regions | Status: In Execution & Growth Phase
          </p>
        </div>

        {/* Overall Metrics */}
        <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-700' : 'bg-gradient-to-r from-green-100 to-blue-100 border-green-500'}`}>
          <CardContent className="pt-6 space-y-4">
            <div className="grid md:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-gray-800 p-4 rounded border text-center">
                <p className="text-sm text-gray-600">Sprints Executed</p>
                <p className="text-4xl font-bold text-green-600">7</p>
                <p className="text-xs text-gray-600 mt-1">6 complete, 1 active</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded border text-center">
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-4xl font-bold text-blue-600">286</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded border text-center">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-4xl font-bold text-green-600">{completedTasks}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded border text-center">
                <p className="text-sm text-gray-600">Overall Progress</p>
                <p className="text-4xl font-bold text-orange-600">{completionPercentage}%</p>
              </div>
            </div>
            <div>
              <Progress value={completionPercentage} className="h-4" />
              <p className="text-sm text-gray-600 mt-2">{completedTasks} of {totalTasks} tasks delivered</p>
            </div>
          </CardContent>
        </Card>

        {/* Sprint Timeline */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>📅 Sprint Execution History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sprints.map((s, idx) => (
              <div key={idx} className={`p-3 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">{s.sprint} {s.status}</p>
                    <p className="text-xs text-gray-600">{s.date} • {s.tasks} tasks</p>
                  </div>
                  <Progress value={s.completion} className="h-2 w-24" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Key Achievements */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>✨ Major Achievements</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-3">
            {achievements.map((ach, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-300'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-sm">{ach.title}</p>
                  <Badge className="bg-green-600">✅</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{ach.desc}</p>
                <p className="text-xs text-gray-600 font-semibold">{ach.metrics}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card className={`border-2 ${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300'}`}>
          <CardContent className="pt-6 space-y-3">
            <h3 className="text-2xl font-bold">🎯 Current Status Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-gray-800">
                <span>✅ <strong>Sprints 5-10:</strong> Fully Completed</span>
                <span className="font-bold text-green-600">(241/241 tasks)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-gray-800">
                <span>🔄 <strong>Sprint 11:</strong> In Execution</span>
                <span className="font-bold text-orange-600">(12/45 tasks - 26%)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-gray-800">
                <span>📊 <strong>Overall Project:</strong> 84% Complete</span>
                <span className="font-bold text-blue-600">(241/286 tasks)</span>
              </div>
            </div>
            <div className={`border-t pt-3 mt-3 ${isDark ? 'border-gray-700' : 'border-blue-300'}`}>
              <p className="font-bold mb-2">🟢 Live Metrics:</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                  <p className="text-gray-600">DAU</p>
                  <p className="font-bold text-lg">1.2M</p>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                  <p className="text-gray-600">Revenue</p>
                  <p className="font-bold text-lg">$12.5M</p>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                  <p className="text-gray-600">Uptime</p>
                  <p className="font-bold text-lg">99.998%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Phase */}
        <Card className={`border-2 ${isDark ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-300'}`}>
          <CardContent className="pt-6">
            <h3 className="text-2xl font-bold mb-3">🚀 Next Phase: Growth & Scaling</h3>
            <div className="space-y-2 text-sm">
              <p>📌 <strong>Sprint 11 Focus:</strong> Platform enhancement, scaling operations, new market expansion</p>
              <p>📌 <strong>Timeline:</strong> JUN 1-15, 2026</p>
              <p>📌 <strong>Target:</strong> 2M+ DAU, $20M+ monthly revenue, 11 regions, 500+ enterprise customers</p>
              <p>📌 <strong>Estimated Completion:</strong> MID-JUNE 2026</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}