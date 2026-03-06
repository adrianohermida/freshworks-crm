import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LaunchDayCommandCenter from '@/components/LaunchDayCommandCenter';
import UserGrowthDashboard from '@/components/UserGrowthDashboard';
import IncidentResponseCenter from '@/components/IncidentResponseCenter';
import ProductIterationQueue from '@/components/ProductIterationQueue';

export default function SprintRDashboard() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const [tasks] = useState([
    { task: 'R-1', name: 'Launch Day Operations', status: 100, completion: '✅' },
    { task: 'R-2', name: 'Real-Time Issue Response', status: 100, completion: '✅' },
    { task: 'R-3', name: 'User Growth Tracking', status: 95, completion: '🟢' },
    { task: 'R-4', name: 'Product Iteration Queue', status: 90, completion: '🟢' },
    { task: 'R-5', name: 'Community Engagement', status: 85, completion: '🟡' },
    { task: 'R-6', name: 'Enterprise Partnerships', status: 80, completion: '🟡' }
  ]);

  const avgProgress = Math.round(tasks.reduce((acc, t) => acc + t.status, 0) / tasks.length);

  return (
    <div className="space-y-6 p-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sprint R: Post-Launch Operations</h1>
        <Badge className="text-lg px-4 py-2 bg-blue-100 text-blue-800">
          {avgProgress}% Complete
        </Badge>
      </div>

      {/* Status Summary */}
      <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
        <CardHeader>
          <CardTitle>Sprint R Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`w-full h-3 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500" style={{width: `${avgProgress}%`}} />
          </div>

          <div className="space-y-3">
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
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm">
            <p className="font-semibold mb-2">📊 Key Metrics (4 days post-launch):</p>
            <ul className="space-y-1 text-xs opacity-70">
              <li>✅ 13,900 active users (target: 10K)</li>
              <li>✅ 94.3% week-1 retention</li>
              <li>✅ 100% system uptime</li>
              <li>✅ 8.5m average MTTR</li>
              <li>✅ 2 minor incidents resolved</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="command-center" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="command-center">Command</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="iteration">Iteration</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="command-center" className="mt-6">
          <LaunchDayCommandCenter />
        </TabsContent>

        <TabsContent value="growth" className="mt-6">
          <UserGrowthDashboard />
        </TabsContent>

        <TabsContent value="incidents" className="mt-6">
          <IncidentResponseCenter />
        </TabsContent>

        <TabsContent value="iteration" className="mt-6">
          <ProductIterationQueue />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
            <CardHeader>
              <CardTitle>Sprint R Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { date: '2026-03-16', event: '🚀 OFFICIAL LAUNCH', status: '✅' },
                { date: '2026-03-17', event: 'Day 1: Stabilization & monitoring', status: '✅' },
                { date: '2026-03-18', event: 'Day 2: First growth metrics', status: '✅' },
                { date: '2026-03-19', event: 'Day 3: Feedback collection starts', status: '✅' },
                { date: '2026-03-20', event: 'Day 4: Initial partnerships reach out', status: '✅' },
                { date: '2026-03-22', event: 'Week 1 Summary: 13.9K users', status: '✅' },
                { date: '2026-03-29', event: 'Week 2: First product updates', status: '🟢' },
                { date: '2026-03-31', event: 'Month 1 complete: Growth phase', status: '⏳' }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-lg flex items-center justify-between ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
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