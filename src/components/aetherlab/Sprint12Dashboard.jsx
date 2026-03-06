import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap } from 'lucide-react';

export default function Sprint12Dashboard() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const [goals] = useState([
    { goal: 'Enterprise Excellence', status: 'in_progress', progress: 15, tasks: 12, owner: 'Enterprise Team' },
    { goal: 'Infrastructure & Scale', status: 'in_progress', progress: 10, tasks: 14, owner: 'DevOps & SRE' },
    { goal: 'Product Innovation', status: 'in_progress', progress: 8, tasks: 11, owner: 'Product & Engineering' },
    { goal: 'Market Leadership', status: 'pending', progress: 0, tasks: 10, owner: 'Growth & Marketing' }
  ]);

  const [initiatives] = useState([
    { name: 'Advanced Security Framework v3', status: 'in_progress', impact: 'Zero-trust architecture' },
    { name: 'AI Predictive Analytics', status: 'in_progress', impact: 'ML-powered insights' },
    { name: 'Global SLA Guarantee (99.999%)', status: 'in_progress', impact: 'Enterprise-grade reliability' },
    { name: 'Custom Integration Studio', status: 'pending', impact: 'No-code integration builder' },
    { name: 'Advanced Compliance (SOC2, HIPAA)', status: 'pending', impact: 'Healthcare & Finance ready' },
    { name: 'Global Expansion (20+ regions)', status: 'pending', impact: 'Worldwide presence' }
  ]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className={`p-6 rounded-lg border-2 ${isDark ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 border-purple-400'}`}>
          <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">
            <Zap className="w-8 h-8" />
            Sprint 12 - Enterprise Excellence Phase
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            JUN 16-30, 2026 | Enterprise & Innovation Focus (LIVE NOW)
          </p>
        </div>

        {/* Status Overview */}
        <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-700' : 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-500'}`}>
          <CardContent className="pt-6 space-y-4">
            <div className="grid md:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">Total Goals</p>
                <p className="text-3xl font-bold text-purple-600">4</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-purple-600">3</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold">47</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">Avg Progress</p>
                <p className="text-3xl font-bold text-pink-600">8%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>🎯 Sprint 12 Strategic Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {goals.map((g, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">{g.goal}</p>
                  <Badge className={g.status === 'in_progress' ? 'bg-purple-600' : 'bg-gray-600'}>
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
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-purple-50 border-purple-300'
              }`}>
                <div>
                  <p className="font-semibold text-sm">{init.name}</p>
                  <p className="text-xs text-gray-600">{init.impact}</p>
                </div>
                <Badge className={init.status === 'in_progress' ? 'bg-purple-600' : 'bg-gray-600'}>
                  {init.status === 'in_progress' ? '🔄' : '⏳'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>📅 Sprint 12 Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className={`p-3 rounded border ${isDark ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
              <p className="font-semibold">JUN 16-23: Enterprise Foundation</p>
              <p className="text-xs mt-1">Security framework v3 • Advanced compliance setup • SLA infrastructure</p>
            </div>
            <div className={`p-3 rounded border ${isDark ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
              <p className="font-semibold">JUN 24-30: Innovation & Expansion</p>
              <p className="text-xs mt-1">AI predictive analytics launch • Custom integrations • Market leadership</p>
            </div>
          </CardContent>
        </Card>

        {/* Success Metrics */}
        <Card className={`border-2 ${isDark ? 'bg-pink-900/20 border-pink-700' : 'bg-pink-50 border-pink-300'}`}>
          <CardContent className="pt-6">
            <h3 className="font-bold text-lg mb-3">📈 Sprint 12 Success Criteria</h3>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <div className="flex gap-2">
                <span>🏢</span>
                <span>1000+ enterprise customers</span>
              </div>
              <div className="flex gap-2">
                <span>🔒</span>
                <span>SOC2 + HIPAA certified</span>
              </div>
              <div className="flex gap-2">
                <span>📈</span>
                <span>$40M+ monthly revenue</span>
              </div>
              <div className="flex gap-2">
                <span>🌍</span>
                <span>20+ regions operational</span>
              </div>
              <div className="flex gap-2">
                <span>⚡</span>
                <span>99.999% uptime achieved</span>
              </div>
              <div className="flex gap-2">
                <span>🤖</span>
                <span>AI adoption: 70%+ users</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}