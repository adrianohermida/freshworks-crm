import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, AlertCircle, ArrowRight, Zap, Target } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Sprint16Planning() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const sprint15Tasks = [
    { name: 'Templates Avançado', status: '✅', progress: 100 },
    { name: 'Coleta Digital com Prova', status: '✅', progress: 100 },
    { name: 'Notificações Eletrônicas', status: '✅', progress: 100 },
    { name: 'Webhooks Avançado', status: '✅', progress: 100 },
    { name: 'Observatório Nacional', status: '✅', progress: 100 },
    { name: 'Analytics Avançado', status: '✅', progress: 100 }
  ];

  const sprint16Roadmap = [
    {
      id: 1,
      name: 'Integração com CNPQ e Lattes',
      desc: 'Consulta de dados acadêmicos e de pesquisa',
      complexity: 'Média',
      days: 1.5,
      icon: '🎓',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 2,
      name: 'Sistema de Backup Automático com Blockchain',
      desc: 'Backups criptografados e verificáveis',
      complexity: 'Alta',
      days: 2,
      icon: '💾',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 3,
      name: 'Machine Learning - Classificação Automática',
      desc: 'IA para categorizar documentos automaticamente',
      complexity: 'Alta',
      days: 2.5,
      icon: '🤖',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 4,
      name: 'Mobile App Native (React Native)',
      desc: 'Aplicativo para iOS e Android',
      complexity: 'Alta',
      days: 3,
      icon: '📱',
      status: '⏳ AGENDADO'
    },
    {
      id: 5,
      name: 'Sistema de Pagamentos com Stripe',
      desc: 'Checkout seguro e gestão de planos',
      complexity: 'Média',
      days: 2,
      icon: '💳',
      status: '⏳ AGENDADO'
    },
    {
      id: 6,
      name: 'Dashboard Executivo Real-time',
      desc: 'KPIs em tempo real com WebSocket',
      complexity: 'Média',
      days: 1.5,
      icon: '📊',
      status: '⏳ AGENDADO'
    }
  ];

  const roadmapFuturo = [
    {
      sprintNumber: 17,
      titulo: 'Integração IA Avançada',
      tarefas: ['Análise Preditiva', 'Processamento NLP', 'Assinatura Biométrica'],
      diasEstimados: 12
    },
    {
      sprintNumber: 18,
      titulo: 'Escalabilidade & Performance',
      tarefas: ['Sharding de Dados', 'CDN Global', 'Cache Distribuído'],
      diasEstimados: 14
    },
    {
      sprintNumber: 19,
      titulo: 'Marketplace & Integrações',
      tarefas: ['App Store Interno', 'Zapier Integration', 'GraphQL API'],
      diasEstimados: 16
    },
    {
      sprintNumber: 20,
      titulo: 'Expansão Internacional',
      tarefas: ['Suporte Multi-idioma', 'Conformidade Regional', 'Pagamentos Locais'],
      diasEstimados: 12
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">🎯 Sprint 16 Planning</h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Revisão Sprint 15 → Roadmap Sprint 16-20: Integrações & Escalabilidade
          </p>
        </div>

        {/* Sprint 15 - Conclusão */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            Sprint 15: Coletas & Analytics (100% COMPLETO)
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {sprint15Tasks.map((task, idx) => (
              <Card key={idx} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{task.name}</span>
                    <Badge className="bg-green-600 text-xs">{task.status}</Badge>
                  </div>
                  <div className="w-full bg-gray-300 h-2 rounded">
                    <div className="bg-green-500 h-2 rounded" style={{ width: '100%' }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className={`p-4 rounded-lg ${isDark ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
            <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-800'}`}>
              ✅ Sprint 15 completado! Progresso total do projeto: ~91%
            </p>
          </div>
        </section>

        {/* Sprint 16 - Roadmap */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Sprint 16: Integrações & IA (Iniciando)
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {sprint16Roadmap.map((task) => (
              <Card key={task.id} className={isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{task.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{task.name}</CardTitle>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {task.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge 
                      className={task.complexity === 'Alta' ? 'bg-red-600' : task.complexity === 'Média' ? 'bg-yellow-600' : 'bg-green-600'}
                    >
                      {task.complexity}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {task.status.includes('EM EXECUÇÃO') && <Badge className="bg-blue-600">{task.status}</Badge>}
                      {task.status.includes('AGENDADO') && <Badge className="bg-gray-600">{task.status}</Badge>}
                      <span className="text-sm text-gray-500">⏱️ {task.days} dias</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              📊 Estimativa Total: ~12.5 dias | Foco: Integrações acadêmicas, Backup blockchain & IA
            </p>
          </div>
        </section>

        {/* Future Roadmap */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-500" />
            Roadmap 2026 (Sprints 17-20)
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {roadmapFuturo.map((sprint) => (
              <Card key={sprint.sprintNumber} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Sprint {sprint.sprintNumber}: {sprint.titulo}</span>
                    <Badge className="bg-purple-600">~{sprint.diasEstimados}d</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {sprint.tarefas.map((tarefa, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <span className="text-purple-500">•</span>
                        {tarefa}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Timeline Visual */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📅 Timeline Geral</h2>
          <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="space-y-4">
              {[
                { sprint: 'Sprint 15', status: '✅ Finalizado', date: '03/03/2026', progress: 100 },
                { sprint: 'Sprint 16', status: '🔄 Iniciando', date: '03/03/2026', progress: 0 },
                { sprint: 'Sprint 17', status: '⏳ Planejado', date: '20/03/2026', progress: 0 },
                { sprint: 'Sprint 18', status: '⏳ Planejado', date: '03/04/2026', progress: 0 },
                { sprint: 'Sprint 19', status: '⏳ Planejado', date: '20/04/2026', progress: 0 },
                { sprint: 'Sprint 20', status: '⏳ Planejado', date: '05/05/2026', progress: 0 }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-32 font-semibold">{item.sprint}</div>
                  <div className="flex-1 h-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded opacity-70" style={{ width: `${100 - (item.progress ? 0 : 10)}%` }} />
                  <div className="text-sm flex-1">{item.status}</div>
                  <div className="w-32 text-right text-gray-500 text-sm">{item.date}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Métricas do Projeto */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📈 Visão Geral do Projeto</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: 'Completude Atual', value: '91%', color: 'bg-green-600' },
              { label: 'Sprints Finalizados', value: '15', color: 'bg-blue-600' },
              { label: 'Tarefas Concluídas', value: '85+', color: 'bg-purple-600' },
              { label: 'Próxima Release', value: 'v2.0', color: 'bg-orange-600' }
            ].map((metric, idx) => (
              <Card key={idx} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="pt-6 text-center">
                  <p className={`text-3xl font-bold ${metric.color.replace('bg-', 'text-')}`}>
                    {metric.value}
                  </p>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    {metric.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="flex gap-4">
          <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
            <ArrowRight className="w-4 h-4" />
            Iniciar Sprint 16 Agora
          </Button>
          <Button variant="outline">Ver Documentação Completa</Button>
        </div>
      </div>
    </div>
  );
}