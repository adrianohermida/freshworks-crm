import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, TrendingUp, Target } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SprintExecutiveReview() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const sprintHistory = [
    { 
      numero: 34, 
      nome: 'Offline Parsing & Advanced Processing', 
      duracao: '20 dias',
      status: '✅ COMPLETED', 
      progresso: 100, 
      tarefas: '20/20',
      datas: '12/02 - 03/03 2026'
    },
    { 
      numero: 35, 
      nome: 'Integration & Automation', 
      duracao: '20 dias',
      status: '✅ COMPLETED', 
      progresso: 100, 
      tarefas: '20/20',
      datas: '13/02 - 04/03 2026'
    },
    { 
      numero: 33, 
      nome: 'Compliance Enterprise & Security', 
      duracao: '20 dias',
      status: '✅ COMPLETED', 
      progresso: 100, 
      tarefas: '20/20',
      datas: '13/02 - 04/03 2026'
    },
    { 
      numero: 36, 
      nome: 'Post-Release Stabilization & v2.1 Prep', 
      duracao: '21 dias',
      status: '🚀 IN PROGRESS', 
      progresso: 25, 
      tarefas: '6/45 (12 subtasks)',
      datas: '03/03 - 24/04 2026'
    }
  ];

  const sprint36Status = {
    overall: 25,
    tasks: [
      { name: 'Post-Release Monitoring', progress: 40, status: 'in_progress' },
      { name: 'Analytics Implementation', progress: 15, status: 'in_progress' },
      { name: 'Stripe Integration Phase 1', progress: 5, status: 'planned' },
      { name: 'Webhooks v2 Enhanced', progress: 0, status: 'planned' },
      { name: 'SDK Python Official', progress: 0, status: 'planned' },
      { name: 'Performance Optimization', progress: 0, status: 'planned' }
    ]
  };

  const upcomingSprints = [
    {
      numero: 37,
      nome: 'Advanced Features & Marketplace Foundation',
      duracao: '21 dias',
      dataInicio: '25/04/2026',
      tarefas: 30,
      destaques: ['Marketplace API', 'Advanced Analytics', 'Partner Program', 'AI Features Planning']
    },
    {
      numero: 38,
      nome: 'Marketplace & Global Expansion Setup',
      duracao: '21 dias',
      dataInicio: '16/05/2026',
      tarefas: 25,
      destaques: ['Marketplace Portal', 'Partner Onboarding', 'Multi-Currency', 'Localization']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Sprint Executive Review - 03/03/2026
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Status consolidado de desenvolvimento e roadmap futuro
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="sprint36">Sprint 36</TabsTrigger>
            <TabsTrigger value="upcoming">Próximos Sprints</TabsTrigger>
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
          </TabsList>

          {/* VISÃO GERAL */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="p-6 dark:bg-gray-800">
              <h3 className="font-bold text-lg mb-4">🏆 Histórico de Sprints</h3>
              <div className="space-y-3">
                {sprintHistory.map((sprint, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold">Sprint {sprint.numero}: {sprint.nome}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {sprint.datas} | {sprint.duracao}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-cyan-600">{sprint.progresso}%</p>
                        <p className="text-xs text-gray-600">{sprint.tarefas}</p>
                      </div>
                      <Badge className={
                        sprint.status.includes('COMPLETED') ? 'bg-green-600' : 'bg-yellow-600'
                      }>
                        {sprint.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6 dark:bg-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total de Tarefas</div>
                <div className="text-4xl font-bold text-cyan-600">155</div>
                <Progress value={85} className="mt-2" />
                <p className="text-xs mt-2 text-gray-600">135/155 concluídas (87%)</p>
              </Card>
              <Card className="p-6 dark:bg-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Dias de Dev</div>
                <div className="text-4xl font-bold text-green-600">62</div>
                <p className="text-xs mt-2 text-gray-600">Fevereiro-Março 2026</p>
              </Card>
              <Card className="p-6 dark:bg-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">v2.0 Status</div>
                <Badge className="bg-green-600 text-lg px-3 py-1">PRODUCTION ✅</Badge>
                <p className="text-xs mt-2 text-gray-600">Uptime: 99.95%</p>
              </Card>
            </div>
          </TabsContent>

          {/* SPRINT 36 DETALHES */}
          <TabsContent value="sprint36" className="space-y-6">
            <Card className="p-6 dark:bg-gray-800">
              <h3 className="font-bold text-lg mb-4">📈 Sprint 36 Progress - Detailed</h3>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Overall Progress</span>
                  <span className="text-2xl font-bold text-cyan-600">{sprint36Status.overall}%</span>
                </div>
                <Progress value={sprint36Status.overall} className="h-3" />
              </div>

              <div className="space-y-4">
                {sprint36Status.tasks.map((task, idx) => (
                  <div key={idx} className="border-t pt-3">
                    <div className="flex justify-between mb-2">
                      <p className="font-semibold text-sm">{task.name}</p>
                      <Badge className={
                        task.status === 'in_progress' ? 'bg-blue-600' :
                        task.status === 'planned' ? 'bg-orange-600' :
                        'bg-green-600'
                      }>
                        {task.status.toUpperCase()}
                      </Badge>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                    <p className="text-xs mt-1 text-gray-600">{task.progress}%</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 dark:bg-gray-800 border-l-4 border-orange-500">
              <h3 className="font-bold text-lg mb-3">⚠️ Pendências Críticas Sprint 36</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>Finalizar SLA compliance tracking (5 dias)</span>
                </li>
                <li className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>Completar feature adoption analytics (10 dias)</span>
                </li>
                <li className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>Validação PCI compliance Stripe (8 dias)</span>
                </li>
              </ul>
            </Card>
          </TabsContent>

          {/* PRÓXIMOS SPRINTS */}
          <TabsContent value="upcoming" className="space-y-6">
            {upcomingSprints.map((sprint, idx) => (
              <Card key={idx} className="p-6 dark:bg-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold">Sprint {sprint.numero}: {sprint.nome}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Início: {sprint.dataInicio} | Duração: {sprint.duracao}
                    </p>
                  </div>
                  <Badge className="bg-purple-600">{sprint.tarefas} TAREFAS</Badge>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm font-semibold mb-3">Destaques Planejados:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {sprint.destaques.map((destaque, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-cyan-600" />
                        <span>{destaque}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* MÉTRICAS */}
          <TabsContent value="metrics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6 dark:bg-gray-800">
                <h4 className="font-bold mb-4">📊 Velocidade de Desenvolvimento</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Tasks/Dia (Média)</p>
                    <p className="text-3xl font-bold text-cyan-600">2.4</p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-600">Tarefas Concluídas em Paralelo</p>
                    <p className="text-2xl font-bold text-green-600">3-5</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 dark:bg-gray-800">
                <h4 className="font-bold mb-4">⚡ Eficiência</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Taxa de Conclusão</p>
                    <p className="text-3xl font-bold text-green-600">87%</p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-600">No Blockers/Delays</p>
                    <p className="text-2xl font-bold text-green-600">ON TRACK</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 dark:bg-gray-800 bg-gradient-to-r from-green-50 to-cyan-50 dark:from-green-900 dark:to-cyan-900">
              <h4 className="font-bold text-lg mb-4">🎯 Projeção de Release</h4>
              <div className="space-y-2 text-sm">
                <p><strong>v2.0.0:</strong> ✅ 31 Março 2026 - PRODUCTION</p>
                <p><strong>v2.1.0:</strong> 📅 Junho 2026 (Sprint 36-37 completado)</p>
                <p><strong>v2.2.0:</strong> 📅 Setembro 2026 (Marketplace + IA)</p>
                <p><strong>v3.0.0:</strong> 📅 Dezembro 2026 (Global Expansion)</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CALL TO ACTION */}
        <Card className="p-6 dark:bg-gray-800 mt-8 border-2 border-cyan-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg mb-1">✅ Próxima Ação</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Continuar execução Sprint 36 com foco em Monitoring stability e Analytics implementation
              </p>
            </div>
            <Badge className="bg-cyan-600 text-lg px-4 py-2">CONTINUE</Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}