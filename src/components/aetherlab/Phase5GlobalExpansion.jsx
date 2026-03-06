import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Globe, Users, TrendingUp, Zap } from 'lucide-react';

export default function Phase5GlobalExpansion() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [expandedTask, setExpandedTask] = useState(null);

  // STATUS FINAL FASE 4
  const fase4Status = {
    dataInicio: '08/08/2026',
    dataFimPrevisto: '07/09/2026',
    dataAtual: '15/08/2026',
    diasDecorridos: 7,
    diasRestantes: 23,
    tarefasCompletas: 2,
    tarefasTotal: 7,
    progresso: 29,
    tarefasCompletas_list: [
      '✅ Phase4Growth Dashboard criado',
      '✅ ChainOfCustodyDashboard implementado'
    ],
    tarefasPendentes_list: [
      'Landing Page Premium Redesign',
      'Dashboard Chain of Custody Visual',
      'Public Verification Page',
      'Legal Compliance Showcase',
      'Competitor Differentiation Campaign',
      'Global Scale Infrastructure',
      'Enterprise B2B Sales Pipeline'
    ]
  };

  // INICIALIZAÇÃO FASE 5
  const fase5Info = {
    nome: 'FASE 5: EXPANSÃO GLOBAL',
    duracao: '8+ semanas (Set-Out 2026)',
    dataInicio: '08/09/2026',
    dataFimTarget: '01/11/2026',
    status: 'PLANEJADO',
    prioridade: 'CRÍTICA',
    descricao: 'Expansão para mercados internacionais com localização, conformidade legal e suporte multilíngue'
  };

  const tarefasFase5 = [
    {
      id: 1,
      titulo: 'Localização & Internacionalização (i18n)',
      descricao: 'Suporte multilíngue para português, inglês, espanhol, francês e alemão',
      status: 'PLANEJADO',
      progresso: 0,
      prioridade: 'CRÍTICA',
      assignee: 'Frontend Team',
      subtarefas: [
        { nome: 'Implementar i18n framework (react-intl)', status: '⏳' },
        { nome: 'Traduzir UI para 5 idiomas', status: '⏳' },
        { nome: 'RTL support para árabe', status: '⏳' },
        { nome: 'Localizar documentação', status: '⏳' }
      ]
    },
    {
      id: 2,
      titulo: 'Conformidade Legal Regional',
      descricao: 'Adaptação de conformidade para UE (eIDAS), EUA (ESIGN), Latam (legislação local)',
      status: 'PLANEJADO',
      progresso: 0,
      prioridade: 'CRÍTICA',
      assignee: 'Legal & Compliance Team',
      subtarefas: [
        { nome: 'eIDAS compliance para UE', status: '⏳' },
        { nome: 'ESIGN Act compliance para EUA', status: '⏳' },
        { nome: 'Marcos Legal vs Latam (México, Chile, Argentina)', status: '⏳' },
        { nome: 'Data residency compliance', status: '⏳' }
      ]
    },
    {
      id: 3,
      titulo: 'Multi-Region Deployment',
      descricao: 'Infraestrutura distribuída em 6 regiões globais (Americas, Europe, Asia-Pacific)',
      status: 'PLANEJADO',
      progresso: 0,
      prioridade: 'ALTA',
      assignee: 'DevOps & Infrastructure Team',
      subtarefas: [
        { nome: 'AWS/GCP multi-region setup', status: '⏳' },
        { nome: 'Database replication global', status: '⏳' },
        { nome: 'CDN global optimization', status: '⏳' },
        { nome: 'Disaster recovery multi-region', status: '⏳' }
      ]
    },
    {
      id: 4,
      titulo: 'Suporte ao Cliente 24/7 Global',
      descricao: 'Suporte em múltiplos idiomas com time distribuído globalmente',
      status: 'PLANEJADO',
      progresso: 0,
      prioridade: 'ALTA',
      assignee: 'Customer Success Team',
      subtarefas: [
        { nome: 'Setup zendesk multilíngue', status: '⏳' },
        { nome: 'Chat support em 5 idiomas', status: '⏳' },
        { nome: 'Knowledge base global', status: '⏳' }
      ]
    },
    {
      id: 5,
      titulo: 'Go-to-Market Strategy por Região',
      descricao: 'Estratégia específica de marketing e vendas para cada região geográfica',
      status: 'PLANEJADO',
      progresso: 0,
      prioridade: 'ALTA',
      assignee: 'Marketing & Sales Team',
      subtarefas: [
        { nome: 'Market research (US, EU, Latam, APAC)', status: '⏳' },
        { nome: 'Regional partnerships & integrations', status: '⏳' },
        { nome: 'Localized case studies & testimonials', status: '⏳' }
      ]
    },
    {
      id: 6,
      titulo: 'Certificações & Auditorias Globais',
      descricao: 'SOC 2, ISO 27001, TISAX, e certificações regionais (eIDAS, CSF)',
      status: 'PLANEJADO',
      progresso: 0,
      prioridade: 'ALTA',
      assignee: 'Compliance & Security Team',
      subtarefas: [
        { nome: 'SOC 2 Type II audit', status: '⏳' },
        { nome: 'ISO 27001 certification', status: '⏳' },
        { nome: 'eIDAS certification (EU)', status: '⏳' }
      ]
    },
    {
      id: 7,
      titulo: 'Enterprise Partnerships Estratégicas',
      descricao: 'Parcerias com grandes tech players (Microsoft, Google, Salesforce, SAP)',
      status: 'PLANEJADO',
      progresso: 0,
      prioridade: 'ALTA',
      assignee: 'Business Development',
      subtarefas: [
        { nome: 'API integrations com enterprise apps', status: '⏳' },
        { nome: 'Co-marketing programs', status: '⏳' },
        { nome: 'Revenue sharing models', status: '⏳' }
      ]
    }
  ];

  // Roadmap 2026-2027
  const roadmap20262027 = [
    { trimestre: 'Q3 2026', fases: ['Fase 4: Growth (17% → 100%)', 'Fase 5 início: Global Expansion'], kpis: 'Premium design consolidado, suporte global' },
    { trimestre: 'Q4 2026', fases: ['Fase 5: Global Expansion (50-75%)', 'Preparação Fase 6'], kpis: 'Multi-region live, 10+ idiomas' },
    { trimestre: 'Q1 2027', fases: ['Fase 5: 100%', 'Fase 6: AI & Automation', 'Fase 7: Enterprise Scale'], kpis: 'Global market leader, +1M transactions' },
    { trimestre: 'Q2+ 2027', fases: ['Fase 6-7 em andamento', 'IPO/Fundraising preparado'], kpis: 'Valuation $500M+, expansion capital' }
  ];

  const totalTarefas = tarefasFase5.length;

  const getStatusColor = (status) => {
    switch(status) {
      case 'COMPLETO': return 'bg-green-600';
      case 'EM_ANDAMENTO': return 'bg-blue-600';
      case 'PLANEJADO': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* STATUS FASE 4 FINAL */}
        <section className={`p-6 rounded-lg border-2 ${isDark ? 'bg-amber-900/30 border-amber-600' : 'bg-amber-50 border-amber-400'}`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            ⏳ FASE 4: Growth - Status Final
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold mb-3">✅ Completadas (2/7)</h3>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-green-300' : 'text-green-800'}`}>
                {fase4Status.tarefasCompletas_list.map((tarefa, idx) => (
                  <li key={idx}>{tarefa}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">⏳ Pendentes (5/7) - Deadline: 07/09/2026</h3>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-orange-300' : 'text-orange-800'}`}>
                {fase4Status.tarefasPendentes_list.slice(0, 5).map((tarefa, idx) => (
                  <li key={idx}>• {tarefa}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-amber-400">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Progresso Fase 4</span>
              <span className="text-2xl font-bold">{fase4Status.progresso}%</span>
            </div>
            <Progress value={fase4Status.progresso} className="h-3" />
            <p className={`text-xs mt-2 ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
              {fase4Status.diasDecorridos} dias decorridos | {fase4Status.diasRestantes} dias restantes até deadline
            </p>
          </div>
        </section>

        {/* HEADER FASE 5 */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-600' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400'}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-green-600 px-3 py-1">🌍 FASE 5</Badge>
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-2">{fase5Info.nome}</h1>
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {fase5Info.descricao}
              </p>
              <p className={`text-sm mt-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Início: 08/09/2026 | Duração: 8+ semanas | Target: 01/11/2026
              </p>
            </div>
          </div>
        </section>

        {/* TAREFAS FASE 5 */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🌎 7 Tarefas Críticas - Global Expansion
          </h2>
          <div className="space-y-4">
            {tarefasFase5.map((tarefa) => (
              <Card 
                key={tarefa.id} 
                className={`cursor-pointer transition-all ${isDark ? 'bg-gray-800 border-gray-700 hover:border-green-600' : 'hover:shadow-lg'}`}
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
                      <div className="flex items-center gap-4">
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
                      <Badge className={tarefa.prioridade === 'CRÍTICA' ? 'bg-red-600' : 'bg-orange-600'}>
                        {tarefa.prioridade}
                      </Badge>
                      <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {tarefa.assignee}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                {expandedTask === tarefa.id && (
                  <CardContent className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div>
                      <p className="font-semibold text-sm mb-3">Subtarefas:</p>
                      <div className="space-y-2">
                        {tarefa.subtarefas.map((sub, idx) => (
                          <div key={idx} className={`p-2 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <span className="mr-2">{sub.status}</span>
                            {sub.nome}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* ROADMAP 2026-2027 */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            📅 Roadmap Estratégico 2026-2027
          </h2>
          <div className="space-y-3">
            {roadmap20262027.map((item, idx) => (
              <Card key={idx} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-bold">{item.trimestre}</h4>
                    <Badge className="bg-blue-600">{item.trimestre.split()[0]}</Badge>
                  </div>
                  <div className="space-y-2 text-sm mb-3">
                    {item.fases.map((fase, fIdx) => (
                      <p key={fIdx} className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        • {fase}
                      </p>
                    ))}
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <p className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
                      🎯 KPI: {item.kpis}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* AÇÕES CRÍTICAS */}
        <section className={`p-6 rounded-lg border-l-4 ${isDark ? 'bg-red-900/20 border-red-600' : 'bg-red-50 border-red-600'}`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🔥 AÇÕES CRÍTICAS - EXECUTAR JÁ (até 07/09)
          </h2>
          <ol className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <li className="flex gap-3">
              <span className="font-bold text-red-600">1.</span>
              <span><strong>FINALIZAR FASE 4:</strong> Completar 5 tarefas pendentes (landing page, chain of custody, public verification, compliance)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-red-600">2.</span>
              <span><strong>INICIAR PREPARAÇÃO FASE 5:</strong> Audit legal para UE (eIDAS), EUA (ESIGN), Latam</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-red-600">3.</span>
              <span><strong>MARKET RESEARCH:</strong> Análise detalhada dos 4 principais mercados (US, EU, Latam, APAC)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-red-600">4.</span>
              <span><strong>INFRAESTRUTURA GLOBAL:</strong> Começar planejamento multi-region deployment</span>
            </li>
          </ol>
        </section>

        {/* RESUMO EXECUTIVO */}
        <section className={`p-6 rounded-lg ${isDark ? 'bg-gradient-to-r from-green-900 to-emerald-900 border border-green-700' : 'bg-gradient-to-r from-green-100 to-emerald-100 border border-green-400'}`}>
          <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            🌍 VISÃO GLOBAL: DocuChain Dominando o Mercado Mundial
          </h2>
          <div className={`space-y-3 ${isDark ? 'text-green-50' : 'text-green-900'}`}>
            <p>
              <strong>📊 Status Atual (15/08/2026):</strong><br/>
              Fase 4: 29% concluída (2/7 tarefas) | Deadline 07/09 | Fases 1-3: 100% completas
            </p>
            <p>
              <strong>🚀 Próximo Sprint (08/09 - 01/11):</strong><br/>
              Fase 5: Expansão Global com 7 tarefas críticas | Localização 5 idiomas | Conformidade regional | Multi-region infrastructure
            </p>
            <p>
              <strong>💎 Diferencial Competitivo Global Único:</strong><br/>
              Blockchain pública + Cadeia de Custódia Legal + Conformidade eIDAS/ESIGN + Verificação Pública Transparente
            </p>
            <p>
              <strong>📈 Roadmap 2026-2027:</strong><br/>
              Q3: Fase 5 50-75% | Q4: Global live em 4+ regiões | Q1 2027: Fases 6-7 (AI/Enterprise) | Q2+: IPO/Scale
            </p>
            <p>
              <strong>🎯 Valuation Target 2027:</strong><br/>
              $500M+ com 1M+ transações/mês, presença em 50+ países, líder global em blockchain + assinatura digital
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}