import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';

/**
 * Guia de Setup da PWA (Sprint 13 Manual Tasks)
 * Instruções para completar configuração antes de publicação
 */
export default function PWASetupGuide() {
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Guia passo-a-passo para completar setup manual da PWA (Sprint 13)
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="vapid">VAPID Keys</TabsTrigger>
          <TabsTrigger value="icons">Icons</TabsTrigger>
          <TabsTrigger value="env">Env Setup</TabsTrigger>
          <TabsTrigger value="verify">Verificação</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Setup da PWA - Resumo</CardTitle>
              <CardDescription>
                6 arquivos/tarefas para completar antes de publicação
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900">✓ Service Worker</h4>
                    <p className="text-sm text-green-800 mt-1">public/service-worker.js - JÁ CRIADO</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900">✓ Manifest</h4>
                    <p className="text-sm text-green-800 mt-1">public/manifest.json - JÁ CRIADO</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900">✓ Offline Page</h4>
                    <p className="text-sm text-green-800 mt-1">public/offline.html - JÁ CRIADO</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900">⏳ VAPID Keys</h4>
                    <p className="text-sm text-yellow-800 mt-1">Gerar e adicionar ao .env.local - PENDENTE</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900">⏳ Icons</h4>
                    <p className="text-sm text-yellow-800 mt-1">Gerar 9 tamanhos diferentes - PENDENTE</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900">⏳ web-push</h4>
                    <p className="text-sm text-yellow-800 mt-1">npm install web-push - PENDENTE</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">Status: 3/6 Completo (50%)</h4>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VAPID Keys */}
        <TabsContent value="vapid" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerar VAPID Keys</CardTitle>
              <CardDescription>
                Necessário para push notifications em produção
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold">Opção 1: Usar web-push (Recomendado)</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`npm install -g web-push

# Gerar VAPID keys
npx web-push generate-vapid-keys

# Output:
# Public Key: [LONG_STRING]
# Private Key: [LONG_STRING]`}
                </pre>

                <h3 className="font-semibold">Opção 2: Online Generator</h3>
                <p className="text-sm text-gray-600">
                  Visite: <a href="https://vapidkey.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">vapidkey.com</a>
                </p>

                <h3 className="font-semibold">Opção 3: Node Script</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys();

console.log('Public Key:', vapidKeys.publicKey);
console.log('Private Key:', vapidKeys.privateKey);`}
                </pre>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                <p className="text-sm text-yellow-900">
                  <strong>⚠️ IMPORTANTE:</strong> Salve as keys em local seguro. A private key NUNCA deve ser compartilhada!
                </p>
              </div>

              <h3 className="font-semibold">Adicionar ao .env.local</h3>
              <div className="space-y-2">
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# .env.local
VITE_VAPID_PUBLIC_KEY=sua_public_key_aqui
VITE_VAPID_PRIVATE_KEY=sua_private_key_aqui`}
                </pre>
                <p className="text-sm text-gray-600">
                  ⚠️ NUNCA commitar .env.local no git! Adicione ao .gitignore
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Icons */}
        <TabsContent value="icons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerar Icons</CardTitle>
              <CardDescription>
                Múltiplos tamanhos para diferentes dispositivos
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Você precisa ter um ícone de 512x512 para começar, depois gere os outros tamanhos
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h3 className="font-semibold">Ícones necessários:</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Tamanho</th>
                      <th className="text-left py-2">Arquivo</th>
                      <th className="text-left py-2">Uso</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-1">
                    <tr className="border-b">
                      <td className="py-2">72x72</td>
                      <td>icon-72x72.png</td>
                      <td>Home screen</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">96x96</td>
                      <td>icon-96x96.png</td>
                      <td>Home screen</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">128x128</td>
                      <td>icon-128x128.png</td>
                      <td>Home screen</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">144x144</td>
                      <td>icon-144x144.png</td>
                      <td>Home screen</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">152x152</td>
                      <td>icon-152x152.png</td>
                      <td>iPad</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">192x192</td>
                      <td>icon-192x192.png</td>
                      <td>Android, Chrome</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">384x384</td>
                      <td>icon-384x384.png</td>
                      <td>High DPI</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">512x512</td>
                      <td>icon-512x512.png</td>
                      <td>Stores, Splash screen</td>
                    </tr>
                    <tr>
                      <td className="py-2">72x72 Badge</td>
                      <td>badge-72x72.png</td>
                      <td>Notificações</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Ferramenta Recomendada: ImageMagick</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# Instalar ImageMagick
# macOS: brew install imagemagick
# Ubuntu: sudo apt install imagemagick
# Windows: https://imagemagick.org/script/download.php

# Redimensionar icon-512x512.png para todos os tamanhos
convert icon-512x512.png -resize 72x72 public/icon-72x72.png
convert icon-512x512.png -resize 96x96 public/icon-96x96.png
convert icon-512x512.png -resize 128x128 public/icon-128x128.png
convert icon-512x512.png -resize 144x144 public/icon-144x144.png
convert icon-512x512.png -resize 152x152 public/icon-152x152.png
convert icon-512x512.png -resize 192x192 public/icon-192x192.png
convert icon-512x512.png -resize 384x384 public/icon-384x384.png
cp icon-512x512.png public/icon-512x512.png

