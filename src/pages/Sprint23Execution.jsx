import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Sprint23Execution() {
  const [faseAtiva, setFaseAtiva] = useState(1);

  const fases = [
    {
      numero: 1,
      nome: 'Integração Escavador',
      status: 'em_andamento',
      duracao: 'Semana 1 (40h)',
      tarefas: [
        { id: 1, nome: 'Setup Escavador API', status: 'concluido', descricao: 'Credentials e autenticação configuradas' },
        { id: 2, nome: 'Endpoint Busca Jurisprudência', status: 'em_andamento', descricao: 'Em desenvolvimento' },
        { id: 3, nome: 'Cache de Resultados', status: 'planejado', descricao: 'Aguardando endpoint completo' },
        { id: 4, nome: 'Dashboard Pesquisas', status: 'planejado', descricao: 'Histórico e estatísticas' }
      ]
    },
    {
      numero: 2,
      nome: 'Notificações Avançado',
      status: 'planejado',
      duracao: 'Semana 2 (35h)',
      tarefas: [
        { id: 5, nome: 'Email Templates', status: 'planejado', descricao: 'Templates customizáveis' },
        { id: 6, nome: 'SMS Gateway', status: 'planejado', descricao: 'Twilio integration' },
        { id: 7, nome: 'Push Notifications', status: 'planejado', descricao: 'FCM refinado' },
        { id: 8, nome: 'Webhook Callbacks', status: 'planejado', descricao: 'Eventos para integrações' }
      ]
    },
    {
      numero: 3,
      nome: 'Portal Colaboração',
      status: 'planejado',
      duracao: 'Semana 3 (45h)',
      tarefas: [
        { id: 9, nome: 'Sistema Comentários', status: 'planejado', descricao: 'Comments em processos' },
        { id: 10, nome: 'Compartilhamento Docs', status: 'planejado', descricao: 'Document sharing' },
        { id: 11, nome: 'Menções & Atribuições', status: 'planejado', descricao: '@mentions e task assignment' },
        { id: 12, nome: 'Histórico Colaboração', status: 'planejado', descricao: 'Activity timeline' }
      ]
    },
    {
      numero: 4,
      nome: 'Mobile App Preview',
      status: 'planejado',
      duracao: 'Semana 4 (50h)',
      tarefas: [
        { id: 13, nome: 'API Mobile-Optimized', status: 'planejado', descricao: 'Endpoints otimizados' },
        { id: 14, nome: 'Offline-First Arch', status: 'planejado', descricao: 'Sincronização offline' },
        { id: 15, nome: 'PWA Melhorado', status: 'planejado', descricao: 'Service worker aprimorado' },
        { id: 16, nome: 'Testes Performance', status: 'planejado', descricao: 'Mobile performance tests' }
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
      case 'pendente':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200';
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
      case 'pendente':
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Sprint 23 - Execução (Pausado)</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">⏸️ Pausado para executar Sprint 24 (API Advise Crítica)</p>
          
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
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Pendentes</p>
            <p className="text-3xl font-bold text-gray-600">{fases.reduce((acc, f) => acc + f.tarefas.filter(t => t.status === 'pendente').length, 0)}</p>
          </Card>
        </div>

        {/* Fases Tabs */}
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {fases.map((fase) => (
              <button
                key={fase.numero}
                onClick={() => setFaseAtiva(fase.numero)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  faseAtiva === fase.numero
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
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
                    <span className="text-sm font-bold">{Math.round((fase.tarefas.filter(t => t.status === 'concluido').length / fase.tarefas.length) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 transition-all duration-500"
                      style={{ width: `${(fase.tarefas.filter(t => t.status === 'concluido').length / fase.tarefas.length) * 100}%` }}
                    />
                  </div>
                </div>
              </Card>
            )
          ))}
        </div>

        {/* Timeline */}
        <Card className="p-6 bg-slate-100 dark:bg-slate-800">
          <h2 className="text-2xl font-bold mb-4">📅 Timeline Sprint 23</h2>
          <div className="space-y-4">
            {fases.map((fase) => (
              <div key={fase.numero} className="flex gap-4">
                <div className="w-32 font-semibold text-sm flex-shrink-0">{fase.duracao}</div>
                <div className="flex-1 relative">
                  <div className={`px-4 py-3 rounded-lg text-sm font-semibold ${
                    fase.status === 'concluido' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200' :
                    fase.status === 'em_andamento' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' :
                    'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200'
                  }`}>
                    {fase.nome}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Status Geral */}
        <Card className="p-6 border-t-4 border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <h2 className="text-2xl font-bold mb-4">📊 Status Geral Sprint 23</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Cronograma</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>Início: 03 de Março de 2026</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>Duração: 4 semanas (~170 horas)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>Conclusão Esperada: 31 de Março</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Próximas Ações</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-lg">→</span>
                  <span>Completar endpoint busca jurisprudência</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">→</span>
                  <span>Cache de resultados Escavador</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">→</span>
                  <span>Iniciar Fase 2 (Notificações)</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}