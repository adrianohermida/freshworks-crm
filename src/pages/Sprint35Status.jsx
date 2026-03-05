import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, AlertCircle, Zap, GitBranch, Settings, Truck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function Sprint35Status() {
  const [selectedTab, setSelectedTab] = useState('all');

  const tasks = [
    {
    id: 1,
    name: 'Integração do Pipeline Offline',
    description: 'Conectar parser, deduplica e enriquecimento no fluxo de sincronização',
    status: 'completed',
    progress: 100,
    icon: GitBranch,
    subtasks: [
      { name: 'Pipeline orchestration', done: true },
      { name: 'Error handling & retry logic', done: true },
      { name: 'Cache estratégico', done: true },
      { name: 'Logging centralizado', done: true }
    ]
    },
    {
      id: 2,
      name: 'Otimização de Performance',
      description: 'Garantir processamento offline rápido mesmo com 76 tribunais',
      status: 'completed',
      progress: 100,
      icon: Zap,
      subtasks: [
        { name: 'Batch processing (1000 movimentos)', done: true },
        { name: 'Worker threads para deduplicação', done: true },
        { name: 'Índices para busca rápida', done: true },
        { name: 'Benchmarks de performance', done: true }
      ]
    },
    {
      id: 3,
      name: 'Configuração de Sincronização',
      description: 'Setup de automação para sincronização periódica',
      status: 'completed',
      progress: 100,
      icon: Settings,
      subtasks: [
        { name: 'Scheduled sync automations', done: true },
        { name: 'Webhook handlers para eventos', done: true },
        { name: 'Notificações de sync', done: true },
        { name: 'Dashboard de sync status', done: true }
      ]
    },
    {
    id: 4,
    name: 'Deploy & Testing',
    description: 'QA completo e deploy para produção',
    status: 'completed',
    progress: 100,
    icon: Truck,
    subtasks: [
      { name: 'Testes unitários', done: true },
      { name: 'Testes de integração', done: true },
      { name: 'Testes em staging com dados reais', done: true },
      { name: 'Deploy com rollback plan', done: true }
    ]
    }
  ];

  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const totalProgress = Math.round((completed * 100 + inProgress * 50) / tasks.length);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Sprint 35 - Integração & Deploy
            </h1>
            <Badge className="bg-green-600">100% CONCLUÍDO ✅</Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Integrar todo o pipeline offline, otimizar performance e fazer deploy em produção
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Overall</div>
            <div className="text-3xl font-bold text-cyan-600">{totalProgress}%</div>
            <Progress value={totalProgress} className="mt-2" />
          </Card>
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            <div className="text-3xl font-bold text-green-600">{completed}/4</div>
          </Card>
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
            <div className="text-3xl font-bold text-blue-600">{inProgress}/4</div>
          </Card>
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
            <div className="text-3xl font-bold text-orange-600">{pending}/4</div>
          </Card>
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
            <div className="text-3xl font-bold text-purple-600">2 weeks</div>
          </Card>
        </div>

        {/* TASKS */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todas ({tasks.length})</TabsTrigger>
            <TabsTrigger value="completed">✅ Concluídas ({completed})</TabsTrigger>
            <TabsTrigger value="in_progress">🔄 Em Progresso ({inProgress})</TabsTrigger>
            <TabsTrigger value="pending">⏳ Pendentes ({pending})</TabsTrigger>
          </TabsList>

          {['all', 'completed', 'in_progress', 'pending'].map(tab => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {tasks
                .filter(t =>
                  tab === 'all' ? true :
                  tab === 'completed' ? t.status === 'completed' :
                  tab === 'in_progress' ? t.status === 'in_progress' :
                  t.status === 'pending'
                )
                .map(task => {
                  const Icon = task.icon;
                  return (
                    <Card key={task.id} className="p-6 dark:bg-gray-800">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <Icon className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="font-semibold text-lg">{task.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded whitespace-nowrap ${
                          task.status === 'completed'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : task.status === 'in_progress'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            : 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                        }`}>
                          {task.progress}%
                        </span>
                      </div>

                      <Progress value={task.progress} className="mb-4" />

                      <div className="grid md:grid-cols-2 gap-2">
                        {task.subtasks.map((subtask, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            {subtask.done ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-400 rounded-full flex-shrink-0" />
                            )}
                            <span className={subtask.done ? 'line-through text-gray-500' : ''}>
                              {subtask.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  );
                })}
            </TabsContent>
          ))}
        </Tabs>

        {/* DEPENDENCIES */}
        <Card className="p-6 dark:bg-gray-800 mt-8 border-2 border-blue-500">
          <h3 className="font-bold text-lg mb-4">🔗 Dependências</h3>
          <div className="space-y-2 text-sm">
            <p>✅ Sprint 34 - Offline Parsing (Concluído 100%)</p>
            <p>✅ Sprint 33 - Platform Maturity (Pendente conforme roadmap)</p>
            <p>✅ Sprint 35 - Concluído 100%</p>
          </div>
        </Card>

        {/* RELEASE TIMELINE */}
        <Card className="p-6 dark:bg-gray-800 mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900">
          <h3 className="font-bold text-lg mb-4">🎯 Release Timeline 2026</h3>
          <div className="space-y-3">
            <div className="flex gap-4">
              <div className="w-32 font-semibold">Março</div>
              <div className="flex-1">
                <p className="font-semibold">Sprint 34 - Concluído</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Parser, deduplicação, LGPD</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-32 font-semibold">Março (2ª semana)</div>
              <div className="flex-1">
                <p className="font-semibold">Sprint 35 (Atual)</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Integração & Deploy</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-32 font-semibold">Março (3ª semana)</div>
              <div className="flex-1">
                <p className="font-semibold">Sprint 33 (Final)</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Compliance enterprise (GDPR/LGPD)</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-32 font-semibold">Fim de Março</div>
              <div className="flex-1">
                <p className="font-semibold">🚀 v2.0.0 Release</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Multi-tribunal, offline parsing, compliance</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}