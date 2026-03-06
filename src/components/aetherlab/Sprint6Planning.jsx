import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Zap, TrendingUp, Target, Calendar, Rocket } from 'lucide-react';
import { useI18n } from '@/components/i18nManager';
import { useTenant } from '@/components/TenantContext';

export default function Sprint6Planning() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const { t } = useI18n();
  const { tenantId } = useTenant();
  const [selectedWeek, setSelectedWeek] = useState('week1');

  const sprintOverview = {
    name: 'SPRINT 6: Global Expansion & Enterprise Launch',
    duration: '4 Weeks (MAR 4 - MAR 31, 2026)',
    goal: 'Production launch in 3 regions + $5M pipeline validation + Partnership kickoff',
    totalTasks: 45,
    completedTasks: 0,
    completion: 0
  };

  const weeks = {
    week1: {
      title: 'Week 1: Production Launch (MAR 4-10)',
      theme: 'Launch',
      tasks: [
        { id: 1, name: 'Production Deployment BR', status: 'todo', effort: '3d', owner: 'DevOps' },
        { id: 2, name: 'Production Deployment US', status: 'todo', effort: '3d', owner: 'DevOps' },
        { id: 3, name: 'Production Deployment EU', status: 'todo', effort: '3d', owner: 'DevOps' },
        { id: 4, name: 'Customer Support Center Launch', status: 'todo', effort: '2d', owner: 'Support' },
        { id: 5, name: 'Monitoring & Alerting Setup', status: 'todo', effort: '2d', owner: 'DevOps' },
        { id: 6, name: 'Go-live communications', status: 'todo', effort: '1d', owner: 'Marketing' },
        { id: 7, name: 'Incident Response Planning', status: 'todo', effort: '1d', owner: 'SRE' },
        { id: 8, name: 'Health Check Automation', status: 'todo', effort: '2d', owner: 'QA' }
      ],
      completion: 0
    },
    week2: {
      title: 'Week 2: Onboarding Acceleration (MAR 11-17)',
      theme: 'Onboarding',
      tasks: [
        { id: 9, name: 'Enterprise Onboarding Platform', status: 'todo', effort: '4d', owner: 'Product' },
        { id: 10, name: 'Customer Analytics Dashboard', status: 'todo', effort: '3d', owner: 'Analytics' },
        { id: 11, name: 'Automated Setup Workflows', status: 'todo', effort: '3d', owner: 'Backend' },
        { id: 12, name: 'Customer Success Portal', status: 'todo', effort: '3d', owner: 'Frontend' },
        { id: 13, name: 'Training Video Library (i18n)', status: 'todo', effort: '4d', owner: 'Content' },
        { id: 14, name: 'API Documentation Update', status: 'todo', effort: '2d', owner: 'Tech Writing' },
        { id: 15, name: 'Sandbox Environment Setup', status: 'todo', effort: '2d', owner: 'DevOps' },
        { id: 16, name: 'SLA Compliance Dashboard', status: 'todo', effort: '2d', owner: 'Product' }
      ],
      completion: 0
    },
    week3: {
      title: 'Week 3: Partnership Kickoff (MAR 18-24)',
      theme: 'Partnerships',
      tasks: [
        { id: 17, name: 'Microsoft 365 Integration Phase 1', status: 'todo', effort: '5d', owner: 'Integration' },
        { id: 18, name: 'Google Workspace Integration Phase 1', status: 'todo', effort: '5d', owner: 'Integration' },
        { id: 19, name: 'Partner Portal & Documentation', status: 'todo', effort: '3d', owner: 'Frontend' },
        { id: 20, name: 'Joint Go-to-Market Materials', status: 'todo', effort: '3d', owner: 'Marketing' },
        { id: 21, name: 'Partner Revenue Share Dashboard', status: 'todo', effort: '3d', owner: 'Product' },
        { id: 22, name: 'Technical Support Bridge Setup', status: 'todo', effort: '2d', owner: 'Support' },
        { id: 23, name: 'Partnership KPI Tracking', status: 'todo', effort: '2d', owner: 'Analytics' },
        { id: 24, name: 'Deal Registration System', status: 'todo', effort: '2d', owner: 'Backend' }
      ],
      completion: 0
    },
    week4: {
      title: 'Week 4: Expansion Testing & Optimization (MAR 25-31)',
      theme: 'Optimization',
      tasks: [
        { id: 25, name: 'APAC Region Pre-launch Testing', status: 'todo', effort: '4d', owner: 'QA' },
        { id: 26, name: 'UK Region Compliance Validation', status: 'todo', effort: '3d', owner: 'Compliance' },
        { id: 27, name: 'Performance Optimization (All Regions)', status: 'todo', effort: '4d', owner: 'DevOps' },
        { id: 28, name: 'Security Penetration Testing', status: 'todo', effort: '3d', owner: 'Security' },
        { id: 29, name: 'Customer Feedback Collection', status: 'todo', effort: '2d', owner: 'Product' },
        { id: 30, name: 'Revenue Pipeline Analysis', status: 'todo', effort: '2d', owner: 'Sales' },
        { id: 31, name: 'Enterprise Metrics Report', status: 'todo', effort: '2d', owner: 'Analytics' },
        { id: 32, name: 'Phase 7 Planning Kickoff', status: 'todo', effort: '2d', owner: 'Leadership' }
      ],
      completion: 0
    }
  };

  const weekData = weeks[selectedWeek];
  const completedWeek = weekData.tasks.filter(t => t.status === 'done').length;
  const weekCompletion = Math.round((completedWeek / weekData.tasks.length) * 100);

  const keyMetrics = [
    { label: 'Target: Customer Acquisition', value: '50+', subtext: 'Enterprise customers' },
    { label: 'Target: Monthly Revenue', value: '$2M', subtext: 'From Phase 6 launch' },
    { label: 'Target: Uptime SLA', value: '99.99%', subtext: 'All 3 regions' },
    { label: 'Target: Partner Revenue', value: '$500K', subtext: 'Month 1 pipeline' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-purple-700' : 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-400'}`}>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Rocket className="w-10 h-10 text-purple-600" />
              🚀 Sprint 6: Global Expansion
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {sprintOverview.duration} | {sprintOverview.goal}
            </p>
            <Badge className="bg-purple-600 px-4 py-2">{sprintOverview.totalTasks} Tasks | Phase 6 Execution</Badge>
          </div>
        </section>

        {/* SPRINT OVERVIEW */}
        <Card className={`${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-400'} border-2`}>
          <CardContent className="pt-6 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Sprint 6 Progress</span>
                <span className="font-bold text-purple-600">0/45 (0%)</span>
              </div>
              <Progress value={0} className="h-4" />
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              🎯 Starting immediately: Production launch, customer onboarding acceleration, enterprise partnerships, APAC/UK expansion prep.
            </p>
          </CardContent>
        </Card>

        {/* KEY METRICS */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📊 Sprint 6 KPI Targets</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {keyMetrics.map((metric, idx) => (
              <Card key={idx} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="pt-6">
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{metric.label}</p>
                  <p className="text-2xl font-bold mt-2 text-green-600">{metric.value}</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{metric.subtext}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* WEEK SELECTOR */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📅 Weekly Breakdown</h2>
          <div className="grid md:grid-cols-4 gap-3 mb-6">
            {['week1', 'week2', 'week3', 'week4'].map((week) => (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedWeek === week
                    ? isDark
                      ? 'bg-purple-900/40 border-purple-700'
                      : 'bg-purple-50 border-purple-500'
                    : isDark
                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    : 'bg-white border-gray-200 hover:border-gray-400'
                }`}
              >
                <p className="font-bold">{week === 'week1' ? 'Week 1' : week === 'week2' ? 'Week 2' : week === 'week3' ? 'Week 3' : 'Week 4'}</p>
                <p className="text-xs mt-1">{weeks[week].theme}</p>
              </button>
            ))}
          </div>
        </section>

        {/* WEEK DETAILS */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{weekData.title}</span>
              <Badge className="bg-purple-600">{weekCompletion}% Complete</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Week Progress</span>
                <span className="font-bold">{completedWeek}/{weekData.tasks.length}</span>
              </div>
              <Progress value={weekCompletion} className="h-3" />
            </div>

            <div className="space-y-2 mt-4">
              {weekData.tasks.map((task) => (
                <div key={task.id} className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'} flex items-start justify-between`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded border-2 border-gray-400"></div>
                      <span className="font-medium">{task.name}</span>
                    </div>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{task.owner}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">{task.effort}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CRITICAL PATH */}
        <Card className={`${isDark ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-400'} border-2`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-600" />
              🎯 Critical Path (Days 1-3)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span><strong>MAR 4:</strong> BR + US + EU production go-live (simultaneous)</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span><strong>MAR 5:</strong> Customer support center operational 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span><strong>MAR 6:</strong> First customer onboarding + revenue tracked</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span><strong>MAR 10:</strong> Week 1 closure + $500K+ revenue validated</span>
            </div>
          </CardContent>
        </Card>

        {/* RISKS & DEPENDENCIES */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>⚠️ Key Dependencies & Risks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold mb-2">Critical Dependencies:</p>
              <ul className="space-y-1 text-sm">
                <li>✓ Infrastructure: 3 regions operational (Done)</li>
                <li>✓ Compliance: All audits passed (Done)</li>
                <li>⏳ Customer data migration tools (Week 1)</li>
                <li>⏳ Partner API integration (Week 3)</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Risk Mitigation:</p>
              <ul className="space-y-1 text-sm">
                <li>🛡️ 24/7 incident response team ready</li>
                <li>🛡️ Rollback procedures tested & documented</li>
                <li>🛡️ Customer success team pre-trained</li>
              </ul>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}