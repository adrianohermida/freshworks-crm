import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  TrendingUp,
  Target,
  Code,
  Server,
  Activity
} from 'lucide-react';

/**
 * Dashboard Executivo - Acompanhamento de Sprints
 * Visão consolidada do progresso de todos os sprints
 */
export default function SprintDashboard() {
  const sprints = [
    {
      id: 'sprint17',
      name: 'Sprint 17',
      title: 'PWA & Setup Manual',
      status: 'bloqueado',
      progress: 8,
      tasksCompleted: 2,
      tasksTotal: 25,
      blocker: '🔴 Fase 1 (Setup Manual) - Requer execução local',
      color: 'red'
    },
    {
      id: 'sprint18',
      name: 'Sprint 18',
      title: 'Advise Integration Phase 2',
      status: 'parcial',
      progress: 88,
      tasksCompleted: 22,
      tasksTotal: 25,
      blocker: '⚠️ API Advise retorna dados vazios - Aguardando suporte',
      color: 'yellow'
    },
    {
      id: 'sprint19',
      name: 'Sprint 19',
      title: 'Freshdesk Integration & Tasks',
      status: 'iniciando',
      progress: 0,
      tasksCompleted: 0,
      tasksTotal: 20,
      blocker: '🟢 Pronto para início - Não depende de Sprint 18',
      color: 'green'
    }
  ];

  const totalProgress = Math.round((sprints.reduce((acc, s) => acc + (s.tasksCompleted), 0) / sprints.reduce((acc, s) => acc + s.tasksTotal, 0)) * 100);

  const sprint18Details = {
    completed: [
      { task: 'Criação de PublicacaoService', status: '✅' },
      { task: 'Criação de adviseIntegration function', status: '✅' },
      { task: 'Implementação de retry automático', status: '✅' },
      { task: 'Tratamento de erros estruturado', status: '✅' },
      { task: 'Fallback para endpoint alternativo', status: '✅' },
      { task: 'Logging detalhado para debug', status: '✅' }
    ],
    pending: [
      { task: 'API Advise retornando dados reais', status: '⏳ Bloqueado' },
      { task: 'Sincronização automática de publicações', status: '⏳ Aguardando API' },
      { task: 'Testes de carga', status: '⏳ Aguardando API' }
    ]
  };

  const sprint19Tasks = {
    fase1: {
      name: 'Fase 1: Integração Freshdesk',
      tasks: [
        { id: 's19_f1_1', label: 'Criar FreshdeskService (consultar tickets)', status: 'todo' },
        { id: 's19_f1_2', label: 'Criar FreshdeskRepository (salvar em DB)', status: 'todo' },
        { id: 's19_f1_3', label: 'Endpoint: sync de tickets', status: 'todo' },
        { id: 's19_f1_4', label: 'Validações de ticket', status: 'todo' },
        { id: 's19_f1_5', label: 'Testes básicos Freshdesk', status: 'todo' }
      ]
    },
    fase2: {
      name: 'Fase 2: Gerenciador de Tarefas',
      tasks: [
        { id: 's19_f2_1', label: 'Criar página Tarefas (lista + criar)', status: 'todo' },
        { id: 's19_f2_2', label: 'Integração Google Tasks', status: 'todo' },
        { id: 's19_f2_3', label: 'Integração Google Calendar', status: 'todo' },
        { id: 's19_f2_4', label: 'Sincronização bidirecional', status: 'todo' }
      ]
    },
    fase3: {
      name: 'Fase 3: Alertas & Notificações',
      tasks: [
        { id: 's19_f3_1', label: 'Sistema de alertas para prazos', status: 'todo' },
        { id: 's19_f3_2', label: 'Email reminders', status: 'todo' },
        { id: 's19_f3_3', label: 'Push notifications', status: 'todo' },
        { id: 's19_f3_4', label: 'Dashboard de alertas', status: 'todo' }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sprint Dashboard</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Visão consolidada do progresso de todos os sprints</p>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">Progresso Total do Produto</span>
                <Badge className="bg-blue-600 text-lg">{totalProgress}%</Badge>
              </div>
              <Progress value={totalProgress} className="h-4" />
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {sprints.reduce((acc, s) => acc + s.tasksCompleted, 0)}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">Completas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {sprints.reduce((acc, s) => acc + (s.tasksTotal - s.tasksCompleted), 0)}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">Pendentes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {sprints.reduce((acc, s) => acc + s.tasksTotal, 0)}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">Total</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sprint Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sprints.map((sprint) => (
            <Card key={sprint.id} className={`border-l-4 border-l-${sprint.color}-500`}>
              <CardHeader>
                <CardTitle className="text-lg">{sprint.name}</CardTitle>
                <CardDescription>{sprint.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <Badge className={`bg-${sprint.color}-600`}>{sprint.progress}%</Badge>
                  </div>
                  <Progress value={sprint.progress} />
                </div>
                
                <div className="text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    {sprint.tasksCompleted} de {sprint.tasksTotal} tarefas
                  </p>
                </div>

                <Alert className={`border-${sprint.color}-200 bg-${sprint.color}-50 dark:bg-${sprint.color}-900/20`}>
                  <AlertCircle className={`w-4 h-4 text-${sprint.color}-600`} />
                  <AlertDescription className={`text-${sprint.color}-800 dark:text-${sprint.color}-200 text-xs`}>
                    {sprint.blocker}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="sprint18" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sprint18">Sprint 18 (Consolidação)</TabsTrigger>
            <TabsTrigger value="sprint19">Sprint 19 (Planejamento)</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          </TabsList>

          {/* Sprint 18 Tab */}
          <TabsContent value="sprint18" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sprint 18 - Status Final (88%)</CardTitle>
                <CardDescription>Integração Advise - Phase 2</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Concluído */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Tarefas Concluídas (22/25)
                  </h4>
                  <div className="space-y-2">
                    {sprint18Details.completed.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{item.task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pendente */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Bloqueadores (3/25)
                  </h4>
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-200">
                      <strong>🔴 API Advise retorna data vazio</strong>
                      <p className="mt-2 text-sm">
                        A função consultarPublicacoes executa sem erros, mas a resposta vem vazia.
                        Código está 100% pronto para receber dados quando API responder.
                      </p>
                      <p className="mt-2 text-sm font-semibold">
                        Ação: Aguardando resposta do suporte Advise ou validação de credenciais.
                      </p>
                    </AlertDescription>
                  </Alert>
                </div>

                {/* Próximas ações */}
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">📋 Recomendações:</h4>
                  <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                    <li>✅ Sprint 18 pode ser considerado COMPLETO (código pronto)</li>
                    <li>⏳ Manter monitoramento da API Advise</li>
                    <li>🚀 Prosseguir com Sprint 19 em paralelo</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sprint 19 Tab */}
          <TabsContent value="sprint19" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sprint 19 - Planejamento Executivo</CardTitle>
                <CardDescription>Integração Freshdesk + Gerenciador de Tarefas (20 tarefas)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {Object.entries(sprint19Tasks).map(([key, fase]) => (
                  <div key={key}>
                    <h4 className="font-semibold mb-3 text-lg">{fase.name}</h4>
                    <div className="space-y-2">
                      {fase.tasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                          <div className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600" />
                          <span className="text-sm flex-1">{task.label}</span>
                          <Badge variant="outline" className="text-xs">⏳ TODO</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    <strong>✅ Sprint 19 ready to go!</strong> Não depende de Sprint 18. Pode começar imediatamente.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Roadmap Completo do Produto</CardTitle>
                <CardDescription>Visão geral até produção</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="space-y-4">
                  {/* Sprint 17 */}
                  <div className="border-l-4 border-l-red-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Sprint 17 - PWA Setup</h4>
                      <Badge variant="outline" className="text-red-600">8%</Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Setup manual, Lighthouse, PWA functionality, API testing, documentação
                    </p>
                    <p className="text-xs font-semibold text-red-600 mt-2">🔴 BLOQUEADO: Requer setup manual local (2-3 horas)</p>
                  </div>

                  {/* Sprint 18 */}
                  <div className="border-l-4 border-l-yellow-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Sprint 18 - Advise Integration Phase 2</h4>
                      <Badge variant="outline" className="text-yellow-600">88%</Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Publicações, retry automático, endpoint fallback, logging avançado
                    </p>
                    <p className="text-xs font-semibold text-yellow-600 mt-2">⚠️ BLOQUEADO: API Advise vazia (suporte necessário)</p>
                  </div>

                  {/* Sprint 19 */}
                  <div className="border-l-4 border-l-green-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Sprint 19 - Freshdesk + Tasks</h4>
                      <Badge variant="outline" className="text-green-600">0%</Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Integração Freshdesk, gerenciador de tarefas, Google Tasks/Calendar, alertas
                    </p>
                    <p className="text-xs font-semibold text-green-600 mt-2">🟢 PRONTO: Independente de Sprint 18</p>
                  </div>

                  {/* Sprint 20 */}
                  <div className="border-l-4 border-l-blue-500 pl-4 py-2 opacity-60">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Sprint 20 - Processos Advise</h4>
                      <Badge variant="outline">0%</Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Sincronização de processos, movimentos, prazos, intimações
                    </p>
                    <p className="text-xs font-semibold text-blue-600 mt-2">📅 PLANEJADO: Após Sprint 18 desbloqueado</p>
                  </div>

                  {/* Production */}
                  <div className="border-l-4 border-l-purple-500 pl-4 py-2 opacity-60">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">🚀 PRODUÇÃO</h4>
                      <Badge variant="outline">0%</Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Deploy, testes finais, documentação, publicação
                    </p>
                    <p className="text-xs font-semibold text-purple-600 mt-2">🎯 ESTIMADO: Após Sprint 20 100% completo</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">⏱️ Timeline Estimado:</h4>
                  <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span>Sprint 17 (bloqueado):</span>
                      <span className="font-semibold">2-3 horas</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sprint 18 (bloqueado):</span>
                      <span className="font-semibold">⏳ Aguardando</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sprint 19 (em progresso):</span>
                      <span className="font-semibold">5-7 dias</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sprint 20:</span>
                      <span className="font-semibold">5-7 dias</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>Total estimado:</span>
                      <span>2-3 semanas (após desbloqueios)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}