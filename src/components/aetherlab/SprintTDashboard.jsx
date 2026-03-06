import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket } from 'lucide-react';
import EnterpriseRevenueTracker from '@/components/EnterpriseRevenueTracker';
import PlatformScalingDashboard from '@/components/PlatformScalingDashboard';
import SeriesAPreparation from '@/components/SeriesAPreparation';

export default function SprintTDashboard() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const [tasks] = useState([
    { task: 'T-1', name: 'Enterprise Revenue (ARR)', status: 0, completion: '⏳', target: '$500K' },
    { task: 'T-2', name: 'Platform Scaling', status: 0, completion: '⏳', target: '100K users' },
    { task: 'T-3', name: 'Product Maturity', status: 0, completion: '⏳', target: '15 features' },
    { task: 'T-4', name: 'Market Expansion', status: 0, completion: '⏳', target: '3 countries' },
    { task: 'T-5', name: 'Team Growth', status: 0, completion: '⏳', target: '+20 hires' },
    { task: 'T-6', name: 'Series A Ready', status: 0, completion: '⏳', target: 'Series A deck' }
  ]);

  return (
    <div className="space-y-6 p-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Rocket className="w-8 h-8 text-orange-600" />
          Sprint T: Scale & Sustainability
        </h1>
        <Badge className="text-lg px-4 py-2 bg-gray-100 text-gray-800">
          PLANNED - Starts Apr 13
        </Badge>
      </div>

      {/* Overview */}
      <Card className={isDark ? 'bg-gray-900 border-gray-800' : 'bg-gradient-to-r from-orange-50 to-red-50'}>
        <CardHeader>
          <CardTitle>Sprint T Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Scale from 13.9K to 100K+ users, achieve $500K ARR, establish platform stability at enterprise scale, expand to 3 countries, build team to 50 people, and prepare for Series A fundraising.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
            {[
              { label: 'Duration', value: '28 days' },
              { label: 'Start Date', value: 'Apr 13' },
              { label: 'End Date', value: 'May 10' },
              { label: 'Critical Tasks', value: '3' },
              { label: 'Team Size', value: '30 people' },
              { label: 'Budget', value: '$500K+' }
            ].map((stat, idx) => (
              <div key={idx} className={`p-3 rounded-lg text-center text-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <p className={`opacity-70 mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </p>
                <p className="font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Task Overview */}
      <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
        <CardHeader>
          <CardTitle>Sprint T Tasks (Ready for Execution)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.map((task, idx) => (
            <div key={idx} className={`p-3 rounded-lg flex items-center justify-between ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{task.task}: {task.name}</h4>
                <p className={`text-xs opacity-70 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Target: {task.target}
                </p>
              </div>
              <Badge className="bg-gray-100 text-gray-800">{task.completion}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="scaling">Scaling</TabsTrigger>
          <TabsTrigger value="series-a">Series A</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-6">
          <EnterpriseRevenueTracker />
        </TabsContent>

        <TabsContent value="scaling" className="mt-6">
          <PlatformScalingDashboard />
        </TabsContent>

        <TabsContent value="series-a" className="mt-6">
          <SeriesAPreparation />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
            <CardHeader>
              <CardTitle>Sprint T Timeline & Milestones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { date: '2026-04-13', event: '🚀 Sprint T Kickoff', status: 'Planned' },
                { date: '2026-04-15', event: 'Week 1: Revenue $150K projection', status: 'Target' },
                { date: '2026-04-20', event: 'Scale to 50K users', status: 'Target' },
                { date: '2026-04-27', event: 'Week 2: Market expansion (Brazil + 2 others)', status: 'Target' },
                { date: '2026-05-01', event: 'Series A pitch deck finalized', status: 'Target' },
                { date: '2026-05-05', event: 'Scale to 75K users', status: 'Target' },
                { date: '2026-05-10', event: '📊 Sprint T Complete - 100K users + $500K ARR', status: 'Target' }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-lg flex items-center justify-between ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div>
                    <p className="font-semibold text-sm">{item.event}</p>
                    <p className={`text-xs opacity-60 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.date}</p>
                  </div>
                  <Badge className={item.status === 'Planned' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Critical Success Factors */}
      <Card className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-red-50'}`}>
        <CardHeader>
          <CardTitle>Critical Success Factors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>🔴 <span className="font-semibold">Enterprise Sales:</span> Close 9 new contracts = $450K incremental ARR</p>
          <p>🔴 <span className="font-semibold">Platform Reliability:</span> Maintain 99.95% uptime while 7x scaling</p>
          <p>🟠 <span className="font-semibold">Team Scaling:</span> Hire CFO, COO, VP Engineering, 17 engineers/ops</p>
          <p>🟠 <span className="font-semibold">Product Velocity:</span> 15 new features without technical debt</p>
          <p>🟠 <span className="font-semibold">Market Expansion:</span> Launch in Brazil, Argentina, Spain</p>
          <p>🟡 <span className="font-semibold">Series A Prep:</span> Investor ready by May 1 (target: LOI by May 31)</p>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
        <CardHeader>
          <CardTitle>Risk Mitigation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="font-semibold mb-1">📊 Revenue Risk</p>
            <p className="opacity-70">Mitigation: 3-month pipeline = $225K (45% of target). Early sales team bonus structure.</p>
          </div>
          <div>
            <p className="font-semibold mb-1">⚙️ Technical Risk</p>
            <p className="opacity-70">Mitigation: Database sharding, load balancing, chaos testing. Multi-region deployment.</p>
          </div>
          <div>
            <p className="font-semibold mb-1">👥 Team Risk</p>
            <p className="opacity-70">Mitigation: Recruiting started now. Equity incentives. Mentorship from advisors.</p>
          </div>
          <div>
            <p className="font-semibold mb-1">💰 Funding Risk</p>
            <p className="opacity-70">Mitigation: $500K ARR enables 36+ month runway. Target: Close Series A by Q3 2026.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}