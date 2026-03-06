import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  TrendingUp,
  Target,
  Code,
  Server
} from 'lucide-react';

/**
 * Relatório detalhado do Sprint 17 - Status e Progresso
 */
export default function Sprint17Report() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sprint 17 - Relatório Executivo</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Status, pendências e próximas ações</p>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">2</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Páginas Criadas</p>
                <Badge className="mt-2 w-full justify-center bg-blue-100 text-blue-800">✅ Completo</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">2/25</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tarefas Execução</p>
                <Badge className="mt-2 w-full justify-center bg-green-100 text-green-800">8%</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">23</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pendências</p>
                <Badge className="mt-2 w-full justify-center bg-yellow-100 text-yellow-800">⏳ Aberto</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">🔴</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Status Geral</p>
                <Badge className="mt-2 w-full justify-center bg-red-100 text-red-800">Bloqueado</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="status" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="completed">Completo</TabsTrigger>
            <TabsTrigger value="pending">Pendente</TabsTrigger>
            <TabsTrigger value="blockers">Bloqueios</TabsTrigger>
          </TabsList>

          {/* TAB: Status */}
          <TabsContent value="status" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Sprint 17</CardTitle>
                <CardDescription>Distribuição de tarefas por fase</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Fase 1 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Fase 1: Setup Manual Sprint 13</h4>
                    <Badge variant="outline">0/6 (0%)</Badge>
                  </div>
                  <Progress value={0} className="h-2" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Copiar arquivos, gerar VAPID keys, criar icons, configurar .env.local
                  </p>
                </div>

                {/* Fase 2 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Fase 2: Build & Lighthouse</h4>
                    <Badge variant="outline">0/6 (0%)</Badge>
                  </div>
                  <Progress value={0} className="h-2" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Build sem erros, Lighthouse PWA 90+, Performance 80+, Accessibility 90+
                  </p>
                </div>

                {/* Fase 3 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Fase 3: PWA Functionality</h4>
                    <Badge variant="outline">0/5 (0%)</Badge>
                  </div>
                  <Progress value={0} className="h-2" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Service Worker ativo, offline mode, cache storage, push, install prompt
                  </p>
                </div>

                {/* Fase 4 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Fase 4: API Testing</h4>
                    <Badge variant="outline">0/4 (0%)</Badge>
                  </div>
                  <Progress value={0} className="h-2" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Publications, Processes, Intimations, Movements endpoints validados
                  </p>
                </div>

                {/* Fase 5 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Fase 5: Documentação</h4>
                    <Badge variant="outline">0/4 (0%)</Badge>
                  </div>
                  <Progress value={0} className="h-2" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Test report, issues, fixes validados, sign-off para publicação
                  </p>
                </div>

                {/* Overall */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lg">Progresso Total</h4>
                    <Badge className="bg-blue-600 text-lg">2/25 (8%)</Badge>
                  </div>
                  <Progress value={8} className="h-3" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: Completo */}
          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Tarefas Concluídas (2/25)
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">✅ APITesting.jsx criada</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Página interativa com 6 endpoints pré-configurados (Publications, Processes, Intimations, etc)
                    </p>
                    <Badge className="mt-2 text-xs">Sprint 16</Badge>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">✅ Sprint17Validation.jsx criada</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Checklist interativo com 25 itens, validações automáticas (SW, Manifest, Offline), progresso visual
                    </p>
                    <Badge className="mt-2 text-xs">Sprint 17</Badge>
                  </div>
                </div>

                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    <strong>Código:</strong> 100% pronto. Ambas as páginas integradas no menu de navegação.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: Pendente */}
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  Tarefas Pendentes (23/25)
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {/* Fase 1 */}
                  <div className="border-l-4 border-l-yellow-500 pl-4 py-2">
                    <h4 className="font-semibold text-sm mb-2">⏳ Fase 1: Setup Manual (6 tarefas)</h4>
                    <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• Copiar service-worker.js em public/</li>
                      <li>• Copiar manifest.json em public/</li>
                      <li>• Copiar offline.html em public/</li>
                      <li>• Gerar VAPID keys (web-push)</li>
                      <li>• Gerar 9 icons PNG</li>
                      <li>• Configurar .env.local</li>
                    </ul>
                  </div>

                  {/* Fase 2 */}
                  <div className="border-l-4 border-l-yellow-500 pl-4 py-2">
                    <h4 className="font-semibold text-sm mb-2">⏳ Fase 2: Build & Lighthouse (6 tarefas)</h4>
                    <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• Executar `npm run build`</li>
                      <li>• Executar `npm run preview -- --https`</li>
                      <li>• Lighthouse PWA: ≥90</li>
                      <li>• Lighthouse Performance: ≥80</li>
                      <li>• Lighthouse Accessibility: ≥90</li>
                      <li>• Validar asset size &lt;5MB</li>
                    </ul>
                  </div>

                  {/* Fase 3 */}
                  <div className="border-l-4 border-l-yellow-500 pl-4 py-2">
                    <h4 className="font-semibold text-sm mb-2">⏳ Fase 3: PWA Functionality (5 tarefas)</h4>
                    <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• Validar SW status "activated"</li>
                      <li>• Testar offline mode (DevTools)</li>
                      <li>• Verificar cache storage (3 caches)</li>
                      <li>• Testar push notifications</li>
                      <li>• Testar install prompt (mobile)</li>
                    </ul>
                  </div>

                  {/* Fase 4 */}
                  <div className="border-l-4 border-l-yellow-500 pl-4 py-2">
                    <h4 className="font-semibold text-sm mb-2">⏳ Fase 4: API Testing (4 tarefas)</h4>
                    <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• GET /api/publications - validar dados</li>
                      <li>• GET /api/processes - validar dados</li>
                      <li>• GET /api/intimations - validar dados</li>
                      <li>• Query params - validar funcionamento</li>
                    </ul>
                  </div>

                  {/* Fase 5 */}
                  <div className="border-l-4 border-l-yellow-500 pl-4 py-2">
                    <h4 className="font-semibold text-sm mb-2">⏳ Fase 5: Documentação (4 tarefas)</h4>
                    <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• Test report documentado</li>
                      <li>• Issues identificadas listadas</li>
                      <li>• Fixes aplicadas validadas</li>
                      <li>• Sign-off para publicação</li>
                    </ul>
                  </div>
                </div>

                <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                    <strong>Status:</strong> Aguardando execução do usuário. Usar página "Sprint 17 Validation" para acompanhar progresso.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: Bloqueios */}
          <TabsContent value="blockers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Bloqueios Críticos
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    <strong>🔴 CRÍTICO - Fase 1: Setup Manual não executado</strong>
                    <p className="mt-2 text-sm">
                      Sem os arquivos em public/ (service-worker, manifest, offline), as Fases 2-5 não podem ser validadas.
                    </p>
                    <p className="mt-2 text-sm font-semibold">Ação: Executar guia em PWAManualSetupInstructions (2-3 horas)</p>
                  </AlertDescription>
                </Alert>

                <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                    <strong>⏳ BLOQUEADOR - Build não testado</strong>
                    <p className="mt-2 text-sm">
                      Sem executar `npm run build`, não é possível validar Lighthouse scores.
                    </p>
                    <p className="mt-2 text-sm font-semibold">Ação: Executar build após Fase 1</p>
                  </AlertDescription>
                </Alert>

                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    <strong>ℹ️ INFO - Fase 4 depende da API estar disponível</strong>
                    <p className="mt-2 text-sm">
                      Endpoints precisam estar rodando em ambiente de build/preview.
                    </p>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Timeline Estimada
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="w-24 text-sm font-semibold text-blue-600">Hoje</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Setup Manual (Fase 1)</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Copiar 3 arquivos, gerar VAPID, criar icons, npm install, .env.local
                  </p>
                  <p className="text-xs font-semibold mt-2 text-yellow-600">⏱️ 2-3 horas</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-24 text-sm font-semibold text-blue-600">Amanhã</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Build & Lighthouse (Fase 2)</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    npm run build, preview com HTTPS, rodar Lighthouse audits
                  </p>
                  <p className="text-xs font-semibold mt-2 text-yellow-600">⏱️ 1-2 horas</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-24 text-sm font-semibold text-blue-600">Dia 3</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">PWA Tests (Fase 3)</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Testar offline, cache, SW, push, install prompt
                  </p>
                  <p className="text-xs font-semibold mt-2 text-yellow-600">⏱️ 1-2 horas</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-24 text-sm font-semibold text-blue-600">Dia 4</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">API Testing (Fase 4)</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Usar APITesting page para validar endpoints
                  </p>
                  <p className="text-xs font-semibold mt-2 text-yellow-600">⏱️ 1 hora</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-24 text-sm font-semibold text-blue-600">Dia 5</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Documentação (Fase 5)</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Consolidar resultados, documentar issues, sign-off final
                  </p>
                  <p className="text-xs font-semibold mt-2 text-yellow-600">⏱️ 1 hora</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="font-semibold text-sm">⏱️ Total Estimado: 6-9 horas distribuídas em 5 dias</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Tempo pode variar conforme erros encontrados durante Lighthouse audit
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Próximas ações */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-600" />
              Próximas Ações Imediatas
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">1️⃣ Abrir página "Sprint 17 Validation"</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                No menu, em "Sprint 17". Use para acompanhar progresso das 5 fases com validações automáticas.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">2️⃣ Executar Fase 1 - Setup Manual</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Seguir guia em PWAManualSetupInstructions:
              </p>
              <code className="text-xs bg-white dark:bg-slate-800 p-2 rounded block overflow-auto">
                1. Copiar service-worker.js → public/{'\n'}
                2. Copiar manifest.json → public/{'\n'}
                3. Copiar offline.html → public/{'\n'}
                4. npm install web-push{'\n'}
                5. Gerar VAPID keys{'\n'}
                6. Gerar 9 icons{'\n'}
                7. Criar .env.local
              </code>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">3️⃣ Marcar tarefas no checklist</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Conforme executa, marque as checkboxes na página Sprint17Validation para visualizar progresso em tempo real.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}