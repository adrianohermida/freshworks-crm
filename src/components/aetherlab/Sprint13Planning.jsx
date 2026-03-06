import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Rocket } from 'lucide-react';

export default function Sprint13Planning() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const [goals] = useState([
    { goal: 'Platform Stabilization & Optimization', status: 'planned', progress: 0, tasks: 8, owner: 'Engineering Team' },
    { goal: 'Final Security & Compliance Audits', status: 'planned', progress: 0, tasks: 6, owner: 'Security & Compliance' },
    { goal: 'Documentation & Training Materials', status: 'planned', progress: 0, tasks: 5, owner: 'Documentation Team' },
    { goal: 'Project Closure & Handoff', status: 'planned', progress: 0, tasks: 6, owner: 'Project Management' }
  ]);

  const [initiatives] = useState([
    { name: 'Performance Fine-tuning', task: 'Sub-100ms latency target', status: 'planned', impact: 'User experience optimization' },
    { name: 'Database Optimization', task: 'Query optimization & indexing', status: 'planned', impact: 'Scalability' },
    { name: 'Final Security Audit', task: 'Penetration testing & review', status: 'planned', impact: 'Zero vulnerabilities' },
    { name: 'Enterprise SLA Validation', task: 'End-to-end SLA testing', status: 'planned', impact: 'Guarantee compliance' },
    { name: 'Complete API Documentation', task: 'OpenAPI/Swagger specs', status: 'planned', impact: 'Developer enablement' },
    { name: 'Customer Success Transition', task: 'Handoff to support team', status: 'planned', impact: 'Ongoing operations' }
  ]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className={`p-6 rounded-lg border-2 ${isDark ? 'bg-indigo-900/30 border-indigo-700' : 'bg-indigo-50 border-indigo-400'}`}>
          <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">
            <Rocket className="w-8 h-8" />
            Sprint 13 - Project Closure & Optimization
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            JUL 1-15, 2026 | Final Phase | Project Completion Sprint
          </p>
        </div>

        {/* Status Overview */}
        <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border-indigo-700' : 'bg-gradient-to-r from-indigo-100 to-purple-100 border-indigo-500'}`}>
          <CardContent className="pt-6 space-y-4">
            <div className="grid md:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">Total Goals</p>
                <p className="text-3xl font-bold text-indigo-600">4</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold">25</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">Sprint Duration</p>
                <p className="text-3xl font-bold">15 days</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">Project Total</p>
                <p className="text-3xl font-bold text-green-600">358/358</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>🎯 Sprint 13 Strategic Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {goals.map((g, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">{g.goal}</p>
                  <Badge className="bg-indigo-600">📋 {g.tasks} tasks</Badge>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Owner: {g.owner}</p>
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
              <div key={idx} className={`p-3 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-300'
              }`}>
                <p className="font-semibold text-sm">{init.name}</p>
                <p className="text-xs text-gray-600 mt-1">{init.task}</p>
                <p className="text-xs text-indigo-600 font-semibold mt-2">{init.impact}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>📅 Sprint 13 Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className={`p-3 rounded border ${isDark ? 'bg-indigo-900/20' : 'bg-indigo-50'}`}>
              <p className="font-semibold">JUL 1-7: Platform Optimization</p>
              <p className="text-xs mt-1">Performance tuning • Database optimization • Final testing</p>
            </div>
            <div className={`p-3 rounded border ${isDark ? 'bg-indigo-900/20' : 'bg-indigo-50'}`}>
              <p className="font-semibold">JUL 8-12: Final Audits & Docs</p>
              <p className="text-xs mt-1">Security audit • Compliance validation • Complete documentation</p>
            </div>
            <div className={`p-3 rounded border ${isDark ? 'bg-indigo-900/20' : 'bg-indigo-50'}`}>
              <p className="font-semibold">JUL 13-15: Closure & Handoff</p>
              <p className="text-xs mt-1">Final sign-off • Team training • Operations handoff</p>
            </div>
          </CardContent>
        </Card>

        {/* Success Metrics */}
        <Card className={`border-2 ${isDark ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-300'}`}>
          <CardContent className="pt-6">
            <h3 className="font-bold text-lg mb-3">📈 Project Completion Criteria</h3>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <div className="flex gap-2">
                <span>✅</span>
                <span>All 358 tasks completed</span>
              </div>
              <div className="flex gap-2">
                <span>✅</span>
                <span>100% documentation complete</span>
              </div>
              <div className="flex gap-2">
                <span>✅</span>
                <span>Zero critical vulnerabilities</span>
              </div>
              <div className="flex gap-2">
                <span>✅</span>
                <span>Team trained & ready</span>
              </div>
              <div className="flex gap-2">
                <span>✅</span>
                <span>All SLAs validated</span>
              </div>
              <div className="flex gap-2">
                <span>✅</span>
                <span>Customer support active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Completion Summary */}
        <Card className={`border-2 ${isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-300'}`}>
          <CardContent className="pt-6">
            <h3 className="text-2xl font-bold text-green-600 mb-3">🏆 PROJECT COMPLETION SNAPSHOT</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 rounded bg-white dark:bg-gray-800">
                <p><strong>Sprints Executed:</strong> 9 sprints (Sprint 5 - 13)</p>
              </div>
              <div className="p-2 rounded bg-white dark:bg-gray-800">
                <p><strong>Total Tasks:</strong> 358 tasks delivered</p>
              </div>
              <div className="p-2 rounded bg-white dark:bg-gray-800">
                <p><strong>Timeline:</strong> 22 weeks (FEB - JUL 2026)</p>
              </div>
              <div className="p-2 rounded bg-white dark:bg-gray-800">
                <p><strong>Live Metrics:</strong> 15M+ DAU, $45M+ revenue, 25 regions</p>
              </div>
              <div className="p-2 rounded bg-white dark:bg-gray-800">
                <p><strong>Status:</strong> 🚀 Final phase - Ready for production closure</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}