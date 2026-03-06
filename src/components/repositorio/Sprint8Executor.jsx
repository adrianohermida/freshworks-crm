import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, AlertCircle, Zap, Map } from 'lucide-react';

export default function Sprint8Executor() {
  const [loading, setLoading] = useState(false);

  const tarefas = [
    {
      id: 1,
      titulo: 'TRF 2 (RJ + SP)',
      desc: 'Integrar Tribunal Regional Federal 2ª Região (Rio + São Paulo)',
      status: 'TODO',
      progresso: 0,
      prazo: '2026-03-24',
      tarefas: [
        { t: 'Mapeamento API TRF2', s: false },
        { t: 'Implementar datasource', s: false },
        { t: 'Sincronização processos', s: false },
        { t: 'Validar CNJ compliance', s: false }
      ]
    },
    {
      id: 2,
      titulo: 'TRF 3 (MG + SP Interior)',
      desc: 'Integrar Tribunal Regional Federal 3ª Região',
      status: 'TODO',
      progresso: 0,
      prazo: '2026-03-25',
      tarefas: [
        { t: 'Análise endpoints TRF3', s: false },
        { t: 'Implementar integração', s: false },
        { t: 'Setup cache regional', s: false }
      ]
    },
    {
      id: 3,
      titulo: 'TRF 4 (SC + PR + RS)',
      desc: 'Integrar Tribunal Regional Federal 4ª Região (Sul)',
      status: 'TODO',
      progresso: 0,
      prazo: '2026-03-25',
      tarefas: [
        { t: 'Documentação TRF4 API', s: false },
        { t: 'Datasource + sync', s: false },
        { t: 'Webhooks regionais', s: false }
      ]
    },
    {
      id: 4,
      titulo: 'TRF 5 (CE + PB + RN + PE + AL + SE + BA)',
      desc: 'Integrar Tribunal Regional Federal 5ª Região (Nordeste)',
      status: 'TODO',
      progresso: 0,
      prazo: '2026-03-26',
      tarefas: [
        { t: 'Setup TRF5 endpoints', s: false },
        { t: 'Implementação sync', s: false },
        { t: 'QA multi-estado', s: false }
      ]
    },
    {
      id: 5,
      titulo: 'TJMS + TJMG (TJs Prioritários)',
      desc: 'Expandir tribunais estaduais: Mato Grosso do Sul + Minas Gerais',
      status: 'TODO',
      progresso: 0,
      prazo: '2026-03-26',
      tarefas: [
        { t: 'Integrar TJMS', s: false },
        { t: 'Integrar TJMG', s: false },
        { t: 'Validação cruzada dados', s: false }
      ]
    },
    {
      id: 6,
      titulo: 'TJBA + TJRS (TJs Regionais)',
      desc: 'Adicionar Bahia e Rio Grande do Sul',
      status: 'TODO',
      progresso: 0,
      prazo: '2026-03-27',
      tarefas: [
        { t: 'TJBA integration', s: false },
        { t: 'TJRS integration', s: false },
        { t: 'Setup espelhamento dados', s: false }
      ]
    },
    {
      id: 7,
      titulo: 'Dashboard Cobertura Brasil 100%',
      desc: 'Visualizar todos os tribunais integrados num mapa interativo',
      status: 'TODO',
      progresso: 0,
      prazo: '2026-03-27',
      tarefas: [
        { t: 'Criar mapa tribunais (react-leaflet)', s: false },
        { t: 'Stats por tribunal', s: false },
        { t: 'Drill-down por estado', s: false }
      ]
    },
    {
      id: 8,
      titulo: 'Validação & QA Integração',
      desc: 'E2E tests + performance baseline para cobertura Brasil 100%',
      status: 'TODO',
      progresso: 0,
      prazo: '2026-03-28',
      tarefas: [
        { t: 'E2E tests 6 tribunais', s: false },
        { t: 'Performance teste load', s: false },
        { t: 'Reconciliação dados', s: false },
        { t: 'Deploy staging', s: false }
      ]
    }
  ];

  const sprintInfo = {
    numero: 8,
    titulo: 'Expansão Tribunais - Brasil 100%',
    duracao: '3 semanas (18-21 dias úteis)',
    datainicio: '2026-03-19',
    datafim: '2026-04-07',
    objetivo: 'TRF 2-5 + TJMS, TJMG, TJBA, TJRS = Cobertura Brasil Completa',
    recurso: '3 devs backend + 1 QA',
    impacto: 'Aumento de 60% cobertura nacional 🗺️'
  };

  const progressoTotal = Math.round(
    tarefas.reduce((acc, t) => acc + t.progresso, 0) / tarefas.length
  );

  const tarefasCompletas = tarefas.filter(t => t.progresso === 100).length;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-bold">🗺️ Sprint 8: Expansão Tribunais</h1>
        <p className="text-gray-600">Brasil 100% de cobertura | 4 TRFs + 4 TJs estaduais</p>
        <Badge className="bg-purple-600 mx-auto mt-2">{sprintInfo.duracao}</Badge>
      </div>

      {/* PROGRESSO GERAL */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 border-2 border-purple-300">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Progresso Geral Sprint 8</span>
            <span className="text-3xl font-bold text-purple-600">{progressoTotal}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progressoTotal} className="h-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-gray-600 text-sm">Completas</p>
              <p className="text-2xl font-bold text-green-600">{tarefasCompletas}/8</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Tribunais (TRF)</p>
              <p className="text-2xl font-bold text-blue-600">4</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Estados Novos</p>
              <p className="text-2xl font-bold text-orange-600">13+</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Data Fim</p>
              <p className="text-xl font-bold text-purple-600">07/04</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TABS */}
      <Tabs defaultValue="tarefas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tarefas">Tarefas (8)</TabsTrigger>
          <TabsTrigger value="cobertura">Cobertura Brasil</TabsTrigger>
          <TabsTrigger value="detalhes">Detalhes Sprint</TabsTrigger>
        </TabsList>

        {/* TAREFAS */}
        <TabsContent value="tarefas">
          <div className="space-y-4">
            {tarefas.map((tarefa, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Circle className="w-5 h-5 text-gray-400" />
                        <h3 className="font-bold text-lg">{idx + 1}. {tarefa.titulo}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{tarefa.desc}</p>
                    </div>
                    <Badge variant="outline">⏳ TODO</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Progress value={tarefa.progresso} className="h-2" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {tarefa.tarefas.map((t, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{t.t}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* COBERTURA BRASIL */}
        <TabsContent value="cobertura">
          <Card>
            <CardHeader>
              <CardTitle>🗺️ Cobertura Brasil - Sprint 8</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Tribunais a Integrar:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-purple-600 mb-2">Tribunais Federais (TRF)</p>
                    <ul className="text-sm space-y-1 text-blue-900 dark:text-blue-100">
                      <li>✓ TRF 1 (Brasília) - JÁ TEMOS</li>
                      <li>🔄 TRF 2 (Rio + São Paulo)</li>
                      <li>🔄 TRF 3 (Minas Gerais + SP Interior)</li>
                      <li>🔄 TRF 4 (Santa Catarina + Paraná + Rio Grande do Sul)</li>
                      <li>🔄 TRF 5 (Nordeste - 7 estados)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-orange-600 mb-2">Tribunais Estaduais (TJ)</p>
                    <ul className="text-sm space-y-1 text-blue-900 dark:text-blue-100">
                      <li>✓ TJSP (São Paulo) - JÁ TEMOS</li>
                      <li>🔄 TJMS (Mato Grosso do Sul)</li>
                      <li>🔄 TJMG (Minas Gerais)</li>
                      <li>🔄 TJBA (Bahia)</li>
                      <li>🔄 TJRS (Rio Grande do Sul)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                  <p className="font-bold text-green-700 text-lg">ANTES Sprint 8</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">2 TRFs</p>
                  <p className="text-sm text-green-700 mt-1">TJSP + TRF1</p>
                  <p className="text-xs text-green-600 mt-2">~2-3 estados</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <p className="font-bold text-blue-700 text-lg">DEPOIS Sprint 8</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">9 Tribunais</p>
                  <p className="text-sm text-blue-700 mt-1">6 TRFs + 3 TJs</p>
                  <p className="text-xs text-blue-600 mt-2">Brasil 100% 🎉</p>
                </div>
              </div>

              <div className="border-l-4 border-purple-600 pl-4 py-2 bg-purple-50 dark:bg-purple-900 rounded">
                <p className="font-semibold text-purple-900 dark:text-purple-100">Impacto Estimado:</p>
                <ul className="text-sm text-purple-900 dark:text-purple-100 space-y-1 mt-2">
                  <li>• Base de processos: +500k novos processos</li>
                  <li>• Usuários potenciais: +2M advogados/juízes</li>
                  <li>• API calls diárias: +50 mil/dia</li>
                  <li>• Cobertura geográfica: 100% Brasil 🇧🇷</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DETALHES */}
        <TabsContent value="detalhes">
          <Card>
            <CardHeader>
              <CardTitle>📋 Detalhes Sprint 8</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-gray-700 mb-3">Sprint Info</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Número:</strong> {sprintInfo.numero}</p>
                    <p><strong>Título:</strong> {sprintInfo.titulo}</p>
                    <p><strong>Duração:</strong> {sprintInfo.duracao}</p>
                    <p><strong>Início:</strong> {sprintInfo.datainicio}</p>
                    <p><strong>Fim:</strong> {sprintInfo.datafim}</p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-3">Recursos</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Time:</strong> {sprintInfo.recurso}</p>
                    <p><strong>Objetivo:</strong> {sprintInfo.objetivo}</p>
                    <p><strong>Impacto:</strong> {sprintInfo.impacto}</p>
                    <p><strong>Prioridade:</strong> 🔴 CRÍTICA</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900 border border-green-200 rounded-lg p-4">
                <p className="font-semibold mb-2 text-green-900 dark:text-green-100">✅ Pré-requisitos:</p>
                <ul className="text-sm text-green-900 dark:text-green-100 space-y-1">
                  <li>✓ Sprint 7 (i18n) concluído</li>
                  <li>✓ Produção estável</li>
                  <li>✓ Documentação tribunais obtida</li>
                  <li>✓ APIgen patterns consolidados</li>
                </ul>
              </div>

              <div className="bg-red-50 dark:bg-red-900 border border-red-200 rounded-lg p-4">
                <p className="font-semibold mb-2 text-red-900 dark:text-red-100">⚠️ Riscos Críticos:</p>
                <ul className="text-sm text-red-900 dark:text-red-100 space-y-1">
                  <li>• Inconsistência API entre tribunais (cada um tem formato diferente)</li>
                  <li>• Limite rate na sincronização multi-tribunal</li>
                  <li>• TRF5 tem 7 estados com sincronizações paralelas</li>
                  <li>• Necessário load balancing e cache agressivo</li>
                </ul>
              </div>

              <Button className="w-full h-12 text-lg bg-purple-600 hover:bg-purple-700">
                🚀 Iniciar Sprint 8 (Expansão Brasil)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* RESUMO */}
      <Card className="border-2 border-purple-400">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="font-bold text-lg">📊 Resumo Sprint 8 Kickoff</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <p className="text-gray-600">Tribunais Total</p>
                <p className="text-2xl font-bold text-green-600">9</p>
                <p className="text-xs text-gray-500 mt-1">TRF + TJ combinados</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <p className="text-gray-600">Estados Cobertos</p>
                <p className="text-2xl font-bold text-blue-600">27</p>
                <p className="text-xs text-gray-500 mt-1">Brasil 100%</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                <p className="text-gray-600">Progresso Inicial</p>
                <p className="text-2xl font-bold text-purple-600">0%</p>
                <p className="text-xs text-gray-500 mt-1">Sprint novo | Ready to go</p>
              </div>
            </div>
            <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="font-bold text-lg">Porcentagem de Completude: <span className="text-purple-600">0%</span></p>
              <p className="text-xs text-gray-600 mt-1">Sprint 8 iniciando | 21 dias para Brasil 100%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}