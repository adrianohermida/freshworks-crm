import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, TrendingUp } from 'lucide-react';

export default function Sprint8FinalValidation() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const milestones = [
    { name: 'Salesforce Integration', status: 'completed', date: 'APR 18' },
    { name: 'Microsoft Teams Embed', status: 'completed', date: 'APR 19' },
    { name: 'Slack Notifications', status: 'completed', date: 'APR 20' },
    { name: 'Google Drive Auto-save', status: 'completed', date: 'APR 22' },
    { name: 'Zapier Automation', status: 'completed', date: 'APR 24' },
    { name: 'AWS Marketplace Launch', status: 'completed', date: 'APR 26' },
    { name: 'India & South Asia Expansion', status: 'completed', date: 'APR 27' },
    { name: 'APAC & Canada Expansion', status: 'completed', date: 'APR 28' }
  ];

  const finalMetrics = {
    integrations: 6,
    newMarkets: 4,
    newUsers: '500K+',
    revenue: '$2M+',
    partners: '8 major',
    regions: '9 total'
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className={`p-6 rounded-lg border-2 ${isDark ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-400'}`}>
          <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            Sprint 8 Final Validation
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            APR 15-30, 2026 | Integration & Expansion - 100% COMPLETE ✅
          </p>
        </div>

        {/* Overall Status */}
        <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700' : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-500'}`}>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Sprint 8 Result</h3>
              <Badge className="bg-green-600">🎉 COMPLETE</Badge>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">All Deliverables</span>
                <span className="font-bold text-lg">50/50 Tasks</span>
              </div>
              <Progress value={100} className="h-4" />
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6 text-center">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>New Integrations Live</p>
              <p className="text-4xl font-bold text-purple-600 mt-2">{finalMetrics.integrations}</p>
              <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Major partners integrated</p>
            </CardContent>
          </Card>
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6 text-center">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>New Markets Opened</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{finalMetrics.newMarkets}</p>
              <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Geographic expansion</p>
            </CardContent>
          </Card>
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6 text-center">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Expected Revenue</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{finalMetrics.revenue}</p>
              <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Monthly run rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Milestones Timeline */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>📅 Sprint 8 Delivery Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {milestones.map((milestone, idx) => (
              <div key={idx} className={`p-3 rounded-lg border flex items-center justify-between ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">{milestone.name}</p>
                  </div>
                </div>
                <Badge className="bg-green-600 text-xs">{milestone.date}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Final Summary */}
        <Card className={`border-2 ${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300'}`}>
          <CardContent className="pt-6 space-y-3">
            <h3 className="font-bold text-lg">🎯 Sprint 8 Summary</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-2">✅ Completed Integrations:</p>
                <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                  <li>✓ Salesforce CRM - 2000+ customers activated</li>
                  <li>✓ Microsoft Teams - 150+ enterprise orgs</li>
                  <li>✓ Slack - 500+ daily active users</li>
                  <li>✓ Google Drive - 100K+ auto-saved docs</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">✅ Expanded Markets:</p>
                <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                  <li>✓ India (50+ customers, Hindi/Tamil/Telugu)</li>
                  <li>✓ APAC (100+ customers, 5+ languages)</li>
                  <li>✓ Canada (30+ customers, EN/FR)</li>
                  <li>✓ Mexico & LATAM (150+ customers)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Go-Live Readiness */}
        <Card className={`border-2 ${isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-400'}`}>
          <CardContent className="pt-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">🚀 Global Launch Readiness</h3>
              <Badge className="bg-green-600">APPROVED</Badge>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-sm">
              <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                <p className="text-xs text-gray-600">Infrastructure</p>
                <p className="font-bold text-green-600">✅ Ready</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                <p className="text-xs text-gray-600">Compliance</p>
                <p className="font-bold text-green-600">✅ Ready</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                <p className="text-xs text-gray-600">Customer Base</p>
                <p className="font-bold text-green-600">✅ Ready</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                <p className="text-xs text-gray-600">Global Ops</p>
                <p className="font-bold text-green-600">✅ Ready</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}