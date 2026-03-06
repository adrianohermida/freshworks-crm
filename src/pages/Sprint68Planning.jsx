import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Rocket, TrendingUp, Users, Zap, Globe } from 'lucide-react';

/**
 * SPRINT 68 — PLANEJAMENTO
 * Após conclusão de Sprint 66 (100%) e Sprint 67 (100%), iniciamos Sprint 68
 * Foco: Expansão Global + Novos Produtos + Otimizações
 */

const sprintData = {
  numero: 68,
  titulo: 'Global Expansion & New Products',
  duracao: '5 dias (40h)',
  dataInicio: '2026-03-12',
  dataFim: '2026-03-16',
  progresso: 0,
  status: 'em_andamento',
  dataInicializada: '2026-03-13 18:30 UTC',

  objetivos: [
    '🌍 Suporte multi-idioma (PT, EN, ES, FR)',
    '📱 App nativo iOS via Apple App Store',
    '📱 App nativo Android via Google Play',
    '🔄 Sincronização offline-first com service workers',
    '💳 Sistema de pagamento global (Stripe)',
    '📊 Analytics 2.0 com ML predictions'
  ],

  fases: [
    {
      numero: 1,
      nome: 'Internationalization & Localization',
      status: 'planejado',
      duracao: '1 dia (8h)',
      progresso: 0,
      tarefas: [
        {
          id: 1,
          nome: 'Implementar i18n framework (i18next)',
          status: 'planejado',
          descricao: 'Suporte para PT, EN, ES, FR, DE',
          horas: 3,
          prioridade: 'alta'
        },
        {
          id: 2,
          nome: 'Traduzir interface + content',
          status: 'planejado',
          descricao: 'Todos os strings da aplicação',
          horas: 3,
          prioridade: 'alta'
        },
        {
          id: 3,
          nome: 'RTL support (árabe, hebraico)',
          status: 'planejado',
          descricao: 'Layout flexível para right-to-left',
          horas: 2,
          prioridade: 'media'
        }
      ]
    },
    {
      numero: 2,
      nome: 'Mobile Apps - iOS & Android',
      status: 'planejado',
      duracao: '2 dias (16h)',
      progresso: 0,
      tarefas: [
        {
          id: 4,
          nome: 'Configurar build iOS (Xcode)',
          status: 'planejado',
          descricao: 'React Native / Expo para iOS',
          horas: 4,
          prioridade: 'alta'
        },
        {
          id: 5,
          nome: 'Configurar build Android (gradle)',
          status: 'planejado',
          descricao: 'React Native / Expo para Android',
          horas: 4,
          prioridade: 'alta'
        },
        {
          id: 6,
          nome: 'Apple App Store submission',
          status: 'planejado',
          descricao: 'Review + publication',
          horas: 4,
          prioridade: 'alta'
        },
        {
          id: 7,
          nome: 'Google Play Store submission',
          status: 'planejado',
          descricao: 'Review + publication',
          horas: 4,
          prioridade: 'alta'
        }
      ]
    },
    {
      numero: 3,
      nome: 'Offline-first & Sync',
      status: 'planejado',
      duracao: '1 dia (8h)',
      progresso: 0,
      tarefas: [
        {
          id: 8,
          nome: 'IndexedDB + Service Worker sync',
          status: 'planejado',
          descricao: 'Funciona completamente offline',
          horas: 4,
          prioridade: 'alta'
        },
        {
          id: 9,
          nome: 'Conflict resolution + CRDT',
          status: 'planejado',
          descricao: 'Merge de mudanças offline',
          horas: 4,
          prioridade: 'media'
        }
      ]
    },
    {
      numero: 4,
      nome: 'Payments & Billing 2.0',
      status: 'planejado',
      duracao: '1 dia (8h)',
      progresso: 0,
      tarefas: [
        {
          id: 10,
          nome: 'Integrar Stripe Payment Intent',
          status: 'planejado',
          descricao: '3D Secure, múltiplas moedas',
          horas: 3,
          prioridade: 'alta'
        },
        {
          id: 11,
          nome: 'Webhooks de pagamento automático',
          status: 'planejado',
          descricao: 'Update subscriptions + entitlements',
          horas: 3,
          prioridade: 'alta'
        },
        {
          id: 12,
          nome: 'Tax compliance (VAT/ICMS)',
          status: 'planejado',
          descricao: 'Calculo automático de impostos',
          horas: 2,
          prioridade: 'media'
        }
      ]
    }
  ]
};

