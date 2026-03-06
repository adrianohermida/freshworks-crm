import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Zap, Brain } from 'lucide-react';

export default function Phase6Execution() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [selectedWeek, setSelectedWeek] = useState('w1');

  const weeklyPlan = {
    w1: {
      week: 'Week 1-2 (Mar 10-24)',
      focus: 'AI Kickoff + Mobile Architecture',
      tasks: [
        { name: 'AI Module Design Document', status: 'IN PROGRESS', completion: 30 },
        { name: 'Mobile App Architecture', status: 'PLANNED', completion: 0 },
        { name: 'LLM Integration Setup (OpenAI/Claude)', status: 'PLANNED', completion: 0 },
        { name: 'Zapier API Endpoint', status: 'PLANNED', completion: 0 }
      ]
    },
    w2: {
      week: 'Week 3-4 (Mar 24 - Apr 7)',
      focus: 'AI Beta + Mobile Alpha',
      tasks: [
        { name: 'AI Document Classifier (Beta)', status: 'PLANNED', completion: 0 },
        { name: 'Mobile iOS Build (Alpha)', status: 'PLANNED', completion: 0 },
        { name: 'Auto-fill Fields with LLM', status: 'PLANNED', completion: 0 },
        { name: 'Zapier App Submission', status: 'PLANNED', completion: 0 }
      ]
    },
    w3: {
      week: 'Week 5-6 (Apr 7-21)',
      focus: 'Integrations + API',
      tasks: [
        { name: 'REST API v2 Documentation', status: 'PLANNED', completion: 0 },
        { name: 'Make.com Connector', status: 'PLANNED', completion: 0 },
        { name: 'Advanced Webhooks System', status: 'PLANNED', completion: 0 },
        { name: 'SDK Node.js + Python', status: 'PLANNED', completion: 0 }
      ]
    },
    w4: {
      week: 'Week 7-8 (Apr 21 - May 5)',
      focus: 'Analytics + Reports',
      tasks: [
        { name: 'Advanced Analytics Dashboard', status: 'PLANNED', completion: 0 },
        { name: 'PDF Report Generator', status: 'PLANNED', completion: 0 },
        { name: 'ML Forecasting Model', status: 'PLANNED', completion: 0 },
        { name: 'Scheduled Reports (Email)', status: 'PLANNED', completion: 0 }
      ]
    },
    w5: {
      week: 'Week 9-10 (May 5-26)',
      focus: 'Security + Launch',
      tasks: [
        { name: 'Security Penetration Testing', status: 'PLANNED', completion: 0 },
        { name: 'Final Compliance Audit', status: 'PLANNED', completion: 0 },
        { name: 'Production Deployment', status: 'PLANNED', completion: 0 },
        { name: 'Go-Live Communication', status: 'PLANNED', completion: 0 }
      ]
    }
  };

  const selectedWeekData = weeklyPlan[selectedWeek];

  const sprint5Pending = [
    { task: 'Go-to-Market Regional pages - Final polish', status: 'PENDING', daysLeft: 3 },
    { task: 'Certifications Tracker - Automations', status: 'PENDING', daysLeft: 5 },
    { task: 'Enterprise Partnerships - Pipeline dashboard', status: 'PENDING', daysLeft: 7 },
    { task: 'i18n Integration - All pages', status: 'PENDING', daysLeft: 10 },
    { task: 'Multi-region deployment setup', status: 'PENDING', daysLeft: 14 }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-cyan-900/40 to-teal-900/40 border-cyan-700' : 'bg-gradient-to-r from-cyan-100 to-teal-100 border-cyan-400'}`}>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Brain className="w-10 h-10" />
              ⚡ Phase 6 Execution Dashboard
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Sprint 5 Final Sprint + Phase 6 Kickoff | Status: Transition Week
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-orange-600">Sprint 5: 48% → 85%</Badge>
              <Badge className="bg-cyan-600">Phase 6: Week 1 Starting</Badge>
              <Badge className="bg-purple-600">70 Days Total</Badge>
            </div>
          </div>
        </section>

        {/* SPRINT 5 FINAL ITEMS */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            🔴 Sprint 5 - Final Pending Items (Due this week)
          </h2>
          <div className="space-y-3">
            {sprint5Pending.map((item, idx) => (
              <Card key={idx} className={`border-2 ${isDark ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-400'}`}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{item.task}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-orange-600">{item.status}</Badge>
                      <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.daysLeft}d
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className={`text-sm mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            ⚠️ These items MUST be completed by Mar 7 to unlock Phase 6 full team allocation
          </p>
        </section>

        {/* PHASE 6 WEEKLY TIMELINE */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyan-600" />
            🚀 Phase 6 - 10 Week Roadmap
          </h2>
          
          {/* Week Selector */}
          <div className="grid md:grid-cols-5 gap-3 mb-6">
            {Object.keys(weeklyPlan).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedWeek(key)}
                className={`p-3 rounded-lg border-2 transition text-sm font-bold ${
                  selectedWeek === key
                    ? isDark
                      ? 'bg-cyan-900/40 border-cyan-700'
                      : 'bg-cyan-50 border-cyan-500'
                    : isDark
                    ? 'bg-gray-900 border-gray-800'
                    : 'border-gray-200'
                }`}
              >
                {weeklyPlan[key].week.split('(')[0].trim()}
              </button>
            ))}
          </div>

          {/* Selected Week Details */}
          {selectedWeekData && (
            <Card className={`border-2 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedWeekData.week}</CardTitle>
                  <Badge className="bg-cyan-600">{selectedWeekData.focus}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedWeekData.tasks.map((task, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{task.name}</span>
                      <Badge className={
                        task.status === 'IN PROGRESS' ? 'bg-blue-600' : 'bg-gray-600'
                      }>
                        {task.status}
                      </Badge>
                    </div>
                    <Progress value={task.completion} className="h-2" />
                    <p className="text-xs text-right mt-1 font-semibold">{task.completion}%</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </section>

        {/* PHASE 6 HIGHLIGHTS */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className={`border-2 ${isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-400'}`}>
            <CardHeader>
              <CardTitle>✅ Week 1-2 Kickoff (Mar 10)</CardTitle>
            </CardHeader>
            <CardContent className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
              <p>🧠 AI Module design + architecture</p>
              <p>📱 Mobile app tech stack finalized</p>
              <p>🔌 Zapier integration kickoff</p>
              <p>⚙️ LLM setup (OpenAI/Claude)</p>
            </CardContent>
          </Card>

          <Card className={`border-2 ${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-400'}`}>
            <CardHeader>
              <CardTitle>🎯 Milestones (By May 26)</CardTitle>
            </CardHeader>
            <CardContent className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
              <p>🤖 AI Document Classifier live</p>
              <p>📲 Mobile app (iOS + Android) released</p>
              <p>🔗 Zapier + Make integrations live</p>
              <p>📊 Advanced Analytics + API v2</p>
            </CardContent>
          </Card>
        </div>

        {/* CRITICAL PATH */}
        <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-cyan-900/60 to-teal-900/60 border-cyan-600' : 'bg-gradient-to-r from-cyan-100 to-teal-100 border-cyan-600'}`}>
          <CardContent className="pt-8 space-y-4">
            <h3 className="text-2xl font-bold">🎯 Critical Path to Success</h3>
            <div className={`space-y-3 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <p className="font-bold">Complete Sprint 5 (by Mar 7)</p>
                  <p className="text-sm">Finish i18n integration, go-to-market pages, certifications tracker</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <p className="font-bold">Phase 6 Week 1-2: AI + Mobile Foundations (Mar 10-24)</p>
                  <p className="text-sm">Design documents, tech stack, prototype baseline</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <p className="font-bold">Phase 6 Week 3-4: Beta Release (Mar 24 - Apr 7)</p>
                  <p className="text-sm">AI classifier beta, mobile alpha, Zapier submission</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">4️⃣</span>
                <div>
                  <p className="font-bold">Phase 6 Week 5-10: Production Ready (Apr 7 - May 26)</p>
                  <p className="text-sm">API v2, analytics, security audit, final launch</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SUMMARY */}
        <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
          <CardHeader>
            <CardTitle>📊 Execution Status</CardTitle>
          </CardHeader>
          <CardContent className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
            <p>🔴 <strong>This Week (Mar 3-7):</strong> Complete 5 pending Sprint 5 items for 85% completion</p>
            <p>🟠 <strong>Next Week (Mar 10):</strong> Phase 6 formal kickoff with full team allocation</p>
            <p>🟢 <strong>Target:</strong> 8 premium features live by May 26, 2026</p>
            <p>💎 <strong>Outcome:</strong> DocuChain becomes #1 AI-powered blockchain signature platform in LATAM</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}