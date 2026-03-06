import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Clock, AlertCircle, Rocket } from 'lucide-react';

export default function Sprint26Planning() {
  const fases = [
    {
      numero: 1,
      nome: 'Publicações Advise Refinado',
      status: 'concluido',
      duracao: 'Semana 1 (25h)',
      progresso: 100,
      tarefas: [
        { id: 1, nome: 'Marcar/Desmarcar Publicações', status: 'concluido', descricao: 'PUT endpoints ✅' },
        { id: 2, nome: 'Filtros Data Range', status: 'concluido', descricao: 'DataInicio/DataFim ✅' },
        { id: 3, nome: 'Paginação Avançada', status: 'concluido', descricao: 'Múltiplas páginas ✅' },
        { id: 4, nome: 'Error Handling Completo', status: 'concluido', descricao: '400/401 validation ✅' }
      ]
    },
    {
      numero: 2,
      nome: 'Google Calendar Sync Refinado',
      status: 'concluido',
      duracao: 'Semana 2 (20h)',
      progresso: 100,
      tarefas: [
        { id: 5, nome: 'Evento para Tarefa', status: 'concluido', descricao: 'Sincronização bidirecional ✅' },
        { id: 6, nome: 'Recurso Sync Status', status: 'concluido', descricao: 'Dashboard rastreamento ✅' },
        { id: 7, nome: 'Timezone Handling', status: 'concluido', descricao: 'Conversão automática ✅' },
        { id: 8, nome: 'Conflito Resolution', status: 'concluido', descricao: 'Estratégia de merge ✅' }
      ]
    },
    {
      numero: 3,
      nome: 'Webhook Management System',
      status: 'concluido',
      duracao: 'Semana 2-3 (30h)',
      progresso: 100,
      tarefas: [
        { id: 9, nome: 'Webhook Registry', status: 'concluido', descricao: 'CRUD webhooks ✅' },
        { id: 10, nome: 'Retry Logic Automático', status: 'concluido', descricao: 'Exponential backoff ✅' },
        { id: 11, nome: 'Webhook Validator', status: 'concluido', descricao: 'Signature verification ✅' },
        { id: 12, nome: 'Event Log Dashboard', status: 'concluido', descricao: 'Visualização eventos ✅' }
      ]
    },
    {
      numero: 4,
      nome: 'API Gateway & Cache',
      status: 'concluido',
      duracao: 'Semana 3-4 (35h)',
      progresso: 100,
      tarefas: [
        { id: 13, nome: 'Rate Limiting', status: 'concluido', descricao: 'Token bucket algorithm ✅' },
        { id: 14, nome: 'DDoS Protection', status: 'concluido', descricao: 'IP throttling ✅' },
        { id: 15, nome: 'Caching Layer', status: 'concluido', descricao: 'Redis integration ✅' },
        { id: 16, nome: 'GraphQL API Layer', status: 'concluido', descricao: 'Query/Mutation graph ✅' }
      ]
    }
  ];

  const totalTarefas = fases.reduce((acc, fase) => acc + fase.tarefas.length, 0);
  const tarefasCompletas = fases.reduce((acc, fase) => acc + fase.tarefas.filter(t => t.status === 'concluido').length, 0);
  const progresso = Math.round((tarefasCompletas / totalTarefas) * 100);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div>
        <h1 className="text-4xl font-bold mb-2">🚀 Sprint 26 - Integrações Avançadas</h1>
        <p className="text-lg text-gray-600">Webhook Management, Calendar Sync, API Gateway & Caching</p>
      </div>

      {/* Status Geral */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 border-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-green-900">✅ Sprint 26 - CONCLUÍDO!</h2>
          <span className="text-3xl font-bold text-green-600">{progresso}%</span>
        </div>
        <div className="w-full h-4 bg-green-200 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-green-600" style={{ width: '100%' }} />
        </div>
        <p className="text-sm text-green-700">{tarefasCompletas}/{totalTarefas} tarefas completas</p>
      </Card>

      {/* Fases */}
      <div className="grid gap-4">
        {fases.map((fase, idx) => (
          <Card key={idx} className="p-6 border-l-4 border-l-blue-600">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  Fase {fase.numero}: {fase.nome}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{fase.duracao}</p>
              </div>
              <span className="text-sm font-bold text-green-600">{fase.progresso}%</span>
            </div>

            <div className="space-y-2">
              {fase.tarefas.map((tarefa) => (
                <div key={tarefa.id} className="flex items-center gap-3 p-2 bg-green-50 rounded">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{tarefa.nome}</p>
                    <p className="text-xs text-gray-600">{tarefa.descricao}</p>
                  </div>
                  <span className="text-xs font-bold text-green-600">✅</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Resumo Final */}
      <Card className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
        <h2 className="text-2xl font-bold mb-3">📊 Resumo Sprint 26</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm opacity-90">Tarefas Completas</p>
            <p className="text-3xl font-bold">{tarefasCompletas}/{totalTarefas}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Progresso</p>
            <p className="text-3xl font-bold">{progresso}%</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Fases</p>
            <p className="text-3xl font-bold">4/4</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Status</p>
            <p className="text-3xl font-bold">✅ OK</p>
          </div>
        </div>
      </Card>

      {/* Próximas Ações */}
      <Card className="p-6 border-2 border-blue-300">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Rocket className="w-5 h-5 text-blue-600" />
          Sprint 27 - INICIANDO AGORA
        </h2>
        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
          <p className="font-semibold text-blue-900">Tema: Analytics & Inteligência Artificial</p>
          <p className="text-sm text-blue-800">• Fase 1: Dashboard Analytics Avançado</p>
          <p className="text-sm text-blue-800">• Fase 2: AI-powered Insights & Recommendations</p>
          <p className="text-sm text-blue-800">• Fase 3: Predictive Analysis & Forecasting</p>
          <p className="text-sm text-blue-800">• Fase 4: Custom Reports & Exportação</p>
        </div>
      </Card>
    </div>
  );
}