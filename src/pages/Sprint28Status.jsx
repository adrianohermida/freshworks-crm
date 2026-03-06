import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Sprint28Status() {
  const tasks = [
    {
      id: 1,
      name: 'Advanced Filtering',
      description: 'Filtros multi-campo com status, tribunal, data, movimentos',
      status: 'in_progress',
      progress: 35,
      subtasks: [
        { name: 'AdvancedProcessFilter component', done: true },
        { name: 'Filter logic implementation', done: false },
        { name: 'Save filter preferences', done: false },
        { name: 'API integration', done: false }
      ]
    },
    {
      id: 2,
      name: 'Bulk Actions',
      description: 'Selecionar múltiplos processos e executar ações',
      status: 'pending',
      progress: 0,
      subtasks: [
        { name: 'Bulk selection UI', done: false },
        { name: 'Batch sync action', done: false },
        { name: 'Batch export action', done: false },
        { name: 'Confirmation dialogs', done: false }
      ]
    },
    {
      id: 3,
      name: 'Custom Reports',
      description: 'Gerar relatórios personalizados em PDF/CSV',
      status: 'pending',
      progress: 0,
      subtasks: [
        { name: 'Report template builder', done: false },
        { name: 'Data aggregation logic', done: false },
        { name: 'PDF/CSV export', done: false },
        { name: 'Schedule reports', done: false }
      ]
    },
    {
      id: 4,
      name: 'WhatsApp Enhanced',
      description: 'Notificações via WhatsApp com template buttons',
      status: 'pending',
      progress: 0,
      subtasks: [
        { name: 'Interactive message templates', done: false },
        { name: 'Webhook handlers', done: false },
        { name: 'Notification rules engine', done: false },
        { name: 'User opt-in flow', done: false }
      ]
    }
  ];

  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const overallProgress = Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Sprint 28 - Feature Expansion
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Expandindo funcionalidades baseado em feedback de usuários - Semana 1/2
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

        {/* USER REQUESTS */}
        <Card className="p-6 dark:bg-gray-800 mt-8">
          <h3 className="font-bold mb-4">📊 User Requests Atendidos</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded">
              <p className="font-semibold text-blue-900 dark:text-blue-100">Advanced Filtering</p>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                "Could filter processes by court" - 8 requests
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900 rounded">
              <p className="font-semibold text-green-900 dark:text-green-100">Bulk Actions</p>
              <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                "Need to sync multiple cases at once" - 5 requests
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded">
              <p className="font-semibold text-purple-900 dark:text-purple-100">Custom Reports</p>
              <p className="text-sm text-purple-800 dark:text-purple-200 mt-1">
                "Export to PDF with custom fields" - 6 requests
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900 rounded">
              <p className="font-semibold text-orange-900 dark:text-orange-100">WhatsApp Alerts</p>
              <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
                "More interactive WhatsApp notifications" - 4 requests
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}