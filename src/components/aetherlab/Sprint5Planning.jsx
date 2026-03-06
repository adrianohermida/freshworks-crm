import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Globe, Zap, Clock, Target, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function Sprint5Planning() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const tasks = [
    {
      id: 1,
      title: 'i18n & Localização (5 idiomas + RTL)',
      complexity: 'ALTA',
      days: 21,
      status: 'PLANEJADO',
      subtasks: ['PT-BR + EN-US + ES-ES + FR-FR + AR (RTL)', 'Dynamic locale switching', 'Date/Time/Currency formatting', 'RTL layout support'],
      impact: '🔴 CRÍTICO - Bloqueador para regional expansion'
    },
    {
      id: 2,
      title: 'Conformidade Regional (eIDAS/ESIGN/Marcos)',
      complexity: 'ALTA',
      days: 21,
      status: 'PLANEJADO',
      subtasks: ['eIDAS (EU) - Framework jurídico', 'ESIGN (EUA) - Federal compliance', 'Lei Marcos Brasil (CNJ integration)', 'Regional compliance dashboard'],
      impact: '🔴 CRÍTICO - Validade legal multi-região'
    },
    {
      id: 3,
      title: 'Multi-Region Deployment (6 regiões)',
      complexity: 'ALTA',
      days: 28,
      status: 'PLANEJADO',
      subtasks: ['US-EAST (USA)', 'EU-WEST (Europa)', 'SA-NORTH (Brasil)', 'APAC-SOUTH (Ásia)', 'CDN global', 'Data residency isolation'],
      impact: '🔴 CRÍTICO - Infraestrutura global'
    },
    {
      id: 4,
      title: 'Suporte 24/7 Global Multilíngue',
      complexity: 'MÉDIA',
      days: 21,
      status: 'PLANEJADO',
      subtasks: ['Live chat em 5 idiomas', 'Help center localized', 'Email support regional', 'Chatbot IA multilíngue'],
      impact: '🟡 ALTO - Retenção de clientes'
    },
    {
      id: 5,
      title: 'Go-to-Market Regional (4 mercados)',
      complexity: 'ALTA',
      days: 21,
      status: 'PLANEJADO',
      subtasks: ['Marketplace integrations (Brasil)', 'EU pricing strategy', 'USA compliance marketing', 'Local partnerships'],
      impact: '🟡 ALTO - Aquisição de clientes'
    },
    {
      id: 6,
      title: 'Certificações Globais (SOC 2, ISO 27001)',
      complexity: 'MÉDIA',
      days: 42,
      status: 'PLANEJADO',
      subtasks: ['SOC 2 Type II audit', 'ISO 27001 certification', 'Compliance documentation', 'Third-party security review'],
      impact: '🟡 ALTO - Enterprise trust'
    },
    {
      id: 7,
      title: 'Enterprise Partnerships (Microsoft, Google)',
      complexity: 'ALTA',
      days: 28,
      status: 'PLANEJADO',
      subtasks: ['Microsoft 365 integration', 'Google Workspace sync', 'Enterprise sales enablement', 'Co-marketing strategy'],
      impact: '🟡 ALTO - Revenue enterprise'
    }
  ];

  const timeline = [
    { period: 'Semana 1-3', focus: '✅ i18n + Regional Compliance', status: 'AGORA' },
    { period: 'Semana 4-6', focus: '⏳ Multi-region setup + Go-to-Market', status: 'PRÓXIMO' },
    { period: 'Semana 7-10', focus: '⏳ Certificações + Partnerships', status: 'FINAL' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border-blue-700' : 'bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-400'}`}>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Globe className="w-10 h-10 text-blue-600" />
              🌍 SPRINT 5 - GLOBAL EXPANSION
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Data: 22/08/2026 → 01/11/2026 | Duração: 71 dias | 7 Tarefas Críticas
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className="bg-blue-600 px-4 py-2">🚀 KICKOFF</Badge>
              <Badge className="bg-orange-600 px-4 py-2">⏳ Status: PLANEJADO</Badge>
              <Badge className="bg-purple-600 px-4 py-2">📊 0% Completo</Badge>
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6" />
            ⏰ Timeline Sprint 5
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {timeline.map((item, idx) => (
              <Card key={idx} className={`${item.status === 'AGORA' ? (isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-400') : (isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200')} border-2`}>
                <CardContent className="pt-4">
                  <p className="font-bold text-lg mb-2">{item.period}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.focus}</p>
                  <Badge className={`mt-3 ${item.status === 'AGORA' ? 'bg-green-600' : 'bg-gray-600'}`}>
                    {item.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* TASKS ROADMAP */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Target className="w-6 h-6" />
            📋 7 Tarefas Críticas
          </h2>
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} className={`${isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-600">{task.id}</span>
                        {task.title}
                      </CardTitle>
                      <p className="text-xs mt-2 opacity-70">{task.impact}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        task.complexity === 'ALTA'
                          ? 'bg-red-600'
                          : 'bg-yellow-600'
                      }>
                        {task.complexity}
                      </Badge>
                      <p className="text-xs mt-2 font-semibold">{task.days} dias</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold mb-2">Subtarefas:</p>
                      <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {task.subtasks.map((st, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full" />
                            {st}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold">Progresso</span>
                        <span className="text-xs font-semibold">0%</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* PROJECT STATUS */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            📊 Status Consolidado - Projeto DocuChain
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle>Projeto Total (Fases 1-5)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Completude Geral</span>
                    <span className="text-xl font-bold text-blue-600">85%</span>
                  </div>
                  <Progress value={85} className="h-3" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-green-900/40' : 'bg-green-100'}`}>
                    <p className="text-xs font-semibold">Fases Completas</p>
                    <p className="text-2xl font-bold text-green-600">4/5</p>
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-900/40' : 'bg-blue-100'}`}>
                    <p className="text-xs font-semibold">Tarefas Completas</p>
                    <p className="text-2xl font-bold text-blue-600">25/32</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle>Sprint 5 - Global Expansion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Sprint Completude</span>
                    <span className="text-xl font-bold text-orange-600">0%</span>
                  </div>
                  <Progress value={0} className="h-3" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-orange-900/40' : 'bg-orange-100'}`}>
                    <p className="text-xs font-semibold">Tarefas</p>
                    <p className="text-2xl font-bold text-orange-600">0/7</p>
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-purple-900/40' : 'bg-purple-100'}`}>
                    <p className="text-xs font-semibold">Dias Restantes</p>
                    <p className="text-2xl font-bold text-purple-600">71</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* KICKOFF MESSAGE */}
        <Card className={`${isDark ? 'bg-gradient-to-r from-green-900/60 to-blue-900/60 border-green-600' : 'bg-gradient-to-r from-green-100 to-blue-100 border-green-600'} border-2`}>
          <CardContent className="pt-8 space-y-4">
            <h3 className="text-2xl font-bold">🚀 Sprint 5 Kickoff - Global Expansion Iniciado</h3>
            <p className={isDark ? 'text-gray-300' : 'text-gray-800'}>
              Projeto DocuChain está em fase de expansão global. As próximas 11 semanas focam em i18n, conformidade regional, deployment multi-região e parcerias enterprise. Objetivo: Lançar DocuChain como plataforma de assinatura digital #1 em Brasil, Europa e USA.
            </p>
            <p className="text-lg font-bold">
              ✅ <strong>Fases 1-4 Consolidadas</strong> | 🚀 <strong>Sprint 5 AGORA</strong> | 📈 <strong>Projeto 85% Completo</strong>
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}