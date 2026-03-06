import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';

export default function Sprint11Dashboard() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const [goals] = useState([
    { goal: 'Growth & Scaling', status: 'in_progress', progress: 40, tasks: 15, owner: 'Product & Growth' },
    { goal: 'Platform Enhancements', status: 'in_progress', progress: 35, tasks: 12, owner: 'Engineering' },
    { goal: 'Enterprise Features', status: 'in_progress', progress: 30, tasks: 10, owner: 'Enterprise Team' },
    { goal: 'Market Expansion (LATAM+)', status: 'pending', progress: 0, tasks: 8, owner: 'Regional Team' }
  ]);

  const [initiatives] = useState([
    { name: 'AI Document Analysis v2', status: 'in_progress', impact: '25% faster processing' },
    { name: 'Advanced Analytics Dashboard', status: 'in_progress', impact: 'Real-time insights' },
    { name: 'Blockchain v2 Integration', status: 'in_progress', impact: 'Multi-chain support' },
    { name: 'White Label Platform', status: 'pending', impact: 'SaaS partnership model' },
    { name: 'Mexico & Brazil Localization', status: 'pending', impact: '+2 new markets' },
    { name: 'Mobile App v2', status: 'pending', impact: 'Offline capabilities' }
  ]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className={`p-6 rounded-lg border-2 ${isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-400'}`}>
          <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">
            <TrendingUp className="w-8 h-8" />
            Sprint 11 - Growth & Enhancement Phase
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            JUN 1-15, 2026 | Post-Launch Growth (LIVE NOW)
          </p>
        </div>

        {/* Status Overview */}
        <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-700' : 'bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-500'}`}>
          <CardContent className="pt-6 space-y-4">
            <div className="grid md:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">Total Goals</p>
                <p className="text-3xl font-bold text-blue-600">4</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-orange-600">3</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold">45</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">Avg Progress</p>
                <p className="text-3xl font-bold text-purple-600">26%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>🎯 Sprint 11 Strategic Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {goals.map((g, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">{g.goal}</p>
                  <Badge className={g.status === 'in_progress' ? 'bg-orange-600' : 'bg-gray-600'}>
                    {g.status === 'in_progress' ? '🔄 Active' : '⏳ Queued'}
                  </Badge>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{g.tasks} tasks • {g.owner}</p>
                <Progress value={g.progress} className="h-2 mt-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Key Initiatives */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>⚡ Key Initiatives</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-2">
            {initiatives.map((init, idx) => (
              <div key={idx} className={`p-3 rounded-lg border flex items-center justify-between ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-300'
              }`}>
                <div>
                  <p className="font-semibold text-sm">{init.name}</p>
                  <p className="text-xs text-gray-600">{init.impact}</p>
                </div>
                <Badge className={init.status === 'in_progress' ? 'bg-orange-600' : 'bg-gray-600'}>
                  {init.status === 'in_progress' ? '🔄' : '⏳'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>📅 Sprint 11 Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className={`p-3 rounded border ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
              <p className="font-semibold">JUN 1-7: Growth Phase</p>
              <p className="text-xs mt-1">User acquisition campaigns • Feature feedback collection • Scaling ops</p>
            </div>
            <div className={`p-3 rounded border ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
              <p className="font-semibold">JUN 8-15: Enhancement Phase</p>
              <p className="text-xs mt-1">AI v2 rollout • Analytics launch • New market prep • Enterprise features</p>
            </div>
          </CardContent>
        </Card>

        {/* Success Metrics */}
        <Card className={`border-2 ${isDark ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-300'}`}>
          <CardContent className="pt-6">
            <h3 className="font-bold text-lg mb-3">📈 Sprint 11 Success Criteria</h3>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <div className="flex gap-2">
                <span>📊</span>
                <span>2M+ daily active users</span>
              </div>
              <div className="flex gap-2">
                <span>⚡</span>
                <span>AI features adopted by 40%+ users</span>
              </div>
              <div className="flex gap-2">
                <span>💰</span>
                <span>$20M+ monthly revenue run rate</span>
              </div>
              <div className="flex gap-2">
                <span>🌍</span>
                <span>Expand to 11 regions</span>
              </div>
              <div className="flex gap-2">
                <span>🏆</span>
                <span>Enterprise contracts: 500+</span>
              </div>
              <div className="flex gap-2">
                <span>😊</span>
                <span>NPS score: 65+</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}