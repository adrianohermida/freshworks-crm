import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Clock, AlertCircle, Rocket, TrendingUp } from 'lucide-react';

export default function Sprint27Planning() {
  const fases = [
    {
      numero: 1,
      nome: 'Dashboard Analytics Avançado',
      status: 'em_andamento',
      duracao: 'Semana 1 (30h)',
      progresso: 25,
      tarefas: [
        { id: 1, nome: 'Real-time Metrics', status: 'em_andamento', descricao: 'Atualização em tempo real' },
        { id: 2, nome: 'Custom Filters', status: 'planejado', descricao: 'Filtros avançados' },
        { id: 3, nome: 'Drill-down Analysis', status: 'planejado', descricao: 'Análise em profundidade' },
        { id: 4, nome: 'KPI Cards Customizáveis', status: 'planejado', descricao: 'Dashboards personalizados' }
      ]
    },
    {
      numero: 2,
      nome: 'AI-powered Insights',
      status: 'planejado',
      duracao: 'Semana 2 (35h)',
      progresso: 0,
      tarefas: [
        { id: 5, nome: 'Anomaly Detection', status: 'planejado', descricao: 'Detecção de anomalias' },
        { id: 6, nome: 'Smart Recommendations', status: 'planejado', descricao: 'Recomendações IA' },
        { id: 7, nome: 'Pattern Recognition', status: 'planejado', descricao: 'Reconhecimento de padrões' },
        { id: 8, nome: 'Alert System', status: 'planejado', descricao: 'Sistema inteligente de alertas' }
      ]
    },
    {
      numero: 3,
      nome: 'Predictive Analysis',
      status: 'planejado',
      duracao: 'Semana 3 (40h)',
      progresso: 0,
      tarefas: [
        { id: 9, nome: 'Forecasting Model', status: 'planejado', descricao: 'Modelo de previsão' },
        { id: 10, nome: 'Trend Analysis', status: 'planejado', descricao: 'Análise de tendências' },
        { id: 11, nome: 'Seasonal Decomposition', status: 'planejado', descricao: 'Decomposição sazonal' },
        { id: 12, nome: 'Confidence Intervals', status: 'planejado', descricao: 'Intervalos de confiança' }
      ]
    },
    {
      numero: 4,
      nome: 'Custom Reports & Export',
      status: 'planejado',
      duracao: 'Semana 4 (25h)',
      progresso: 0,
      tarefas: [
        { id: 13, nome: 'Report Builder', status: 'planejado', descricao: 'Construtor de relatórios' },
        { id: 14, nome: 'PDF Export', status: 'planejado', descricao: 'Exportação em PDF' },
        { id: 15, nome: 'Email Scheduling', status: 'planejado', descricao: 'Agendamento por email' },
        { id: 16, nome: 'Share & Collaborate', status: 'planejado', descricao: 'Compartilhamento' }
      ]
    }
  ];

  const totalTarefas = fases.reduce((acc, fase) => acc + fase.tarefas.length, 0);
  const tarefasCompletas = fases.reduce((acc, fase) => acc + fase.tarefas.filter(t => t.status === 'concluido').length, 0);
  const tarefasEmAndamento = fases.reduce((acc, fase) => acc + fase.tarefas.filter(t => t.status === 'em_andamento').length, 0);
  const progresso = Math.round((tarefasCompletas / totalTarefas) * 100);

  const getStatusColor = (status) => {
    switch(status) {
      case 'concluido': return 'bg-green-100 border-l-4 border-green-600';
      case 'em_andamento': return 'bg-blue-100 border-l-4 border-blue-600';
      case 'planejado': return 'bg-gray-100 border-l-4 border-gray-600';
      default: return 'bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'concluido': return '✅';
      case 'em_andamento': return '🔄';
      case 'planejado': return '⏳';
      default: return '❓';
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Rocket className="w-10 h-10 text-purple-600" />
          Sprint 27 - Analytics & IA
        </h1>
        <p className="text-lg text-gray-600">Dashboard Analytics | AI Insights | Predictive Analysis | Custom Reports</p>
      </div>

      {/* Status Geral */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 border-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-indigo-900">Sprint 27 - EM EXECUÇÃO</h2>
          <span className="text-3xl font-bold text-indigo-600">{progresso}%</span>
        </div>
        <div className="w-full h-4 bg-blue-200 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-indigo-600 transition-all" style={{ width: `${progresso}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Completas</p>
            <p className="text-xl font-bold text-green-600">{tarefasCompletas}</p>
          </div>
          <div>
            <p className="text-gray-600">Em Andamento</p>
            <p className="text-xl font-bold text-blue-600">{tarefasEmAndamento}</p>
          </div>
          <div>
            <p className="text-gray-600">Total</p>
            <p className="text-xl font-bold text-gray-600">{totalTarefas}</p>
          </div>
        </div>
      </Card>

      {/* Fases */}
      <div className="grid gap-4">
        {fases.map((fase, idx) => (
          <Card key={idx} className={`p-6 ${getStatusColor('planejado')}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Fase {fase.numero}: {fase.nome}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{fase.duracao} | {fase.progresso}% progresso</p>
              </div>
              <span className="text-2xl">{getStatusIcon(fase.status)}</span>
            </div>

            <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-indigo-600 transition-all"
                style={{ width: `${fase.progresso}%` }}
              />
            </div>

            <div className="space-y-2">
              {fase.tarefas.map((tarefa) => (
                <div 
                  key={tarefa.id} 
                  className={`p-3 rounded flex items-center gap-3 ${getStatusColor(tarefa.status)}`}
                >
                  <span className="text-xl">{getStatusIcon(tarefa.status)}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{tarefa.nome}</p>
                    <p className="text-xs text-gray-600">{tarefa.descricao}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase">{tarefa.status.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Timeline */}
      <Card className="p-6 bg-white border-2 border-indigo-200">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Timeline Sprint 27
        </h2>
        <div className="space-y-3">
          <div className="flex gap-4">
            <div className="w-24 text-sm font-bold text-indigo-600">Semana 1</div>
            <div className="flex-1">
              <div className="h-2 bg-indigo-300 rounded w-1/4"></div>
            </div>
            <span className="text-sm">Dashboard Analytics</span>
          </div>
          <div className="flex gap-4">
            <div className="w-24 text-sm font-bold text-indigo-600">Semana 2</div>
            <div className="flex-1">
              <div className="h-2 bg-indigo-300 rounded w-0"></div>
            </div>
            <span className="text-sm">AI Insights</span>
          </div>
          <div className="flex gap-4">
            <div className="w-24 text-sm font-bold text-indigo-600">Semana 3</div>
            <div className="flex-1">
              <div className="h-2 bg-indigo-300 rounded w-0"></div>
            </div>
            <span className="text-sm">Predictive Analysis</span>
          </div>
          <div className="flex gap-4">
            <div className="w-24 text-sm font-bold text-indigo-600">Semana 4</div>
            <div className="flex-1">
              <div className="h-2 bg-indigo-300 rounded w-0"></div>
            </div>
            <span className="text-sm">Reports & Export</span>
          </div>
        </div>
      </Card>

      {/* Métricas */}
      <Card className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0">
        <h2 className="text-2xl font-bold mb-4">📊 Metas Sprint 27</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm opacity-90">Horas Estimadas</p>
            <p className="text-3xl font-bold">130h</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Duração</p>
            <p className="text-3xl font-bold">4 sem</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Componentes</p>
            <p className="text-3xl font-bold">12+</p>
          </div>
          <div>
            <p className="text-sm opacity-90">APIs</p>
            <p className="text-3xl font-bold">8+</p>
          </div>
        </div>
      </Card>
    </div>
  );
}