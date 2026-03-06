import React from 'react';

/**
 * DOCUMENTAÇÃO - Arquivo manifest.json
 * Copiar este conteúdo para public/manifest.json
 */

const MANIFEST_CONTENT = {
  "name": "Legal Tasks - Sistema de Gestão de Processos Jurídicos",
  "short_name": "Legal Tasks",
  "description": "Plataforma completa para gestão de processos jurídicos, intimações, prazos e automações legais",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
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
  ],
  "categories": ["productivity", "utilities"],
  "shortcuts": [
    {
      "name": "Dashboard",
      "short_name": "Dashboard",
      "description": "Acesse o dashboard principal",
      "url": "/?shortcut=dashboard"
    },
    {
      "name": "Processos",
      "short_name": "Processos",
      "description": "Gerencie processos jurídicos",
      "url": "/?shortcut=processos"
    },
    {
      "name": "Tarefas",
      "short_name": "Tarefas",
      "description": "Veja suas tarefas agendadas",
      "url": "/?shortcut=tarefas"
    }
  ]
};

export default function ManifestDocs() {
  return (
    <div className="max-w-3xl space-y-4">
      <h3 className="font-semibold text-sm">manifest.json</h3>
      <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
        {JSON.stringify(MANIFEST_CONTENT, null, 2)}
      </pre>
      <p className="text-xs text-gray-600">
        Copie este conteúdo para o arquivo <code className="bg-gray-100 px-2 py-1 rounded">public/manifest.json</code>
      </p>
    </div>
  );
}