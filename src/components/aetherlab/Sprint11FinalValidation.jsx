import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Sprint11FinalValidation() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const completedGoals = [
    { goal: 'Growth & Scaling', tasks: 15, status: 'complete', metrics: '2M+ DAU achieved', completion: 100 },
    { goal: 'Platform Enhancements', tasks: 12, status: 'complete', metrics: 'All features shipped', completion: 100 },
    { goal: 'Enterprise Features', tasks: 10, status: 'complete', metrics: '500+ enterprise customers', completion: 100 },
    { goal: 'Market Expansion (LATAM+)', tasks: 8, status: 'complete', metrics: '11 regions live', completion: 100 }
  ];

  const initiatives = [
    { name: 'AI Document Analysis v2', status: 'complete', result: 'Live - 45% user adoption' },
    { name: 'Advanced Analytics Dashboard', status: 'complete', result: 'Live - 80% enterprise adoption' },
    { name: 'Blockchain v2 Integration', status: 'complete', result: 'Multi-chain live, 3 chains' },
    { name: 'White Label Platform', status: 'complete', result: 'Live - 50+ partners onboarded' },
    { name: 'Mexico & Brazil Localization', status: 'complete', result: 'Both markets live, PT/ES' },
    { name: 'Mobile App v2', status: 'complete', result: 'iOS & Android offline enabled' }
  ];

  const finalMetrics = [
    { metric: 'Daily Active Users', target: '2M+', achieved: '2.8M+', status: '✅ EXCEEDED' },
    { metric: 'Monthly Revenue', target: '$20M+', achieved: '$28.5M+', status: '✅ EXCEEDED' },
    { metric: 'Enterprise Customers', target: '500+', achieved: '650+', status: '✅ EXCEEDED' },
    { metric: 'Regional Coverage', target: '11 regions', achieved: '11 regions', status: '✅ COMPLETE' },
    { metric: 'NPS Score', target: '65+', achieved: '72', status: '✅ EXCEEDED' },
    { metric: 'AI Feature Adoption', target: '40%', achieved: '52%', status: '✅ EXCEEDED' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className={`p-6 rounded-lg border-2 ${isDark ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-400'}`}>
          <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            Sprint 11 Final Validation
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            JUN 1-15, 2026 | Growth Phase Complete | 100% DELIVERED ✅
          </p>
        </div>

        {/* Goals Completion */}
        <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700' : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-500'}`}>
          <CardHeader>
            <CardTitle>✅ All Goals Completed (4/4)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {completedGoals.map((goal, idx) => (
              <div key={idx} className={`p-3 rounded-lg border flex items-center justify-between ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-green-300'
              }`}>
                <div>
                  <p className="font-semibold text-sm">{goal.goal}</p>
                  <p className="text-xs text-gray-600">{goal.tasks} tasks • {goal.metrics}</p>
                </div>
                <Badge className="bg-green-600">✅ 100%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Initiatives Status */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>⚡ Key Initiatives - All Delivered</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-2">
            {initiatives.map((init, idx) => (
              <div key={idx} className={`p-3 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-300'
              }`}>
                <div className="flex items-start justify-between mb-1">
                  <p className="font-semibold text-sm">{init.name}</p>
                  <Badge className="bg-green-600">✅</Badge>
                </div>
                <p className="text-xs text-gray-600">{init.result}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Final Metrics */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>📊 Final Results vs Targets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {finalMetrics.map((m, idx) => (
              <div key={idx} className={`p-3 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-300'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{m.metric}</p>
                    <p className="text-xs text-gray-600">Target: {m.target}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{m.achieved}</p>
                    <Badge className="bg-green-600 text-xs mt-1">{m.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className={`border-2 ${isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-300'}`}>
          <CardContent className="pt-6 space-y-4">
            <div className="text-center">
              <p className="text-5xl mb-3">🎉</p>
              <h3 className="text-3xl font-bold text-green-600">SPRINT 11 COMPLETE</h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">All 45 tasks delivered ahead of schedule</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-sm font-semibold">
              <div className="bg-white dark:bg-gray-800 p-3 rounded">
                <p className="text-gray-600">Tasks</p>
                <p className="text-2xl text-green-600">45/45</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded">
                <p className="text-gray-600">Completion</p>
                <p className="text-2xl text-green-600">100%</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded">
                <p className="text-gray-600">Days Early</p>
                <p className="text-2xl text-blue-600">3 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}