import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp } from 'lucide-react';
import CommunityWebinarCenter from '@/components/CommunityWebinarCenter';
import EnterpriseOnboardingTracker from '@/components/EnterpriseOnboardingTracker';
import ProductUpdatesDashboard from '@/components/ProductUpdatesDashboard';

export default function SprintSDashboard() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const [tasks] = useState([
    { task: 'S-1', name: 'Enterprise Onboarding', status: 20, completion: '🟡' },
    { task: 'S-2', name: 'Community Growth', status: 30, completion: '🟡' },
    { task: 'S-3', name: 'Product Updates (Cycle 1)', status: 60, completion: '🟢' },
    { task: 'S-4', name: 'Marketing Campaigns', status: 25, completion: '🟡' },
    { task: 'S-5', name: 'Analytics Dashboard', status: 50, completion: '🟢' },
    { task: 'S-6', name: 'User Feedback Loop', status: 40, completion: '🟡' }
  ]);

  const avgProgress = Math.round(tasks.reduce((acc, t) => acc + t.status, 0) / tasks.length);

  return (
    <div className="space-y-6 p-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-green-600" />
          Sprint S: Growth & Optimization
        </h1>
        <Badge className="text-lg px-4 py-2 bg-blue-100 text-blue-800">
          {avgProgress}% Complete
        </Badge>
      </div>

      {/* Overview Card */}
      <Card className={isDark ? 'bg-gray-900 border-gray-800' : 'bg-gradient-to-r from-blue-50 to-green-50'}>
        <CardHeader>
          <CardTitle>Sprint S Overview (Mar 23 - Apr 12)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Focus: Scale user base from 13.9K to 50K+, onboard 5 enterprise customers, deploy continuous product improvements, and build community engagement.
          </p>

          <div className={`w-full h-3 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500" style={{width: `${avgProgress}%`}} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Days Elapsed', value: '0/21' },
              { label: 'Tasks Completed', value: `${tasks.filter(t => t.status === 100).length}/6` },
              { label: 'Overall Progress', value: `${avgProgress}%` }
            ].map((stat, idx) => (
              <div key={idx} className={`p-3 rounded-lg text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <p className={`text-xs opacity-70 mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </p>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Task Progress */}
      <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
        <CardHeader>
          <CardTitle>Sprint S Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.map((task, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{task.task}</span>
                  <span className="text-sm">{task.name}</span>
                </div>
                <Badge className={task.status >= 50 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {task.completion}
                </Badge>
              </div>
              <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div className="h-full rounded-full bg-blue-600" style={{width: `${task.status}%`}} />
              </div>
              <p className="text-xs opacity-60 mt-1">{task.status}% Complete</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="community" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
          <TabsTrigger value="product">Product</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="community" className="mt-6">
          <CommunityWebinarCenter />
        </TabsContent>

        <TabsContent value="enterprise" className="mt-6">
          <EnterpriseOnboardingTracker />
        </TabsContent>

        <TabsContent value="product" className="mt-6">
          <ProductUpdatesDashboard />
        </TabsContent>

        <TabsContent value="metrics" className="mt-6">
          <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
            <CardHeader>
              <CardTitle>Sprint S Success Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { metric: 'Active Users', target: '50K', current: '13.9K', progress: 28 },
                { metric: 'Enterprise Customers', target: '5', current: '1', progress: 20 },
                { metric: 'Community Members', target: '2K', current: '340', progress: 17 },
                { metric: 'Feature Deployments', target: '8', current: '2', progress: 25 },
                { metric: 'Customer Satisfaction', target: '>4.5⭐', current: '4.6⭐', progress: 102 },
                { metric: 'Retention Rate', target: '>92%', current: '94.3%', progress: 102 }
              ].map((item, idx) => (
                <div key={idx} className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm">{item.metric}</p>
                    <p className="text-xs opacity-70">Current: {item.current}</p>
                  </div>
                  <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div className="h-full rounded-full bg-blue-600" style={{width: `${Math.min(item.progress, 100)}%`}} />
                  </div>
                  <p className={`text-xs opacity-60 mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Target: {item.target}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
            <CardHeader>
              <CardTitle>Sprint S Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { date: '2026-03-23', event: '🚀 Sprint S Kickoff', status: '🟢' },
                { date: '2026-03-22', event: 'First webinar: Getting Started', status: '✅' },
                { date: '2026-03-24', event: 'Cycle 1 updates deploy', status: '⏳' },
                { date: '2026-03-29', event: 'Week 2 review + Cycle 2 planning', status: '⏳' },
                { date: '2026-03-30', event: 'Second webinar + Updates', status: '⏳' },
                { date: '2026-04-05', event: 'Week 3 review', status: '⏳' },
                { date: '2026-04-12', event: 'Sprint S Complete + Sprint T Planning', status: '⏳' }
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

      {/* Key Notes */}
      <Card className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-yellow-50'}`}>
        <CardHeader>
          <CardTitle>Sprint S Critical Paths</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>🔴 <span className="font-semibold">Enterprise Sales:</span> First contract signed. Need 4 more by Apr 12.</p>
          <p>🟡 <span className="font-semibold">Community Webinars:</span> First on Mar 22. Second on Mar 29. Ambassador program on Mar 30.</p>
          <p>🟢 <span className="font-semibold">Product Velocity:</span> Cycle 1 on track. Cycle 2 deployment Mar 30.</p>
          <p>🟢 <span className="font-semibold">User Growth:</span> 13.9K current → 50K target. 2.6K/week growth needed.</p>
        </CardContent>
      </Card>
    </div>
  );
}