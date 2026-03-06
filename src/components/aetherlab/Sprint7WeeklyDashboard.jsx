import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Brain, TrendingUp } from 'lucide-react';
import AIFeaturesDevelopment from '@/components/AIFeaturesDevelopment';
import AnalyticsAdvancedDev from '@/components/AnalyticsAdvancedDev';

export default function Sprint7WeeklyDashboard() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [activeWeek, setActiveWeek] = useState('week1');

  const weekData = {
    week1: {
      title: 'Week 1: AI Foundation & Analytics Setup',
      dates: 'APR 1-7',
      status: '🟢 COMPLETE',
      completed: 8,
      total: 8,
      items: [
        { task: 'Document Auto-Classification (ML)', status: 'completed', owner: 'ML Team', progress: 100 },
        { task: 'Smart Field Extraction (NLP)', status: 'completed', owner: 'NLP Team', progress: 100 },
        { task: 'Signature Position Prediction (CV)', status: 'completed', owner: 'CV Team', progress: 100 },
        { task: 'Compliance Rule Engine', status: 'completed', owner: 'Backend', progress: 100 },
        { task: 'Analytics API Setup', status: 'completed', owner: 'Backend', progress: 100 },
        { task: 'Custom Report Builder', status: 'completed', owner: 'Frontend', progress: 100 },
        { task: 'Predictive Models (Beta)', status: 'completed', owner: 'Data Science', progress: 100 },
        { task: 'Performance Testing', status: 'completed', owner: 'QA', progress: 100 }
      ]
    },
    week2: {
      title: 'Week 2: AI Refinement & Analytics Launch',
      dates: 'APR 8-14',
      status: '⏳ SCHEDULED',
      completed: 0,
      total: 8,
      items: [
        { task: 'Fine-tune Classification Model', status: 'pending', owner: 'ML Team', progress: 0 },
        { task: 'Sentiment Analysis Integration', status: 'pending', owner: 'NLP Team', progress: 0 },
        { task: 'Anomaly Detection', status: 'pending', owner: 'Data Science', progress: 0 },
        { task: 'Custom Report Dashboards (GA)', status: 'pending', owner: 'Frontend', progress: 0 },
        { task: 'Real-time Metrics Streaming', status: 'pending', owner: 'Backend', progress: 0 },
        { task: 'Cohort Analysis Module', status: 'pending', owner: 'Analytics', progress: 0 },
        { task: 'AI Feature Documentation', status: 'pending', owner: 'Docs Team', progress: 0 },
        { task: 'Beta Customer Feedback', status: 'pending', owner: 'Product', progress: 0 }
      ]
    }
  };

  const data = weekData[activeWeek];
  const inProgress = data.items.filter(i => i.status === 'in_progress').length;
  const completed = data.items.filter(i => i.status === 'completed').length;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className={`p-6 rounded-lg border-2 ${isDark ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 border-purple-400'}`}>
          <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">
            <Brain className="w-8 h-8" />
            Sprint 7 Weekly Dashboard
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            APR 1-28, 2026 | AI & Advanced Analytics Phase
          </p>
        </div>

        {/* Week Selector */}
        <Tabs value={activeWeek} onValueChange={setActiveWeek} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="week1">📅 Week 1 (APR 1-7) - ✅ COMPLETE</TabsTrigger>
            <TabsTrigger value="week2">📅 Week 2-4 Progress</TabsTrigger>
          </TabsList>

          {/* Week 1 */}
          <TabsContent value="week1" className="space-y-6 mt-6">
            
            {/* Progress Overview */}
            <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700' : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-500'}`}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Week 1 Status</h3>
                  <Badge className="bg-green-600">✅ COMPLETE</Badge>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">All 8 AI Features Delivered</span>
                    <span className="font-bold text-lg">{completed}/{data.total} Tasks</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-4">
                    <div 
                      className="bg-green-600 h-4 rounded-full transition-all"
                      style={{ width: `100%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Features */}
            <AIFeaturesDevelopment />

            {/* Analytics */}
            <AnalyticsAdvancedDev />

            {/* Task Breakdown */}
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle>📋 Week 1 Feature Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.task}</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.owner}</p>
                      </div>
                      <Badge className={
                        item.status === 'completed' ? 'bg-green-600' :
                        item.status === 'in_progress' ? 'bg-blue-600' :
                        'bg-gray-600'
                      }>
                        {item.progress}%
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-1.5">
                      <div 
                        className="bg-purple-600 h-1.5 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </TabsContent>

          {/* Week 2 */}
          <TabsContent value="week2" className="space-y-6 mt-6">
            
            <Card className={`border-2 ${isDark ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-400'}`}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">Week 2 Overview</h3>
                    <Badge className="bg-yellow-600">⏳ SCHEDULED</Badge>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Focus: AI refinement, analytics GA launch, and customer beta feedback
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle>📋 Week 2 Task Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.task}</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.owner}</p>
                      </div>
                      <Badge className="bg-gray-600">⏳ Queued</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}