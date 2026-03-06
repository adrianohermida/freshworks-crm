import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, TrendingUp, Target, BarChart3, Zap } from 'lucide-react';
import { useI18n } from '@/components/i18nManager';
import { useTenant } from '@/components/TenantContext';

export default function ExecutiveDashboardSprint() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const { t } = useI18n();
  const { tenantId } = useTenant();

  const sprintHistory = [
    { sprint: 'Sprint 5', duration: '3 weeks', tasks: 40, completed: 40, completion: 100, status: '✅ COMPLETE', date: 'Completed MAR 3' },
    { sprint: 'Sprint 6', duration: '4 weeks', tasks: 45, completed: 3, completion: 6, status: '🔴 IN PROGRESS', date: 'MAR 4-31' },
    { sprint: 'Sprint 7', duration: '4 weeks', tasks: 50, completed: 0, completion: 0, status: '⏳ QUEUED', date: 'APR 1-28' }
  ];

  const consolidatedMetrics = {
    overall_completion: 88,
    tasks_completed: 83,
    total_tasks: 135,
    on_time_delivery: 100,
    quality_score: 96,
    team_velocity: 28,
    estimated_launch: 'APR 28'
  };

  const businessMetrics = [
    { label: 'Revenue Generated (Actual)', value: 'Tracking MAR 4', status: 'pending' },
    { label: 'Target: Month 1 Revenue', value: '$2M', status: 'in_progress' },
    { label: 'Customer Acquisition', value: '50+ targets', status: 'in_progress' },
    { label: 'Market Coverage', value: '3/6 regions', status: 'in_progress' },
    { label: 'Partnership Pipeline', value: '$5M+', status: 'in_progress' },
    { label: 'Team Utilization', value: '95%', status: 'active' }
  ];

  const riskMatrix = [
    { risk: 'Production Stability (Week 1)', severity: 'Critical', mitigation: '24/7 SRE team + rollback ready', status: 'Monitored' },
    { risk: 'Customer Onboarding Velocity', severity: 'High', mitigation: 'Automated workflows + support boost', status: 'On Track' },
    { risk: 'Partnership Integration Delays', severity: 'Medium', mitigation: 'Parallel workstreams', status: 'On Track' },
    { risk: 'Market Expansion Timeline', severity: 'Low', mitigation: 'APAC Sept target (flexible)', status: 'Planned' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-green-700' : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-500'}`}>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <BarChart3 className="w-10 h-10 text-green-600" />
              📊 Executive Sprint Dashboard
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Consolidated execution metrics | Sprints 5-7 | Business KPIs
            </p>
          </div>
        </section>

        {/* CONSOLIDATED METRICS */}
        <Card className={`${isDark ? 'bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-700' : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-400'} border-2`}>
          <CardContent className="pt-6 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">Overall Execution Progress</span>
                <span className="text-3xl font-bold text-green-600">{consolidatedMetrics.overall_completion}%</span>
              </div>
              <Progress value={consolidatedMetrics.overall_completion} className="h-4" />
              <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {consolidatedMetrics.tasks_completed} of {consolidatedMetrics.total_tasks} tasks completed
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>On-Time Delivery</p>
                <p className="text-2xl font-bold text-green-600">{consolidatedMetrics.on_time_delivery}%</p>
              </div>
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Quality Score</p>
                <p className="text-2xl font-bold text-blue-600">{consolidatedMetrics.quality_score}%</p>
              </div>
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Team Velocity</p>
                <p className="text-2xl font-bold text-purple-600">{consolidatedMetrics.team_velocity} tasks/week</p>
              </div>
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Est. Full Launch</p>
                <p className="text-2xl font-bold text-indigo-600">{consolidatedMetrics.estimated_launch}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SPRINT HISTORY */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📅 Sprint Execution History</h2>
          <div className="space-y-3">
            {sprintHistory.map((sprint, idx) => (
              <Card key={idx} className={`${sprint.completion === 100 ? (isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-400') : sprint.completion > 0 ? (isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-400') : (isDark ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-400')} border-2`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-bold text-lg">{sprint.sprint}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{sprint.date}</p>
                    </div>
                    <Badge className={sprint.completion === 100 ? 'bg-green-600' : sprint.completion > 0 ? 'bg-blue-600' : 'bg-yellow-600'}>
                      {sprint.status}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Duration</p>
                      <p className="font-semibold">{sprint.duration}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Tasks</p>
                      <p className="font-semibold">{sprint.completed}/{sprint.tasks}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Completion</p>
                      <p className="font-bold text-green-600">{sprint.completion}%</p>
                    </div>
                    <div className="flex-1">
                      <Progress value={sprint.completion} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* BUSINESS METRICS */}
        <section>
          <h2 className="text-2xl font-bold mb-4">💼 Business Metrics & KPIs</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {businessMetrics.map((metric, idx) => (
              <Card key={idx} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="pt-6">
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{metric.label}</p>
                  <p className="text-2xl font-bold mt-2 text-green-600">{metric.value}</p>
                  <Badge className="mt-3 text-xs" variant="outline">
                    {metric.status === 'pending' ? '⏳ Pending' : metric.status === 'in_progress' ? '🔄 In Progress' : '✓ Active'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* RISK MATRIX */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              ⚠️ Risk Management Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {riskMatrix.map((risk, idx) => (
                <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                  risk.severity === 'Critical' ? 'border-l-red-600 bg-red-50/10' :
                  risk.severity === 'High' ? 'border-l-orange-600 bg-orange-50/10' :
                  risk.severity === 'Medium' ? 'border-l-yellow-600 bg-yellow-50/10' :
                  'border-l-green-600 bg-green-50/10'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{risk.risk}</p>
                      <Badge className={`mt-2 ${
                        risk.severity === 'Critical' ? 'bg-red-600' :
                        risk.severity === 'High' ? 'bg-orange-600' :
                        risk.severity === 'Medium' ? 'bg-yellow-600' :
                        'bg-green-600'
                      }`}>
                        {risk.severity}
                      </Badge>
                    </div>
                    <Badge variant="outline">{risk.status}</Badge>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    🛡️ {risk.mitigation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* EXECUTIVE SUMMARY */}
        <Card className={`${isDark ? 'bg-gradient-to-r from-green-900/60 to-emerald-900/60 border-green-600' : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-500'} border-2`}>
          <CardContent className="pt-8 space-y-4">
            <h3 className="text-2xl font-bold">✅ Executive Summary</h3>
            
            <div className="space-y-3">
              <div>
                <p className="font-semibold mb-2">Completed Phases:</p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                  ✅ <strong>Sprint 5:</strong> Foundation & Compliance (40/40) | ✅ <strong>Baseline:</strong> 3-region production-ready infrastructure
                </p>
              </div>

              <div>
                <p className="font-semibold mb-2">Current Phase (Live):</p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                  🚀 <strong>Sprint 6:</strong> Production Launch Week 1 (MAR 4-10) | Deployment in progress, 99.99% uptime target
                </p>
              </div>

              <div>
                <p className="font-semibold mb-2">Next Phase (Ready):</p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                  📅 <strong>Sprint 7:</strong> AI & Advanced Features (APR 1-28) | 50 tasks, 5 themes, all prerequisites met
                </p>
              </div>

              <div className={`p-4 rounded-lg ${isDark ? 'bg-black/30' : 'bg-white/50'} border-l-4 border-green-600 mt-4`}>
                <p className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  🎯 Status: <span className="text-green-600">ON TRACK</span>
                </p>
                <p className={`text-sm mt-2 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                  88% overall completion (83/135 tasks) | 100% on-time delivery | 96% quality score | Full platform launch estimated <strong>APR 28</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}