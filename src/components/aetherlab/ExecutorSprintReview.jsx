import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, AlertCircle, Zap, ArrowRight } from 'lucide-react';

export default function ExecutorSprintReview() {
  const [sprintReview] = useState({
    currentSprint: 'Sprint S',
    period: 'Mar 5-22, 2026',
    daysElapsed: 0,
    daysRemaining: 18,
    overallCompletion: 15,
    nextSprint: 'Sprint T',
    nextPeriod: 'Mar 24 - Abr 6, 2026'
  });

  const [sprintSStatus] = useState([
    {
      category: '✅ COMPLETADO (15%)',
      items: [
        {
          id: 'S-5a',
          task: 'TLS 1.3 Verificado',
          status: 'done',
          owner: 'DevOps',
          evidence: 'Servidor HTTPS atualizado + Mozilla A+ rating'
        },
        {
          id: 'S-5b',
          task: '2FA TOTP Framework',
          status: 'done',
          owner: 'Backend',
          evidence: 'speakeasy/otplib integrado, geradores configurados'
        },
        {
          id: 'S-3a',
          task: 'LGPD Compliance Rascunho',
          status: 'done',
          owner: 'Legal',
          evidence: '40% completo, consentimento estruturado'
        }
      ]
    },
    {
      category: '⏳ EM PROGRESSO (50%)',
      items: [
        {
          id: 'S-1',
          task: 'Integração Autentique GraphQL',
          status: 'inprogress',
          owner: 'Backend',
          progress: 30,
          blocker: false,
          evidence: 'Conta criada, SDK instalado, testando primeira mutation',
          nextStep: 'Upload funcional até MAR 8'
        },
        {
          id: 'S-5',
          task: '2FA TOTP Completo',
          status: 'inprogress',
          progress: 50,
          owner: 'Backend',
          blocker: false,
          evidence: 'QR code generator, backup codes em BD',
          nextStep: 'UI login + recovery codes até MAR 12'
        },
        {
          id: 'S-3',
          task: 'Privacy Policy LGPD',
          status: 'inprogress',
          progress: 40,
          owner: 'Legal',
          blocker: false,
          evidence: 'Seções: coleta, consentimento, retenção definidas',
          nextStep: 'Revisão jurídica até MAR 18'
        },
        {
          id: 'S-4',
          task: 'Termos de Uso',
          status: 'inprogress',
          progress: 30,
          owner: 'Legal',
          blocker: false,
          evidence: 'Outline das cláusulas, responsabilidades',
          nextStep: 'Disclaimer técnico até MAR 20'
        }
      ]
    },
    {
      category: '❌ PENDENTE (35%)',
      items: [
        {
          id: 'S-2',
          task: 'Hash SHA512 + SHA3-512',
          status: 'pending',
          owner: 'Backend',
          blocker: false,
          evidence: 'Não iniciado',
          nextStep: 'Iniciar MAR 8 (paralelo com Autentique)'
        },
        {
          id: 'S-6',
          task: 'PDF/A-2B Generator',
          status: 'pending',
          owner: 'Backend',
          blocker: false,
          evidence: 'Não iniciado',
          nextStep: 'Iniciar MAR 15 (pós-hash)'
        },
        {
          id: 'BLOCKER-1',
          task: '🔴 Certificado ICP/Brasil (AC)',
          status: 'blocked',
          owner: 'Legal + DevOps',
          blocker: true,
          evidence: 'RFP enviada à Serasa em MAR 1, aguardando resposta',
          nextStep: 'Follow-up DIÁRIO | prazo crítico: MAR 10',
          risk: 'SEM CERTIFICADO = sem assinatura legal em Autentique'
        }
      ]
    }
  ]);

  const [criticalActions] = useState([
    {
      priority: '🔴 CRÍTICO',
      action: 'Certificado ICP/Brasil',
      daysLeft: 6,
      owner: 'Legal + DevOps',
      status: 'Contato Serasa HOJE',
      deadline: 'Mar 10, 2026'
    },
    {
      priority: '🟠 ALTA',
      action: 'API Autentique 100% funcional',
      daysLeft: 3,
      owner: 'Backend',
      status: 'Upload PDF com signatários',
      deadline: 'Mar 8, 2026'
    },
    {
      priority: '🟡 MÉDIA',
      action: 'Hash SHA512/SHA3 iniciado',
      daysLeft: 3,
      owner: 'Backend',
      status: 'Algoritmo testado',
      deadline: 'Mar 8, 2026'
    },
    {
      priority: '🟡 MÉDIA',
      action: 'Parecer Jurídico (RFP)',
      daysLeft: 11,
      owner: 'Legal',
      status: 'Especialista contratado',
      deadline: 'Mar 15, 2026'
    }
  ]);

  const [nextSprintTasks] = useState([
    {
      sprint: 'Sprint T',
      phase: 'Assinatura Digital + Metadados Forenses',
      period: 'Mar 24 - Abr 6, 2026',
      startDate: 'Mar 24',
      tasks: [
        {
          id: 'T-1',
          name: 'Assinatura com Autentique SDK',
          desc: 'Integrar método signDocument(id) com cert. ICP/Brasil',
          owner: 'Backend',
          deadline: 'Mar 28',
          estimatedHours: 16
        },
        {
          id: 'T-2',
          name: 'Captura Metadados Forenses',
          desc: 'IP + User Agent + DNS + Traceroute + Certificados SSL',
          owner: 'Backend',
          deadline: 'Abr 1',
          estimatedHours: 24
        },
        {
          id: 'T-3',
          name: 'Validador Online (UI)',
          desc: 'Upload → Validação automática → Resultado em português',
          owner: 'Frontend',
          deadline: 'Abr 6',
          estimatedHours: 20
        }
      ]
    }
  ]);

  const [metrics] = useState({
    completionByPhase: [
      { phase: 'Integração Autentique', completion: 30 },
      { phase: 'Hash SHA512/SHA3', completion: 0 },
      { phase: 'Segurança (2FA + TLS)', completion: 50 },
      { phase: 'Conformidade LGPD', completion: 40 },
      { phase: 'PDF/A-2B Generator', completion: 20 }
    ],
    daysUsed: 0,
    daysTotal: 18,
    tasksCompleted: 3,
    tasksTotal: 13,
    blockers: 1,
    risks: 1
  });

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 min-h-screen">
      <div>
        <h1 className="text-4xl font-bold">🎯 Executor de Sprint - Revisão & Status</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Data: Mar 4, 2026 | Hora: Revisão Sprint S (Dia 0)</p>
      </div>

      {/* 📊 RESUMO GERAL */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-2 border-blue-300">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Completude Sprint S</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">15%</p>
            <Progress value={15} className="mt-3" />
            <p className="text-xs text-gray-600 mt-2">3/13 tarefas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Dias Restantes</p>
            <p className="text-4xl font-bold text-orange-600 mt-2">{metrics.daysTotal}</p>
            <p className="text-xs text-gray-600 mt-2">Até Mar 22</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Tarefas Completadas</p>
            <p className="text-4xl font-bold text-green-600 mt-2">3/13</p>
            <p className="text-xs text-gray-600 mt-2">23%</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-300">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Bloqueadores</p>
            <p className="text-4xl font-bold text-red-600 mt-2">1</p>
            <p className="text-xs text-red-600 mt-2">Certificado AC</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-300">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Riscos</p>
            <p className="text-4xl font-bold text-yellow-600 mt-2">1</p>
            <p className="text-xs text-yellow-600 mt-2">Crítico</p>
          </CardContent>
        </Card>
      </div>

      {/* 🔴 BLOQUEADORES CRÍTICOS */}
      <Card className="border-2 border-red-500 bg-red-50 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            🔴 Bloqueador Crítico - Ação Imediata
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white dark:bg-red-900 p-4 rounded-lg border-l-4 border-red-600">
            <p className="font-bold text-lg">Certificado ICP/Brasil (Autoridade Certificadora)</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              Status: RFP enviada Serasa (Mar 1) | Aguardando resposta
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              <strong>RISCO:</strong> Sem certificado = Assinatura Autentique NÃO é válida legalmente
            </p>
            <p className="text-sm text-red-700 font-semibold mt-3">
              ⚠️ AÇÃO HOJE (Mar 4): Contato direto Serasa + backup com Certisign
            </p>
            <p className="text-sm text-red-700 font-semibold">
              📅 PRAZO CRÍTICO: Mar 10 (certificado em mão)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ✅ O QUE FOI FEITO - Sprint S */}
      {sprintSStatus.map((section, idx) => (
        <Card key={idx} className={section.category.includes('✅') ? 'border-green-300 bg-green-50 dark:bg-green-950' : section.category.includes('⏳') ? 'border-blue-300' : 'border-orange-300 bg-orange-50 dark:bg-orange-950'}>
          <CardHeader>
            <CardTitle className="text-lg">{section.category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {section.items.map((item) => (
              <div key={item.id} className="border-l-4 border-current pl-4 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">{item.id}: {item.task}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">👤 {item.owner}</p>
                    {item.progress && (
                      <div className="mt-2 flex items-center gap-2">
                        <Progress value={item.progress} className="flex-1 max-w-xs" />
                        <span className="text-sm font-semibold">{item.progress}%</span>
                      </div>
                    )}
                  </div>
                  {item.status === 'done' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  {item.status === 'inprogress' && <Circle className="w-5 h-5 text-blue-600" />}
                  {item.status === 'pending' && <Circle className="w-5 h-5 text-gray-400" />}
                  {item.status === 'blocked' && <AlertCircle className="w-5 h-5 text-red-600" />}
                </div>
                
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  <strong>Evidência:</strong> {item.evidence}
                </p>
                
                {item.nextStep && (
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 font-semibold">
                    <strong>Próximo:</strong> {item.nextStep}
                  </p>
                )}

                {item.risk && (
                  <p className="text-xs text-red-700 dark:text-red-300 mt-1 font-semibold bg-red-100 dark:bg-red-900 p-1 rounded">
                    <strong>⚠️ RISCO:</strong> {item.risk}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* 🚨 AÇÕES CRÍTICAS (PRÓXIMOS 24H) */}
      <Card className="border-2 border-red-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-red-600" />
            ⚡ Ações Críticas - Próximas 24 Horas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {criticalActions.map((action, idx) => (
              <div key={idx} className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4" style={{ borderLeftColor: action.priority.includes('🔴') ? '#dc2626' : action.priority.includes('🟠') ? '#ea580c' : '#eab308' }}>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={action.priority.includes('🔴') ? 'destructive' : 'default'}>
                      {action.priority}
                    </Badge>
                    <p className="font-semibold">{action.action}</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">👤 {action.owner}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status: {action.status}</p>
                  <p className="text-xs text-orange-600 mt-1">⏰ {action.daysLeft} dias | {action.deadline}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 🎯 PRÓXIMO SPRINT (Sprint T) */}
      <Card className="border-2 border-purple-300 bg-purple-50 dark:bg-purple-950">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-purple-700 dark:text-purple-300">→ Sprint T - Próximo Passo</CardTitle>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Inicia: Mar 24, 2026</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {nextSprintTasks.map((sprint) => (
            <div key={sprint.sprint}>
              <p className="font-semibold text-lg">{sprint.sprint}: {sprint.phase}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{sprint.period}</p>
              <div className="mt-3 space-y-2">
                {sprint.tasks.map((task) => (
                  <div key={task.id} className="bg-white dark:bg-gray-800 p-3 rounded border-l-4 border-purple-400">
                    <p className="font-semibold">{task.id}: {task.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.desc}</p>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-600 dark:text-gray-400">
                      <span>👤 {task.owner}</span>
                      <span>📅 {task.deadline}</span>
                      <span className="font-semibold">⏱ {task.estimatedHours}h</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 📊 VELOCIDADE & PROJEÇÃO */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Velocidade & Projeção</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tarefas/Dia</p>
              <p className="text-3xl font-bold">0.17</p>
              <p className="text-xs text-gray-600 mt-1">Meta: 0.72 tarefas/dia</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Taxa Conclusão</p>
              <p className="text-3xl font-bold">23%</p>
              <p className="text-xs text-orange-600 mt-1">Alerta: Abaixo da meta</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Projeção Final</p>
              <p className="text-3xl font-bold">~30%</p>
              <p className="text-xs text-red-600 mt-1">Risco: Sprint incompleto</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ação Necessária</p>
              <p className="text-3xl font-bold">↑ 3x</p>
              <p className="text-xs text-orange-600 mt-1">Acelerar tarefas críticas</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-orange-100 dark:bg-orange-900 rounded-lg border-l-4 border-orange-600">
            <p className="font-semibold text-orange-900 dark:text-orange-100">⚠️ Recomendação:</p>
            <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
              - Aumentar alocação Backend (Autentique + Hash = paralelo)
            </p>
            <p className="text-sm text-orange-800 dark:text-orange-200">
              - Daily standup 09:00 para remover bloqueadores
            </p>
            <p className="text-sm text-orange-800 dark:text-orange-200">
              - Contato AC TODOS OS DIAS até Mar 10
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ✅ CONCLUSÃO & PRÓXIMO PASSO */}
      <Card className="border-2 border-green-400 bg-green-50 dark:bg-green-950">
        <CardHeader>
          <CardTitle className="text-green-700 dark:text-green-300">✅ Conclusão & Próximo Passo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="font-semibold text-lg">Sprint S Status</p>
            <p className="text-sm mt-1">Iniciado: Mar 4, 2026 | Completude: 15% | Risco: CRÍTICO (Certificado AC)</p>
          </div>
          <div>
            <p className="font-semibold text-lg">O que Deve Acontecer Agora</p>
            <ul className="text-sm space-y-1 mt-1">
              <li>✅ Contato HOJE com Serasa para certificado ICP/Brasil</li>
              <li>✅ Backend inicia API Autentique (mutation createDocument)</li>
              <li>✅ Backend inicia Hash SHA512/SHA3 (paralelo)</li>
              <li>✅ Legal finaliza Privacy Policy LGPD (Mar 18)</li>
              <li>✅ RFP para Parecer Jurídico (especialista contratado)</li>
            </ul>
          </div>
          <div className="mt-4 p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <p className="font-bold text-green-900 dark:text-green-100">🎯 Meta Sprint S: Mar 22, 2026</p>
            <p className="text-sm text-green-800 dark:text-green-200 mt-1">
              Se bloqueador AC for resolvido = Sprint S 90%+ completado (transição suave para Sprint T em Mar 24)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}