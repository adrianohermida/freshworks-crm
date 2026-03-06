import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Clock, Zap, TrendingUp, Target } from 'lucide-react';

export default function ExecutorFinalDashboard() {
  const [executionDate] = useState('2026-03-04');

  const [sprintMetrics] = useState({
    name: 'Sprint S',
    duration: 'Mar 4 - Mar 22 (18 dias)',
    globalCompletion: 15,
    targetCompletion: 95,
    daysElapsed: 0,
    dayTotal: 18,
    goLiveDate: 'May 26, 2026'
  });

  // RESUMO FINAL CONSOLIDADO
  const [finalSummary] = useState({
    realizado: {
      count: 3,
      percentage: 23,
      tasks: [
        'TLS 1.3 Verificado (DevOps)',
        '2FA TOTP Framework (Backend)',
        'LGPD Compliance Rascunho (Legal)'
      ]
    },
    emProgresso: {
      count: 4,
      percentage: 31,
      avgProgress: 37.5,
      tasks: [
        'Autentique API (Backend) - 30%',
        '2FA TOTP Completo (Backend) - 50%',
        'Privacy Policy LGPD (Legal) - 40%',
        'Termos de Uso (Legal) - 30%'
      ]
    },
    pendente: {
      count: 6,
      percentage: 46,
      tasks: [
        'Hash SHA512 + SHA3-512',
        'PDF/A-2B Generator',
        'Metadados Forenses',
        'Parecer Jurídico',
        'Testes E2E',
        'Deploy Staging'
      ]
    },
    bloqueado: {
      count: 1,
      percentage: 8,
      tasks: ['Certificado ICP/Brasil (Serasa)']
    }
  });

  const [auditResults] = useState({
    autentiqueEndpoints: {
      implemented: 8,
      pending: 12,
      total: 21,
      completion: 38,
      criticityPath: [
        { rank: 1, endpoint: 'Upload PDF', deadline: 'Mar 8', status: '75% - Progresso' },
        { rank: 2, endpoint: 'Sign Document', deadline: 'Mar 12', status: '0% - Bloqueado' },
        { rank: 3, endpoint: 'Verify', deadline: 'Mar 18', status: '0% - Pendente' }
      ]
    },
    multitenantModules: {
      implemented: 32,
      pending: 10,
      total: 42,
      completion: 76,
      avgCoverage: 79,
      criticalGaps: [
        'Cross-tenant data isolation (ZERO tests)',
        'Biometric signature per tenant (58%)',
        'Forensic metadata per tenant (58%)',
        'Webhook events per tenant (0%)'
      ]
    }
  });

  const [weeklyTargets] = useState([
    {
      week: 'Semana 1 (Mar 4-8)',
      currentCompletion: 15,
      targetCompletion: 30,
      gap: 15,
      criticalTasks: 5,
      status: 'EM EXECUÇÃO'
    },
    {
      week: 'Semana 2 (Mar 9-15)',
      currentCompletion: 30,
      targetCompletion: 60,
      gap: 30,
      criticalTasks: 4,
      status: 'PLANEJADO'
    },
    {
      week: 'Semana 3 (Mar 16-22)',
      currentCompletion: 60,
      targetCompletion: 95,
      gap: 35,
      criticalTasks: 3,
      status: 'PLANEJADO'
    }
  ]);

  const [immediateActions] = useState([
    {
      priority: 1,
      action: 'Contato Serasa - Certificado AC',
      owner: 'Legal',
      deadline: 'Mar 4, 17:00 Manaus',
      status: 'PENDENTE',
      severity: 'CRÍTICO'
    },
    {
      priority: 2,
      action: 'Autentique API Upload (75% → 100%)',
      owner: 'Backend',
      deadline: 'Mar 8',
      status: 'EM EXECUÇÃO',
      severity: 'CRÍTICO'
    },
    {
      priority: 3,
      action: 'Audit Endpoints Multitenant',
      owner: 'QA + Backend',
      deadline: 'Mar 8',
      status: 'A INICIAR',
      severity: 'CRÍTICO'
    },
    {
      priority: 4,
      action: 'RFP Parecer Jurídico',
      owner: 'Legal',
      deadline: 'Mar 4, 18:00 Manaus',
      status: 'PENDENTE',
      severity: 'ALTA'
    }
  ]);

  const [riskAssessment] = useState([
    {
      risk: 'ICP/Brasil Certificate não chegar no prazo',
      probability: 'MÉDIA',
      impact: 'CRÍTICO',
      mitigation: 'Backup AC (Certisign)',
      owner: 'Legal + DevOps'
    },
    {
      risk: 'Autentique API Sign endpoint não pronto',
      probability: 'MÉDIA',
      impact: 'CRÍTICO',
      mitigation: 'Dedicar backend 24/7 até Mar 12',
      owner: 'Backend Lead'
    },
    {
      risk: 'Multitenant data isolation vulnerabilidade',
      probability: 'BAIXA',
      impact: 'ALTO',
      mitigation: 'Audit 100% endpoints antes Mar 8',
      owner: 'Security + QA'
    },
    {
      risk: 'Parecer jurídico atrasa decisões técnicas',
      probability: 'MÉDIA',
      impact: 'MÉDIO',
      mitigation: 'Draft paralelo, RFP enviado hoje',
      owner: 'Legal'
    }
  ]);

  const [nextSprints] = useState([
    {
      sprint: 'Sprint T',
      phase: 'Assinatura Digital + Metadados Forenses',
      startDate: 'Mar 24',
      endDate: 'Abr 6',
      duration: '2 semanas',
      prerequisite: 'Sprint S 90%+',
      status: 'CONDITIONAL'
    },
    {
      sprint: 'Sprint U',
      phase: 'Buffer + Validação Final',
      startDate: 'Abr 7',
      endDate: 'Abr 20',
      duration: '2 semanas',
      prerequisite: 'Sprint T 100%',
      status: 'PLANEJADO'
    },
    {
      sprint: 'Go-Live',
      phase: 'Lançamento em Produção',
      startDate: 'May 26',
      endDate: 'May 26',
      duration: '1 dia',
      prerequisite: 'Todos sprints 100%',
      status: 'TARGET'
    }
  ]);

  const [executorVerdictText] = useState({
    headline: '✅ SPRINT S VIÁVEL - Projeção 95% até Mar 22',
    message: 'Sprint iniciada com 3/13 tarefas concluídas. Bloqueador crítico: Certificado ICP/Brasil (Serasa). Autentique API é marco crítico para Mar 8. Projeção 95% é viável se certificado chegar no prazo. Multitenant implementation em 76%, crítico fazer audit de isolamento cross-tenant. Go-Live May 26 continua ON TRACK.',
    verdict: 'APPROVED FOR EXECUTION'
  });

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      {/* HEADER EXECUTIVO */}
      <div className="flex justify-between items-start mb-8 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
        <div>
          <h1 className="text-3xl font-bold">🎯 Executor Sprint - Final Dashboard</h1>
          <p className="text-sm opacity-90 mt-1">{sprintMetrics.name} • {sprintMetrics.duration}</p>
          <p className="text-xs opacity-75 mt-1">{executionDate} • Dia {sprintMetrics.daysElapsed}/{sprintMetrics.dayTotal}</p>
        </div>
        <div className="text-right space-y-2">
          <p className="text-5xl font-bold">{sprintMetrics.globalCompletion}%</p>
          <p className="text-sm opacity-90">Completude Atual</p>
          <p className="text-sm font-bold">→ {sprintMetrics.targetCompletion}% Target</p>
        </div>
      </div>

      {/* RESUMO EXECUTIVO - 4 COLUNAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-4">
            <p className="text-xs font-bold text-green-700 dark:text-green-300">✅ CONCLUÍDO</p>
            <p className="text-4xl font-bold text-green-600 mt-2">{finalSummary.realizado.count}</p>
            <p className="text-lg font-bold text-green-600">{finalSummary.realizado.percentage}%</p>
            <Progress value={finalSummary.realizado.percentage} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-500 bg-blue-50 dark:bg-blue-950">
          <CardContent className="pt-4">
            <p className="text-xs font-bold text-blue-700 dark:text-blue-300">⏳ EM PROGRESSO</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{finalSummary.emProgresso.count}</p>
            <p className="text-sm font-bold text-blue-600">Avg {finalSummary.emProgresso.avgProgress}%</p>
            <Progress value={finalSummary.emProgresso.avgProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-500 bg-orange-50 dark:bg-orange-950">
          <CardContent className="pt-4">
            <p className="text-xs font-bold text-orange-700 dark:text-orange-300">❌ PENDENTE</p>
            <p className="text-4xl font-bold text-orange-600 mt-2">{finalSummary.pendente.count}</p>
            <p className="text-lg font-bold text-orange-600">{finalSummary.pendente.percentage}%</p>
            <Progress value={finalSummary.pendente.percentage} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-2 border-red-500 bg-red-50 dark:bg-red-950">
          <CardContent className="pt-4">
            <p className="text-xs font-bold text-red-700 dark:text-red-300">🚨 BLOQUEADO</p>
            <p className="text-4xl font-bold text-red-600 mt-2">{finalSummary.bloqueado.count}</p>
            <p className="text-sm font-bold text-red-600">CRÍTICO</p>
            <div className="text-xs font-bold text-red-700 dark:text-red-300 mt-2 bg-red-200 dark:bg-red-800 px-2 py-1 rounded">
              ICP/Brasil
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DETALHES: O QUE FOI REALIZADO */}
      <Card className="border-l-4 border-green-600">
        <CardHeader className="bg-green-50 dark:bg-green-900">
          <CardTitle>✅ O QUE JÁ FOI REALIZADO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-3">
          {finalSummary.realizado.tasks.map((task, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900 rounded text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="font-semibold">{task}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* DETALHES: O QUE FALTA */}
      <Card className="border-l-4 border-orange-600">
        <CardHeader className="bg-orange-50 dark:bg-orange-900">
          <CardTitle>❌ O QUE AINDA FALTA ({finalSummary.pendente.count + finalSummary.bloqueado.count} tarefas)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-3">
          {finalSummary.pendente.tasks.map((task, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-900 rounded text-sm">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <span>{task}</span>
            </div>
          ))}
          {finalSummary.bloqueado.tasks.map((task, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900 rounded text-sm border-l-2 border-red-600">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="font-bold text-red-700 dark:text-red-300">{task} 🚨</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AUDIT RESULTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-2 border-purple-500">
          <CardHeader className="bg-purple-50 dark:bg-purple-900">
            <CardTitle className="text-sm">Autentique Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            <div className="text-2xl font-bold text-purple-600">{auditResults.autentiqueEndpoints.completion}%</div>
            <Progress value={auditResults.autentiqueEndpoints.completion} className="h-2" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {auditResults.autentiqueEndpoints.implemented}/{auditResults.autentiqueEndpoints.total} implementados
            </p>
            <div className="text-xs space-y-1 mt-2">
              {auditResults.autentiqueEndpoints.criticityPath.map((cp, i) => (
                <div key={i} className="flex justify-between">
                  <span className="font-semibold">{cp.rank}. {cp.endpoint}</span>
                  <Badge className="bg-purple-600 text-xs">{cp.deadline}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-cyan-500">
          <CardHeader className="bg-cyan-50 dark:bg-cyan-900">
            <CardTitle className="text-sm">Multitenant Modules</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            <div className="text-2xl font-bold text-cyan-600">{auditResults.multitenantModules.completion}%</div>
            <Progress value={auditResults.multitenantModules.completion} className="h-2" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {auditResults.multitenantModules.implemented}/{auditResults.multitenantModules.total} componentes
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400 font-bold mt-2">⚠️ Critical Gaps: {auditResults.multitenantModules.criticalGaps.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* AÇÕES IMEDIATAS */}
      <Card className="border-2 border-red-500 bg-red-50 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-600" />
            🎯 AÇÕES CRÍTICAS - TODAY (Mar 4)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {immediateActions.map((action) => (
            <div key={action.priority} className="p-3 bg-white dark:bg-red-900 rounded border-l-4 border-red-600 text-sm">
              <div className="flex justify-between mb-1">
                <p className="font-bold">{action.priority}. {action.action}</p>
                <Badge className={action.severity === 'CRÍTICO' ? 'bg-red-600' : 'bg-orange-600'} className="text-xs">
                  {action.severity}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{action.owner} • {action.deadline}</p>
              <Badge variant="outline" className="text-xs mt-2">{action.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* WEEKLY TARGETS */}
      <Card>
        <CardHeader>
          <CardTitle>📅 Projeção por Semana</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weeklyTargets.map((week, i) => (
            <div key={i} className="border-l-4 border-purple-500 pl-3 py-2 bg-purple-50 dark:bg-purple-900 rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{week.week}</h3>
                <Badge className="bg-purple-600">{week.currentCompletion}% → {week.targetCompletion}%</Badge>
              </div>
              <Progress value={(week.currentCompletion + week.gap) / 100 * 100} className="h-2 mb-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400">{week.criticalTasks} tarefas críticas | Status: {week.status}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* RISK ASSESSMENT */}
      <Card className="border-2 border-orange-500">
        <CardHeader className="bg-orange-50 dark:bg-orange-900">
          <CardTitle>⚠️ Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-3">
          {riskAssessment.map((risk, i) => (
            <div key={i} className="p-2 bg-orange-50 dark:bg-orange-900 rounded border-l-4 border-orange-500 text-sm">
              <p className="font-bold">{risk.risk}</p>
              <div className="flex gap-2 text-xs mt-1">
                <Badge className="bg-orange-600">{risk.probability}</Badge>
                <Badge className={risk.impact === 'CRÍTICO' ? 'bg-red-600' : 'bg-orange-600'}>{risk.impact}</Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Mitigação: {risk.mitigation}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* NEXT SPRINTS */}
      <Card className="border-2 border-green-500">
        <CardHeader className="bg-green-50 dark:bg-green-900">
          <CardTitle>🚀 Próximos Sprints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-3">
          {nextSprints.map((sprint, i) => (
            <div key={i} className="p-3 bg-green-50 dark:bg-green-900 rounded border-l-4 border-green-500 text-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{sprint.sprint}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{sprint.phase}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{sprint.startDate} - {sprint.endDate} ({sprint.duration})</p>
                </div>
                <Badge className={sprint.status === 'TARGET' ? 'bg-green-600' : sprint.status === 'CONDITIONAL' ? 'bg-orange-600' : 'bg-blue-600'}>
                  {sprint.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Pré-requisito: {sprint.prerequisite}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* EXECUTOR VERDICT */}
      <Card className="border-2 border-green-600 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
        <CardHeader>
          <CardTitle className="text-lg">{executorVerdictText.headline}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-800 rounded">
            <p className="text-sm leading-relaxed">{executorVerdictText.message}</p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-800 rounded border-2 border-green-500">
            <p className="text-lg font-bold text-green-700 dark:text-green-300">
              ✅ VERDICT: {executorVerdictText.verdict}
            </p>
            <p className="text-xs text-green-600 dark:text-green-200 mt-1">
              Go-Live Target: {sprintMetrics.goLiveDate} | Status: ON TRACK
            </p>
          </div>
        </CardContent>
      </Card>

      {/* FOOTER */}
      <div className="text-xs text-center text-gray-600 dark:text-gray-400 py-4 border-t">
        Executor de Sprint • Final Dashboard • {executionDate} | Next Checkpoint: Mar 8 (Autentique API 100%)
      </div>
    </div>
  );
}