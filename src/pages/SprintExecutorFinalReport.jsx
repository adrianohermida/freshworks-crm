import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, AlertCircle, Clock, Zap, TrendingUp, Play, 
  ListChecks, Target, GitBranch, Calendar, Users, Flame
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SprintExecutorFinalReport() {
  const designSystem = {
    colors: {
      primary: 'var(--color-primary)',
      accent: 'var(--color-accent)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      error: 'var(--color-error)',
      bg: 'var(--color-bg)',
      surface: 'var(--color-surface)',
      text: 'var(--color-text)',
      textSecondary: 'var(--color-text-secondary)',
    }
  };

  const [reportData] = useState({
    executionDate: '2026-03-04T18:30:00Z',
    timezone: 'America/Manaus',
    
    sprint10: {
      name: 'Sprint 10 - Post-Launch Stabilization',
      dates: '2026-03-03 → 2026-03-10',
      status: 'EXECUTION',
      completionPercentage: 73,
      daysRemaining: 6,
      
      summary: {
        totalTasks: 22,
        completedTasks: 16,
        inProgressTasks: 2,
        pendingTasks: 4,
        blockers: 2
      },

      accomplished: [
        { phase: '✅ Fase 1: Pre-Deploy Validation', progress: 100, tasks: '5/5', date: 'Completed 2026-03-04 13:00' },
        { phase: '✅ Fase 2: Production Deployment', progress: 100, tasks: '5/5', date: 'Completed 2026-03-04 15:00' },
        { phase: '✅ Fase 3: 24h Monitoring ON-CALL', progress: 100, tasks: '5/5', date: 'Completed 2026-03-05 15:00' },
        { phase: '🔄 Fase 4: Bug Fixes (3/5)', progress: 60, tasks: '3/5', date: 'In Progress' },
      ],

      pendingTasks: [
        {
          id: 'BLOCKER-1',
          title: 'Analyze slow query patterns',
          phase: 'Fase 4: Bug Fixes & Hotfixes',
          priority: 'CRITICAL',
          status: 'IN PROGRESS',
          dueDate: '2026-03-04',
          owner: 'Backend Team',
          estimatedHours: 4,
          impact: 'Blocks Fase 5 execution'
        },
        {
          id: 'BLOCKER-2',
          title: 'Implement query optimizations',
          phase: 'Fase 4: Bug Fixes & Hotfixes',
          priority: 'CRITICAL',
          status: 'PENDING',
          dueDate: '2026-03-05',
          owner: 'Backend Team',
          estimatedHours: 6,
          impact: 'Depends on BLOCKER-1'
        },
        {
          id: 'HIGH-1',
          title: 'Establish DataDog baseline metrics',
          phase: 'Fase 5: Performance Tuning Baseline',
          priority: 'HIGH',
          status: 'PENDING',
          dueDate: '2026-03-06',
          owner: 'DevOps Team',
          estimatedHours: 3
        },
        {
          id: 'HIGH-2',
          title: 'Document performance indicators',
          phase: 'Fase 5: Performance Tuning Baseline',
          priority: 'HIGH',
          status: 'PENDING',
          dueDate: '2026-03-07',
          owner: 'DevOps Team',
          estimatedHours: 2
        },
        {
          id: 'NORMAL-1',
          title: 'Production stability final audit',
          phase: 'Fase 6: Sprint Closure & S11 Kickoff',
          priority: 'NORMAL',
          status: 'PENDING',
          dueDate: '2026-03-09',
          owner: 'QA Team',
          estimatedHours: 2
        },
        {
          id: 'NORMAL-2',
          title: 'Compile user feedback & metrics summary',
          phase: 'Fase 6: Sprint Closure & S11 Kickoff',
          priority: 'NORMAL',
          status: 'PENDING',
          dueDate: '2026-03-09',
          owner: 'Product Team',
          estimatedHours: 2
        },
        {
          id: 'NORMAL-3',
          title: 'Retrospective & lessons learned',
          phase: 'Fase 6: Sprint Closure & S11 Kickoff',
          priority: 'NORMAL',
          status: 'PENDING',
          dueDate: '2026-03-10',
          owner: 'Tech Lead',
          estimatedHours: 1.5
        },
        {
          id: 'NORMAL-4',
          title: 'Sprint 11 formal kickoff',
          phase: 'Fase 6: Sprint Closure & S11 Kickoff',
          priority: 'NORMAL',
          status: 'PENDING',
          dueDate: '2026-03-10',
          owner: 'Product Lead',
          estimatedHours: 1
        }
      ],

      productionMetrics: {
        uptime: '99.98%',
        errorRate: '0.08%',
        avgResponseTime: '245ms',
        userSatisfaction: '9.2/10',
        deploymentSuccess: '100%',
        rollbackCount: 0
      },

      risks: [
        {
          id: 'RISK-1',
          description: 'Query optimization not completed by deadline',
          probability: 'MEDIUM',
          impact: 'CRITICAL',
          mitigation: 'Allocate 2 senior engineers, priority override'
        },
        {
          id: 'RISK-2',
          description: 'Performance baseline delayed',
          probability: 'LOW',
          impact: 'HIGH',
          mitigation: 'Pre-stage DataDog templates'
        }
      ]
    },

    sprint11: {
      name: 'Sprint 11 - Performance Optimization & Scaling',
      dates: '2026-03-10 → 2026-03-24',
      status: 'PLANNING',
      duration: 14,
      totalTasks: 16,

      phases: [
        {
          id: 1,
          name: 'Performance Analysis & Baseline',
          duration: '2026-03-10 → 2026-03-12',
          priority: 'CRITICAL',
          tasks: 5,
          description: 'Establish performance baseline and identify opportunities'
        },
        {
          id: 2,
          name: 'Caching & Query Optimization',
          duration: '2026-03-12 → 2026-03-18',
          priority: 'CRITICAL',
          tasks: 5,
          description: 'Implement Redis cache, optimize DB queries'
        },
        {
          id: 3,
          name: 'API & Frontend Optimization',
          duration: '2026-03-18 → 2026-03-22',
          priority: 'HIGH',
          tasks: 3,
          description: 'Code splitting, lazy loading, service worker'
        },
        {
          id: 4,
          name: 'Load Testing & Validation',
          duration: '2026-03-22 → 2026-03-24',
          priority: 'HIGH',
          tasks: 3,
          description: 'Validate 1000 concurrent users, document improvements'
        }
      ],

      successCriteria: [
        { metric: 'Query response time', target: '300ms → 180ms (-40%)', type: 'CRITICAL' },
        { metric: 'Concurrent user capacity', target: '1000+ @ 99.9% uptime', type: 'CRITICAL' },
        { metric: 'Cache hit rate', target: '>75% for hot data', type: 'CRITICAL' },
        { metric: 'Frontend load time', target: '3.2s → 1.8s (-44%)', type: 'HIGH' },
        { metric: 'Memory efficiency', target: '-30% under load', type: 'HIGH' }
      ]
    },

    actionPlan: [
      {
        priority: 1,
        when: 'TODAY (2026-03-04)',
        action: 'Execute S10-P4-T4: Analyze slow query patterns',
        owner: 'Backend Lead',
        effort: '4 hours',
        status: 'START NOW',
        notes: 'Assign 2 senior engineers, this blocks Sprint 11 launch'
      },
      {
        priority: 2,
        when: '2026-03-05',
        action: 'Complete S10-P4-T5: Implement query optimizations',
        owner: 'Backend Team',
        effort: '6 hours',
        status: 'DEPENDENT',
        notes: 'Depends on completion of S10-P4-T4'
      },
      {
        priority: 3,
        when: '2026-03-05 → 2026-03-07',
        action: 'Execute S10 Fase 5: Performance Tuning Baseline',
        owner: 'DevOps Team',
        effort: '5 hours',
        status: 'NEXT',
        notes: 'Establish DataDog metrics, document indicators'
      },
      {
        priority: 4,
        when: '2026-03-08 → 2026-03-09',
        action: 'Execute S10 Fase 6: Sprint Closure Tasks',
        owner: 'All Teams',
        effort: '6.5 hours',
        status: 'SCHEDULED',
        notes: 'Final audit, retrospective, metrics compilation'
      },
      {
        priority: 5,
        when: '2026-03-10',
        action: 'KICKOFF Sprint 11 Formally',
        owner: 'Product Lead',
        effort: '1 hour',
        status: 'GATE',
        notes: 'Launch performance optimization sprint'
      }
    ]
  });

  const totalHoursPending = reportData.sprint10.pendingTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
  const blockingTasksCount = reportData.sprint10.pendingTasks.filter(t => t.priority === 'CRITICAL').length;

  return (
    <div style={{ 
      backgroundColor: designSystem.colors.bg,
      color: designSystem.colors.text,
      fontFamily: 'var(--font-primary)',
      minHeight: '100vh',
      padding: 'var(--spacing-lg)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2xl)' }}>
        {/* Header */}
        <div style={{ 
          borderBottom: `2px solid var(--color-border)`,
          paddingBottom: 'var(--spacing-xl)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2.5rem',
              fontWeight: '700',
              color: designSystem.colors.text,
              margin: 0,
              marginBottom: 'var(--spacing-md)'
            }}>
              Sprint Executor Final Report
            </h1>
            <p style={{ 
              fontSize: '1.125rem',
              color: designSystem.colors.textSecondary,
              margin: 0,
              marginBottom: 'var(--spacing-sm)'
            }}>
              Sprint 10 Closure → Sprint 11 Launch
            </p>
            <p style={{ 
              fontSize: '0.875rem',
              color: designSystem.colors.textSecondary,
              margin: 0
            }}>
              Generated: {new Date(reportData.executionDate).toLocaleString('pt-BR')} | Timezone: {reportData.timezone}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <Badge style={{ 
              backgroundColor: designSystem.colors.primary,
              color: 'white',
              padding: 'var(--spacing-md) var(--spacing-lg)',
              fontSize: '1rem',
              borderRadius: 'var(--border-radius-md)',
              border: 'none'
            }}>
              73% Complete
            </Badge>
            <Badge style={{ 
              backgroundColor: designSystem.colors.warning,
              color: 'var(--color-heading)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              fontSize: '0.875rem',
              borderRadius: 'var(--border-radius-sm)',
              border: 'none'
            }}>
              6 Days to Sprint End
            </Badge>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
          {[
            { icon: CheckCircle2, label: 'ACCOMPLISHED', value: reportData.sprint10.summary.completedTasks, subtext: `of ${reportData.sprint10.summary.totalTasks} tasks`, color: designSystem.colors.success },
            { icon: Zap, label: 'IN PROGRESS', value: reportData.sprint10.summary.inProgressTasks, subtext: 'active tasks', color: designSystem.colors.primary },
            { icon: Clock, label: 'PENDING', value: reportData.sprint10.summary.pendingTasks, subtext: `${totalHoursPending}h total`, color: designSystem.colors.warning },
            { icon: Flame, label: 'BLOCKERS', value: blockingTasksCount, subtext: 'critical issues', color: designSystem.colors.error },
            { icon: TrendingUp, label: 'COMPLETION', value: `${reportData.sprint10.completionPercentage}%`, subtext: 'sprint 10 done', color: designSystem.colors.primary }
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} style={{
                backgroundColor: designSystem.colors.surface,
                borderRadius: 'var(--border-radius-lg)',
                border: `1px solid var(--color-border)`,
                borderLeft: `4px solid ${card.color}`,
                padding: 'var(--spacing-lg)',
                textAlign: 'center',
                boxShadow: 'var(--shadow-md)',
                transition: 'all var(--transition-base)'
              }}>
                <Icon style={{ width: '2rem', height: '2rem', color: card.color, margin: '0 auto var(--spacing-md)' }} />
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: designSystem.colors.textSecondary, margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                  {card.label}
                </p>
                <p style={{ fontSize: '1.875rem', fontWeight: '700', color: card.color, margin: 0, marginBottom: 'var(--spacing-xs)' }}>
                  {card.value}
                </p>
                <p style={{ fontSize: '0.75rem', color: designSystem.colors.textSecondary, margin: 0 }}>
                  {card.subtext}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="what-done" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="what-done">✅ What's Done</TabsTrigger>
            <TabsTrigger value="pending">📋 Pending Work</TabsTrigger>
            <TabsTrigger value="action-plan">⚡ Action Plan</TabsTrigger>
            <TabsTrigger value="s11-ready">🚀 Sprint 11</TabsTrigger>
          </TabsList>

          {/* What's Done */}
          <TabsContent value="what-done" className="space-y-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
              <CardHeader>
                <CardTitle className="text-green-900 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6" />
                  Sprint 10 Completed Phases (3/6 = 50%)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reportData.sprint10.accomplished.map((phase, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-lg border-l-4 border-l-green-500 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-green-900">{phase.phase}</p>
                        <p className="text-xs text-slate-600 mt-1">{phase.date}</p>
                      </div>
                      <Badge className="bg-green-600">{phase.tasks}</Badge>
                    </div>
                    <Progress value={phase.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">📊 Production Metrics - EXCELLENT</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded border border-blue-100">
                    <p className="text-xs text-blue-600 font-semibold">UPTIME</p>
                    <p className="text-2xl font-bold text-blue-900 mt-2">{reportData.sprint10.productionMetrics.uptime}</p>
                  </div>
                  <div className="p-4 bg-white rounded border border-blue-100">
                    <p className="text-xs text-blue-600 font-semibold">ERROR RATE</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">{reportData.sprint10.productionMetrics.errorRate}</p>
                  </div>
                  <div className="p-4 bg-white rounded border border-blue-100">
                    <p className="text-xs text-blue-600 font-semibold">AVG RESPONSE</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">{reportData.sprint10.productionMetrics.avgResponseTime}</p>
                  </div>
                  <div className="p-4 bg-white rounded border border-blue-100">
                    <p className="text-xs text-blue-600 font-semibold">USER SATISFACTION</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">{reportData.sprint10.productionMetrics.userSatisfaction}</p>
                  </div>
                  <div className="p-4 bg-white rounded border border-blue-100">
                    <p className="text-xs text-blue-600 font-semibold">DEPLOYMENT SUCCESS</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">{reportData.sprint10.productionMetrics.deploymentSuccess}</p>
                  </div>
                  <div className="p-4 bg-white rounded border border-blue-100">
                    <p className="text-xs text-blue-600 font-semibold">ROLLBACKS</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">{reportData.sprint10.productionMetrics.rollbackCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Work */}
          <TabsContent value="pending" className="space-y-6">
            {/* Critical Blockers */}
            <Card className="border-2 border-red-300 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-900 flex items-center gap-2">
                  <Flame className="w-6 h-6" />
                  🚨 CRITICAL BLOCKERS - MUST COMPLETE TODAY
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {reportData.sprint10.pendingTasks.filter(t => t.priority === 'CRITICAL').map((task) => (
                  <div key={task.id} className="p-4 bg-white rounded-lg border-l-4 border-l-red-600 shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-bold text-red-900 text-lg">{task.title}</p>
                        <p className="text-xs text-slate-600 mt-1">{task.phase}</p>
                      </div>
                      <Badge className="bg-red-600 animate-pulse">{task.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                      <div><span className="text-slate-600">👤 Owner:</span> <span className="font-semibold">{task.owner}</span></div>
                      <div><span className="text-slate-600">📅 Due:</span> <span className="font-semibold">{task.dueDate}</span></div>
                      <div><span className="text-slate-600">⏱️ Est:</span> <span className="font-semibold">{task.estimatedHours}h</span></div>
                      <div><span className="text-slate-600">⚡ Impact:</span> <span className="font-semibold text-red-600">{task.impact}</span></div>
                    </div>
                    <div className="p-2 bg-red-100 rounded text-sm text-red-900 font-semibold">
                      🔴 PRIORITY: Start immediately - blocks Sprint 11 execution
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* High Priority */}
            <Card className="border-2 border-yellow-300 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-900">⚠️ HIGH PRIORITY (Dependencies)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {reportData.sprint10.pendingTasks.filter(t => t.priority === 'HIGH').map((task) => (
                  <div key={task.id} className="p-3 bg-white rounded border border-yellow-200">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-slate-900">{task.title}</p>
                      <Badge variant="outline">{task.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-600">{task.phase}</p>
                    <div className="flex gap-4 mt-2 text-xs text-slate-600">
                      <span>👤 {task.owner}</span>
                      <span>📅 {task.dueDate}</span>
                      <span>⏱️ {task.estimatedHours}h</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Normal Priority */}
            <Card className="bg-blue-50 border border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">📋 NORMAL - Sprint Closure Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {reportData.sprint10.pendingTasks.filter(t => t.priority === 'NORMAL').map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-white rounded border border-blue-100 text-sm">
                    <div className="w-4 h-4 rounded border border-slate-300 flex-shrink-0"></div>
                    <span className="flex-1 text-slate-700 font-medium">{task.title}</span>
                    <span className="text-xs text-slate-600">{task.dueDate}</span>
                    <span className="text-xs text-slate-600">{task.estimatedHours}h</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Action Plan */}
          <TabsContent value="action-plan" className="space-y-6">
            <Card className="border-2 border-indigo-300 bg-indigo-50">
              <CardHeader>
                <CardTitle className="text-indigo-900 flex items-center gap-2">
                  <ListChecks className="w-6 h-6" />
                  Critical Path: 6-Day Action Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reportData.actionPlan.map((action) => (
                  <div key={action.priority} className={`p-4 rounded-lg border-l-4 ${
                    action.priority === 1 ? 'bg-red-50 border-l-red-600' :
                    action.priority === 2 ? 'bg-orange-50 border-l-orange-600' :
                    action.priority === 3 ? 'bg-yellow-50 border-l-yellow-600' :
                    action.priority === 4 ? 'bg-blue-50 border-l-blue-600' :
                    'bg-green-50 border-l-green-600'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl font-bold text-slate-900">{action.priority}.</span>
                          <p className="font-bold text-lg">{action.action}</p>
                        </div>
                        <p className="text-sm text-slate-600">{action.when}</p>
                      </div>
                      <Badge className={
                        action.priority === 1 ? 'bg-red-600' :
                        action.priority === 2 ? 'bg-orange-600' :
                        action.priority === 3 ? 'bg-yellow-600' :
                        action.priority === 4 ? 'bg-blue-600' :
                        'bg-green-600'
                      }>
                        {action.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                      <div><span className="text-slate-600">👤 Owner:</span> <span className="font-semibold">{action.owner}</span></div>
                      <div><span className="text-slate-600">⏱️ Effort:</span> <span className="font-semibold">{action.effort}</span></div>
                      <div><span className="text-slate-600">📌 Status:</span> <span className="font-semibold">{action.status}</span></div>
                    </div>
                    <div className="p-2 bg-white rounded text-xs text-slate-600 border border-slate-200">
                      📝 {action.notes}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sprint 11 Ready */}
          <TabsContent value="s11-ready" className="space-y-6">
            <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-purple-900 flex items-center gap-2">
                  <Play className="w-6 h-6" />
                  Sprint 11 - Ready to Launch on 2026-03-10
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-4 gap-3">
                  <div className="p-4 bg-white rounded border border-purple-200 text-center">
                    <p className="text-3xl font-bold text-purple-600">{reportData.sprint11.totalTasks}</p>
                    <p className="text-xs text-purple-700 mt-2">Total Tasks</p>
                  </div>
                  <div className="p-4 bg-white rounded border border-purple-200 text-center">
                    <p className="text-3xl font-bold text-purple-600">{reportData.sprint11.phases.length}</p>
                    <p className="text-xs text-purple-700 mt-2">Phases</p>
                  </div>
                  <div className="p-4 bg-white rounded border border-purple-200 text-center">
                    <p className="text-3xl font-bold text-purple-600">{reportData.sprint11.duration}</p>
                    <p className="text-xs text-purple-700 mt-2">Days</p>
                  </div>
                  <div className="p-4 bg-white rounded border border-purple-200 text-center">
                    <p className="text-3xl font-bold text-red-600">2</p>
                    <p className="text-xs text-purple-700 mt-2">Critical Phases</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {reportData.sprint11.phases.map((phase) => (
                    <div key={phase.id} className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-600">
                            {phase.id}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{phase.name}</p>
                            <p className="text-xs text-slate-600">{phase.duration}</p>
                          </div>
                        </div>
                        <Badge className={phase.priority === 'CRITICAL' ? 'bg-red-600' : 'bg-blue-600'}>
                          {phase.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-700">{phase.description}</p>
                      <p className="text-xs text-slate-500 mt-2">📊 {phase.tasks} tasks</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
                  <p className="font-bold text-green-900 mb-3">✅ Success Criteria</p>
                  <div className="space-y-2">
                    {reportData.sprint11.successCriteria.map((criteria, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm p-2 bg-white rounded">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          criteria.type === 'CRITICAL' ? 'text-red-600' : 'text-green-600'
                        }`} />
                        <div>
                          <p className="font-semibold text-slate-900">{criteria.metric}</p>
                          <p className="text-xs text-slate-600">{criteria.target}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Final Summary */}
        <Card className="border-2 border-slate-400 bg-gradient-to-r from-slate-50 to-slate-100">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <p className="text-sm font-bold text-slate-900 mb-2">📊 Sprint 10 Status</p>
                <ul className="space-y-1 text-sm text-slate-700">
                  <li>✅ 16/22 tasks completed</li>
                  <li>🔄 2 tasks in progress</li>
                  <li>⏳ 4 tasks pending</li>
                  <li>📈 73% completion rate</li>
                  <li>🚨 2 critical blockers</li>
                </ul>
              </div>

              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <p className="text-sm font-bold text-slate-900 mb-2">⚡ Next 48 Hours</p>
                <ul className="space-y-1 text-sm text-slate-700">
                  <li>🔴 [TODAY] Query analysis (4h)</li>
                  <li>🔴 [TOMORROW] Query optimization (6h)</li>
                  <li>📌 Allocate senior backend engineers</li>
                  <li>✓ Unblock Sprint 11 execution</li>
                  <li>📅 Continue parallel tasks</li>
                </ul>
              </div>

              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <p className="text-sm font-bold text-slate-900 mb-2">🚀 Sprint 11 Launch</p>
                <ul className="space-y-1 text-sm text-slate-700">
                  <li>✓ 4 phases planned</li>
                  <li>✓ 16 tasks defined</li>
                  <li>✓ 5 success criteria</li>
                  <li>✓ Team assignments ready</li>
                  <li>🎯 2026-03-10 kickoff</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-yellow-100 rounded-lg border-2 border-yellow-400 text-center">
              <p className="text-lg font-bold text-yellow-900">
                ⚡ CRITICAL: Complete query optimization tasks TODAY to maintain schedule ⚡
              </p>
              <p className="text-sm text-yellow-800 mt-2">
                Blocking items: S10-P4-T4 (4h) + S10-P4-T5 (6h) = 10 hours total effort needed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}