import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap } from 'lucide-react';
import PartnershipIntegrations from '@/components/PartnershipIntegrations';
import RegionalExpansionModule from '@/components/RegionalExpansionModule';

export default function Sprint8WeeklyDashboard() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [activeWeek, setActiveWeek] = useState('overview');

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className={`p-6 rounded-lg border-2 ${isDark ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-400'}`}>
          <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">
            <Zap className="w-8 h-8" />
            Sprint 8 Planning Dashboard
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            APR 15-30, 2026 | Integration & Expansion Phase (Ready to Queue)
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeWeek} onValueChange={setActiveWeek} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">📊 Overview</TabsTrigger>
            <TabsTrigger value="partnerships">🔗 Partnerships</TabsTrigger>
            <TabsTrigger value="expansion">🌍 Regional</TabsTrigger>
            <TabsTrigger value="complete">✅ COMPLETE</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            
            <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-700' : 'bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-500'}`}>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-2xl font-bold">Sprint 8 Goals</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="font-semibold text-lg mb-2">🔗 Partnership Integrations</p>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>✅ Salesforce CRM sync</li>
                      <li>✅ Microsoft Teams embed</li>
                      <li>✅ Slack notifications</li>
                      <li>✅ Google Drive auto-save</li>
                      <li>✅ Zapier automation</li>
                      <li>✅ AWS Marketplace listing</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="font-semibold text-lg mb-2">🌍 Regional Expansion</p>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>✅ India & South Asia</li>
                      <li>✅ Asia Pacific (APAC)</li>
                      <li>✅ Canada</li>
                      <li>✅ Mexico & LATAM</li>
                      <li>✅ Multi-language support</li>
                      <li>✅ Regional compliance</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle>📅 Sprint 8 Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200">
                  <p className="font-semibold text-sm">Week 1-2 (APR 15-28)</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Complete major integrations (Salesforce, Teams, Slack, Google Drive)
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200">
                  <p className="font-semibold text-sm">Week 3-4 (APR 29-30)</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Finalize regional expansion & launch new markets
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Success Metrics */}
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle>🎯 Success Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-gray-700 p-3 rounded border text-sm">
                    <p className="text-gray-600 dark:text-gray-300">6+ Integrations Live</p>
                    <p className="text-2xl font-bold text-purple-600">6/6</p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-3 rounded border text-sm">
                    <p className="text-gray-600 dark:text-gray-300">4 New Markets Open</p>
                    <p className="text-2xl font-bold text-green-600">4/4</p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-3 rounded border text-sm">
                    <p className="text-gray-600 dark:text-gray-300">Est. +500K Users</p>
                    <p className="text-2xl font-bold text-blue-600">500K+</p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-3 rounded border text-sm">
                    <p className="text-gray-600 dark:text-gray-300">Revenue Target</p>
                    <p className="text-2xl font-bold text-orange-600">$2M+</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* Partnerships */}
          <TabsContent value="partnerships" className="space-y-6 mt-6">
            <PartnershipIntegrations />
          </TabsContent>

          {/* Regional Expansion */}
          <TabsContent value="expansion" className="space-y-6 mt-6">
            <RegionalExpansionModule />
          </TabsContent>

          {/* Complete Status */}
          <TabsContent value="complete" className="space-y-6 mt-6">
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-100 to-emerald-100">
              <CardContent className="pt-6 space-y-4">
                <div className="text-center space-y-3">
                  <p className="text-4xl">🎉</p>
                  <h3 className="text-3xl font-bold text-green-600">Sprint 8 Complete!</h3>
                  <p className="text-lg text-gray-700">All integrations & expansions delivered on schedule</p>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                  <div className="bg-white p-3 rounded">
                    <p className="text-gray-600">6 Integrations</p>
                    <p className="text-2xl font-bold text-purple-600">✅</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="text-gray-600">4 New Markets</p>
                    <p className="text-2xl font-bold text-green-600">✅</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="text-gray-600">500K Users</p>
                    <p className="text-2xl font-bold text-blue-600">✅</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="text-gray-600">$2M Revenue</p>
                    <p className="text-2xl font-bold text-orange-600">✅</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}