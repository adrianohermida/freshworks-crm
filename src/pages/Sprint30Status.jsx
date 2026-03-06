import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, AlertCircle, Zap, Globe, Users, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Sprint30Status() {
  const [selectedTab, setSelectedTab] = useState('all');

  const tasks = [
    {
      id: 1,
      name: 'Global Expansion Ready',
      description: 'Preparar para operações em múltiplos países',
      status: 'pending',
      progress: 0,
      icon: Globe,
      subtasks: [
        { name: 'Multi-language support (i18n)', done: false },
        { name: 'Multi-currency & timezone', done: false },
        { name: 'Regional compliance (GDPR, LGPD)', done: false },
        { name: 'Local deployment regions', done: false }
      ]
    },
    {
      id: 2,
      name: 'Marketplace & Integrations',
      description: 'Criar marketplace para extensões e integrações',
      status: 'pending',
      progress: 0,
      icon: Zap,
      subtasks: [
        { name: 'App marketplace infrastructure', done: false },
        { name: 'Third-party API standards', done: false },
        { name: 'Revenue sharing system', done: false },
        { name: 'Developer portal', done: false }
      ]
    },
    {
      id: 3,
      name: 'Advanced Automation',
      description: 'Workflow automation e CI/CD para usuários',
      status: 'pending',
      progress: 0,
      icon: TrendingUp,
      subtasks: [
        { name: 'Visual workflow builder', done: false },
        { name: 'Trigger & action system', done: false },
        { name: 'Template library', done: false },
        { name: 'Webhook event system', done: false }
      ]
    },
    {
      id: 4,
      name: 'Community & Support',
      description: 'Community forum, docs, e programa de partners',
      status: 'pending',
      progress: 0,
      icon: Users,
      subtasks: [
        { name: 'Community forum setup', done: false },
        { name: 'Knowledge base & docs', done: false },
        { name: 'Partner program', done: false },
        { name: 'User group management', done: false }
      ]
    }
  ];

  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const pending = tasks.filter(t => t.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Sprint 30 - Scale & Expand
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Escalabilidade, mercado global, integração de partners - Semana 1/2
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Overall</div>
            <div className="text-3xl font-bold text-cyan-600">0%</div>
            <Progress value={0} className="mt-2" />
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
            <div className="text-sm text-gray-600 dark:text-gray-400">Days Left</div>
            <div className="text-3xl font-bold text-purple-600">14</div>
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

        {/* VISION */}
        <Card className="p-6 dark:bg-gray-800 mt-8 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900 dark:to-blue-900 border border-cyan-200 dark:border-cyan-700">
          <h3 className="font-bold text-lg mb-4">🚀 DataJud 2026 Vision</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <Globe className="w-5 h-5 text-cyan-600 flex-shrink-0" />
              <div>
                <p className="font-semibold">Global Reach</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Suportar usuários em 10+ países com compliance local
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Zap className="w-5 h-5 text-cyan-600 flex-shrink-0" />
              <div>
                <p className="font-semibold">Extensibilidade</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Marketplace aberto com 50+ integrações de partners
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <TrendingUp className="w-5 h-5 text-cyan-600 flex-shrink-0" />
              <div>
                <p className="font-semibold">Automação</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Users podem criar workflows sem código
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Users className="w-5 h-5 text-cyan-600 flex-shrink-0" />
              <div>
                <p className="font-semibold">Comunidade</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  1000+ active community members e 50+ partners
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}