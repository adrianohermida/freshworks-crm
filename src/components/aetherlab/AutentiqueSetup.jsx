import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AutentiqueSetup() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [error, setError] = useState(null);

  const handleSetupWebhook = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!webhookUrl) {
        throw new Error('URL do webhook é obrigatória');
      }

      const response = await base44.functions.invoke('setupAutentiqueWebhook', {
        webhook_url: webhookUrl,
        webhook_secret: webhookSecret
      });

      if (response.data.success) {
        setSetupComplete(true);
      }
    } catch (err) {
      setError(err.message || 'Erro ao configurar webhook');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">🔗 Configuração Autentique</h1>
          <p className="text-gray-700">Configure a integração com Autentique para começar a usar LegalChain</p>
        </div>

        {/* STATUS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {setupComplete ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span>✅ Integração Ativa</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <span>⏳ Configuração em Progresso</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                <span className="font-medium">API Version</span>
                <Badge>v2 (GraphQL)</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                <span className="font-medium">Status Webhook</span>
                <Badge className={setupComplete ? 'bg-green-600' : 'bg-gray-600'}>
                  {setupComplete ? 'Configurado' : 'Não configurado'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                <span className="font-medium">Certificação</span>
                <Badge className="bg-green-600">ICP-Brasil</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* WEBHOOK SETUP */}
        {!setupComplete && (
          <Card className="border-2 border-blue-500">
            <CardHeader>
              <CardTitle>Configurar Webhook</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  O webhook recebe eventos do Autentique quando documentos forem assinados, rejeitados, etc.
                </AlertDescription>
              </Alert>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL do Webhook
                </label>
                <Input
                  type="url"
                  placeholder="https://seu-dominio.com/webhook/autentique"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  disabled={loading}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Esta URL receberá POST requests com eventos de assinatura digital
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secret (Opcional)
                </label>
                <Input
                  type="password"
                  placeholder="Deixe em branco para auto-gerar"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  disabled={loading}
                />
                <p className="text-xs text-gray-600 mt-2">
                  Usado para validar assinatura das requisições do webhook
                </p>
              </div>

              {error && (
                <Alert className="border-red-600 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleSetupWebhook}
                disabled={loading || !webhookUrl}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
              >
                {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? 'Configurando...' : 'Configurar Webhook'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* SUCCESS MESSAGE */}
        {setupComplete && (
          <Card className="border-2 border-green-600 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-700">✅ Webhook Configurado com Sucesso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-green-600 bg-white">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  Sua integração com Autentique está ativa e pronta para receber eventos de assinatura digital.
                </AlertDescription>
              </Alert>

              <div className="bg-white p-4 rounded border border-green-200 space-y-2">
                <p className="text-sm font-medium text-gray-700">Eventos que serão recebidos:</p>
                <ul className="text-sm space-y-1 text-gray-600 ml-4">
                  <li>✓ <code className="text-xs bg-gray-100 px-2 py-1 rounded">document.created</code></li>
                  <li>✓ <code className="text-xs bg-gray-100 px-2 py-1 rounded">document.signed</code></li>
                  <li>✓ <code className="text-xs bg-gray-100 px-2 py-1 rounded">signer.signed</code></li>
                  <li>✓ <code className="text-xs bg-gray-100 px-2 py-1 rounded">signer.rejected</code></li>
                  <li>✓ <code className="text-xs bg-gray-100 px-2 py-1 rounded">document.rejected</code></li>
                  <li>✓ <code className="text-xs bg-gray-100 px-2 py-1 rounded">document.closed</code></li>
                </ul>
              </div>

              <Button
                onClick={() => window.location.href = '/'}
                className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
              >
                Ir para Dashboard
              </Button>
            </CardContent>
          </Card>
        )}

        {/* DOCS */}
        <Card>
          <CardHeader>
            <CardTitle>📚 Documentação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium text-gray-900">Endpoints Webhook Disponíveis:</p>
              <div className="mt-2 space-y-2 text-sm text-gray-700">
                <p>
                  <strong>Handler:</strong>{' '}
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">/api/functions/autentiqueWebhookHandler</code>
                </p>
                <p>
                  <strong>Setup:</strong>{' '}
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">/api/functions/setupAutentiqueWebhook</code>
                </p>
                <p>
                  <strong>MCP:</strong>{' '}
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">/api/functions/autentiqueMCPIntegration</code>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t">
              <p className="font-medium text-gray-900">Métodos MCP Disponíveis:</p>
              <ul className="mt-2 space-y-1 text-sm text-gray-700 list-disc list-inside">
                <li>createDocument - Criar novo documento</li>
                <li>sendToSign - Enviar para assinatura</li>
                <li>getDocumentStatus - Obter status</li>
                <li>listSigners - Listar signatários</li>
                <li>downloadDocument - Baixar assinado</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}