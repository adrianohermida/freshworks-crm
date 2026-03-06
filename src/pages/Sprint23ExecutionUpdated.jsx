import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, TrendingUp, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Sprint23ExecutionUpdated() {
  const [faseAtiva, setFaseAtiva] = useState(1);

  const fases = [
    {
      numero: 1,
      nome: 'Integração Escavador',
      status: 'concluido',
      duracao: 'Semana 1 (40h)',
      progresso: 100,
      tarefas: [
        { id: 1, nome: 'Setup Escavador API', status: 'concluido', descricao: 'Credentials configuradas' },
        { id: 2, nome: 'Endpoint Busca Jurisprudência', status: 'concluido', descricao: 'buscaJurisprudencia.js ✅' },
        { id: 3, nome: 'Cache de Resultados', status: 'concluido', descricao: 'cacheResultados.js ✅' },
        { id: 4, nome: 'Dashboard Pesquisas', status: 'concluido', descricao: 'DashboardPesquisas.jsx ✅' }
      ]
    },
    {
      numero: 2,
      nome: 'Sistema de Notificações Avançado',
      status: 'concluido',
      duracao: 'Semana 2 (35h)',
      progresso: 100,
      tarefas: [
        { id: 5, nome: 'Email Templates', status: 'concluido', descricao: 'enviarEmailTemplate.js ✅' },
        { id: 6, nome: 'SMS Gateway', status: 'concluido', descricao: 'enviarSMS.js (Twilio) ✅' },
        { id: 7, nome: 'Push Notifications', status: 'concluido', descricao: 'enviarPush.js (FCM) ✅' },
        { id: 8, nome: 'Webhook Callbacks', status: 'concluido', descricao: 'registrarWebhook.js ✅' }
      ]
    },
    {
      numero: 3,
      nome: 'Portal de Colaboração',
      status: 'concluido',
      duracao: 'Semana 3 (45h)',
      progresso: 100,
      tarefas: [
        { id: 9, nome: 'Sistema Comentários', status: 'concluido', descricao: 'criarComentario.js ✅' },
        { id: 10, nome: 'Compartilhamento Docs', status: 'concluido', descricao: 'compartilharDocumento.js ✅' },
        { id: 11, nome: 'Menções & Atribuições', status: 'concluido', descricao: 'atribuirTarefa.js (@mentions) ✅' },
        { id: 12, nome: 'Histórico Colaboração', status: 'concluido', descricao: 'TimelineColaboracao.jsx ✅' }
      ]
    },
    {
      numero: 4,
      nome: 'Mobile App Preview',
      status: 'concluido',
      duracao: 'Semana 4 (50h)',
      progresso: 100,
      tarefas: [
        { id: 13, nome: 'API Mobile-Optimized', status: 'concluido', descricao: 'otimizarAPIMobile.js ✅' },
        { id: 14, nome: 'Offline-First Arch', status: 'concluido', descricao: 'sincronizacaoOffline.js ✅' },
        { id: 15, nome: 'PWA Melhorado', status: 'concluido', descricao: 'PWAServiceWorkerSetup.jsx ✅' },
        { id: 16, nome: 'Testes Performance', status: 'concluido', descricao: 'testesPerformanceMobile.js ✅' }
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
  const progresso = (tarefasCompletas / totalTarefas) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Sprint 23 - Execução Atualizado</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Integrações Avançadas & Colaboração - EM PROGRESSO</p>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Progresso Geral</span>
              <span className="text-sm font-bold text-purple-600">{Math.round(progresso)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${progresso}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{tarefasCompletas} de {totalTarefas} tarefas concluídas</p>
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
            <p className="text-3xl font-bold text-blue-600">{fases.reduce((acc, f) => acc + f.tarefas.filter(t => t.status === 'em_andamento').length, 0)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Planejadas</p>
            <p className="text-3xl font-bold text-yellow-600">{fases.reduce((acc, f) => acc + f.tarefas.filter(t => t.status === 'planejado').length, 0)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Fase Ativa</p>
            <p className="text-3xl font-bold text-purple-600">{faseAtiva}/4</p>
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
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                {getStatusIcon(fase.status)}
                Fase {fase.numero}: {fase.nome.split(' ')[0]}...
              </button>
            ))}
          </div>

          {/* Fase Details */}
          {fases.map((fase) => (
            faseAtiva === fase.numero && (
              <Card key={fase.numero} className="p-6 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Fase {fase.numero}: {fase.nome}</h2>
                  <div className="flex gap-4 text-sm">
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
                      className="h-full bg-purple-500 transition-all duration-500"
                      style={{ width: `${fase.progresso}%` }}
                    />
                  </div>
                </div>
              </Card>
            )
          ))}
        </div>

        {/* Summary */}
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-300">
          <h2 className="text-2xl font-bold mb-4">✅ Fase 1 Completada!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold">Setup Escavador</p>
                <p className="text-xs text-gray-600">API credentials configuradas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold">Busca Jurisprudência</p>
                <p className="text-xs text-gray-600">Endpoint implementado</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold">Cache Resultados</p>
                <p className="text-xs text-gray-600">Sistema de cache ativo</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold">Dashboard Pesquisas</p>
                <p className="text-xs text-gray-600">Interface completa</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}