# Badge (pode ser versão monocromática)
convert icon-512x512.png -resize 72x72 -colorspace Gray public/badge-72x72.png`}
                </pre>

                <h3 className="font-semibold">Alternativa: Online Tools</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-600">
                  <li><a href="https://icoconvert.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">icoconvert.com</a></li>
                  <li><a href="https://ezgif.com/resize" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ezgif.com</a></li>
                  <li><a href="https://pwa-asset-generator.firebaseapp.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">PWA Asset Generator</a></li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                <p className="text-sm text-blue-900">
                  💡 <strong>Dica:</strong> Todos os ícones devem ter a mesma design, apenas redimensionados
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Environment Setup */}
        <TabsContent value="env" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurar Environment</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold">1. Instalar web-push</h3>
                <div className="flex items-start gap-2">
                  <pre className="bg-gray-100 p-3 rounded text-xs flex-1 overflow-x-auto">
{`npm install web-push`}
                  </pre>
                  <button
                    onClick={() => copyToClipboard('webpush', 'npm install web-push')}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    {copiedCode === 'webpush' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>

                <h3 className="font-semibold">2. Criar .env.local</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# .env.local (NUNCA commitar!)
VITE_VAPID_PUBLIC_KEY=sua_public_key_aqui
VITE_VAPID_PRIVATE_KEY=sua_private_key_aqui
VITE_API_URL=https://seu-backend.com/api`}
                </pre>

                <h3 className="font-semibold">3. Verificar .gitignore</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# Adicionar ao .gitignore se não existir
.env.local
.env.*.local
node_modules/
dist/`}
                </pre>

                <h3 className="font-semibold">4. Registrar Service Worker no HTML</h3>
                <p className="text-sm text-gray-600">
                  ✓ Já configurado em <code className="bg-gray-100 px-1 rounded">index.html</code>
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 p-3 rounded">
                <p className="text-sm text-green-900">
                  ✓ Se tudo estiver correto, o service worker será registrado automaticamente ao carregar a página
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification */}
        <TabsContent value="verify" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verificar Setup</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold">1. Verificar arquivos públicos</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`public/
├─ service-worker.js ✓
├─ manifest.json ✓
├─ offline.html ✓
├─ icon-72x72.png
├─ icon-96x96.png
├─ icon-128x128.png
├─ icon-144x144.png
├─ icon-152x152.png
├─ icon-192x192.png
├─ icon-384x384.png
├─ icon-512x512.png
└─ badge-72x72.png`}
                </pre>

                <h3 className="font-semibold">2. Build e testar</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# Build
npm run build

# Preview com HTTPS (necessário para SW)
npm run preview -- --https

# Abrir https://localhost:4173`}
                </pre>

                <h3 className="font-semibold">3. DevTools Verification</h3>
                <ol className="list-decimal ml-5 space-y-1 text-sm text-gray-600">
                  <li>F12 → Application → Service Workers</li>
                  <li>Deve mostrar "activated and running"</li>
                  <li>F12 → Application → Manifest</li>
                  <li>Deve mostrar icons e informações corretas</li>
                  <li>F12 → Application → Cache Storage</li>
                  <li>Deve mostrar 3 caches: legal-tasks-v1, runtime, api</li>
                </ol>

                <h3 className="font-semibold">4. Testar Offline</h3>
                <ol className="list-decimal ml-5 space-y-1 text-sm text-gray-600">
                  <li>F12 → Network → Throttling: "Offline"</li>
                  <li>Recarregar página</li>
                  <li>Deve carregar offline.html ou do cache</li>
                  <li>Navegação entre páginas deve funcionar</li>
                </ol>

                <h3 className="font-semibold">5. Testar Install Prompt</h3>
                <ol className="list-decimal ml-5 space-y-1 text-sm text-gray-600">
                  <li>Fechar DevTools (F12)</li>
                  <li>Atualizar página</li>
                  <li>Deve aparecer "Install" button (Chrome mobile)</li>
                  <li>Ou "Add to Home Screen" (Safari)</li>
                  <li>PWAInstallPrompt deve aparecer após 3 segundos</li>
                </ol>
              </div>

              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 text-sm">
                  ✓ Se tudo passar nessas verificações, você está pronto para publicar!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-900">⏳ Próximo Passo: Build e Deploy</CardTitle>
        </CardHeader>

        <CardContent className="text-sm text-yellow-900 space-y-2">
          <p>Após completar este setup:</p>
          <ol className="list-decimal ml-5 space-y-1">
            <li>Execute: <code className="bg-yellow-100 px-1 rounded">npm run build</code></li>
            <li>Teste offline com: <code className="bg-yellow-100 px-1 rounded">npm run preview -- --https</code></li>
            <li>Rodeo Lighthouse audit</li>
            <li>Inicie Sprint 14 - Testes E2E</li>
            <li>Inicie Sprint 15 - Deployment nas Stores</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}