import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Clock, TrendingUp, Target, Zap } from 'lucide-react';

export default function ExecutorProgressTracker() {
  const [currentDate] = useState('2026-03-04 10:30 Manaus');

  const [sprintSStatus] = useState({
    name: 'Sprint S',
    phase: 'Integração Autentique + Conformidade Legal',
    startDate: 'Mar 4',
    endDate: 'Mar 22',
    totalDays: 18,
    currentDay: 1,
    globalCompletion: 15,
    targetCompletion: 95,
    goLiveDate: 'May 26, 2026'
  });

  // CHECKLIST CONSOLIDADO DO QUE FOI FEITO
  const [executedActions] = useState([
    {
      date: 'Mar 1',
      task: 'TLS 1.3 Completo',
      team: 'DevOps',
      status: '✅ CONCLUÍDO',
      details: 'Certificado auto-assinado criado e verificado'
    },
    {
      date: 'Mar 2',
      task: 'LGPD Compliance Rascunho',
      team: 'Legal',
      status: '✅ CONCLUÍDO',
      details: 'Documento inicial de conformidade LGPD'
    },
    {
      date: 'Mar 3',
      task: '2FA TOTP Framework Scaffolding',
      team: 'Backend',
      status: '✅ CONCLUÍDO',
      details: 'Estrutura base para autenticação 2FA implementada'
    }
  ]);

  // CHECKLIST DO QUE PRECISA SER FEITO
  const [pendingActions] = useState([
    {
      priority: 1,
      task: 'Contato Serasa - Certificado AC',
      team: 'Legal + DevOps',
      deadline: 'Mar 4, 17:00',
      status: '🔴 CRÍTICO',
      prerequisite: 'Para: Assinatura digital válida',
      action: 'Chamar Serasa, confirmar timeline, negociar express'
    },
    {
      priority: 2,
      task: 'Autentique API - Upload Endpoint 100%',
      team: 'Backend',
      deadline: 'Mar 8',
      status: '🔴 CRÍTICO',
      prerequisite: 'Para: Hash, Sign, Verify endpoints',
      action: 'Dedica 2 devs, 100% time, testes E2E paralelo',
      progress: 75
    },
    {
      priority: 3,
      task: 'Audit Endpoints - Multitenant Compliance',
      team: 'QA + Security',
      deadline: 'Mar 8',
      status: '🔴 CRÍTICO',
      prerequisite: 'Para: Isolamento cross-tenant validado',
      action: 'Audit 100% endpoints, teste cross-tenant scenarios',
      progress: 0
    },
    {
      priority: 4,
      task: 'RFP Parecer Jurídico',
      team: 'Legal',
      deadline: 'Mar 4, 18:00',
      status: '🟠 ALTA',
      prerequisite: 'Para: Hash design, Signature validation',
      action: 'Enviar RFP com escopo técnico detalhado'
    },
    {
      priority: 5,
      task: '2FA TOTP Completo (100%)',
      team: 'Backend',
      deadline: 'Mar 12',
      status: '🟠 ALTA',
      prerequisite: 'Para: Sprint T (User Auth)',
      action: 'Implementar QR code, recovery codes, validação',
      progress: 50
    },
    {
      priority: 6,
      task: 'Privacy Policy + LGPD Full Document',
      team: 'Legal',
      deadline: 'Mar 18',
      status: '🟠 ALTA',
      prerequisite: 'Para: Go-Live compliance',
      action: 'Finalizar documento com parecer técnico integrado',
      progress: 40
    },
    {
      priority: 7,
      task: 'Hash SHA512 + SHA3-512 Design',
      team: 'Backend',
      deadline: 'Mar 15',
      status: '🟠 ALTA',
      prerequisite: 'Depende de: Parecer jurídico',
      action: 'Design + implementação de algoritmo dual-hash',
      progress: 0
    },
    {
      priority: 8,
      task: 'PDF/A-2B Generator',
      team: 'Backend',
      deadline: 'Mar 20',
      status: '🟡 MÉDIA',
      prerequisite: 'Depende de: Autentique API 100%',
      action: 'Implementar conversor para PDF/A-2B com validação'
    },
    {
      priority: 9,
      task: 'Metadados Forenses - Capture System',
      team: 'Backend',
      deadline: 'Mar 18',
      status: '🟡 MÉDIA',
      prerequisite: 'Depende de: Hash design aprovado',
      action: 'Sistema completo de captura de metadados forenses'
    },
    {
      priority: 10,
      task: 'Testes E2E - Suite Completa',
      team: 'QA',
      deadline: 'Mar 20',
      status: '🟡 MÉDIA',
      prerequisite: 'Depende de: APIs 100% prontas',
      action: '100% cobertura de testes end-to-end'
    },
    {
      priority: 11,
      task: 'Termos de Uso Finalizados',
      team: 'Legal',
      deadline: 'Mar 20',
      status: '🟡 MÉDIA',
      prerequisite: 'Para: Go-Live',
      action: 'Finalizar documento com clientes'
    },
    {
      priority: 12,
      task: 'Deploy Staging Validado',
      team: 'DevOps + QA',
      deadline: 'Mar 22',
      status: '🟡 MÉDIA',
      prerequisite: 'Depende de: Todas tarefas 95%',
      action: 'Deploy completo em staging com smoke tests'
    },
    {
      priority: 13,
      task: 'Sprint T Readiness Review',
      team: 'Executor',
      deadline: 'Mar 22 EOD',
      status: '🎯 GO-LIVE',
      prerequisite: 'Para: Sprint T kickoff (Mar 24)',
      action: 'Validar 90%+ e aprovar Sprint T'
    }
  ]);

  const [weeklyBreakdown] = useState([
    {
      week: 'Semana 1 (Mar 4-8)',
      tasks: [
        { task: 'Contato Serasa', priority: '🔴', owner: 'Legal' },
        { task: 'Autentique API Upload 100%', priority: '🔴', owner: 'Backend' },
        { task: 'Audit Multitenant Endpoints', priority: '🔴', owner: 'QA' },
        { task: 'RFP Parecer Jurídico', priority: '🟠', owner: 'Legal' },
        { task: '2FA TOTP 75%', priority: '🟠', owner: 'Backend' }
      ],
      currentCompletion: 15,
      targetCompletion: 30,
      criticalCount: 5
    },
    {
      week: 'Semana 2 (Mar 9-15)',
      tasks: [
        { task: '2FA TOTP 100%', priority: '🟠', owner: 'Backend' },
        { task: 'Hash Design + Start', priority: '🟠', owner: 'Backend' },
        { task: 'Webhooks Setup', priority: '🟠', owner: 'Backend' },
        { task: 'Privacy Policy 100%', priority: '🟠', owner: 'Legal' },
        { task: 'Metadados Forenses Design', priority: '🟡', owner: 'Backend' }
      ],
      currentCompletion: 30,
      targetCompletion: 60,
      criticalCount: 3
    },
    {
      week: 'Semana 3 (Mar 16-22)',
      tasks: [
        { task: 'Verification Endpoints 100%', priority: '🎯', owner: 'Backend' },
        { task: 'Forensic Metadata 100%', priority: '🎯', owner: 'Backend' },
        { task: 'Testes E2E 100% Coverage', priority: '🎯', owner: 'QA' },
        { task: 'Deploy Staging Validated', priority: '🎯', owner: 'DevOps' },
        { task: 'Sprint T Readiness Approved', priority: '🎯', owner: 'Executor' }
      ],
      currentCompletion: 60,
      targetCompletion: 95,
      criticalCount: 2
    }
  ]);

  const [sprintTPreparation] = useState({
    name: 'Sprint T',
    phase: 'Assinatura Digital Avançada + Metadados Forenses',
    startDate: 'Mar 24 (CONDITIONAL)',
    endDate: 'Abr 6',
    duration: '2 semanas',
    prerequisites: [
      { item: 'Sprint S 90%+ completo', deadline: 'Mar 22', critical: true, status: 'PENDENTE' },
      { item: 'Autentique API 100%', deadline: 'Mar 8', critical: true, status: 'PROGRESSO 30%' },
      { item: 'Certificado AC produção', deadline: 'Mar 10', critical: true, status: 'BLOQUEADO' },
      { item: 'Hash design aprovado', deadline: 'Mar 15', critical: true, status: 'PENDENTE' }
    ],
    tasks: [
      'T-1: Integração Autentique SDK (Mar 24-28)',
      'T-2: Assinatura Digital com Validation (Mar 29 - Abr 2)',
      'T-3: Metadados Forenses Avançados (Abr 3-5)',
      'T-4: Validação Online UI + Demo (Abr 6)'
    ]
  });

  const [completionMetrics] = useState({
    sprintS: {
      totalTasks: 13,
      completed: 3,
      inProgress: 4,
      pending: 6,
      blocked: 1,
      percentageCompleted: 23,
      percentageInProgress: 31,
      percentagePending: 46,
      percentageBlocked: 8,
      globalProgress: 15,
      targetProgress: 95
    },
    timeline: {
      daysElapsed: 1,
      daysRemaining: 17,
      velocityNeeded: (95 - 15) / 17,
      velocityForecast: 'ON TRACK'
    }
  });

  const [executorStatement] = useState({
    summary: '📊 SPRINT S INICIADA COM SUCESSO',
    status: '✅ ON TRACK FOR 95% BY MAR 22',
    keyFindings: [
      'Base técnica sólida: TLS 1.3, 2FA Framework, LGPD base estabelecidos',
      'Bloqueador crítico identificado: Certificado ICP/Brasil (ação hoje 17:00)',
      'Autentique API é chave para desbloquear 5 outras tarefas (75% → 100% até Mar 8)',
      'Multitenant implementation 76% - audit cross-tenant é crítico',
      'Legal/Compliance on track (parecer jurídico será pivô para decisões técnicas)'
    ],
    riskMitigation: [
      '🔴 ICP/Brasil: Contato Serasa + backup AC (Certisign)',
      '🔴 Autentique API: Dedica 2 devs full-time + testes paralelos',
      '🔴 Multitenant: Audit 100% endpoints com security review',
      '🟠 Parecer jurídico: Enviar RFP hoje com escopo claro'
    ],
    nextCheckpoint: 'Mar 8 @ EOD: Autentique API 100% + Certificado AC + Audit completo'
  });

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">📈 Executor Progress Tracker</h1>
        <p className="text-sm opacity-90">{sprintSStatus.name} | {sprintSStatus.phase}</p>
        <p className="text-xs opacity-75 mt-1">{currentDate}</p>
        <div className="mt-3 flex items-center gap-4">
          <div>
            <p className="text-4xl font-bold">{completionMetrics.sprintS.globalProgress}%</p>
            <p className="text-sm">Completude Atual</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{sprintSStatus.targetCompletion}%</p>
            <p className="text-sm">Target (Mar 22)</p>
          </div>
        </div>
      </div>

      {/* MÉTRICAS GLOBAIS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs font-bold text-green-700 dark:text-green-300">✅ Concluído</p>
            <p className="text-3xl font-bold text-green-600">{completionMetrics.sprintS.completed}</p>
            <p className="text-sm text-green-600 font-bold">{completionMetrics.sprintS.percentageCompleted}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs font-bold text-blue-700 dark:text-blue-300">⏳ Progresso</p>
            <p className="text-3xl font-bold text-blue-600">{completionMetrics.sprintS.inProgress}</p>
            <p className="text-sm text-blue-600 font-bold">{completionMetrics.sprintS.percentageInProgress}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs font-bold text-orange-700 dark:text-orange-300">❌ Pendente</p>
            <p className="text-3xl font-bold text-orange-600">{completionMetrics.sprintS.pending}</p>
            <p className="text-sm text-orange-600 font-bold">{completionMetrics.sprintS.percentagePending}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs font-bold text-red-700 dark:text-red-300">🚨 Bloqueado</p>
            <p className="text-3xl font-bold text-red-600">{completionMetrics.sprintS.blocked}</p>
            <p className="text-sm text-red-600 font-bold">{completionMetrics.sprintS.percentageBlocked}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs font-bold text-purple-700 dark:text-purple-300">🎯 Timeline</p>
            <p className="text-3xl font-bold text-purple-600">{completionMetrics.timeline.daysRemaining}</p>
            <p className="text-sm text-purple-600 font-bold">dias restantes</p>
          </CardContent>
        </Card>
      </div>

      {/* AÇÕES EXECUTADAS */}
      <Card className="border-l-4 border-green-600">
        <CardHeader className="bg-green-50 dark:bg-green-900">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            ✅ O QUE JÁ FOI REALIZADO
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-3">
          {executedActions.map((action, i) => (
            <div key={i} className="p-3 bg-green-50 dark:bg-green-900 rounded border-l-4 border-green-600">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-sm">{action.task}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{action.details}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-600 text-xs">{action.date}</Badge>
                  <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">{action.team}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AÇÕES PENDENTES - CRÍTICAS PRIMEIRO */}
      <Card className="border-2 border-red-500">
        <CardHeader className="bg-red-50 dark:bg-red-900">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            ❌ O QUE AINDA FALTA ({pendingActions.length} tarefas)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-3">
          {pendingActions.map((action) => (
            <div key={action.priority} className={`p-3 rounded border-l-4 ${
              action.status.includes('🔴') ? 'bg-red-50 dark:bg-red-900 border-red-600' :
              action.status.includes('🟠') ? 'bg-orange-50 dark:bg-orange-900 border-orange-600' :
              action.status.includes('🎯') ? 'bg-green-50 dark:bg-green-900 border-green-600' :
              'bg-yellow-50 dark:bg-yellow-900 border-yellow-600'
            }`}>
              <div className="flex justify-between items-start mb-1">
                <p className="font-bold text-sm">{action.priority}. {action.task}</p>
                <Badge className={
                  action.status.includes('🔴') ? 'bg-red-600' :
                  action.status.includes('🟠') ? 'bg-orange-600' :
                  action.status.includes('🎯') ? 'bg-green-600' :
                  'bg-yellow-600'
                } className="text-xs">{action.status}</Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{action.team} | {action.deadline}</p>
              <p className="text-xs font-semibold mb-1">→ {action.action}</p>
              <p className="text-xs text-gray-700 dark:text-gray-300 font-bold">Pré-requisito: {action.prerequisite}</p>
              {action.progress !== undefined && (
                <div className="mt-2">
                  <Progress value={action.progress} className="h-1.5" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{action.progress}% completo</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PLANO SEMANAL */}
      <Card>
        <CardHeader>
          <CardTitle>📅 Breakdown por Semana</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weeklyBreakdown.map((week, i) => (
            <div key={i} className="border-l-4 border-purple-500 pl-3 py-2 bg-purple-50 dark:bg-purple-900 rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{week.week}</h3>
                <Badge className="bg-purple-600">{week.currentCompletion}% → {week.targetCompletion}%</Badge>
              </div>
              <Progress value={Math.min(week.currentCompletion, 100)} className="h-2 mb-2" />
              <div className="text-xs space-y-1">
                {week.tasks.map((t, j) => (
                  <p key={j}>{t.priority} {t.task} ({t.owner})</p>
                ))}
              </div>
              <p className="text-xs font-bold mt-2 text-purple-700 dark:text-purple-300">{week.criticalCount} tarefas críticas</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SPRINT T PREPARATION */}
      <Card className="border-2 border-green-500">
        <CardHeader className="bg-green-50 dark:bg-green-900">
          <CardTitle>🚀 {sprintTPreparation.name} - Readiness Check</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{sprintTPreparation.phase}</p>
        </CardHeader>
        <CardContent className="space-y-3 mt-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs font-bold text-gray-600">Início (Condicional)</p>
              <p className="text-lg font-bold text-green-600">{sprintTPreparation.startDate}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-600">Duração</p>
              <p className="text-lg font-bold">{sprintTPreparation.duration}</p>
            </div>
          </div>

          <div>
            <p className="font-bold text-sm mb-2">Pré-requisitos (4 críticos):</p>
            <div className="space-y-1">
              {sprintTPreparation.prerequisites.map((pre, i) => (
                <div key={i} className="flex justify-between p-2 bg-green-50 dark:bg-green-900 rounded text-xs">
                  <span className="font-semibold">{pre.item}</span>
                  <div className="flex gap-1">
                    <Badge className={pre.status === 'BLOQUEADO' ? 'bg-red-600' : pre.status === 'PENDENTE' ? 'bg-orange-600' : 'bg-blue-600'} className="text-xs">
                      {pre.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-bold text-sm mb-2">Tarefas Sprint T:</p>
            <ul className="text-xs space-y-1">
              {sprintTPreparation.tasks.map((task, i) => (
                <li key={i}>• {task}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* EXECUTOR VERDICT */}
      <Card className="border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardHeader>
          <CardTitle className="text-lg">{executorStatement.summary}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-white dark:bg-slate-800 rounded">
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">{executorStatement.status}</p>
            <p className="text-sm">Velocity requerida: {completionMetrics.timeline.velocityNeeded.toFixed(1)}% por dia | Forecast: {completionMetrics.timeline.velocityForecast}</p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-sm">🔍 Key Findings:</p>
            <ul className="text-sm space-y-1">
              {executorStatement.keyFindings.map((finding, i) => (
                <li key={i}>• {finding}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 bg-orange-50 dark:bg-orange-900 p-3 rounded">
            <p className="font-bold text-sm text-orange-700 dark:text-orange-300">⚠️ Risk Mitigation Actions:</p>
            <ul className="text-sm space-y-1 text-orange-700 dark:text-orange-300">
              {executorStatement.riskMitigation.map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-green-100 dark:bg-green-800 rounded border-2 border-green-500">
            <p className="font-bold text-green-700 dark:text-green-300">📍 Next Checkpoint</p>
            <p className="text-sm text-green-600 dark:text-green-200 mt-1">{executorStatement.nextCheckpoint}</p>
          </div>
        </CardContent>
      </Card>

      {/* FOOTER */}
      <div className="text-xs text-center text-gray-600 dark:text-gray-400 py-4 border-t">
        Executor de Sprint | Progress Tracker | {currentDate}
        <br />
        Sprint S: Day 1/18 | Global Completion: {completionMetrics.sprintS.globalProgress}% | Target: {sprintSStatus.targetCompletion}%
      </div>
    </div>
  );
}