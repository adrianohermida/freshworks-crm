import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Copy, Download, FileCode } from 'lucide-react';

/**
 * Instruções Completas de Setup Manual (Sprint 13)
 * Arquivos que precisam ser criados em public/
 */
export default function PWAManualSetupInstructions() {
  return (
    <div className="max-w-4xl space-y-6">
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>⚠️ CRÍTICO:</strong> Estes arquivos DEVEM ser criados manualmente no diretório <code className="bg-red-100 px-1 rounded">public/</code> antes de publicar
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="instructions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="instructions">Instruções</TabsTrigger>
          <TabsTrigger value="files">Arquivos</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
        </TabsList>

        {/* Instructions */}
        <TabsContent value="instructions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Passo a Passo - Setup PWA Manual</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Passo 1: Copiar Service Worker</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    O service worker está pronto no repositório, precisa ser copiado para public/
                  </p>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# Terminal na raiz do projeto
# Copiar o código do service-worker.js do repositório
# para o arquivo public/service-worker.js

# Verifique se foi criado:
ls -la public/service-worker.js`}
                  </pre>
                  <p className="text-xs text-gray-500 mt-2">✓ Status: Service Worker está codificado, só copiar arquivo</p>
                </div>

                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Passo 2: Copiar Manifest</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    O manifest.json define metadata da PWA
                  </p>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# Copiar manifest.json do repositório
# para o arquivo public/manifest.json

# Verifique se foi criado:
ls -la public/manifest.json`}
                  </pre>
                  <p className="text-xs text-gray-500 mt-2">✓ Status: Manifest.json está codificado, só copiar arquivo</p>
                </div>

                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Passo 3: Copiar Offline Page</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Página que aparece quando usuário está offline
                  </p>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# Copiar offline.html do repositório
# para o arquivo public/offline.html

# Verifique se foi criado:
ls -la public/offline.html`}
                  </pre>
                  <p className="text-xs text-gray-500 mt-2">✓ Status: offline.html está codificado, só copiar arquivo</p>
                </div>

                <div className="border-l-4 border-yellow-600 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Passo 4: Gerar VAPID Keys</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Necessário para push notifications
                  </p>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# Opção A: Instalar web-push globalmente
npm install -g web-push

# Gerar keys
npx web-push generate-vapid-keys

# Output será:
# Public Key: AAAA...BBBB
# Private Key: XXXX...YYYY

# Copiar as keys e adicionar no .env.local`}
                  </pre>
                  <p className="text-xs text-gray-500 mt-2">⏳ Status: DEVE SER FEITO MANUALMENTE</p>
                </div>

                <div className="border-l-4 border-yellow-600 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Passo 5: Configurar .env.local</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Arquivo com variáveis de ambiente (não vai para git)
                  </p>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# Criar arquivo .env.local na raiz do projeto
# (Copiar public key e private key do Passo 4)

VITE_VAPID_PUBLIC_KEY=sua_public_key_aqui
VITE_VAPID_PRIVATE_KEY=sua_private_key_aqui
VITE_API_URL=https://seu-backend.com/api

# ⚠️ NUNCA COMMITAR ESTE ARQUIVO!
# Adicionar ao .gitignore (já deve estar lá)`}
                  </pre>
                  <p className="text-xs text-gray-500 mt-2">⏳ Status: DEVE SER FEITO MANUALMENTE</p>
                </div>

                <div className="border-l-4 border-yellow-600 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Passo 6: Gerar Icons</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    9 tamanhos diferentes de ícones para diferentes dispositivos
                  </p>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# Primeiro, ter um ícone base 512x512.png
# Depois usar ImageMagick para redimensionar:

# Instalar (macOS)
brew install imagemagick

