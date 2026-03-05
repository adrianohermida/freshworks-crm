import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2, Clock, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PreDeploymentChecklist() {
  const [checklist, setChecklist] = useState({
    fase1: [
      { id: 1, name: 'Final staging validation', done: false, priority: 'critical', timeEst: '2h' },
      { id: 2, name: 'Security final check (RLS audit)', done: false, priority: 'critical', timeEst: '1.5h' },
      { id: 3, name: 'Database backup test', done: false, priority: 'high', timeEst: '1h' },
      { id: 4, name: 'Team briefing & sync', done: false, priority: 'high', timeEst: '30m' },
      { id: 5, name: 'Go/No-Go decision', done: false, priority: 'critical', timeEst: '15m' }
    ],
    fase2: [
      { id: 1, name: 'Deploy code to production', done: false, priority: 'critical', timeEst: '10m' },
      { id: 2, name: 'Run database migrations', done: false, priority: 'critical', timeEst: '5m' },
      { id: 3, name: 'Execute smoke tests', done: false, priority: 'critical', timeEst: '10m' },
      { id: 4, name: 'Monitor health checks', done: false, priority: 'critical', timeEst: '10m' },
      { id: 5, name: 'Enable production alerts', done: false, priority: 'high', timeEst: '5m' }
    ],
    fase3: [
      { id: 1, name: 'Monitor error rate < 0.1%', done: false, priority: 'critical', timeEst: '24h' },
      { id: 2, name: 'Monitor response time < 300ms', done: false, priority: 'critical', timeEst: '24h' },
      { id: 3, name: 'Monitor RLS enforcement (audit logs)', done: false, priority: 'high', timeEst: '24h' },
      { id: 4, name: 'Collect user feedback', done: false, priority: 'high', timeEst: '24h' },
      { id: 5, name: 'Review logs for anomalies', done: false, priority: 'high', timeEst: '8h' }
    ]
  });

  const toggleTask = (fase, id) => {
    setChecklist(prev => ({
      ...prev,
      [fase]: prev[fase].map(t => t.id === id ? { ...t, done: !t.done } : t)
    }));
  };

  const calculateProgress = (fase) => {
    const tasks = checklist[fase];
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter(t => t.done).length / tasks.length) * 100);
  };

  const allProgress = Math.round(
    (Object.values(checklist).flat().filter(t => t.done).length / Object.values(checklist).flat().length) * 100
  );

  const PriorityBadge = ({ priority }) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800'
    };
    return <Badge className={colors[priority]}>{priority}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              🚀 Sprint 10 - Pre-Deployment Checklist
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Deployment Schedule: Tomorrow (2026-03-04) 14:00-15:00 UTC-4
            </p>
          </div>
          <Badge className="bg-red-600 px-4 py-2 text-lg">CRITICAL</Badge>
        </div>

        {/* OVERALL PROGRESS */}
        <Card className="p-6 dark:bg-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Overall Readiness</p>
              <p className="text-3xl font-bold text-cyan-600 mt-1">{allProgress}%</p>
            </div>
            {allProgress === 100 && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-semibold">READY FOR DEPLOYMENT</span>
              </div>
            )}
          </div>
          <Progress value={allProgress} className="h-3" />
        </Card>

        {/* TIMELINE WARNING */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-900 dark:text-yellow-100">
              ⏰ Deployment Window: 14:00-15:00 UTC-4 (1 hour only)
            </p>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
              All Fase 1 tasks must be completed by 13:00. No exceptions for critical deployment.
            </p>
          </div>
        </div>

        {/* TABS */}
        <Tabs defaultValue="fase1" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fase1" className="gap-2">
              <Clock className="w-4 h-4" />
              <span>Fase 1: Pre-Deploy</span>
              <Badge variant="outline">{calculateProgress('fase1')}%</Badge>
            </TabsTrigger>
            <TabsTrigger value="fase2" className="gap-2">
              <Zap className="w-4 h-4" />
              <span>Fase 2: Deploy</span>
              <Badge variant="outline">{calculateProgress('fase2')}%</Badge>
            </TabsTrigger>
            <TabsTrigger value="fase3" className="gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>Fase 3: Monitor</span>
              <Badge variant="outline">{calculateProgress('fase3')}%</Badge>
            </TabsTrigger>
          </TabsList>

          {/* FASE 1 */}
          <TabsContent value="fase1" className="space-y-4 mt-4">
            <Card className="p-4 dark:bg-gray-800 bg-red-50">
              <p className="text-sm font-semibold text-red-900 dark:text-red-100 mb-3">
                ⏰ Fase 1: Pre-Deploy Validation (Today until 13:00)
              </p>
              <div className="space-y-2">
                {checklist.fase1.map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded border border-red-200 dark:border-red-800">
                    <Checkbox
                      checked={task.done}
                      onCheckedChange={() => toggleTask('fase1', task.id)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${task.done ? 'line-through text-gray-500' : ''}`}>
                        {task.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Est. time: {task.timeEst}</p>
                    </div>
                    <PriorityBadge priority={task.priority} />
                  </div>
                ))}
              </div>
            </Card>

            {calculateProgress('fase1') === 100 && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Fase 1 Complete - Ready for Deployment
                </p>
              </div>
            )}
          </TabsContent>

          {/* FASE 2 */}
          <TabsContent value="fase2" className="space-y-4 mt-4">
            <Card className="p-4 dark:bg-gray-800 bg-yellow-50">
              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
                ⚡ Fase 2: Deployment Window (2026-03-04 14:00-15:00 UTC-4)
              </p>
              <div className="space-y-2">
                {checklist.fase2.map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded border border-yellow-200 dark:border-yellow-800">
                    <Checkbox
                      checked={task.done}
                      onCheckedChange={() => toggleTask('fase2', task.id)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${task.done ? 'line-through text-gray-500' : ''}`}>
                        {task.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Est. time: {task.timeEst}</p>
                    </div>
                    <PriorityBadge priority={task.priority} />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* FASE 3 */}
          <TabsContent value="fase3" className="space-y-4 mt-4">
            <Card className="p-4 dark:bg-gray-800 bg-blue-50">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">
                📊 Fase 3: 24h Monitoring & On-Call (2026-03-04 → 2026-03-05)
              </p>
              <div className="space-y-2">
                {checklist.fase3.map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded border border-blue-200 dark:border-blue-800">
                    <Checkbox
                      checked={task.done}
                      onCheckedChange={() => toggleTask('fase3', task.id)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${task.done ? 'line-through text-gray-500' : ''}`}>
                        {task.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Duration: {task.timeEst}</p>
                    </div>
                    <PriorityBadge priority={task.priority} />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* KEY CONTACTS */}
        <Card className="p-6 dark:bg-gray-800 border-l-4 border-l-cyan-500">
          <h3 className="font-bold text-lg mb-4">📞 On-Call Contacts (24h Monitoring)</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Primary On-Call</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Tech Lead - Available 24/7</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Slack: @oncall-primary</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Secondary On-Call</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">DevOps Lead - Backup support</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Slack: @oncall-secondary</p>
            </div>
          </div>
        </Card>

        {/* ROLLBACK PLAN */}
        <Card className="p-6 dark:bg-gray-800 border-l-4 border-l-red-500">
          <h3 className="font-bold text-lg mb-4">🔄 Rollback Plan (If needed)</h3>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded border border-red-200 dark:border-red-800 text-sm space-y-2">
            <p><span className="font-semibold">Trigger:</span> Error rate &gt; 5% OR Response time &gt; 1s</p>
            <p><span className="font-semibold">Action:</span> Rollback to previous version (v2.0.0)</p>
            <p><span className="font-semibold">Time to Rollback:</span> &lt; 5 minutes</p>
            <p><span className="font-semibold">Data Loss Risk:</span> NONE (RLS safe)</p>
          </div>
        </Card>
      </div>
    </div>
  );
}