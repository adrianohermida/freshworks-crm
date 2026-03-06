import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Rocket, Target, Users, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function NextSprintPlan() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  // PROGRESSO CONSOLIDADO (15/08/2026)
  const progressoConsolidado = {
    dataAtual: '15/08/2026',
    fase1: { nome: 'Estabilização', status: '✅ 100%', tarefas: '6/6', dias: '14 dias' },
    fase2: { nome: 'Otimização', status: '✅ 100%', tarefas: '5/5', dias: '21 dias' },
    fase3: { nome: 'Roadmap v3.1', status: '✅ 100%', tarefas: '7/7', dias: '28 dias' },
    fase4: { nome: 'Growth', status: '⏳ 29%', tarefas: '2/7', dias: '7 dias decorridos | 23 restantes' },
    projetoGeral: { status: '72%', tarefas: '20/28', fases: '3/5' }
  };

  // TIMELINE HISTÓRICO
  const timelineData = [
    { periodo: 'Mai', fase: 'Estabilização', progresso: 100, tarefas: 6 },
    { periodo: 'Jun', fase: 'Otimização', progresso: 100, tarefas: 5 },
    { periodo: 'Jul-Ago', fase: 'Roadmap v3.1', progresso: 100, tarefas: 7 },
    { periodo: 'Ago-Set', fase: 'Growth (Atual)', progresso: 29, tarefas: 2 },
    { periodo: 'Set-Out', fase: 'Global Expansion', progresso: 0, tarefas: 7 }
  ];

  // SPRINT 4 REVISADO
  const sprint4Revisado = {
    nome: 'Sprint 4: Growth & Market Dominance',
    periodo: '08/08 - 07/09/2026',
    dataAtual: '15/08/2026',
    diasDecorridos: 7,
    diasRestantes: 23,
    totalTarefas: 7,
    completas: 2,
    pendentes: 5,
    tarefasCompletas: [
      { id: 1, nome: 'Phase4Growth Dashboard', dataCompleto: '14/08/2026', assignee: 'Frontend Team', status: '✅' },
      { id: 2, nome: 'ChainOfCustodyDashboard', dataCompleto: '15/08/2026', assignee: 'Frontend Team', status: '✅' }
    ],
    tarefasPendentes: [
      { id: 3, nome: 'Landing Page Premium Redesign', dias: '20', prioridade: 'CRÍTICA' },
      { id: 4, nome: 'Chain of Custody Visual Premium', dias: '21', prioridade: 'CRÍTICA' },
      { id: 5, nome: 'Public Verification Page (/verify)', dias: '19', prioridade: 'CRÍTICA' },
      { id: 6, nome: 'Legal Compliance Showcase', dias: '22', prioridade: 'CRÍTICA' },
      { id: 7, nome: 'Competitor Differentiation Campaign', dias: '23', prioridade: 'ALTA' }
    ],
    impactoDiferencial: [
      '✅ Blockchain Pública Ethereum (único vs concorrentes)',
      '✅ Verificação Sem Login (diferencial competitivo)',
      '✅ Cadeia de Custódia Legal (Lei 14.063 + LGPD/GDPR)',
      '✅ Dashboards Executivos Premium'
    ]
  };

  // SPRINT 5 PLANEJADO
  const sprint5Planejado = {
    nome: 'Sprint 5: Global Expansion',
    periodo: '08/09 - 01/11/2026',
    duracao: '8 semanas',
    dataInicio: '08/09/2026',
    dataFim: '01/11/2026',
    totalTarefas: 7,
    tarefas: [
      { id: 1, nome: 'Localização i18n (5 idiomas)', prioridade: 'CRÍTICA', dias: '14' },
      { id: 2, nome: 'Conformidade Regional (eIDAS/ESIGN)', prioridade: 'CRÍTICA', dias: '21' },
      { id: 3, nome: 'Multi-Region Deployment (6 regiões)', prioridade: 'CRÍTICA', dias: '28' },
      { id: 4, nome: 'Suporte 24/7 Global Multilíngue', prioridade: 'ALTA', dias: '21' },
      { id: 5, nome: 'Go-to-Market Regional (4 mercados)', prioridade: 'ALTA', dias: '21' },
      { id: 6, nome: 'Certificações Globais (SOC2, ISO27001, eIDAS)', prioridade: 'ALTA', dias: '42' },
      { id: 7, nome: 'Enterprise Partnerships (Tech Giants)', prioridade: 'ALTA', dias: '28' }
    ],
    kpis: [
      'Multi-region live em 4+ regiões',
      'Suporte em 5 idiomas',
      'Conformidade eIDAS, ESIGN, marcos legal latam',
      'SOC 2 Type II audit concluído',
      '10+ Enterprise partnerships ativas'
    ]
  };

  // ROADMAP 2026-2027 ESTRATÉGICO
  const roadmapEstrategico = [
    { trimestre: 'Q3 2026', sprintAtual: 'Sprint 4', novoSprint: 'Sprint 5 (08/09)', fases: 'Fase 4 (100%) → Fase 5 (0%)', objectivo: 'Premium design + Global foundation' },
    { trimestre: 'Q4 2026', sprintAtual: 'Sprint 5', novoSprint: 'Sprint 6', fases: 'Fase 5 (75%) + Fase 6 (0%)', objectivo: 'Multi-region live, Enterprise ready' },
    { trimestre: 'Q1 2027', sprintAtual: 'Sprint 6', novoSprint: 'Sprint 7', fases: 'Fase 5 (100%) + Fase 6 (50%)', objectivo: 'AI/Automation + Enterprise scale' },
    { trimestre: 'Q2+ 2027', sprintAtual: 'Sprint 7+', novoSprint: 'Sprint 8+', fases: 'Fase 6 (100%) + Fase 7 (IPO)', objectivo: 'Global market leader + Fundraising' }
  ];

  // KPIs CONSOLIDADOS
  const kpisConsolidados = [
    { metrica: 'Tarefas Completas', valor: '20/28', target: '28/28', status: '71%' },
    { metrica: 'Fases Completas', valor: '3/5', target: '5/5', status: '60%' },
    { metrica: 'Progresso Geral', valor: '72%', target: '100%', status: '72%' },
    { metrica: 'Sprints Concluídos', valor: '3/7', target: '7/7', status: '43%' }
  ];

  const diasAteProximoCheckpoint = 23;
  const diasAteOutroSprint = 24;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER CONSOLIDAÇÃO */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-600' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-400'}`}>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Rocket className="w-8 h-8" />
                Consolidação + Próximo Sprint
              </h1>
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Sprint 4 Revisado + Sprint 5 Planejado | Execução Contínua
              </p>
              <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Data Atual: 15/08/2026 | Status Global: 72% (20/28 tarefas) | Fases: 3/5 completas
              </p>
            </div>
          </div>
        </section>

        {/* SPRINT 4 STATUS FINAL */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            ⏳ SPRINT 4 REVISADO - Status Final (7 dias decorridos)
          </h2>
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6 space-y-6">
              {/* COMPLETAS */}
              <div>
                <h3 className="font-bold text-lg mb-3 text-green-600">✅ TAREFAS COMPLETADAS (2/7 = 29%)</h3>
                <div className="space-y-2">
                  {sprint4Revisado.tarefasCompletas.map((tarefa) => (
                    <div key={tarefa.id} className={`p-3 rounded-lg flex items-center justify-between ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
                      <div>
                        <p className={`font-semibold ${isDark ? 'text-green-300' : 'text-green-900'}`}>
                          {tarefa.status} {tarefa.nome}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                          {tarefa.assignee} | {tarefa.dataCompleto}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PENDENTES */}
              <div>
                <h3 className="font-bold text-lg mb-3 text-orange-600">⏳ PENDENTES - DEADLINE 07/09 (5/7 = 71%)</h3>
                <div className="space-y-2">
                  {sprint4Revisado.tarefasPendentes.map((tarefa) => (
                    <div key={tarefa.id} className={`p-3 rounded-lg flex items-center justify-between ${isDark ? 'bg-orange-900/30' : 'bg-orange-100'}`}>
                      <div className="flex-1">
                        <p className={`font-semibold ${isDark ? 'text-orange-300' : 'text-orange-900'}`}>
                          {tarefa.id}. {tarefa.nome}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={tarefa.prioridade === 'CRÍTICA' ? 'bg-red-600' : 'bg-orange-600'}>
                          {tarefa.prioridade}
                        </Badge>
                        <p className={`text-xs mt-1 ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>
                          {tarefa.dias} dias
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PROGRESSO */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-lg">Progresso Sprint 4</span>
                  <span className="text-3xl font-bold text-orange-600">29%</span>
                </div>
                <Progress value={29} className="h-3" />
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  2 completas | 5 pendentes | 23 dias restantes
                </p>
              </div>

              {/* DIFERENCIAL COMPETITIVO */}
              <div className={`p-4 rounded-lg border-l-4 ${isDark ? 'bg-purple-900/30 border-purple-600' : 'bg-purple-100 border-purple-600'}`}>
                <p className="font-bold text-purple-600 mb-2">💎 Diferencial Competitivo Consolidado:</p>
                <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {sprint4Revisado.impactoDiferencial.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SPRINT 5 DETALHADO */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🌍 SPRINT 5 PLANEJADO - Global Expansion (08/09 - 01/11)
          </h2>
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold mb-3">📋 Tarefas (7 críticas)</h3>
                  <ul className="space-y-2">
                    {sprint5Planejado.tarefas.map((tarefa) => (
                      <li key={tarefa.id} className={`p-2 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <Badge className={tarefa.prioridade === 'CRÍTICA' ? 'bg-red-600 mr-2' : 'bg-orange-600 mr-2'}>
                          {tarefa.prioridade.substring(0, 1)}
                        </Badge>
                        {tarefa.nome}
                        <span className={`ml-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          ({tarefa.dias} dias)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-3">🎯 KPIs Target</h3>
                  <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {sprint5Planejado.kpis.map((kpi, idx) => (
                      <li key={idx} className={`p-2 rounded ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                        ✅ {kpi}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-blue-600 text-white">
                <p className="font-bold">⏰ Cronograma:</p>
                <p>Início: 08/09/2026 | Término: 01/11/2026 (8 semanas)</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* GRÁFICO DE PROGRESSO */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📊 Histórico de Progresso (Mai 2026 - Out 2026)</h2>
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#ddd'} />
                  <XAxis dataKey="periodo" stroke={isDark ? '#999' : '#666'} />
                  <YAxis stroke={isDark ? '#999' : '#666'} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: isDark ? '#333' : '#fff', border: `1px solid ${isDark ? '#555' : '#ddd'}` }}
                    formatter={(value) => `${value}%`}
                  />
                  <Bar dataKey="progresso" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* ROADMAP ESTRATÉGICO */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🗺️ Roadmap Estratégico 2026-2027</h2>
          <div className="space-y-3">
            {roadmapEstrategico.map((item, idx) => (
              <Card key={idx} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Trimestre</p>
                      <p className="font-bold text-lg">{item.trimestre}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Sprint Atual</p>
                      <p className="font-semibold">{item.sprintAtual}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Próximo Sprint</p>
                      <p className="font-semibold text-blue-600">{item.novoSprint}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Objetivo</p>
                      <p className={`font-semibold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>{item.objectivo}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* KPIs CONSOLIDADOS */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📈 KPIs Consolidados do Projeto</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {kpisConsolidados.map((kpi, idx) => (
              <Card key={idx} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="pt-6 text-center">
                  <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{kpi.metrica}</p>
                  <p className="text-3xl font-bold mb-2">{kpi.valor}</p>
                  <Progress value={parseInt(kpi.status)} className="h-2" />
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {kpi.status}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* AÇÕES IMEDIATAS */}
        <section className={`p-6 rounded-lg border-l-4 ${isDark ? 'bg-red-900/20 border-red-600' : 'bg-red-50 border-red-600'}`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🔥 AÇÕES IMEDIATAS - PRÓXIMOS 23 DIAS
          </h2>
          <ol className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <li className="flex gap-3">
              <span className="font-bold text-red-600 text-lg">1.</span>
              <span><strong>FINALIZAR SPRINT 4 (29% → 100%):</strong> Executar 5 tarefas críticas antes de 07/09/2026</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-red-600 text-lg">2.</span>
              <span><strong>INICIAR SPRINT 5 (08/09):</strong> Kickoff Global Expansion com 7 tarefas críticas de internacionalização</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-orange-600 text-lg">3.</span>
              <span><strong>PREPARAÇÃO CONFORMIDADE:</strong> Audit legal eIDAS (UE), ESIGN (EUA), marcos legal Latam</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-orange-600 text-lg">4.</span>
              <span><strong>MARKET RESEARCH:</strong> Análise profunda de 4 mercados principais (US, EU, Latam, APAC)</span>
            </li>
          </ol>
        </section>

        {/* RESUMO EXECUTIVO FINAL */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-600' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400'}`}>
          <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ✨ RESUMO EXECUTIVO CONSOLIDADO
          </h2>
          <div className={`space-y-4 ${isDark ? 'text-green-50' : 'text-green-900'}`}>
            <p>
              <strong>📊 Status Atual (15/08/2026):</strong><br/>
              Sprint 4: 29% (2/7 completadas) | Fases 1-3: 100% | Projeto Geral: 72% (20/28 tarefas)
            </p>
            <p>
              <strong>✅ O Que Foi Realizado:</strong><br/>
              • 3 Fases completas (Estabilização, Otimização, Roadmap v3.1)<br/>
              • 18 tarefas finalizadas com sucesso<br/>
              • 2 dashboards premium em produção (Phase4Growth, ChainOfCustody)<br/>
              • Diferencial competitivo único consolidado (blockchain + cadeia de custódia legal)
            </p>
            <p>
              <strong>⏳ O Que Falta (23 dias):</strong><br/>
              Sprint 4: 5 tarefas críticas (Landing Page, Chain of Custody Visual, Public Verification, Compliance, Competitor Campaign)<br/>
              Target: 07/09/2026 (100% Sprint 4 completo)
            </p>
            <p>
              <strong>🌍 Próximo Sprint (Sprint 5):</strong><br/>
              Global Expansion 08/09-01/11/2026 | 7 tarefas críticas | i18n (5 idiomas), Conformidade Regional, Multi-region Deployment, Suporte Global
            </p>
            <p>
              <strong>🚀 Trajetória 2026-2027:</strong><br/>
              Q3: Fase 4 (100%) + Fase 5 (0%) | Q4: Fase 5 (75%) | Q1 2027: Fase 5 (100%) + Fase 6 (50%) | Q2+: Global Market Leader + IPO
            </p>
            <p>
              <strong>🎯 Status Geral:</strong><br/>
              <span className="text-lg font-bold text-green-600">✅ ON TRACK - Trajetória Verde para Market Leadership Global 2026-2027</span>
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}