import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, AlertCircle, Zap, Target, TrendingUp, ArrowRight, Clock } from 'lucide-react';

export default function SprintExecutorMasterDashboard() {
  const [executorData] = useState({
    currentDate: '2026-03-04 (TER)',
    role: 'Executor de Sprint',
    sprintCurrent: 'Sprint S',
    sprintNext: 'Sprint T',
    globalProgress: 15,
    daysElapsed: 0,
    daysTotal: 18,
    sprintStartDate: '2026-03-04',
    sprintEndDate: '2026-03-22'
  });

  const [sprints] = useState([
    {
      id: 'S',
      name: 'Sprint S',
      phase: 'Integração Autentique + Hash + Conformidade Legal',
      period: 'Mar 4-22, 2026 (18 dias)',
      startDate: '2026-03-04',
      endDate: '2026-03-22',
      status: 'ATIVO',
      completion: 15,
      tasks: [
        { id: 'S-1', task: 'Integração Autentique GraphQL', owner: 'Backend', status: 'inprogress', completion: 30, category: 'Técnico', deadline: 'Mar 8' },
        { id: 'S-2', task: 'Hash SHA512 + SHA3-512', owner: 'Backend', status: 'pending', completion: 0, category: 'Técnico', deadline: 'Mar 15' },
        { id: 'S-3', task: 'Privacy Policy + LGPD', owner: 'Legal', status: 'inprogress', completion: 40, category: 'Legal', deadline: 'Mar 18' },
        { id: 'S-4', task: 'Termos de Uso Finais', owner: 'Legal', status: 'inprogress', completion: 30, category: 'Legal', deadline: 'Mar 20' },
        { id: 'S-5', task: '2FA TOTP + TLS 1.3', owner: 'Backend', status: 'inprogress', completion: 50, category: 'Segurança', deadline: 'Mar 12' },
        { id: 'S-6', task: 'PDF/A-2B Generator', owner: 'Backend', status: 'pending', completion: 20, category: 'Técnico', deadline: 'Mar 20' },
        { id: 'S-7', task: 'Captura Metadados Forenses', owner: 'Backend', status: 'pending', completion: 0, category: 'Técnico', deadline: 'Mar 18' },
        { id: 'S-8', task: 'Parecer Jurídico Especialista', owner: 'Legal', status: 'pending', completion: 0, category: 'Legal', deadline: 'Mar 26' },
        { id: 'S-9', task: 'Certificado ICP/Brasil', owner: 'Legal + DevOps', status: 'blocker', completion: 0, category: 'Conformidade', deadline: 'Mar 10', blocker: true },
        { id: 'S-10', task: 'Testes de Integração', owner: 'QA', status: 'pending', completion: 0, category: 'QA', deadline: 'Mar 15' },
        { id: 'S-11', task: 'Deploy Staging', owner: 'DevOps', status: 'pending', completion: 0, category: 'DevOps', deadline: 'Mar 18' },
        { id: 'S-12', task: 'Documentação Técnica', owner: 'Backend', status: 'pending', completion: 0, category: 'Documentação', deadline: 'Mar 15' },
        { id: 'S-13', task: 'Validador Online (UI)', owner: 'Frontend', status: 'pending', completion: 10, category: 'Frontend', deadline: 'Mar 20' }
      ],
      completedTasks: [
        { id: 'S-5a', task: 'TLS 1.3 Verificado', owner: 'DevOps', date: 'Mar 1' },
        { id: 'S-5b', task: '2FA TOTP Framework', owner: 'Backend', date: 'Mar 3' },
        { id: 'S-3a', task: 'LGPD Compliance Rascunho', owner: 'Legal', date: 'Mar 2' }
      ],
      milestones: [
        { id: 'M1', task: 'Autentique API 100%', deadline: 'Mar 8', status: 'upcoming' },
        { id: 'M2', task: 'Certificado AC em mão', deadline: 'Mar 10', status: 'critical' },
        { id: 'M3', task: 'Hash implementado', deadline: 'Mar 15', status: 'upcoming' },
        { id: 'M4', task: 'Documentação Legal Completa', deadline: 'Mar 18', status: 'upcoming' },
        { id: 'M5', task: 'Testes Completos', deadline: 'Mar 20', status: 'upcoming' },
        { id: 'M6', task: 'Sprint S 95% Completo', deadline: 'Mar 22', status: 'target' }
      ]
    },
    {
      id: 'T',
      name: 'Sprint T',
      phase: 'Assinatura Digital + Metadados Forenses Avançados',
      period: 'Mar 24 - Abr 6, 2026 (14 dias)',
      startDate: '2026-03-24',
      endDate: '2026-04-06',
      status: 'PLANEJADO',
      completion: 0,
      tasks: [
        { id: 'T-1', task: 'Assinatura com Autentique SDK', owner: 'Backend', status: 'pending', completion: 0, category: 'Técnico', deadline: 'Mar 28' },
        { id: 'T-2', task: 'Captura Metadados Forenses Avançada', owner: 'Backend', status: 'pending', completion: 0, category: 'Técnico', deadline: 'Abr 1' },
        { id: 'T-3', task: 'Validador Online (UI)', owner: 'Frontend', status: 'pending', completion: 0, category: 'Frontend', deadline: 'Abr 6' }
      ],
      readiness: 'CONDICIONAL (aguarda Sprint S 90%+)',
      blockers: ['Autentique deve estar 100%', 'Certificado AC em produção', 'Hash SHA512/SHA3 integrado']
    }
  ]);

  const [dailyStatus] = useState({
    date: '2026-03-04',
    time: '09:00',
    tasksCompleted: 3,
    tasksInProgress: 4,
    tasksPending: 6,
    blockers: 1,
    risks: 1,
    completion: 15,
    velocity: '0 tasks/dia (início)'
  });

  const [executionPlan] = useState([
    {
      week: 'Semana 1 (Mar 4-8)',
      objectives: [
        '🔴 CRÍTICO: Contato com Serasa para certificado AC',
        '🔴 CRÍTICO: Autentique API funcional com upload PDF',
        '🟠 ALTA: Backend Hash SHA512/SHA3 iniciado',
        '🟡 MÉDIA: RFP parecer jurídico enviado'
      ],
      expectedCompletion: '~30%',
      milestoneDates: ['Mar 8: Autentique 100%']
    },
    {
      week: 'Semana 2 (Mar 9-15)',
      objectives: [
        '🔴 CRÍTICO: Receber certificado AC de Serasa',
        '🔴 CRÍTICO: Integrar hash com Autentique',
        '🟠 ALTA: Hash SHA512/SHA3 100% implementado',
        '🟡 MÉDIA: Privacy Policy LGPD finalizada'
      ],
      expectedCompletion: '~60%',
      milestoneDates: ['Mar 10: Certificado AC', 'Mar 15: Hash integrado']
    },
    {
      week: 'Semana 3 (Mar 16-22)',
      objectives: [
        '🔴 CRÍTICO: Testes E2E do fluxo completo',
        '🟠 ALTA: Documentação legal completa',
        '🟠 ALTA: Deploy Staging com tudo integrado',
        '🟡 MÉDIA: PDF/A-2B Generator funcional'
      ],
      expectedCompletion: '~95%',
      milestoneDates: ['Mar 22: Sprint S 95% completo']
    }
  ]);

  const [blockers] = useState([
    {
      id: 'BLOCK-1',
      task: 'Certificado ICP/Brasil',
      status: 'Em resolução',
      impact: 'Crítico - sem certificado, assinatura não é válida legalmente',
      deadline: 'Mar 10',
      owner: 'Legal + DevOps',
      action: 'Contato diário com Serasa, backup com Certisign'
    }
  ]);

  const [pendingActions] = useState([
    {
      order: 1,
      action: 'Finalizar Autentique API (upload PDF com múltiplos signatários)',
      owner: 'Backend',
      deadline: 'Mar 8',
      priority: '🔴 CRÍTICO',
      estimatedHours: 8
    },
    {
      order: 2,
      action: 'Implementar Hash SHA512/SHA3',
      owner: 'Backend',
      deadline: 'Mar 15',
      priority: '🔴 CRÍTICO',
      estimatedHours: 16
    },
    {
      order: 3,
      action: 'Receber e integrar Certificado ICP/Brasil',
      owner: 'Legal + DevOps',
      deadline: 'Mar 10',
      priority: '🔴 CRÍTICO',
      estimatedHours: 4
    },
    {
      order: 4,
      action: 'Privacy Policy LGPD + Termos de Uso finalizados',
      owner: 'Legal',
      deadline: 'Mar 18',
      priority: '🟠 ALTA',
      estimatedHours: 12
    },
    {
      order: 5,
      action: 'Testes de integração E2E',
      owner: 'QA',
      deadline: 'Mar 20',
      priority: '🟠 ALTA',
      estimatedHours: 20
    }
  ]);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 min-h-screen">
      {/* HEADER EXECUTOR */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">🎯 Executor de Sprint - Master Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Papel: {executorData.role} | Data: {executorData.currentDate}
          </p>
        </div>
        <Badge className="text-lg px-4 py-2 bg-blue-600">{executorData.sprintCurrent} ATIVO</Badge>
      </div>

      {/* RESUMO GLOBAL */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <Card className="border-2 border-green-300 col-span-2">
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Progresso Global {executorData.sprintCurrent}</p>
            <p className="text-4xl font-bold text-green-600 mt-2">{executorData.globalProgress}%</p>
            <Progress value={executorData.globalProgress} className="mt-3 h-2" />
            <p className="text-xs text-green-600 mt-1">
              {executorData.daysElapsed}/{executorData.daysTotal} dias | {executorData.daysTotal - executorData.daysElapsed} dias restantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Concluído</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{dailyStatus.tasksCompleted}</p>
            <p className="text-xs text-gray-600 mt-1">tarefas completas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Em Progresso</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{dailyStatus.tasksInProgress}</p>
            <p className="text-xs text-gray-600 mt-1">em execução</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Pendente</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{dailyStatus.tasksPending}</p>
            <p className="text-xs text-gray-600 mt-1">aguardando início</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-300">
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Bloqueadores</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{dailyStatus.blockers}</p>
            <p className="text-xs text-red-600 mt-1">crítico</p>
          </CardContent>
        </Card>
      </div>

      {/* BLOQUEADORES CRÍTICOS */}
      {blockers.length > 0 && (
        <Card className="border-2 border-red-500 bg-red-50 dark:bg-red-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertCircle className="w-5 h-5" />
              🚨 Bloqueadores Críticos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {blockers.map((blocker) => (
              <div key={blocker.id} className="p-3 bg-white dark:bg-red-900 rounded-lg border-l-4 border-red-600">
                <p className="font-bold text-lg">{blocker.id}: {blocker.task}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Status: <Badge className="bg-yellow-600">{blocker.status}</Badge></p>
                <p className="text-sm text-red-700 dark:text-red-300 font-semibold mt-2">⚠️ {blocker.impact}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  📅 {blocker.deadline} | 👤 {blocker.owner}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  ✓ Ação: {blocker.action}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* SPRINT S - STATUS DETALHADO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            {sprints[0].name} - {sprints[0].status}
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {sprints[0].phase} | {sprints[0].period}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* PROGRESSO GERAL */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">Progresso Geral</p>
              <p className="text-xl font-bold text-green-600">{sprints[0].completion}%</p>
            </div>
            <Progress value={sprints[0].completion} className="h-3" />
          </div>

          {/* TAREFAS POR CATEGORIA */}
          <div className="space-y-3">
            {['Técnico', 'Legal', 'Segurança', 'Conformidade', 'QA', 'DevOps', 'Frontend', 'Documentação'].map((category) => {
              const categoryTasks = sprints[0].tasks.filter(t => t.category === category);
              if (categoryTasks.length === 0) return null;
              
              const completed = categoryTasks.filter(t => t.status === 'done').length;
              const inProgress = categoryTasks.filter(t => t.status === 'inprogress').length;
              const pending = categoryTasks.filter(t => t.status === 'pending').length;
              const blocked = categoryTasks.filter(t => t.status === 'blocker').length;
              
              return (
                <div key={category} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-sm">{category}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {completed} ✅ | {inProgress} ⏳ | {pending} ❌ {blocked > 0 && `| ${blocked} 🚨`}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex-1 bg-green-200 dark:bg-green-700 rounded text-xs text-center py-1" style={{width: `${(completed/categoryTasks.length)*100}%`}}>
                      {completed > 0 && completed}
                    </div>
                    <div className="flex-1 bg-blue-200 dark:bg-blue-700 rounded text-xs text-center py-1" style={{width: `${(inProgress/categoryTasks.length)*100}%`}}>
                      {inProgress > 0 && inProgress}
                    </div>
                    <div className="flex-1 bg-orange-200 dark:bg-orange-700 rounded text-xs text-center py-1" style={{width: `${(pending/categoryTasks.length)*100}%`}}>
                      {pending > 0 && pending}
                    </div>
                    {blocked > 0 && <div className="flex-1 bg-red-200 dark:bg-red-700 rounded text-xs text-center py-1" style={{width: `${(blocked/categoryTasks.length)*100}%`}}>
                      {blocked}
                    </div>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* MILESTONES */}
          <div className="mt-6">
            <p className="font-bold text-lg mb-3">📍 Milestones {sprints[0].name}</p>
            <div className="space-y-2">
              {sprints[0].milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                  {milestone.status === 'critical' && <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
                  {milestone.status === 'upcoming' && <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                  {milestone.status === 'target' && <Target className="w-4 h-4 text-green-600 flex-shrink-0" />}
                  
                  <span className="flex-1 font-semibold">{milestone.task}</span>
                  <Badge variant="outline" className="text-xs">{milestone.deadline}</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PLANO DE EXECUÇÃO (3 SEMANAS) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            📅 Plano de Execução por Semana
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {executionPlan.map((week, idx) => (
            <div key={idx} className="border-l-4 border-blue-400 pl-4 py-3">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-lg">{week.week}</p>
                <Badge className="bg-green-600">{week.expectedCompletion}</Badge>
              </div>
              <ul className="space-y-1 text-sm">
                {week.objectives.map((obj, i) => (
                  <li key={i}>✓ {obj}</li>
                ))}
              </ul>
              <div className="mt-2 flex gap-2 flex-wrap">
                {week.milestoneDates.map((date, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{date}</Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PRÓXIMAS AÇÕES CRÍTICAS */}
      <Card className="border-2 border-orange-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
            <Zap className="w-5 h-5" />
            ⚡ Próximas Ações Críticas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {pendingActions.map((action) => (
            <div key={action.order} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm border-l-4 border-orange-400">
              <div className="flex justify-between items-start">
                <p className="font-semibold flex-1">{action.order}. {action.action}</p>
                <Badge className={action.priority.includes('🔴') ? 'bg-red-600' : 'bg-orange-600'}>
                  {action.priority}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                👤 {action.owner} | 📅 {action.deadline} | ⏱ {action.estimatedHours}h
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SPRINT T - PLANEJAMENTO */}
      <Card className="border-2 border-purple-300 bg-purple-50 dark:bg-purple-950">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-purple-700 dark:text-purple-300">{sprints[1].name} - {sprints[1].status}</CardTitle>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {sprints[1].phase} | {sprints[1].period}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Badge className="bg-orange-600">{sprints[1].readiness}</Badge>
          
          <div>
            <p className="font-semibold text-sm mb-2">Pré-requisitos para iniciar:</p>
            <ul className="space-y-1 text-sm">
              {sprints[1].blockers.map((blocker, idx) => (
                <li key={idx}>✓ {blocker}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              📌 Sprint T inicia Mar 24 (após Sprint S 90% completo)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CONCLUSÃO & PRÓXIMOS PASSOS */}
      <Card className="border-2 border-green-400 bg-green-50 dark:bg-green-950">
        <CardHeader>
          <CardTitle className="text-green-700 dark:text-green-300">✅ Resumo Executor & Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="font-bold">📊 Status Sprint S</p>
            <p className="text-sm mt-1">
              Completude: 15% | Tarefas: 3/13 concluídas | Bloqueadores: 1 (crítico)
            </p>
          </div>

          <div>
            <p className="font-bold">🎯 O Que Fazer AGORA (Próximas 24h)</p>
            <ul className="text-sm space-y-1 mt-1">
              <li>✅ <strong className="text-red-700 dark:text-red-300">Contato urgente com Serasa</strong> - certificado AC</li>
              <li>✅ <strong className="text-red-700 dark:text-red-300">Backend finalizar Autentique API</strong> - upload até Mar 8</li>
              <li>✅ <strong className="text-red-700 dark:text-red-300">RFP para parecer jurídico</strong> - especialista até Mar 26</li>
              <li>✅ Daily standup 09:00 para remover bloqueadores</li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <p className="font-bold text-green-900 dark:text-green-100">🚀 Projeção Final</p>
            <p className="text-sm text-green-800 dark:text-green-200 mt-1">
              <strong>Sprint S:</strong> 95% até Mar 22<br/>
              <strong>Sprint T:</strong> 100% até Abr 6<br/>
              <strong>Go-Live:</strong> 26 de Maio, 2026 ✅
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}