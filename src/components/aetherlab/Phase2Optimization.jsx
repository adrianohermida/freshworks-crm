import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, TrendingUp, Zap, Users, Lightbulb } from 'lucide-react';

export default function Phase2Optimization() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [expandedTask, setExpandedTask] = useState(null);

  // FECHAMENTO FASE 1
  const fase1Resultado = {
    status: 'CONCLUÍDO',
    duracao: '2 semanas',
    dataFim: '19/05/2026',
    tarefasCompletas: 6,
    tarefasTotal: 6,
    progresso: 100,
    kpisAlcancados: [
      { metrica: 'Uptime', alvo: '99.99%', atingido: '99.99%', status: '✅' },
      { metrica: 'Bug Fix Time', alvo: '<4h', atingido: '2.1h', status: '✅' },
      { metrica: 'Error Rate', alvo: '<0.1%', atingido: '0.07%', status: '✅' }
    ],
    resultados: [
      '✅ Monitoramento 24/7 ativado com alertas automáticos',
      '✅ 45 bugs críticos identificados e corrigidos',
      '✅ Performance otimizada: -35% latência P99',
      '✅ 1.200+ feedbacks de usuários coletados e analisados',
      '✅ 3 patches de segurança publicados',
      '✅ Documentação técnica 100% atualizada'
    ]
  };

  // INICIALIZAÇÃO FASE 2
  const fase2Info = {
    nome: 'FASE 2: OTIMIZAÇÃO',
    duracao: '3 semanas (Jun 2026)',
    dataInicio: '20/06/2026',
    dataFim: '10/07/2026',
    status: 'INICIADO',
    prioridade: 'ALTA',
    descricao: 'Melhorias de performance, UX e analytics baseadas em feedback dos usuários'
  };

  const tarefasFase2 = [
    {
      id: 1,
      titulo: 'UX/UI Improvements',
      descricao: 'Implementar melhorias de UX baseadas em feedback dos usuários e heatmaps',
      status: 'EM_ANDAMENTO',
      progresso: 25,
      prioridade: 'ALTA',
      assignee: 'Frontend Team',
      subtarefas: [
        { nome: 'Redesign dashboard principal', status: '⏳' },
        { nome: 'Melhorar mobile responsiveness', status: '⏳' },
        { nome: 'Otimizar fluxo de assinatura', status: '⏳' },
        { nome: 'A/B testing de novos flows', status: '⏳' }
      ]
    },
    {
      id: 2,
      titulo: 'Advanced Analytics',
      descricao: 'Expandir analytics e criar dashboards avançados para usuários e admin',
      status: 'PENDENTE',
      progresso: 0,
      prioridade: 'ALTA',
      assignee: 'Data Team',
      subtarefas: [
        { nome: 'Implementar custom events tracking', status: '⏳' },
        { nome: 'Dashboard de métricas de negócio', status: '⏳' },
        { nome: 'Relatórios exportáveis em PDF/CSV', status: '⏳' }
      ]
    },
    {
      id: 3,
      titulo: 'Caching & CDN Optimization',
      descricao: 'Otimizar estratégia de cache e distribuição global via CDN',
      status: 'PENDENTE',
      progresso: 0,
      prioridade: 'ALTA',
      assignee: 'DevOps Team',
      subtarefas: [
        { nome: 'Redis cache tuning (segmentação por região)', status: '⏳' },
        { nome: 'CDN cache headers optimization', status: '⏳' },
        { nome: 'Asset compression strategy', status: '⏳' }
      ]
    },
    {
      id: 4,
      titulo: 'User Testing & Validation',
      descricao: 'Realizar testes com usuários reais e validar melhorias implementadas',
      status: 'PENDENTE',
      progresso: 0,
      prioridade: 'MÉDIA',
      assignee: 'QA Team',
      subtarefas: [
        { nome: 'Focus groups com 50+ usuários', status: '⏳' },
        { nome: 'Coleta de NPS (Net Promoter Score)', status: '⏳' },
        { nome: 'Validação de performance melhorado', status: '⏳' }
      ]
    },
    {
      id: 5,
      titulo: 'Documentation & Runbooks v2',
      descricao: 'Atualizar documentação com novos features e melhorias',
      status: 'PENDENTE',
      progresso: 0,
      prioridade: 'MÉDIA',
      assignee: 'Docs Team',
      subtarefas: [
        { nome: 'Guia de features avançadas', status: '⏳' },
        { nome: 'Video tutorials para novos flows', status: '⏳' }
      ]
    }
  ];

  const kpisTarget = [
    { metrica: 'User Satisfaction', target: '>4.8/5', atual: '4.7/5', status: '⏳' },
    { metrica: 'P99 Latência', target: '<2ms', atual: '2.3ms (antes)', status: '📊' },
    { metrica: 'Cache Hit Ratio', target: '>85%', atual: '87.8%', status: '✅' },
    { metrica: 'Feature Adoption', target: '>60%', atual: '45%', status: '⏳' }
  ];

  const totalTarefas = tarefasFase2.length;
  const tarefasCompletas = tarefasFase2.filter(t => t.status === 'COMPLETO').length;
  const tarefasEmAndamento = tarefasFase2.filter(t => t.status === 'EM_ANDAMENTO').length;
  const percentualCompleto = Math.round((tarefasCompletas / totalTarefas) * 100);
  const progressoMedio = Math.round(tarefasFase2.reduce((sum, t) => sum + t.progresso, 0) / totalTarefas);

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
        
        {/* FECHAMENTO FASE 1 */}
        <section className={`p-6 rounded-lg border-2 ${isDark ? 'bg-green-900/20 border-green-600' : 'bg-green-50 border-green-600'}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                FASE 1: ESTABILIZAÇÃO - ✅ CONCLUÍDA
              </h2>
              <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Período: 05/05/2026 - 19/05/2026 (2 semanas)
              </p>
            </div>
            <Badge className="bg-green-600">100% COMPLETO</Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div>
              <h3 className="font-bold mb-3">✅ Resultados Alcançados</h3>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-green-300' : 'text-green-800'}`}>
                {fase1Resultado.resultados.map((resultado, idx) => (
                  <li key={idx}>{resultado}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">📊 KPIs Atingidos</h3>
              <div className="space-y-3">
                {fase1Resultado.kpisAlcancados.map((kpi, idx) => (
                  <div key={idx} className={`p-2 rounded text-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex justify-between">
                      <span>{kpi.metrica}</span>
                      <span>{kpi.status}</span>
                    </div>
                    <p className="text-xs">Alvo: {kpi.alvo} | Atingido: {kpi.atingido}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* INICIALIZAÇÃO FASE 2 */}
        <section className={`p-6 rounded-lg border-l-4 ${isDark ? 'bg-purple-900/20 border-purple-600' : 'bg-purple-50 border-purple-600'}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-purple-600">ATIVO</Badge>
                <h2 className="text-2xl font-bold">{fase2Info.nome}</h2>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {fase2Info.descricao}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${getPrioridadeColor(fase2Info.prioridade)}`}>
                {fase2Info.prioridade}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {fase2Info.duracao}
              </p>
            </div>
          </div>
        </section>

        {/* PROGRESSO GERAL FASE 2 */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Progresso Geral - Fase 2
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
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Progresso Médio</p>
                  <p className="text-3xl font-bold text-purple-600">{progressoMedio}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* KPIs FASE 2 */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6" />
            KPIs de Otimização
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

        {/* TAREFAS FASE 2 */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" />
            Tarefas - Fase 2 Otimização
          </h2>
          <div className="space-y-4">
            {tarefasFase2.map((tarefa) => (
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
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* AÇÕES CRÍTICAS */}
        <section className={`p-6 rounded-lg border-l-4 ${isDark ? 'bg-orange-900/20 border-orange-600' : 'bg-orange-50 border-orange-600'}`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Ações Críticas - Próximos 7 Dias
          </h2>
          <ol className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <li className="flex gap-3">
              <span className="font-bold">1.</span>
              <span>Iniciar UX/UI improvements com base no feedback coletado na Fase 1</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">2.</span>
              <span>Implementar custom analytics tracking e criar dashboard de métricas de negócio</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">3.</span>
              <span>Otimizar estratégia de cache Redis segmentado por região geográfica</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">4.</span>
              <span>Recrutar 50+ usuários para focus groups e coleta de NPS durante a semana 2</span>
            </li>
          </ol>
        </section>

        {/* RESUMO EXECUTIVO */}
        <section className={`p-6 rounded-lg ${isDark ? 'bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-700' : 'bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-300'}`}>
          <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            📊 Resumo Executivo - Transição Fase 1→2
          </h2>
          <div className={`space-y-2 ${isDark ? 'text-purple-100' : 'text-purple-900'}`}>
            <p>
              <strong>Fase 1 (Estabilização):</strong> 100% completa ✅ | 6/6 tarefas | 99.99% uptime | 45 bugs corrigidos
            </p>
            <p>
              <strong>Fase 2 (Otimização):</strong> Iniciada 20/06 | 5 tarefas principais | 3 semanas | Foco: UX, Analytics, Performance
            </p>
            <p>
              <strong>Próximo Milestone:</strong> Completar Fase 2 até 10/07 e transicionar para Fase 3 (Roadmap v3.1)
            </p>
            <p>
              <strong>Status Geral do Projeto:</strong> Pós-launch em progresso | 2 de 4 fases completadas/em andamento | Trajetória verde ✅
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}