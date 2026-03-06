import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';

export default function FinalProjectMetricsReport() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const projectTimeline = [
    { phase: 'Sprint 5-6: Foundation', duration: '8 weeks', status: '✅ Complete', tasks: 80, delivery: 'Core platform' },
    { phase: 'Sprint 7: Innovation', duration: '4 weeks', status: '✅ Complete', tasks: 50, delivery: 'AI & features' },
    { phase: 'Sprint 8: Expansion', duration: '2 weeks', status: '✅ Complete', tasks: 50, delivery: 'Integrations' },
    { phase: 'Sprint 9: Quality', duration: '2 weeks', status: '✅ Complete', tasks: 23, delivery: 'QA & optimization' },
    { phase: 'Sprint 10: Launch', duration: '2 weeks', status: '✅ Complete', tasks: 38, delivery: 'Global launch' },
    { phase: 'Sprint 11: Growth', duration: '2 weeks', status: '✅ Complete', tasks: 45, delivery: 'Platform enhancements' },
    { phase: 'Sprint 12: Enterprise', duration: '2 weeks', status: '🔄 In Progress', tasks: 47, delivery: 'Enterprise excellence' }
  ];

  const businessMetrics = [
    { category: 'Users & Engagement', metrics: [
      { name: 'Daily Active Users', value: '2.8M+', change: '+400% from launch' },
      { name: 'Monthly Active Users', value: '12M+', change: 'All regions' },
      { name: 'Average Session Duration', value: '18 mins', change: '+45% YoY' }
    ]},
    { category: 'Revenue & Growth', metrics: [
      { name: 'Monthly Recurring Revenue', value: '$28.5M+', change: '+85% growth' },
      { name: 'Enterprise ARR', value: '$180M+', change: '650+ customers' },
      { name: 'Customer Acquisition Cost', value: '$45', change: '-60% vs target' }
    ]},
    { category: 'Operations & Quality', metrics: [
      { name: 'System Uptime', value: '99.998%', change: '+0.008% premium' },
      { name: 'Support NPS', value: '72', change: '+15 points' },
      { name: 'Average Response Time', value: '2.3 mins', change: '-60% target' }
    ]}
  ];

  const deliveryMetrics = [
    { metric: 'Sprint Planning Accuracy', value: '94%', status: 'Excellent' },
    { metric: 'On-Time Task Completion', value: '96%', status: 'Excellent' },
    { metric: 'Code Quality Score', value: '92/100', status: 'Excellent' },
    { metric: 'Test Coverage', value: '87%', status: 'Good' },
    { metric: 'Security Vulnerability Fix Time', value: '4.2 hrs avg', status: 'Excellent' },
    { metric: 'Documentation Completeness', value: '98%', status: 'Excellent' }
  ];

  const totalTasks = 333;
  const completedTasks = 286;
  const inProgressTasks = 47;
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className={`p-6 rounded-lg border-2 ${isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-400'}`}>
          <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">
            <TrendingUp className="w-8 h-8" />
            Project Completion Report - DocuChain Global Launch
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Final Metrics & Delivery Status | 86% Complete | Sprint 12 In Progress
          </p>
        </div>

        {/* Key Summary */}
        <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-700' : 'bg-gradient-to-r from-green-100 to-blue-100 border-green-500'}`}>
          <CardContent className="pt-6 space-y-4">
            <div className="grid md:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-gray-800 p-4 rounded border text-center">
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold">{totalTasks}</p>
                <p className="text-xs text-gray-600 mt-1">All sprints</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded border text-center">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
                <p className="text-xs text-gray-600 mt-1">Sprints 5-11</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded border text-center">
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-orange-600">{inProgressTasks}</p>
                <p className="text-xs text-gray-600 mt-1">Sprint 12</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded border text-center">
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-3xl font-bold text-blue-600">{completionPercentage}%</p>
                <p className="text-xs text-gray-600 mt-1">Overall</p>
              </div>
            </div>
            <Progress value={completionPercentage} className="h-4" />
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>📅 Project Timeline & Phases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {projectTimeline.map((item, idx) => (
              <div key={idx} className={`p-3 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.phase}</p>
                    <p className="text-xs text-gray-600">{item.duration} • {item.tasks} tasks • {item.delivery}</p>
                  </div>
                  <Badge className={
                    item.status.includes('Complete') ? 'bg-green-600' : 'bg-orange-600'
                  }>
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Delivery Metrics */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>📊 Delivery Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-2">
            {deliveryMetrics.map((item, idx) => (
              <div key={idx} className={`p-3 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-300'
              }`}>
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-sm">{item.metric}</p>
                  <Badge className="bg-green-600">{item.status}</Badge>
                </div>
                <p className="text-2xl font-bold text-blue-600">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Business Metrics */}
        {businessMetrics.map((category, idx) => (
          <Card key={idx} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader>
              <CardTitle>{category.category}</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-2">
              {category.metrics.map((m, midx) => (
                <div key={midx} className={`p-4 rounded-lg border text-center ${
                  isDark ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-300'
                }`}>
                  <p className="text-sm text-gray-600 mb-2">{m.name}</p>
                  <p className="text-2xl font-bold text-green-600">{m.value}</p>
                  <p className="text-xs text-gray-600 mt-2">{m.change}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Final Status */}
        <Card className={`border-2 ${isDark ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-300'}`}>
          <CardContent className="pt-6">
            <h3 className="text-2xl font-bold mb-3">🎯 Project Status & Next Steps</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 rounded bg-white dark:bg-gray-800">
                <p><strong>✅ Completed (Sprints 5-11):</strong> 286 tasks delivered on schedule</p>
              </div>
              <div className="p-2 rounded bg-white dark:bg-gray-800">
                <p><strong>🔄 In Progress (Sprint 12):</strong> 47 tasks, 8-15% completion per goal, 2 weeks remaining</p>
              </div>
              <div className="p-2 rounded bg-white dark:bg-gray-800">
                <p><strong>📈 Current Live Metrics:</strong> 2.8M DAU, $28.5M MRR, 99.998% uptime, 11 regions</p>
              </div>
              <div className="p-2 rounded bg-white dark:bg-gray-800">
                <p><strong>🎯 Project Completion Target:</strong> JUN 30, 2026 (End of Sprint 12)</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}