import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, AlertCircle, Target, Zap, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';

export default function SprintTracker() {
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSprints = async () => {
      try {
        const result = await base44.functions.invoke('sprintTracker', {
          action: 'get_completion_stats'
        });
        setSprints(result.data.stats || []);
      } catch (error) {
        console.error('Erro ao carregar sprints:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSprints();
  }, []);

  const [sprint9] = useState({
    name: 'Sprint 9 - Security & RLS',
    status: 'completed',
    progress: 100,
    endDate: '2026-03-03',
    tasks: [
      { id: 1, name: 'enforceRLS.js - RLS enforcement', status: 'completed', priority: 'critical' },
      { id: 2, name: 'AuditLog entity - Compliance logging', status: 'completed', priority: 'critical' },
      { id: 3, name: 'AuditLogs component - Admin visualization', status: 'completed', priority: 'high' },
      { id: 4, name: 'testMultitenantSecurity.js - Security tests', status: 'completed', priority: 'high' },
      { id: 5, name: 'Security documentation - Enterprise-grade', status: 'completed', priority: 'high' },
      { id: 6, name: 'Deployment checklist - Production ready', status: 'completed', priority: 'high' },
      { id: 7, name: 'Final sprint report - Sign-off done', status: 'completed', priority: 'medium' },
    ]
  });

  const [sprint10] = useState({
    name: 'Sprint 10 - Post-Launch (FASES 1-4 ACTIVE)',
    status: 'active',
    progress: 73,
    endDate: '2026-03-10',
    phases: [
      {
        phase: 'Fase 1: Pre-Deploy ✅',
        duration: '2026-03-03 → 2026-03-04 13:00',
        progress: 100,
        tasks: [
          { id: 1, name: 'Final staging validation', status: 'completed', priority: 'critical' },
          { id: 2, name: 'Security final check (RLS audit)', status: 'completed', priority: 'critical' },
          { id: 3, name: 'Database backup test', status: 'completed', priority: 'high' },
          { id: 4, name: 'Team briefing', status: 'completed', priority: 'high' },
          { id: 5, name: 'Go/No-Go decision', status: 'completed', priority: 'critical' },
        ]
      },
      {
        phase: 'Fase 2: Deployment ✅',
        duration: '2026-03-04 14:00-15:00 UTC-4',
        progress: 100,
        tasks: [
          { id: 1, name: 'Deploy code production', status: 'completed', priority: 'critical' },
          { id: 2, name: 'Run database migrations', status: 'completed', priority: 'critical' },
          { id: 3, name: 'Execute smoke tests', status: 'completed', priority: 'critical' },
          { id: 4, name: 'Monitor health checks', status: 'completed', priority: 'critical' },
          { id: 5, name: 'Enable production alerts', status: 'completed', priority: 'high' },
        ]
      },
      {
        phase: 'Fase 3: 24h Monitoring ON-CALL ✅',
        duration: '2026-03-04 15:00 → 2026-03-05 15:00',
        progress: 100,
        tasks: [
          { id: 1, name: 'Monitor error rate < 0.1%', status: 'completed', priority: 'critical' },
          { id: 2, name: 'Monitor response time < 300ms avg', status: 'completed', priority: 'critical' },
          { id: 3, name: 'Verify RLS enforcement (audit logs)', status: 'completed', priority: 'high' },
          { id: 4, name: 'Collect & triage user feedback', status: 'completed', priority: 'high' },
          { id: 5, name: 'Daily standup + log review', status: 'completed', priority: 'high' },
        ]
      },
      {
        phase: 'Fase 4: Bug Fixes & Hotfixes 🔄',
        duration: '2026-03-05 → 2026-03-07',
        progress: 65,
        tasks: [
          { id: 1, name: 'Triage post-deploy issues', status: 'completed', priority: 'high' },
          { id: 2, name: 'Fix critical bugs (P1 only)', status: 'completed', priority: 'critical' },
          { id: 3, name: 'Deploy hotfixes with monitoring', status: 'completed', priority: 'high' },
          { id: 4, name: 'Analyze slow query patterns', status: 'in_progress', priority: 'medium' },
        ]
      },
      {
        phase: 'Fase 5: Performance Tuning (Prep for S11)',
        duration: '2026-03-07 → 2026-03-09',
        progress: 0,
        tasks: [
          { id: 1, name: 'Establish performance baseline (DataDog)', status: 'pending', priority: 'high' },
          { id: 2, name: 'Identify optimization opportunities', status: 'pending', priority: 'medium' },
          { id: 3, name: 'Cache strategy analysis', status: 'pending', priority: 'medium' },
          { id: 4, name: 'Prepare Sprint 11 kickoff deck', status: 'pending', priority: 'medium' },
        ]
      },
      {
        phase: 'Fase 6: Sprint Closure & S11 Kickoff',
        duration: '2026-03-09 → 2026-03-10',
        progress: 0,
        tasks: [
          { id: 1, name: 'Production stability audit', status: 'pending', priority: 'high' },
          { id: 2, name: 'User feedback & metrics summary', status: 'pending', priority: 'high' },
          { id: 3, name: 'Retrospective & lessons learned', status: 'pending', priority: 'medium' },
          { id: 4, name: 'Sprint 11 formal kickoff', status: 'pending', priority: 'high' },
        ]
      }
    ]
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'active': return <Zap className="w-4 h-4 text-blue-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      case 'blocked': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-50';
      case 'active': return 'bg-blue-50';
      case 'pending': return 'bg-gray-50';
      case 'blocked': return 'bg-red-50';
      default: return 'bg-white';
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-600">Carregando dados de sprints...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Sprint Tracker</h1>
          <Badge className="text-lg px-4 py-2">
            {sprints.length > 0 ? `${sprints[sprints.length - 1]?.completion || 0}% Completo` : 'Carregando...'}
          </Badge>
        </div>

        <Tabs defaultValue="sprint9" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="control" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Control Center
            </TabsTrigger>
            <TabsTrigger value="sprint9" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Sprint 9 (Done)
            </TabsTrigger>
            <TabsTrigger value="sprint10" className="gap-2">
              <Zap className="w-4 h-4" />
              Sprint 10 (Active)
            </TabsTrigger>
            <TabsTrigger value="sprint11" className="gap-2">
              <Target className="w-4 h-4" />
              Sprint 11 (Ready)
            </TabsTrigger>
          </TabsList>

          {/* SPRINT 9 */}
          {/* CONTROL CENTER */}
          <TabsContent value="control">
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 text-center">
              <p className="font-semibold text-blue-900 dark:text-blue-100">
                🎯 Sprint Execution Control Center
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-200 mt-2">
                Navigate to the full execution control dashboard for complete overview
              </p>
              <Link 
                to={createPageUrl('SprintExecutionControl')}
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded font-semibold text-sm hover:bg-blue-700"
              >
                → Open Control Center
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="sprint9" className="space-y-4">
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-green-900">{sprint9.name}</CardTitle>
                    <p className="text-sm text-green-700 mt-1">Completed: {sprint9.endDate}</p>
                  </div>
                  <Badge className="bg-green-600">100% Complete</Badge>
                </div>
                <Progress value={100} className="mt-4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sprint9.tasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-white rounded border border-green-100">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(task.status)}
                        <span className="text-sm font-medium">{task.name}</span>
                      </div>
                      <Badge className={getPriorityBadge(task.priority)}>{task.priority}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SPRINT 10 */}
          <TabsContent value="sprint10" className="space-y-6">
            {/* STATUS ALERT - DEPLOYMENT TOMORROW */}
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg p-4">
              <p className="text-sm font-bold text-red-900 dark:text-red-100">
                🚨 CRITICAL: Production Deployment Tomorrow (2026-03-04) 14:00-15:00 UTC-4
              </p>
              <p className="text-xs text-red-800 dark:text-red-200 mt-1">
                Fase 1 Pre-Deploy validation must complete by 13:00 for Go/No-Go decision
              </p>
            </div>

            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-blue-900 dark:text-blue-100">{sprint10.name}</CardTitle>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Target: {sprint10.endDate}</p>
                  </div>
                  <Badge className="bg-blue-600">{sprint10.progress}% Complete</Badge>
                </div>
                <Progress value={sprint10.progress} className="mt-4" />
              </CardHeader>
            </Card>

            {/* FASES */}
            <div className="space-y-4">
              {sprint10.phases.map((faseObj, idx) => (
                <Card key={idx} className={getStatusColor(faseObj.progress === 0 ? 'pending' : faseObj.progress === 100 ? 'completed' : 'active')}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold">
                            {idx + 1}
                          </span>
                          {faseObj.phase}
                        </CardTitle>
                        <p className="text-xs text-gray-600 mt-1">{faseObj.duration}</p>
                      </div>
                      <Badge>{faseObj.progress}%</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {faseObj.tasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-2 bg-white rounded text-sm">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(task.status)}
                          <span>{task.name}</span>
                        </div>
                        <Badge variant="outline" className={getPriorityBadge(task.priority)}>{task.priority}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* SUMMARY */}
            <Card className="border-2 border-blue-400">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Next Immediate Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-3 bg-red-50 rounded border border-red-200">
                  <p className="text-sm font-semibold text-red-900">🚀 Tomorrow (2026-03-04) - 07:00</p>
                  <p className="text-xs text-red-700 mt-1">Fase 1: Pre-Deploy validation starts</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                  <p className="text-sm font-semibold text-yellow-900">⚡ Tomorrow (2026-03-04) - 14:00</p>
                  <p className="text-xs text-yellow-700 mt-1">PRODUCTION DEPLOYMENT (1h window - Critical)</p>
                </div>
                <div className="p-3 bg-green-50 rounded border border-green-200">
                  <p className="text-sm font-semibold text-green-900">📊 Post-Deploy</p>
                  <p className="text-xs text-green-700 mt-1">24/7 On-call monitoring + error tracking</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* COMPLETION CHART - DADOS REAIS */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Project Completion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sprints.map((sprint, idx) => (
              <div key={sprint.sprint_id || idx}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{sprint.name}</span>
                  <span className="text-sm font-bold">
                    {sprint.tasks_completed}/{sprint.tasks_total} ({sprint.completion}%)
                  </span>
                </div>
                <Progress value={sprint.completion} className="h-2" />
              </div>
            ))}
            {sprints.length === 0 && (
              <p className="text-sm text-gray-500">Nenhum sprint encontrado</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}