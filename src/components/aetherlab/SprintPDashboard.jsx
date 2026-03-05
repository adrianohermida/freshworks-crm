import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PerformanceOptimizer from '@/components/PerformanceOptimizer';
import SecurityHardening from '@/components/SecurityHardening';
import LaunchChecklist from '@/components/LaunchChecklist';
import MonitoringDashboard from '@/components/MonitoringDashboard';

export default function SprintPDashboard() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const [tasks] = useState([
    { task: 'P-1', name: 'Performance Optimization', status: 100, completion: '✅' },
    { task: 'P-2', name: 'Security Hardening', status: 100, completion: '✅' },
    { task: 'P-3', name: 'User Onboarding Flow', status: 90, completion: '🟢' },
    { task: 'P-4', name: 'Support & Documentation', status: 95, completion: '🟡' },
    { task: 'P-5', name: 'Launch Checklist', status: 96, completion: '🟡' },
    { task: 'P-6', name: 'Monitoring & Analytics', status: 100, completion: '✅' }
  ]);

  const avgProgress = Math.round(tasks.reduce((acc, t) => acc + t.status, 0) / tasks.length);

  return (
    <div className="space-y-6 p-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sprint P Final Push</h1>
        <Badge className="text-lg px-4 py-2 bg-blue-100 text-blue-800">
          {avgProgress}% Complete
        </Badge>
      </div>

      {/* Overall Progress */}
      <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
        <CardHeader>
          <CardTitle>Sprint P Progress Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`w-full h-3 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500" style={{width: `${avgProgress}%`}} />
          </div>
          <p className={`text-xs opacity-70 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {avgProgress}% Overall Completion • Target: 100% by 2026-03-11
          </p>

          <div className="space-y-3 mt-4">
            {tasks.map((task, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{task.task}</span>
                    <span className="text-sm">{task.name}</span>
                  </div>
                  <Badge className={task.status === 100 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                    {task.completion}
                  </Badge>
                </div>
                <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className="h-full rounded-full bg-blue-600" style={{width: `${task.status}%`}} />
                </div>
                <p className="text-xs opacity-60 mt-1">{task.status}% Complete</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Tabs */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-6">
          <PerformanceOptimizer />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SecurityHardening />
        </TabsContent>

        <TabsContent value="onboarding" className="mt-6">
          <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
            <CardHeader>
              <CardTitle>User Onboarding Flow (P-3)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Interactive 6-step onboarding guide implemented with progress tracking, video tutorials, and contextual help.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {['Welcome', 'Setup', 'Profile', 'First Doc', 'Sign', 'Success'].map((step, idx) => (
                  <div key={idx} className={`p-3 rounded-lg text-center font-semibold text-sm ${isDark ? 'bg-gray-800' : 'bg-blue-50'}`}>
                    {step}
                  </div>
                ))}
              </div>
              <p className={`text-xs opacity-70 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Status: 90% Complete • Pending: Video production for steps 2-4
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checklist" className="mt-6">
          <LaunchChecklist />
        </TabsContent>

        <TabsContent value="monitoring" className="mt-6">
          <MonitoringDashboard />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
            <CardHeader>
              <CardTitle>Sprint P Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { date: '2026-03-04', event: 'Sprint P Kickoff', status: '✅' },
                { date: '2026-03-05', event: 'Performance & Security tasks done', status: '✅' },
                { date: '2026-03-07', event: 'Onboarding & Support completion', status: '🟡' },
                { date: '2026-03-09', event: 'Launch checklist final review', status: '🟡' },
                { date: '2026-03-11', event: 'Production deployment ready', status: '⏳' },
                { date: '2026-03-12', event: 'Official launch & celebration 🎉', status: '⏳' }
              ].map((item, idx) => (
                <div key={idx} className={`p-3 rounded-lg flex items-center justify-between ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div>
                    <p className="font-semibold text-sm">{item.event}</p>
                    <p className={`text-xs opacity-60 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.date}</p>
                  </div>
                  <span className="text-lg">{item.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}