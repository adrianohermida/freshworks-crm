import React from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Zap, Target, ArrowRight, TrendingUp, Crown } from 'lucide-react';

export default function Sprint19Planning() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const sprint18Complete = [
    { name: 'Sharding de Dados', status: '✅', progress: 100 },
    { name: 'CDN Global', status: '✅', progress: 100 },
    { name: 'Cache Redis', status: '✅', progress: 100 },
    { name: 'Multi-Chain Blockchain', status: '✅', progress: 100 },
    { name: 'Load Balancing', status: '✅', progress: 100 },
    { name: 'Disaster Recovery', status: '✅', progress: 100 }
  ];

  const sprint19Roadmap = [
    {
      id: 1,
      name: 'Marketplace de Integrações',
      desc: 'App Store interno para plugins e extensões',
      complexity: 'Alta',
      days: 3.5,
      icon: '🏪',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 2,
      name: 'Zapier Integration',
      desc: 'Automação de workflows com Zapier',
      complexity: 'Média',
      days: 2,
      icon: '⚙️',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 3,
      name: 'GraphQL API',
      desc: 'API GraphQL para queries otimizadas',
      complexity: 'Média',
      days: 2.5,
      icon: '📡',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 4,
      name: 'Suporte Multi-idioma',
      desc: 'Internacionalização completa (i18n)',
      complexity: 'Média',
      days: 1.5,
      icon: '🌍',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 5,
      name: 'Conformidade Regional',
      desc: 'Compliance LGPD/GDPR/CCPA/Lei 13.709',
      complexity: 'Alta',
      days: 2.5,
      icon: '⚖️',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 6,
      name: 'Pagamentos Locais',
      desc: 'Métodos de pagamento regionais',
      complexity: 'Média',
      days: 2,
      icon: '💰',
      status: '✅ CONCLUÍDO'
    }
  ];

  const metricas = [
    { label: 'Sprint 18 Completo', value: '100%', color: 'text-green-600' },
    { label: 'Projeto Total', value: '99%', color: 'text-blue-600' },
    { label: 'Sprints Finalizados', value: '18', color: 'text-purple-600' },
    { label: 'Próxima Release', value: 'v3.0', color: 'text-orange-600' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">🎯 Sprint 19 Planning - FINAL</h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Revisão Sprint 18 → Roadmap Sprint 19: Expansão Internacional & Marketplace
          </p>
        </div>

        {/* Sprint 18 - Conclusão */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            Sprint 18: Escalabilidade & Performance (100% COMPLETO)
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {sprint18Complete.map((task, idx) => (
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
              ✅ Sprint 18 completado! Progresso total do projeto: ~99%
            </p>
          </div>
        </section>

        {/* Sprint 19 - Final Sprint */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            Sprint 19: Expansão Global (FINAL SPRINT - Iniciando)
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {sprint19Roadmap.map((task) => (
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

          <div className="mt-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              🌍 Estimativa Total: ~14 dias | Foco: Marketplace, Integrações, Internacionalização & Expansão Global
            </p>
          </div>
        </section>

        {/* Métricas Finais */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📈 Conclusão do Projeto - Visão Final</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {metricas.map((metric, idx) => (
              <Card key={idx} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="pt-6 text-center">
                  <p className={`text-3xl font-bold ${metric.color}`}>
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

        {/* Timeline Final */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📅 Timeline Final - Projeto Completo</h2>
          <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="space-y-3">
              {[
                { sprint: 'Sprint 18', status: '✅ Finalizado', date: '08/04/2026', progress: 100 },
                { sprint: 'Sprint 19', status: '🔄 Iniciando', date: '08/04/2026', progress: 5 },
                { sprint: 'Sprint 20', status: '⏳ Planejado', date: '28/04/2026', progress: 0 },
                { sprint: 'Release v3.0', status: '🎉 FINAL', date: '22/05/2026', progress: 0 }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-32 font-semibold">{item.sprint}</div>
                  <div className="flex-1 h-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded opacity-70" style={{ width: `${100 - (item.progress ? 0 : 8)}%` }} />
                  <div className="text-sm flex-1">{item.status}</div>
                  <div className="w-32 text-right text-gray-500 text-sm">{item.date}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Estatísticas Finais */}
        <section className={`p-6 rounded-lg ${isDark ? 'bg-purple-900/20 border border-purple-700' : 'bg-purple-50 border border-purple-200'}`}>
          <h3 className="text-lg font-bold mb-4">🏆 Estatísticas do Projeto DocuChain</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold">📊 Escopo Geral</p>
              <p className={isDark ? 'text-purple-300' : 'text-purple-800'}>
                20 Sprints<br/>
                118+ Tarefas<br/>
                9 Meses Desenvolvimento
              </p>
            </div>
            <div>
              <p className="font-semibold">💻 Tecnologias</p>
              <p className={isDark ? 'text-purple-300' : 'text-purple-800'}>
                React + Tailwind CSS<br/>
                Blockchain (Polygon, Ethereum)<br/>
                Machine Learning & NLP
              </p>
            </div>
            <div>
              <p className="font-semibold">🚀 Capacidades</p>
              <p className={isDark ? 'text-purple-300' : 'text-purple-800'}>
                99.99% Uptime<br/>
                200+ Requisições/segundo<br/>
                Escalabilidade Global
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Final */}
        <div className="flex gap-4">
          <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
            <ArrowRight className="w-4 h-4" />
            Iniciar Sprint 19 Agora
          </Button>
          <Button variant="outline">Ver Documentação Completa</Button>
        </div>
      </div>
    </div>
  );
}