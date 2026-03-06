import React from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Zap, Target, ArrowRight, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Sprint17Planning() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const sprint16Complete = [
    { name: 'CNPQ/Lattes', status: '✅', progress: 100 },
    { name: 'Backup Blockchain', status: '✅', progress: 100 },
    { name: 'ML Classificação', status: '✅', progress: 100 }
  ];

  const sprint17Roadmap = [
    {
      id: 1,
      name: 'Mobile App React Native',
      desc: 'Aplicativo iOS/Android com sincronização offline',
      complexity: 'Alta',
      days: 3.5,
      icon: '📱',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 2,
      name: 'Integração Stripe Payments',
      desc: 'Checkout seguro e gestão de assinaturas',
      complexity: 'Média',
      days: 2,
      icon: '💳',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 3,
      name: 'Dashboard Executivo Real-time',
      desc: 'KPIs em tempo real com WebSocket',
      complexity: 'Média',
      days: 1.5,
      icon: '📊',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 4,
      name: 'Análise Preditiva com IA',
      desc: 'Forecasting de tendências e alertas automáticos',
      complexity: 'Alta',
      days: 2.5,
      icon: '🔮',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 5,
      name: 'NLP - Análise de Sentimentos',
      desc: 'Processamento de linguagem natural para documentos',
      complexity: 'Alta',
      days: 2.5,
      icon: '🧠',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 6,
      name: 'Assinatura Biométrica',
      desc: 'Reconhecimento facial e verificação de identidade',
      complexity: 'Alta',
      days: 3,
      icon: '👤',
      status: '✅ CONCLUÍDO'
    }
  ];

  const metricas = [
    { label: 'Sprint 16 Completo', value: '100%', color: 'text-green-600' },
    { label: 'Projeto Total', value: '94%', color: 'text-blue-600' },
    { label: 'Sprints Finalizados', value: '16', color: 'text-purple-600' },
    { label: 'Próxima Release', value: 'v2.2', color: 'text-orange-600' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">🎯 Sprint 17 Planning</h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Revisão Sprint 16 → Roadmap Sprint 17: Mobile & IA Avançada
          </p>
        </div>

        {/* Sprint 16 - Conclusão */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            Sprint 16: Integrações (100% COMPLETO)
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {sprint16Complete.map((task, idx) => (
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
              ✅ Sprint 16 completado! Progresso total do projeto: ~94%
            </p>
          </div>
        </section>

        {/* Sprint 17 - Roadmap */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Sprint 17: Mobile & IA Avançada (Iniciando)
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {sprint17Roadmap.map((task) => (
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
              📊 Estimativa Total: ~15 dias | Foco: Mobile nativo, Pagamentos & IA avançada (Preditiva, NLP, Biometria)
            </p>
          </div>
        </section>

        {/* Métricas do Projeto */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📈 Visão Geral do Projeto</h2>
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

        {/* Timeline */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📅 Timeline Atualizada</h2>
          <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="space-y-3">
              {[
                { sprint: 'Sprint 16', status: '✅ Finalizado', date: '10/03/2026', progress: 100 },
                { sprint: 'Sprint 17', status: '🔄 Iniciando', date: '10/03/2026', progress: 5 },
                { sprint: 'Sprint 18', status: '⏳ Planejado', date: '01/04/2026', progress: 0 },
                { sprint: 'Sprint 19', status: '⏳ Planejado', date: '20/04/2026', progress: 0 },
                { sprint: 'Sprint 20', status: '⏳ Planejado', date: '08/05/2026', progress: 0 }
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

        {/* Next Steps */}
        <div className="flex gap-4">
          <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
            <ArrowRight className="w-4 h-4" />
            Iniciar Sprint 17 Agora
          </Button>
          <Button variant="outline">Ver Documentação</Button>
        </div>
      </div>
    </div>
  );
}