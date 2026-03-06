import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Rocket, TrendingUp } from 'lucide-react';

export default function Sprint10Dashboard() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const [goals] = useState([
    { goal: 'Global Production Launch', status: 'in_progress', progress: 50, tasks: 12, owner: 'Ops & DevOps' },
    { goal: 'Customer Success Scaling', status: 'in_progress', progress: 30, tasks: 10, owner: 'Customer Success' },
    { goal: 'Enterprise Sales Enablement', status: 'pending', progress: 0, tasks: 8, owner: 'Sales & Marketing' },
    { goal: 'Post-Launch Monitoring', status: 'pending', progress: 0, tasks: 8, owner: 'SRE & Support' }
  ]);

  const milestones = [
    { phase: 'Phase 1: NA Launch', date: 'MAY 15-20', status: 'in_progress', regions: '🇺🇸 USA, 🇨🇦 Canada' },
    { phase: 'Phase 2: EU Launch', date: 'MAY 21-26', status: 'pending', regions: '🇪🇺 Europe, 🇬🇧 UK' },
    { phase: 'Phase 3: APAC Launch', date: 'MAY 27-30', status: 'pending', regions: '🇯🇵 Japan, 🇮🇳 India' },
    { phase: 'Phase 4: Monitor & Scale', date: 'MAY 31-31', status: 'pending', regions: 'All regions' }
  ];

  const kpis = [
    { metric: 'Daily Active Users', target: '50K+', current: '35K', status: '🟡' },
    { metric: 'Documents Signed', target: '100K/day', current: '65K/day', status: '🟡' },
    { metric: 'System Uptime', target: '99.99%', current: '99.98%', status: '🟡' },
    { metric: 'Customer Satisfaction', target: '95%', current: '94%', status: '🟡' }
  ];

  const inProgress = goals.filter(g => g.status === 'in_progress').length;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className={`p-6 rounded-lg border-2 ${isDark ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-400'}`}>
          <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">
            <Rocket className="w-8 h-8" />
            Sprint 10 - Global Launch & Scaling
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            MAY 15-31, 2026 | Production Launch Phase (LIVE NOW)
          </p>
        </div>

        {/* Status Overview */}
        <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-700' : 'bg-gradient-to-r from-red-100 to-orange-100 border-red-500'}`}>
          <CardContent className="pt-6 space-y-4">
            <div className="grid md:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">Total Goals</p>
                <p className="text-3xl font-bold text-red-600">4</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{inProgress}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold">38</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">Est. Users</p>
                <p className="text-3xl font-bold text-purple-600">1M+</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals Progress */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>🎯 Sprint 10 Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {goals.map((g, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">{g.goal}</p>
                  <Badge className={g.status === 'in_progress' ? 'bg-blue-600' : 'bg-gray-600'}>
                    {g.status === 'in_progress' ? '🔄 Active' : '⏳ Queued'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-600">{g.owner}</span>
                  <span className="text-gray-600">{g.tasks} tasks</span>
                </div>
                <Progress value={g.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Launch Phases */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>🌍 Regional Launch Phases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {milestones.map((m, idx) => (
              <div key={idx} className={`p-3 rounded-lg border flex items-center justify-between ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
              }`}>
                <div>
                  <p className="font-semibold text-sm">{m.phase}</p>
                  <p className="text-xs text-gray-600">{m.regions}</p>
                </div>
                <div className="text-right">
                  <Badge className={
                    m.status === 'in_progress' ? 'bg-blue-600' : 'bg-gray-600'
                  } variant="default">
                    {m.date}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Live KPIs */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Live Production KPIs
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-3">
            {kpis.map((kpi, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-yellow-50 border-yellow-300'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-sm">{kpi.metric}</p>
                  <span className="text-xl">{kpi.status}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Current: <strong>{kpi.current}</strong></p>
                <p className="text-xs text-gray-600">Target: {kpi.target}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>📅 Sprint 10 Timeline (17 Days)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className={`p-3 rounded border ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
              <p className="font-semibold">MAY 15-20: North America Launch</p>
              <p className="text-xs mt-1">Deploy to USA & Canada | Monitor metrics | First wave customers</p>
            </div>
            <div className={`p-3 rounded border ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
              <p className="font-semibold">MAY 21-26: Europe & UK Launch</p>
              <p className="text-xs mt-1">EU deployment | GDPR compliance monitoring | Enterprise onboarding</p>
            </div>
            <div className={`p-3 rounded border ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
              <p className="font-semibold">MAY 27-30: APAC Launch</p>
              <p className="text-xs mt-1">Asia-Pacific deployment | Local compliance verification | Growth scaling</p>
            </div>
            <div className={`p-3 rounded border ${isDark ? 'bg-green-900/20' : 'bg-green-50'}`}>
              <p className="font-semibold">MAY 31: Full Global Operational</p>
              <p className="text-xs mt-1">All regions live | 1M+ users | 24/7 support active | Continuous optimization</p>
            </div>
          </CardContent>
        </Card>

        {/* Success Criteria */}
        <Card className={`border-2 ${isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-300'}`}>
          <CardContent className="pt-6">
            <h3 className="font-bold text-lg mb-3">✅ Sprint 10 Success Criteria</h3>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-lg">📈</span>
                <span>1M+ daily active users by MAY 31</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">🌍</span>
                <span>Launched in 4 regions simultaneously</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">✅</span>
                <span>99.99% uptime maintained</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">💰</span>
                <span>$5M+ revenue generated</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">😊</span>
                <span>95%+ customer satisfaction</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">🚀</span>
                <span>Enterprise deals closed (50+)</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}