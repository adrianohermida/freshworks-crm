import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Zap, TrendingUp, Target, Calendar, Rocket } from 'lucide-react';
import { useI18n } from '@/components/i18nManager';
import { useTenant } from '@/components/TenantContext';

export default function Sprint7Planning() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const { t } = useI18n();
  const { tenantId } = useTenant();
  const [selectedTheme, setSelectedTheme] = useState('ai');

  const sprintOverview = {
    name: 'SPRINT 7: AI & Advanced Features',
    duration: '4 Weeks (APR 1 - APR 28, 2026)',
    goal: 'Launch AI-powered features + Advanced analytics + Partnership integrations Phase 2',
    totalTasks: 50,
    previousCompletion: '45/45 (100%)',
    dependsOn: 'Sprint 6 completion + Production stability'
  };

  const themes = {
    ai: {
      title: 'Theme 1: AI-Powered Features (Week 1-2)',
      description: 'Intelligent document analysis, auto-classification, and ML-powered compliance',
      tasks: [
        { name: 'AI Document Analysis Engine', effort: '8d', owner: 'AI/ML Team' },
        { name: 'Auto-Document Classification', effort: '6d', owner: 'ML Engineers' },
        { name: 'Intelligent Error Detection', effort: '5d', owner: 'AI Team' },
        { name: 'AI-Powered Compliance Checks', effort: '6d', owner: 'AI/Compliance' },
        { name: 'Smart Signature Recommendations', effort: '4d', owner: 'Product' },
        { name: 'ML Model Training Pipeline', effort: '5d', owner: 'Data Science' },
        { name: 'AI Feature Analytics Dashboard', effort: '4d', owner: 'Analytics' },
        { name: 'User Feedback Loop System', effort: '3d', owner: 'Product' }
      ],
      totalTasks: 8
    },
    analytics: {
      title: 'Theme 2: Advanced Analytics (Week 2-3)',
      description: 'Real-time business intelligence, predictive analytics, and custom reporting',
      tasks: [
        { name: 'Real-time Analytics Dashboard', effort: '7d', owner: 'Analytics Team' },
        { name: 'Predictive Revenue Forecasting', effort: '6d', owner: 'Data Science' },
        { name: 'Customer Behavior Segmentation', effort: '5d', owner: 'Analytics' },
        { name: 'Churn Prediction Model', effort: '5d', owner: 'ML' },
        { name: 'Custom Report Builder', effort: '6d', owner: 'Backend' },
        { name: 'Export & Integration APIs', effort: '4d', owner: 'Backend' },
        { name: 'Performance Optimization (Analytics)', effort: '4d', owner: 'DevOps' },
        { name: 'Analytics Data Governance', effort: '3d', owner: 'Security' }
      ],
      totalTasks: 8
    },
    partnerships: {
      title: 'Theme 3: Partnership Integrations Phase 2 (Week 3-4)',
      description: 'Microsoft 365, Google Workspace, Salesforce, and DocuSign integrations',
      tasks: [
        { name: 'Microsoft 365 Phase 2 (Advanced)', effort: '8d', owner: 'Integration Team' },
        { name: 'Google Workspace Phase 2', effort: '8d', owner: 'Integration' },
        { name: 'Salesforce CRM Integration', effort: '7d', owner: 'Integration' },
        { name: 'DocuSign Compatibility Layer', effort: '6d', owner: 'Integration' },
        { name: 'Partner Revenue Share Automation', effort: '5d', owner: 'Product' },
        { name: 'Multi-Partner Dashboard', effort: '4d', owner: 'Frontend' },
        { name: 'Partner API SDKs (JS/Python)', effort: '6d', owner: 'Developer Platform' },
        { name: 'Joint Customer Success Program', effort: '4d', owner: 'Success' }
      ],
      totalTasks: 8
    },
    expansion: {
      title: 'Theme 4: Regional Expansion Prep (Week 4)',
      description: 'APAC, Canada, and Latin America market readiness',
      tasks: [
        { name: 'APAC Region Launch Plan', effort: '4d', owner: 'Product' },
        { name: 'Canada Market Research & Compliance', effort: '4d', owner: 'Compliance' },
        { name: 'Latam Expansion Strategy', effort: '3d', owner: 'Leadership' },
        { name: 'Multi-Language Support Expansion', effort: '6d', owner: 'i18n Team' },
        { name: 'Local Payment Integration', effort: '5d', owner: 'Backend' },
        { name: 'Regional Customer Support Setup', effort: '4d', owner: 'Support' },
        { name: 'Localization Testing (All Regions)', effort: '4d', owner: 'QA' },
        { name: 'Phase 8 Planning Kickoff', effort: '2d', owner: 'Leadership' }
      ],
      totalTasks: 8
    },
    quality: {
      title: 'Theme 5: Quality & Performance (All Weeks)',
      description: 'Testing, optimization, and infrastructure improvements',
      tasks: [
        { name: 'Automated E2E Testing Suite', effort: '8d', owner: 'QA' },
        { name: 'Performance Optimization (All Regions)', effort: '6d', owner: 'DevOps' },
        { name: 'Security Penetration Testing', effort: '5d', owner: 'Security' },
        { name: 'Load Testing (Peak Capacity)', effort: '4d', owner: 'QA' },
        { name: 'Database Optimization', effort: '4d', owner: 'Backend' },
        { name: 'API Rate Limiting & DDoS Protection', effort: '3d', owner: 'Security' }
      ],
      totalTasks: 6
    }
  };

  const themeData = themes[selectedTheme];
  const allTasksCount = Object.values(themes).reduce((sum, t) => sum + t.totalTasks, 0);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-700' : 'bg-gradient-to-r from-indigo-100 to-purple-100 border-indigo-400'}`}>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Rocket className="w-10 h-10 text-indigo-600" />
              🚀 Sprint 7: AI & Advanced Features
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {sprintOverview.duration} | {sprintOverview.goal}
            </p>
            <div className="flex gap-2">
              <Badge className="bg-indigo-600 px-4 py-2">{allTasksCount} Total Tasks</Badge>
              <Badge className="bg-green-600 px-4 py-2">Depends on Sprint 6 ✓</Badge>
            </div>
          </div>
        </section>

        {/* DEPENDENCY CHECK */}
        <Card className={`${isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-400'} border-2`}>
          <CardContent className="pt-6 space-y-3">
            <h3 className="font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Sprint 7 Readiness Status
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Sprint 5: 40/40 complete (100%) ✅</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Sprint 6: Infrastructure ready for AI features ✅</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                <span>AI/ML team allocated & trained (Ready APR 1)</span>
              </div>
              <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                🟢 All prerequisites met. Sprint 7 launch approved for APR 1.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* THEME SELECTOR */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🎯 Sprint 7 Themes (5 Total)</h2>
          <div className="grid md:grid-cols-5 gap-3 mb-6">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => setSelectedTheme(key)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedTheme === key
                    ? isDark
                      ? 'bg-indigo-900/40 border-indigo-700'
                      : 'bg-indigo-50 border-indigo-500'
                    : isDark
                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    : 'bg-white border-gray-200 hover:border-gray-400'
                }`}
              >
                <p className="font-bold text-sm">
                  {key === 'ai' ? '🤖 AI' : key === 'analytics' ? '📊 Analytics' : key === 'partnerships' ? '🤝 Partners' : key === 'expansion' ? '🌍 Expansion' : '✅ Quality'}
                </p>
                <p className="text-xs mt-1">{theme.totalTasks} tasks</p>
              </button>
            ))}
          </div>
        </section>

        {/* THEME DETAILS */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <div>
              <CardTitle>{themeData.title}</CardTitle>
              <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{themeData.description}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {themeData.tasks.map((task, idx) => (
                <div key={idx} className={`p-3 rounded-lg flex items-start justify-between ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex-1">
                    <p className="font-medium">{task.name}</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{task.owner}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{task.effort}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SPRINT METRICS */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📊 Sprint 7 KPI Targets</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: 'AI Feature Adoption', target: '30%', color: 'text-blue-600' },
              { label: 'Revenue Increase', target: '+50%', color: 'text-green-600' },
              { label: 'Partner Integrations', target: '4 Live', color: 'text-purple-600' },
              { label: 'New Markets Ready', target: '3 regions', color: 'text-indigo-600' }
            ].map((metric, idx) => (
              <Card key={idx} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="pt-6 text-center">
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{metric.label}</p>
                  <p className={`text-3xl font-bold mt-2 ${metric.color}`}>{metric.target}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* TIMELINE */}
        <Card className={`${isDark ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-400'} border-2`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              📅 Sprint 7 Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold mb-3">Week-by-Week Breakdown:</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-600">W1</Badge>
                  <div>
                    <p className="font-semibold">APR 1-7: AI Features Launch</p>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>8 AI/ML tasks → Document analysis & classification</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-purple-600">W2</Badge>
                  <div>
                    <p className="font-semibold">APR 8-14: Analytics Phase 1</p>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Real-time dashboards & predictive models</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-pink-600">W3</Badge>
                  <div>
                    <p className="font-semibold">APR 15-21: Partnerships Phase 2</p>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Microsoft, Google, Salesforce, DocuSign integrations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-green-600">W4</Badge>
                  <div>
                    <p className="font-semibold">APR 22-28: Expansion & Quality</p>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>APAC/Canada/Latam prep + Sprint 8 planning</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BLOCKERS & DEPENDENCIES */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>⚠️ Dependencies & Prerequisites</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold mb-2">✅ Ready:</p>
              <ul className="space-y-1 text-sm">
                <li>✓ Production infrastructure (Sprint 6)</li>
                <li>✓ AI/ML team allocated</li>
                <li>✓ Analytics infrastructure</li>
                <li>✓ Partner APIs available</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">📋 Requires:</p>
              <ul className="space-y-1 text-sm">
                <li>• Sprint 6 completion & stability (28+ days production)</li>
                <li>• Customer feedback data (onboarding phase)</li>
                <li>• Partner API credentials & test environments</li>
              </ul>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}