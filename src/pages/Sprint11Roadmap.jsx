import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Sprint11Roadmap() {
  const [sprint11] = useState({
    name: 'Sprint 11 - Performance Optimization & Scaling',
    startDate: '2026-03-10',
    endDate: '2026-03-24',
    status: 'planning',
    overallGoal: 'Optimize system performance, implement caching strategies, prepare for production scale',
    phases: [
      {
        id: 1,
        name: 'Fase 1: Performance Analysis & Baseline',
        duration: '2026-03-10 → 2026-03-12',
        priority: 'critical',
        tasks: [
          { name: 'Aggregate DataDog metrics from S10', status: 'pending', owner: 'DevOps' },
          { name: 'Create performance baseline dashboard', status: 'pending', owner: 'DevOps' },
          { name: 'Identify top N slowest queries', status: 'pending', owner: 'Backend' },
          { name: 'Profile memory and CPU usage patterns', status: 'pending', owner: 'Backend' },
          { name: 'Document current SLAs vs actual metrics', status: 'pending', owner: 'QA' },
        ]
      },
      {
        id: 2,
        name: 'Fase 2: Caching & Query Optimization',
        duration: '2026-03-12 → 2026-03-18',
        priority: 'critical',
        tasks: [
          { name: 'Implement Redis cache layer', status: 'pending', owner: 'Backend' },
          { name: 'Optimize top 10 slow database queries', status: 'pending', owner: 'Backend' },
          { name: 'Add database indexes for common filters', status: 'pending', owner: 'Backend' },
          { name: 'Cache warming strategy for hot data', status: 'pending', owner: 'Backend' },
          { name: 'Test cache invalidation scenarios', status: 'pending', owner: 'QA' },
        ]
      },
      {
        id: 3,
        name: 'Fase 3: API & Frontend Optimization',
        duration: '2026-03-18 → 2026-03-22',
        priority: 'high',
        tasks: [
          { name: 'Implement pagination & lazy loading', status: 'pending', owner: 'Frontend' },
          { name: 'Code splitting & async chunks', status: 'pending', owner: 'Frontend' },
          { name: 'Service Worker caching strategy', status: 'pending', owner: 'Frontend' },
          { name: 'Image optimization & CDN setup', status: 'pending', owner: 'DevOps' },
          { name: 'GraphQL/REST API batching', status: 'pending', owner: 'Backend' },
        ]
      },
      {
        id: 4,
        name: 'Fase 4: Load Testing & Scaling Validation',
        duration: '2026-03-22 → 2026-03-24',
        priority: 'high',
        tasks: [
          { name: 'Run load testing (1000 concurrent users)', status: 'pending', owner: 'QA' },
          { name: 'Validate auto-scaling triggers', status: 'pending', owner: 'DevOps' },
          { name: 'Test failure scenarios & recovery', status: 'pending', owner: 'QA' },
          { name: 'Document performance improvements', status: 'pending', owner: 'DevOps' },
          { name: 'Sprint 12 planning', status: 'pending', owner: 'Team Lead' },
        ]
      }
    ]
  });

  const totalTasks = sprint11.phases.reduce((sum, p) => sum + p.tasks.length, 0);
  const criticalPhases = sprint11.phases.filter(p => p.priority === 'critical').length;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Sprint 11 Roadmap</h1>
            <p className="text-slate-600 mt-1">{sprint11.startDate} → {sprint11.endDate}</p>
            <p className="text-sm text-slate-500 mt-2">{sprint11.overallGoal}</p>
          </div>
          <Badge className="text-lg px-4 py-2 bg-purple-600">Planning Mode</Badge>
        </div>

        {/* Sprint Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-slate-600 text-sm">Total Tasks</p>
                <p className="text-3xl font-bold text-slate-900">{totalTasks}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-slate-600 text-sm">Phases</p>
                <p className="text-3xl font-bold text-slate-900">{sprint11.phases.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-slate-600 text-sm">Duration</p>
                <p className="text-3xl font-bold text-slate-900">14 days</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-slate-600 text-sm">Critical</p>
                <p className="text-3xl font-bold text-red-600">{criticalPhases}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Phase Details */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Phases</TabsTrigger>
            <TabsTrigger value="phase1">Phase 1</TabsTrigger>
            <TabsTrigger value="phase2">Phase 2</TabsTrigger>
            <TabsTrigger value="phase3">Phase 3</TabsTrigger>
            <TabsTrigger value="phase4">Phase 4</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {sprint11.phases.map((phase) => (
              <Card key={phase.id} className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-900">
                        {phase.id}
                      </span>
                      <div>
                        <CardTitle className="text-base">{phase.name}</CardTitle>
                        <p className="text-xs text-slate-600 mt-1">{phase.duration}</p>
                      </div>
                    </div>
                    <Badge variant={phase.priority === 'critical' ? 'default' : 'outline'} className="bg-red-600">
                      {phase.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {phase.tasks.map((task, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded border border-slate-200">
                        <div className="w-4 h-4 rounded border border-slate-300"></div>
                        <span className="flex-1 text-sm text-slate-700">{task.name}</span>
                        <Badge variant="outline" className="text-xs">{task.owner}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {sprint11.phases.map((phase) => (
            <TabsContent key={`tab-${phase.id}`} value={`phase${phase.id}`}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {phase.id === 1 && <Target className="w-5 h-5" />}
                    {phase.id === 2 && <TrendingUp className="w-5 h-5" />}
                    {phase.id === 3 && <Zap className="w-5 h-5" />}
                    {phase.id === 4 && <CheckCircle2 className="w-5 h-5" />}
                    {phase.name}
                  </CardTitle>
                  <p className="text-sm text-slate-600 mt-2">{phase.duration}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {phase.tasks.map((task, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-slate-900">{task.name}</p>
                        <Badge variant="outline">{task.owner}</Badge>
                      </div>
                      <p className="text-xs text-slate-600 mt-2">Status: Pending</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Success Criteria */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">Success Criteria for Sprint 11</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Performance Baseline Established</p>
                <p className="text-sm text-green-700">All metrics documented in DataDog dashboard</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Query Performance ↓ 40%</p>
                <p className="text-sm text-green-700">Average response time from 300ms to 180ms</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Handle 1000+ Concurrent Users</p>
                <p className="text-sm text-green-700">Load test validation with 99.9% uptime</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Zero Performance Regressions</p>
                <p className="text-sm text-green-700">Metrics maintained or improved from S10</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}