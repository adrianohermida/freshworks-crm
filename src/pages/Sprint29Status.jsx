import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Sprint29Status() {
  const tasks = [
    {
      id: 1,
      name: 'Multi-tenant Support',
      description: 'Permitir múltiplas organizações/clientes no sistema',
      status: 'pending',
      progress: 0,
      subtasks: [
        { name: 'Data isolation strategy', done: false },
        { name: 'Organization entity', done: false },
        { name: 'Tenant middleware', done: false },
        { name: 'Billing integration', done: false }
      ]
    },
    {
      id: 2,
      name: 'Advanced Analytics',
      description: 'Dashboards e relatórios avançados com BI',
      status: 'pending',
      progress: 0,
      subtasks: [
        { name: 'Analytics data model', done: false },
        { name: 'Aggregation pipelines', done: false },
        { name: 'Real-time dashboards', done: false },
        { name: 'Predictive analytics', done: false }
      ]
    },
    {
      id: 3,
      name: 'SAML/SSO Integration',
      description: 'Single Sign-On para empresas',
      status: 'pending',
      progress: 0,
      subtasks: [
        { name: 'SAML provider integration', done: false },
        { name: 'User auto-provisioning', done: false },
        { name: 'AD/LDAP support', done: false },
        { name: 'MFA setup', done: false }
      ]
    },
    {
      id: 4,
      name: 'Custom Branding',
      description: 'White-label e customização de branding',
      status: 'pending',
      progress: 0,
      subtasks: [
        { name: 'Logo/colors config', done: false },
        { name: 'Email templates', done: false },
        { name: 'Custom domain support', done: false },
        { name: 'Branded login page', done: false }
      ]
    }
  ];

  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const overallProgress = 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Sprint 29 - Enterprise Features
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Recursos empresariais para suportar clientes B2B - Semana 1/2
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Overall</div>
            <div className="text-3xl font-bold text-cyan-600">{overallProgress}%</div>
            <Progress value={overallProgress} className="mt-2" />
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
        <Tabs defaultValue="all" className="space-y-6">
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
                .map(task => (
                  <Card key={task.id} className="p-6 dark:bg-gray-800">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {task.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : task.status === 'in_progress' ? (
                            <Clock className="w-5 h-5 text-blue-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                          )}
                          <h4 className="font-semibold text-lg">{task.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
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
                ))}
            </TabsContent>
          ))}
        </Tabs>

        {/* ENTERPRISE ROADMAP */}
        <Card className="p-6 dark:bg-gray-800 mt-8">
          <h3 className="font-bold mb-4">🏢 Enterprise Roadmap</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-32 font-semibold">Multi-tenant</div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Suportar múltiplas organizações com data isolation, billing per-org
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-32 font-semibold">SSO/SAML</div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Integração com SAML, Active Directory, MFA para grandes empresas
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-32 font-semibold">Advanced BI</div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Dashboards analíticos avançados, predictive analytics, BI integrado
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-32 font-semibold">White-label</div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customização completa de branding, domínios customizados, templates
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}