# Gerar todos os tamanhos:
convert icon-512x512.png -resize 72x72 public/icon-72x72.png
convert icon-512x512.png -resize 96x96 public/icon-96x96.png
convert icon-512x512.png -resize 128x128 public/icon-128x128.png
convert icon-512x512.png -resize 144x144 public/icon-144x144.png
convert icon-512x512.png -resize 152x152 public/icon-152x152.png
convert icon-512x512.png -resize 192x192 public/icon-192x192.png
convert icon-512x512.png -resize 384x384 public/icon-384x384.png
cp icon-512x512.png public/icon-512x512.png
convert icon-512x512.png -resize 72x72 -colorspace Gray public/badge-72x72.png`}
                  </pre>
                  <p className="text-xs text-gray-500 mt-2">⏳ Status: DEVE SER FEITO MANUALMENTE</p>
                </div>

                <div className="border-l-4 border-green-600 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Passo 7: Instalar Dependências</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Instalar packages necessários para backend
                  </p>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# Instalar web-push (para backend functions)
npm install web-push

# Verificar se foi instalado
npm list web-push`}
                  </pre>
                  <p className="text-xs text-gray-500 mt-2">✓ Status: PODE SER FEITO VIA NPM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Files */}
        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Arquivos a Criar em public/</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <FileCode className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm">
                  Estes 3 arquivos JS/HTML são dados aqui pronto. Basta copiar para pasta public/
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="border rounded p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold">public/service-worker.js</h4>
                    <span className="text-xs text-green-600 ml-auto">PRONTO</span>
                  </div>
                  <pre className="bg-gray-100 p-2 rounded text-xs max-h-48 overflow-auto">
{`Arquivo completo no repositório
- Caching estratégico (cache-first, network-first)
- Background sync para offline
- Push notifications
- Service Worker lifecycle (install, activate, fetch)

Tamanho: ~12KB
Status: ✓ Pronto para copiar`}
                  </pre>
                </div>

                <div className="border rounded p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold">public/manifest.json</h4>
                    <span className="text-xs text-green-600 ml-auto">PRONTO</span>
                  </div>
                  <pre className="bg-gray-100 p-2 rounded text-xs max-h-48 overflow-auto">
{`Arquivo completo no repositório
- Name, description, start_url
- Display mode: standalone
- Theme colors
- Icons (referencia os PNG que você vai gerar)
- Screenshots
- Shortcuts

Tamanho: ~2KB
Status: ✓ Pronto para copiar`}
                  </pre>
                </div>

                <div className="border rounded p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold">public/offline.html</h4>
                    <span className="text-xs text-green-600 ml-auto">PRONTO</span>
                  </div>
                  <pre className="bg-gray-100 p-2 rounded text-xs max-h-48 overflow-auto">
{`Arquivo completo no repositório
- HTML puro (sem dependências)
- CSS inline (dark mode suportado)
- Botões para tentar reconectar
- Mensagens amigáveis
- Animações CSS

Tamanho: ~8KB
Status: ✓ Pronto para copiar`}
                  </pre>
                </div>
              </div>

              <div className="border rounded p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Icons (Precisam ser gerados)
                </h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>📦 icon-72x72.png - 72x72 pixels</li>
                  <li>📦 icon-96x96.png - 96x96 pixels</li>
                  <li>📦 icon-128x128.png - 128x128 pixels</li>
                  <li>📦 icon-144x144.png - 144x144 pixels</li>
                  <li>📦 icon-152x152.png - 152x152 pixels</li>
                  <li>📦 icon-192x192.png - 192x192 pixels (IMPORTANTE)</li>
                  <li>📦 icon-384x384.png - 384x384 pixels</li>
                  <li>📦 icon-512x512.png - 512x512 pixels (IMPORTANTE)</li>
                  <li>📦 badge-72x72.png - 72x72 pixels (notificações)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Checklist */}
        <TabsContent value="checklist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Checklist Completo de Setup</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold mb-3">Arquivos do Repositório (Copiar para public/)</h3>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ service-worker.js copiado para public/</span>
                </label>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ manifest.json copiado para public/</span>
                </label>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ offline.html copiado para public/</span>
                </label>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold mb-3">VAPID Keys (Gerar novo)</h3>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ web-push instalado globalmente</span>
                </label>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ VAPID keys gerados com web-push</span>
                </label>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ Public key copiada para .env.local</span>
                </label>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ Private key copiada para .env.local (SEGURO!)</span>
                </label>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold mb-3">Icons (Gerar / Providenciar)</h3>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ icon-72x72.png criado em public/</span>
                </label>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ icon-96x96.png criado em public/</span>
                </label>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ icon-128x128.png criado em public/</span>
                </label>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ icon-144x144.png criado em public/</span>
                </label>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ icon-152x152.png criado em public/</span>
                </label>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ icon-192x192.png criado em public/</span>
                </label>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ icon-384x384.png criado em public/</span>
                </label>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ icon-512x512.png criado em public/</span>
                </label>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ badge-72x72.png criado em public/</span>
                </label>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold mb-3">Dependências e Configuração</h3>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ npm install web-push executado</span>
                </label>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ .env.local criado com VAPID keys</span>
                </label>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ .gitignore contém .env.local</span>
                </label>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold mb-3">Testes e Verificação</h3>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ npm run build executa sem erros</span>
                </label>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ npm run preview -- --https funciona</span>
                </label>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ Service Worker ativo em DevTools</span>
                </label>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ Manifest correto em DevTools</span>
                </label>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ Cache Storage com 3 caches</span>
                </label>
                <label className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">✓ Offline mode testado (offline.html aparece)</span>
                </label>
              </div>
            </CardContent>
          </Card>

          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>✓ Após completar este checklist:</strong>
              <ol className="list-decimal ml-5 mt-2 space-y-1 text-sm">
                <li>Você pode fazer build: <code className="bg-green-100 px-1 rounded">npm run build</code></li>
                <li>Pode rodar Lighthouse audit</li>
                <li>Pode iniciar Sprint 14 - Testes E2E</li>
                <li>Pode iniciar Sprint 15 - Deployment</li>
              </ol>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}