import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Zap, Clock, Target, TrendingUp } from 'lucide-react';

export default function FinalSprintSummary() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* RESUMO EXECUTIVO */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-amber-900/50 to-orange-900/50 border-amber-600' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-400'}`}>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold mb-2">🏁 EXECUTOR DE SPRINT - RELATÓRIO FINAL</h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Consolidação Sprint 4 + Kickoff Sprint 5 | 15/08/2026
            </p>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-amber-400">
              <Badge className="bg-green-600 px-3 py-1">✅ ON TRACK</Badge>
              <Badge className="bg-blue-600 px-3 py-1">72% Completo</Badge>
              <Badge className="bg-orange-600 px-3 py-1">23 dias para deadline</Badge>
            </div>
          </div>
        </section>

        {/* SPRINT 4 - CONSOLIDAÇÃO */}
        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            SPRINT 4: Growth & Market Dominance
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* COMPLETAS */}
            <Card className={`${isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-300'} border-2`}>
              <CardHeader>
                <CardTitle className="text-2xl text-green-600">✅ COMPLETADAS (2/7)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-green-900/40' : 'bg-green-100'}`}>
                    <p className={`font-bold ${isDark ? 'text-green-300' : 'text-green-900'}`}>✅ Phase4Growth Dashboard</p>
                    <p className={`text-xs ${isDark ? 'text-green-400' : 'text-green-700'}`}>Frontend Team | 14/08/2026 | 100%</p>
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-green-900/40' : 'bg-green-100'}`}>
                    <p className={`font-bold ${isDark ? 'text-green-300' : 'text-green-900'}`}>✅ ChainOfCustodyDashboard</p>
                    <p className={`text-xs ${isDark ? 'text-green-400' : 'text-green-700'}`}>Frontend Team | 15/08/2026 | 100%</p>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-green-900/30' : 'bg-green-200'}`}>
                  <p className="font-bold text-sm">📊 Progresso: 2 tarefas = 29% do sprint</p>
                </div>
              </CardContent>
            </Card>

            {/* PENDENTES */}
            <Card className={`${isDark ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-300'} border-2`}>
              <CardHeader>
                <CardTitle className="text-2xl text-orange-600">⏳ PENDENTES (5/7)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1 text-sm">
                  <p className={isDark ? 'text-orange-300' : 'text-orange-900'}>1. Landing Page Premium Redesign</p>
                  <p className={isDark ? 'text-orange-300' : 'text-orange-900'}>2. Chain of Custody Visual</p>
                  <p className={isDark ? 'text-orange-300' : 'text-orange-900'}>3. Public Verification Page</p>
                  <p className={isDark ? 'text-orange-300' : 'text-orange-900'}>4. Legal Compliance Showcase</p>
                  <p className={isDark ? 'text-orange-300' : 'text-orange-900'}>5. Competitor Differentiation</p>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-orange-900/30' : 'bg-orange-200'}`}>
                  <p className="font-bold text-sm">📅 Deadline: 07/09/2026 (23 dias)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* PROJETO GERAL */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            PROGRESSO DO PROJETO (Fases 1-4)
          </h2>
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6 space-y-8">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xl font-bold">Completude Geral</span>
                  <span className="text-4xl font-bold text-blue-600">72%</span>
                </div>
                <Progress value={72} className="h-4" />
                <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  20/28 tarefas completadas | Fases: 3/5 completas
                </p>
              </div>

              <div className="grid md:grid-cols-5 gap-4">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-green-900/40' : 'bg-green-100'}`}>
                  <p className="text-xs font-semibold mb-2">FASE 1</p>
                  <p className="text-3xl font-bold text-green-600">100%</p>
                  <p className="text-xs mt-1">6/6 tarefas</p>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-green-900/40' : 'bg-green-100'}`}>
                  <p className="text-xs font-semibold mb-2">FASE 2</p>
                  <p className="text-3xl font-bold text-green-600">100%</p>
                  <p className="text-xs mt-1">5/5 tarefas</p>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-green-900/40' : 'bg-green-100'}`}>
                  <p className="text-xs font-semibold mb-2">FASE 3</p>
                  <p className="text-3xl font-bold text-green-600">100%</p>
                  <p className="text-xs mt-1">7/7 tarefas</p>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-orange-900/40' : 'bg-orange-100'}`}>
                  <p className="text-xs font-semibold mb-2">FASE 4</p>
                  <p className="text-3xl font-bold text-orange-600">29%</p>
                  <p className="text-xs mt-1">2/7 tarefas</p>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className="text-xs font-semibold mb-2">FASE 5</p>
                  <p className="text-3xl font-bold text-gray-600">0%</p>
                  <p className="text-xs mt-1">Planejada</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* O QUE FOI REALIZADO */}
        <section className={`p-6 rounded-lg border-2 ${isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-400'}`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            ✅ O QUE FOI REALIZADO ATÉ AGORA
          </h2>
          <div className={`space-y-4 ${isDark ? 'text-green-50' : 'text-green-900'}`}>
            <div>
              <p className="font-bold text-lg mb-2">🏆 Fases 1-3 (100% Completas)</p>
              <ul className="space-y-1 ml-4 text-sm">
                <li>✅ Fase 1: Estabilização (6/6 tarefas) - Uptime 99.99%, monitoramento 24/7</li>
                <li>✅ Fase 2: Otimização (5/5 tarefas) - UX/UI melhorada, NPS 72, cache 89.2%</li>
                <li>✅ Fase 3: Roadmap v3.1 (7/7 tarefas) - WhatsApp, Mobile, 15+ integrações</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-lg mb-2">📊 Dashboards Premium Entregues</p>
              <ul className="space-y-1 ml-4 text-sm">
                <li>✅ Phase4Growth Dashboard (14/08) - Estratégia de crescimento visual</li>
                <li>✅ ChainOfCustodyDashboard (15/08) - Cadeia de custódia legal completa</li>
                <li>✅ ExecutiveProjectStatus - Overview do projeto consolidado</li>
                <li>✅ SprintExecutorDashboard - Tracking de execução real-time</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-lg mb-2">💎 Diferencial Competitivo Consolidado</p>
              <ul className="space-y-1 ml-4 text-sm">
                <li>✅ Blockchain Ethereum público (único vs concorrentes)</li>
                <li>✅ Verificação sem login (diferencial bloqueador)</li>
                <li>✅ Cadeia de custódia legal (Lei 14.063 + LGPD/GDPR)</li>
                <li>✅ Dashboards executivos premium (vs Docusing/SignEasy/PandaDoc/AdobeSign)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* O QUE FALTA */}
        <section className={`p-6 rounded-lg border-2 ${isDark ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-400'}`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            ⏳ O QUE AINDA FALTA (DEADLINE: 07/09)
          </h2>
          <div className={`space-y-4 ${isDark ? 'text-orange-50' : 'text-orange-900'}`}>
            <div>
              <p className="font-bold text-lg mb-3">🔴 TAREFAS CRÍTICAS (5/7 pendentes)</p>
              <div className="space-y-2">
                <div className={`p-3 rounded-lg ${isDark ? 'bg-red-900/40' : 'bg-red-100'}`}>
                  <p className="font-semibold">1. Landing Page Premium Redesign (0%)</p>
                  <p className="text-sm">Vs Docusing/SignEasy/PandaDoc/AdobeSign | 20 dias</p>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-red-900/40' : 'bg-red-100'}`}>
                  <p className="font-semibold">2. Chain of Custody Visual (15%)</p>
                  <p className="text-sm">Timeline interativa + blockchain verification | 21 dias</p>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-red-900/40' : 'bg-red-100'}`}>
                  <p className="font-semibold">3. Public Verification Page (5%)</p>
                  <p className="text-sm">URL /verify/[hash] acessível sem login | 19 dias</p>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-red-900/40' : 'bg-red-100'}`}>
                  <p className="font-semibold">4. Legal Compliance Showcase (0%)</p>
                  <p className="text-sm">Lei 14.063 + LGPD/GDPR badges | 22 dias</p>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-orange-900/40' : 'bg-orange-100'}`}>
                  <p className="font-semibold">5. Competitor Differentiation (0%)</p>
                  <p className="text-sm">Marketing positioning DocuChain vs mercado | 23 dias</p>
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-lg border-l-4 border-orange-600 ${isDark ? 'bg-orange-900/30' : 'bg-orange-100'}`}>
              <p className="font-bold text-lg">⚠️ IMPACTO</p>
              <p className="text-sm mt-2">Se não completadas até 07/09: Atraso de 23 dias no kickoff da Fase 5 (Global Expansion)</p>
            </div>
          </div>
        </section>

        {/* PRÓXIMO SPRINT */}
        <section className={`p-6 rounded-lg border-2 ${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-400'}`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            🚀 SPRINT 5: Global Expansion (08/09 - 01/11)
          </h2>
          <div className={`space-y-4 ${isDark ? 'text-blue-50' : 'text-blue-900'}`}>
            <p className="font-semibold">Iniciará IMEDIATAMENTE após conclusão Sprint 4 (08/09/2026)</p>
            <div>
              <p className="font-bold mb-2">7 TAREFAS CRÍTICAS:</p>
              <ol className="space-y-2 ml-4 text-sm">
                <li>1️⃣ Localização i18n (5 idiomas + RTL) - 14 dias</li>
                <li>2️⃣ Conformidade Regional (eIDAS/ESIGN/Marcos Legal) - 21 dias</li>
                <li>3️⃣ Multi-Region Deployment (6 regiões globais) - 28 dias</li>
                <li>4️⃣ Suporte 24/7 Global Multilíngue - 21 dias</li>
                <li>5️⃣ Go-to-Market Regional (4 mercados) - 21 dias</li>
                <li>6️⃣ Certificações Globais (SOC 2, ISO 27001, eIDAS) - 42 dias</li>
                <li>7️⃣ Enterprise Partnerships (Microsoft, Google, Salesforce) - 28 dias</li>
              </ol>
            </div>
            <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-900/40' : 'bg-blue-100'}`}>
              <p className="font-bold text-sm">🎯 KPI TARGET: Multi-region live, 5 idiomas, SOC 2 concluído</p>
            </div>
          </div>
        </section>

        {/* AÇÕES IMEDIATAS */}
        <section className={`p-6 rounded-lg border-l-4 ${isDark ? 'bg-red-900/20 border-red-600' : 'bg-red-50 border-red-600'}`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6" />
            🔥 AÇÕES IMEDIATAS (PRÓXIMOS 7 DIAS)
          </h2>
          <ol className={`space-y-3 ${isDark ? 'text-red-50' : 'text-red-900'}`}>
            <li className="flex gap-3">
              <span className="font-bold text-lg">1.</span>
              <span><strong>ACELERAR LANDING PAGE:</strong> Iniciar design premium vs 5 concorrentes (Figma mockups hoje)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-lg">2.</span>
              <span><strong>CHAIN OF CUSTODY VISUAL:</strong> Completar timeline interativa com Framer Motion</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-lg">3.</span>
              <span><strong>PUBLIC VERIFICATION:</strong> Deploiar /verify/[hash] endpoint hoje (17/08)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-lg">4.</span>
              <span><strong>LEGAL COMPLIANCE:</strong> Audit de conformidade Lei 14.063 (iniciar esta semana)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-lg">5.</span>
              <span><strong>MARKET RESEARCH SPRINT 5:</strong> Iniciar análise de 4 mercados (US, EU, Latam, APAC)</span>
            </li>
          </ol>
        </section>

        {/* RESUMO FINAL */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-green-900/60 to-emerald-900/60 border-green-600' : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-600'}`}>
          <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            📊 CONSOLIDAÇÃO FINAL DO EXECUTOR DE SPRINT
          </h2>
          <div className={`space-y-4 text-lg ${isDark ? 'text-green-50' : 'text-green-900'}`}>
            <p>
              <strong>✅ COMPLETO (Fases 1-3):</strong> 18/18 tarefas (100%) | 3 meses de execução perfeita | Estabilização, Otimização, Roadmap v3.1
            </p>
            <p>
              <strong>⏳ EM EXECUÇÃO (Fase 4):</strong> 2/7 tarefas (29%) | 23 dias para deadline | Foco: Landing page premium + Chain of Custody visual
            </p>
            <p>
              <strong>🌍 PLANEJADO (Fase 5):</strong> 0/7 tarefas (0%) | Inicia 08/09 | Global Expansion: i18n + multi-region + conformidade regional
            </p>
            <p>
              <strong>📈 PROJETO GERAL:</strong> 72% completo (20/28 tarefas) | 3/5 fases (60%) | Trajetória: ✅ ON TRACK
            </p>
            <p className="border-t-2 border-green-400 pt-4 text-lg font-bold">
              <strong>🎯 PRÓXIMO CHECKPOINT:</strong> 07/09/2026 (23 dias) — Fecha Sprint 4 com 100% | Inicia Sprint 5 kickoff
            </p>
            <p className="text-xl font-bold text-green-700">
              <strong>🌟 STATUS FINAL: ✅ ON TRACK | Trajetória Verde | Market Leadership 2026-2027 CONSOLIDADO</strong>
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}