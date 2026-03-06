import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, AlertCircle, Zap } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SprintExecutionPlan() {
  const [sprintStatus] = useState({
    sprintName: 'Sprint S',
    duration: 'Mar 5 - Mar 22, 2026 (18 dias)',
    globalCompletion: 15,
    status: 'ATIVO',
    daysRemaining: 18,
    timeline: [
      { date: 'Mar 5', phase: 'Início Sprint S', status: 'atual', completed: 0 },
      { date: 'Mar 10', phase: 'Integração Autentique', status: 'critical', completed: 30 },
      { date: 'Mar 15', phase: 'Hash SHA512/SHA3', status: 'pending', completed: 0 },
      { date: 'Mar 18', phase: 'LGPD + TLS 1.3', status: 'pending', completed: 0 },
      { date: 'Mar 22', phase: 'Sprint S Conclusão', status: 'pending', completed: 0 }
    ]
  });

  const [phases] = useState([
    {
      phase: 'FASE 1: Fundação Técnica + Autentique',
      months: 'Mar-Abr (4 semanas vs 16)',
      completion: 15,
      status: 'ATIVO',
      impact: 'CRÍTICO',
      tasks: [
        {
          id: 'S-1',
          name: 'Integração Autentique (GraphQL API)',
          desc: 'Backend: OAuth + Assinatura digital ICP/Brasil',
          owner: 'Backend',
          deadline: 'Mar 10',
          progress: 30,
          critical: true,
          subtasks: [
            '✅ Conta Autentique criada',
            '⏳ SDK Node instalado (@autentique/sdk)',
            '⏳ Mutation createDocument implementada',
            '⏳ Upload de arquivo com signatários'
          ]
        },
        {
          id: 'S-2',
          name: 'Hash SHA512 + SHA3-512',
          desc: 'Geração dupla ANTES da assinatura Autentique',
          owner: 'Backend',
          deadline: 'Mar 15',
          progress: 0,
          critical: true,
          subtasks: [
            '⏳ Algoritmo SHA512 implementado',
            '⏳ Algoritmo SHA3-512 implementado',
            '⏳ Armazenamento em BD (audit_log)',
            '⏳ Immutabilidade pós-geração'
          ]
        },
        {
          id: 'S-3',
          name: 'Privacy Policy + LGPD',
          desc: 'Consentimento para coleta de metadados forenses',
          owner: 'Legal',
          deadline: 'Mar 18',
          progress: 40,
          critical: false,
          subtasks: [
            '✅ Rascunho jurídico iniciado',
            '⏳ Menção Autentique (ICP-Brasil)',
            '⏳ Direito ao esquecimento (30 dias)',
            '⏳ Criptografia em repouso (AES-256)'
          ]
        },
        {
          id: 'S-4',
          name: 'Termos de Uso Legais',
          desc: 'Responsabilidade + Isenção + Limitações técnicas',
          owner: 'Legal',
          deadline: 'Mar 20',
          progress: 30,
          critical: false,
          subtasks: [
            '⏳ Cláusulas obrigatórias',
            '⏳ Isenção Verifact-style',
            '⏳ Limitações reconhecidas',
            '⏳ Proteção de dados'
          ]
        },
        {
          id: 'S-5',
          name: '2FA TOTP + TLS 1.3',
          desc: 'Autenticação dupla + Criptografia máxima',
          owner: 'Segurança',
          deadline: 'Mar 22',
          progress: 50,
          critical: true,
          subtasks: [
            '✅ TLS 1.3 verificado (servidor)',
            '⏳ 2FA TOTP implementado (user login)',
            '⏳ QR Code geração (autenticador)',
            '⏳ Backup codes para recuperação'
          ]
        },
        {
          id: 'S-6',
          name: 'PDF/A-2B Generator',
          desc: 'Formato ISO 19005-2 para longo prazo',
          owner: 'Backend',
          deadline: 'Mar 22',
          progress: 20,
          critical: false,
          subtasks: [
            '⏳ Biblioteca PDFMake atualizada',
            '⏳ Metadados embutidos',
            '⏳ Não-editabilidade pós-geração',
            '⏳ Teste de compatibilidade futura'
          ]
        }
      ]
    },
    {
      phase: 'FASE 2: Cadeia de Custódia + Conformidade',
      months: 'Abr-Mai (4 semanas)',
      completion: 0,
      status: 'PLANEJADO',
      impact: 'CRÍTICO',
      tasks: [
        {
          id: 'T-1',
          name: 'Artigos 158-A (CPP) - 5 Etapas',
          desc: 'Coleta → Acondicionamento → Transporte → Preservação → Apresentação',
          owner: 'Legal + Backend',
          deadline: 'Abr 25',
          progress: 0,
          critical: true,
          subtasks: [
            'Etapa 1: Quem? Quando? Onde? Como? Por quê?',
            'Etapa 2: ZIP criptografado + checksums',
            'Etapa 3: Backup distribuído + audit logs',
            'Etapa 4: Rotina mensal verificação integridade',
            'Etapa 5: Relatório completo + validador online'
          ]
        },
        {
          id: 'T-2',
          name: 'Artigo 411-II (CPC) - Admissibilidade',
          desc: 'Autenticidade + Integridade + Origem + Cópia autêntica',
          owner: 'Legal + DevOps',
          deadline: 'Abr 20',
          progress: 0,
          critical: true,
          subtasks: [
            '✅ Assinatura com cert. PJ (Autentique)',
            '⏳ Validação gov: validar.iti.gov.br',
            '⏳ Relatório técnico anexado',
            '⏳ Teste jurídico em processo piloto'
          ]
        },
        {
          id: 'T-3',
          name: 'Relatório Técnico Completo',
          desc: 'Metodologia + Limitações + Validação + Juiz (leigo técnico)',
          owner: 'Technical Writing',
          deadline: 'Mai 2',
          progress: 0,
          critical: false,
          subtasks: [
            'Como funciona (em português claro)',
            'Limitações técnicas do sistema',
            'Como validar independentemente',
            'Conformidade com normas brasileiras'
          ]
        }
      ]
    },
    {
      phase: 'FASE 3: Validação + Testes + GO-LIVE',
      months: 'Mai (4 semanas)',
      completion: 0,
      status: 'PLANEJADO',
      impact: 'CRÍTICO',
      tasks: [
        {
          id: 'U-1',
          name: 'Validador Online',
          desc: 'Upload PDF → Validação automática → Resultado em linguagem simples',
          owner: 'Frontend + Backend',
          deadline: 'Mai 5',
          progress: 0,
          critical: false,
          subtasks: [
            'Upload interface',
            'Verificação automática assinatura',
            'Validação hash SHA512/SHA3',
            'Linguagem não-técnica'
          ]
        },
        {
          id: 'U-2',
          name: 'Auditoria Segurança (3º)',
          desc: 'Penetration testing + Conformidade LGPD + Relatório técnico',
          owner: 'Segurança',
          deadline: 'Mai 23',
          progress: 0,
          critical: true,
          subtasks: [
            '⏳ Teste penetração completo',
            '⏳ Auditoria forense (banco dados)',
            '⏳ Conformidade LGPD checklist',
            '⏳ Relatório certificação'
          ]
        },
        {
          id: 'U-3',
          name: 'Parecer Jurídico Final',
          desc: 'Especialista direito digital + Conformidade legislação + Admissibilidade processual',
          owner: 'Legal Externo',
          deadline: 'Mai 26',
          progress: 0,
          critical: true,
          subtasks: [
            '⏳ Contrato assinado com especialista',
            '⏳ Análise conformidade CPC/CPP',
            '⏳ Parecer escrito com recomendações',
            '⏳ Documento assinado digitalmente'
          ]
        },
        {
          id: 'U-4',
          name: '🚀 GO-LIVE',
          desc: 'Lançamento oficial | Produção ao vivo',
          owner: 'DevOps',
          deadline: 'Mai 26',
          progress: 0,
          critical: true,
          subtasks: [
            'Deploy produção',
            'Monitoramento 24/7',
            'Documentação publicada',
            'Suporte técnico ativo'
          ]
        }
      ]
    }
  ]);

  const projectMetrics = [
    { metric: 'Timeline Original', value: '12 meses', delta: '-66%' },
    { metric: 'Timeline Novo', value: '9 semanas', delta: '✅' },
    { metric: 'Completion Sprint S', value: '15%', delta: 'Start' },
    { metric: 'Global Project', value: '15%', delta: 'In Progress' },
    { metric: 'Budget (Autentique)', value: '~R$2-5/doc', delta: 'Pay-per-use' },
    { metric: 'External Costs', value: 'R$42.5K', delta: '-1K vs in-house' }
  ];

  const criticalPath = [
    { task: 'Integração Autentique', start: 'Mar 5', end: 'Mar 10', status: '30%', owner: 'Backend' },
    { task: 'Hash SHA512/SHA3', start: 'Mar 10', end: 'Mar 15', status: '0%', owner: 'Backend' },
    { task: 'Cadeia de Custódia (CPP 158-A)', start: 'Abr 8', end: 'Abr 25', status: '0%', owner: 'Legal+Backend' },
    { task: 'Auditoria Segurança', start: 'Mai 7', end: 'Mai 23', status: '0%', owner: 'Segurança' },
    { task: '🚀 GO-LIVE', start: 'Mai 26', end: 'Mai 26', status: 'CRITICAL', owner: 'All' }
  ];

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 min-h-screen">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">⚡ Executor de Sprint S</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">Mar 5-22, 2026 | 18 dias | Integração Autentique v2</p>
        </div>
        <Badge className="text-lg px-4 py-2 bg-red-500">SPRINT ATIVO</Badge>
      </div>

      {/* 📊 Project Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {projectMetrics.map((m, idx) => (
          <Card key={idx}>
            <CardContent className="pt-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">{m.metric}</p>
              <p className="text-2xl font-bold mt-1">{m.value}</p>
              <p className="text-xs text-green-600 mt-1">{m.delta}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 🎯 Global Progress */}
      <Card className="border-2 border-green-300 bg-green-50 dark:bg-green-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-600" />
            Sprint S Global Completion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={15} className="h-3" />
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Completado</p>
              <p className="text-2xl font-bold">2/6 tarefas</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Em Progresso</p>
              <p className="text-2xl font-bold">3/6 tarefas</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Pendente</p>
              <p className="text-2xl font-bold">1/6 tarefas</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-green-600">
            <p className="font-semibold text-green-700 dark:text-green-300">⚡ Ações Críticas: MAR 10</p>
            <p className="text-sm mt-1">✅ Integração Autentique deve estar 100% até Mar 10</p>
            <p className="text-sm">✅ Backend consegue fazer POST para API GraphQL</p>
            <p className="text-sm">✅ Assinatura digital funcional</p>
          </div>
        </CardContent>
      </Card>

      {/* 📋 FASE 1 - Tasks Detailed */}
      {phases.map((phase, phaseIdx) => (
        <Card key={phaseIdx} className="border-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{phase.phase}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{phase.months}</p>
              </div>
              <Badge variant={phase.status === 'ATIVO' ? 'default' : 'secondary'}>
                {phase.status}
              </Badge>
            </div>
            <Progress value={phase.completion} className="mt-3" />
          </CardHeader>
          <CardContent className="space-y-3">
            {phase.tasks.map((task) => (
              <div key={task.id} className="border-l-4 border-blue-500 pl-4 py-2 rounded bg-gray-50 dark:bg-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{task.id}: {task.name}</p>
                      {task.critical && <Badge className="bg-red-500">CRÍTICO</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.desc}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span className="text-gray-600 dark:text-gray-400">👤 {task.owner}</span>
                      <span className="text-gray-600 dark:text-gray-400">📅 {task.deadline}</span>
                      <Progress value={task.progress} className="w-20" />
                      <span className="font-semibold">{task.progress}%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  {task.subtasks.map((subtask, idx) => (
                    <p key={idx} className="text-xs text-gray-700 dark:text-gray-300 ml-2">
                      {subtask}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* 🚨 BLOQUEADORES & RISCOS */}
      <Card className="border-2 border-orange-300 bg-orange-50 dark:bg-orange-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Bloqueadores & Riscos Críticos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="border-l-4 border-red-600 pl-4 py-2">
            <p className="font-semibold text-red-700">🔴 RISCO CRÍTICO: API Autentique Downtime</p>
            <p className="text-sm mt-1">Mitigação: Manter fallback local para hash, retry automático</p>
          </div>
          <div className="border-l-4 border-orange-600 pl-4 py-2">
            <p className="font-semibold text-orange-700">🟠 BLOQUEADOR: Certificado ICP/Brasil (AC)</p>
            <p className="text-sm mt-1">Status: Aguardando resposta Serasa</p>
            <p className="text-sm">Ação: Contato daily com Autoridade Certificadora</p>
          </div>
          <div className="border-l-4 border-yellow-600 pl-4 py-2">
            <p className="font-semibold text-yellow-700">🟡 AVISO: Parecer Jurídico (Externo)</p>
            <p className="text-sm mt-1">Prazo limite contratação: Mar 15</p>
            <p className="text-sm">Custo: R$ 7.500-10.000</p>
          </div>
        </CardContent>
      </Card>

      {/* ✅ PRÓXIMAS AÇÕES (24h) */}
      <Card className="border-2 border-green-400 bg-green-50 dark:bg-green-950">
        <CardHeader>
          <CardTitle className="text-green-700 dark:text-green-300">⚡ Próximas 24 Horas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">1. Integração Autentique (S-1)</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">POST para GraphQL funcional | teste com PDF demo</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">2. Confirmar AC (ICP/Brasil)</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email/Telefone Serasa | definir cert. A3 PJ</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">3. Contato Especialista Jurídico</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">RFP para parecer digital | prazo Mar 15</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}