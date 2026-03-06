import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Download } from 'lucide-react';

/**
 * Componente PWAConfig
 * Mostra status do PWA e instruções para setup
 */
export default function PWAConfig() {
  const [swSupported, setSwSupported] = useState(false);
  const [swRegistered, setSwRegistered] = useState(false);
  const [manifestFound, setManifestFound] = useState(false);

  useEffect(() => {
    // Check Service Worker support
    setSwSupported('serviceWorker' in navigator);

    // Check if SW is registered
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        setSwRegistered(registrations.length > 0);
      });
    }

    // Check manifest.json
    const link = document.querySelector('link[rel="manifest"]');
    setManifestFound(!!link);
  }, []);

  const manifestContent = `{
  "name": "Legal Task Management System",
  "short_name": "Legal Tasks",
  "description": "Sistema de gestão de intimações e processos legais",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#ffffff",
  "theme_color": "#1e40af",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    }
  ]
}`;

  const htmlHeadContent = `<!-- No arquivo index.html ou main HTML -->
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="theme-color" content="#1e40af" />
<meta name="description" content="Sistema de gestão de intimações e processos legais" />
<link rel="manifest" href="/manifest.json" />
<link rel="icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/icon-192.png" />`;

  const swRegistrationCode = `// No arquivo main.jsx ou App.jsx
import { registerServiceWorker } from '@/functions/registerServiceWorker';

// Ao iniciar a aplicação
if ('serviceWorker' in navigator) {
  registerServiceWorker().then(result => {
    if (result.success) {
      console.log('✅ Service Worker ativo para offline');
    }
  });
}`;

  const downloadFile = (content, filename) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">📱 Configuração PWA</h1>
        <p className="text-gray-600">Progressive Web App - Offline & Install Ready</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              {swSupported ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
              <div>
                <p className="text-sm text-gray-600">Service Worker</p>
                <Badge className={swSupported ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {swSupported ? 'Suportado' : 'Não suportado'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              {swRegistered ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              )}
              <div>
                <p className="text-sm text-gray-600">Registro Ativo</p>
                <Badge className={swRegistered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {swRegistered ? 'Ativo' : 'Pendente'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              {manifestFound ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              )}
              <div>
                <p className="text-sm text-gray-600">Manifest.json</p>
                <Badge className={manifestFound ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {manifestFound ? 'Vinculado' : 'Pendente'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Passo 1: Adicionar Meta Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">Adicione ao &lt;head&gt; do seu arquivo HTML principal:</p>
          <div className="bg-gray-100 p-4 rounded-lg text-xs font-mono overflow-x-auto">
            <code>{htmlHeadContent}</code>
          </div>
          <button
            onClick={() => downloadFile(htmlHeadContent, 'index-head-tags.html')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            <Download className="w-4 h-4" />
            Baixar HTML Head Tags
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📄 Passo 2: Criar manifest.json</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">Crie arquivo na pasta public/:</p>
          <div className="bg-gray-100 p-4 rounded-lg text-xs font-mono overflow-x-auto">
            <code>{manifestContent}</code>
          </div>
          <button
            onClick={() => downloadFile(manifestContent, 'manifest.json')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            <Download className="w-4 h-4" />
            Baixar manifest.json
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>⚙️ Passo 3: Registrar Service Worker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">Adicione ao seu App.jsx ou main.jsx:</p>
          <div className="bg-gray-100 p-4 rounded-lg text-xs font-mono overflow-x-auto">
            <code>{swRegistrationCode}</code>
          </div>
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">✅ PWA Setup Checklist</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-900 space-y-2">
          <div className="flex items-center gap-2">
            {swSupported ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5" />}
            <span>Service Worker suportado no navegador</span>
          </div>
          <div className="flex items-center gap-2">
            {manifestFound ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5" />}
            <span>manifest.json vinculado no HTML</span>
          </div>
          <div className="flex items-center gap-2">
            {swRegistered ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5" />}
            <span>Service Worker registrado e ativo</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>Icons 192x192 e 512x512 adicionados</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>SSL/HTTPS configurado (necessário para PWA)</span>
          </div>
        </CardContent>
      </Card>

      {/* Testing */}
      <Card>
        <CardHeader>
          <CardTitle>🧪 Testar PWA</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-gray-700">
          <p><strong>Chrome/Edge:</strong> DevTools → Application → Service Workers</p>
          <p><strong>Lighthouse:</strong> DevTools → Lighthouse → PWA audit</p>
          <p><strong>Instalar:</strong> Clicar ícone "Instalar" na barra de endereço</p>
          <p><strong>Testar offline:</strong> Abrir DevTools → Network → Offline</p>
        </CardContent>
      </Card>
    </div>
  );
}