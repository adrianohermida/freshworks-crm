import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, TrendingUp, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SprintCompletionDashboard() {
  const sprint36Tasks = [
    { nome: 'Post-Release Monitoring & Alerting', progress: 95, status: 'nearly_complete' },
    { nome: 'Analytics & Usage Insights', progress: 85, status: 'in_progress' },
    { nome: 'Incident Management System', progress: 90, status: 'nearly_complete' },
    { nome: 'Stripe Integration Phase 1', progress: 70, status: 'in_progress' },
    { nome: 'Webhooks v2 Enhanced', progress: 60, status: 'in_progress' },
    { nome: 'SDK Python Official', progress: 45, status: 'in_progress' },
    { nome: 'Performance Optimization', progress: 50, status: 'in_progress' }
  ];

  const sprint37Tasks = [
    { nome: 'Advanced Analytics Dashboard', progress: 20, status: 'in_progress' },
    { nome: 'Marketplace Foundation API', progress: 25, status: 'in_progress' },
    { nome: 'SDK JavaScript/TypeScript', progress: 0, status: 'planned' },
    { nome: 'Multi-Tenancy Improvements', progress: 0, status: 'planned' },
    { nome: 'Advanced RBAC & Permissions', progress: 0, status: 'planned' },
    { nome: 'Partner Program Framework', progress: 0, status: 'planned' }
  ];

  const sprint36Overall = Math.round(sprint36Tasks.reduce((a, b) => a + b.progress, 0) / sprint36Tasks.length);
  const sprint37Overall = Math.round(sprint37Tasks.reduce((a, b) => a + b.progress, 0) / sprint37Tasks.length);

  const totalRoadmapTasks = 220;
  const completedTasks = 135;
  const inProgressTasks = 50;
  const plannedTasks = 35;

  const roadmapProgress = Math.round((completedTasks / totalRoadmapTasks) * 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          📊 Sprint Completion Status - 04/04/2026
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Revisão final Sprint 36 e status Sprint 37
        </p>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="sprint36">Sprint 36</TabsTrigger>
            <TabsTrigger value="sprint37">Sprint 37</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap 2026</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6 dark:bg-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Sprint 36 - Completude</div>
                <div className="text-4xl font-bold text-cyan-600 mb-2">{sprint36Overall}%</div>
                <Progress value={sprint36Overall} className="h-3" />
                <p className="text-xs text-gray-600 mt-2">Transfer: 95% ready → Sprint 37</p>
              </Card>

              <Card className="p-6 dark:bg-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Sprint 37 - Iniciado</div>
                <div className="text-4xl font-bold text-yellow-600 mb-2">{sprint37Overall}%</div>
                <Progress value={sprint37Overall} className="h-3" />
                <p className="text-xs text-gray-600 mt-2">0-21 dias | 6 tasks</p>
              </Card>

              <Card className="p-6 dark:bg-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Roadmap 2026 Total</div>
                <div className="text-4xl font-bold text-green-600 mb-2">{roadmapProgress}%</div>
                <Progress value={roadmapProgress} className="h-3" />
                <p className="text-xs text-gray-600 mt-2">135/220 tasks concluídas</p>
              </Card>
            </div>

            <Card className="p-6 dark:bg-gray-800">
              <h3 className="font-bold text-lg mb-4">🎯 Status Geral</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Sprints Concluídos</span>
                  <Badge className="bg-green-600">4/4 (100%)</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sprint 36 Completude</span>
                  <Badge className="bg-blue-600">{sprint36Overall}% (Transfer Ready)</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sprint 37 Ativo</span>
                  <Badge className="bg-yellow-600">{sprint37Overall}% (Just Started)</Badge>
                </div>
                <div className="flex justify-between items-center border-t pt-3">
                  <span className="font-semibold">Dias até próxima release</span>
                  <span className="text-lg font-bold text-cyan-600">42 dias</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* SPRINT 36 */}
          <TabsContent value="sprint36" className="space-y-4">
            <Card className="p-6 dark:bg-gray-800 border-l-4 border-green-500">
              <h3 className="font-bold text-lg mb-4">✅ Sprint 36 - Validação Final</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Status: 70% Completo | Transfer Ready: SIM
              </p>
              <div className="space-y-3">
                {sprint36Tasks.map((task, idx) => (
                  <div key={idx} className="border-b pb-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold">{task.nome}</span>
                      <span className="text-sm text-gray-600">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 dark:bg-gray-800 border-l-4 border-orange-500">
              <h3 className="font-bold text-lg mb-4">⚠️ Pendências Sprint 36 (Transfer)</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>Stripe PCI Compliance - 3 dias (CRÍTICO)</span>
                </li>
                <li className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>SDK Python PyPI Publication - 5 dias</span>
                </li>
                <li className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>Performance Baselines Validation - 2 dias</span>
                </li>
                <li className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>Feature Adoption Dashboard - 4 dias</span>
                </li>
              </ul>
            </Card>
          </TabsContent>

          {/* SPRINT 37 */}
          <TabsContent value="sprint37" className="space-y-4">
            <Card className="p-6 dark:bg-gray-800 border-l-4 border-yellow-500">
              <h3 className="font-bold text-lg mb-4">🚀 Sprint 37 - Just Started</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Status: {sprint37Overall}% | Duração: 21 dias | Tasks: 6
              </p>
              <div className="space-y-3">
                {sprint37Tasks.map((task, idx) => (
                  <div key={idx} className="border-b pb-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold">{task.nome}</span>
                      <Badge className={
                        task.status === 'in_progress' ? 'bg-blue-600' :
                        task.status === 'planned' ? 'bg-orange-600' :
                        'bg-green-600'
                      }>
                        {task.status}
                      </Badge>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 dark:bg-gray-800 border-l-4 border-blue-500">
              <h3 className="font-bold text-lg mb-4">🎯 Critical Path Sprint 37</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <Zap className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Dias 1-5: Finalize Sprint 36 pendências + ramp-up Analytics</span>
                </li>
                <li className="flex gap-2">
                  <Zap className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Dias 6-12: Marketplace API + SDK JavaScript</span>
                </li>
                <li className="flex gap-2">
                  <Zap className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Dias 13-21: Multi-tenancy, RBAC, Partner Program + final testing</span>
                </li>
              </ul>
            </Card>
          </TabsContent>

          {/* ROADMAP 2026 */}
          <TabsContent value="roadmap" className="space-y-4">
            <Card className="p-6 dark:bg-gray-800">
              <h3 className="font-bold text-lg mb-4">📈 Roadmap 2026 - Full Picture</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Total Completude</span>
                    <span className="text-2xl font-bold text-green-600">{roadmapProgress}%</span>
                  </div>
                  <Progress value={roadmapProgress} className="h-4" />
                  <p className="text-xs text-gray-600 mt-1">135 concluídas / 220 total</p>
                </div>

                <div className="grid grid-cols-3 gap-3 border-t pt-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Completadas</p>
                    <p className="text-2xl font-bold text-green-600">135</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Em Progresso</p>
                    <p className="text-2xl font-bold text-blue-600">50</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Planejadas</p>
                    <p className="text-2xl font-bold text-orange-600">35</p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sprint 33-35 (v2.0.0)</span>
                    <Badge className="bg-green-600">100% | 80/80</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Sprint 36</span>
                    <Badge className="bg-blue-600">70% | 28/40</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Sprint 37-38</span>
                    <Badge className="bg-yellow-600">25% Avg | 20/80</Badge>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Projeção Maio</span>
                    <span className="font-bold text-green-600">~90% roadmap</span>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* FINAL SUMMARY */}
        <Card className="p-6 dark:bg-gray-800 mt-8 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900 dark:to-blue-900 border-2 border-cyan-500">
          <h3 className="font-bold text-lg mb-3">✅ SUMÁRIO EXECUTIVO</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Sprint 36:</strong> 70% completo - Transfer para Sprint 37 com 4 pendências críticas</p>
            <p><strong>Sprint 37:</strong> Iniciado agora - 6 tarefas, {sprint37Overall}% inicial, 21 dias</p>
            <p><strong>Roadmap 2026:</strong> {roadmapProgress}% (135/220) - On track para ~90% em Maio</p>
            <p><strong>v2.0.0 Production:</strong> Uptime 99.95% - Estável e operacional ✅</p>
            <p><strong>Próxima Release:</strong> v2.1.0 projetada para junho (após Sprint 37 completar)</p>
          </div>
        </Card>
      </div>
    </div>
  );
}