import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Zap,
  Server,
  Bell,
  Loader2
} from 'lucide-react';

/**
 * Página de Validação Sprint 19 - Freshdesk + Gerenciador de Tarefas
 */
export default function Sprint19Validation() {
  const [completedTasks, setCompletedTasks] = useState([]);

  const phases = {
    phase1: {
      name: 'Fase 1: Integração Freshdesk',
      description: 'Sincronização de tickets com o banco de dados',
      items: [
        { id: 'p1_1', label: 'Criar FreshdeskService (consultarTickets)', required: true },
        { id: 'p1_2', label: 'Criar FreshdeskRepository (salvarTickets)', required: true },
        { id: 'p1_3', label: 'Backend: endpoint /freshdesk/sync', required: true },
        { id: 'p1_4', label: 'Validações de dados de ticket', required: true },
        { id: 'p1_5', label: 'Testes básicos da integração', required: true }
      ]
    },
    phase2: {
      name: 'Fase 2: Gerenciador de Tarefas (Task Manager)',
      description: 'Interface para criar e gerenciar tarefas',
      items: [
        { id: 'p2_1', label: 'Página Tarefas com lista de tasks', required: true },
        { id: 'p2_2', label: 'Criar nova tarefa (form)', required: true },
        { id: 'p2_3', label: 'Editar status de tarefa', required: true },
        { id: 'p2_4', label: 'Integração Google Tasks (sync)', required: true },
        { id: 'p2_5', label: 'Integração Google Calendar (eventos)', required: true }
      ]
    },
    phase3: {
      name: 'Fase 3: Sistema de Alertas & Notificações',
      description: 'Lembretes automáticos para prazos e tarefas',
      items: [
        { id: 'p3_1', label: 'AlertasInteligentes component', required: true },
        { id: 'p3_2', label: 'Cálculo automático de prazos', required: true },
        { id: 'p3_3', label: 'Email reminders (sendEmailReminder function)', required: true },
        { id: 'p3_4', label: 'Push notifications para alertas', required: true },
        { id: 'p3_5', label: 'Dashboard de alertas ativos', required: true }
      ]
    },
    phase4: {
      name: 'Fase 4: Testes & Documentação',
      description: 'Validação completa e documentação',
      items: [
        { id: 'p4_1', label: 'Testar sincronização Freshdesk E2E', required: true },
        { id: 'p4_2', label: 'Testar criação/edição de tarefas', required: true },
        { id: 'p4_3', label: 'Testar alertas e notificações', required: true },
        { id: 'p4_4', label: 'Documentar endpoints e flows', required: true }
      ]
    }
  };

  const toggleTask = (taskId) => {
    setCompletedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const calculateProgress = (phaseItems) => {
    const completed = phaseItems.filter(item => completedTasks.includes(item.id)).length;
    return Math.round((completed / phaseItems.length) * 100);
  };

  const allTasks = Object.values(phases).flatMap(phase => phase.items);
  const totalProgress = Math.round((completedTasks.length / allTasks.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sprint 19 Validation</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Freshdesk Integration + Task Manager + Alerts (20 tarefas)</p>
            </div>
          </div>

          {/* Overall Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Progresso Total</span>
                  <Badge className="bg-purple-600">{totalProgress}%</Badge>
                </div>
                <Progress value={totalProgress} className="h-3" />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {completedTasks.length} de {allTasks.length} tarefas concluídas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Fases */}
        <Tabs defaultValue="phase1" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="phase1" className="text-xs">Fase 1</TabsTrigger>
            <TabsTrigger value="phase2" className="text-xs">Fase 2</TabsTrigger>
            <TabsTrigger value="phase3" className="text-xs">Fase 3</TabsTrigger>
            <TabsTrigger value="phase4" className="text-xs">Fase 4</TabsTrigger>
          </TabsList>

          {/* Fase 1: Freshdesk */}
          <TabsContent value="phase1" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  {phases.phase1.name}
                </CardTitle>
                <CardDescription>{phases.phase1.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <Badge>{calculateProgress(phases.phase1.items)}%</Badge>
                  </div>
                  <Progress value={calculateProgress(phases.phase1.items)} />
                </div>

                <div className="space-y-2">
                  {phases.phase1.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800">
                      <Checkbox
                        checked={completedTasks.includes(item.id)}
                        onCheckedChange={() => toggleTask(item.id)}
                      />
                      <span className={completedTasks.includes(item.id) ? 'line-through text-gray-400' : ''}>
                        {item.label}
                      </span>
                      {item.required && <Badge variant="outline" className="ml-auto text-xs">Requerido</Badge>}
                    </div>
                  ))}
                </div>

                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription className="text-sm">
                    <strong>Dependências:</strong> FRESHDESK_API_KEY em secrets (configure se não tiver)
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fase 2: Task Manager */}
          <TabsContent value="phase2" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  {phases.phase2.name}
                </CardTitle>
                <CardDescription>{phases.phase2.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <Badge>{calculateProgress(phases.phase2.items)}%</Badge>
                  </div>
                  <Progress value={calculateProgress(phases.phase2.items)} />
                </div>

                <div className="space-y-2">
                  {phases.phase2.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800">
                      <Checkbox
                        checked={completedTasks.includes(item.id)}
                        onCheckedChange={() => toggleTask(item.id)}
                      />
                      <span className={completedTasks.includes(item.id) ? 'line-through text-gray-400' : ''}>
                        {item.label}
                      </span>
                      {item.required && <Badge variant="outline" className="ml-auto text-xs">Requerido</Badge>}
                    </div>
                  ))}
                </div>

                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription className="text-sm">
                    <strong>Integrações:</strong> Google Tasks e Google Calendar via App Connectors (será solicitado ao usuário)
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fase 3: Alertas */}
          <TabsContent value="phase3" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  {phases.phase3.name}
                </CardTitle>
                <CardDescription>{phases.phase3.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <Badge>{calculateProgress(phases.phase3.items)}%</Badge>
                  </div>
                  <Progress value={calculateProgress(phases.phase3.items)} />
                </div>

                <div className="space-y-2">
                  {phases.phase3.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800">
                      <Checkbox
                        checked={completedTasks.includes(item.id)}
                        onCheckedChange={() => toggleTask(item.id)}
                      />
                      <span className={completedTasks.includes(item.id) ? 'line-through text-gray-400' : ''}>
                        {item.label}
                      </span>
                      {item.required && <Badge variant="outline" className="ml-auto text-xs">Requerido</Badge>}
                    </div>
                  ))}
                </div>

                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription className="text-sm">
                    <strong>Dependências:</strong> sendEmailReminder function + push notifications backend
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fase 4: Testes */}
          <TabsContent value="phase4" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {phases.phase4.name}
                </CardTitle>
                <CardDescription>{phases.phase4.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <Badge>{calculateProgress(phases.phase4.items)}%</Badge>
                  </div>
                  <Progress value={calculateProgress(phases.phase4.items)} />
                </div>

                <div className="space-y-2">
                  {phases.phase4.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800">
                      <Checkbox
                        checked={completedTasks.includes(item.id)}
                        onCheckedChange={() => toggleTask(item.id)}
                      />
                      <span className={completedTasks.includes(item.id) ? 'line-through text-gray-400' : ''}>
                        {item.label}
                      </span>
                      {item.required && <Badge variant="outline" className="ml-auto text-xs">Requerido</Badge>}
                    </div>
                  ))}
                </div>

                {totalProgress === 100 && (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-200 font-semibold">
                      ✅ Sprint 19 COMPLETO! Pronto para iniciar Sprint 20
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Card */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Resumo do Sprint 19
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{completedTasks.length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Concluídas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-400">{allTasks.length - completedTasks.length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Pendentes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{totalProgress}%</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Progresso</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">5-7</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Dias estimados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}