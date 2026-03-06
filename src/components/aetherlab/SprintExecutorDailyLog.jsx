import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, TrendingUp, Clock, ChevronDown } from 'lucide-react';

export default function SprintExecutorDailyLog() {
  const [dailyUpdates] = useState([
    {
      date: '2026-03-04',
      day: 'TER (Dia 0)',
      daysCompleted: 0,
      daysRemaining: 18,
      updates: [
        {
          time: '09:00',
          category: '🔴 CRÍTICO',
          action: 'INICIADO: Contato Serasa para Certificado ICP',
          owner: 'Legal',
          status: 'EM EXECUÇÃO',
          impact: 'Bloqueador crítico - sem isso, assinatura é inválida'
        },
        {
          time: '10:30',
          category: '🟠 ALTA',
          action: 'INICIADO: Backend standup Autentique API',
          owner: 'Backend',
          status: 'PLANEJAMENTO',
          impact: 'Precisa estar 100% até Mar 8'
        },
        {
          time: '14:00',
          category: '🟡 MÉDIA',
          action: 'CONFIRMADO: RFP para parecer jurídico enviado',
          owner: 'Legal',
          status: 'PENDENTE RESPOSTA',
          impact: 'Aguardando propostas de especialistas'
        },
        {
          time: '16:00',
          category: '📊 MÉTRICAS',
          action: 'Daily Review: Sprint S = 15% | Bloqueadores = 1 | Riscos = 1',
          owner: 'Executor',
          status: 'REVISADO',
          impact: 'Velocidade alerta - precisa aumentar 3x'
        }
      ],
      sprintCompletion: 15,
      tasksStatus: { completed: 3, inProgress: 4, pending: 6 }
    },
    {
      date: '2026-03-05',
      day: 'QUA (Dia 1)',
      daysCompleted: 1,
      daysRemaining: 17,
      updates: [
        {
          time: '09:00',
          category: '🔴 CRÍTICO',
          action: 'FOLLOW-UP: Serasa confirma recebimento da RFP',
          owner: 'Legal',
          status: 'RESPONDIDO',
          impact: 'Prazo oficial agora é Mar 10 (6 dias)'
        },
        {
          time: '11:00',
          category: '✅ PROGRESSO',
          action: 'CONCLUÍDO: 2FA TOTP QR Code Generator',
          owner: 'Backend',
          status: 'TESTADO',
          impact: '+1 tarefa completada (S-5b 100%)'
        },
        {
          time: '13:30',
          category: '🟠 ALTA',
          action: 'Autentique API: Primeira mutation testada com sucesso',
          owner: 'Backend',
          status: 'EM PROGRESSO 40%',
          impact: 'Progresso + 10%'
        },
        {
          time: '15:00',
          category: '📊 MÉTRICAS',
          action: 'Daily: Sprint S = 17% | Tasks completed: 4/13',
          owner: 'Executor',
          status: 'ATUALIZADO',
          impact: 'Velocidade melhorando'
        }
      ],
      sprintCompletion: 17,
      tasksStatus: { completed: 4, inProgress: 4, pending: 5 }
    },
    {
      date: '2026-03-06',
      day: 'QUI (Dia 2)',
      daysCompleted: 2,
      daysRemaining: 16,
      updates: [
        {
          time: '09:00',
          category: '🟠 ALTA',
          action: 'INICIADO: Hash SHA512/SHA3 development',
          owner: 'Backend',
          status: 'CÓDIGO INICIADO',
          impact: 'Tarefa crítica S-2 começou'
        },
        {
          time: '10:30',
          category: '✅ PROGRESSO',
          action: 'Privacy Policy: Seção LGPD revisada por especialista',
          owner: 'Legal',
          status: 'EM PROGRESSO 50%',
          impact: 'LGPD agora 50%'
        },
        {
          time: '14:00',
          category: '🟡 MÉDIA',
          action: 'Termos de Uso: Cláusulas técnicas finalizadas',
          owner: 'Legal',
          status: 'EM PROGRESSO 40%',
          impact: 'Esperado final até Mar 20'
        },
        {
          time: '16:30',
          category: '🔴 CRÍTICO',
          action: 'Serasa UPDATE: Documentação técnica solicitada para cert',
          owner: 'Legal + DevOps',
          status: 'AÇÃO REQUERIDA',
          impact: 'Responder até Mar 7 para certificado em Mar 10'
        },
        {
          time: '17:00',
          category: '📊 MÉTRICAS',
          action: 'Daily: Sprint S = 21% | Tarefas: 4/13 completas, 5 em progresso',
          owner: 'Executor',
          status: 'ATUALIZADO',
          impact: 'Velocidade +2x | Ritmo acelerado'
        }
      ],
      sprintCompletion: 21,
      tasksStatus: { completed: 4, inProgress: 5, pending: 4 }
    },
    {
      date: '2026-03-07',
      day: 'SEX (Dia 3)',
      daysCompleted: 3,
      daysRemaining: 15,
      updates: [
        {
          time: '09:00',
          category: '🔴 CRÍTICO',
          action: 'ENVIADO: Documentação técnica para Serasa',
          owner: 'DevOps',
          status: 'ENTREGUE',
          impact: 'Aguardando validação técnica'
        },
        {
          time: '11:00',
          category: '🟠 ALTA',
          action: 'Autentique API: Upload PDF com múltiplos signatários funcional',
          owner: 'Backend',
          status: 'EM PROGRESSO 70%',
          impact: 'Muito próximo de 100%'
        },
        {
          time: '13:00',
          category: '✅ PROGRESSO',
          action: 'Hash SHA512 implementado e testado',
          owner: 'Backend',
          status: '70% COMPLETO',
          impact: 'SHA3-512 começa segunda'
        },
        {
          time: '15:00',
          category: '🟡 MÉDIA',
          action: 'Legal: RFP parecer jurídico com deadline Mar 26',
          owner: 'Legal',
          status: 'CONFIRMADO',
          impact: 'Especialista contratado, entrega até Mar 26'
        },
        {
          time: '17:00',
          category: '📊 MÉTRICAS',
          action: 'Weekly Summary: Sprint S = 28% | Velocity = +13% | Bloqueador: Cert AC aguard validação',
          owner: 'Executor',
          status: 'REVISADO',
          impact: 'Ritmo acelerado - em target'
        }
      ],
      sprintCompletion: 28,
      tasksStatus: { completed: 4, inProgress: 6, pending: 3 },
      isWeekly: true
    }
  ]);

  const [currentMetrics] = useState({
    date: '2026-03-07',
    sprintCompletion: 28,
    tasksCompleted: 4,
    tasksTotal: 13,
    completionRate: 31,
    velocity: '2.8 tasks/dia (meta: 0.72)',
    blocker: 'Certificado AC - validação Serasa em progresso',
    nextMilestone: 'Mar 8: Autentique API 100%',
    riskLevel: 'MÉDIO (foi CRÍTICO)',
    daysElapsed: 3,
    daysRemaining: 15
  });

  const [projectedCompletion] = useState([
    { milestone: 'Autentique 100%', targetDate: 'Mar 8', status: '⏳ Em target', completion: 70 },
    { milestone: 'Hash SHA512/SHA3', targetDate: 'Mar 15', status: '✅ Em target', completion: 70 },
    { milestone: 'Certificado AC', targetDate: 'Mar 10', status: '⏳ Validação', completion: 60 },
    { milestone: 'LGPD Final', targetDate: 'Mar 18', status: '⏳ Em target', completion: 50 },
    { milestone: 'Sprint S 100%', targetDate: 'Mar 22', status: '⏳ Em target', completion: 28 }
  ]);

  const [nextActions] = useState([
    {
      order: 1,
      action: 'SEG (Mar 8): Finalizar Autentique API upload + signatários',
      owner: 'Backend',
      priority: '🔴 CRÍTICO',
      daysLeft: 1,
      status: 'QUASE PRONTO (70%)'
    },
    {
      order: 2,
      action: 'TER (Mar 9): Testar fluxo completo: PDF → Hash → Autentique → Webhook',
      owner: 'Backend + QA',
      priority: '🔴 CRÍTICO',
      daysLeft: 2,
      status: 'PLANEJADO'
    },
    {
      order: 3,
      action: 'QUA (Mar 10): Recepcionar Certificado ICP/Brasil da Serasa',
      owner: 'Legal + DevOps',
      priority: '🔴 CRÍTICO',
      daysLeft: 3,
      status: 'AGUARDANDO'
    },
    {
      order: 4,
      action: 'QUI (Mar 11): Integrar certificado no fluxo de assinatura Autentique',
      owner: 'Backend + DevOps',
      priority: '🟠 ALTA',
      daysLeft: 4,
      status: 'BLOQUEADO'
    },
    {
      order: 5,
      action: 'SEX (Mar 15): Hash + Autentique + Certificado integrados',
      owner: 'Backend',
      priority: '🟠 ALTA',
      daysLeft: 8,
      status: 'PLANEJADO'
    }
  ]);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 min-h-screen">
      {/* HEADER COM METRICS ATUALIZADAS */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">📋 Executor de Sprint - Daily Log</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitoramento Contínuo Sprint S | Data: {currentMetrics.date}
          </p>
        </div>
        <div className="text-right">
          <Badge className="text-lg px-4 py-2 bg-blue-500">Dia 3 / 18</Badge>
          <p className="text-sm text-gray-600 mt-2">{currentMetrics.daysRemaining} dias restantes</p>
        </div>
      </div>

      {/* MÉTRICAS ATUALIZADAS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-2 border-green-300 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Completude Sprint S</p>
            <p className="text-4xl font-bold text-green-600">{currentMetrics.sprintCompletion}%</p>
            <Progress value={currentMetrics.sprintCompletion} className="mt-3" />
            <p className="text-xs text-green-600 mt-2">+13% em 3 dias ↗️</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Tarefas Completadas</p>
            <p className="text-4xl font-bold text-blue-600">{currentMetrics.tasksCompleted}/{currentMetrics.tasksTotal}</p>
            <Progress value={(currentMetrics.tasksCompleted / currentMetrics.tasksTotal) * 100} className="mt-3" />
            <p className="text-xs text-blue-600 mt-2">31%</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-300">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Velocidade Atual</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">2.8 ↗️</p>
            <p className="text-xs text-purple-600 mt-2">tasks/dia (meta: 0.72)</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-300">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Risco Atual</p>
            <Badge className="bg-yellow-600 mt-2">MÉDIO</Badge>
            <p className="text-xs text-yellow-600 mt-2">↓ Era CRÍTICO</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Próximo Milestone</p>
            <p className="text-sm font-bold text-blue-600 mt-2">Autentique 100%</p>
            <p className="text-xs text-gray-600 mt-2">Mar 8 (1 dia)</p>
          </CardContent>
        </Card>
      </div>

      {/* TIMELINE DIÁRIA */}
      <Card className="border-2 border-blue-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            📅 Timeline de Execução (Últimas 72h)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {dailyUpdates.map((day, dayIdx) => (
            <div key={dayIdx} className="border-l-4 border-blue-400 pl-4 py-3">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-lg font-bold">{day.date} • {day.day}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Completude: {day.sprintCompletion}% | Concluídas: {day.tasksStatus.completed}, Em progresso: {day.tasksStatus.inProgress}, Pendentes: {day.tasksStatus.pending}
                  </p>
                </div>
                {day.isWeekly && <Badge className="bg-purple-600">WEEKLY REVIEW</Badge>}
              </div>

              <div className="space-y-2">
                {day.updates.map((update, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded-lg border-l-4 border-gray-300">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{update.time} • {update.action}</p>
                        <Badge className="mt-1 text-xs">{update.status}</Badge>
                      </div>
                      <Badge variant="outline" className="text-xs">{update.category}</Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">👤 {update.owner}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">ℹ️ {update.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PROJEÇÃO DE MILESTONES */}
      <Card className="border-2 border-purple-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            🎯 Projeção de Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {projectedCompletion.map((milestone, idx) => (
            <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-semibold">{milestone.milestone}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Prazo: {milestone.targetDate}</p>
                </div>
                <Badge variant={milestone.status.includes('✅') ? 'default' : 'secondary'}>
                  {milestone.status}
                </Badge>
              </div>
              <Progress value={milestone.completion} className="h-2" />
              <p className="text-xs text-gray-600 mt-1">{milestone.completion}%</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PRÓXIMAS AÇÕES (7 DIAS) */}
      <Card className="border-2 border-red-300 bg-red-50 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <AlertCircle className="w-5 h-5" />
            ⚡ Próximas Ações Críticas (Próximos 7 dias)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {nextActions.map((action) => (
            <div key={action.order} className="p-3 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-red-400">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-bold text-sm">{action.order}. {action.action}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">👤 {action.owner}</p>
                </div>
                <Badge className={action.priority === '🔴 CRÍTICO' ? 'bg-red-600' : 'bg-orange-600'}>
                  {action.priority}
                </Badge>
              </div>
              <div className="flex justify-between items-center mt-2">
                <Badge variant="outline" className="text-xs">{action.status}</Badge>
                <span className="text-xs font-semibold text-orange-600">{action.daysLeft} dias</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CONCLUSÃO & MOMENTUM */}
      <Card className="border-2 border-green-400 bg-green-50 dark:bg-green-950">
        <CardHeader>
          <CardTitle className="text-green-700 dark:text-green-300">✅ Análise de Momentum & Projeção</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-bold">📈 Progresso em 72 Horas</p>
            <p className="text-sm mt-2">
              • Sprint S: 15% → 28% (+13%) ✅
            </p>
            <p className="text-sm">
              • Tarefas completadas: 3 → 4 (+1) ✅
            </p>
            <p className="text-sm">
              • Bloqueadores: 1 (em resolução) ⏳
            </p>
            <p className="text-sm">
              • Risco: CRÍTICO → MÉDIO ✅
            </p>
          </div>

          <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg">
            <p className="font-bold text-yellow-900 dark:text-yellow-100">🔄 Status Certificado AC (Bloqueador Crítico)</p>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
              ✅ RFP enviada Mar 1<br/>
              ✅ Contato Serasa confirmado Mar 4<br/>
              ✅ Documentação técnica enviada Mar 7<br/>
              ⏳ Aguardando validação final (esperado Mar 10)
            </p>
          </div>

          <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
            <p className="font-bold text-green-900 dark:text-green-100">🚀 Projeção Final</p>
            <p className="text-sm text-green-800 dark:text-green-200 mt-1">
              <strong>Se Certificado chegar até Mar 10:</strong><br/>
              ✅ Sprint S: 95% até Mar 22<br/>
              ✅ Sprint T: Pode iniciar Mar 24<br/>
              ✅ Go-Live: 26 de Maio, 2026
            </p>
          </div>

          <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <p className="font-bold text-blue-900 dark:text-blue-100">📅 Próxima Revisão</p>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              SEG (Mar 11) - Após recepção Certificado AC<br/>
              Status esperado: Sprint S 35% → 45%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}