import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, TrendingUp, Zap } from 'lucide-react';

export default function Sprint27Execution() {
  const fases = [
    {
      numero: 1,
      nome: 'Dashboard Analytics Avançado',
      status: 'concluido',
      duracao: 'Semana 1 (30h)',
      progresso: 100,
      tarefas: [
        { id: 1, nome: 'Real-time Metrics WebSocket', status: 'concluido', descricao: 'Atualização tempo real via WebSocket ✅' },
        { id: 2, nome: 'Custom Filters Avançados', status: 'concluido', descricao: 'Filtros multidimensionais ✅' },
        { id: 3, nome: 'Drill-down Analysis', status: 'concluido', descricao: 'Análise multinível ✅' },
        { id: 4, nome: 'KPI Cards Customizáveis', status: 'concluido', descricao: 'Dashboards drag-drop ✅' }
      ]
    },
    {
      numero: 2,
      nome: 'AI-powered Insights',
      status: 'concluido',
      duracao: 'Semana 2 (35h)',
      progresso: 100,
      tarefas: [
        { id: 5, nome: 'Anomaly Detection LLM', status: 'concluido', descricao: 'Detecção com LLM ✅' },
        { id: 6, nome: 'Smart Recommendations', status: 'concluido', descricao: 'Recomendações baseadas em IA ✅' },
        { id: 7, nome: 'Pattern Recognition', status: 'concluido', descricao: 'Algoritmo clustering ✅' },
        { id: 8, nome: 'Intelligent Alert System', status: 'concluido', descricao: 'Alertas com contexto IA ✅' }
      ]
    },
    {
      numero: 3,
      nome: 'Predictive Analysis & Forecasting',
      status: 'concluido',
      duracao: 'Semana 3 (40h)',
      progresso: 100,
      tarefas: [
        { id: 9, nome: 'Time Series Forecasting', status: 'concluido', descricao: 'Modelo ARIMA + Prophet ✅' },
        { id: 10, nome: 'Trend Analysis Engine', status: 'concluido', descricao: 'Análise tendências ✅' },
        { id: 11, nome: 'Seasonal Decomposition', status: 'concluido', descricao: 'Decomposição STL ✅' },
        { id: 12, nome: 'Confidence Intervals', status: 'concluido', descricao: 'Intervalos 95%/99% ✅' }
      ]
    },
    {
      numero: 4,
      nome: 'Custom Reports & Export',
      status: 'concluido',
      duracao: 'Semana 4 (25h)',
      progresso: 100,
      tarefas: [
        { id: 13, nome: 'Report Builder Drag-Drop', status: 'concluido', descricao: 'Interface interativa ✅' },
        { id: 14, nome: 'PDF/Excel/CSV Export', status: 'concluido', descricao: 'Múltiplos formatos ✅' },
        { id: 15, nome: 'Email Scheduling', status: 'concluido', descricao: 'Envio agendado ✅' },
        { id: 16, nome: 'Share & Collaborate', status: 'concluido', descricao: 'Permissões granulares ✅' }
      ]
    }
  ];

  const totalTarefas = fases.reduce((acc, fase) => acc + fase.tarefas.length, 0);
  const tarefasCompletas = fases.reduce((acc, fase) => acc + fase.tarefas.filter(t => t.status === 'concluido').length, 0);
  const progresso = Math.round((tarefasCompletas / totalTarefas) * 100);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      <div>
        <h1 className="text-4xl font-bold mb-2">🎉 Sprint 27 - Analytics & IA COMPLETADO!</h1>
        <p className="text-lg text-gray-600">Dashboard Analytics | AI Insights | Predictive Analysis | Custom Reports</p>
      </div>

      {/* Status Geral */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 border-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-green-900">✅ SPRINT 27 - 100% COMPLETO!</h2>
          <span className="text-4xl font-bold text-green-600">{progresso}%</span>
        </div>
        <div className="w-full h-4 bg-green-200 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-green-600" style={{ width: '100%' }} />
        </div>
        <p className="text-sm text-green-700">{tarefasCompletas}/{totalTarefas} tarefas completas | 130 horas executadas</p>
      </Card>

      {/* Fases Completas */}
      <div className="grid gap-4">
        {fases.map((fase, idx) => (
          <Card key={idx} className="p-6 border-l-4 border-l-purple-600 bg-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  Fase {fase.numero}: {fase.nome}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{fase.duracao}</p>
              </div>
              <span className="text-sm font-bold text-green-600">100%</span>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-green-600" style={{ width: '100%' }} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {fase.tarefas.map((tarefa) => (
                <div key={tarefa.id} className="p-2 bg-green-50 rounded border-l-2 border-l-green-600">
                  <p className="font-semibold text-xs">{tarefa.nome}</p>
                  <p className="text-xs text-gray-600 mt-1">{tarefa.descricao}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Resumo Executivo */}
      <Card className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
        <h2 className="text-2xl font-bold mb-4">📊 Sprint 27 - Resumo Executivo</h2>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm opacity-90">Tarefas</p>
            <p className="text-3xl font-bold">{tarefasCompletas}/16</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Progresso</p>
            <p className="text-3xl font-bold">100%</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Horas</p>
            <p className="text-3xl font-bold">130h</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Status</p>
            <p className="text-3xl font-bold">✅ OK</p>
          </div>
        </div>

        <div className="border-t border-green-400 pt-4">
          <h3 className="font-semibold mb-2">Deliverables Completos:</h3>
          <ul className="text-sm space-y-1">
            <li>✓ Dashboard Analytics com WebSocket real-time</li>
            <li>✓ IA Insights com detecção de anomalias</li>
            <li>✓ Forecasting com modelos ARIMA/Prophet</li>
            <li>✓ Custom Reports com exportação PDF/Excel/CSV</li>
            <li>✓ Email scheduling para relatórios agendados</li>
            <li>✓ Permissões granulares e compartilhamento</li>
          </ul>
        </div>
      </Card>

      {/* Sprint 28 Iniciando */}
      <Card className="p-6 border-2 border-blue-300 bg-blue-50">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
          <Zap className="w-6 h-6 text-blue-600" />
          🚀 Sprint 28 - INICIANDO AGORA
        </h2>
        <div className="bg-white p-4 rounded-lg border border-blue-300">
          <p className="font-semibold text-blue-900 mb-3">Tema: Mobile Excellence & Performance</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-semibold text-blue-800">Fase 1: Mobile Refinement</p>
              <p className="text-gray-700">UI/UX, responsividade, gestos avançados</p>
            </div>
            <div>
              <p className="font-semibold text-blue-800">Fase 2: Performance Max</p>
              <p className="text-gray-700">Bundle size, lazy loading, virtualization</p>
            </div>
            <div>
              <p className="font-semibold text-blue-800">Fase 3: Offline Excellence</p>
              <p className="text-gray-700">Service Workers, sync, storage local</p>
            </div>
            <div>
              <p className="font-semibold text-blue-800">Fase 4: Production Ready</p>
              <p className="text-gray-700">Testes, CI/CD, monitoring, deployment</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}