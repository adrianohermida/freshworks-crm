import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, AlertCircle, TrendingUp, Zap } from 'lucide-react';
import DeploymentStatus from '@/components/DeploymentStatus';
import CustomerOnboarding from '@/components/CustomerOnboarding';
import RevenueTracker from '@/components/RevenueTracker';
import SupportCenterStatus from '@/components/SupportCenterStatus';
import SalesEnablement from '@/components/SalesEnablement';
import MonitoringAlerts from '@/components/MonitoringAlerts';
import OnboardingWorkflow from '@/components/OnboardingWorkflow';
import { useTenant } from '@/components/TenantContext';
import { useI18n } from '@/components/i18nManager';

export default function Sprint6WeeklyDashboard() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const { tenantId } = useTenant();
  const { t } = useI18n();
  const [activeWeek, setActiveWeek] = useState('week1');

  const weekData = {
    week1: {
      title: 'Week 1: Production Launch',
      dates: 'MAR 4-10',
      status: '🟢 READY FOR DEPLOYMENT',
      completed: 8,
      total: 8,
      items: [
        { task: 'Production Deployments (3 regions)', status: 'in_progress', owner: 'DevOps' },
        { task: 'Support Center 24/7 Activation', status: 'in_progress', owner: 'Support' },
        { task: 'Customer Onboarding Workflows', status: 'completed', owner: 'Product' },
        { task: 'Revenue Tracking Dashboard', status: 'completed', owner: 'Analytics' },
        { task: 'Incident Response Protocol', status: 'completed', owner: 'SRE' },
        { task: 'Customer Communications', status: 'completed', owner: 'Marketing' },
        { task: 'Sales Enablement Materials', status: 'completed', owner: 'Sales' },
        { task: 'First Monitoring Alert Test', status: 'completed', owner: 'DevOps' }
      ]
    },
    week2: {
      title: 'Week 2: Stabilization & Scaling',
      dates: 'MAR 11-17',
      status: '⏳ SCHEDULED',
      completed: 0,
      total: 8,
      items: [
        { task: 'Monitor 72-hour uptime', status: 'pending', owner: 'SRE' },
        { task: 'Customer success KPIs', status: 'pending', owner: 'Success' },
        { task: 'Revenue optimization', status: 'pending', owner: 'Analytics' },
        { task: 'Scale infrastructure', status: 'pending', owner: 'DevOps' },
        { task: 'Partnership onboarding', status: 'pending', owner: 'Product' },
        { task: 'Performance optimization', status: 'pending', owner: 'Backend' },
        { task: 'Support escalation handling', status: 'pending', owner: 'Support' },
        { task: 'Week 1 retrospective', status: 'pending', owner: 'Leadership' }
      ]
    }
  };

  const data = weekData[activeWeek];
  const percentComplete = Math.round((data.completed / data.total) * 100);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className={`p-6 rounded-lg border-2 ${isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-400'}`}>
          <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">
            <Zap className="w-8 h-8" />
            Sprint 6 Weekly Execution Dashboard
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            MAR 4-31, 2026 | Production Launch Phase
          </p>
        </div>

        {/* Week Selector */}
        <Tabs value={activeWeek} onValueChange={setActiveWeek} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="week1">📅 Week 1 (MAR 4-10) - LIVE</TabsTrigger>
            <TabsTrigger value="week2">📅 Week 2 (MAR 11-17)</TabsTrigger>
          </TabsList>

          {/* Week 1 */}
          <TabsContent value="week1" className="space-y-6 mt-6">
            
            {/* Progress Overview */}
            <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700' : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-500'}`}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Week 1 Progress</h3>
                  <Badge className={data.status.includes('PROGRESS') ? 'bg-red-600' : 'bg-yellow-600'}>
                    {data.status}
                  </Badge>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{percentComplete}% Complete</span>
                    <span className="font-bold text-lg">{data.completed}/{data.total} Tasks</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-4">
                    <div 
                      className="bg-green-600 h-4 rounded-full transition-all"
                      style={{ width: `${percentComplete}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deployment Status */}
            <DeploymentStatus />

            {/* Support Center */}
            <SupportCenterStatus />

            {/* Customer Onboarding */}
            <CustomerOnboarding />

            {/* Revenue Tracking */}
            <RevenueTracker />

            {/* Sales Enablement */}
            <SalesEnablement />

            {/* Onboarding Workflow */}
            <OnboardingWorkflow />

            {/* Monitoring & Alerts */}
            <MonitoringAlerts />

            {/* Task List */}
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle>📋 Week 1 Task Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-lg flex items-center justify-between ${
                      isDark ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.task}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.owner}</p>
                    </div>
                    <Badge className={
                      item.status === 'completed' ? 'bg-green-600' :
                      item.status === 'in_progress' ? 'bg-blue-600' :
                      'bg-gray-600'
                    }>
                      {item.status === 'completed' ? '✅' : item.status === 'in_progress' ? '🔄' : '⏳'}
                    </Badge>
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
                    Focus: Stabilization, scaling, and partner integrations
                  </p>
                  <div className="bg-yellow-100/50 dark:bg-yellow-900/30 p-4 rounded-lg">
                    <p className="text-sm font-semibold">Prerequisites:</p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>✓ Week 1 all deployments successful</li>
                      <li>✓ 99.99% uptime maintained</li>
                      <li>✓ 50+ customers onboarded</li>
                    </ul>
                  </div>
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
                    className={`p-3 rounded-lg flex items-center justify-between ${
                      isDark ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.task}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.owner}</p>
                    </div>
                    <Badge className="bg-gray-600">⏳ Queued</Badge>
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