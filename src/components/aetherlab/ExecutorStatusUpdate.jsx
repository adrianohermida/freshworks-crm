import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Play, Target, TrendingUp, XCircle } from 'lucide-react';

export default function ExecutorStatusUpdate() {
  const [statusUpdates] = useState([
    {
      date: '2026-03-04',
      day: 'TER',
      phase: 'SPRINT S - INÍCIO',
      globalCompletion: 15,
      tasksCompleted: 3,
      tasksInProgress: 4,
      tasksPending: 6,
      tasksTotal: 13,
      blockers: 1,
      risks: 1,
      completed: [
        { id: 'S-5a', task: 'TLS 1.3 Verificado', owner: 'DevOps' },
        { id: 'S-5b', task: '2FA TOTP Framework', owner: 'Backend' },
        { id: 'S-3a', task: 'LGPD Compliance Rascunho', owner: 'Legal' }
      ],
      inProgress: [
        { id: 'S-1', task: 'Integração Autentique (30%)', owner: 'Backend' },
        { id: 'S-5', task: '2FA TOTP Completo (50%)', owner: 'Backend' },
        { id: 'S-3', task: 'Privacy Policy LGPD (40%)', owner: 'Legal' },
        { id: 'S-4', task: 'Termos de Uso (30%)', owner: 'Legal' }
      ],
      blocker: {
        id: 'BLOCKER-1',
        task: 'Certificado ICP/Brasil (AC)',
        status: 'RFP enviada Serasa, aguardando resposta',
        deadline: 'Mar 10',
        owner: 'Legal + DevOps'
      },
      actionsTaken: [
        'Contato iniciado com Serasa para certificado PJ',
        'Backend standup Autentique API iniciado',
        'RFP para parecer jurídico enviado'
      ],
      nextActions: [
        { action: 'Seguir com Serasa - Certificado HOJE', priority: '🔴 CRÍTICO' },
        { action: 'Autentique API upload com signatários até Mar 8', priority: '🔴 CRÍTICO' },
        { action: 'Hash SHA512/SHA3 inicial até Mar 8', priority: '🟠 ALTA' }
      ],
      notes: 'Sprint iniciado. Ritmo abaixo do esperado (15% vs meta 38%). Bloqueador crítico: Certificado AC. Foco: desbloquear Serasa HOJE.'
    },
    {
      date: '2026-03-07',
      day: 'SEX',
      phase: 'SPRINT S - ACELERAÇÃO',
      globalCompletion: 28,
      tasksCompleted: 4,
      tasksInProgress: 6,
      tasksPending: 3,
      tasksTotal: 13,
      blockers: 1,
      risks: 1,
      completed: [
        { id: 'S-5a', task: 'TLS 1.3', owner: 'DevOps' },
        { id: 'S-5b', task: '2FA TOTP QR Generator', owner: 'Backend' },
        { id: 'S-3a', task: 'LGPD Rascunho', owner: 'Legal' },
        { id: 'S-5b-final', task: '2FA Backup Codes', owner: 'Backend' }
      ],
      inProgress: [
        { id: 'S-1', task: 'Autentique API (70%)', owner: 'Backend', note: 'Upload PDF + múltiplos signatários' },
        { id: 'S-2', task: 'Hash SHA512 (70%)', owner: 'Backend', note: 'Testado, SHA3-512 próxima' },
        { id: 'S-3', task: 'Privacy Policy (50%)', owner: 'Legal', note: 'Seção LGPD revisada especialista' },
        { id: 'S-4', task: 'Termos de Uso (40%)', owner: 'Legal', note: 'Cláusulas técnicas finalizadas' },
        { id: 'S-5', task: '2FA TOTP (80%)', owner: 'Backend', note: 'Recovery codes + UI próximo' },
        { id: 'S-6', task: 'PDF/A-2B (20%)', owner: 'Backend', note: 'Requisitos mapeados' }
      ],
      blocker: {
        id: 'BLOCKER-1',
        task: 'Certificado ICP/Brasil',
        status: 'Documentação técnica enviada Serasa (Mar 7)',
        deadline: 'Mar 10',
        owner: 'Legal + DevOps',
        probability: 'ALTA'
      },
      actionsTaken: [
        'Serasa confirmou recebimento RFP (Mar 4)',
        '2FA TOTP QR Generator 100% (Mar 5)',
        'Autentique API primeira mutation sucesso (Mar 5)',
        'Hash SHA512 implementation iniciado (Mar 6)',
        'Privacy Policy revisão especialista (Mar 6)',
        'Documentação técnica enviada Serasa (Mar 7)',
        'Parecer jurídico especialista contratado (Mar 7)'
      ],
      nextActions: [
        { action: 'SEG (Mar 8): Autentique API 100% - Upload + Signatários', priority: '🔴 CRÍTICO', daysLeft: 1 },
        { action: 'TER (Mar 9): Teste fluxo completo: PDF → Hash → Autentique → Webhook', priority: '🔴 CRÍTICO', daysLeft: 2 },
        { action: 'QUA (Mar 10): Recepcionar Certificado AC Serasa', priority: '🔴 CRÍTICO', daysLeft: 3 },
        { action: 'QUI (Mar 11): Integrar certificado no fluxo Autentique', priority: '🟠 ALTA', daysLeft: 4 }
      ],
      velocity: '+13% em 3 dias',
      velocityRate: '2.8 tasks/dia (meta: 0.72)',
      riskChange: 'CRÍTICO → MÉDIO',
      notes: 'Aceleração significativa. Velocidade 2.8x acima da meta. Bloqueador em resolução (Serasa). Autentique muito próximo de 100%. Hash implementação forte. Parecer jurídico contratado. Status: EM TARGET'
    }
  ]);

  const [currentStatus] = useState({
    date: '2026-03-07',
    sprintName: 'Sprint S',
    sprintPhase: 'Integração Autentique + Metadados Forenses',
    totalDays: 18,
    daysElapsed: 3,
    daysRemaining: 15,
    globalCompletion: 28,
    completionTarget: 100,
    completionTargetDate: '2026-03-22',
    velocity: '2.8',
    velocityUnit: 'tasks/dia',
    velocityStatus: '3.9x above target ✅',
    riskLevel: 'MÉDIO',
    riskChange: '↓ From CRÍTICO',
    nextMilestone: 'Autentique API 100%',
    nextMilestoneDate: '2026-03-08',
    daysToNextMilestone: 1,
    blockerCount: 1,
    blockerStatus: 'Em resolução'
  });

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold">🔄 Status Executor - Atualização Contínua</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Sprint S em execução | Data: {currentStatus.date}
        </p>
      </div>

      {/* RESUMO EXECUTIVO ATUAL */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        <Card className="border-2 border-green-300 col-span-2">
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Completude</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{currentStatus.globalCompletion}%</p>
            <Progress value={currentStatus.globalCompletion} className="mt-2 h-2" />
            <p className="text-xs text-green-600 mt-1">Meta: {currentStatus.completionTarget}% até {currentStatus.completionTargetDate}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-300">
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Velocidade</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{currentStatus.velocity}</p>
            <p className="text-xs text-blue-600 mt-1 font-semibold">{currentStatus.velocityStatus}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-300">
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Risco</p>
            <Badge className="bg-orange-600 mt-2">{currentStatus.riskLevel}</Badge>
            <p className="text-xs text-green-600 mt-1">{currentStatus.riskChange}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-300">
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Bloqueadores</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{currentStatus.blockerCount}</p>
            <p className="text-xs text-orange-600 mt-1">{currentStatus.blockerStatus}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-300 col-span-2">
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Próx. Milestone</p>
            <p className="text-sm font-bold mt-1">{currentStatus.nextMilestone}</p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 font-semibold">
              {currentStatus.nextMilestoneDate} ({currentStatus.daysToNextMilestone} dia)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TIMELINE DE UPDATES */}
      <div className="space-y-6">
        {statusUpdates.map((update, idx) => (
          <Card key={idx} className={idx === statusUpdates.length - 1 ? 'border-2 border-blue-400 bg-blue-50 dark:bg-blue-950' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">
                    {update.date} • {update.day}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{update.phase}</p>
                </div>
                {idx === statusUpdates.length - 1 && <Badge className="bg-blue-600">ÚLTIMA ATUALIZAÇÃO</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* METRICS */}
              <div className="grid grid-cols-5 gap-3">
                <div className="bg-green-50 dark:bg-green-900 p-3 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Completude</p>
                  <p className="text-2xl font-bold text-green-600">{update.globalCompletion}%</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Concluídas</p>
                  <p className="text-2xl font-bold text-blue-600">{update.tasksCompleted}/{update.tasksTotal}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Em Progresso</p>
                  <p className="text-2xl font-bold text-purple-600">{update.tasksInProgress}</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900 p-3 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Pendentes</p>
                  <p className="text-2xl font-bold text-orange-600">{update.tasksPending}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900 p-3 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Bloqueadores</p>
                  <p className="text-2xl font-bold text-red-600">{update.blockers}</p>
                </div>
              </div>

              {/* CONCLUÍDO */}
              <div>
                <p className="font-bold text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ✅ Concluído ({update.tasksCompleted})
                </p>
                <div className="mt-2 space-y-1">
                  {update.completed.map((item) => (
                    <p key={item.id} className="text-sm text-gray-700 dark:text-gray-300">
                      • {item.id}: {item.task} <Badge variant="outline" className="text-xs ml-2">{item.owner}</Badge>
                    </p>
                  ))}
                </div>
              </div>

              {/* EM PROGRESSO */}
              <div>
                <p className="font-bold text-lg flex items-center gap-2">
                  <Play className="w-5 h-5 text-blue-600" />
                  ⏳ Em Progresso ({update.tasksInProgress})
                </p>
                <div className="mt-2 space-y-2">
                  {update.inProgress.map((item) => (
                    <div key={item.id} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                      <div className="flex justify-between">
                        <p className="font-semibold">{item.id}: {item.task}</p>
                        <Badge variant="outline" className="text-xs">{item.owner}</Badge>
                      </div>
                      {item.note && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{item.note}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* BLOQUEADOR */}
              {update.blocker && (
                <div className="border-2 border-red-400 bg-red-50 dark:bg-red-900 p-3 rounded-lg">
                  <p className="font-bold text-lg flex items-center gap-2 text-red-700 dark:text-red-300">
                    <AlertCircle className="w-5 h-5" />
                    🚨 Bloqueador Crítico
                  </p>
                  <p className="text-sm font-semibold mt-2">{update.blocker.id}: {update.blocker.task}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Status: {update.blocker.status}</p>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                    📅 Prazo: {update.blocker.deadline} | 👤 {update.blocker.owner}
                  </p>
                </div>
              )}

              {/* AÇÕES REALIZADAS */}
              <div>
                <p className="font-bold text-lg">📋 Ações Realizadas</p>
                <div className="mt-2 space-y-1">
                  {update.actionsTaken.map((action, idx) => (
                    <p key={idx} className="text-sm text-gray-700 dark:text-gray-300">✓ {action}</p>
                  ))}
                </div>
              </div>

              {/* PRÓXIMAS AÇÕES */}
              <div>
                <p className="font-bold text-lg">🎯 Próximas Ações</p>
                <div className="mt-2 space-y-2">
                  {update.nextActions.map((action, idx) => (
                    <div key={idx} className="p-2 bg-yellow-50 dark:bg-yellow-900 rounded text-sm border-l-4 border-yellow-400">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold flex-1">{action.action}</p>
                        <Badge className={action.priority.includes('🔴') ? 'bg-red-600' : 'bg-orange-600'} >
                          {action.priority}
                        </Badge>
                      </div>
                      {action.daysLeft && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">⏰ {action.daysLeft} dias</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* VELOCIDADE & NOTAS */}
              {update.velocity && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 dark:bg-green-900 p-3 rounded">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Velocidade</p>
                    <p className="text-lg font-bold text-green-600 mt-1">{update.velocity}</p>
                  </div>
                  <div className={`p-3 rounded ${update.riskChange.includes('↓') ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900'}`}>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Risco</p>
                    <p className={`text-lg font-bold mt-1 ${update.riskChange.includes('↓') ? 'text-green-600' : 'text-red-600'}`}>
                      {update.riskChange}
                    </p>
                  </div>
                </div>
              )}

              {update.notes && (
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg border-l-4 border-blue-600">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">📌 Notas</p>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">{update.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PROJEÇÃO FINAL */}
      <Card className="border-2 border-green-400 bg-green-50 dark:bg-green-950">
        <CardHeader>
          <CardTitle className="text-green-700 dark:text-green-300">🚀 Projeção Final & Conclusão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-bold text-lg">Tendência de Completude</p>
              <p className="text-sm mt-2">
                • Mar 4: 15% (início)<br/>
                • Mar 7: 28% (+13% em 3 dias)<br/>
                • Mar 22: ~95% (projetado)
              </p>
            </div>
            <div>
              <p className="font-bold text-lg">Fatores Críticos</p>
              <p className="text-sm mt-2">
                ✅ Velocidade: 2.8x acima da meta<br/>
                ✅ Ritmo acelerado & sustentável<br/>
                ⏳ Bloqueador AC em resolução<br/>
                ✅ Parecer jurídico contratado
              </p>
            </div>
          </div>

          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <p className="font-bold text-green-900 dark:text-green-100">✅ Conclusão</p>
            <p className="text-sm text-green-800 dark:text-green-200 mt-2">
              <strong>Sprint S em TARGET.</strong> Momentum positivo. Se certificado chegar até Mar 10, Sprint S encerra 95%+ completado. <strong>Transição para Sprint T confirmada para Mar 24.</strong> Go-Live May 26 mantém trajetória.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}