import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Rocket } from 'lucide-react';
import QualityAssuranceModule from '@/components/QualityAssuranceModule';
import OptimizationMetrics from '@/components/OptimizationMetrics';

export default function Sprint9Dashboard() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const goals = [
    { goal: 'Complete QA Suite', items: 8, status: 'in_progress', owner: 'QA Team' },
    { goal: 'Performance Optimization', items: 6, status: 'in_progress', owner: 'DevOps' },
    { goal: 'Security Hardening', items: 5, status: 'in_progress', owner: 'Security' },
    { goal: 'Documentation & Training', items: 4, status: 'pending', owner: 'Docs Team' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className={`p-6 rounded-lg border-2 ${isDark ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 border-orange-400'}`}>
          <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">
            <Rocket className="w-8 h-8" />
            Sprint 9 - Quality & Optimization Phase
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            MAY 1-14, 2026 | Pre-Launch Quality Assurance (LIVE NOW)
          </p>
        </div>

        {/* Status Overview */}
        <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-orange-900/20 to-red-900/20 border-orange-700' : 'bg-gradient-to-r from-orange-100 to-red-100 border-orange-500'}`}>
          <CardContent className="pt-6 space-y-4">
            <div className="grid md:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">Total Goals</p>
                <p className="text-3xl font-bold text-orange-600">4</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">2</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">Tasks Total</p>
                <p className="text-3xl font-bold">23</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                <p className="text-xs text-gray-600">Est. Duration</p>
                <p className="text-3xl font-bold text-purple-600">2 wks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals Breakdown */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>🎯 Sprint 9 Goals & Priorities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {goals.map((g, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">{g.goal}</p>
                  <Badge className={
                    g.status === 'in_progress' ? 'bg-blue-600' : 'bg-gray-600'
                  }>
                    {g.status === 'in_progress' ? '🔄 In Progress' : '⏳ Pending'}
                  </Badge>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {g.items} items • Owner: {g.owner}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* QA & Performance */}
        <div className="grid md:grid-cols-2 gap-6">
          <QualityAssuranceModule />
          <OptimizationMetrics />
        </div>

        {/* Timeline */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>📅 Sprint 9 Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className={`p-4 rounded-lg border ${
              isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300'
            }`}>
              <p className="font-semibold text-sm">Week 1 (MAY 1-7): QA & Testing</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                Complete regression testing, security audit, load testing, and performance benchmarking
              </p>
            </div>
            <div className={`p-4 rounded-lg border ${
              isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-300'
            }`}>
              <p className="font-semibold text-sm">Week 2 (MAY 8-14): Launch Prep</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                Performance optimization, documentation finalization, customer training, and deployment readiness
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}