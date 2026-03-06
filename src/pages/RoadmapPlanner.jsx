import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, AlertCircle, Lightbulb, Users } from 'lucide-react';

export default function RoadmapPlanner() {
  const [selectedSprint, setSelectedSprint] = useState('27');

  const sprints = [
    {
      number: '27',
      name: 'Performance & Stability',
      duration: '2 weeks',
      status: 'planning',
      features: [
        { name: 'Query Optimization', priority: 'P1', feedback: true },
        { name: 'Lazy Loading - Processes', priority: 'P1', feedback: true },
        { name: 'Cache Warming Strategy', priority: 'P2', feedback: false },
        { name: 'Mobile UX Improvements', priority: 'P2', feedback: true },
        { name: 'Dark Mode Refinements', priority: 'P3', feedback: false }
      ]
    },
    {
      number: '28',
      name: 'Feature Expansion',
      duration: '2 weeks',
      status: 'pending',
      features: [
        { name: 'Advanced Filtering', priority: 'P1', feedback: true },
        { name: 'Bulk Actions', priority: 'P2', feedback: false },
        { name: 'Custom Reports', priority: 'P2', feedback: true },
        { name: 'WhatsApp Integration Enhanced', priority: 'P2', feedback: false }
      ]
    },
    {
      number: '29',
      name: 'Enterprise Features',
      duration: '2 weeks',
      status: 'pending',
      features: [
        { name: 'Multi-tenant Support', priority: 'P1', feedback: false },
        { name: 'Advanced Analytics', priority: 'P2', feedback: true },
        { name: 'SAML/SSO Integration', priority: 'P2', feedback: false },
        { name: 'Custom Branding', priority: 'P3', feedback: false }
      ]
    }
  ];

  const feedbackInsights = [
    {
      topic: 'Performance Issues',
      count: 8,
      sentiment: 'negative',
      action: 'Sprint 27 priority'
    },
    {
      topic: 'Feature Requests',
      count: 15,
      sentiment: 'neutral',
      action: 'Sprint 28 planning'
    },
    {
      topic: 'UI/UX Feedback',
      count: 12,
      sentiment: 'mixed',
      action: 'Incremental improvements'
    }
  ];

  const currentSprint = sprints.find(s => s.number === selectedSprint);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            DataJud - Roadmap V2
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Plano de 3 meses baseado em feedback de usuários e métricas
          </p>
        </div>

        {/* KEY METRICS */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">User Requests</div>
            <div className="text-3xl font-bold text-cyan-600">35</div>
            <p className="text-xs text-gray-500 mt-1">Feature requests coletados</p>
          </Card>
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Sprints Planejados</div>
            <div className="text-3xl font-bold text-blue-600">3</div>
            <p className="text-xs text-gray-500 mt-1">6 semanas de desenvolvimento</p>
          </Card>
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Features</div>
            <div className="text-3xl font-bold text-green-600">18</div>
            <p className="text-xs text-gray-500 mt-1">Totais planejadas</p>
          </Card>
        </div>

        {/* FEEDBACK INSIGHTS */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">User Feedback Insights</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {feedbackInsights.map((insight, idx) => (
              <Card key={idx} className="p-4 dark:bg-gray-800">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm">{insight.topic}</p>
                    <p className="text-2xl font-bold text-cyan-600 mt-2">{insight.count}</p>
                  </div>
                  <Lightbulb className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                  <strong>Action:</strong> {insight.action}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* SPRINTS */}
        <Tabs value={selectedSprint} onValueChange={setSelectedSprint} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            {sprints.map(s => (
              <TabsTrigger key={s.number} value={s.number}>
                Sprint {s.number}
              </TabsTrigger>
            ))}
          </TabsList>

          {sprints.map(sprint => (
            <TabsContent key={sprint.number} value={sprint.number} className="space-y-4">
              <Card className="p-6 dark:bg-gray-800">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{sprint.name}</h3>
                  <div className="flex gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      📅 {sprint.duration}
                    </span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      sprint.status === 'planning'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      {sprint.status === 'planning' ? '🔵 Em Planejamento' : '⚪ Planejado'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {sprint.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <CheckCircle2 className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{feature.name}</p>
                        <div className="flex gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            feature.priority === 'P1'
                              ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                              : feature.priority === 'P2'
                              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                              : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          }`}>
                            {feature.priority}
                          </span>
                          {feature.feedback && (
                            <span className="text-xs px-2 py-0.5 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                              👥 User Request
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* TIMELINE */}
        <Card className="p-6 dark:bg-gray-800 mt-8">
          <h3 className="text-xl font-bold mb-6">6-Month Vision</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-32 font-semibold">Sprint 27 (Now)</div>
              <div>
                <p className="font-semibold">Performance & Stability</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Otimizações baseadas em feedback de usuários
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-32 font-semibold">Sprint 28 (+2w)</div>
              <div>
                <p className="font-semibold">Feature Expansion</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Filtros avançados, bulk actions, reports
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-32 font-semibold">Sprint 29 (+4w)</div>
              <div>
                <p className="font-semibold">Enterprise Features</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Multi-tenant, SSO, advanced analytics
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-32 font-semibold">+ Sprints</div>
              <div>
                <p className="font-semibold">Continuous Improvement</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Baseado em dados de produção e feedback
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}