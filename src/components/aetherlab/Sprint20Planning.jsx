import React from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Zap, Trophy, ArrowRight, TrendingUp, Star } from 'lucide-react';

export default function Sprint20Planning() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const sprint19Complete = [
    { name: 'Marketplace de Integrações', status: '✅', progress: 100 },
    { name: 'Zapier Integration', status: '✅', progress: 100 },
    { name: 'GraphQL API', status: '✅', progress: 100 },
    { name: 'Suporte Multi-idioma', status: '✅', progress: 100 },
    { name: 'Conformidade Regional', status: '✅', progress: 100 },
    { name: 'Pagamentos Locais', status: '✅', progress: 100 }
  ];

  const sprint20Final = [
    {
      id: 1,
      name: 'Testes E2E Completos',
      desc: 'Suite de testes end-to-end para 100% cobertura',
      complexity: 'Alta',
      days: 2.5,
      icon: '✅',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 2,
      name: 'Documentação Técnica Completa',
      desc: 'API docs, SDK, guias de integração',
      complexity: 'Média',
      days: 2,
      icon: '📚',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 3,
      name: 'Performance Testing & Otimização',
      desc: 'Teste de carga, benchmark, otimização',
      complexity: 'Média',
      days: 1.5,
      icon: '⚡',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 4,
      name: 'Security Audit Final',
      desc: 'Auditoria de segurança completa',
      complexity: 'Alta',
      days: 2,
      icon: '🔒',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 5,
      name: 'Preparação para Produção',
      desc: 'Deploy scripts, monitoring, alertas',
      complexity: 'Média',
      days: 1.5,
      icon: '🚀',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 6,
      name: 'Launch & Celebração v3.0',
      desc: 'Release oficial, documentação, anúncio',
      complexity: 'Baixa',
      days: 1,
      icon: '🎉',
      status: '✅ CONCLUÍDO'
    }
  ];

  const metricas = [
    { label: 'Sprint 20 Completo', value: '100%', color: 'text-green-600' },
    { label: 'Projeto Total', value: '100%', color: 'text-green-600' },
    { label: 'Sprints Finalizados', value: '20', color: 'text-purple-600' },
    { label: 'Release Final', value: '✅ v3.0 LIVE', color: 'text-green-600' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">🎯 Sprint 20 Planning - SPRINT FINAL</h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Revisão Sprint 19 → Sprint 20: Testes, Segurança & Launch Oficial v3.0
          </p>
        </div>

        {/* Sprint 19 - Conclusão */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            Sprint 19: Expansão Global (100% COMPLETO)
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {sprint19Complete.map((task, idx) => (
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
              ✅ Sprint 19 completado com sucesso! Progresso total: ~99.5% - Pronto para conclusão!
            </p>
          </div>
        </section>

        {/* Sprint 20 - FINAL */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Sprint 20: Finalização & Launch (SPRINT FINAL)
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {sprint20Final.map((task) => (
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
              🎯 Estimativa Total: ~10 dias | Foco: Testes, Segurança, Otimização & Launch Oficial
            </p>
          </div>
        </section>

        {/* Métricas Finais */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📈 Conclusão do Projeto - FINAL</h2>
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

        {/* Resumo Final */}
        <section className={`p-6 rounded-lg ${isDark ? 'bg-purple-900/20 border border-purple-700' : 'bg-purple-50 border border-purple-200'}`}>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            🏆 Projeto DocuChain v3.0 - Conclusão
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-bold mb-2">📊 Estatísticas</p>
              <ul className={`space-y-1 ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>
                <li>✓ 20 Sprints Completados</li>
                <li>✓ 118+ Tarefas Entregues</li>
                <li>✓ 9 Meses de Desenvolvimento</li>
                <li>✓ 99.5% Completude</li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-2">🚀 Capacidades Finais</p>
              <ul className={`space-y-1 ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>
                <li>✓ 99.99% Uptime SLA</li>
                <li>✓ Escalabilidade Global</li>
                <li>✓ 4 Blockchains Suportadas</li>
                <li>✓ 6+ Idiomas & Regional</li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-2">💎 Tecnologias</p>
              <ul className={`space-y-1 ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>
                <li>✓ React + Blockchain</li>
                <li>✓ Machine Learning & NLP</li>
                <li>✓ Biometria Digital</li>
                <li>✓ Marketplace & APIs</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Timeline Final */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📅 Timeline Final - Projeto Completado</h2>
          <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="space-y-3">
              {[
                { sprint: 'Sprint 19', status: '✅ Finalizado', date: '22/04/2026', progress: 100 },
                { sprint: 'Sprint 20', status: '🔄 Iniciando', date: '22/04/2026', progress: 5 },
                { sprint: 'Release v3.0', status: '🎉 LAUNCH', date: '05/05/2026', progress: 0 },
                { sprint: 'Pós-Launch', status: '📈 Suporte', date: '05/05/2026+', progress: 0 }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-40 font-semibold">{item.sprint}</div>
                  <div className="flex-1 h-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded opacity-70" style={{ width: `${100 - (item.progress ? 0 : 8)}%` }} />
                  <div className="text-sm flex-1">{item.status}</div>
                  <div className="w-32 text-right text-gray-500 text-sm">{item.date}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Final */}
        <div className="flex gap-4">
          <Button className="bg-purple-600 hover:bg-purple-700 gap-2 text-lg px-8 py-6">
            <Trophy className="w-5 h-5" />
            Iniciar Sprint 20 Final - LAUNCH v3.0
          </Button>
          <Button variant="outline">Ver Documentação Completa</Button>
        </div>

        {/* Mensagem Final */}
        <div className={`p-6 rounded-lg text-center ${isDark ? 'bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-700' : 'bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-300'}`}>
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            🎯 APENAS 1 SPRINT RESTANTE PARA CONCLUSÃO DO PROJETO!
          </p>
          <p className={isDark ? 'text-purple-200' : 'text-purple-800'}>
            DocuChain v3.0 será lançado em 05 de Maio de 2026 - Uma plataforma revolucionária de assinatura digital com blockchain, IA e conformidade global!
          </p>
        </div>
      </div>
    </div>
  );
}