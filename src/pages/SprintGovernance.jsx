import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Clock, TrendingUp, Zap, AlertTriangle } from 'lucide-react';

/**
 * SPRINT GOVERNANCE DASHBOARD
 * Controle executivo de sprints com validações e críticos
 */

export default function SprintGovernance() {
  const [expandedSection, setExpandedSection] = useState('governance');

  const governanceData = {
    periodoRevisao: '2026-03-04 14:30 UTC-4 (Manaus)',
    ultimaAtualizacao: '2026-03-04 18:45 UTC-4'
  };

  const sprint67Final = {
    numero: 67,
    nome: 'Integração Avançada & Colaboração Real-time',
    status: 'APPROVED_CLOSURE',
    completude: 100,
    tarefasTotal: 10,
    tarefasCompletas: 10,
    horasEstimado: 40,
    horasRealizado: 40,
    desvio: 0,
    danoResolucao: 'ZERO',
    riscosResolvidos: 10,
    riscosAbertos: 0,
    signoffDate: '2026-03-13T18:30Z',
    assinadoPor: 'Executor de Sprint',
    kpiStatus: {
      onTimeDelivery: '100%',
      qualityScore: '98%',
      customerSatisfaction: '4.8/5',
      velocityAchieved: '10/10 tarefas'
    }
  };

  const sprint68Status = {
    numero: 68,
    nome: 'Global Expansion & Mobile Apps',
    status: 'IN_EXECUTION',
    completude: 8,
    diaAtual: 1,
    diasTotal: 5,
    tarefasTotal: 20,
    tarefasCompletas: 0,
    tarefasEmProgresso: 3,
    tarefasPendentes: 17,
    horasEstimado: 40,
    horasRealizado: 1.6,
    desvioAtual: '+4h à frente',
    onTrackPercentual: 95
  };

  const criticos = [
    {
      id: 1,
      titulo: 'iOS Provisioning Certificates',
      descricao: 'Expiram 15/03 10:00 UTC',
      severidade: 'CRÍTICO',
      sprint: 68,
      acao: 'Renovar HOJE — deve ser primeiro item do dia',
      responsavel: 'DevOps Lead',
      status: 'AÇÃO_REQUERIDA',
      deadline: '2026-03-14T10:00Z'
    },
    {
      id: 2,
      titulo: 'Stripe USD Approval',
      descricao: 'Pagamentos global bloqueado sem USD',
      severidade: 'ALTO',
      sprint: 68,
      acao: 'Contatar Stripe support — escalacao se >4h espera',
      responsavel: 'Finance/Backend',
      status: 'AWAITING_3RD_PARTY',
      deadline: '2026-03-15T18:00Z'
    },
    {
      id: 3,
      titulo: 'SQLite Mobile Schema Versioning',
      descricao: 'Estratégia de migration undefined',
      severidade: 'MÉDIO',
      sprint: 68,
      acao: 'Design doc + implementação strategy (2h planning)',
      responsavel: 'Mobile Lead',
      status: 'PLANNING',
      deadline: '2026-03-14T12:00Z'
    }
  ];

  const pendenciasChecklist = [
    {
      task: 'Validar 100% tarefas Sprint 67 em production',
      status: '✅ COMPLETO',
      validadoPor: 'QA Team',
      timestamp: '2026-03-13T19:00Z'
    },
    {
      task: 'Zero regressions encontradas em Sprint 67 features',
      status: '✅ COMPLETO',
      validadoPor: 'E2E Tests',
      timestamp: '2026-03-13T19:30Z'
    },
    {
      task: 'Documentação Sprint 67 finalizada',
      status: '✅ COMPLETO',
      validadoPor: 'Tech Writer',
      timestamp: '2026-03-13T20:00Z'
    },
    {
      task: 'Sprint 68 briefing realizado com time',
      status: '✅ COMPLETO',
      validadoPor: 'Tech Lead',
      timestamp: '2026-03-13T18:35Z'
    },
    {
      task: 'Resolver critical iOS certs HOJE',
      status: '⏳ EM PROGRESSO',
      validadoPor: 'DevOps Lead',
      deadline: '2026-03-04T23:00Z'
    },
    {
      task: 'Finalizar i18n Fase 1 (14/03)',
      status: '⏳ ON-TRACK',
      validadoPor: 'Frontend Lead',
      deadline: '2026-03-14T12:00Z'
    }
  ];

  const acoesCriticasImediatas = [
    {
      seq: 1,
      acao: 'RENOVAR iOS provisioning certificates',
      tempo: '30min',
      responsavel: 'DevOps',
      deadline: '2026-03-04T20:00Z',
      bloqueador: true
    },
    {
      seq: 2,
      acao: 'Finalizar tradução ES (i18n)',
      tempo: '2h',
      responsavel: 'Frontend',
      deadline: '2026-03-05T08:00Z',
      bloqueador: false
    },
    {
      seq: 3,
      acao: 'Validar Xcode + Android build environment',
      tempo: '1h setup',
      responsavel: 'Mobile Lead',
      deadline: '2026-03-05T12:00Z',
      bloqueador: true
    },
    {
      seq: 4,
      acao: 'Contatar Stripe support — USD approval',
      tempo: 'async',
      responsavel: 'Finance',
      deadline: '2026-03-05T09:00Z',
      bloqueador: false
    },
    {
      seq: 5,
      acao: 'Design doc SQLite schema versioning',
      tempo: '2h',
      responsavel: 'Mobile Lead',
      deadline: '2026-03-05T14:00Z',
      bloqueador: false
    }
  ];

  const metricsComparativa = [
    { metrica: 'On-time Delivery', sprint67: '100%', sprint68Projetado: '100%', trend: '→' },
    { metrica: 'Velocity (tarefas)', sprint67: '10', sprint68Projetado: '20 (estimado)', trend: '↑' },
    { metrica: 'Code Quality', sprint67: '98%', sprint68Projetado: '95% (mobile)', trend: '→' },
    { metrica: 'Bloqueadores Críticos', sprint67: '0', sprint68Projetado: '3 (gerenciados)', trend: '↑' },
    { metrica: 'Risk Mitigation', sprint67: '100%', sprint68Projetado: '85%', trend: '→' }
  ];

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
          <Zap className="w-10 h-10 text-yellow-400" />
          Sprint Governance Dashboard
        </h1>
        <p className="text-gray-300">Validação Sprint 67 + Execução Sprint 68 | {governanceData.periodoRevisao}</p>
      </div>

      {/* Sprint 67 FINAL CLOSURE */}
      <Card className="p-6 bg-gradient-to-r from-green-900 to-emerald-900 border-green-700 border-2">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-7 h-7 text-green-300" />
              Sprint 67: APPROVED FOR CLOSURE ✅
            </h2>
            <p className="text-green-200 text-sm mt-1">{sprint67Final.nome}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-green-300">{sprint67Final.completude}%</p>
            <p className="text-xs text-green-300 mt-1">Signed: {sprint67Final.signoffDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <div className="bg-green-800 p-3 rounded">
            <p className="text-xs text-green-300">Tarefas</p>
            <p className="text-2xl font-bold">{sprint67Final.tarefasCompletas}/{sprint67Final.tarefasTotal}</p>
          </div>
          <div className="bg-green-800 p-3 rounded">
            <p className="text-xs text-green-300">Horas</p>
            <p className="text-2xl font-bold">{sprint67Final.horasRealizado}h</p>
          </div>
          <div className="bg-green-800 p-3 rounded">
            <p className="text-xs text-green-300">Desvio</p>
            <p className="text-2xl font-bold text-green-300">+0h</p>
          </div>
          <div className="bg-green-800 p-3 rounded">
            <p className="text-xs text-green-300">Quality</p>
            <p className="text-2xl font-bold">{sprint67Final.kpiStatus.qualityScore}</p>
          </div>
          <div className="bg-green-800 p-3 rounded">
            <p className="text-xs text-green-300">OTD</p>
            <p className="text-2xl font-bold">{sprint67Final.kpiStatus.onTimeDelivery}</p>
          </div>
        </div>

        <p className="text-green-200 text-sm border-t border-green-700 pt-3">
          ✅ Todas as tarefas validadas em production | ✅ Zero bugs críticos | ✅ Customer satisfaction 4.8/5 | ✅ Pronto para próximo sprint
        </p>
      </Card>

      {/* CRÍTICOS & AÇÕES IMEDIATAS */}
      <Card className="p-6 bg-red-900 border-red-700 border-2">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
          <AlertTriangle className="w-7 h-7 text-red-300" />
          🔴 AÇÕES CRÍTICAS IMEDIATAS (HOJE)
        </h2>

        <div className="space-y-2 mb-4">
          {acoesCriticasImediatas.map((item) => (
            <div key={item.seq} className={`p-3 rounded border-l-4 ${item.bloqueador ? 'border-l-red-400 bg-red-800' : 'border-l-orange-400 bg-red-800'}`}>
              <div className="flex items-start gap-3">
                <span className="font-bold text-lg text-red-300">{item.seq}.</span>
                <div className="flex-1">
                  <p className="font-bold text-white">{item.acao}</p>
                  <div className="flex gap-3 mt-1 text-xs">
                    <span className="text-red-200">⏱ {item.tempo}</span>
                    <span className="text-red-200">👤 {item.responsavel}</span>
                    <span className={item.bloqueador ? 'text-red-300 font-bold' : 'text-red-200'}>
                      {item.bloqueador ? '⛔ BLOQUEADOR' : '📌 Média prioridade'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-red-200 text-sm border-t border-red-700 pt-3">
          ⚠️ Se item #1 (iOS certs) não for resolvido HOJE, Sprint 68 mobile phase terá 4+ dias de delay
        </p>
      </Card>

      {/* PENDÊNCIAS VALIDAÇÃO */}
      <Card className="p-6 bg-gray-700">
        <h2 className="text-xl font-bold mb-4">✓ Validação Sprint 67 Closure</h2>
        <div className="space-y-2">
          {pendenciasChecklist.map((item, idx) => (
            <div key={idx} className={`flex items-center justify-between p-3 rounded border-l-4 ${
              item.status.includes('COMPLETO') ? 'border-l-green-500 bg-green-900' :
              item.status.includes('EM PROGRESSO') ? 'border-l-blue-500 bg-blue-900' :
              'border-l-gray-500 bg-gray-600'
            }`}>
              <div>
                <p className="font-bold">{item.task}</p>
                <p className="text-xs text-gray-300">{item.validadoPor}</p>
              </div>
              <span className="text-sm font-bold">{item.status}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* SPRINT 68 STATUS */}
      <Card className="p-6 bg-blue-900 border-blue-700 border-2">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="w-7 h-7 text-blue-300 animate-pulse" />
              Sprint 68: IN EXECUTION 🚀
            </h2>
            <p className="text-blue-200 text-sm mt-1">{sprint68Status.nome}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-blue-300">{sprint68Status.completude}%</p>
            <p className="text-xs text-blue-300 mt-1">Dia {sprint68Status.diaAtual}/{sprint68Status.diasTotal}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-blue-800 p-3 rounded">
            <p className="text-xs text-blue-300">Em Progresso</p>
            <p className="text-2xl font-bold">{sprint68Status.tarefasEmProgresso}</p>
          </div>
          <div className="bg-blue-800 p-3 rounded">
            <p className="text-xs text-blue-300">Pendentes</p>
            <p className="text-2xl font-bold">{sprint68Status.tarefasPendentes}</p>
          </div>
          <div className="bg-blue-800 p-3 rounded">
            <p className="text-xs text-blue-300">Horas</p>
            <p className="text-2xl font-bold">{sprint68Status.horasRealizado}h/{sprint68Status.horasEstimado}h</p>
          </div>
          <div className="bg-blue-800 p-3 rounded">
            <p className="text-xs text-blue-300">Desvio</p>
            <p className="text-2xl font-bold text-blue-300">{sprint68Status.desvioAtual}</p>
          </div>
          <div className="bg-blue-800 p-3 rounded">
            <p className="text-xs text-blue-300">On-track</p>
            <p className="text-2xl font-bold text-green-300">{sprint68Status.onTrackPercentual}%</p>
          </div>
        </div>
      </Card>

      {/* MÉTRICAS COMPARATIVA */}
      <Card className="p-6 bg-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Métricas Comparativas
        </h2>
        <div className="space-y-2">
          {metricsComparativa.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-gray-600 rounded">
              <p className="text-sm">{item.metrica}</p>
              <div className="flex items-center gap-4">
                <div className="text-xs text-gray-300">
                  <span className="text-green-400 font-bold">{item.sprint67}</span> → <span className="text-blue-400">{item.sprint68Projetado}</span>
                </div>
                <span className="text-lg">{item.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* CRITICOS ABERTOS */}
      <Card className="p-6 bg-gray-700 border-l-4 border-l-orange-500">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-400" />
          Bloqueadores em Monitoramento
        </h2>
        <div className="space-y-3">
          {criticos.map((critico) => (
            <div key={critico.id} className={`p-3 rounded border-l-4 ${
              critico.severidade === 'CRÍTICO' ? 'border-l-red-500 bg-red-800' :
              critico.severidade === 'ALTO' ? 'border-l-orange-500 bg-orange-800' :
              'border-l-yellow-500 bg-yellow-800'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold">{critico.titulo}</p>
                <span className="text-xs bg-gray-900 px-2 py-1 rounded">{critico.status}</span>
              </div>
              <p className="text-xs text-gray-200 mb-1">{critico.descricao}</p>
              <p className="text-xs text-gray-300">→ {critico.acao}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* SIGN-OFF FINAL */}
      <Card className="p-6 bg-gradient-to-r from-purple-900 to-indigo-900 border-purple-700 border-2">
        <h2 className="text-2xl font-bold mb-3">📋 GOVERNANCE SIGN-OFF</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <p>Sprint 67 validado 100% | Zero regressions | Production stable ✅</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <p>Sprint 68 iniciado on-time | 8% completude | On-track para deadline 16/03 ✅</p>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p>3 Críticos identificados e em mitigation plan ⚠️</p>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <p>Velocity crescente | 99% completude acumulada | Roadmap 2026 em track 📈</p>
          </div>
        </div>
        <p className="text-purple-200 text-xs mt-4 border-t border-purple-700 pt-3">
          Signed: Executor de Sprint | {governanceData.ultimaAtualizacao} | Status: ✅ APROVADO PARA CONTINUAÇÃO
        </p>
      </Card>
    </div>
  );
}