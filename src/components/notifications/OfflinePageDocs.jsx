import React from 'react';

/**
 * DOCUMENTAÇÃO - Arquivo offline.html
 * Copiar este conteúdo para public/offline.html
 */

const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Legal Tasks - Offline</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 500px;
      padding: 40px 30px;
      text-align: center;
    }

    h1 {
      font-size: 24px;
      color: #1a1a1a;
      margin-bottom: 12px;
    }

    p {
      color: #666;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 30px;
    }

    .status {
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 20px;
      font-size: 14px;
      color: #856404;
    }

    button {
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
    }

    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Você está Offline</h1>
    <p>Perdeu a conexão com a internet. Legal Tasks ainda funciona em modo offline.</p>
    <div class="status">
      ⏳ Suas ações serão sincronizadas quando a conexão for restaurada
    </div>
    <button onclick="window.location.reload()">Reconectar Agora</button>
  </div>

  <script>
    window.addEventListener('online', () => {
      window.location.reload();
    });
  </script>
</body>
</html>`;

export default function OfflinePageDocs() {
  return (
    <div className="max-w-3xl space-y-4">
      <h3 className="font-semibold text-sm">offline.html</h3>
      <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto max-h-96">
        {OFFLINE_HTML}
      </pre>
      <p className="text-xs text-gray-600">
        Copie este conteúdo para o arquivo <code className="bg-gray-100 px-2 py-1 rounded">public/offline.html</code>
      </p>
    </div>
  );
}