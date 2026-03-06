import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Zap, TrendingUp, Clock, Users } from 'lucide-react';
import { useI18n } from '@/components/i18nManager';
import { useTenant } from '@/components/TenantContext';

export default function Sprint6ExecutionDashboard() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const { t } = useI18n();
  const { tenantId } = useTenant();
  const [activeDay, setActiveDay] = useState('day1');

  const executionDays = {
    day1: {
      date: 'MAR 4, 2026',
      status: 'IN PROGRESS',
      focus: 'Production Launch - All 3 Regions',
      startTime: '08:00 UTC-3 (BR)',
      expectedEnd: '21:00 UTC+0 (EU)',
      completedTasks: 3,
      totalTasks: 8,
      criticalItems: [
        { item: 'BR Production Deploy', status: 'in_progress', time: '08:00-09:30 UTC-3', owner: 'DevOps BR' },
        { item: 'US Production Deploy', status: 'scheduled', time: '14:00-15:30 UTC-4', owner: 'DevOps US' },
        { item: 'EU Production Deploy', status: 'scheduled', time: '19:00-20:30 UTC+0', owner: 'DevOps EU' },
        { item: 'Support Center 24/7 Activation', status: 'pending', time: 'Post-deploy', owner: 'Support' },
        { item: 'First Customer Onboarding', status: 'pending', time: '08:00 UTC-3', owner: 'Sales' },
        { item: 'Revenue Tracking Activated', status: 'pending', time: '08:00 UTC-3', owner: 'Analytics' },
        { item: 'Incident Response Mobilization', status: 'ready', time: 'On-standby', owner: 'SRE' },
        { item: 'Customer Communications Sent', status: 'pending', time: '24h before', owner: 'Marketing' }
      ],
      metrics: {
        uptime: '99.99%',
        customers: '10+ logged in',
        revenue: 'Tracking...',
        incidents: '0 critical'
      }
    },
    day2: {
      date: 'MAR 5, 2026',
      status: 'SCHEDULED',
      focus: 'Post-Launch Stabilization',
      startTime: '00:00 UTC',
      expectedEnd: '23:59 UTC',
      completedTasks: 0,
      totalTasks: 4,
      criticalItems: [
        { item: 'Monitor all regions for 24h', status: 'pending', time: 'Continuous', owner: 'SRE' },
        { item: 'Customer onboarding acceleration', status: 'pending', time: '08:00 UTC-3', owner: 'Sales' },
        { item: 'First support escalations handled', status: 'pending', time: 'As needed', owner: 'Support' },
        { item: 'Revenue validation report', status: 'pending', time: '18:00 UTC-3', owner: 'Analytics' }
      ],
      metrics: {
        uptime: 'TBD',
        customers: 'TBD',
        revenue: 'TBD',
        incidents: 'TBD'
      }
    },
    day3: {
      date: 'MAR 6, 2026',
      status: 'SCHEDULED',
      focus: 'Onboarding & Initial Revenue',
      startTime: '00:00 UTC',
      expectedEnd: '23:59 UTC',
      completedTasks: 0,
      totalTasks: 4,
      criticalItems: [
        { item: 'Enterprise account activations', status: 'pending', time: '08:00 UTC-3', owner: 'Sales' },
        { item: 'Automated onboarding flows test', status: 'pending', time: '12:00 UTC-3', owner: 'Product' },
        { item: 'Customer success KPI tracking', status: 'pending', time: 'Continuous', owner: 'Success' },
        { item: 'Week 1 checkpoint review', status: 'pending', time: '17:00 UTC-3', owner: 'Leadership' }
      ],
      metrics: {
        uptime: 'TBD',
        customers: 'TBD',
        revenue: 'TBD',
        incidents: 'TBD'
      }
    }
  };

  const dayData = executionDays[activeDay];
  const dayCompletion = Math.round((dayData.completedTasks / dayData.totalTasks) * 100);

  const getStatusColor = (status) => {
    if (status === 'done') return 'text-green-600';
    if (status === 'in_progress') return 'text-blue-600';
    if (status === 'scheduled') return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getStatusIcon = (status) => {
    if (status === 'done') return '✓';
    if (status === 'in_progress') return '⟳';
    if (status === 'scheduled') return '◷';
    return '○';
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border-blue-700' : 'bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-400'}`}>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Zap className="w-10 h-10 text-blue-600" />
              ⚡ Sprint 6 Live Execution
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Real-time tracking | Production Launch Phase | MAR 4-31
            </p>
            <Badge className="bg-blue-600 px-4 py-2">LIVE NOW - Week 1 Critical Path</Badge>
          </div>
        </section>

        {/* OVERALL PROGRESS */}
        <Card className={`${isDark ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400'} border-2`}>
          <CardContent className="pt-6 space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Sprint Progress</p>
                <p className="text-3xl font-bold text-green-600">3/45 (6%)</p>
              </div>
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Est. Completion</p>
                <p className="text-2xl font-bold">MAR 31</p>
              </div>
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Revenue Target (M1)</p>
                <p className="text-2xl font-bold text-green-600">$2M</p>
              </div>
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status</p>
                <Badge className="bg-yellow-600 mt-1">🟡 CRITICAL PHASE</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DAY SELECTOR */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📅 Execution Days (Week 1)</h2>
          <div className="grid md:grid-cols-3 gap-3 mb-6">
            {['day1', 'day2', 'day3'].map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  activeDay === day
                    ? isDark
                      ? 'bg-blue-900/40 border-blue-700'
                      : 'bg-blue-50 border-blue-500'
                    : isDark
                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    : 'bg-white border-gray-200 hover:border-gray-400'
                }`}
              >
                <p className="font-bold">
                  {day === 'day1' ? '🚀 MAR 4' : day === 'day2' ? '📊 MAR 5' : '📈 MAR 6'}
                </p>
                <p className="text-xs mt-1">
                  {day === 'day1' ? 'Production Launch' : day === 'day2' ? 'Stabilization' : 'Onboarding'}
                </p>
                <Badge className="mt-2 text-xs">{executionDays[day].completedTasks}/{executionDays[day].totalTasks}</Badge>
              </button>
            ))}
          </div>
        </section>

        {/* DAY DETAILS */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{dayData.date}</CardTitle>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{dayData.focus}</p>
              </div>
              <Badge className={dayData.status === 'IN PROGRESS' ? 'bg-red-600' : 'bg-yellow-600'}>
                {dayData.status === 'IN PROGRESS' ? '🔴 LIVE' : '⏳ SCHEDULED'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Day Progress</span>
                <span className="font-bold">{dayCompletion}% ({dayData.completedTasks}/{dayData.totalTasks})</span>
              </div>
              <Progress value={dayCompletion} className="h-3" />
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Start Time</p>
                <p className="font-bold">{dayData.startTime}</p>
              </div>
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Expected Completion</p>
                <p className="font-bold">{dayData.expectedEnd}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="font-semibold mb-3">Critical Items:</p>
              <div className="space-y-2">
                {dayData.criticalItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg flex items-start justify-between ${
                      isDark ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                        </span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.time} • {item.owner}
                      </p>
                    </div>
                    <Badge
                      className={
                        item.status === 'done'
                          ? 'bg-green-600'
                          : item.status === 'in_progress'
                          ? 'bg-blue-600'
                          : item.status === 'ready'
                          ? 'bg-purple-600'
                          : 'bg-gray-600'
                      }
                    >
                      {item.status === 'done' ? '✓' : item.status === 'in_progress' ? '⟳' : item.status === 'ready' ? '✓ Ready' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {Object.keys(dayData.metrics).some(k => dayData.metrics[k] !== 'TBD') && (
              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="font-semibold mb-3">Live Metrics:</p>
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(dayData.metrics).map(([key, value]) => (
                    <div key={key} className={`p-2 rounded text-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className="text-xs capitalize text-gray-500">{key}</p>
                      <p className="font-bold text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* WEEK 1 SUMMARY */}
        <Card className={`${isDark ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-400'} border-2`}>
          <CardHeader>
            <CardTitle>📋 Week 1 Execution Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold mb-2">Completed Milestones:</p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Sprint 5 validation complete (100%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>All pre-launch checklists ready (80%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span>Production deployments in progress (MAR 4)</span>
                </div>
              </div>
            </div>
            <div>
              <p className="font-semibold mb-2">Critical Blockers: NONE</p>
              <p className="text-sm">All systems green. Team mobilized. Standing by for launch.</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}