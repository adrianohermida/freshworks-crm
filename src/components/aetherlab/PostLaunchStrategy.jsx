import React from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Zap, Bug, BarChart3, Users, Lightbulb } from 'lucide-react';

export default function PostLaunchStrategy() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const postLaunchPhases = [
    {
      id: 1,
      nome: 'Fase 1: Estabilização (Mai 2026)',
      desc: 'Monitoramento intensivo e correção de bugs críticos',
      tarefas: ['Bug fixes prioritários', 'Performance tuning', 'Feedback dos usuários', 'Hotfixes'],
      duracao: '2 semanas',
      prioridade: 'CRÍTICA',
      icon: '🔧'
    },
    {
      id: 2,
      nome: 'Fase 2: Otimização (Jun 2026)',
      desc: 'Melhorias de performance e UX baseadas em feedback',
      tarefas: ['UX improvements', 'Performance optimization', 'Analytics refinement', 'User testing'],
      duracao: '3 semanas',
      prioridade: 'ALTA',
      icon: '⚡'
    },
    {
      id: 3,
      nome: 'Fase 3: Roadmap v3.1 (Jul 2026)',
      desc: 'Novas features baseadas em feedback de usuários',
      tarefas: ['Feature requests analysis', 'Roadmap v3.1 planning', 'MVP definition', 'Sprint planning'],
      duracao: '2 semanas',
      prioridade: 'ALTA',
      icon: '🚀'
    },
    {
      id: 4,
      nome: 'Fase 4: Crescimento (A partir de Ago 2026)',
      desc: 'Expansão de mercado e novas integrações',
      tarefas: ['Market expansion', 'Partner integrations', 'Enterprise features', 'Regional customization'],
      duracao: 'Contínuo',
      prioridade: 'MÉDIA',
      icon: '📈'
    }
  ];

  const kpis = [
    { metrica: 'Uptime', alvo: '99.99%', atual: '99.99%', status: '✅' },
    { metrica: 'User Growth', alvo: '+50%/mês', atual: '+8%', status: '⏳' },
    { metrica: 'Bug Fix Time', alvo: '<4h', atual: '2.1h', status: '✅' },
    { metrica: 'Customer Satisfaction', alvo: '>4.8/5', atual: '4.7/5', status: '⏳' }
  ];

  const supportActivities = [
    { nome: 'Customer Support 24/7', desc: 'Suporte em português, inglês e espanhol', icon: '👥' },
    { nome: 'Bug Reporting System', desc: 'Sistema integrado para relatar bugs', icon: '🐛' },
    { nome: 'Feature Requests', desc: 'Gerenciamento de solicitações de features', icon: '💡' },
    { nome: 'Documentation Updates', desc: 'Manutenção e atualização de documentação', icon: '📚' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">📋 Estratégia Pós-Launch DocuChain v3.0</h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Plano de manutenção, otimização e crescimento contínuo após o lançamento oficial
          </p>
        </div>

        {/* Status Atual */}
        <section className={`p-6 rounded-lg ${isDark ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Badge className="bg-green-600">LIVE</Badge>
            Status Atual: v3.0 em Produção
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-800'}`}>Versão Atual</p>
              <p className="text-2xl font-bold">v3.0.0</p>
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-800'}`}>Data Launch</p>
              <p className="text-2xl font-bold">05/05/2026</p>
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-800'}`}>Uptime</p>
              <p className="text-2xl font-bold">99.99%</p>
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-800'}`}>Usuários Ativos</p>
              <p className="text-2xl font-bold">1.2K+</p>
            </div>
          </div>
        </section>

        {/* Fases Pós-Launch */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            4 Fases do Plano Pós-Launch
          </h2>
          
          <div className="space-y-4">
            {postLaunchPhases.map((fase) => (
              <Card key={fase.id} className={isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{fase.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{fase.nome}</CardTitle>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{fase.desc}</p>
                      </div>
                    </div>
                    <Badge 
                      className={
                        fase.prioridade === 'CRÍTICA' ? 'bg-red-600' :
                        fase.prioridade === 'ALTA' ? 'bg-orange-600' : 'bg-blue-600'
                      }
                    >
                      {fase.prioridade}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="font-semibold text-sm mb-2">Tarefas Principais:</p>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {fase.tarefas.map((tarefa, idx) => (
                        <li key={idx} className={`text-sm flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          ✓ {tarefa}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className={`text-xs font-semibold ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    ⏱️ Duração estimada: {fase.duracao}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* KPIs de Monitoramento */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            KPIs de Monitoramento Contínuo
          </h2>
          
          <div className="grid md:grid-cols-4 gap-4">
            {kpis.map((kpi, idx) => (
              <Card key={idx} className={isDark ? 'bg-gray-800' : ''}>
                <CardContent className="pt-6">
                  <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{kpi.metrica}</p>
                  <div className="mb-3">
                    <p className="text-lg font-bold">{kpi.atual}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Alvo: {kpi.alvo}</p>
                  </div>
                  <div className="text-right text-xl">{kpi.status}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Atividades de Suporte */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Atividades de Suporte Contínuo
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {supportActivities.map((activity, idx) => (
              <Card key={idx} className={isDark ? 'bg-gray-800' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{activity.icon}</span>
                    <div>
                      <h3 className="font-bold">{activity.nome}</h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {activity.desc}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Roadmap Futuro */}
        <section className={`p-6 rounded-lg ${isDark ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lightbulb className="w-6 h-6" />
            Roadmap Futuro: v3.1+ e v4.0
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-3">DocuChain v3.1 (Q3 2026)</h3>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                <li>✓ Dashboard analytics avançado</li>
                <li>✓ Automação de workflows mais potente</li>
                <li>✓ Novas integrações (Slack, Teams)</li>
                <li>✓ Suporte a mais de 10 idiomas</li>
                <li>✓ Machine Learning otimizado</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">DocuChain v4.0 (Q1 2027)</h3>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                <li>✓ Web3 integration completa</li>
                <li>✓ NFT document certificates</li>
                <li>✓ DAO governance</li>
                <li>✓ Marketplace de templates v2</li>
                <li>✓ Enterprise white-label</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Próximas Ações */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📌 Próximas Ações Imediatas</h2>
          
          <div className={`p-4 rounded border-l-4 ${isDark ? 'bg-gray-800 border-orange-600' : 'bg-orange-50 border-orange-600'}`}>
            <h3 className="font-bold mb-3">Semana 1-2 (Mai 2026) - Fase 1: Estabilização</h3>
            <ol className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>1. Monitorar erros em tempo real</li>
              <li>2. Responder rapidamente a bugs críticos</li>
              <li>3. Recolher feedback dos usuários</li>
              <li>4. Publicar hotfixes conforme necessário</li>
              <li>5. Atualizar documentação</li>
            </ol>
          </div>
        </section>

        {/* Conclusão */}
        <div className={`p-6 rounded-lg text-center ${isDark ? 'bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-700' : 'bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-300'}`}>
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ✨ DocuChain v3.0 - Jornada em Progresso
          </h2>
          <p className={isDark ? 'text-purple-200' : 'text-purple-800'}>
            O projeto foi entregue com sucesso! Agora focamos em estabilização, otimização e crescimento contínuo.
            O ciclo de desenvolvimento continua com melhorias iterativas baseadas em feedback dos usuários.
          </p>
        </div>
      </div>
    </div>
  );
}