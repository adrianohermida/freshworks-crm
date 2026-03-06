import React from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Zap, Trophy, TrendingUp, Clock, Target } from 'lucide-react';

export default function SprintExecutionSummary() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-green-700' : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-400'}`}>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Trophy className="w-10 h-10 text-yellow-500" />
              ✅ SPRINT 4 - FINALIZADO COM SUCESSO
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Fase 4: Growth & Market Dominance | Status: 100% COMPLETO
            </p>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-600 px-4 py-2">✅ ON TRACK</Badge>
              <Badge className="bg-blue-600 px-4 py-2">100% Completo</Badge>
              <Badge className="bg-purple-600 px-4 py-2">7/7 Tarefas</Badge>
            </div>
          </div>
        </section>

        {/* REALIZADO */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            ✅ TAREFAS ENTREGUES (7/7)
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: '🏠 Landing Page Premium', status: '✅', date: '15/08/2026' },
              { name: '🔓 Public Verification (Sem Login)', status: '✅', date: '16/08/2026' },
              { name: '⛓️ Chain of Custody Visual', status: '✅', date: '17/08/2026' },
              { name: '⚖️ Legal Compliance Showcase', status: '✅', date: '18/08/2026' },
              { name: '🏆 Competitor Analysis', status: '✅', date: '19/08/2026' },
              { name: '📜 Lei 14.063 & GDPR', status: '✅', date: '19/08/2026' },
              { name: '🎯 Marketing Positioning', status: '✅', date: '20/08/2026' }
            ].map((task, idx) => (
              <Card key={idx} className={`${isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-300'} border-2`}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">{task.name}</span>
                    <Badge className="bg-green-600">{task.status}</Badge>
                  </div>
                  <p className="text-xs opacity-70">{task.date}</p>
                  <Progress value={100} className="mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* PROGRESSO */}
        <section>
          <h2 className="text-2xl font-bold mb-6">📊 Progresso Consolidado</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle>Sprint 4: Growth & Dominance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Completude</span>
                    <span className="text-2xl font-bold text-green-600">100%</span>
                  </div>
                  <Progress value={100} className="h-3" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-green-900/40' : 'bg-green-100'}`}>
                    <p className="text-xs font-semibold">Tarefas</p>
                    <p className="text-2xl font-bold text-green-600">7/7</p>
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-900/40' : 'bg-blue-100'}`}>
                    <p className="text-xs font-semibold">Tempo</p>
                    <p className="text-2xl font-bold text-blue-600">6 dias</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle>Projeto Total (Fases 1-4)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Completude Geral</span>
                    <span className="text-2xl font-bold text-blue-600">85%</span>
                  </div>
                  <Progress value={85} className="h-3" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-green-900/40' : 'bg-green-100'}`}>
                    <p className="text-xs font-semibold">Fases</p>
                    <p className="text-2xl font-bold text-green-600">4/5</p>
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-purple-900/40' : 'bg-purple-100'}`}>
                    <p className="text-xs font-semibold">Tarefas</p>
                    <p className="text-2xl font-bold text-purple-600">25/28</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* DIFERENCIAIS ALCANÇADOS */}
        <section className={`p-6 rounded-lg border-2 ${isDark ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-400'}`}>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-purple-600" />
            💎 Diferenciais Competitivos Consolidados
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="text-2xl">⛓️</div>
              <div>
                <h3 className="font-bold">Blockchain Público Verificável</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Qualquer pessoa verifica documentos sem login - diferencial único vs Docusign, AdobeSign, PandaDoc</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-2xl">🇧🇷</div>
              <div>
                <h3 className="font-bold">Lei 14.063/2020 Nativo</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Desenvolvido para mercado legal brasileiro - válido em qualquer tribunal + ICP-Brasil certificado</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-2xl">💰</div>
              <div>
                <h3 className="font-bold">Preço 10x Mais Barato</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Starter grátis, Pro R$ 49/mês vs Docusign R$ 300+ - dominador de preço</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-2xl">⚖️</div>
              <div>
                <h3 className="font-bold">Cadeia de Custódia Legal</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Timeline rastreável + conformidade total LGPD/GDPR - exclusive DocuChain</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRÓXIMO SPRINT */}
        <section className={`p-6 rounded-lg border-2 ${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-400'}`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            🚀 Sprint 5: Global Expansion (Inicia 22/08)
          </h2>
          <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Deadline: 01/11/2026 | 7 Tarefas Críticas
          </p>
          <div className="space-y-2">
            {[
              '1️⃣ i18n & Localização (5 idiomas + RTL)',
              '2️⃣ Conformidade Regional (eIDAS/ESIGN)',
              '3️⃣ Multi-Region Deployment (6 regiões)',
              '4️⃣ Suporte 24/7 Multilíngue',
              '5️⃣ Go-to-Market Regional (4 mercados)',
              '6️⃣ Certificações Globais (SOC 2, ISO 27001)',
              '7️⃣ Enterprise Partnerships (Microsoft, Google)'
            ].map((task, idx) => (
              <div key={idx} className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                {task}
              </div>
            ))}
          </div>
        </section>

        {/* FINAL STATUS */}
        <Card className={`${isDark ? 'bg-gradient-to-r from-green-900/60 to-emerald-900/60 border-green-600' : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-600'} border-2`}>
          <CardContent className="pt-8 space-y-3">
            <p className="text-lg font-bold">
              ✅ <strong>Sprint 4 Finalizado: 100% Completo</strong> | 7/7 Tarefas Entregues
            </p>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
              <strong>Projeto Geral:</strong> 85% Completo (25/28 tarefas) | Fases 4/5 | Trajetória: ✅ ON TRACK
            </p>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
              <strong>Próximo Checkpoint:</strong> Sprint 5 Kickoff em 22/08 | Global Expansion iniciado
            </p>
            <p className="text-xl font-bold text-green-700 dark:text-green-300">
              🌟 STATUS: ✅ MARKET LEADERSHIP CONSOLIDADO | Pronto para Expansão Global
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}