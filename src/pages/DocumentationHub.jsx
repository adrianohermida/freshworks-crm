import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, FileText, AlertCircle } from 'lucide-react';

export default function DocumentationHub() {
  const [activeTab, setActiveTab] = useState('guides');

  const MODULES = [
    {
      name: 'Biblioteca CNJ',
      icon: '📚',
      description: 'Acesso a tabelas TPU (Classes, Movimentos, Assuntos, Documentos)',
      guide: 'Navegue até Admin > CNJ Lib para acessar as tabelas. Use os filtros para buscar por código ou nome.',
      features: ['Classes Processuais', 'Movimentos', 'Assuntos', 'Documentos']
    },
    {
      name: 'Importação TPU',
      icon: '📥',
      description: 'Importe dados TPU em lote via CSV com validação automática',
      guide: 'Vá para Admin > TPU. Clique "Novo Endpoint" ou arraste um arquivo CSV. O sistema valida automaticamente.',
      features: ['Upload CSV', 'Validação de Schema', 'Preview de Dados', 'Importação em Lote']
    },
    {
      name: 'Módulo Juízos',
      icon: '⚖️',
      description: 'Gerencie órgãos judiciários, serventias e foros',
      guide: 'Em Admin > Juízos, use as 3 abas para gerenciar JuizoCNJ, Serventias e CodigoForoTJSP.',
      features: ['CRUD de Juízos', 'Gerenciamento de Serventias', 'Sincronização de Foros']
    },
    {
      name: 'Endpoints & Testes',
      icon: '🧪',
      description: 'Configure endpoints de tribunais e teste conformidade de schemas',
      guide: 'Em Admin > Testes, registre endpoints e clique "Testar" para validação de conectividade.',
      features: ['Gerenciamento de Endpoints', 'Testes de Conectividade', 'Validação de Schemas']
    },
    {
      name: 'Movimentos & Enriquecimento',
      icon: '📊',
      description: 'Capture movimentos automaticamente e enriqueça processos',
      guide: 'Em Admin > Movimentos, clique "Iniciar Captura" para sincronizar. Em seguida, execute enriquecimento.',
      features: ['Captura de Movimentos', 'Deduplicação', 'Enriquecimento TPU', 'Cálculo de Prazos']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              📚 Centro de Documentação
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Guias completos, API documentation e troubleshooting
            </p>
          </div>
          <Badge className="bg-cyan-600 text-lg px-4 py-2">Fase 6</Badge>
        </div>

        {/* TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="guides">📖 Guias de Uso</TabsTrigger>
            <TabsTrigger value="api">🔌 API Documentation</TabsTrigger>
            <TabsTrigger value="troubleshooting">⚠️ Troubleshooting</TabsTrigger>
          </TabsList>

          {/* GUIDES TAB */}
          <TabsContent value="guides" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MODULES.map((module, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-2xl">{module.icon}</span>
                          {module.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {module.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold mb-2">Como Usar:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {module.guide}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-2">Recursos:</p>
                      <div className="flex flex-wrap gap-1">
                        {module.features.map((feature, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* API TAB */}
          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  REST API Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded font-mono text-xs">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">BibliotecaCNJ</p>
                  <p className="text-gray-600 dark:text-gray-400">GET /api/tpu/classes</p>
                  <p className="text-gray-600 dark:text-gray-400">GET /api/tpu/movimentos</p>
                  <p className="text-gray-600 dark:text-gray-400">GET /api/tpu/assuntos</p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded font-mono text-xs">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">Juízos</p>
                  <p className="text-gray-600 dark:text-gray-400">GET /api/juizos</p>
                  <p className="text-gray-600 dark:text-gray-400">POST /api/juizos</p>
                  <p className="text-gray-600 dark:text-gray-400">PUT /api/juizos/:id</p>
                  <p className="text-gray-600 dark:text-gray-400">DELETE /api/juizos/:id</p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded font-mono text-xs">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">Movimentos</p>
                  <p className="text-gray-600 dark:text-gray-400">POST /api/movements/capture</p>
                  <p className="text-gray-600 dark:text-gray-400">POST /api/movements/enrich</p>
                  <p className="text-gray-600 dark:text-gray-400">GET /api/movements/:processId</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TROUBLESHOOTING TAB */}
          <TabsContent value="troubleshooting" className="space-y-4">
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  Problemas Comuns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded">
                  <p className="font-semibold text-sm mb-1">❌ Erro: "API endpoint offline"</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Verifique se a URL do endpoint está correta e se o tribunal está online. Teste conectividade em Admin > Testes.
                  </p>
                </div>

                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded">
                  <p className="font-semibold text-sm mb-1">❌ Erro: "Duplicado detectado"</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Movimentos duplicados foram encontrados. Verifique data/hora e código do movimento. Continue com a importação.
                  </p>
                </div>

                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded">
                  <p className="font-semibold text-sm mb-1">❌ Erro: "Enriquecimento com baixa confiança"</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    O sistema não conseguiu vincular dados com alta confiança. Revise manualmente ou ajuste os filtros TPU.
                  </p>
                </div>

                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <p className="font-semibold text-sm mb-1">⚠️ Aviso: "Taxa de sucesso &lt; 90%"</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Alguns testes falharam. Verifique a suite de testes completa em Admin > QA.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* SUPPORT */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
          <CardHeader>
            <CardTitle className="text-base">📞 Suporte</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-900 dark:text-blue-100 space-y-2">
            <p>• <strong>Documentação:</strong> Consulte este centro de documentação</p>
            <p>• <strong>Testes:</strong> Execute a suite de testes em Admin > QA</p>
            <p>• <strong>Logs:</strong> Verifique logs de erro em Admin > Settings</p>
            <p>• <strong>Contato:</strong> Entre em contato com o time de suporte para problemas críticos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}