import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Clock, Zap, TrendingUp, ArrowRight } from 'lucide-react';

export default function SprintSConsolidatedReport() {
  const [reportDate] = useState('2026-03-04 09:30 (Manaus)');

  const [executionSummary] = useState({
    sprintName: 'Sprint S',
    phase: 'Integração Autentique + Conformidade Legal',
    duration: '18 dias (Mar 4 - Mar 22)',
    currentDay: 1,
    globalCompletion: 15,
    targetCompletion: 95,
    status: 'EM EXECUÇÃO'
  });

  const [sprintSStatus] = useState({
    sections: [
      {
        title: '✅ REALIZADO (3 tarefas = 23%)',
        items: [
          { task: 'TLS 1.3 Verificado', owner: 'DevOps', date: 'Mar 1', status: '100%' },
          { task: '2FA TOTP Framework', owner: 'Backend', date: 'Mar 3', status: '100%' },
          { task: 'LGPD Compliance Rascunho', owner: 'Legal', date: 'Mar 2', status: '100%' }
        ]
      },
      {
        title: '⏳ EM PROGRESSO (4 tarefas = 31%, Avg 37.5%)',
        items: [
          { task: 'Autentique API (8 endpoints)', owner: 'Backend', deadline: 'Mar 8', progress: 30 },
          { task: '2FA TOTP Completo', owner: 'Backend', deadline: 'Mar 12', progress: 50 },
          { task: 'Privacy Policy LGPD', owner: 'Legal', deadline: 'Mar 18', progress: 40 },
          { task: 'Termos de Uso', owner: 'Legal', deadline: 'Mar 20', progress: 30 }
        ]
      },
      {
        title: '❌ PENDENTE (6 tarefas = 46%)',
        items: [
          { task: 'Hash SHA512 + SHA3-512', owner: 'Backend', deadline: 'Mar 15', prerequisite: 'Parecer jurídico' },
          { task: 'PDF/A-2B Generator', owner: 'Backend', deadline: 'Mar 20', prerequisite: 'Autentique 100%' },
          { task: 'Metadados Forenses', owner: 'Backend', deadline: 'Mar 18', prerequisite: 'Hash' },
          { task: 'Parecer Jurídico', owner: 'Legal', deadline: 'Mar 26', prerequisite: 'RFP sent' },
          { task: 'Testes E2E', owner: 'QA', deadline: 'Mar 20', prerequisite: 'APIs' },
          { task: 'Deploy Staging', owner: 'DevOps', deadline: 'Mar 22', prerequisite: 'E2E' }
        ]
      },
      {
        title: '🚨 BLOQUEADO (1 tarefa = 8%)',
        items: [
          { task: 'Certificado ICP/Brasil', owner: 'Legal+DevOps', deadline: 'Mar 10', blocker: 'Serasa pending' }
        ]
      }
    ]
  });

  const [autentiqueAudit] = useState({
    title: 'Autentique API Endpoints Audit',
    completion: 50,
    breakdown: [
      { category: 'Autenticação', total: 3, implemented: 2, pending: 1 },
      { category: 'Documentos', total: 8, implemented: 4, implemented_progress: 1, pending: 3 },
      { category: 'Signatários', total: 4, implemented: 2, pending: 2 },
      { category: 'Verificação', total: 3, implemented: 0, pending: 3 },
      { category: 'Webhooks', total: 3, implemented: 0, pending: 3 }
    ],
    criticalPath: [
      { endpoint: 'POST /documents/{id}/upload-file', status: '75% - Upload múltiplos PDFs', deadline: 'Mar 8' },
      { endpoint: 'POST /documents/{id}/sign', status: '0% - Assinatura digital', deadline: 'Mar 12', blocker: true },
      { endpoint: 'GET /documents/{id}/verify', status: '0% - Verificação', deadline: 'Mar 18', blocker: true }
    ]
  });

  const [multitenantAudit] = useState({
    title: 'Multitenant Implementation Status',
    completion: 76,
    modules: [
      { module: 'Tenant Isolation', components: 4, implemented: 4, coverage: 100 },
      { module: 'Auth & RBAC', components: 4, implemented: 4, coverage: 96 },
      { module: 'Documentos & Fluxos', components: 4, implemented: 4, coverage: 89 },
      { module: 'Assinatura Digital', components: 4, implemented: 2, coverage: 58, critical: true },
      { module: 'Compliance', components: 4, implemented: 3, coverage: 89 },
      { module: 'Coleta Digital', components: 4, implemented: 2, coverage: 58, critical: true },
      { module: 'Notificações', components: 4, implemented: 3, coverage: 81 },
      { module: 'Integrações Externas', components: 4, implemented: 3, coverage: 86 },
      { module: 'Performance', components: 4, implemented: 4, coverage: 91 }
    ],
    gaps: [
      'Cross-tenant data isolation tests (ZERO coverage)',
      'Biometric signature per tenant',
      'Forensic metadata capture per tenant',
      'Webhook events per tenant'
    ]
  });

  const [weeklyPlan] = useState([
    {
      week: 'Semana 1 (Mar 4-8)',
      completion: '15% → 30%',
      critical: [
        '🔴 Contato Serasa - Certificado AC',
        '🔴 Autentique API 100% (Upload)',
        '🔴 Audit multitenant endpoints',
        '🟠 RFP Parecer Jurídico'
      ],
      risks: [
        'Serasa não responder → cascata atraso',
        'API upload não atingir 100% → bloqueia Hash'
      ]
    },
    {
      week: 'Semana 2 (Mar 9-15)',
      completion: '30% → 60%',
      critical: [
        'Hash SHA512 + SHA3-512 pronto',
        'Assinatura digital implementada',
        'Webhooks setup',
        'Testes E2E scaffold'
      ],
      risks: [
        'Hash depende de parecer jurídico',
        'Biometric signature não pronta'
      ]
    },
    {
      week: 'Semana 3 (Mar 16-22)',
      completion: '60% → 95%',
      critical: [
        'Verification endpoints 100%',
        'Forensic metadata completo',
        'Testes E2E 100% cobertura',
        'Deploy Staging validado'
      ],
      readiness: 'Sprint T kickoff (Mar 24)'
    }
  ]);

  const [sprintTReadiness] = useState({
    name: 'Sprint T',
    phase: 'Assinatura Digital + Metadados Forenses Avançados',
    duration: '2 semanas (Mar 24 - Abr 6)',
    prerequisites: [
      { item: 'Autentique API 100%', deadline: 'Mar 8', critical: true },
      { item: 'Certificado AC produção', deadline: 'Mar 10', critical: true },
      { item: 'Hash integrado', deadline: 'Mar 15', critical: true },
      { item: 'Sprint S 90% completo', deadline: 'Mar 22', critical: true }
    ],
    status: 'CONDITIONAL - Depends on Sprint S 90%+',
    tasks: [
      'T-1: Assinatura com Autentique SDK (Mar 28)',
      'T-2: Captura Metadados Forenses Avançada (Abr 1)',
      'T-3: Validador Online UI (Abr 6)'
    ]
  });

  const [immediateActions] = useState([
    {
      priority: '🔴 CRÍTICO',
      action: 'Contato Serasa - Status Certificado AC',
      owner: 'Legal',
      deadline: 'Mar 4, 17:00 Manaus',
      impact: 'BLOQUEADOR - sem certificado, assinatura inválida'
    },
    {
      priority: '🔴 CRÍTICO',
      action: 'Finalizar Autentique API Upload (75% → 100%)',
      owner: 'Backend',
      deadline: 'Mar 8',
      impact: 'Desbloqueador para Hash + Sign endpoint'
    },
    {
      priority: '🔴 CRÍTICO',
      action: 'Audit ALL endpoints para multitenant compliance',
      owner: 'QA + Backend',
      deadline: 'Mar 8',
      impact: 'Garantir isolamento cross-tenant data'
    },
    {
      priority: '🟠 ALTA',
      action: 'Enviar RFP Parecer Jurídico',
      owner: 'Legal',
      deadline: 'Mar 4, 18:00',
      impact: 'Necessário para decisões técnicas (hash, signature)'
    },
    {
      priority: '🟠 ALTA',
      action: 'Daily Standup - Sincronizar Squad',
      owner: 'Executor + Leads',
      deadline: 'Mar 4, 09:00',
      impact: 'Alinhar timeline, remover bloqueadores'
    }
  ]);

  const [executorStatement] = useState({
    verdict: 'SPRINT S VIÁVEL - Projeção 95% até Mar 22',
    risks: [
      'CRÍTICO: Certificado ICP/Brasil (Serasa)',
      'ALTO: Autentique API Sign endpoint (depende certificado)',
      'MÉDIO: Multitenant data isolation (testes insuficientes)',
      'MÉDIO: Forensic metadata capture (40% implementado)'
    ],
    goLiveProjection: 'May 26, 2026 ✅ ON TRACK',
    nextSprintReadiness: 'Mar 22 EOD - Sprint T pode iniciar Mar 24'
  });

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">📋 Sprint S - Consolidated Report</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {executionSummary.sprintName} • {executionSummary.phase}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Report Date: {reportDate}</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold text-blue-600">{executionSummary.globalCompletion}%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Current Completion</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1 font-bold">Target: {executionSummary.targetCompletion}% by Mar 22</p>
        </div>
      </div>

      {/* SPRINT S STATUS OVERVIEW */}
      <Card className="border-2 border-blue-400 bg-blue-50 dark:bg-blue-950">
        <CardHeader>
          <CardTitle className="text-lg">Sprint S Status Summary</CardTitle>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{executionSummary.duration}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded">
              <p className="font-bold text-green-700 dark:text-green-300">✅ Concluído</p>
              <p className="text-lg font-bold text-green-600">3/13</p>
              <p className="text-xs">23%</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
              <p className="font-bold text-blue-700 dark:text-blue-300">⏳ Progresso</p>
              <p className="text-lg font-bold text-blue-600">4/13</p>
              <p className="text-xs">Avg 37.5%</p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded">
              <p className="font-bold text-orange-700 dark:text-orange-300">❌ Pendente</p>
              <p className="text-lg font-bold text-orange-600">6/13</p>
              <p className="text-xs">46%</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900 p-2 rounded">
              <p className="font-bold text-red-700 dark:text-red-300">🚨 Bloqueado</p>
              <p className="text-lg font-bold text-red-600">1/13</p>
              <p className="text-xs">CRÍTICO</p>
            </div>
          </div>

          {sprintSStatus.sections.map((section, i) => (
            <div key={i} className="border-l-4 border-blue-500 pl-3 py-2">
              <p className="font-bold text-blue-700 dark:text-blue-300 mb-1">{section.title}</p>
              <div className="space-y-1 text-xs">
                {section.items.map((item, j) => (
                  <div key={j} className="flex justify-between p-1 bg-white dark:bg-slate-800 rounded">
                    <span className="flex-1">{item.task}</span>
                    <div className="flex gap-1">
                      {item.status && <Badge className="bg-green-600 text-xs">{item.status}</Badge>}
                      {item.progress && <Badge className="bg-blue-600 text-xs">{item.progress}%</Badge>}
                      {item.deadline && <span className="text-gray-600 dark:text-gray-400">{item.deadline}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AUTENTIQUE API AUDIT */}
      <Card className="border-2 border-purple-500">
        <CardHeader className="bg-purple-50 dark:bg-purple-900">
          <CardTitle className="text-lg flex items-center gap-2">
            <Code2 className="w-5 h-5 text-purple-600" />
            {autentiqueAudit.title}
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{autentiqueAudit.completion}% Implementado</p>
        </CardHeader>
        <CardContent className="space-y-3 mt-4">
          <Progress value={autentiqueAudit.completion} className="h-3" />

          <div className="space-y-1 text-sm">
            {autentiqueAudit.breakdown.map((cat, i) => (
              <div key={i} className="flex justify-between p-2 bg-purple-50 dark:bg-purple-900 rounded">
                <span className="font-semibold">{cat.category}</span>
                <div className="flex gap-2">
                  <span className="text-green-600 dark:text-green-400 font-bold">{cat.implemented}</span>
                  {cat.implemented_progress && <span className="text-blue-600">+{cat.implemented_progress}</span>}
                  <span className="text-orange-600">{cat.pending}p</span>
                  <span className="text-gray-600">/{cat.total}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-red-100 dark:bg-red-900 p-2 rounded border border-red-300 dark:border-red-600">
            <p className="font-bold text-red-700 dark:text-red-300 text-sm mb-1">🔴 Critical Path</p>
            <div className="space-y-1 text-xs">
              {autentiqueAudit.criticalPath.map((cp, i) => (
                <div key={i} className="flex justify-between">
                  <span>{cp.endpoint}</span>
                  <span className="text-red-600 dark:text-red-200 font-semibold">{cp.deadline}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MULTITENANT AUDIT */}
      <Card className="border-2 border-cyan-500">
        <CardHeader className="bg-cyan-50 dark:bg-cyan-900">
          <CardTitle className="text-lg">{multitenantAudit.title}</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{multitenantAudit.completion}% Implementado</p>
        </CardHeader>
        <CardContent className="space-y-3 mt-4">
          <Progress value={multitenantAudit.completion} className="h-3" />

          <div className="space-y-1 text-sm">
            {multitenantAudit.modules.map((mod, i) => (
              <div key={i} className={`flex justify-between p-2 rounded ${mod.critical ? 'bg-orange-50 dark:bg-orange-900 border-2 border-orange-300' : 'bg-cyan-50 dark:bg-cyan-900'}`}>
                <span className="font-semibold">{mod.module}</span>
                <div className="flex gap-2">
                  <Badge className="bg-cyan-600 text-xs">{mod.coverage}%</Badge>
                  <span className="text-xs text-gray-600">{mod.implemented}/{mod.components}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded border border-orange-300">
            <p className="font-bold text-orange-700 dark:text-orange-300 text-sm mb-1">⚠️ Critical Gaps</p>
            <ul className="text-xs space-y-1 text-orange-700 dark:text-orange-200">
              {multitenantAudit.gaps.map((gap, i) => (
                <li key={i}>• {gap}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* WEEKLY EXECUTION PLAN */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📅 Plano Execução por Semana</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weeklyPlan.map((week, i) => (
            <div key={i} className="border-l-4 border-purple-500 pl-4 py-3 bg-purple-50 dark:bg-purple-900 rounded">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-purple-700 dark:text-purple-300">{week.week}</h3>
                <Badge className="bg-purple-600">{week.completion}</Badge>
              </div>
              <ul className="text-sm space-y-1 mb-2">
                {week.critical.map((crit, j) => (
                  <li key={j}>{crit}</li>
                ))}
              </ul>
              {week.risks && (
                <div className="text-xs text-orange-700 dark:text-orange-300 space-y-1">
                  {week.risks.map((risk, j) => (
                    <p key={j}>⚠️ {risk}</p>
                  ))}
                </div>
              )}
              {week.readiness && (
                <p className="text-xs text-green-700 dark:text-green-300 font-bold mt-1">✅ {week.readiness}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* IMMEDIATE ACTIONS */}
      <Card className="border-2 border-red-400 bg-red-50 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-600" />
            🎯 Ações Críticas - TODAY (Mar 4)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {immediateActions.map((action, i) => (
            <div key={i} className="p-3 bg-white dark:bg-red-900 rounded border-l-4 border-red-600 text-sm">
              <div className="flex justify-between items-start mb-1">
                <p className="font-bold">{action.action}</p>
                <Badge className={action.priority.includes('🔴') ? 'bg-red-600' : 'bg-orange-600'} className="text-xs">
                  {action.priority}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">👤 {action.owner} | 📅 {action.deadline}</p>
              <p className="text-xs font-semibold text-red-700 dark:text-red-300 mt-1">Impact: {action.impact}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SPRINT T READINESS */}
      <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-green-600" />
            🚀 Sprint T - Readiness Assessment
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {sprintTReadiness.name} • {sprintTReadiness.duration}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Badge className={sprintTReadiness.status.includes('CONDITIONAL') ? 'bg-orange-600' : 'bg-green-600'}>
            {sprintTReadiness.status}
          </Badge>

          <div>
            <p className="font-bold text-sm mb-2">Pré-requisitos:</p>
            <div className="space-y-1">
              {sprintTReadiness.prerequisites.map((pre, i) => (
                <div key={i} className="flex justify-between p-2 bg-white dark:bg-green-900 rounded text-sm">
                  <span>{pre.item}</span>
                  <div className="flex gap-2">
                    {pre.critical && <Badge className="bg-red-600 text-xs">CRÍTICO</Badge>}
                    <span className="text-xs text-gray-600">{pre.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* EXECUTOR VERDICT */}
      <Card className="border-2 border-green-500 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
        <CardContent className="pt-6 space-y-4">
          <div>
            <p className="text-xl font-bold text-green-700 dark:text-green-300 mb-2">📊 {executorStatement.verdict}</p>
            <Progress value={95} className="h-3" />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Projeção: 95% até Mar 22 | Go-Live: {executorStatement.goLiveProjection}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-3 rounded">
            <p className="font-bold text-sm text-orange-700 dark:text-orange-300 mb-2">⚠️ Riscos Identificados</p>
            <ul className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
              {executorStatement.risks.map((risk, i) => (
                <li key={i}>• {risk}</li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded">
            <p className="font-bold text-sm text-blue-700 dark:text-blue-300">📍 Próximo Checkpoint</p>
            <p className="text-xs text-blue-600 dark:text-blue-200 mt-1">{executorStatement.nextSprintReadiness}</p>
          </div>
        </CardContent>
      </Card>

      {/* FOOTER */}
      <div className="text-xs text-center text-gray-600 dark:text-gray-400 py-4 border-t">
        Consolidated Report • Executor de Sprint • {reportDate}
      </div>
    </div>
  );
}