import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

/**
 * DOCUMENTAÇÃO - Service Worker Setup
 */

export default function ServiceWorkerDocs() {
  return (
    <div className="space-y-6 max-w-3xl">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Siga os passos abaixo para finalizar a implementação do PWA offline
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">1. Service Worker Setup</CardTitle>
          <CardDescription>Copiar arquivo service-worker.js para public/</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            Execute em seu terminal:
          </p>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# Criar service worker com cache strategies
cp service-worker-template.js public/service-worker.js

# OU manualmente copie o conteúdo do arquivo para public/service-worker.js`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">2. Criar manifest.json</CardTitle>
          <CardDescription>Arquivo de configuração PWA</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            Crie o arquivo <code className="bg-gray-100 px-2 py-1 rounded text-xs">public/manifest.json</code> com o conteúdo abaixo:
          </p>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto max-h-96">
{`{
  "name": "Legal Tasks - Sistema de Gestão de Processos Jurídicos",
  "short_name": "Legal Tasks",
  "description": "Plataforma completa para gestão de processos jurídicos",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/badge-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "badge"
    }
  ]
}`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">3. Criar offline.html</CardTitle>
          <CardDescription>Página de fallback quando offline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            Crie o arquivo <code className="bg-gray-100 px-2 py-1 rounded text-xs">public/offline.html</code> como fallback para o service worker
          </p>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto max-h-96">
{`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Legal Tasks - Offline</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      max-width: 500px;
      text-align: center;
    }
    h1 { font-size: 24px; margin-bottom: 12px; }
    p { color: #666; margin-bottom: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Você está Offline</h1>
    <p>Perdeu a conexão. Legal Tasks funciona offline.</p>
    <button onclick="window.location.reload()">Reconectar</button>
  </div>
</body>
</html>`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">4. Gerar VAPID Keys</CardTitle>
          <CardDescription>Para Web Push Notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`npm install -g web-push
web-push generate-vapid-keys`}
          </pre>
          <p className="text-sm text-gray-600 mt-2">
            Copie as chaves geradas para seu .env.local:
          </p>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`VITE_VAPID_PUBLIC_KEY=sua_chave_publica
VITE_VAPID_PRIVATE_KEY=sua_chave_privada
VITE_VAPID_EMAIL=seu_email@example.com`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">5. Gerar Icons</CardTitle>
          <CardDescription>Assets para PWA</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            Crie os seguintes arquivos em <code className="bg-gray-100 px-2 py-1 rounded text-xs">public/</code>:
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>📱 <code className="bg-gray-100 px-2 py-1 rounded">icon-192x192.png</code> (192x192)</li>
            <li>📱 <code className="bg-gray-100 px-2 py-1 rounded">icon-512x512.png</code> (512x512)</li>
            <li>📌 <code className="bg-gray-100 px-2 py-1 rounded">badge-72x72.png</code> (72x72)</li>
          </ul>
          <p className="text-xs text-gray-500 mt-2">
            Dica: Use uma ferramenta online como favicon-generator.org ou crie SVGs
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">6. Testar PWA</CardTitle>
          <CardDescription>Validar implementação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# Executar em HTTPS local
npm run build
npm run preview -- --https

# Chrome DevTools:
# 1. Application > Service Workers
# 2. Verifique "Offline" para simular offline
# 3. Lighthouse > PWA audit`}
          </pre>
        </CardContent>
      </Card>

      <Alert className="border-green-200 bg-green-50">
        <AlertCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          ✅ <strong>Checklist de Conclusão:</strong>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>Service Worker registrado em public/service-worker.js</li>
            <li>manifest.json criado em public/</li>
            <li>offline.html criado em public/</li>
            <li>VAPID keys geradas e configuradas em .env.local</li>
            <li>Icons gerados (192x192, 512x512, 72x72)</li>
            <li>Componentes integrados no Layout.jsx</li>
            <li>Testado em HTTPS local</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}