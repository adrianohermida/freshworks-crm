import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminEndpointManager from '../components/admin/AdminEndpointManager';
import SchemaTestingDashboard from '../components/admin/SchemaTestingDashboard';

export default function AdminEndpointsAndTests() {
  const [activeTab, setActiveTab] = useState('endpoints');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              🧪 Endpoints & Testes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie endpoints de tribunais, teste conectividade e valide conformidade de schemas
            </p>
          </div>
          <Badge className="bg-cyan-600 text-lg px-4 py-2">6 Schemas</Badge>
        </div>

        {/* TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="endpoints">🌐 Gerenciar Endpoints</TabsTrigger>
            <TabsTrigger value="tests">✓ Testes de Schemas</TabsTrigger>
          </TabsList>

          {/* ENDPOINTS TAB */}
          <TabsContent value="endpoints" className="space-y-4">
            <AdminEndpointManager />
          </TabsContent>

          {/* TESTS TAB */}
          <TabsContent value="tests" className="space-y-4">
            <SchemaTestingDashboard />
          </TabsContent>
        </Tabs>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
            <CardHeader>
              <CardTitle className="text-base">🔌 Sobre Endpoints</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-900 dark:text-blue-100 space-y-2">
              <p>• <strong>Teste de Conectividade:</strong> Verifica se o endpoint está respondendo</p>
              <p>• <strong>Tempo de Resposta:</strong> Mede latência da API</p>
              <p>• <strong>Tipos de Auth:</strong> API_KEY, OAuth, Basic Auth</p>
              <p>• <strong>Status:</strong> Online/Offline em tempo real</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
            <CardHeader>
              <CardTitle className="text-base">✓ Testes de Schema</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-green-900 dark:text-green-100 space-y-2">
              <p>• <strong>6 Schemas Testados:</strong> Classes, Movimentos, Assuntos, Documentos, Juízos, Serventias</p>
              <p>• <strong>4 Validações:</strong> Estrutura, Tipos, Campos Obrigatórios, Integridade</p>
              <p>• <strong>Relatório Detalhado:</strong> Identificação e solução de problemas</p>
              <p>• <strong>Taxa de Sucesso:</strong> Conformidade com padrões TPU/DataJud</p>
            </CardContent>
          </Card>
        </div>

        {/* INTEGRATION GUIDE */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">📚 Guia de Integração</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-sm font-semibold mb-2">1. Registrar Endpoint</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Clique em "Novo Endpoint" e preencha os dados do tribunal. Escolha o tipo de autenticação apropriado.
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-sm font-semibold mb-2">2. Testar Conectividade</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Use o botão "Testar" para verificar se o endpoint está respondendo. O sistema fará uma requisição de teste.
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-sm font-semibold mb-2">3. Validar Schemas</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Vá para a aba "Testes de Schemas" e clique em "Executar Testes" para validar todos os schemas.
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-sm font-semibold mb-2">4. Monitorar Status</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                O painel mostrará em tempo real o status de cada endpoint e a taxa de sucesso dos testes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}