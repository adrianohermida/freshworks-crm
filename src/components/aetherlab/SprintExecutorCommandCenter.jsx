import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, AlertCircle, Zap, Target, Clock, ArrowRight, Flame } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SprintExecutorCommandCenter() {
  const [executionStatus] = useState({
    date: '2026-03-04',
    time: '09:00 (Manaus/AM)',
    sprintCurrent: 'Sprint S',
    sprintDays: '18 dias',
    globalCompletion: 15
  });

  const [immediateActions] = useState([
    {
      order: 1,
      priority: '🔴 CRÍTICO',
      action: 'Contato Direto Serasa',
      details: 'Certificado ICP/Brasil A3 PJ',
      owner: 'Legal + DevOps',
      deadline: 'HOJE (Mar 4) - 09:00',
      contact: 'Tel: 0800 ou email: certificados@serasa.com.br',
      status: 'AGUARDANDO EXECUÇÃO',
      consequence: 'SEM = Sprint S falha + Autentique inválido'
    },
    {
      order: 2,
      priority: '🔴 CRÍTICO',
      action: 'Backend: API Autentique Funcional',
      details: 'POST GraphQL com createDocument (upload + signatários)',
      owner: 'Backend',
      deadline: 'Mar 8, 2026 (17:00)',
      contact: 'npm test / localhost:3000/api/autentique',
      status: 'EM PROGRESSO (30%)',
      consequence: 'SEM = Sprint T não pode iniciar'
    },
    {
      order: 3,
      priority: '🟠 ALTA',
      action: 'Backend: Hash SHA512/SHA3',
      details: 'Geração dupla ANTES de enviar para Autentique',
      owner: 'Backend',
      deadline: 'Mar 15, 2026 (17:00)',
      contact: 'src/utils/hash.js | testes em src/tests/hash.test.js',
      status: 'NÃO INICIADO',
      consequence: 'Atraso na cadeia de custódia'
    },
    {
      order: 4,
      priority: '🟠 ALTA',
      action: 'Legal: RFP Parecer Jurídico',
      details: 'Contratar especialista em direito digital (parecer formal)',
      owner: 'Legal',
      deadline: 'Mar 15, 2026',
      contact: 'RFP enviado | aguardando proposta',
      status: 'PENDENTE',
      consequence: 'Falta validação jurídica para Go-Live'
    },
    {
      order: 5,
      priority: '🟡 MÉDIA',
      action: 'Legal: Privacy Policy Final',
      details: 'Revisão jurídica + aprovação LGPD',
      owner: 'Legal',
      deadline: 'Mar 18, 2026',
      contact: 'docs/legal/privacy-policy.md',
      status: 'RASCUNHO (40%)',
      consequence: 'Launch delay se não pronto'
    }
  ]);

  const [sprintChart] = useState([
    { day: 'Mar 4', completed: 3, inProgress: 4, pending: 6, completion: 15 },
    { day: 'Mar 8', completed: 5, inProgress: 5, pending: 3, completion: 38 },
    { day: 'Mar 15', completed: 8, inProgress: 4, pending: 1, completion: 62 },
    { day: 'Mar 22', completed: 13, inProgress: 0, pending: 0, completion: 100 }
  ]);

  const [validationChecklist] = useState([
    {
      category: 'INTEGRAÇÃO AUTENTIQUE',
      items: [
        { id: 'A1', task: 'Conta Autentique ativa', status: 'DONE', date: 'Mar 1' },
        { id: 'A2', task: 'Token API gerado', status: 'DONE', date: 'Mar 2' },
        { id: 'A3', task: 'SDK @autentique/sdk instalado', status: 'DONE', date: 'Mar 3' },
        { id: 'A4', task: 'Mutation createDocument testada', status: 'IN_PROGRESS', date: 'Mar 4-8' },
        { id: 'A5', task: 'Upload PDF com signatários funcional', status: 'PENDING', date: 'Mar 8' },
        { id: 'A6', task: 'Resposta webhook (assinatura) processada', status: 'PENDING', date: 'Mar 15' }
      ]
    },
    {
      category: 'HASH & INTEGRIDADE',
      items: [
        { id: 'H1', task: 'Algoritmo SHA512 implementado', status: 'PENDING', date: 'Mar 8-10' },
        { id: 'H2', task: 'Algoritmo SHA3-512 implementado', status: 'PENDING', date: 'Mar 10-12' },
        { id: 'H3', task: 'Hash gerado PRÉ-assinatura', status: 'PENDING', date: 'Mar 12-15' },
        { id: 'H4', task: 'Validador online testado', status: 'PENDING', date: 'Mar 20' }
      ]
    },
    {
      category: 'SEGURANÇA & CONFORMIDADE',
      items: [
        { id: 'S1', task: 'TLS 1.3 ativo (Mozilla A+)', status: 'DONE', date: 'Mar 1' },
        { id: 'S2', task: '2FA TOTP implementado', status: 'IN_PROGRESS', date: 'Mar 4-12' },
        { id: 'S3', task: 'Privacy Policy assinado', status: 'PENDING', date: 'Mar 18' },
        { id: 'S4', task: 'Termos de Uso finalizados', status: 'PENDING', date: 'Mar 20' },
        { id: 'S5', task: 'Certificado ICP/Brasil em mão', status: 'PENDING', date: 'Mar 10' }
      ]
    },
    {
      category: 'DOCUMENTAÇÃO & LEGAL',
      items: [
        { id: 'L1', task: 'Privacy Policy LGPD (40%)', status: 'IN_PROGRESS', date: 'Mar 4-18' },
        { id: 'L2', task: 'Termos de Uso (30%)', status: 'IN_PROGRESS', date: 'Mar 4-20' },
        { id: 'L3', task: 'Parecer jurídico especialista', status: 'PENDING', date: 'Mar 15-26' },
        { id: 'L4', task: 'Relatório Técnico anexado', status: 'PENDING', date: 'Mar 20' }
      ]
    }
  ]);

  const [nextSprintReadiness] = useState({
    sprintT: 'Sprint T',
    startDate: 'Mar 24, 2026',
    duration: '14 dias (Mar 24 - Abr 6)',
    readiness: 'CONDICIONAL',
    requirements: [
      {
        item: 'Autentique 100% funcional',
        status: 'NÃO',
        critical: true,
        note: 'DEVE estar pronto até Mar 22'
      },
      {
        item: 'Hash SHA512/SHA3 implementado',
        status: 'NÃO',
        critical: true,
        note: 'DEVE estar pronto até Mar 22'
      },
      {
        item: 'Certificado ICP/Brasil',
        status: 'NÃO',
        critical: true,
        note: 'URGENTE: Mar 10'
      },
      {
        item: 'Pipeline CI/CD testado',
        status: 'PARCIAL',
        critical: false,
        note: 'Em progresso'
      },
      {
        item: 'Banco de dados prod setup',
        status: 'NÃO',
        critical: true,
        note: 'Deve estar pronto Mar 20'
      }
    ]
  });

  const [riskMitigation] = useState([
    {
      risk: '🔴 Certificado AC delay',
      probability: 'ALTA',
      impact: 'CRÍTICO',
      mitigation: 'Contato diário + backup Certisign',
      owner: 'Legal',
      deadline: 'Mar 10'
    },
    {
      risk: '🟠 API Autentique instável',
      probability: 'MÉDIA',
      impact: 'ALTO',
      mitigation: 'Fallback local + retry logic',
      owner: 'Backend',
      deadline: 'Mar 8'
    },
    {
      risk: '🟠 Hash não compatível com Autentique',
      probability: 'MÉDIA',
      impact: 'MÉDIO',
      mitigation: 'Testes de integração Mar 15',
      owner: 'Backend',
      deadline: 'Mar 15'
    },
    {
      risk: '🟡 Parecer jurídico atraso',
      probability: 'BAIXA',
      impact: 'MÉDIO',
      mitigation: 'RFP urgente + deadline Mar 26',
      owner: 'Legal',
      deadline: 'Mar 15'
    }
  ]);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">🎯 Executor de Sprint - Command Center</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Data: {executionStatus.date} | Hora: {executionStatus.time}
          </p>
        </div>
        <div className="text-right">
          <Badge className="text-lg px-4 py-2 bg-blue-500">Sprint S Ativo</Badge>
          <p className="text-sm text-gray-600 mt-2">{executionStatus.sprintDays}</p>
        </div>
      </div>

      {/* STATUS GERAL */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-blue-300">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Completude Sprint S</p>
            <p className="text-4xl font-bold text-blue-600">{executionStatus.globalCompletion}%</p>
            <Progress value={executionStatus.globalCompletion} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Tarefas Concluídas</p>
            <p className="text-4xl font-bold text-green-600">3/13</p>
            <p className="text-xs text-green-600 mt-2">23%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Em Progresso</p>
            <p className="text-4xl font-bold text-blue-600">4/13</p>
            <p className="text-xs text-blue-600 mt-2">31%</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-400">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Bloqueadores</p>
            <p className="text-4xl font-bold text-red-600">1</p>
            <p className="text-xs text-red-600 mt-2">Certificado AC</p>
          </CardContent>
        </Card>
      </div>

      {/* 🚨 AÇÕES IMEDIATAS */}
      <Card className="border-2 border-red-500 bg-red-50 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <Flame className="w-5 h-5" />
            🚨 AÇÕES IMEDIATAS - Próximas 24 Horas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {immediateActions.map((action) => (
            <div key={action.order} className="border-l-4 border-current pl-4 py-2 rounded-lg bg-white dark:bg-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">{action.priority}</Badge>
                    <p className="font-bold text-lg">{action.order}. {action.action}</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{action.details}</p>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Responsável:</p>
                  <p className="font-semibold">{action.owner}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Prazo:</p>
                  <p className="font-semibold text-red-600">{action.deadline}</p>
                </div>
              </div>

              {action.contact && (
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  📞 {action.contact}
                </p>
              )}

              <div className="mt-2 p-2 bg-red-100 dark:bg-red-900 rounded">
                <p className="text-xs font-semibold text-red-700 dark:text-red-300">
                  ⚠️ Se não completar: {action.consequence}
                </p>
              </div>

              <Badge className="mt-2 bg-yellow-600">{action.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 📊 PROJEÇÃO DE COMPLETUDE */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Projeção de Completude (Sprint S)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sprintChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#10b981" name="Completadas" />
              <Bar dataKey="inProgress" fill="#3b82f6" name="Em Progresso" />
              <Bar dataKey="pending" fill="#ef4444" name="Pendentes" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-orange-100 dark:bg-orange-900 rounded-lg text-sm">
            <p className="font-semibold text-orange-900 dark:text-orange-100">
              Projeção: 100% até Mar 22 (Se bloqueador AC for resolvido hoje)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ✅ CHECKLIST DE VALIDAÇÃO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            ✅ Checklist de Validação Sprint S
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {validationChecklist.map((category) => (
            <div key={category.category}>
              <p className="font-bold text-lg mb-2">{category.category}</p>
              <div className="space-y-1">
                {category.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                    {item.status === 'DONE' && <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />}
                    {item.status === 'IN_PROGRESS' && <Circle className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                    {item.status === 'PENDING' && <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                    
                    <span className="flex-1">{item.id}: {item.task}</span>
                    <Badge variant={item.status === 'DONE' ? 'default' : 'secondary'}>
                      {item.date}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 🔄 TRANSIÇÃO SPRINT T */}
      <Card className="border-2 border-purple-300 bg-purple-50 dark:bg-purple-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-purple-600" />
            🔄 Readiness para Sprint T
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Inicia: {nextSprintReadiness.startDate} | Duração: {nextSprintReadiness.duration}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Badge className={nextSprintReadiness.readiness === 'CONDICIONAL' ? 'bg-orange-600' : 'bg-green-600'}>
            Status: {nextSprintReadiness.readiness}
          </Badge>

          <div className="space-y-2">
            {nextSprintReadiness.requirements.map((req, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded text-sm">
                {req.status === 'NÃO' && req.critical && <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
                {req.status === 'NÃO' && !req.critical && <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                {req.status === 'PARCIAL' && <Circle className="w-4 h-4 text-yellow-600 flex-shrink-0" />}
                
                <div className="flex-1">
                  <p className="font-semibold">{req.item}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{req.note}</p>
                </div>
                
                <Badge variant={req.status === 'NÃO' && req.critical ? 'destructive' : 'secondary'}>
                  {req.status}
                </Badge>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 rounded-lg">
            <p className="text-sm font-semibold text-red-900 dark:text-red-100">
              ⚠️ Sprint T SÓ pode iniciar quando Sprint S tem 90%+ completado (inclui Autentique + Hash)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 🛡️ MITIGAÇÃO DE RISCOS */}
      <Card className="border-2 border-orange-300">
        <CardHeader>
          <CardTitle>🛡️ Plano de Mitigação de Riscos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {riskMitigation.map((risk, idx) => (
            <div key={idx} className="border-l-4 border-current pl-4 py-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-bold">{risk.risk}</p>
              <div className="grid grid-cols-2 gap-3 mt-2 text-xs">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Probabilidade:</p>
                  <Badge className="mt-1">{risk.probability}</Badge>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Impacto:</p>
                  <Badge className="mt-1" variant="destructive">{risk.impact}</Badge>
                </div>
              </div>
              <p className="text-sm mt-2"><strong>Mitigação:</strong> {risk.mitigation}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">👤 {risk.owner} | 📅 {risk.deadline}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CONCLUSÃO */}
      <Card className="border-2 border-green-400 bg-green-50 dark:bg-green-950">
        <CardHeader>
          <CardTitle className="text-green-700 dark:text-green-300">✅ Resumo Executivo & Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="font-bold text-lg">Sprint S: Status e Ação</p>
            <div className="mt-2 space-y-1 text-sm">
              <p>✅ <strong>Concluído:</strong> TLS 1.3, 2FA framework, LGPD rascunho (15%)</p>
              <p>⏳ <strong>Em Progresso:</strong> Autentique 30%, Termos 30%</p>
              <p>❌ <strong>Bloqueado:</strong> Certificado ICP/Brasil (Serasa)</p>
              <p>📅 <strong>Deadline:</strong> Mar 22, 2026 (18 dias)</p>
            </div>
          </div>

          <div>
            <p className="font-bold text-lg">O Que Fazer AGORA (Próximas 2 Horas)</p>
            <div className="mt-2 space-y-1 text-sm bg-red-100 dark:bg-red-900 p-3 rounded-lg">
              <p>1️⃣ <strong className="text-red-700 dark:text-red-300">Ligar para Serasa</strong> - Certificado PJ urgente</p>
              <p>2️⃣ <strong className="text-red-700 dark:text-red-300">Backend standup</strong> - Autentique API até Mar 8</p>
              <p>3️⃣ <strong className="text-red-700 dark:text-red-300">RFP enviado</strong> - Especialista jurídico até Mar 15</p>
              <p>4️⃣ <strong className="text-red-700 dark:text-red-300">Daily 09:00</strong> - Acompanhamento bloqueadores</p>
            </div>
          </div>

          <div>
            <p className="font-bold text-lg">Projeção Go-Live</p>
            <p className="text-sm mt-1">Se Certificado AC chegar até Mar 10:</p>
            <p className="text-sm text-green-700 dark:text-green-300">✅ Sprint S: 100% até Mar 22</p>
            <p className="text-sm text-green-700 dark:text-green-300">✅ Sprint T: 100% até Abr 6</p>
            <p className="text-sm text-green-700 dark:text-green-300">✅ GO-LIVE: 26 de Maio, 2026 🚀</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}