import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';

export default function OperationsTransitionDashboard() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const operationalStatus = [
    { service: 'Web Application', uptime: '99.9994%', latency: '47ms', status: '✅ Healthy' },
    { service: 'API Gateway', uptime: '99.9996%', latency: '12ms', status: '✅ Healthy' },
    { service: 'Database Cluster', uptime: '99.9999%', latency: '3.2ms', status: '✅ Optimal' },
    { service: 'AI/ML Services', uptime: '99.998%', latency: '230ms', status: '✅ Healthy' },
    { service: 'Payment Processing', uptime: '99.99%', latency: '145ms', status: '✅ Healthy' },
    { service: 'Email Notifications', uptime: '99.97%', latency: '850ms', status: '✅ Operational' }
  ];

  const supportTeamMetrics = [
    { metric: 'Support Tickets/Day', value: '2,840', trend: '+12%' },
    { metric: 'Avg Response Time', value: '4.2 mins', trend: '-35%' },
    { metric: 'Customer Satisfaction', value: '94%', trend: '+8%' },
    { metric: 'Issue Resolution Rate', value: '96%', trend: '+2%' }
  ];

  const continuousImprovements = [
    { initiative: 'Performance Optimization', status: 'active', impact: 'Sub-100ms latency maintained' },
    { initiative: 'Security Monitoring', status: 'active', impact: 'Zero breaches, 24/7 monitoring' },
    { initiative: 'Feature Roadmap Execution', status: 'active', impact: '2 features/month delivered' },
    { initiative: 'Customer Success Program', status: 'active', impact: '1200+ enterprises actively using' },
    { initiative: 'Data & Analytics', status: 'active', impact: '15M+ daily data points collected' },
    { initiative: 'Regional Expansion', status: 'active', impact: '25 regions operational' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className={`p-6 rounded-lg border-2 ${isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-400'}`}>
          <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">
            <TrendingUp className="w-8 h-8" />
            Operations Transition Dashboard
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Post-Launch Phase | JUL 16 2026 onwards | Operational Excellence
          </p>
        </div>

        {/* System Health */}
        <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-700' : 'bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-500'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              System Health & Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {operationalStatus.map((service, idx) => (
              <div key={idx} className={`p-3 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-blue-300'
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">{service.service}</p>
                    <p className="text-xs text-gray-600">Uptime: {service.uptime} • Latency: {service.latency}</p>
                  </div>
                  <Badge className="bg-green-600">{service.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Support Team Metrics */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>📞 Customer Support Metrics</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-3">
            {supportTeamMetrics.map((metric, idx) => (
              <div key={idx} className={`p-4 rounded-lg border text-center ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-300'
              }`}>
                <p className="text-sm text-gray-600 mb-2">{metric.metric}</p>
                <p className="text-2xl font-bold text-blue-600">{metric.value}</p>
                <p className="text-xs text-green-600 font-semibold mt-2">{metric.trend} trend</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Continuous Improvements */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>🔄 Ongoing Initiatives & Improvements</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-2">
            {continuousImprovements.map((initiative, idx) => (
              <div key={idx} className={`p-3 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-cyan-50 border-cyan-300'
              }`}>
                <p className="font-semibold text-sm mb-1">{initiative.initiative}</p>
                <p className="text-xs text-gray-600">{initiative.impact}</p>
                <Badge className="bg-blue-600 mt-2 text-xs">{initiative.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Operations Timeline */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>📅 Operations & Growth Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className={`p-3 rounded border font-semibold ${isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-300'}`}>
              <p>✅ JUL 16 - PRESENT: Operations Stabilization</p>
              <p className="text-xs text-gray-600 font-normal mt-1">Monitor metrics, support team responding, continuous optimization</p>
            </div>
            <div className={`p-3 rounded border font-semibold ${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300'}`}>
              <p>📊 Q3 2026: Growth Phase</p>
              <p className="text-xs text-gray-600 font-normal mt-1">Expand to 40 regions, 20M+ DAU, $60M+ MRR target</p>
            </div>
            <div className={`p-3 rounded border font-semibold ${isDark ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-300'}`}>
              <p>🚀 2H 2026: Market Leadership</p>
              <p className="text-xs text-gray-600 font-normal mt-1">New verticals, AI expansion, strategic partnerships</p>
            </div>
          </CardContent>
        </Card>

        {/* Key Focus Areas */}
        <Card className={`border-2 ${isDark ? 'bg-amber-900/30 border-amber-700' : 'bg-amber-50 border-amber-300'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Key Focus Areas (H2 2026)
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-2 text-sm">
            <div className="flex gap-2">
              <span className="font-bold">→</span>
              <span>Customer retention & upsell programs</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold">→</span>
              <span>Enterprise account management expansion</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold">→</span>
              <span>AI/ML feature acceleration & monetization</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold">→</span>
              <span>Geographic expansion to APAC & EMEA</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold">→</span>
              <span>Strategic partnerships & integrations</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold">→</span>
              <span>Mobile-first feature development</span>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}