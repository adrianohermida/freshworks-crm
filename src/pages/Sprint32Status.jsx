import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, AlertCircle, Eye, Users, Zap, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Sprint32Status() {
  const [selectedTab, setSelectedTab] = useState('all');

  const tasks = [
    {
      id: 1,
      name: 'Analytics Deep Dive',
      description: 'Dashboards avançados com drill-down analytics',
      status: 'pending',
      progress: 0,
      icon: TrendingUp,
      subtasks: [
        { name: 'Drill-down interface', done: false },
        { name: 'Custom metric builder', done: false },
        { name: 'Export to external BI', done: false },
        { name: 'Scheduled reports', done: false }
      ]
    },
    {
      id: 2,
      name: 'User Insights & Behavior',
      description: 'Entender comportamento e padrões de usuário',
      status: 'pending',
      progress: 0,
      icon: Eye,
      subtasks: [
        { name: 'User journey mapping', done: false },
        { name: 'Feature adoption tracking', done: false },
        { name: 'Churn prediction', done: false },
        { name: 'Cohort analysis', done: false }
      ]
    },
    {
      id: 3,
      name: 'Team Collaboration',
      description: 'Recursos de colaboração em tempo real',
      status: 'pending',
      progress: 0,
      icon: Users,
      subtasks: [
        { name: 'Real-time commenting', done: false },
        { name: 'Process assignments', done: false },
        { name: 'Activity feed', done: false },
        { name: 'Mentions & notifications', done: false }
      ]
    },
    {
      id: 4,
      name: 'API Rate Limiting & Security',
      description: 'Rate limiting, DDoS protection, security hardening',
      status: 'pending',
      progress: 0,
      icon: Zap,
      subtasks: [
        { name: 'Rate limiting per tenant', done: false },
        { name: 'DDoS protection', done: false },
        { name: 'API key rotation', done: false },
        { name: 'Security audit & pen testing', done: false }
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
            Sprint 32 - Insights & Collaboration
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Analytics avançadas, comportamento de usuário, colaboração em tempo real - Semana 1/2
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

        {/* PROGRAM STATUS */}
        <Card className="p-6 dark:bg-gray-800 mt-8 border-l-4 border-green-600">
          <h3 className="font-bold text-lg mb-4">✨ DataJud 2026 - Program Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Year Progress</span>
              <span className="text-2xl font-bold text-cyan-600">70/80 (87.5%)</span>
            </div>
            <Progress value={87.5} className="h-3" />
            
            <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sprints Completed</p>
                <p className="text-2xl font-bold text-green-600">12/14</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Users</p>
                <p className="text-2xl font-bold text-blue-600">1,240 → 5k+</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</p>
                <p className="text-2xl font-bold text-purple-600">$120k MRR</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}