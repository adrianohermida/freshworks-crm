import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Download, CheckCircle2 } from 'lucide-react';

export default function PWASetupGuide() {
  const downloadJSON = (filename, content) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadJS = (filename, content) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/javascript;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const manifestJson = {
    name: "Legal Task Management System",
    short_name: "Legal Tasks",
    description: "Sistema de gestão de intimações e processos legais integrado com Advise API",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#1e40af",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      }
    ]
  };

  const serviceWorkerCode = `// Public Service Worker - PWA Offline Support
const CACHE_NAME = 'legal-tasks-v1';
const RUNTIME_CACHE = 'legal-tasks-runtime-v1';
const API_CACHE = 'legal-tasks-api-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('Failed to cache some assets:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE && name !== API_CACHE)
          .map((name) => {
            console.log('Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  // API requests - Network first
  if (url.pathname.includes('/api/') || url.pathname.includes('/functions/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(API_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || new Response(
              JSON.stringify({ offline: true, message: 'Usando dados em cache' }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
          });
        })
    );
    return;
  }

  // Static assets - Cache first
  if (request.url.includes('.js') || request.url.includes('.css') || 
      request.url.includes('.png') || request.url.includes('.jpg')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return cachedResponse || fetch(request).then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        });
      })
    );
    return;
  }

  // HTML - Network first
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          return cachedResponse || caches.match('/');
        });
      })
  );
});

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || 'Legal Tasks';
  const options = {
    body: data.body || 'Nova atualização',
    icon: '/icon-192.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        if (windowClients[i].url === '/') {
          return windowClients[i].focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">🚀 Guia Final de Setup PWA</h1>
          <p className="text-gray-600">Finalize a configuração PWA para production</p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Siga os passos abaixo para completar a configuração PWA. Estes arquivos devem ser criados manualmente na raiz do seu projeto.
          </AlertDescription>
        </Alert>

        {/* Step 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
              Criar manifest.json
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">Crie arquivo <code className="bg-gray-100 px-2 py-1 rounded">public/manifest.json</code> com o conteúdo abaixo:</p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs font-mono overflow-x-auto">
              <pre>{JSON.stringify(manifestJson, null, 2)}</pre>
            </div>
            <button
              onClick={() => downloadJSON('manifest.json', JSON.stringify(manifestJson, null, 2))}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <Download className="w-4 h-4" />
              Baixar manifest.json
            </button>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
              Criar service-worker.js
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">Crie arquivo <code className="bg-gray-100 px-2 py-1 rounded">public/service-worker.js</code> com o conteúdo abaixo:</p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-96">
              <pre>{serviceWorkerCode}</pre>
            </div>
            <button
              onClick={() => downloadJS('service-worker.js', serviceWorkerCode)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <Download className="w-4 h-4" />
              Baixar service-worker.js
            </button>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
              Adicionar Meta Tags ao index.html
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">Adicione estas tags ao <code className="bg-gray-100 px-2 py-1 rounded">{"<head>"}</code> do seu index.html:</p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs font-mono overflow-x-auto">
              <pre>{`<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="theme-color" content="#1e40af" />
<meta name="description" content="Sistema de gestão de intimações e processos legais" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<link rel="manifest" href="/manifest.json" />
<link rel="icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/icon-192.png" />`}</pre>
            </div>
          </CardContent>
        </Card>

        {/* Step 4 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">4</span>
              Registrar Service Worker no App
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">O Service Worker já está registrado através de <code className="bg-gray-100 px-2 py-1 rounded">functions/registerServiceWorker.js</code></p>
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
              <p className="text-sm text-green-900"><CheckCircle2 className="inline w-4 h-4 mr-2" /> Service Worker automaticamente ativo!</p>
            </div>
          </CardContent>
        </Card>

        {/* Checklist */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>✅ Checklist Final</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>Service Worker registration implementado</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span>manifest.json criado em public/</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span>service-worker.js criado em public/</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span>Meta tags adicionadas ao index.html</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span>Icons (192x192, 512x512) adicionados em public/</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>HTTPS/SSL configurado</span>
            </div>
          </CardContent>
        </Card>

        {/* Testing */}
        <Card>
          <CardHeader>
            <CardTitle>🧪 Testar PWA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="font-semibold">Chrome/Edge DevTools:</p>
            <p className="text-gray-600 ml-4">1. F12 → Application → Service Workers</p>
            <p className="text-gray-600 ml-4">2. Verificar se está "activated and running"</p>
            
            <p className="font-semibold mt-4">Lighthouse Audit:</p>
            <p className="text-gray-600 ml-4">1. DevTools → Lighthouse</p>
            <p className="text-gray-600 ml-4">2. Rodiar "PWA" audit</p>
            <p className="text-gray-600 ml-4">3. Deve passar com score 90+</p>

            <p className="font-semibold mt-4">Testar Offline:</p>
            <p className="text-gray-600 ml-4">1. DevTools → Network → Offline</p>
            <p className="text-gray-600 ml-4">2. Recarregar página - deve exibir cached version</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}