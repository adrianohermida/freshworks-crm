import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProcessMovementCapture from '../components/processes/ProcessMovementCapture';
import ProcessEnrichmentPanel from '../components/processes/ProcessEnrichmentPanel';

export default function ProcessMovementAndEnrichment() {
  const [activeTab, setActiveTab] = useState('movements');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              📊 Movimentos & Enriquecimento
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Capture movimentos automaticamente e enriqueça processos com dados TPU e juízos
            </p>
          </div>
          <Badge className="bg-cyan-600 text-lg px-4 py-2">Fase 5</Badge>
        </div>

        {/* TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="movements">🎯 Captura de Movimentos</TabsTrigger>
            <TabsTrigger value="enrichment">⚡ Enriquecimento de Processos</TabsTrigger>
          </TabsList>

          {/* MOVEMENTS TAB */}
          <TabsContent value="movements" className="space-y-4">
            <ProcessMovementCapture />
          </TabsContent>

          {/* ENRICHMENT TAB */}
          <TabsContent value="enrichment" className="space-y-4">
            <ProcessEnrichmentPanel />
          </TabsContent>
        </Tabs>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
            <CardHeader>
              <CardTitle className="text-base">🎯 Captura de Movimentos</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-900 dark:text-blue-100 space-y-2">
              <p>• <strong>API DataJud:</strong> Sincroniza em tempo real com API oficial</p>
              <p>• <strong>Deduplicação:</strong> Detecta movimentos duplicados automaticamente</p>
              <p>• <strong>Status de Sincronização:</strong> Monitora sucesso e erros</p>
              <p>• <strong>Associação CNJ:</strong> Vincula automaticamente aos processos</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
            <CardHeader>
              <CardTitle className="text-base">⚡ Enriquecimento</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-green-900 dark:text-green-100 space-y-2">
              <p>• <strong>TPU Integration:</strong> Complementa com dados da Tabela Processual Unificada</p>
              <p>• <strong>Localização:</strong> Vincula juízos CNJ geograficamente</p>
              <p>• <strong>Prazos Legais:</strong> Calcula automaticamente baseado em classe</p>
              <p>• <strong>Confiança:</strong> Indica precisão (0-100%) de cada vinculação</p>
            </CardContent>
          </Card>
        </div>

        {/* WORKFLOW */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">📋 Fluxo de Processamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <p className="font-semibold">DataJud Sync</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sincronizar movimentos da API DataJud em tempo real
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <p className="font-semibold">Deduplicação</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Detectar e marcar movimentos duplicados usando hash SHA-256
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <p className="font-semibold">Associação Processo</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Vincular movimentos aos processos CNJ correspondentes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <p className="font-semibold">Enriquecimento TPU</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Complementar com dados da Tabela Processual Unificada
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <p className="font-semibold">Localização & Prazos</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Vincular juízos CNJ e calcular prazos legais automaticamente
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                6
              </div>
              <div>
                <p className="font-semibold">Webhook Callback</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Notificar sistema sobre conclusão e avisos de confiança baixa
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TECHNICAL DETAILS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">🔧 Detalhes Técnicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded font-mono text-xs">
              <p className="font-semibold mb-1">Deduplicação:</p>
              <p className="text-gray-600 dark:text-gray-400">
                SHA-256(cod_movimento + data_movimento + processo_cnj)
              </p>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded font-mono text-xs">
              <p className="font-semibold mb-1">Retry Logic:</p>
              <p className="text-gray-600 dark:text-gray-400">
                Exponential backoff: 1s, 2s, 4s, 8s (máx 3 tentativas)
              </p>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded font-mono text-xs">
              <p className="font-semibold mb-1">Webhook Security:</p>
              <p className="text-gray-600 dark:text-gray-400">
                HMAC-SHA256 signature validation + timestamp check (&lt; 5 min)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}