import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, TrendingUp, Target, Users, Rocket } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ExecutiveProjectStatus() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  // Dados de progresso do projeto completo
  const projectData = {
    nome: 'DocuChain v3.0 - Pós-Launch',
    dataLancamento: '2026-05-01',
    dataAtual: '2026-08-15',
    status: 'ON_TRACK',
    visao: 'Dominar mercado global de assinatura digital + blockchain com cadeia de custódia legal'
  };

  // Fases do projeto
  const fases = [
    {
      numero: 1,
      nome: 'Estabilização',
      periodo: 'Mai 2026 (2 semanas)',
      status: 'CONCLUÍDO',
      progresso: 100,
      tarefas: '6/6',
      kpis: ['Uptime 99.99%', 'Bug Fix <4h', 'Error Rate 0.07%'],
      resultados: [
        'Monitoramento 24/7 ativado',
        '45 bugs críticos corrigidos',
        'Documentação 100% atualizada'
      ]
    },
    {
      numero: 2,
      nome: 'Otimização',
      periodo: 'Jun 2026 (3 semanas)',
      status: 'CONCLUÍDO',
      progresso: 100,
      tarefas: '5/5',
      kpis: ['NPS 72', 'Cache Hit 89.2%', 'Latência -35%'],
      resultados: [
        '8 melhorias UX/UI implementadas',
        'Dashboard analytics avançado',
        '150+ usuários testaram features'
      ]
    },
    {
      numero: 3,
      nome: 'Roadmap v3.1',
      periodo: 'Jul-Ago 2026 (4 semanas)',
      status: 'CONCLUÍDO',
      progresso: 100,
      tarefas: '7/7',
      kpis: ['Mobile: 50K+ downloads', 'Features: 15+ integrações', 'Enterprise: 100+ clientes'],
      resultados: [
        'WhatsApp Integration ativa',
        'Mobile App iOS/Android lançado',
        'Advanced Search & Elasticsearch'
      ]
    },
    {
      numero: 4,
      nome: 'Growth & Market Dominance',
      periodo: 'Ago-Set 2026 (6+ semanas)',
      status: 'EM_PROGRESSO',
      progresso: 17,
      tarefas: '2/7',
      kpis: ['Premium Design', 'Chain of Custody', 'Public Verification'],
      resultados: [
        'Phase4Growth Dashboard criado',
        'ChainOfCustodyDashboard implementado',
        'Posicionamento premium consolidado'
      ]
    }
  ];

  // Timeline de progresso
  const timelineProgresso = [
    { periodo: 'Mai', fase: 'Estabilização', progresso: 100 },
    { periodo: 'Jun', fase: 'Otimização', progresso: 100 },
    { periodo: 'Jul-Ago', fase: 'Roadmap v3.1', progresso: 100 },
    { periodo: 'Ago-Set', fase: 'Growth', progresso: 17 }
  ];

  // KPIs Globais
  const kpisGlobais = [
    { metrica: 'Fases Completadas', valor: '3/4', alvo: '4/4', status: '⏳' },
    { metrica: 'Tarefas Completas', valor: '18/25', alvo: '25/25', status: '⏳' },
    { metrica: 'Progresso Geral', valor: '72%', alvo: '100%', status: '⏳' },
    { metrica: 'KPIs Atingidos', valor: '12/13', alvo: '13/13', status: '⏳' }
  ];

  // Pendências críticas
  const pendenciasMovimento = [
    { id: 1, tarefa: 'Landing Page Premium Redesign', prioridade: 'CRÍTICA', dias: 7 },
    { id: 2, tarefa: 'Dashboard Chain of Custody Visual', prioridade: 'CRÍTICA', dias: 7 },
    { id: 3, tarefa: 'Public Verification Page (/verify)', prioridade: 'CRÍTICA', dias: 5 },
    { id: 4, tarefa: 'Legal Compliance Showcase', prioridade: 'CRÍTICA', dias: 5 },
    { id: 5, tarefa: 'Competitor Differentiation Campaign', prioridade: 'ALTA', dias: 10 },
    { id: 6, tarefa: 'Global Scale Infrastructure', prioridade: 'ALTA', dias: 14 },
    { id: 7, tarefa: 'Enterprise B2B Sales Pipeline', prioridade: 'ALTA', dias: 14 }
  ];

  const totalTarefasProjetoConcluidas = 18;
  const totalTarefasProjeto = 25;
  const percentualProjetoConcluido = Math.round((totalTarefasProjetoConcluidas / totalTarefasProjeto) * 100);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER EXECUTIVO */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-600' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-400'}`}>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">📊 Status Executivo do Projeto</h1>
                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {projectData.nome}
                </p>
              </div>
              <Badge className="bg-blue-600 px-4 py-2 text-lg">
                {projectData.status === 'ON_TRACK' ? '✅ ON TRACK' : '⚠️ AT RISK'}
              </Badge>
            </div>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <strong>Visão:</strong> {projectData.visao}
            </p>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>Lançamento: 01/05/2026 | Período de Execução: 5+ meses | Data Atual: 15/08/2026</p>
            </div>
          </div>
        </section>

        {/* PROGRESSO GERAL */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🎯 Progresso Geral do Projeto</h2>
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-lg">Taxa de Completude Geral</span>
                  <span className="text-4xl font-bold text-blue-600">{percentualProjetoConcluido}%</span>
                </div>
                <Progress value={percentualProjetoConcluido} className="h-4" />
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                {kpisGlobais.map((kpi, idx) => (
                  <div key={idx} className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{kpi.metrica}</p>
                    <p className="text-3xl font-bold mt-2">{kpi.valor}</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Alvo: {kpi.alvo}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FASES DO PROJETO */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Rocket className="w-6 h-6" />
            4 Fases de Execução
          </h2>
          <div className="space-y-4">
            {fases.map((fase) => (
              <Card 
                key={fase.numero}
                className={`${fase.status === 'CONCLUÍDO' ? (isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-300') : (isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300')} border-2`}
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${fase.status === 'CONCLUÍDO' ? 'bg-green-600' : 'bg-blue-600'}`}>
                            {fase.numero}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{fase.nome}</h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {fase.periodo} | Tarefas: {fase.tarefas}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={fase.status === 'CONCLUÍDO' ? 'bg-green-600' : 'bg-blue-600'}>
                          {fase.status === 'CONCLUÍDO' ? '✅ COMPLETO' : '⏳ EM PROGRESSO'}
                        </Badge>
                        <p className="text-3xl font-bold mt-2">{fase.progresso}%</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold mb-2">KPIs Atingidos:</p>
                        <ul className="text-sm space-y-1">
                          {fase.kpis.map((kpi, idx) => (
                            <li key={idx}>✅ {kpi}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2">Resultados:</p>
                        <ul className="text-sm space-y-1">
                          {fase.resultados.map((resultado, idx) => (
                            <li key={idx}>• {resultado}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progresso</span>
                        <span className="font-semibold">{fase.progresso}%</span>
                      </div>
                      <Progress value={fase.progresso} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* PENDÊNCIAS CRÍTICAS */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Tarefas Pendentes - Fase 4 (7 Itens)
          </h2>
          <Card className={`border-l-4 ${isDark ? 'bg-red-900/20 border-red-600' : 'bg-red-50 border-red-600'}`}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {pendenciasMovimento.map((item) => (
                  <div key={item.id} className={`p-3 rounded-lg flex items-start justify-between ${isDark ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg">{item.id}.</span>
                        <span className="font-semibold">{item.tarefa}</span>
                        <Badge className={item.prioridade === 'CRÍTICA' ? 'bg-red-600' : 'bg-orange-600'}>
                          {item.prioridade}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {item.dias} dias
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* GRÁFICO DE PROGRESSO TEMPORAL */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Evolução de Progresso por Fase
          </h2>
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fases}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#ddd'} />
                  <XAxis dataKey="nome" stroke={isDark ? '#999' : '#666'} />
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

        {/* AÇÕES IMEDIATAS */}
        <section className={`p-6 rounded-lg border-l-4 ${isDark ? 'bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-600' : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-600'}`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🔥 AÇÕES CRÍTICAS - PRÓXIMOS 7 DIAS
          </h2>
          <ol className={`space-y-3 text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <li className="flex gap-3">
              <span className="font-bold text-red-600">1.</span>
              <span><strong>Landing Page Premium:</strong> Finalizar redesign vs Docusing, SignEasy, PandaDoc, AdobeSign com blockchain visual</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-red-600">2.</span>
              <span><strong>Chain of Custody Dashboard:</strong> Implementar timeline interativa + blockchain verification status premium</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-red-600">3.</span>
              <span><strong>Public Verification:</strong> URL /verify/[hash] acessível sem login (diferencial único)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-red-600">4.</span>
              <span><strong>Legal Compliance Display:</strong> Showcase de cadeia de custódia + Lei 14.063 + LGPD/GDPR</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-red-orange">5.</span>
              <span><strong>Marketing Positioning:</strong> Publicar comparison table DocuChain vs concorrentes</span>
            </li>
          </ol>
        </section>

        {/* RESUMO EXECUTIVO FINAL */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-amber-900/40 to-orange-900/40 border-amber-600' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-400'}`}>
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
            👑 RESUMO EXECUTIVO FINAL
          </h2>
          <div className={`space-y-4 ${isDark ? 'text-amber-50' : 'text-amber-900'}`}>
            <p>
              <strong>✅ Entregáveis Completados:</strong><br/>
              Fase 1 (Estabilização 100%) + Fase 2 (Otimização 100%) + Fase 3 (Roadmap v3.1 100%) = 18/25 tarefas = 72% do projeto
            </p>
            <p>
              <strong>🚀 Em Progresso (Fase 4):</strong><br/>
              Growth & Market Dominance iniciada com 7 tarefas críticas de design premium, chain of custody e positioning vs concorrentes globais
            </p>
            <p>
              <strong>💎 Diferencial Competitivo Único (Bloqueador para concorrentes):</strong><br/>
              ✅ Blockchain Pública (Ethereum) | ✅ Verificação Sem Login | ✅ Cadeia de Custódia Legal | ✅ ICP-Brasil + Lei 14.063 | ✅ Timestamp Observatório Nacional
            </p>
            <p>
              <strong>📊 Próxima Fase (Transição Set-Out):</strong><br/>
              Completar Fase 4 até 07/09/2026 e iniciar Fase 5 (Global Expansion) com foco em mercados internacionais (US, EU, LATAM)
            </p>
            <p>
              <strong>🎯 Status Geral:</strong><br/>
              Projeto ON TRACK | Trajetória verde | Pronto para consolidar MARKET LEADERSHIP em blockchain + assinatura digital + cadeia de custódia
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}