import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Code, Settings, Zap, Lock, Server } from 'lucide-react';

export default function Documentation() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} py-12 px-4`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold">Documentação DocuChain</h1>
          </div>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Guia completo de implementação, uso e integração
          </p>
        </div>

        <Tabs defaultValue="getting-started" className="space-y-6">
          <TabsList className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <TabsTrigger value="getting-started">Começar</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="integration">Integração</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Getting Started */}
          <TabsContent value="getting-started" className="space-y-6">
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Início Rápido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Criar uma Conta</h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Acesse a plataforma e crie sua conta. Você recebe 3 assinaturas grátis no plano Free.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. Assinar seu Primeiro Documento</h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Navegue até "Assinar" e faça upload do seu PDF. Complete a assinatura digital.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. Registrar no Blockchain</h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Defina a data de expiração e registre no blockchain Polygon Mumbai.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">4. Compartilhar com Outros</h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Use "Meus Documentos" para compartilhar com emails de colaboradores.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle>Requisitos do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✅ Navegador moderno (Chrome, Firefox, Safari, Edge)</li>
                  <li>✅ Conexão internet (offline parcial suportado)</li>
                  <li>✅ JavaScript habilitado</li>
                  <li>✅ Cookies/Storage habilitados</li>
                  <li>✅ Acesso ao Polygon Mumbai Testnet (opcional para dev)</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className="text-lg">Assinatura Digital</CardTitle>
                </CardHeader>
                <CardContent className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Assine documentos com validação criptográfica e rastreabilidade completa.
                </CardContent>
              </Card>

              <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className="text-lg">Blockchain Registry</CardTitle>
                </CardHeader>
                <CardContent className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Registre documentos no blockchain Polygon para imutabilidade comprovada.
                </CardContent>
              </Card>

              <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className="text-lg">Templates</CardTitle>
                </CardHeader>
                <CardContent className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Crie templates reutilizáveis com campos dinâmicos.
                </CardContent>
              </Card>

              <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className="text-lg">Workflows Automáticos</CardTitle>
                </CardHeader>
                <CardContent className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Automate processos com steps sequenciais, paralelos e condicionais.
                </CardContent>
              </Card>

              <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className="text-lg">Sincronização Offline</CardTitle>
                </CardHeader>
                <CardContent className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Trabalhe offline e sincronize automaticamente quando reconectar.
                </CardContent>
              </Card>

              <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className="text-lg">Notificações Push</CardTitle>
                </CardHeader>
                <CardContent className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Receba notificações em tempo real sobre eventos importantes.
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* API */}
          <TabsContent value="api" className="space-y-6">
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  REST API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge className="mb-2">POST</Badge>
                  <p className="font-mono text-sm">/api/document/sign</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Assinar documento com hash e data de expiração
                  </p>
                </div>
                <div>
                  <Badge className="mb-2 bg-blue-600">GET</Badge>
                  <p className="font-mono text-sm">/api/documents</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Listar documentos do usuário com paginação
                  </p>
                </div>
                <div>
                  <Badge className="mb-2 bg-green-600">POST</Badge>
                  <p className="font-mono text-sm">/api/document/share</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Compartilhar documento com outro usuário
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle>Autenticação</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Use seu token API no header Authorization:
                </p>
                <pre className={`p-3 rounded text-xs overflow-x-auto ${
                  isDark ? 'bg-gray-900' : 'bg-gray-100'
                }`}>
{`Authorization: Bearer YOUR_API_TOKEN`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integration */}
          <TabsContent value="integration" className="space-y-6">
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Integrações Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">Google Drive</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Sincronize documentos automaticamente com Google Drive
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold">Webhooks</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Receba eventos em tempo real em sua aplicação
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold">Slack</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Notificações no seu workspace Slack
                  </p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold">Microsoft Teams</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Integração com Microsoft Teams
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle>Setup de Webhooks</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm list-decimal list-inside">
                  <li>Acesse Configurações Enterprise → Webhooks</li>
                  <li>Clique em "Novo Webhook"</li>
                  <li>Insira URL de callback (ex: https://api.seu-app.com/webhooks)</li>
                  <li>Selecione eventos a disparar</li>
                  <li>Salve e teste com o botão "Enviar Teste"</li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq" className="space-y-6">
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Qual blockchain usam?</h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Utilizamos Polygon Mumbai Testnet para desenvolvimento. Em produção, usamos Polygon Mainnet com taxas mínimas.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Os documentos são criptografados?</h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Sim! Usamos AES-256-GCM para criptografia end-to-end. Apenas usuários autorizados acessam o conteúdo.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Funciona offline?</h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Sim! Service Worker caches ativos (documentos, workflows, permissões). Sincronização automática ao reconectar.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Como alterar meu plano?</h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Vá para Planos na navegação. Upgrading é imediato. Downgrade válido no próximo ciclo.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Qual suporte recebo?</h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Free: via email. Pro: 24/7 chat. Enterprise: dedicated account manager.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}