function FaseCard({ fase }) {
  const tarefasCompletas = fase.tarefas.filter(t => t.status === 'concluido').length;
  const percentComplete = (tarefasCompletas / fase.tarefas.length) * 100;

  return (
    <Card className="p-6 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="text-2xl">#{fase.numero}</span>
            {fase.nome}
          </h3>
          <p className="text-sm text-gray-500">{fase.duracao}</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">{fase.status}</Badge>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${percentComplete}%` }} />
      </div>

      <div className="space-y-2">
        {fase.tarefas.map((tarefa) => (
          <div key={tarefa.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="text-xl mt-0.5">{tarefa.status === 'concluido' ? '✅' : '⏳'}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900">{tarefa.nome}</p>
              <p className="text-xs text-gray-600 mt-1">{tarefa.descricao}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200">{tarefa.horas}h</span>
                {tarefa.prioridade === 'alta' && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-medium">Alta Prioridade</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function Sprint68Planning() {
  const totalTarefas = sprintData.fases.reduce((sum, f) => sum + f.tarefas.length, 0);
  const tarefasCompletas = sprintData.fases.reduce(
    (sum, f) => sum + f.tarefas.filter(t => t.status === 'concluido').length,
    0
  );
  const progresso = (tarefasCompletas / totalTarefas) * 100;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
          <Globe className="w-10 h-10 text-blue-600" />
          Sprint 68 — Global Expansion & Mobile
        </h1>
        <p className="text-gray-600 text-lg">Multi-idioma | iOS & Android apps | Offline-first | Global payments</p>
      </div>

      {/* Sprint Summary */}
      <Card className="p-6 border-l-4 border-l-blue-600 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-xs text-gray-500 font-medium">DURAÇÃO</p>
            <p className="text-lg font-bold text-gray-900">{sprintData.duracao}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">INÍCIO</p>
            <p className="text-lg font-bold text-gray-900">{sprintData.dataInicio}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">TÉRMINO</p>
            <p className="text-lg font-bold text-gray-900">{sprintData.dataFim}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">TAREFAS</p>
            <p className="text-lg font-bold text-gray-900">{totalTarefas}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">PROGRESSO</p>
            <p className="text-lg font-bold text-blue-600">{Math.round(progresso)}%</p>
          </div>
        </div>
      </Card>

      {/* Objetivos */}
      <Card className="p-6 bg-white">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-green-600" />
          Objetivos Sprint 68
        </h2>
        <ul className="space-y-3">
          {sprintData.objetivos.map((obj, idx) => (
            <li key={idx} className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{obj}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Fases */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Fases Detalhadas</h2>
        {sprintData.fases.map((fase) => (
          <FaseCard key={fase.numero} fase={fase} />
        ))}
      </div>

      {/* Timeline & Estimativas */}
      <Card className="p-6 bg-gradient-to-r from-blue-100 to-cyan-100 border-l-4 border-l-blue-600">
        <h3 className="font-bold text-lg text-blue-900 mb-3">📅 Timeline & Estimativas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-white bg-opacity-60 p-3 rounded">
            <p className="text-gray-600">Segunda 12/03</p>
            <p className="font-bold">Fase 1 (8h)</p>
          </div>
          <div className="bg-white bg-opacity-60 p-3 rounded">
            <p className="text-gray-600">Terça-Quarta 13-14/03</p>
            <p className="font-bold">Fase 2 (16h)</p>
          </div>
          <div className="bg-white bg-opacity-60 p-3 rounded">
            <p className="text-gray-600">Quinta 15/03</p>
            <p className="font-bold">Fase 3 (8h)</p>
          </div>
          <div className="bg-white bg-opacity-60 p-3 rounded">
            <p className="text-gray-600">Sexta 16/03</p>
            <p className="font-bold">Fase 4 (8h)</p>
          </div>
        </div>
      </Card>

      {/* Context Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300">
        <h3 className="font-bold text-lg text-blue-900 mb-3">📊 Contexto Evolutivo</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong className="text-green-900">✅ Sprint 64-65:</strong> API Advise completa (23/23 endpoints, 4206 publicações)</p>
          <p><strong className="text-green-900">✅ Sprint 66:</strong> Production deployment + Multi-tenant + Performance (100%)</p>
          <p><strong className="text-green-900">✅ Sprint 67:</strong> Integração avançada + Colaboração real-time + Analytics (100%)</p>
          <p><strong className="text-blue-900">🚀 Sprint 68 (ATUAL):</strong> Global expansion | 40h | 20 tarefas | 5 dias</p>
          <p><strong className="text-gray-900">⏳ Sprint 69+:</strong> Enterprise SLA, Marketplace, AI Automation, White-label</p>
        </div>
      </Card>

      {/* Success Criteria */}
      <Card className="p-6 bg-green-50 border-l-4 border-l-green-600">
        <h3 className="font-bold text-lg text-green-900 mb-3">✅ Critérios de Sucesso Sprint 68</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="text-green-600">✓</span>
            <span>Aplicação totalmente traduzida para 5 idiomas + RTL support</span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600">✓</span>
            <span>Apps iOS e Android publicadas nas lojas (App Store + Google Play)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600">✓</span>
            <span>Sincronização offline validada (100% dados, zero perda)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600">✓</span>
            <span>Sistema de pagamento global com 3D Secure + tax compliance</span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600">✓</span>
            <span>Monthly Recurring Revenue (MRR) infrastructure pronta</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}