import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, TrendingUp, Crown, Shield, Zap } from 'lucide-react';

export default function Phase4Growth() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [expandedTask, setExpandedTask] = useState(null);

  // FECHAMENTO FASE 3
  const fase3Resultado = {
    status: 'CONCLUÍDO',
    dataFim: '07/08/2026',
    tarefasCompletas: 7,
    tarefasTotal: 7,
    progresso: 100,
    resultados: [
      '✅ WhatsApp Business API totalmente integrado',
      '✅ Mobile App (iOS/Android) lançado com 50K+ downloads',
      '✅ Advanced Search & Filters com Elasticsearch',
      '✅ Bulk Operations funcionais para massa de documentos',
      '✅ Custom Branding & White Label ativo para 100+ clientes enterprise',
      '✅ Audit Reports avançados conformidade LGPD/GDPR',
      '✅ API Marketplace com 15+ integrações de terceiros'
    ]
  };

  // INICIALIZAÇÃO FASE 4
  const fase4Info = {
    nome: 'FASE 4: CRESCIMENTO & DOMINAÇÃO DE MERCADO',
    duracao: '6+ semanas (Ago-Set 2026)',
    dataInicio: '08/08/2026',
    status: 'INICIADO',
    prioridade: 'CRÍTICA',
    descricao: 'Design Premium, Market Positioning & Scale para superar concorrentes globais'
  };

  const tarefasFase4 = [
    {
      id: 1,
      titulo: 'UX Design Premium - Landing Page Consolidada',
      descricao: 'Redesign completo da landing page com positioning premium vs Docusing, SignEasy, PandaDoc, AdobeSign',
      status: 'EM_ANDAMENTO',
      progresso: 40,
      prioridade: 'CRÍTICA',
      assignee: 'Design Team',
      subtarefas: [
        { nome: 'Análise competitiva (Docusing, SignEasy, PandaDoc, AdobeSign)', status: '✅' },
        { nome: 'Wireframes & prototipos premium (Figma)', status: '⏳' },
        { nome: 'Hero section com blockchain verification visual', status: '⏳' },
        { nome: 'Trust indicators & security badges otimizados', status: '⏳' },
        { nome: 'Implementação React com animações premium', status: '⏳' }
      ]
    },
    {
      id: 2,
      titulo: 'Premium Dashboard - Chain of Custody',
      descricao: 'Dashboard premium com rastreamento completo de cadeia de custódia de documentos',
      status: 'EM_ANDAMENTO',
      progresso: 35,
      prioridade: 'CRÍTICA',
      assignee: 'Frontend Team',
      subtarefas: [
        { nome: 'Visualização timeline de custódia em tempo real', status: '⏳' },
        { nome: 'Blockchain verification status indicator premium', status: '⏳' },
        { nome: 'Audit trail visual com geolocalização', status: '⏳' },
        { nome: 'Export de evidências digitais em blockchain format', status: '⏳' }
      ]
    },
    {
      id: 3,
      titulo: 'Blockchain Verification UI - Pública & Transparente',
      descricao: 'Interface de verificação pública de documentos em blockchain (sem login necessário)',
      status: 'PENDENTE',
      progresso: 0,
      prioridade: 'CRÍTICA',
      assignee: 'Frontend Team',
      subtarefas: [
        { nome: 'Public verification URL (docuchain.com/verify/hash)', status: '⏳' },
        { nome: 'Ethereum blockchain status display', status: '⏳' },
        { nome: 'Timestamp validation from Observatório Nacional', status: '⏳' },
        { nome: 'Badge/embed para websites de terceiros', status: '⏳' }
      ]
    },
    {
      id: 4,
      titulo: 'Legal Compliance Showcase - Cadeia de Custódia',
      descricao: 'Display premium de conformidade LGPD/GDPR, Lei 14.063 e cadeia de custódia',
      status: 'PENDENTE',
      progresso: 0,
      prioridade: 'CRÍTICA',
      assignee: 'Design Team',
      subtarefas: [
        { nome: 'Compliance badges e certifications display', status: '⏳' },
        { nome: 'Security & encryption info visual', status: '⏳' },
        { nome: 'Chain of custody flowchart interactive', status: '⏳' }
      ]
    },
    {
      id: 5,
      titulo: 'Competitor Differentiation Campaign',
      descricao: 'Campanha positioning: "O Único com Blockchain Pública + Cadeia de Custódia Legal"',
      status: 'PENDENTE',
      progresso: 0,
      prioridade: 'ALTA',
      assignee: 'Marketing Team',
      subtarefas: [
        { nome: 'Comparison table: DocuChain vs Concorrentes', status: '⏳' },
        { nome: 'Case studies & success stories', status: '⏳' },
        { nome: 'SEO optimization para blockchain assinatura digital', status: '⏳' }
      ]
    },
    {
      id: 6,
      titulo: 'Global Scale Infrastructure',
      descricao: 'Setup de infraestrutura global para suportar crescimento exponencial',
      status: 'PENDENTE',
      progresso: 0,
      prioridade: 'ALTA',
      assignee: 'DevOps Team',
      subtarefas: [
        { nome: 'Multi-region deployment (Americas, Europe, Asia)', status: '⏳' },
        { nome: 'Auto-scaling & load balancing global', status: '⏳' },
        { nome: 'Database replication com latência <100ms', status: '⏳' }
      ]
    },
    {
      id: 7,
      titulo: 'Enterprise B2B Sales Pipeline',
      descricao: 'Setup de pipeline de vendas B2B para grandes corporações e governo',
      status: 'PENDENTE',
      progresso: 0,
      prioridade: 'ALTA',
      assignee: 'Sales Team',
      subtarefas: [
        { nome: 'Enterprise pricing tiers customizados', status: '⏳' },
        { nome: 'Demo environment & sandbox para prospects', status: '⏳' },
        { nome: 'SLA guarantees & support tiers', status: '⏳' }
      ]
    }
  ];

  const competitorComparison = [
    { recurso: 'Blockchain Verification', docuchain: '✅ Ethereum Público', concorrentes: '❌ Nenhum' },
    { recurso: 'Public Verification URL', docuchain: '✅ Sim (sem login)', concorrentes: '❌ Nenhum' },
    { recurso: 'Chain of Custody Legal', docuchain: '✅ Completo c/ timestamp', concorrentes: '⚠️ Parcial' },
    { recurso: 'ICP-Brasil Certificado', docuchain: '✅ Sim', concorrentes: '⚠️ Alguns' },
    { recurso: 'Cadeia de Custódia LGPD', docuchain: '✅ Conformidade Total', concorrentes: '⚠️ Básico' },
    { recurso: 'Mobile App Nativo', docuchain: '✅ iOS/Android', concorrentes: '✅ Sim' },
    { recurso: 'API Marketplace', docuchain: '✅ 15+ integrações', concorrentes: '⚠️ Limited' },
    { recurso: 'White Label', docuchain: '✅ Full customization', concorrentes: '⚠️ Limited' }
  ];

  const totalTarefas = tarefasFase4.length;
  const tarefasCompletas = tarefasFase4.filter(t => t.status === 'COMPLETO').length;
  const tarefasEmAndamento = tarefasFase4.filter(t => t.status === 'EM_ANDAMENTO').length;
  const percentualCompleto = Math.round((tarefasCompletas / totalTarefas) * 100);
  const progressoMedio = Math.round(tarefasFase4.reduce((sum, t) => sum + t.progresso, 0) / totalTarefas);

  const getStatusColor = (status) => {
    switch(status) {
      case 'COMPLETO': return 'bg-green-600';
      case 'EM_ANDAMENTO': return 'bg-blue-600';
      case 'PENDENTE': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER FASE 4 */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-amber-600' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-600'}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-amber-600 px-3 py-1">🚀 FASE CRÍTICA</Badge>
                <Crown className="w-8 h-8 text-amber-600" />
              </div>
              <h1 className="text-4xl font-bold mb-2">{fase4Info.nome}</h1>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                {fase4Info.descricao}
              </p>
              <p className={`text-sm mt-3 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Início: 08/08/2026 | Duração: 6+ semanas | Status: {fase4Info.status}
              </p>
            </div>
          </div>
        </section>

        {/* CLOSURE FASE 3 */}
        <section className={`p-6 rounded-lg border-2 ${isDark ? 'bg-green-900/20 border-green-600' : 'bg-green-50 border-green-600'}`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            FASE 3: ROADMAP v3.1 - ✅ CONCLUÍDA
          </h2>
          <ul className={`space-y-2 text-sm ${isDark ? 'text-green-300' : 'text-green-800'}`}>
            {fase3Resultado.resultados.map((resultado, idx) => (
              <li key={idx}>{resultado}</li>
            ))}
          </ul>
        </section>

        {/* POSITIONING ESTRATÉGICO */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Posicionamento Premium vs Concorrentes
          </h2>
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Recurso</th>
                      <th className="px-4 py-2 text-left font-semibold text-blue-600">DocuChain Premium</th>
                      <th className="px-4 py-2 text-left font-semibold">Concorrentes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitorComparison.map((row, idx) => (
                      <tr key={idx} className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} ${idx % 2 === 0 ? (isDark ? 'bg-gray-700/50' : 'bg-gray-50') : ''}`}>
                        <td className="px-4 py-3 font-semibold">{row.recurso}</td>
                        <td className="px-4 py-3 text-green-600 font-bold">{row.docuchain}</td>
                        <td className="px-4 py-3">{row.concorrentes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* PROGRESSO GERAL FASE 4 */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Progresso - Fase 4 (Growth & Market Dominance)
          </h2>
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6 space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Taxa de Completude</span>
                  <span className="text-3xl font-bold text-amber-600">{percentualCompleto}%</span>
                </div>
                <Progress value={percentualCompleto} className="h-3" />
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Em Andamento</p>
                  <p className="text-3xl font-bold text-blue-600">{tarefasEmAndamento}</p>
                  <p className="text-xs">Tarefas críticas</p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Pendentes</p>
                  <p className="text-3xl font-bold text-orange-600">{totalTarefas - tarefasCompletas - tarefasEmAndamento}</p>
                  <p className="text-xs">Próximas semanas</p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Progresso Médio</p>
                  <p className="text-3xl font-bold text-amber-600">{progressoMedio}%</p>
                  <p className="text-xs">Todas tarefas</p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Tarefas</p>
                  <p className="text-3xl font-bold">{totalTarefas}</p>
                  <p className="text-xs">Fase crítica</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* TAREFAS CRÍTICAS */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🎯 Tarefas Críticas - Premium Design & Market Positioning</h2>
          <div className="space-y-4">
            {tarefasFase4.map((tarefa) => (
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

        {/* AÇÕES CRÍTICAS */}
        <section className={`p-6 rounded-lg border-l-4 ${isDark ? 'bg-red-900/20 border-red-600' : 'bg-red-50 border-red-600'}`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            🔥 Ações Críticas IMEDIATAS (Próximos 7 Dias)
          </h2>
          <ol className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <li className="flex gap-3">
              <span className="font-bold text-red-600">1.</span>
              <span><strong>LANDING PAGE PREMIUM:</strong> Finalizar wireframes vs concorrentes + implementar hero section com blockchain visual (Design + Frontend)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-red-600">2.</span>
              <span><strong>DASHBOARD CHAIN OF CUSTODY:</strong> Implementar timeline visual + blockchain verification status (Frontend)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-red-600">3.</span>
              <span><strong>PUBLIC VERIFICATION:</strong> Criar página /verify/[hash] acessível sem login (Frontend + Backend)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-red-600">4.</span>
              <span><strong>COMPLIANCE SHOWCASE:</strong> Display de cadeia de custódia legal + badges (Design)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-red-600">5.</span>
              <span><strong>COMPARISON MARKETING:</strong> Publicar tabela comparativa vs Docusing, SignEasy, PandaDoc, AdobeSign (Marketing)</span>
            </li>
          </ol>
        </section>

        {/* RESUMO EXECUTIVO */}
        <section className={`p-6 rounded-lg ${isDark ? 'bg-gradient-to-r from-amber-900 to-orange-900 border border-amber-700' : 'bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-400'}`}>
          <h2 className={`text-3xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            👑 FASE 4: DOMINAÇÃO DE MERCADO
          </h2>
          <div className={`space-y-3 ${isDark ? 'text-amber-50' : 'text-amber-900'}`}>
            <p>
              <strong>🎯 Objetivo:</strong> Consolidar DocuChain como PREMIUM SUPERIOR aos concorrentes globais
            </p>
            <p>
              <strong>🔐 Diferencial Competitivo Único:</strong> Blockchain pública + Cadeia de Custódia Legal + Verificação Pública
            </p>
            <p>
              <strong>📊 Status Atual:</strong> 7 tarefas críticas de design & positioning | 17% completo | Aceleração esperada
            </p>
            <p>
              <strong>🚀 Próximas Semanas:</strong> Redesign landing page + dashboard premium + campaign vs concorrentes
            </p>
            <p>
              <strong>📈 Impacto Esperado:</strong> +300% improvement em conversão | Dominação de categoria blockchain + assinatura digital
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}