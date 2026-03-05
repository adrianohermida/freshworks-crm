import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Clock, Zap, Target } from 'lucide-react';

export default function SprintExecutionCommand() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [executionLog, setExecutionLog] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleString('pt-BR', {
      timeZone: 'America/Manaus',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // SPRINT S - REVISÃO CONSOLIDADA
  const sprintSReview = {
    name: 'Sprint S',
    phase: 'Integração Autentique + Conformidade Legal',
    duration: '18 dias (Mar 4 - Mar 22)',
    day: 1,
    globalCompletion: 15,
    targetCompletion: 95,
    goLiveDate: 'May 26, 2026'
  };

  // O QUE FOI CONCLUÍDO
  const completed = [
    { task: 'TLS 1.3 Verificado', team: 'DevOps', date: 'Mar 1', completion: 100, impact: 'Segurança SSL confirmada' },
    { task: 'LGPD Compliance Base', team: 'Legal', date: 'Mar 2', completion: 100, impact: 'Framework compliance pronto' },
    { task: '2FA TOTP Framework', team: 'Backend', date: 'Mar 3', completion: 100, impact: 'Autenticação 2FA scaffold' }
  ];

  // O QUE ESTÁ EM PROGRESSO
  const inProgress = [
    { task: 'Autentique API Upload', team: 'Backend', completion: 75, deadline: 'Mar 8', criticalPath: true },
    { task: '2FA TOTP Completo', team: 'Backend', completion: 50, deadline: 'Mar 12', criticalPath: false },
    { task: 'Privacy Policy LGPD', team: 'Legal', completion: 40, deadline: 'Mar 18', criticalPath: false },
    { task: 'Termos de Uso', team: 'Legal', completion: 30, deadline: 'Mar 20', criticalPath: false }
  ];

  // O QUE FALTA FAZER
  const pending = [
    { task: 'Hash SHA512 + SHA3-512', deadline: 'Mar 15', prereq: 'Parecer jurídico', team: 'Backend' },
    { task: 'PDF/A-2B Generator', deadline: 'Mar 20', prereq: 'Autentique API 100%', team: 'Backend' },
    { task: 'Metadados Forenses', deadline: 'Mar 18', prereq: 'Hash design', team: 'Backend' },
    { task: 'Parecer Jurídico', deadline: 'Mar 26', prereq: 'RFP enviado', team: 'Legal' },
    { task: 'Testes E2E', deadline: 'Mar 20', prereq: 'APIs prontas', team: 'QA' },
    { task: 'Deploy Staging', deadline: 'Mar 22', prereq: 'Todas 95%', team: 'DevOps' }
  ];

  // BLOQUEADORES
  const blockers = [
    {
      blocker: 'Certificado ICP/Brasil',
      blockedTasks: ['Assinatura Digital', 'Verificação Legal'],
      actionRequired: 'CONTATO Serasa TODAY 17:00',
      priority: 'CRÍTICO',
      mitigation: 'AC Backup Certisign'
    }
  ];

  // AÇÕES PARA EXECUTAR HOJE
  const todayActions = [
    {
      order: 1,
      action: 'Contato Serasa - Certificado AC',
      time: '17:00',
      owner: 'Legal',
      priority: 'CRÍTICO',
      status: 'PENDING',
      completedAt: null,
      outcome: null
    },
    {
      order: 2,
      action: 'Enviar RFP Parecer Jurídico',
      time: '18:00',
      owner: 'Legal',
      priority: 'CRÍTICO',
      status: 'PENDING',
      completedAt: null,
      outcome: null
    },
    {
      order: 3,
      action: 'Autentique API Status Check',
      time: 'EOD',
      owner: 'Backend',
      priority: 'CRÍTICO',
      status: 'IN_PROGRESS',
      completedAt: null,
      outcome: null
    },
    {
      order: 4,
      action: 'Daily Standup - Sincronização',
      time: 'EOD',
      owner: 'All Leads',
      priority: 'ALTA',
      status: 'PENDING',
      completedAt: null,
      outcome: null
    }
  ];

  // TIMELINE DE EXECUÇÃO
  const executionTimeline = [
    {
      week: 'Semana 1',
      range: 'Mar 4-8',
      startCompletion: 15,
      targetCompletion: 30,
      gap: 15,
      status: '🔴 CRÍTICA',
      keyMilestones: [
        'Certificado AC (Mar 10)',
        'Autentique API 100% (Mar 8)',
        'Audit endpoints (Mar 8)',
        'RFP parecer (TODAY)'
      ],
      riskLevel: 'ALTO'
    },
    {
      week: 'Semana 2',
      range: 'Mar 9-15',
      startCompletion: 30,
      targetCompletion: 60,
      gap: 30,
      status: '🟠 ALTA',
      keyMilestones: [
        '2FA TOTP 100% (Mar 12)',
        'Hash design (Mar 15)',
        'Webhooks (Mar 12)',
        'Privacy Policy (Mar 15)'
      ],
      riskLevel: 'MÉDIO'
    },
    {
      week: 'Semana 3',
      range: 'Mar 16-22',
      startCompletion: 60,
      targetCompletion: 95,
      gap: 35,
      status: '🎯 TARGET',
      keyMilestones: [
        'Verification Endpoints (Mar 20)',
        'Forensic Metadata (Mar 20)',
        'E2E Tests 100% (Mar 20)',
        'Deploy Staging (Mar 22)'
      ],
      riskLevel: 'BAIXO'
    }
  ];

  // PRÓXIMO SPRINT (Sprint T)
  const sprintTPrep = {
    name: 'Sprint T',
    phase: 'Assinatura Digital + Metadados Forenses Avançados',
    startDate: 'Mar 24 (CONDICIONAL)',
    duration: '2 semanas',
    prerequisites: [
      { item: 'Sprint S 90%+ completo', deadline: 'Mar 22', status: 'ON_TRACK' },
      { item: 'Certificado AC obtido', deadline: 'Mar 10', status: 'BLOCKED' },
      { item: 'Autentique API 100%', deadline: 'Mar 8', status: 'IN_PROGRESS' },
      { item: 'Hash design aprovado', deadline: 'Mar 15', status: 'PENDING' }
    ],
    kickoffApproved: false,
    estimatedCompletion: 'Abr 6'
  };

  // MÉTRICAS CONSOLIDADAS
  const metrics = {
    totalTasks: 13,
    completed: 3,
    inProgress: 4,
    pending: 6,
    blocked: 1,
    completionPercentage: 15,
    targetPercentage: 95,
    gap: 80,
    daysRemaining: 17,
    requiredVelocity: ((95 - 15) / 17).toFixed(1),
    historicalVelocity: 15.0
  };

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      {/* HEADER - COMMAND CENTER */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-8 rounded-lg shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold">🎯 EXECUTOR COMMAND CENTER</h1>
            <p className="text-lg opacity-90 mt-2">{sprintSReview.name} | {sprintSReview.phase}</p>
            <p className="text-sm opacity-75">{sprintSReview.duration}</p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold">{metrics.completionPercentage}%</p>
            <p className="text-sm opacity-90">Day {sprintSReview.day}/{18} | Gap: {metrics.gap}%</p>
            <p className="text-xs opacity-75 mt-2">{formatTime(currentTime)} Manaus</p>
          </div>
        </div>
      </div>

      {/* RESUMO EM NÚMEROS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-green-600">{metrics.completed}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Concluído</p>
            <p className="text-sm font-bold text-green-600">{Math.round((metrics.completed / metrics.totalTasks) * 100)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{metrics.inProgress}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Em Progresso</p>
            <p className="text-sm font-bold text-blue-600">{Math.round((metrics.inProgress / metrics.totalTasks) * 100)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{metrics.pending}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Pendente</p>
            <p className="text-sm font-bold text-orange-600">{Math.round((metrics.pending / metrics.totalTasks) * 100)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-red-600">{metrics.blocked}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Bloqueado</p>
            <p className="text-sm font-bold text-red-600">CRÍTICO</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{metrics.daysRemaining}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Dias</p>
            <p className="text-sm font-bold text-purple-600">{metrics.requiredVelocity}%/dia</p>
          </CardContent>
        </Card>
      </div>

      {/* AÇÕES CRÍTICAS - TODAY */}
      <Card className="border-2 border-red-600 bg-red-50 dark:bg-red-950">
        <CardHeader className="bg-red-100 dark:bg-red-900">
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <Zap className="w-6 h-6" />
            🔴 AÇÕES CRÍTICAS - EXECUTAR HOJE (Mar 4)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-4">
          {todayActions.map((action) => (
            <div key={action.order} className={`p-4 rounded border-l-4 border-red-600 ${
              action.status === 'COMPLETED' ? 'bg-green-50 dark:bg-green-900' : 'bg-white dark:bg-red-900'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-lg">{action.order}. {action.action}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Owner: {action.owner}</p>
                </div>
                <div className="text-right">
                  <Badge className={
                    action.status === 'COMPLETED' ? 'bg-green-600' :
                    action.status === 'IN_PROGRESS' ? 'bg-blue-600' :
                    'bg-red-600'
                  } className="mb-1">
                    {action.status === 'COMPLETED' ? '✅ DONE' :
                     action.status === 'IN_PROGRESS' ? '⏳ RUNNING' :
                     '⏸️ PENDING'}
                  </Badge>
                  <p className="text-sm font-bold text-orange-600 dark:text-orange-400">{action.time}</p>
                </div>
              </div>
              {action.status === 'COMPLETED' && action.completedAt && (
                <p className="text-xs text-green-600 dark:text-green-300 font-bold">✓ Completed: {action.completedAt}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* O QUE JÁ FOI REALIZADO */}
      <Card className="border-l-4 border-green-600">
        <CardHeader className="bg-green-50 dark:bg-green-900">
          <CardTitle className="text-green-700 dark:text-green-300">✅ O QUE FOI CONCLUÍDO (3/13 = 23%)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-3">
          {completed.map((item, i) => (
            <div key={i} className="p-3 bg-green-50 dark:bg-green-900 rounded border-l-4 border-green-600">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-bold">{item.task}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">💡 {item.impact}</p>
                </div>
                <Badge className="bg-green-600 ml-2">{item.team}</Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Finalizado: {item.date}</p>
              <Progress value={item.completion} className="mt-2 h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* EM PROGRESSO */}
      <Card className="border-l-4 border-blue-600">
        <CardHeader className="bg-blue-50 dark:bg-blue-900">
          <CardTitle className="text-blue-700 dark:text-blue-300">⏳ EM PROGRESSO (4/13 = 31%, Avg 37.5%)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-3">
          {inProgress.map((item, i) => (
            <div key={i} className={`p-3 rounded border-l-4 ${
              item.criticalPath ? 'border-red-600 bg-red-50 dark:bg-red-900' : 'border-blue-600 bg-blue-50 dark:bg-blue-900'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold">{item.task}</p>
                <div className="text-right">
                  {item.criticalPath && <Badge className="bg-red-600 text-xs mb-1">CRITICAL PATH</Badge>}
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-300">{item.completion}%</p>
                </div>
              </div>
              <Progress value={item.completion} className="h-2 mb-2" />
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>{item.team}</span>
                <span>📅 {item.deadline}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PENDENTE */}
      <Card className="border-l-4 border-orange-600">
        <CardHeader className="bg-orange-50 dark:bg-orange-900">
          <CardTitle className="text-orange-700 dark:text-orange-300">❌ FALTA FAZER (6/13 = 46%)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-3">
          {pending.map((item, i) => (
            <div key={i} className="p-3 bg-orange-50 dark:bg-orange-900 rounded border-l-4 border-orange-600 text-sm">
              <p className="font-bold">{item.task}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">⬅️ Prereq: {item.prereq}</p>
              <div className="flex justify-between mt-2 text-xs">
                <span>{item.team}</span>
                <span className="font-bold">📅 {item.deadline}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* BLOQUEADORES */}
      {blockers.length > 0 && (
        <Card className="border-2 border-red-600 bg-red-50 dark:bg-red-950">
          <CardHeader className="bg-red-100 dark:bg-red-900">
            <CardTitle className="text-red-700 dark:text-red-300">🚨 BLOQUEADORES CRÍTICOS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 mt-3">
            {blockers.map((b, i) => (
              <div key={i} className="p-4 bg-white dark:bg-red-900 rounded border-l-4 border-red-600">
                <p className="font-bold text-lg text-red-700 dark:text-red-300">{b.blocker}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">🚫 Bloqueando: {b.blockedTasks.join(', ')}</p>
                <Badge className="bg-red-600 mt-2 mb-2">{b.priority}</Badge>
                <p className="text-sm font-bold text-red-700 dark:text-red-300">⚡ {b.actionRequired}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">📦 Mitigação: {b.mitigation}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* TIMELINE DE EXECUÇÃO */}
      <Card>
        <CardHeader>
          <CardTitle>📅 Timeline de Execução por Semana</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 mt-3">
          {executionTimeline.map((week, i) => (
            <div key={i} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 rounded border-l-4 border-purple-600">
              <div className="flex justify-between items-start mb-3">
                <p className="font-bold text-lg">{week.week} ({week.range})</p>
                <Badge className="bg-purple-600">{week.startCompletion}% → {week.targetCompletion}% (Gap: {week.gap}%)</Badge>
              </div>
              <Progress value={Math.min(week.startCompletion, 100)} className="h-3 mb-3" />
              <div className="space-y-1 text-sm mb-2">
                {week.keyMilestones.map((milestone, j) => (
                  <p key={j} className="text-gray-700 dark:text-gray-300">✓ {milestone}</p>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>{week.status}</span>
                <span>Risk: {week.riskLevel}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PRÓXIMO SPRINT - Sprint T */}
      <Card className="border-2 border-green-600 bg-green-50 dark:bg-green-950">
        <CardHeader className="bg-green-100 dark:bg-green-900">
          <CardTitle className="text-green-700 dark:text-green-300">🚀 PRÓXIMO SPRINT - Sprint T</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 mt-3">
          <div className="p-3 bg-white dark:bg-green-900 rounded">
            <p className="font-bold text-lg">{sprintTPrep.name} - {sprintTPrep.phase}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Início: {sprintTPrep.startDate} | Duração: {sprintTPrep.duration} | Conclusão: {sprintTPrep.estimatedCompletion}
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-sm">Pré-requisitos para Kickoff:</p>
            {sprintTPrep.prerequisites.map((pre, i) => (
              <div key={i} className={`p-2 rounded text-sm border-l-4 ${
                pre.status === 'BLOCKED' ? 'border-red-600 bg-red-50 dark:bg-red-900' :
                pre.status === 'IN_PROGRESS' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900' :
                pre.status === 'COMPLETED' ? 'border-green-600 bg-green-50 dark:bg-green-900' :
                'border-orange-600 bg-orange-50 dark:bg-orange-900'
              }`}>
                <div className="flex justify-between">
                  <span className="font-semibold">{pre.item}</span>
                  <Badge className={
                    pre.status === 'BLOCKED' ? 'bg-red-600' :
                    pre.status === 'IN_PROGRESS' ? 'bg-blue-600' :
                    pre.status === 'COMPLETED' ? 'bg-green-600' :
                    'bg-orange-600'
                  }>{pre.status}</Badge>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">📅 {pre.deadline}</p>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded border-2 border-blue-500">
            <p className="font-bold text-blue-700 dark:text-blue-300">
              {sprintTPrep.kickoffApproved ? '✅ APROVADO' : '⏳ CONDICIONAL'}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-200 mt-1">
              Kickoff autorizado SOMENTE se Sprint S ≥ 90% em Mar 22
            </p>
          </div>
        </CardContent>
      </Card>

      {/* VEREDICTO FINAL */}
      <Card className="border-2 border-green-600 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
        <CardHeader>
          <CardTitle className="text-2xl text-green-700 dark:text-green-300">✅ VEREDICTO DO EXECUTOR</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-white dark:bg-slate-800 rounded">
            <p className="text-xl font-bold text-green-600 mb-2">SPRINT S VIÁVEL E APROVADO</p>
            <div className="space-y-2 text-sm">
              <p>✅ Base técnica sólida (TLS, 2FA, LGPD)</p>
              <p>✅ Velocity: 4.7%/dia requerido vs 15%/dia histórico</p>
              <p>✅ Go-Live May 26 continua ON TRACK</p>
              <p>🔴 Bloqueador crítico: Certificado ICP/Brasil</p>
              <p>🔴 Autentique API é desbloqueador chave</p>
            </div>
          </div>

          <div className="p-4 bg-blue-100 dark:bg-blue-800 rounded border-2 border-blue-500">
            <p className="font-bold text-blue-700 dark:text-blue-300 mb-2">🎯 Próximo Checkpoint: Mar 8 EOD</p>
            <ul className="text-sm space-y-1 text-blue-600 dark:text-blue-200">
              <li>✓ Autentique API 100% implementado</li>
              <li>✓ Certificado AC recebido de Serasa</li>
              <li>✓ Audit multitenant endpoints completo</li>
              <li>✓ RFP parecer jurídico enviado</li>
            </ul>
          </div>

          <div className="p-4 bg-green-100 dark:bg-green-800 rounded">
            <p className="font-bold text-green-700 dark:text-green-300">🚀 Status: READY FOR EXECUTION</p>
            <p className="text-sm text-green-600 dark:text-green-200 mt-1">
              Toda a infraestrutura de dashboards, monitoramento e execução está pronta. 
              Próximas ações: TODAY 17:00 e 18:00 são pivôs críticos.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* FOOTER */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400 py-6 border-t">
        <p className="font-bold mb-2">Executor de Sprint | Command Center</p>
        <p>Sprint S: Day 1/18 | 15% → 95% | May 26 Go-Live ON TRACK</p>
        <p className="text-xs mt-2 opacity-75">{formatTime(currentTime)} | Timezone: America/Manaus</p>
      </div>
    </div>
  );
}