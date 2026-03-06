import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Clock, TrendingUp, Zap } from 'lucide-react';

/**
 * SPRINT 68 EXECUTION — LIVE TRACKING
 * Global Expansion & Mobile Apps Development
 * Status: 🚀 EM ANDAMENTO (Dia 1 de 5)
 */

export default function Sprint68Execution() {
  const [expandedFase, setExpandedFase] = useState(1);

  const sprint68 = {
    numero: 68,
    titulo: 'Global Expansion & Mobile Apps',
    duracao: '5 dias (40h)',
    dataInicio: '2026-03-13T18:30Z',
    dataFim: '2026-03-16T18:00Z',
    status: 'em_andamento',
    completude: 8, // 3 de 20 tarefas iniciadas
    diaAtual: 1
  };

  const fases = [
    {
      numero: 1,
      nome: 'Internationalization (i18n)',
      status: 'em_andamento',
      progresso: 30,
      duracao: '1 dia',
      tarefas: [
        {
          id: 1,
          nome: 'Setup i18next framework',
          status: 'em_andamento',
          progresso: 80,
          estimado: 2,
          realizado: 1.6,
          descricao: 'Configurar i18next com namespaces e lazy loading'
        },
        {
          id: 2,
          nome: 'Tradução PT-BR → EN → ES',
          status: 'pendente',
          progresso: 0,
          estimado: 3,
          realizado: 0,
          descricao: '500+ strings para traduzir (2-3 idiomas)'
        },
        {
          id: 3,
          nome: 'Integrar com componentes UI',
          status: 'pendente',
          progresso: 0,
          estimado: 2,
          realizado: 0,
          descricao: 'Trocar hardcoded strings por i18n keys'
        }
      ]
    },
    {
      numero: 2,
      nome: 'Mobile Apps (iOS/Android)',
      status: 'pendente',
      progresso: 0,
      duracao: '2 dias',
      tarefas: [
        {
          id: 4,
          nome: 'Build iOS (Xcode + React Native)',
          status: 'pendente',
          progresso: 0,
          estimado: 4,
          realizado: 0,
          descricao: 'Setup Xcode, provisioning profiles, build config'
        },
        {
          id: 5,
          nome: 'Build Android (Gradle + Emulator)',
          status: 'pendente',
          progresso: 0,
          estimado: 4,
          realizado: 0,
          descricao: 'Setup Android Studio, signing keys, gradle config'
        },
        {
          id: 6,
          nome: 'Push Notifications iOS/Android',
          status: 'pendente',
          progresso: 0,
          estimado: 3,
          realizado: 0,
          descricao: 'APNS + FCM integration com service workers'
        },
        {
          id: 7,
          nome: 'Biometric Auth (Face/Touch)',
          status: 'pendente',
          progresso: 0,
          estimado: 3,
          realizado: 0,
          descricao: 'LocalAuthentication API (iOS) + BiometricPrompt (Android)'
        }
      ]
    },
    {
      numero: 3,
      nome: 'Offline-first Sync',
      status: 'pendente',
      progresso: 0,
      duracao: '1 dia',
      tarefas: [
        {
          id: 8,
          nome: 'SQLite local database',
          status: 'pendente',
          progresso: 0,
          estimado: 2,
          realizado: 0,
          descricao: 'Setup SQLite com Wasm + IndexedDB fallback'
        },
        {
          id: 9,
          nome: 'Background sync queue',
          status: 'pendente',
          progresso: 0,
          estimado: 3,
          realizado: 0,
          descricao: 'Background Sync API com retry + exponential backoff'
        }
      ]
    },
    {
      numero: 4,
      nome: 'Payments Global 2.0',
      status: 'pendente',
      progresso: 0,
      duracao: '1 dia',
      tarefas: [
        {
          id: 10,
          nome: 'Stripe global setup (USD/BRL/EUR)',
          status: 'pendente',
          progresso: 0,
          estimado: 2,
          realizado: 0,
          descricao: 'Multi-currency, tax calculation, VAT handling'
        },
        {
          id: 11,
          nome: 'PayPal + Pix integração',
          status: 'pendente',
          progresso: 0,
          estimado: 2,
          realizado: 0,
          descricao: 'PayPal Commerce Platform + Pix instant payment'
        },
        {
          id: 12,
          nome: 'Webhook reconciliation',
          status: 'pendente',
          progresso: 0,
          estimado: 2,
          realizado: 0,
          descricao: 'Stripe/PayPal webhooks com retry + idempotency'
        }
      ]
    }
  ];

  const totalTarefas = fases.reduce((sum, f) => sum + f.tarefas.length, 0);
  const tarefasCompletas = fases.reduce((sum, f) => sum + f.tarefas.filter(t => t.status === 'completo').length, 0);
  const tarefasEmAndamento = fases.reduce((sum, f) => sum + f.tarefas.filter(t => t.status === 'em_andamento').length, 0);
  const hrsRealizadas = fases.reduce((sum, f) => sum + f.tarefas.reduce((s, t) => s + t.realizado, 0), 0);
  const hrsEstimadas = fases.reduce((sum, f) => sum + f.tarefas.reduce((s, t) => s + t.estimado, 0), 0);

  const completude = Math.round(((tarefasCompletas + tarefasEmAndamento * 0.5) / totalTarefas) * 100);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
          <Zap className="w-10 h-10 text-blue-600" />
          Sprint 68 Execution — 🚀 EM ANDAMENTO
        </h1>
        <p className="text-gray-600">Global Expansion & Mobile Apps | Dia {sprint68.diaAtual} de 5</p>
      </div>

      {/* Progress Summary */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0 shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div>
            <p className="text-sm opacity-90">Completude</p>
            <p className="text-3xl font-bold">{completude}%</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Tarefas</p>
            <p className="text-2xl font-bold">{tarefasCompletas + tarefasEmAndamento}/{totalTarefas}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Em Andamento</p>
            <p className="text-2xl font-bold">{tarefasEmAndamento}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Horas Investidas</p>
            <p className="text-2xl font-bold">{hrsRealizadas.toFixed(1)}h / {hrsEstimadas}h</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Desvio</p>
            <p className="text-2xl font-bold">{((hrsRealizadas / hrsEstimadas) * 100).toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Status</p>
            <p className="text-lg font-bold">✅ On-track</p>
          </div>
        </div>
      </Card>

      {/* Fases em Execução */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">4 Fases de Desenvolvimento</h2>
        {fases.map((fase) => (
          <Card
            key={fase.numero}
            className={`p-6 cursor-pointer hover:shadow-lg transition-all border-l-4 ${
              fase.status === 'completo' ? 'border-l-green-600 bg-green-50' :
              fase.status === 'em_andamento' ? 'border-l-blue-600 bg-blue-50' :
              'border-l-gray-400 bg-white'
            }`}
            onClick={() => setExpandedFase(expandedFase === fase.numero ? null : fase.numero)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  {fase.status === 'completo' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : fase.status === 'em_andamento' ? (
                    <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                  )}
                  Fase {fase.numero}: {fase.nome}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{fase.tarefas.length} tarefas | {fase.duracao}</p>
              </div>
              <span className={`text-2xl font-bold ${
                fase.progresso >= 80 ? 'text-green-600' :
                fase.progresso > 0 ? 'text-blue-600' :
                'text-gray-400'
              }`}>{fase.progresso}%</span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
              <div 
                className={`h-full transition-all ${
                  fase.progresso >= 80 ? 'bg-green-600' :
                  fase.progresso > 0 ? 'bg-blue-600' :
                  'bg-gray-300'
                }`}
                style={{ width: `${fase.progresso}%` }}
              />
            </div>

            {/* Tarefas expandidas */}
            {expandedFase === fase.numero && (
              <div className="mt-4 space-y-2 border-t pt-4">
                {fase.tarefas.map((tarefa) => (
                  <div 
                    key={tarefa.id} 
                    className={`p-3 rounded-lg border-l-4 ${
                      tarefa.status === 'completo' ? 'border-l-green-500 bg-green-50' :
                      tarefa.status === 'em_andamento' ? 'border-l-blue-500 bg-blue-50' :
                      'border-l-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-sm">{tarefa.nome}</p>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        tarefa.status === 'completo' ? 'bg-green-200 text-green-800' :
                        tarefa.status === 'em_andamento' ? 'bg-blue-200 text-blue-800' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {tarefa.status === 'completo' ? '✅' : tarefa.status === 'em_andamento' ? '⏳' : '⏸️'} {tarefa.progresso}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{tarefa.descricao}</p>
                    <div className="flex justify-between items-center mt-2 text-xs">
                      <div className="h-1 flex-1 bg-gray-300 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            tarefa.status === 'completo' ? 'bg-green-600' :
                            tarefa.status === 'em_andamento' ? 'bg-blue-600' :
                            'bg-gray-400'
                          }`}
                          style={{ width: `${tarefa.progresso}%` }}
                        />
                      </div>
                      <span className="ml-2 text-gray-500">{tarefa.realizado.toFixed(1)}h/{tarefa.estimado}h</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Blockers & Risks */}
      <Card className="p-6 bg-yellow-50 border-l-4 border-l-yellow-500">
        <h2 className="text-xl font-bold text-yellow-900 mb-3">⚠️ Riscos & Blockers</h2>
        <div className="space-y-2">
          <div className="text-sm text-yellow-800">
            <p className="font-bold">Risco: Mobile builds</p>
            <p className="text-xs">iOS Xcode profiles expiram 15/03 → CRÍTICO resolver hoje</p>
          </div>
          <div className="text-sm text-yellow-800 mt-2">
            <p className="font-bold">Risco: Stripe setup</p>
            <p className="text-xs">Aguardando aprovação Stripe para USD (est. 2-4h)</p>
          </div>
        </div>
      </Card>

      {/* Daily Standup */}
      <Card className="p-6 bg-indigo-50 border-l-4 border-l-indigo-600">
        <h2 className="text-xl font-bold text-indigo-900 mb-3">📋 Daily Standup (13/03)</h2>
        <div className="space-y-3">
          <div>
            <p className="font-bold text-sm text-indigo-900">✅ Completado:</p>
            <ul className="text-xs text-indigo-700 mt-1 ml-4 space-y-0.5">
              <li>• i18next setup + namespaces configured</li>
              <li>• Core translations (200 strings)</li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-sm text-indigo-900">⏳ Em Progresso:</p>
            <ul className="text-xs text-indigo-700 mt-1 ml-4 space-y-0.5">
              <li>• Tradução PT-BR EN (50% concluído)</li>
              <li>• Setup inicial i18n components</li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-sm text-indigo-900">🎯 Próximas 24h:</p>
            <ul className="text-xs text-indigo-700 mt-1 ml-4 space-y-0.5">
              <li>• Finalizar tradução ES + deploy i18n</li>
              <li>• Iniciar iOS build setup (provisioning)</li>
              <li>• Iniciar Android emulator setup</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card className="p-6 bg-gradient-to-r from-indigo-100 to-blue-100 border-indigo-300">
        <h2 className="text-xl font-bold mb-4">📅 Timeline Sprint 68</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <p className="text-gray-700"><strong>13/03 (hoje):</strong> i18n setup + UI translations</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">⏳</span>
            <p className="text-gray-700"><strong>14/03:</strong> Mobile builds (iOS/Android) + biometric auth</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">⏳</span>
            <p className="text-gray-700"><strong>15/03:</strong> Push notifications + offline sync</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">⏳</span>
            <p className="text-gray-700"><strong>16/03:</strong> Global payments + e2e tests + sign-off</p>
          </div>
        </div>
      </Card>

      {/* Próximo Checkpoint */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0 shadow-lg">
        <h2 className="text-2xl font-bold mb-2">🎯 Próximo Checkpoint</h2>
        <p className="text-blue-100 mb-4">14/03 18:00 UTC (amanhã) — Mobile Build Kickoff</p>
        <div className="text-sm text-blue-50">
          <p className="mb-2">✅ i18n deployment production-ready</p>
          <p className="mb-2">✅ iOS Xcode provisioning ativo</p>
          <p className="mb-2">✅ Android emulator running</p>
          <p>Objetivo: 50% sprint completude até amanhã</p>
        </div>
      </Card>
    </div>
  );
}