import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Sprint36Status() {
  const [selectedTab, setSelectedTab] = useState('all');

  const tasks = [
    {
      id: 1,
      name: 'Post-Release Monitoring & Alerting',
      description: 'Sistema robusto de monitoramento pós-release com alertas automáticos',
      status: 'in_progress',
      progress: 40,
      icon: TrendingUp,
      subtasks: [
        { name: 'Real-time metrics dashboard', done: true },
        { name: 'Automated alert system', done: true },
        { name: 'Incident management UI', done: false },
        { name: 'SLA compliance tracking', done: false },
        { name: 'Performance baselines', done: false }
      ]
    },
    {
      id: 2,
      name: 'Analytics & Usage Insights',
      description: 'Plataforma de analytics para entender uso e otimizar features',
      status: 'planned',
      progress: 0,
      icon: TrendingUp,
      subtasks: [
        { name: 'Event tracking implementation', done: false },
        { name: 'User cohort analysis', done: false },
        { name: 'Feature adoption metrics', done: false },
        { name: 'Funnel analysis dashboard', done: false },
        { name: 'Retention cohort tracking', done: false }
      ]
    },
    {
      id: 3,
      name: 'Stripe Integration - Phase 1',
      description: 'Integração com Stripe para processamento de pagamentos',
      status: 'planned',
      progress: 0,
      icon: TrendingUp,
      subtasks: [
        { name: 'Payment processing setup', done: false },
        { name: 'Subscription management', done: false },
        { name: 'Webhook handling', done: false },
        { name: 'Invoice generation', done: false },
        { name: 'PCI compliance validation', done: false }
      ]
    },
    {
      id: 4,
      name: 'Webhooks v2 - Enhanced',
      description: 'Sistema robusto de webhooks com retry, filtering e management UI',
      status: 'planned',
      progress: 0,
      icon: TrendingUp,
      subtasks: [
        { name: 'Event streaming architecture', done: false },
        { name: 'Automatic retry mechanism', done: false },
        { name: 'Event filtering & routing', done: false },
        { name: 'Webhook management dashboard', done: false },
        { name: 'Rate limiting per endpoint', done: false }
      ]
    },
    {
      id: 5,
      name: 'SDK Python - Official',
      description: 'SDK oficial para Python com type hints e full documentation',
      status: 'planned',
      progress: 0,
      icon: TrendingUp,
      subtasks: [
        { name: 'SDK core implementation', done: false },
        { name: 'Type hints & validation', done: false },
        { name: 'Example projects', done: false },
        { name: 'Full documentation', done: false },
        { name: 'PyPI package publication', done: false }
      ]
    },
    {
      id: 6,
      name: 'Performance Optimization',
      description: 'Otimização de performance baseada em dados reais pós-release',
      status: 'planned',
      progress: 0,
      icon: TrendingUp,
      subtasks: [
        { name: 'Query optimization', done: false },
        { name: 'Cache layer v2', done: false },
        { name: 'Database indexing review', done: false },
        { name: 'API response optimization', done: false },
        { name: 'Frontend bundle optimization', done: false }
      ]
    }
  ];

  const statistics = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    planned: tasks.filter(t => t.status === 'planned').length,
    blocked: 0
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
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Sprint 36 - Post-Release Stabilization
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Estabilização pós-release, otimizações e preparação para v2.1.0
              </p>
            </div>
            <Badge className="bg-yellow-600 px-4 py-2 text-lg">IN PROGRESS 🚀</Badge>
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
          </Card>
        </div>

        {/* TASKS TABS */}
        <Tabs value={selectedTab} onValueChange={val => val && val.length && val} className="space-y-6">
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
                    {task.status === 'in_progress' ? '🔄 IN PROGRESS' :
                     task.status === 'planned' ? '📋 PLANNED' :
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
        <Card className="p-6 dark:bg-gray-800 mt-8 border-l-4 border-orange-500">
          <h3 className="font-bold text-lg mb-4">🔥 Caminho Crítico - Próximos 5 Dias</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Hoje-Amanhã: Stabilize monitoring & incident response</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Garantir que sistema está estável pós-release</p>
              </div>
            </div>
            <div className="flex items-start gap-2 mt-3">
              <Clock className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Dias 3-5: Start analytics implementation</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Começar coleta de dados e dashboards</p>
              </div>
            </div>
          </div>
        </Card>

        {/* DEPENDENCIES */}
        <Card className="p-6 dark:bg-gray-800 mt-6 border-l-4 border-blue-500">
          <h3 className="font-bold text-lg mb-4">📌 Dependências Críticas</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-blue-600">→</span> Estabilidade v2.0.0 ≥ 99.9% uptime
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">→</span> Validação de compliance GDPR/LGPD
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">→</span> Aprovação de integração Stripe
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">→</span> Design Webhooks v2 finalizado
            </li>
          </ul>
        </Card>

        {/* NEXT REVIEW */}
        <Card className="p-6 dark:bg-gray-800 mt-6 bg-green-50 dark:bg-green-900 border-2 border-green-500">
          <h3 className="font-bold text-lg mb-2">📅 Próxima Revisão</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sprint 36 em execução até 24 Abril | Revisão: 25 Abril 2026
          </p>
        </Card>
      </div>
    </div>
  );
}