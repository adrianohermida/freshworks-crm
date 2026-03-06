import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, CheckCircle2, AlertCircle, Zap } from 'lucide-react';

export default function FreshdeskDocumentation() {
  const [selectedTab, setSelectedTab] = useState('endpoints');

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold dark:text-white">Documentação API Freshdesk</h1>
        <p className="text-gray-600 dark:text-gray-400">Guia completo de integração e endpoints</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="auth">Autenticação</TabsTrigger>
          <TabsTrigger value="rates">Rate Limit</TabsTrigger>
          <TabsTrigger value="errors">Erros</TabsTrigger>
        </TabsList>

        {/* Endpoints */}
        <TabsContent value="endpoints" className="space-y-4">
          <Card className="dark:bg-slate-900 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Endpoints Implementados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  method: 'POST',
                  path: '/tickets',
                  desc: 'Criar novo ticket',
                  status: '201'
                },
                {
                  method: 'GET',
                  path: '/tickets',
                  desc: 'Listar tickets com filtros',
                  status: '200'
                },
                {
                  method: 'GET',
                  path: '/tickets/{id}',
                  desc: 'Obter detalhes do ticket',
                  status: '200'
                },
                {
                  method: 'PATCH',
                  path: '/tickets/{id}',
                  desc: 'Atualizar status/prioridade',
                  status: '200'
                },
                {
                  method: 'POST',
                  path: '/tickets/{id}/note',
                  desc: 'Adicionar comentário',
                  status: '201'
                }
              ].map((endpoint, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2 dark:border-blue-400">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{endpoint.method}</Badge>
                    <code className="text-sm text-gray-600 dark:text-gray-400">{endpoint.path}</code>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {endpoint.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{endpoint.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Autenticação */}
        <TabsContent value="auth" className="space-y-4">
          <Card className="dark:bg-slate-900 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Autenticação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="font-semibold mb-2 dark:text-white">Bearer Token</h3>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
{`Authorization: Bearer YOUR_API_KEY`}
                </pre>
              </div>
              <div>
                <h3 className="font-semibold mb-2 dark:text-white">Configuração</h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>✓ Token obtido no Freshdesk Dashboard</li>
                  <li>✓ Renovar a cada 6 meses</li>
                  <li>✓ Nunca compartilhar token publicamente</li>
                  <li>✓ Guardar em variáveis de ambiente</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rate Limiting */}
        <TabsContent value="rates" className="space-y-4">
          <Card className="dark:bg-slate-900 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white">Rate Limiting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">Limite</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">100 req/min</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                  <p className="text-sm font-semibold text-purple-900 dark:text-purple-200">Janela</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">60s</p>
                </div>
              </div>
              <div className="border-l-4 border-yellow-500 pl-3 py-2">
                <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">Resposta ao Exceder</p>
                <code className="text-sm text-gray-600 dark:text-gray-400">HTTP 429 Too Many Requests</code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Erros Comuns */}
        <TabsContent value="errors" className="space-y-4">
          <Card className="dark:bg-slate-900 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Tratamento de Erros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { code: '401', title: 'Não Autenticado', solution: 'Verifique token nos settings' },
                { code: '429', title: 'Rate Limit Excedido', solution: 'Aguarde 1min antes de retry' },
                { code: '400', title: 'Dados Inválidos', solution: 'Valide email e campos obrigatórios' },
                { code: '404', title: 'Recurso Não Encontrado', solution: 'Verifique ID do ticket' }
              ].map((error, idx) => (
                <div key={idx} className="border dark:border-slate-700 rounded p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                      {error.code}
                    </Badge>
                    <span className="font-semibold text-sm dark:text-white">{error.title}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">💡 {error.solution}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Reference */}
      <Card className="dark:bg-slate-900 dark:border-slate-700 border-l-4 border-green-500">
        <CardHeader>
          <CardTitle className="text-lg dark:text-white flex items-center gap-2">
            <Code className="w-5 h-5" />
            Quick Reference
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Base URL:</strong> <code className="bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">https://production.freshdesk.com/api/v2</code></p>
          <p><strong>Autenticação:</strong> Bearer Token em header</p>
          <p><strong>Rate Limit:</strong> 100 requests/min</p>
          <p><strong>Timeout:</strong> 30 segundos por request</p>
        </CardContent>
      </Card>
    </div>
  );
}