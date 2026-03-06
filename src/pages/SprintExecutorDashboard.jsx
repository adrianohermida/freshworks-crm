import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Clock, Zap, TrendingUp, ArrowRight, Flame, Target } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SprintExecutorDashboard() {
  const [refreshTime] = useState(new Date().toLocaleString('pt-BR', { timeZone: 'America/Manaus' }));
  
  const designSystem = {
    colors: {
      primary: 'var(--color-primary)',
      accent: 'var(--color-accent)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      error: 'var(--color-error)',
      info: 'var(--color-info)',
      bg: 'var(--color-bg)',
      surface: 'var(--color-surface)',
      text: 'var(--color-text)',
      textSecondary: 'var(--color-text-secondary)',
      border: 'var(--color-border)',
      heading: 'var(--color-heading)',
      light: 'var(--color-light)',
    },
    spacing: {
      xs: 'var(--spacing-xs)',
      sm: 'var(--spacing-sm)',
      md: 'var(--spacing-md)',
      lg: 'var(--spacing-lg)',
      xl: 'var(--spacing-xl)',
      '2xl': 'var(--spacing-2xl)',
    },
    radius: {
      sm: 'var(--border-radius-sm)',
      md: 'var(--border-radius-md)',
      lg: 'var(--border-radius-lg)',
    },
    shadow: {
      sm: 'var(--shadow-sm)',
      md: 'var(--shadow-md)',
      lg: 'var(--shadow-lg)',
      xl: 'var(--shadow-xl)',
    },
    font: 'var(--font-primary)',
  };

  const executionStatus = {
    sprint10: {
      completionPercentage: 73,
      tasksCompleted: 16,
      tasksTotal: 22,
      phasesComplete: 3,
      phasesTotal: 6,
      daysRemaining: 6,
      status: 'EXECUTION',
      blockers: 2
    },
    sprint11: {
      completionPercentage: 0,
      tasksTotal: 16,
      phasesTotal: 4,
      status: 'PLANNING_READY'
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: designSystem.colors.bg,
      color: designSystem.colors.text,
      fontFamily: designSystem.font,
      padding: designSystem.spacing.lg
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: designSystem.spacing['2xl'] }}>
        {/* Header */}
        <div style={{ 
          borderBottom: `1px solid ${designSystem.colors.border}`,
          paddingBottom: designSystem.spacing.xl,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2.5rem',
              fontWeight: '700',
              color: designSystem.colors.heading,
              margin: 0,
              marginBottom: designSystem.spacing.md
            }}>
              Sprint Executor Dashboard
            </h1>
            <p style={{ 
              fontSize: '1.25rem',
              color: designSystem.colors.textSecondary,
              margin: 0
            }}>
              Live Status: Sprint 10 ↔ Sprint 11 Transition
            </p>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: designSystem.spacing.xs }}>
            <p style={{ fontSize: '0.875rem', color: designSystem.colors.textSecondary, margin: 0 }}>Timezone: America/Manaus</p>
            <p style={{ fontSize: '0.875rem', color: designSystem.colors.textSecondary, margin: 0 }}>Updated: {refreshTime}</p>
            <Badge style={{
              marginTop: designSystem.spacing.md,
              backgroundColor: designSystem.colors.success,
              color: 'white',
              padding: `${designSystem.spacing.md} ${designSystem.spacing.lg}`,
              fontSize: '1rem',
              borderRadius: designSystem.radius.md,
              border: 'none',
              display: 'inline-block',
              width: 'fit-content',
              marginLeft: 'auto'
            }}>
              ACTIVE
            </Badge>
          </div>
        </div>

        {/* Sprint 10 Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: designSystem.spacing.xl }}>
          <h2 style={{ 
            fontSize: '1.875rem',
            fontWeight: '700',
            color: designSystem.colors.heading,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: designSystem.spacing.md
          }}>
            <span style={{ color: designSystem.colors.primary }}>Sprint 10</span>
            <span style={{ color: designSystem.colors.textSecondary }}>Post-Launch Stabilization</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: designSystem.spacing.md }}>
            <div style={{
              backgroundColor: designSystem.colors.surface,
              borderRadius: designSystem.radius.lg,
              border: `1px solid ${designSystem.colors.border}`,
              padding: designSystem.spacing.lg,
              boxShadow: designSystem.shadow.md
            }}>
              <div style={{ textAlign: 'center' }}>
                <CheckCircle2 style={{ width: '2.5rem', height: '2.5rem', color: designSystem.colors.success, margin: '0 auto var(--spacing-md)' }} />
                <p style={{ color: designSystem.colors.textSecondary, fontSize: '0.875rem', fontWeight: '600', margin: 0, marginBottom: designSystem.spacing.sm }}>TASKS COMPLETED</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: designSystem.colors.heading, margin: 0, marginBottom: designSystem.spacing.md }}>
                  {executionStatus.sprint10.tasksCompleted}/{executionStatus.sprint10.tasksTotal}
                </p>
                <div style={{ height: '0.5rem', backgroundColor: designSystem.colors.light, borderRadius: designSystem.radius.md, overflow: 'hidden' }}>
                  <div 
                    style={{
                      height: '100%',
                      backgroundColor: designSystem.colors.success,
                      width: '73%',
                      transition: 'width 0.3s ease'
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Zap className="w-10 h-10 text-blue-400 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm font-semibold mb-2">PHASES DONE</p>
                  <p className="text-4xl font-bold text-white">{executionStatus.sprint10.phasesComplete}/{executionStatus.sprint10.phasesTotal}</p>
                  <p className="text-slate-400 text-xs mt-2">50% complete</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="w-10 h-10 text-yellow-400 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm font-semibold mb-2">TIME REMAINING</p>
                  <p className="text-4xl font-bold text-white">{executionStatus.sprint10.daysRemaining}</p>
                  <p className="text-slate-400 text-xs mt-2">days to closure</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-red-700 border-2">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Flame className="w-10 h-10 text-red-400 mx-auto mb-2 animate-pulse" />
                  <p className="text-slate-400 text-sm font-semibold mb-2">CRITICAL BLOCKERS</p>
                  <p className="text-4xl font-bold text-red-400">{executionStatus.sprint10.blockers}</p>
                  <p className="text-red-400 text-xs mt-2">UNBLOCK TODAY</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Progress */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Overall Sprint 10 Progress</span>
                <Badge className="bg-blue-600 text-lg px-4 py-2">{executionStatus.sprint10.completionPercentage}%</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={executionStatus.sprint10.completionPercentage} className="h-4" />
              <div className="grid grid-cols-4 gap-4 text-center text-sm">
                <div className="p-3 bg-slate-700 rounded">
                  <p className="text-slate-400">✅ Done</p>
                  <p className="text-xl font-bold text-green-400 mt-1">{executionStatus.sprint10.tasksCompleted}</p>
                </div>
                <div className="p-3 bg-slate-700 rounded">
                  <p className="text-slate-400">🔄 Progress</p>
                  <p className="text-xl font-bold text-blue-400 mt-1">2</p>
                </div>
                <div className="p-3 bg-slate-700 rounded">
                  <p className="text-slate-400">⏳ Pending</p>
                  <p className="text-xl font-bold text-yellow-400 mt-1">4</p>
                </div>
                <div className="p-3 bg-red-900 rounded border border-red-700">
                  <p className="text-red-400">🚨 Blockers</p>
                  <p className="text-xl font-bold text-red-300 mt-1">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Actions */}
        <Card className="bg-gradient-to-r from-red-900 to-red-800 border-red-600 border-2">
          <CardHeader>
            <CardTitle className="text-red-100 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              🚨 CRITICAL ACTIONS REQUIRED - TODAY
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-red-950 rounded-lg border border-red-700">
              <p className="text-lg font-bold text-red-200 mb-2">1️⃣ ANALYZE SLOW QUERY PATTERNS</p>
              <div className="grid grid-cols-3 gap-4 text-sm text-red-100 mb-3">
                <div>
                  <span className="text-red-400">Owner:</span>
                  <p className="font-semibold">Backend Lead</p>
                </div>
                <div>
                  <span className="text-red-400">Effort:</span>
                  <p className="font-semibold">4 hours</p>
                </div>
                <div>
                  <span className="text-red-400">Due:</span>
                  <p className="font-semibold">TODAY EOD</p>
                </div>
              </div>
              <p className="text-red-300 text-sm">
                ⚡ This is the blocker for Sprint 11. Allocate 2 senior backend engineers immediately.
              </p>
            </div>

            <div className="p-4 bg-red-950 rounded-lg border border-red-700">
              <p className="text-lg font-bold text-red-200 mb-2">2️⃣ IMPLEMENT QUERY OPTIMIZATIONS</p>
              <div className="grid grid-cols-3 gap-4 text-sm text-red-100 mb-3">
                <div>
                  <span className="text-red-400">Owner:</span>
                  <p className="font-semibold">Backend Team</p>
                </div>
                <div>
                  <span className="text-red-400">Effort:</span>
                  <p className="font-semibold">6 hours</p>
                </div>
                <div>
                  <span className="text-red-400">Due:</span>
                  <p className="font-semibold">2026-03-05</p>
                </div>
              </div>
              <p className="text-red-300 text-sm">
                ⚡ Depends on task #1. Must complete to unblock Fase 5.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white">6-Day Sprint Closure Timeline</h3>
          <div className="space-y-3">
            {[
              { day: 'TODAY (03-04)', task: '🔴 Execute query analysis', owner: 'Backend', hours: '4h', status: 'START NOW' },
              { day: '2026-03-05', task: '🔴 Execute query optimization', owner: 'Backend', hours: '6h', status: 'DEPENDENT' },
              { day: '2026-03-05 to 07', task: '🟡 Establish performance baseline', owner: 'DevOps', hours: '5h', status: 'NEXT' },
              { day: '2026-03-08 to 09', task: '🔵 Sprint closure tasks', owner: 'All Teams', hours: '6.5h', status: 'SCHEDULED' },
              { day: '2026-03-10', task: '🚀 SPRINT 11 FORMAL KICKOFF', owner: 'Product Lead', hours: '1h', status: 'GATE' }
            ].map((item, idx) => (
              <Card key={idx} className="bg-slate-800 border-slate-700 flex items-center gap-4 p-4">
                <div className="flex-1">
                  <p className="text-slate-400 text-sm font-semibold">{item.day}</p>
                  <p className="text-white font-bold text-lg mt-1">{item.task}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-slate-400">Owner</p>
                    <p className="text-white font-semibold">{item.owner}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400">Effort</p>
                    <p className="text-white font-semibold">{item.hours}</p>
                  </div>
                  <Badge className={
                    item.status === 'START NOW' ? 'bg-red-600 animate-pulse' :
                    item.status === 'DEPENDENT' ? 'bg-orange-600' :
                    item.status === 'GATE' ? 'bg-green-600' :
                    'bg-blue-600'
                  }>
                    {item.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sprint 11 Ready */}
        <Card className="bg-gradient-to-r from-purple-900 to-indigo-900 border-purple-600 border-2">
          <CardHeader>
            <CardTitle className="text-purple-100 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Sprint 11 - Ready to Launch 2026-03-10
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              <div className="p-4 bg-purple-950 rounded text-center border border-purple-700">
                <p className="text-4xl font-bold text-purple-300">16</p>
                <p className="text-purple-400 text-sm mt-2">Tasks</p>
              </div>
              <div className="p-4 bg-purple-950 rounded text-center border border-purple-700">
                <p className="text-4xl font-bold text-purple-300">4</p>
                <p className="text-purple-400 text-sm mt-2">Phases</p>
              </div>
              <div className="p-4 bg-purple-950 rounded text-center border border-purple-700">
                <p className="text-4xl font-bold text-purple-300">14</p>
                <p className="text-purple-400 text-sm mt-2">Days</p>
              </div>
              <div className="p-4 bg-purple-950 rounded text-center border border-purple-700">
                <p className="text-4xl font-bold text-purple-300">2</p>
                <p className="text-purple-400 text-sm mt-2">Critical</p>
              </div>
            </div>
            
            <div className="p-4 bg-purple-950 rounded border border-purple-600">
              <p className="text-white font-bold mb-3">Performance Optimization Focus:</p>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li>✓ Phase 1: Establish performance baseline (F1: 03-10→12)</li>
                <li>✓ Phase 2: Cache + Query optimization (F2: 03-12→18) - 40% speed target</li>
                <li>✓ Phase 3: API/Frontend optimization (F3: 03-18→22)</li>
                <li>✓ Phase 4: Load testing & validation (F4: 03-22→24) - 1000 users target</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Execution Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-slate-700 rounded">
                <p className="text-slate-400">Tasks Done</p>
                <p className="text-2xl font-bold text-green-400 mt-1">16 tasks</p>
              </div>
              <div className="p-3 bg-slate-700 rounded">
                <p className="text-slate-400">Completion Rate</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">73%</p>
              </div>
              <div className="p-3 bg-slate-700 rounded">
                <p className="text-slate-400">Hours Pending</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">19 hours</p>
              </div>
              <div className="p-3 bg-slate-700 rounded">
                <p className="text-slate-400">Production Uptime</p>
                <p className="text-2xl font-bold text-green-400 mt-1">99.98%</p>
              </div>
              <div className="p-3 bg-slate-700 rounded">
                <p className="text-slate-400">Error Rate</p>
                <p className="text-2xl font-bold text-green-400 mt-1">0.08%</p>
              </div>
              <div className="p-3 bg-red-900 rounded border border-red-700">
                <p className="text-red-400">Blockers</p>
                <p className="text-2xl font-bold text-red-300 mt-1">2 tasks</p>
              </div>
            </div>

            <div className="p-4 bg-green-900 rounded border border-green-700 mt-6">
              <p className="text-green-200 font-bold text-lg">✅ SPRINT PIPELINE 100% READY</p>
              <p className="text-green-300 text-sm mt-2">
                Sprint 10 execution on track. Sprint 11 roadmap fully planned and ready for launch on 2026-03-10.
                Critical path: Complete query optimization TODAY to maintain schedule.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}