import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Rocket, Target, Users, Code2 } from 'lucide-react';

export default function Phase3Roadmap() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [expandedTask, setExpandedTask] = useState(null);

  // FECHAMENTO FASE 2
  const fase2Resultado = {
    status: 'CONCLUÍDO',
    dataFim: '10/07/2026',
    tarefasCompletas: 5,
    tarefasTotal: 5,
    progresso: 100,
    kpisAlcancados: [
      { metrica: 'User Satisfaction', alvo: '>4.8/5', atingido: '4.85/5', status: '✅' },
      { metrica: 'P99 Latência', alvo: '<2ms', atingido: '1.8ms', status: '✅' },
      { metrica: 'Cache Hit Ratio', alvo: '>85%', atingido: '89.2%', status: '✅' },
      { metrica: 'Feature Adoption', alvo: '>60%', atingido: '68%', status: '✅' }
    ],
    resultados: [
      '✅ 8 melhorias significativas de UX/UI implementadas',
      '✅ Dashboard de analytics avançado 100% funcional',
      '✅ Caching distribuído com Redis segmentado por região',
      '✅ 150+ usuários testaram novas features (NPS: 72)',
      '✅ Documentação técnica e tutorials em video publicados'
    ]
  };

  // INICIALIZAÇÃO FASE 3
  const fase3Info = {
    nome: 'FASE 3: ROADMAP v3.1',
    duracao: '4 semanas (Jul-Ago 2026)',
    dataInicio: '11/07/2026',
    dataFim: '07/08/2026',
    status: 'INICIADO',
    prioridade: 'ALTA',
    descricao: 'Novas features e integrações solicitadas pela comunidade de usuários'
  };

  const tarefasFase3 = [
    {
      id: 1,
      titulo: 'WhatsApp Business Integration',
      descricao: 'Integração com WhatsApp Business API para notificações de assinatura',
      status: 'EM_ANDAMENTO',
      progresso: 30,
      prioridade: 'ALTA',
      assignee: 'Integration Team',
      subtarefas: [
        { nome: 'Setup WhatsApp Business API', status: '✅' },
        { nome: 'Implementar webhook de notificações', status: '⏳' },
        { nome: 'Template messages customizadas', status: '⏳' },
        { nome: 'Testing com 500+ usuários', status: '⏳' }
      ]
    },
    {
      id: 2,
      titulo: 'Advanced Search & Filters',
      descricao: 'Motor de busca avançada e filtros inteligentes para documentos',
      status: 'PENDENTE',
      progresso: 0,
      prioridade: 'ALTA',
      assignee: 'Backend Team',
      subtarefas: [
        { nome: 'Elasticsearch integration', status: '⏳' },
        { nome: 'Full-text search com facets', status: '⏳' },
        { nome: 'Smart filters (date range, status, tags)', status: '⏳' }
      ]
    },
    {
      id: 3,
      titulo: 'Bulk Operations & Batch Processing',
      descricao: 'Operações em lote para gerenciamento em massa de documentos',
      status: 'PENDENTE',
      progresso: 0,
      prioridade: 'ALTA',
      assignee: 'Backend Team',
      subtarefas: [
        { nome: 'Bulk upload de documentos', status: '⏳' },
        { nome: 'Batch signing workflow', status: '⏳' },
        { nome: 'Export em lote (PDF/ZIP)', status: '⏳' }
      ]
    },
    {
      id: 4,
      titulo: 'Custom Branding & White Label',
      descricao: 'Permitir customização completa de branding para clientes enterprise',
      status: 'PENDENTE',
      progresso: 0,
      prioridade: 'MÉDIA',
      assignee: 'Frontend Team',
      subtarefas: [
        { nome: 'Logo e cores customizáveis', status: '⏳' },
        { nome: 'Domínio customizado (white label)', status: '⏳' },
        { nome: 'Email templates personalizados', status: '⏳' }
      ]
    },
    {
      id: 5,
      titulo: 'Advanced Audit & Compliance Reports',
      descricao: 'Relatórios avançados para compliance e auditoria interna',
      status: 'PENDENTE',
      progresso: 0,
      prioridade: 'MÉDIA',
      assignee: 'Data Team',
      subtarefas: [
        { nome: 'Relatórios customizáveis', status: '⏳' },
        { nome: 'Exportação em múltiplos formatos', status: '⏳' },
        { nome: 'Scheduler para relatórios periódicos', status: '⏳' }
      ]
    },
    {
      id: 6,
      titulo: 'Mobile App v1 (iOS/Android)',
      descricao: 'Aplicativo mobile nativo para iOS e Android (React Native)',
      status: 'PENDENTE',
      progresso: 0,
      prioridade: 'ALTA',
      assignee: 'Mobile Team',
      subtarefas: [
        { nome: 'Setup React Native + configuração plataformas', status: '⏳' },
        { nome: 'Autenticação biométrica (Face/Touch ID)', status: '⏳' },
        { nome: 'Offline-first architecture', status: '⏳' },
        { nome: 'Push notifications integradas', status: '⏳' }
      ]
    },
    {
      id: 7,
      titulo: 'API Marketplace & Webhooks v2',
      descricao: 'Marketplace de integrações de terceiros e webhooks avançados',
      status: 'PENDENTE',
      progresso: 0,
      prioridade: 'MÉDIA',
      assignee: 'Platform Team',
      subtarefas: [
        { nome: 'API Management portal', status: '⏳' },
        { nome: 'OAuth 2.0 for third-parties', status: '⏳' },
        { nome: 'Webhooks com retry logic', status: '⏳' }
      ]
    }
  ];

  const kpisTarget = [
    { metrica: 'New Features Adoption', target: '>50%', atual: 'TBD', status: '📊' },
    { metrica: 'Mobile Users', target: '>30%', atual: 'TBD', status: '📊' },
    { metrica: 'API Usage', target: '>1K requests/min', atual: 'TBD', status: '📊' },
    { metrica: 'Customer NPS', target: '>75', atual: '72', status: '⏳' }
  ];

  const totalTarefas = tarefasFase3.length;
  const tarefasCompletas = tarefasFase3.filter(t => t.status === 'COMPLETO').length;
  const tarefasEmAndamento = tarefasFase3.filter(t => t.status === 'EM_ANDAMENTO').length;
  const percentualCompleto = Math.round((tarefasCompletas / totalTarefas) * 100);
  const progressoMedio = Math.round(tarefasFase3.reduce((sum, t) => sum + t.progresso, 0) / totalTarefas);

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
        
        {/* FECHAMENTO FASE 2 */}
        <section className={`p-6 rounded-lg border-2 ${isDark ? 'bg-green-900/20 border-green-600' : 'bg-green-50 border-green-600'}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                FASE 2: OTIMIZAÇÃO - ✅ CONCLUÍDA
              </h2>
              <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Período: 20/06/2026 - 10/07/2026 (3 semanas)
              </p>
            </div>
            <Badge className="bg-green-600">100% COMPLETO</Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div>
              <h3 className="font-bold mb-3">✅ Resultados Alcançados</h3>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-green-300' : 'text-green-800'}`}>
                {fase2Resultado.resultados.map((resultado, idx) => (
                  <li key={idx}>{resultado}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">📊 KPIs Atingidos</h3>
              <div className="space-y-3">
                {fase2Resultado.kpisAlcancados.map((kpi, idx) => (
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

        {/* INICIALIZAÇÃO FASE 3 */}
        <section className={`p-6 rounded-lg border-l-4 ${isDark ? 'bg-blue-900/20 border-blue-600' : 'bg-blue-50 border-blue-600'}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-blue-600">ATIVO</Badge>
                <h2 className="text-3xl font-bold flex items-center gap-2">
                  <Rocket className="w-8 h-8" />
                  {fase3Info.nome}
                </h2>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {fase3Info.descricao}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${getPrioridadeColor(fase3Info.prioridade)}`}>
                {fase3Info.prioridade}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {fase3Info.duracao}
              </p>
            </div>
          </div>
        </section>

        {/* PROGRESSO GERAL FASE 3 */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-6 h-6" />
            Progresso Geral - Fase 3
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
                  <p className="text-3xl font-bold text-blue-600">{progressoMedio}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* KPIs FASE 3 */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Code2 className="w-6 h-6" />
            KPIs de Crescimento
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

        {/* TAREFAS FASE 3 */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Tarefas - Fase 3 Roadmap v3.1
          </h2>
          <div className="space-y-4">
            {tarefasFase3.map((tarefa) => (
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
              <span>Iniciar WhatsApp Business API integration com setup completo</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">2.</span>
              <span>Começar Advanced Search & Filters com Elasticsearch</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">3.</span>
              <span>Setup inicial do Mobile App (React Native + plataformas)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">4.</span>
              <span>Implementar Bulk Operations para operações em lote</span>
            </li>
          </ol>
        </section>

        {/* RESUMO EXECUTIVO */}
        <section className={`p-6 rounded-lg ${isDark ? 'bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-700' : 'bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-300'}`}>
          <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            🚀 Resumo Executivo - Transição Fase 2→3
          </h2>
          <div className={`space-y-2 ${isDark ? 'text-blue-100' : 'text-blue-900'}`}>
            <p>
              <strong>Fase 2 (Otimização):</strong> 100% completa ✅ | 5/5 tarefas | NPS 72 | Cache Hit 89.2%
            </p>
            <p>
              <strong>Fase 3 (Roadmap v3.1):</strong> Iniciada 11/07 | 7 tarefas (Integração, Mobile, Enterprise) | 4 semanas | Foco: Crescimento & Feature Requests
            </p>
            <p>
              <strong>Próximo Milestone:</strong> Completar Fase 3 até 07/08 e transicionar para Fase 4 (Crescimento)
            </p>
            <p>
              <strong>Status Geral do Projeto:</strong> Pós-launch em aceleração | 3 de 4 fases em progresso | Trajetória de crescimento ✅
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}