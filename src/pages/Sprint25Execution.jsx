import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, TrendingUp, Zap, Rocket } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Sprint25Execution() {
  const [faseAtiva, setFaseAtiva] = useState(1);

  const fases = [
    {
      numero: 1,
      nome: 'Notificações Avançado - Email',
      status: 'concluido',
      duracao: 'Semana 1 (25h)',
      progresso: 100,
      tarefas: [
        { id: 1, nome: 'Email Templates Customizáveis', status: 'concluido', descricao: 'Sistema completo de templates' },
        { id: 2, nome: 'Filas de Envio', status: 'concluido', descricao: 'sistemaFilasEmail.js ✅' },
        { id: 3, nome: 'Rastreamento de Leitura', status: 'concluido', descricao: 'rastreamentoLeitura.js ✅' },
        { id: 4, nome: 'A/B Testing', status: 'concluido', descricao: 'abTestingFramework.js ✅' }
      ]
    },
    {
      numero: 2,
      nome: 'Notificações - SMS & Push',
      status: 'concluido',
      duracao: 'Semana 2 (25h)',
      progresso: 100,
      tarefas: [
        { id: 5, nome: 'SMS Avançado (Twilio)', status: 'concluido', descricao: 'smsAvancado.js ✅' },
        { id: 6, nome: 'Push Refinado (FCM)', status: 'concluido', descricao: 'pushRefinado.js ✅' },
        { id: 7, nome: 'Delivery Tracking', status: 'concluido', descricao: 'DashboardRastreamento.jsx ✅' },
        { id: 8, nome: 'Retry Policy', status: 'concluido', descricao: 'Backoff exponencial implementado ✅' }
      ]
    },
    {
      numero: 3,
      nome: 'Colaboração Avançada',
      status: 'em_andamento',
      duracao: 'Semana 3 (35h)',
      progresso: 75,
      tarefas: [
        { id: 9, nome: 'Comentários Aninhados', status: 'concluido', descricao: 'criarComentario.js ✅' },
        { id: 10, nome: 'Permissões Granulares', status: 'concluido', descricao: 'permissoesGranulares.js ✅' },
        { id: 11, nome: 'Notificações Colaboração', status: 'concluido', descricao: 'notificacoesColaboracao.js ✅' },
        { id: 12, nome: 'Histórico Detalhado', status: 'concluido', descricao: 'auditTrailColaboracao.js ✅' }
      ]
    },
    {
      numero: 4,
      nome: 'Mobile & Otimizações',
      status: 'concluido',
      duracao: 'Semana 4 (30h)',
      progresso: 100,
      tarefas: [
        { id: 13, nome: 'Mobile UI Components', status: 'concluido', descricao: 'ComponentesMobileOtimizados.jsx ✅' },
        { id: 14, nome: 'Performance Optimization', status: 'concluido', descricao: 'performanceOptimization.js ✅' },
        { id: 15, nome: 'Testing Mobile', status: 'concluido', descricao: 'testesMobile.js ✅' },
        { id: 16, nome: 'Deployment Checklist', status: 'concluido', descricao: 'DeploymentChecklist.jsx ✅' }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'concluido':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200';
      case 'em_andamento':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200';
      case 'planejado':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'concluido':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'em_andamento':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'planejado':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const totalTarefas = fases.reduce((acc, fase) => acc + fase.tarefas.length, 0);
  const tarefasCompletas = fases.reduce((acc, fase) => acc + fase.tarefas.filter(t => t.status === 'concluido').length, 0);
  const tarefasEmAndamento = fases.reduce((acc, fase) => acc + fase.tarefas.filter(t => t.status === 'em_andamento').length, 0);
  const progresso = Math.round((tarefasCompletas / totalTarefas) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Rocket className="w-10 h-10 text-violet-600" />
            Sprint 25 - Notificações & Colaboração
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">✅ TODAS AS 4 FASES COMPLETAS! | 100% | 115 Horas Executadas</p>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Progresso Geral</span>
              <span className="text-sm font-bold text-violet-600">{Math.round(progresso)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-500"
                style={{ width: `${progresso}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{tarefasCompletas} de {totalTarefas} tarefas | {tarefasEmAndamento} em andamento | {progresso}%</p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Concluídas</p>
            <p className="text-3xl font-bold text-green-600">{tarefasCompletas}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Em Andamento</p>
            <p className="text-3xl font-bold text-blue-600">{tarefasEmAndamento}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Planejadas</p>
            <p className="text-3xl font-bold text-yellow-600">{totalTarefas - tarefasCompletas - tarefasEmAndamento}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Progresso Total</p>
            <p className="text-3xl font-bold text-violet-600">{progresso}%</p>
            <p className="text-xs text-gray-500 mt-1">{tarefasCompletas}/{totalTarefas} tarefas</p>
          </Card>
        </div>

        {/* Fases Tabs */}
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {fases.map((fase) => (
              <button
                key={fase.numero}
                onClick={() => setFaseAtiva(fase.numero)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  faseAtiva === fase.numero
                    ? 'bg-violet-600 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                {getStatusIcon(fase.status)}
                Fase {fase.numero}
              </button>
            ))}
          </div>

          {/* Fase Details */}
          {fases.map((fase) => (
            faseAtiva === fase.numero && (
              <Card key={fase.numero} className="p-6 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Fase {fase.numero}: {fase.nome}</h2>
                  <div className="flex gap-4 text-sm flex-wrap">
                    <span className={`px-3 py-1 rounded-full ${getStatusColor(fase.status)} flex items-center gap-2`}>
                      {getStatusIcon(fase.status)}
                      {fase.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">⏱️ {fase.duracao}</span>
                  </div>
                </div>

                {/* Tarefas */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Tarefas ({fase.tarefas.length})</h3>
                  <div className="space-y-2">
                    {fase.tarefas.map((tarefa) => (
                      <div key={tarefa.id} className={`p-4 rounded-lg border ${getStatusColor(tarefa.status)}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {getStatusIcon(tarefa.status)}
                            <div>
                              <p className="font-semibold">{tarefa.nome}</p>
                              <p className="text-sm opacity-80">{tarefa.descricao}</p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold">{tarefa.status.replace('_', ' ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Fase */}
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">Progresso da Fase</span>
                    <span className="text-sm font-bold">{fase.progresso}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-violet-500 transition-all duration-500"
                      style={{ width: `${fase.progresso}%` }}
                    />
                  </div>
                </div>
              </Card>
            )
          ))}
        </div>

        {/* Current Phase Status */}
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-300 border-2">
          <h2 className="text-2xl font-bold mb-4">🎉 SPRINT 25 - 100% COMPLETO!</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold">Fase 1: Email Notifications (4/4)</p>
                <p className="text-sm text-gray-600">Templates + Filas + Rastreamento + A/B Testing</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pb-3 border-b">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold">Fase 2: SMS & Push (4/4)</p>
                <p className="text-sm text-gray-600">SMS Avançado + Push Refinado + Tracking + Retry</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pb-3 border-b">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold">Fase 3: Colaboração Avançada (4/4)</p>
                <p className="text-sm text-gray-600">Permissões RBAC + Notificações + Audit Trail</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold">Fase 4: Mobile & Otimizações (4/4)</p>
                <p className="text-sm text-gray-600">Componentes Mobile + Performance + Testes + Deployment</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <Card className="p-6 border-t-4 border-violet-500">
          <h2 className="text-2xl font-bold mb-4">📅 Timeline Sprint 25</h2>
          <div className="space-y-3">
            {fases.map((fase) => (
              <div key={fase.numero} className="flex gap-4 items-center">
                <div className="w-24 font-semibold text-sm flex-shrink-0 text-gray-600">Semana {fase.numero}</div>
                <div className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm ${
                  fase.status === 'em_andamento' 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                  {fase.nome} ({fase.duracao})
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Next Actions */}
        <Card className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
          <h2 className="text-2xl font-bold mb-2">✅ Sprint 25 Finalizado!</h2>
          <ul className="space-y-2 text-green-100">
            <li>✅ Todas as 4 Fases 100% Implementadas</li>
            <li>✅ 16/16 Tarefas Completas</li>
            <li>✅ 115 Horas de Desenvolvimento Realizadas</li>
            <li>✅ Pronto para Produção</li>
            <li>✅ Próximo: Sprint 26 - Integrações Avançadas</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}