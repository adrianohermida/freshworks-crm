import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Code } from 'lucide-react';

/**
 * Componente de guia para setup de Push Notifications
 */
export default function PushSetupGuide() {
  return (
    <div className="max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Setup de Push Notifications
          </CardTitle>
          <CardDescription>
            Siga os passos abaixo para ativar push notifications na aplicação
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Step 1 */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2">1. Gerar VAPID Keys</h3>
            <p className="text-sm text-gray-600 mb-3">
              Use a biblioteca web-push para gerar um par de chaves VAPID:
            </p>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto mb-3">
{`npm install -g web-push
web-push generate-vapid-keys`}
            </pre>
            <p className="text-sm text-gray-600">
              Você receberá uma chave pública e privada. Guarde com segurança.
            </p>
          </div>

          {/* Step 2 */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2">2. Configurar Variáveis de Ambiente</h3>
            <p className="text-sm text-gray-600 mb-3">
              Adicione ao seu .env.local:
            </p>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`VITE_VAPID_PUBLIC_KEY=sua_chave_publica_aqui
VITE_VAPID_PRIVATE_KEY=sua_chave_privada_aqui
VITE_VAPID_EMAIL=seu_email@example.com`}
            </pre>
          </div>

          {/* Step 3 */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2">3. Copiar Service Worker</h3>
            <p className="text-sm text-gray-600 mb-3">
              Copie o arquivo <code className="bg-gray-100 px-2 py-1 rounded text-xs">public/service-worker.txt</code> para <code className="bg-gray-100 px-2 py-1 rounded text-xs">public/service-worker.js</code>
            </p>
          </div>

          {/* Step 4 */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2">4. Integrar Componentes no Layout</h3>
            <p className="text-sm text-gray-600 mb-3">
              Adicione no Layout.jsx:
            </p>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`import PushNotificationPrompt from '@/components/notifications/PushNotificationPrompt';
import OfflineIndicator from '@/components/notifications/OfflineIndicator';

// No render:
<OfflineIndicator />
<PushNotificationPrompt />`}
            </pre>
          </div>

          {/* Step 5 */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2">5. Atualizar Manifest.json</h3>
            <p className="text-sm text-gray-600 mb-3">
              Adicione badge e icons:
            </p>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`{
  "badge": "/badge-72x72.png",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}`}
            </pre>
          </div>

          {/* Step 6 */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2">6. Backend - Salvar Subscriptions</h3>
            <p className="text-sm text-gray-600 mb-3">
              Crie um endpoint para salvar push subscriptions:
            </p>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`// functions/subscribeToPush.js
Deno.serve(async (req) => {
  const subscription = await req.json();
  // Salvar em banco de dados
  // Usar para enviar notificações depois
  return Response.json({ success: true });
});`}
            </pre>
          </div>

          {/* Checklist */}
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Checklist de Implementação:</strong>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>✅ VAPID keys geradas</li>
                <li>✅ Variáveis de ambiente configuradas</li>
                <li>✅ Service Worker em public/</li>
                <li>✅ Componentes integrados no Layout</li>
                <li>✅ Manifest.json atualizado</li>
                <li>✅ Endpoint de subscription criado</li>
                <li>✅ Função de envio de notificações</li>
                <li>✅ Testado em HTTPS (obrigatório para push)</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}