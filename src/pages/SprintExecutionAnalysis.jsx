import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Clock, Zap, TrendingUp, Bug, Target, Gauge } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SprintExecutionAnalysis() {
  const [analysisData] = useState({
    sprint10: {
      name: 'Sprint 10 - Post-Launch Stabilization',
      duration: '2026-03-03 → 2026-03-10',
      status: 'in_execution',
      completionPercentage: 73,
      
      completedWork: {
        phases: [
          { name: 'Fase 1: Pre-Deploy Validation', progress: 100, status: 'completed', tasks: 5 },
          { name: 'Fase 2: Production Deployment', progress: 100, status: 'completed', tasks: 5 },
          { name: 'Fase 3: 24h Monitoring ON-CALL', progress: 100, status: 'completed', tasks: 5 },
        ],
        summary: '15/22 tarefas críticas completadas',
        impact: 'Sistema produção ESTÁVEL - Zero downtime, Error rate < 0.1%'
      },

      pendingWork: {
        critical: [
          {
            id: 'S10-P4-T4',
            name: 'Analyze slow query patterns',
            phase: 'Fase 4: Bug Fixes & Hotfixes',
            status: 'in_progress',
            blocking: true,
            dueDate: '2026-03-04',
            impact: 'Bloqueia Fase 5 (Performance Tuning)',
            estimatedHours: 4,
            owner: 'Backend Team'
          },
          {
            id: 'S10-P4-T5',
            name: 'Implement query optimizations',
            phase: 'Fase 4: Bug Fixes & Hotfixes',
            status: 'pending',
            blocking: true,
            dueDate: '2026-03-05',
            impact: 'Depende de S10-P4-T4',
            estimatedHours: 6,
            owner: 'Backend Team'
          },
        ],
        high: [
          {
            id: 'S10-P5-T1',
            name: 'Establish DataDog baseline metrics',
            phase: 'Fase 5: Performance Tuning Baseline',
            status: 'pending',
            blocking: false,
            dueDate: '2026-03-06',
            estimatedHours: 3,
            owner: 'DevOps Team'
          },
          {
            id: 'S10-P5-T2',
            name: 'Document performance indicators',
            phase: 'Fase 5: Performance Tuning Baseline',
            status: 'pending',
            blocking: false,
            dueDate: '2026-03-07',
            estimatedHours: 2,
            owner: 'DevOps Team'
          },
        ],
        normal: [
          {
            id: 'S10-P6-T1',
            name: 'Production stability final audit',
            phase: 'Fase 6: Sprint Closure & S11 Kickoff',
            status: 'pending',
            blocking: false,
            dueDate: '2026-03-09',
            estimatedHours: 2,
            owner: 'QA Team'
          },
          {
            id: 'S10-P6-T2',
            name: 'Compile user feedback & metrics summary',
            phase: 'Fase 6: Sprint Closure & S11 Kickoff',
            status: 'pending',
            blocking: false,
            dueDate: '2026-03-09',
            estimatedHours: 2,
            owner: 'Product Team'
          },
          {
            id: 'S10-P6-T3',
            name: 'Retrospective & lessons learned',
            phase: 'Fase 6: Sprint Closure & S11 Kickoff',
            status: 'pending',
            blocking: false,
            dueDate: '2026-03-10',
            estimatedHours: 1.5,
            owner: 'Tech Lead'
          },
          {
            id: 'S10-P6-T4',
            name: 'Sprint 11 formal kickoff',
            phase: 'Fase 6: Sprint Closure & S11 Kickoff',
            status: 'pending',
            blocking: false,
            dueDate: '2026-03-10',
            estimatedHours: 1,
            owner: 'Product Lead'
          },
        ]
      },

      metrics: {
        production: {
          uptime: '99.98%',
          errorRate: '0.08%',
          avgResponseTime: '245ms',
          userSatisfaction: '9.2/10'
        },
        delivery: {
          totalTasks: 22,
          completedTasks: 15,
          inProgressTasks: 3,
          pendingTasks: 4,
          onTimeDelivery: '68%'
        }
      },

      riskAssessment: [
        {
          risk: 'Query optimization not completed by 2026-03-05',
          probability: 'MEDIUM',
          impact: 'CRITICAL',
          mitigation: 'Start now, allocate 2 senior backend engineers, priority override'
        },
        {
          risk: 'Performance baseline not established by 2026-03-07',
          probability: 'LOW',
          impact: 'HIGH',
          mitigation: 'Pre-stage DataDog configs, template dashboards ready'
        },
        {
          risk: 'Sprint 11 delayed due to S10 closure overhead',
          probability: 'LOW',
          impact: 'MEDIUM',
          mitigation: 'Sprint 11 ramp-up starts 2026-03-08, parallel execution'
        }
      ]
    },

    sprint11: {
      name: 'Sprint 11 - Performance Optimization & Scaling',
      duration: '2026-03-10 → 2026-03-24',
      status: 'planning',
      completionPercentage: 0,
      totalTasks: 16,
      
      phases: [
        {
          id: 1,
          name: 'Performance Analysis & Baseline',
          duration: '2026-03-10 → 2026-03-12',
          priority: 'CRITICAL',
          tasks: 5,
          goal: 'Establish performance baseline and identify optimization opportunities'
        },
        {
          id: 2,
          name: 'Caching & Query Optimization',
          duration: '2026-03-12 → 2026-03-18',
          priority: 'CRITICAL',
          tasks: 5,
          goal: 'Implement Redis cache, optimize DB queries, improve response times'
        },
        {
          id: 3,
          name: 'API & Frontend Optimization',
          duration: '2026-03-18 → 2026-03-22',
          priority: 'HIGH',
          tasks: 3,
          goal: 'Code splitting, lazy loading, service worker caching'
        },
        {
          id: 4,
          name: 'Load Testing & Validation',
          duration: '2026-03-22 → 2026-03-24',
          priority: 'HIGH',
          tasks: 3,
          goal: 'Validate 1000 concurrent users, auto-scaling, document improvements'
        }
      ],

      successCriteria: [
        { metric: 'Query response time', target: 'From 300ms to 180ms (-40%)', type: 'critical' },
        { metric: 'Cache hit rate', target: '>75% for hot data', type: 'critical' },
        { metric: 'Concurrent users', target: '1000+ users @ 99.9% uptime', type: 'high' },
        { metric: 'Frontend load time', target: 'From 3.2s to 1.8s (-44%)', type: 'high' },
        { metric: 'Memory efficiency', target: 'Reduce by 30% under load', type: 'medium' },
      ]
    }
  });

  const calculateTotalPending = () => {
    const critical = analysisData.sprint10.pendingWork.critical.length;
    const high = analysisData.sprint10.pendingWork.high.length;
    const normal = analysisData.sprint10.pendingWork.normal.length;
    return { critical, high, normal, total: critical + high + normal };
  };

  const totalPending = calculateTotalPending();
  const daysRemaining = 6; // 2026-03-10 - 2026-03-04

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">Sprint Execution Analysis</h1>
          <p className="text-lg text-slate-600">Comprehensive Status Review & Action Plan</p>
          <p className="text-sm text-slate-500">Generated: 2026-03-04 | Analysis Scope: S10 Closure + S11 Planning</p>
        </div>

        {/* Sprint 10 Overview */}
        <Tabs defaultValue="s10-status" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="s10-status">S10 Status</TabsTrigger>
            <TabsTrigger value="s10-pending">Pending Work</TabsTrigger>
            <TabsTrigger value="s10-risks">Risk Map</TabsTrigger>
            <TabsTrigger value="s11-plan">S11 Plan</TabsTrigger>
          </TabsList>

          {/* Sprint 10 Status */}
          <TabsContent value="s10-status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Sprint 10 Completion Overview</span>
                  <Badge className="bg-blue-600 text-lg px-4 py-2">
                    {analysisData.sprint10.completionPercentage}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-slate-900">Overall Progress</span>
                    <span className="text-sm text-slate-600">{analysisData.sprint10.completionPercentage}% - {daysRemaining} days remaining</span>
                  </div>
                  <Progress value={analysisData.sprint10.completionPercentage} className="h-4" />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <p className="text-xs text-green-700 font-semibold">COMPLETED</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">15/22</p>
                    <p className="text-xs text-green-600 mt-1">Tasks Done</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700 font-semibold">IN PROGRESS</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">3/22</p>
                    <p className="text-xs text-blue-600 mt-1">Tasks Active</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                    <p className="text-xs text-yellow-700 font-semibold">PENDING</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">4/22</p>
                    <p className="text-xs text-yellow-600 mt-1">Tasks Todo</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <p className="text-xs text-purple-700 font-semibold">BLOCKERS</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">2</p>
                    <p className="text-xs text-purple-600 mt-1">Critical</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm font-semibold text-slate-900 mb-3">✅ Completed Phases</p>
                    {analysisData.sprint10.completedWork.phases.map((phase, idx) => (
                      <div key={idx} className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-slate-700">{phase.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900 mb-3">📊 Production Metrics</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between"><span className="text-slate-600">Uptime:</span><span className="font-semibold text-green-600">{analysisData.sprint10.metrics.production.uptime}</span></div>
                      <div className="flex justify-between"><span className="text-slate-600">Error Rate:</span><span className="font-semibold text-green-600">{analysisData.sprint10.metrics.production.errorRate}</span></div>
                      <div className="flex justify-between"><span className="text-slate-600">Response Time:</span><span className="font-semibold text-slate-900">{analysisData.sprint10.metrics.production.avgResponseTime}</span></div>
                      <div className="flex justify-between"><span className="text-slate-600">User Satisfaction:</span><span className="font-semibold text-blue-600">{analysisData.sprint10.metrics.production.userSatisfaction}</span></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Work */}
          <TabsContent value="s10-pending" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-red-500 bg-red-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="text-sm text-red-700 font-semibold">CRITICAL BLOCKERS</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{totalPending.critical}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-sm text-yellow-700 font-semibold">HIGH PRIORITY</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">{totalPending.high}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-blue-500 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-blue-700 font-semibold">NORMAL</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{totalPending.normal}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Critical Blockers */}
            <Card className="border-2 border-red-300 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  🚨 CRITICAL BLOCKERS - Unblock Sprint 11
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysisData.sprint10.pendingWork.critical.map((task) => (
                  <div key={task.id} className="p-4 bg-white rounded-lg border-l-4 border-l-red-500">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-red-900">{task.name}</p>
                        <p className="text-xs text-slate-600 mt-1">{task.phase}</p>
                      </div>
                      <Badge className="bg-red-600">BLOCKER</Badge>
                    </div>
                    <p className="text-sm text-red-700 mb-2">⚡ {task.impact}</p>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>📅 Due: {task.dueDate}</span>
                      <span>⏱️ Est: {task.estimatedHours}h</span>
                      <span>👤 {task.owner}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* High Priority */}
            <Card className="border-2 border-yellow-300 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-900">⚠️ HIGH PRIORITY - Dependencies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysisData.sprint10.pendingWork.high.map((task) => (
                  <div key={task.id} className="p-3 bg-white rounded border border-yellow-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{task.name}</p>
                        <p className="text-xs text-slate-600 mt-1">{task.phase}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">HIGH</Badge>
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-slate-600">
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
                {analysisData.sprint10.pendingWork.normal.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-2 bg-white rounded text-sm">
                    <div className="w-4 h-4 rounded border border-slate-300"></div>
                    <span className="flex-1 text-slate-700">{task.name}</span>
                    <span className="text-xs text-slate-600">{task.dueDate}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Assessment */}
          <TabsContent value="s10-risks" className="space-y-6">
            {analysisData.sprint10.riskAssessment.map((risk, idx) => (
              <Card key={idx} className={`border-l-4 ${
                risk.probability === 'CRITICAL' ? 'border-l-red-500 bg-red-50' :
                risk.probability === 'HIGH' || risk.probability === 'MEDIUM' ? 'border-l-yellow-500 bg-yellow-50' :
                'border-l-blue-500 bg-blue-50'
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{risk.risk}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={risk.probability === 'CRITICAL' ? 'default' : 'outline'}>
                        {risk.probability}
                      </Badge>
                      <Badge variant={risk.impact === 'CRITICAL' ? 'default' : 'outline'} className="bg-orange-600">
                        {risk.impact}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Mitigation:</span> {risk.mitigation}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Sprint 11 Plan */}
          <TabsContent value="s11-plan" className="space-y-6">
            <Card className="border-2 border-purple-300 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-900 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Sprint 11 - Performance Optimization & Scaling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-white rounded border border-purple-200 text-center">
                    <p className="text-2xl font-bold text-purple-600">16</p>
                    <p className="text-xs text-purple-700">Total Tasks</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-purple-200 text-center">
                    <p className="text-2xl font-bold text-purple-600">4</p>
                    <p className="text-xs text-purple-700">Phases</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-purple-200 text-center">
                    <p className="text-2xl font-bold text-purple-600">14</p>
                    <p className="text-xs text-purple-700">Days</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-purple-200 text-center">
                    <p className="text-2xl font-bold text-purple-600">2</p>
                    <p className="text-xs text-purple-700">Critical</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {analysisData.sprint11.phases.map((phase) => (
                    <div key={phase.id} className="p-4 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-600">
                            F{phase.id}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{phase.name}</p>
                            <p className="text-xs text-slate-600">{phase.duration}</p>
                          </div>
                        </div>
                        <Badge variant={phase.priority === 'CRITICAL' ? 'default' : 'outline'} className="bg-red-600">
                          {phase.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-700">{phase.goal}</p>
                      <p className="text-xs text-slate-500 mt-2">📊 {phase.tasks} tasks</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
                  <p className="font-semibold text-green-900 mb-3">✅ Success Criteria</p>
                  <div className="space-y-2">
                    {analysisData.sprint11.successCriteria.map((criteria, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <span className={`font-semibold ${
                          criteria.type === 'critical' ? 'text-red-600' :
                          criteria.type === 'high' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`}>
                          {criteria.type.toUpperCase()}
                        </span>
                        <div>
                          <p className="font-medium text-slate-900">{criteria.metric}</p>
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

        {/* Executive Summary */}
        <Card className="border-2 border-indigo-300 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-indigo-900">📋 Executive Summary & Action Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border border-indigo-200">
                <p className="font-bold text-slate-900 mb-2">🎯 Sprint 10 Status</p>
                <ul className="space-y-1 text-sm text-slate-700">
                  <li>✅ 15/22 tasks completed (68%)</li>
                  <li>🔴 2 critical blockers identified</li>
                  <li>📊 Production STABLE (99.98% uptime)</li>
                  <li>⏰ 6 days to complete S10 closure</li>
                </ul>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="font-bold text-slate-900 mb-2">🚀 Immediate Actions (TODAY)</p>
                <ul className="space-y-1 text-sm text-slate-700">
                  <li>1️⃣ START: Analyze slow query patterns (4h)</li>
                  <li>2️⃣ ASSIGN: 2 senior backend engineers</li>
                  <li>3️⃣ TARGET: Complete by EOD 2026-03-04</li>
                  <li>4️⃣ GATE: Unblocks Fase 5 execution</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-indigo-100 rounded-lg border border-indigo-300">
              <p className="font-bold text-indigo-900 mb-2">📅 Critical Timeline</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="p-3 bg-white rounded border-l-4 border-l-red-500">
                  <p className="font-semibold">TODAY (2026-03-04)</p>
                  <p className="text-xs text-slate-600 mt-1">Complete query analysis</p>
                </div>
                <div className="p-3 bg-white rounded border-l-4 border-l-yellow-500">
                  <p className="font-semibold">2026-03-05 to 07</p>
                  <p className="text-xs text-slate-600 mt-1">Fase 5: Establish baseline</p>
                </div>
                <div className="p-3 bg-white rounded border-l-4 border-l-green-500">
                  <p className="font-semibold">2026-03-10</p>
                  <p className="text-xs text-slate-600 mt-1">S10 Closure + S11 Kickoff</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-100 rounded-lg border border-green-300">
              <p className="font-bold text-green-900 mb-2">✨ Sprint 11 Ready to Launch</p>
              <p className="text-sm text-green-800">
                Performance Optimization roadmap COMPLETE. 4 phases planned, 16 tasks defined, success criteria established. 
                Expected outcome: 40% query improvement, 1000+ concurrent users support, production-ready performance baseline.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}