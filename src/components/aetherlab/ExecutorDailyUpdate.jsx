import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Clock, TrendingUp } from 'lucide-react';

export default function ExecutorDailyUpdate() {
  const [updateDate] = useState('2026-03-04 | 10:30 Manaus');

  const [dailyUpdate] = useState({
    sprintDay: 1,
    totalDays: 18,
    globalCompletion: 15,
    targetCompletion: 95,
    goLiveDate: 'May 26, 2026'
  });

  const [todayActions] = useState([
    {
      time: '17:00',
      action: 'Contato Serasa - Certificado AC',
      owner: 'Legal',
      status: '⏳ AGUARDANDO',
      priority: '🔴 CRÍTICO',
      outcome: null,
      notes: 'Sem certificado = sem assinatura digital válida'
    },
    {
      time: '18:00',
      action: 'RFP Parecer Jurídico',
      owner: 'Legal',
      status: '⏳ AGUARDANDO',
      priority: '🔴 CRÍTICO',
      outcome: null,
      notes: 'Pivô para Hash design + Compliance decisions'
    },
    {
      time: 'EOD',
      action: 'Autentique API Upload Status Check',
      owner: 'Backend',
      status: '🔵 EM EXECUÇÃO',
      priority: '🔴 CRÍTICO',
      outcome: null,
      notes: 'Target: 75% → 80% hoje'
    },
    {
      time: 'EOD',
      action: 'Daily Standup - Sincronização Squad',
      owner: 'Executor + Leads',
      status: '⏳ AGUARDANDO',
      priority: '🟠 ALTA',
      outcome: null,
      notes: 'Alinhar blockers, remover impedimentos'
    }
  ]);

  const [completionBreakdown] = useState({
    completed: {
      count: 3,
      percentage: 23,
      tasks: [
        { task: 'TLS 1.3 Verificado', team: 'DevOps', date: 'Mar 1', completion: 100 },
        { task: 'LGPD Compliance Base', team: 'Legal', date: 'Mar 2', completion: 100 },
        { task: '2FA TOTP Framework', team: 'Backend', date: 'Mar 3', completion: 100 }
      ]
    },
    inProgress: {
      count: 4,
      percentage: 31,
      avgCompletion: 37.5,
      tasks: [
        { task: 'Autentique API Upload', team: 'Backend', completion: 75, deadline: 'Mar 8' },
        { task: '2FA TOTP Completo', team: 'Backend', completion: 50, deadline: 'Mar 12' },
        { task: 'Privacy Policy LGPD', team: 'Legal', completion: 40, deadline: 'Mar 18' },
        { task: 'Termos de Uso', team: 'Legal', completion: 30, deadline: 'Mar 20' }
      ]
    },
    pending: {
      count: 6,
      percentage: 46,
      tasks: [
        'Hash SHA512 + SHA3-512 (Mar 15)',
        'PDF/A-2B Generator (Mar 20)',
        'Metadados Forenses (Mar 18)',
        'Parecer Jurídico (Mar 26)',
        'Testes E2E (Mar 20)',
        'Deploy Staging (Mar 22)'
      ]
    },
    blocked: {
      count: 1,
      percentage: 8,
      tasks: [
        'Certificado ICP/Brasil (Serasa) - Ação: Contato 17:00'
      ]
    }
  });

  const [weekProjection] = useState([
    {
      week: 'Semana 1',
      range: 'Mar 4-8',
      status: '🔴 EM EXECUÇÃO',
      targetCompletion: 30,
      currentCompletion: 15,
      gap: 15,
      criticalTasks: [
        'Contato Serasa (TODAY 17:00) 🔴',
        'RFP Parecer (TODAY 18:00) 🔴',
        'Autentique API 100% (Mar 8) 🔴',
        'Audit Endpoints (Mar 8) 🔴'
      ],
      riskLevel: 'ALTO'
    },
    {
      week: 'Semana 2',
      range: 'Mar 9-15',
      status: '🟠 PLANEJADO',
      targetCompletion: 60,
      currentCompletion: 30,
      gap: 30,
      criticalTasks: [
        '2FA TOTP 100% (Mar 12)',
        'Hash Design (Mar 15)',
        'Webhooks Setup (Mar 12)',
        'Privacy Policy 100% (Mar 15)'
      ],
      riskLevel: 'MÉDIO'
    },
    {
      week: 'Semana 3',
      range: 'Mar 16-22',
      status: '🎯 TARGET',
      targetCompletion: 95,
      currentCompletion: 60,
      gap: 35,
      criticalTasks: [
        'Verification Endpoints 100% (Mar 20)',
        'Forensic Metadata 100% (Mar 20)',
        'E2E Tests 100% (Mar 20)',
        'Deploy Staging (Mar 22)'
      ],
      riskLevel: 'BAIXO'
    }
  ]);

  const [riskMatrix] = useState([
    {
      risk: 'ICP/Brasil não chega no prazo',
      probability: 'MÉDIA',
      impact: '🔴 CRÍTICO',
      mitigation: 'Contato TODAY 17:00 + backup AC Certisign',
      owner: 'Legal + DevOps',
      status: 'ATIVO'
    },
    {
      risk: 'Autentique API Sign endpoint não pronto',
      probability: 'MÉDIA',
      impact: '🔴 CRÍTICO',
      mitigation: '2 devs full-time + testes paralelos até Mar 12',
      owner: 'Backend Lead',
      status: 'ATIVO'
    },
    {
      risk: 'Multitenant data isolation vulnerabilidade',
      probability: 'BAIXA',
      impact: '🔴 CRÍTICO',
      mitigation: 'Audit 100% endpoints + security review antes Mar 8',
      owner: 'Security + QA',
      status: 'MONITORADO'
    },
    {
      risk: 'Parecer jurídico atrasa decisões técnicas',
      probability: 'MÉDIA',
      impact: '🟠 ALTO',
      mitigation: 'RFP enviado TODAY 18:00 com escopo detalhado',
      owner: 'Legal',
      status: 'ATIVO'
    }
  ]);

  const [verdict] = useState({
    headline: '✅ SPRINT S VIÁVEL E APROVADO',
    metrics: {
      completionPercentage: 15,
      targetPercentage: 95,
      daysRemaining: 17,
      requiredVelocity: 4.7,
      historicalVelocity: 15,
      onTrack: true
    },
    keyFindings: [
      '✅ Base técnica sólida estabelecida (TLS, 2FA, LGPD)',
      '✅ Velocity histórica (15%/dia) > required (4.7%/dia)',
      '🔴 Bloqueador crítico: Certificado ICP/Brasil (Serasa)',
      '🔴 Autentique API é chave para desbloquear 5 tarefas',
      '⚠️ Multitenant em 76% - audit cross-tenant CRÍTICO',
      '✅ Go-Live May 26 continua ON TRACK'
    ],
    nextCheckpoint: 'Mar 8 EOD',
    nextCheckpointGoals: [
      'Autentique API 100% (currently 75%)',
      'Certificado AC recebido de Serasa',
      'Audit multitenant endpoints completo',
      'RFP parecer jurídico enviado'
    ],
    sprintTReadiness: 'CONDITIONAL - Depends on Sprint S 90%+ by Mar 22'
  });

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">📊 EXECUTOR DAILY UPDATE</h1>
        <p className="text-sm opacity-90 mt-2">Sprint S | Day {dailyUpdate.sprintDay}/{dailyUpdate.totalDays}</p>
        <p className="text-xs opacity-75">Updated: {updateDate}</p>
        <div className="mt-4 flex gap-8">
          <div>
            <p className="text-4xl font-bold">{dailyUpdate.globalCompletion}%</p>
            <p className="text-sm">Completude Atual</p>
          </div>
          <div>
            <p className="text-4xl font-bold">{dailyUpdate.targetCompletion}%</p>
            <p className="text-sm">Target (Mar 22)</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{dailyUpdate.goLiveDate}</p>
            <p className="text-sm">Go-Live 🚀</p>
          </div>
        </div>
      </div>

      {/* COMPLETION SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-l-4 border-green-600">
          <CardContent className="pt-4">
            <p className="text-xs font-bold text-green-700 dark:text-green-300">✅ CONCLUÍDO</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{completionBreakdown.completed.count}</p>
            <p className="text-sm text-green-600 font-bold">{completionBreakdown.completed.percentage}%</p>
            <Progress value={completionBreakdown.completed.percentage} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-blue-600">
          <CardContent className="pt-4">
            <p className="text-xs font-bold text-blue-700 dark:text-blue-300">⏳ PROGRESSO</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{completionBreakdown.inProgress.count}</p>
            <p className="text-sm text-blue-600 font-bold">Avg {completionBreakdown.inProgress.avgCompletion}%</p>
            <Progress value={completionBreakdown.inProgress.avgCompletion} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-orange-600">
          <CardContent className="pt-4">
            <p className="text-xs font-bold text-orange-700 dark:text-orange-300">❌ PENDENTE</p>
            <p className="text-3xl font-bold text-orange-600 mt-1">{completionBreakdown.pending.count}</p>
            <p className="text-sm text-orange-600 font-bold">{completionBreakdown.pending.percentage}%</p>
            <Progress value={completionBreakdown.pending.percentage} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-red-600">
          <CardContent className="pt-4">
            <p className="text-xs font-bold text-red-700 dark:text-red-300">🚨 BLOQUEADO</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{completionBreakdown.blocked.count}</p>
            <p className="text-sm text-red-600 font-bold">CRÍTICO</p>
            <div className="text-xs font-bold text-red-700 dark:text-red-300 mt-2 bg-red-200 dark:bg-red-800 px-2 py-1 rounded">
              Certificado AC
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TODAY'S ACTIONS */}
      <Card className="border-2 border-red-500 bg-red-50 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-600" />
            🎯 AÇÕES CRÍTICAS - TODAY
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {todayActions.map((action, i) => (
            <div key={i} className="p-3 bg-white dark:bg-red-900 rounded border-l-4 border-red-600">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-sm">{action.action}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{action.notes}</p>
                </div>
                <div className="text-right">
                  <Badge className={action.priority.includes('🔴') ? 'bg-red-600' : 'bg-orange-600'} className="text-xs mb-1">
                    {action.priority}
                  </Badge>
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-400">{action.time}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-600 dark:text-gray-400">{action.owner}</p>
                <Badge variant="outline" className={`text-xs ${
                  action.status.includes('AGUARDANDO') ? 'border-orange-600 text-orange-600' : 'border-blue-600 text-blue-600'
                }`}>
                  {action.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* DETAILED BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* COMPLETED */}
        <Card className="border-l-4 border-green-600">
          <CardHeader className="bg-green-50 dark:bg-green-900">
            <CardTitle className="text-sm">✅ O QUE JÁ FOI REALIZADO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 mt-3">
            {completionBreakdown.completed.tasks.map((task, i) => (
              <div key={i} className="p-2 bg-green-50 dark:bg-green-900 rounded text-xs">
                <p className="font-bold">{task.task}</p>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-600 dark:text-gray-400">{task.team}</span>
                  <span className="text-gray-600 dark:text-gray-400">{task.date}</span>
                </div>
                <Progress value={task.completion} className="mt-2 h-1" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* IN PROGRESS */}
        <Card className="border-l-4 border-blue-600">
          <CardHeader className="bg-blue-50 dark:bg-blue-900">
            <CardTitle className="text-sm">⏳ EM PROGRESSO (Avg {completionBreakdown.inProgress.avgCompletion}%)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 mt-3">
            {completionBreakdown.inProgress.tasks.map((task, i) => (
              <div key={i} className="p-2 bg-blue-50 dark:bg-blue-900 rounded text-xs">
                <div className="flex justify-between mb-1">
                  <p className="font-bold">{task.task}</p>
                  <span className="text-gray-600 dark:text-gray-400">{task.completion}%</span>
                </div>
                <Progress value={task.completion} className="h-1.5 mb-1" />
                <p className="text-gray-600 dark:text-gray-400">📅 {task.deadline}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* PENDING & BLOCKED */}
      <Card className="border-l-4 border-orange-600">
        <CardHeader className="bg-orange-50 dark:bg-orange-900">
          <CardTitle className="text-sm">❌ PENDENTE ({completionBreakdown.pending.count}) + 🚨 BLOQUEADO ({completionBreakdown.blocked.count})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-3">
          {completionBreakdown.pending.tasks.map((task, i) => (
            <div key={i} className="p-2 bg-orange-50 dark:bg-orange-900 rounded text-xs">
              <p>{task}</p>
            </div>
          ))}
          {completionBreakdown.blocked.tasks.map((task, i) => (
            <div key={i} className="p-2 bg-red-50 dark:bg-red-900 rounded text-xs border-l-2 border-red-600">
              <p className="font-bold text-red-700 dark:text-red-300">{task}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* WEEKLY PROJECTION */}
      <Card>
        <CardHeader>
          <CardTitle>📅 Projeção Semanal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weekProjection.map((week, i) => (
            <div key={i} className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50 dark:bg-purple-900 rounded">
              <div className="flex justify-between items-center mb-2">
                <p className="font-bold">{week.week} ({week.range})</p>
                <Badge className="bg-purple-600">{week.currentCompletion}% → {week.targetCompletion}%</Badge>
              </div>
              <Progress value={Math.min(week.currentCompletion, 100)} className="h-2 mb-2" />
              <div className="space-y-1 text-xs">
                {week.criticalTasks.map((task, j) => (
                  <p key={j}>• {task}</p>
                ))}
              </div>
              <p className="text-xs font-bold mt-2 text-purple-700 dark:text-purple-300">{week.status} | Risk: {week.riskLevel}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* RISK MATRIX */}
      <Card className="border-2 border-orange-500">
        <CardHeader className="bg-orange-50 dark:bg-orange-900">
          <CardTitle className="text-sm">⚠️ Risk Matrix</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-3">
          {riskMatrix.map((risk, i) => (
            <div key={i} className="p-3 bg-orange-50 dark:bg-orange-900 rounded border-l-4 border-orange-500 text-sm">
              <p className="font-bold">{risk.risk}</p>
              <div className="flex gap-2 mt-1 text-xs">
                <Badge className="bg-orange-600">{risk.probability}</Badge>
                <Badge className="bg-red-600">{risk.impact}</Badge>
                <Badge variant="outline">{risk.status}</Badge>
              </div>
              <p className="text-xs mt-1 text-gray-700 dark:text-gray-300">🔧 {risk.mitigation}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Owner: {risk.owner}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* FINAL VERDICT */}
      <Card className="border-2 border-green-600 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
        <CardHeader>
          <CardTitle className="text-lg">{verdict.headline}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-white dark:bg-slate-800 rounded">
            <p className="text-sm font-bold mb-2">📊 Metrics</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Completude</p>
                <p className="text-lg font-bold text-blue-600">{verdict.metrics.completionPercentage}% → {verdict.metrics.targetPercentage}%</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Velocity</p>
                <p className="text-lg font-bold text-green-600">{verdict.metrics.requiredVelocity}% vs {verdict.metrics.historicalVelocity}%</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Timeline</p>
                <p className="text-lg font-bold text-purple-600">{verdict.metrics.daysRemaining} dias</p>
              </div>
            </div>
          </div>

          <div className="space-y-1 text-sm">
            <p className="font-bold">🔍 Key Findings:</p>
            {verdict.keyFindings.map((finding, i) => (
              <p key={i} className="text-xs text-gray-700 dark:text-gray-300">{finding}</p>
            ))}
          </div>

          <div className="p-3 bg-green-100 dark:bg-green-800 rounded">
            <p className="font-bold text-green-700 dark:text-green-300 mb-2">🎯 Próximo Checkpoint: {verdict.nextCheckpoint}</p>
            <ul className="text-xs space-y-1 text-green-700 dark:text-green-200">
              {verdict.nextCheckpointGoals.map((goal, i) => (
                <li key={i}>✓ {goal}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded border-2 border-blue-500">
            <p className="font-bold text-blue-700 dark:text-blue-300">🚀 Sprint T Status</p>
            <p className="text-xs text-blue-600 dark:text-blue-200 mt-1">{verdict.sprintTReadiness}</p>
          </div>
        </CardContent>
      </Card>

      {/* FOOTER */}
      <div className="text-xs text-center text-gray-600 dark:text-gray-400 py-4 border-t">
        Executor de Sprint | Daily Update | {updateDate}
        <br />
        Sprint S Progress: {dailyUpdate.globalCompletion}% (Day {dailyUpdate.sprintDay}/{dailyUpdate.totalDays}) | Target: {dailyUpdate.targetCompletion}% by Mar 22
      </div>
    </div>
  );
}