import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Clock, TrendingUp, Rocket } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Sprint37Status() {
  const [selectedTab, setSelectedTab] = useState('all');

  const tasks = [
    {
      id: 1,
      name: 'Advanced Analytics Dashboard',
      description: 'Dashboard interativo com insights avançados e ML predictions',
      status: 'in_progress',
      progress: 20,
      subtasks: [
        { name: 'Predictive analytics models', done: false },
        { name: 'Real-time dashboard UI', done: true },
        { name: 'Anomaly detection engine', done: false },
        { name: 'Custom report builder', done: false },
        { name: 'Data export integration', done: false }
      ]
    },
    {
      id: 2,
      name: 'Marketplace Foundation API',
      description: 'API base para suportar integração de parceiros',
      status: 'in_progress',
      progress: 25,
      subtasks: [
        { name: 'Partner registration system', done: true },
        { name: 'API key management', done: true },
        { name: 'Partner dashboard', done: false },
        { name: 'Revenue sharing calculation', done: false },
        { name: 'Documentation & examples', done: false }
      ]
    },
    {
      id: 3,
      name: 'SDK JavaScript/TypeScript',
      description: 'SDK oficial para JavaScript e TypeScript com full TS support',
      status: 'planned',
      progress: 0,
      subtasks: [
        { name: 'Core SDK implementation', done: false },
        { name: 'TypeScript definitions', done: false },
        { name: 'Example projects (3)', done: false },
        { name: 'NPM package setup', done: false },
        { name: 'Full documentation', done: false }
      ]
    },
    {
      id: 4,
      name: 'Multi-Tenancy Improvements',
      description: 'Melhorias de isolamento e performance para multi-tenant',
      status: 'planned',
      progress: 0,
      subtasks: [
        { name: 'Tenant isolation validation', done: false },
        { name: 'Database sharding setup', done: false },
        { name: 'Per-tenant rate limiting', done: false },
        { name: 'SLA per tenant', done: false },
        { name: 'Tenant analytics', done: false }
      ]
    },
    {
      id: 5,
      name: 'Advanced RBAC & Permissions',
      description: 'Sistema RBAC granular com suporte a custom permissions',
      status: 'planned',
      progress: 0,
      subtasks: [
        { name: 'Permission matrix UI', done: false },
        { name: 'Dynamic role creation', done: false },
        { name: 'Audit logging for permissions', done: false },
        { name: 'SSO integration refinement', done: false },
        { name: 'Documentation', done: false }
      ]
    },
    {
      id: 6,
      name: 'Partner Program Framework',
      description: 'Framework para programa de parceiros e afiliados',
      status: 'planned',
      progress: 0,
      subtasks: [
        { name: 'Partner types definition', done: false },
        { name: 'Onboarding workflow', done: false },
        { name: 'Certification program', done: false },
        { name: 'Revenue share tracking', done: false },
        { name: 'Partner support portal', done: false }
      ]
    }
  ];

  const statistics = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    planned: tasks.filter(t => t.status === 'planned').length
  };

  const overallProgress = Math.round(
    tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length
  );

  const filteredTasks = selectedTab === 'all' ? tasks : tasks.filter(t => t.status === selectedTab);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="w-8 h-8 text-cyan-600" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Sprint 37 - Advanced Features & Marketplace Foundation
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Analytics avançado, marketplace foundation, SDKs e melhorias enterprise
              </p>
            </div>
            <Badge className="bg-yellow-600 px-4 py-2 text-lg">STARTED TODAY 🚀</Badge>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</div>
            <div className="text-3xl font-bold text-cyan-600">{overallProgress}%</div>
            <Progress value={overallProgress} className="mt-2" />
          </Card>
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{statistics.total}</div>
          </Card>
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
            <div className="text-3xl font-bold text-blue-600">{statistics.in_progress}</div>
          </Card>
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Planned</div>
            <div className="text-3xl font-bold text-orange-600">{statistics.planned}</div>
          </Card>
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Timeline</div>
            <div className="text-2xl font-bold text-purple-600">21 dias</div>
            <p className="text-xs text-gray-600 mt-1">25 Abr - 16 Mai</p>
          </Card>
        </div>

        {/* TASKS TABS */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todos ({tasks.length})</TabsTrigger>
            <TabsTrigger value="in_progress">Em Progresso ({statistics.in_progress})</TabsTrigger>
            <TabsTrigger value="planned">Planejado ({statistics.planned})</TabsTrigger>
            <TabsTrigger value="completed">Concluído ({statistics.completed})</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="p-6 dark:bg-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {task.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {task.description}
                    </p>
                  </div>
                  <Badge className={
                    task.status === 'completed' ? 'bg-green-600' :
                    task.status === 'in_progress' ? 'bg-blue-600' :
                    'bg-orange-600'
                  }>
                    {task.status === 'in_progress' ? '🔄 DOING' :
                     task.status === 'planned' ? '📋 NEXT' :
                     '✅ DONE'}
                  </Badge>
                </div>

                {/* PROGRESS BAR */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                </div>

                {/* SUBTASKS */}
                <div className="space-y-2">
                  {task.subtasks.map((subtask, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      {subtask.done ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                      <span className={subtask.done ? 'line-through text-gray-500' : ''}>
                        {subtask.name}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* CRITICAL PATH */}
        <Card className="p-6 dark:bg-gray-800 mt-8 border-l-4 border-yellow-500">
          <h3 className="font-bold text-lg mb-4">🔥 Critical Path - Próximos 7 Dias</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Dias 1-3: Finalizar Sprint 36 pendências</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Stripe PCI validation, performance baselines</p>
              </div>
            </div>
            <div className="flex items-start gap-2 mt-3">
              <Clock className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Dias 4-7: Ramp-up Sprint 37 core tasks</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Advanced analytics & marketplace API</p>
              </div>
            </div>
          </div>
        </Card>

        {/* DEPENDENCIES */}
        <Card className="p-6 dark:bg-gray-800 mt-6 border-l-4 border-blue-500">
          <h3 className="font-bold text-lg mb-4">📌 Key Dependencies</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-blue-600">→</span> Sprint 36 concluído 95%+ (3 dias)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">→</span> v2.0.0 em produção estável (uptime 99.9%)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">→</span> Analytics engine completamente testado
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">→</span> Partner program requirements aprovados
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}