import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Clock, TrendingUp, Zap, Users, Bug } from 'lucide-react';

export default function Phase1Stabilization() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [expandedTask, setExpandedTask] = useState(null);

  const phaseInfo = {
    nome: 'FASE 1: ESTABILIZAÇÃO',
    duracao: '2 semanas (Mai 2026)',
    dataInicio: '05/05/2026',
    dataFim: '19/05/2026',
    status: 'EM_PROGRESSO',
    prioridade: 'CRÍTICA',
    descricao: 'Monitoramento intensivo, correção de bugs críticos e coleta de feedback dos usuários'
  };

  const tarefas = [
    {
      id: 1,
      titulo: 'Monitorar Erros em Tempo Real',
      descricao: 'Implementar sistema de monitoramento contínuo de erros e alertas automáticos',
      status: 'EM_ANDAMENTO',
      progresso: 60,
      prioridade: 'CRÍTICA',
      assignee: 'DevOps Team',
      subtarefas: [
        { nome: 'Configurar alertas de erro', status: '✅' },
        { nome: 'Dashboard de monitoramento', status: '⏳' },
        { nome: 'Integração com Slack', status: '⏳' }
      ]
    },
    {
      id: 2,
      titulo: 'Bug Fixes Prioritários',
      descricao: 'Identificar e corrigir bugs críticos reportados pelos usuários',
      status: 'EM_ANDAMENTO',
      progresso: 45,
      prioridade: 'CRÍTICA',
      assignee: 'Backend Team',
      subtarefas: [
        { nome: 'Triage de bugs reportados', status: '✅' },
        { nome: 'Fix de bugs críticos (P0/P1)', status: '⏳' },
        { nome: 'Testing e validação', status: '⏳' }
      ]
    },
    {
      id: 3,
      titulo: 'Performance Tuning',
      descricao: 'Otimizar latência, cache e recursos do servidor baseado em métricas',
      status: 'PENDENTE',
      progresso: 0,
      prioridade: 'ALTA',
      assignee: 'Performance Team',
      subtarefas: [
        { nome: 'Análise de bottlenecks', status: '⏳' },
        { nome: 'Otimização de queries DB', status: '⏳' },
        { nome: 'Cache strategy review', status: '⏳' }
      ]
    },
    {
      id: 4,
      titulo: 'Feedback dos Usuários',
      descricao: 'Coletar, analisar e priorizar feedback para próximas iterações',
      status: 'EM_ANDAMENTO',
      progresso: 50,
      prioridade: 'ALTA',
      assignee: 'Product Team',
      subtarefas: [
        { nome: 'Surveys e feedback forms', status: '✅' },
        { nome: 'Análise de user behavior', status: '⏳' },
        { nome: 'Roadmap v3.1 updates', status: '⏳' }
      ]
    },
    {
      id: 5,
      titulo: 'Hotfixes & Patches',
      descricao: 'Publicar patches de segurança e correções menores conforme necessário',
      status: 'PENDENTE',
      progresso: 0,
      prioridade: 'ALTA',
      assignee: 'Release Team',
      subtarefas: [
        { nome: 'Security patches', status: '⏳' },
        { nome: 'Release pipeline setup', status: '⏳' },
        { nome: 'Documentation updates', status: '⏳' }
      ]
    },
    {
      id: 6,
      titulo: 'Documentação & Runbooks',
      descricao: 'Atualizar documentação técnica e criar runbooks para troubleshooting',
      status: 'PENDENTE',
      progresso: 20,
      prioridade: 'MÉDIA',
      assignee: 'Docs Team',
      subtarefas: [
        { nome: 'Release notes v3.0', status: '✅' },
        { nome: 'Troubleshooting guide', status: '⏳' },
        { nome: 'API documentation', status: '⏳' }
      ]
    }
  ];

  const kpisTarget = [
    { metrica: 'Uptime', target: '99.99%', atual: '99.99%', status: '✅' },
    { metrica: 'P99 Latência', target: '<3ms', atual: '2.3ms', status: '✅' },
    { metrica: 'Bug Fix Time', target: '<4h', atual: '2.1h', status: '✅' },
    { metrica: 'Error Rate', target: '<0.1%', atual: '0.08%', status: '✅' }
  ];

  const totalTarefas = tarefas.length;
  const tarefasCompletas = tarefas.filter(t => t.status === 'COMPLETO').length;
  const tarefasEmAndamento = tarefas.filter(t => t.status === 'EM_ANDAMENTO').length;
  const percentualCompleto = Math.round((tarefasCompletas / totalTarefas) * 100);
  const progressoMedio = Math.round(tarefas.reduce((sum, t) => sum + t.progresso, 0) / totalTarefas);

  const getStatusColor = (status) => {
    switch(status) {
      case 'COMPLETO': return 'bg-green-600';
      case 'EM_ANDAMENTO': return 'bg-blue-600';
      case 'PENDENTE': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getPrioridadeColor = (prioridade) => {
    switch(prioridade) {
      case 'CRÍTICA': return 'text-red-600 dark:text-red-400';
      case 'ALTA': return 'text-orange-600 dark:text-orange-400';
      case 'MÉDIA': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className={`p-6 rounded-lg border-l-4 ${isDark ? 'bg-blue-900/20 border-blue-600' : 'bg-blue-50 border-blue-600'}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-blue-600">ATIVO</Badge>
                <h1 className="text-3xl font-bold">{phaseInfo.nome}</h1>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {phaseInfo.descricao}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${getPrioridadeColor(phaseInfo.prioridade)}`}>
                {phaseInfo.prioridade}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {phaseInfo.duracao}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">📅 Timeline</p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {phaseInfo.dataInicio} até {phaseInfo.dataFim}
              </p>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-bold">{progressoMedio}%</p>
                <p className="text-xs">Progresso Médio</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{tarefasEmAndamento}/{totalTarefas}</p>
                <p className="text-xs">Em Andamento</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{tarefasCompletas}/{totalTarefas}</p>
                <p className="text-xs">Completadas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Progresso Geral da Fase 1
          </h2>
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6 space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Taxa de Completude</span>
                  <span className="text-2xl font-bold">{percentualCompleto}%</span>
                </div>
                <Progress value={percentualCompleto} className="h-3" />
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Tarefas Completas</p>
                  <p className="text-3xl font-bold text-green-600">{tarefasCompletas}</p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Em Andamento</p>
                  <p className="text-3xl font-bold text-blue-600">{tarefasEmAndamento}</p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Pendentes</p>
                  <p className="text-3xl font-bold text-gray-600">{totalTarefas - tarefasCompletas - tarefasEmAndamento}</p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total de Tarefas</p>
                  <p className="text-3xl font-bold">{totalTarefas}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* KPIs de Monitoramento */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6" />
            KPIs de Monitoramento
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {kpisTarget.map((kpi, idx) => (
              <Card key={idx} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="pt-6 text-center">
                  <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{kpi.metrica}</p>
                  <p className="text-2xl font-bold mb-1">{kpi.atual}</p>
                  <p className={`text-xs mb-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Target: {kpi.target}</p>
                  <div className="text-2xl">{kpi.status}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tarefas Detalhadas */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" />
            Tarefas da Sprint
          </h2>
          <div className="space-y-4">
            {tarefas.map((tarefa) => (
              <Card 
                key={tarefa.id} 
                className={`cursor-pointer transition-all ${isDark ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'hover:shadow-lg'}`}
                onClick={() => setExpandedTask(expandedTask === tarefa.id ? null : tarefa.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getStatusColor(tarefa.status)}>
                          {tarefa.status.replace('_', ' ')}
                        </Badge>
                        <h3 className="text-lg font-semibold">{tarefa.titulo}</h3>
                      </div>
                      <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {tarefa.descricao}
                      </p>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between mb-1 text-xs">
                            <span>Progresso</span>
                            <span className="font-semibold">{tarefa.progresso}%</span>
                          </div>
                          <Progress value={tarefa.progresso} className="h-2" />
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className={`text-xs mb-2 font-semibold ${getPrioridadeColor(tarefa.prioridade)}`}>
                        {tarefa.prioridade}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {tarefa.assignee}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                {expandedTask === tarefa.id && (
                  <CardContent className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-sm mb-2">Subtarefas:</p>
                        <div className="space-y-2">
                          {tarefa.subtarefas.map((sub, idx) => (
                            <div key={idx} className={`p-2 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                              <span className="mr-2">{sub.status}</span>
                              {sub.nome}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Próximas Ações */}
        <section className={`p-6 rounded-lg border-l-4 ${isDark ? 'bg-orange-900/20 border-orange-600' : 'bg-orange-50 border-orange-600'}`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Ações Críticas - Próximos 3 Dias
          </h2>
          <ol className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <li className="flex gap-3">
              <span className="font-bold">1.</span>
              <span>Ativar alertas automáticos de erro e configuro dashboard de monitoramento em tempo real</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">2.</span>
              <span>Iniciar triage de bugs críticos (P0/P1) e publicar primeiro patch de segurança</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">3.</span>
              <span>Coletar primeiros feedback dos usuários via surveys e analisar comportamento em produção</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">4.</span>
              <span>Realizar análise de performance e identificar bottlenecks para otimização</span>
            </li>
          </ol>
        </section>

        {/* Checklist Diário */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Checklist Diário (Stand-ups)
          </h2>
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {[
                  '✅ Revisar logs de erro dos últimos 24h',
                  '✅ Confirmar uptime e latência dentro dos targets',
                  '⏳ Atualizar status de bugs críticos',
                  '⏳ Coletar feedback de suporte ao cliente',
                  '⏳ Validar patches publicados',
                  '⏳ Registrar métricas de performance'
                ].map((item, idx) => (
                  <div key={idx} className={`p-3 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Resumo Executivo */}
        <section className={`p-6 rounded-lg ${isDark ? 'bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-700' : 'bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-300'}`}>
          <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            📊 Resumo da Fase 1 - Estabilização
          </h2>
          <p className={isDark ? 'text-blue-200' : 'text-blue-900'}>
            <strong>Status:</strong> Em progresso | <strong>Progresso:</strong> {progressoMedio}% | 
            <strong> Tarefas Ativas:</strong> {tarefasEmAndamento} de {totalTarefas} | 
            <strong> Deadline:</strong> 19 de Maio de 2026
          </p>
        </section>
      </div>
    </div>
  );
}