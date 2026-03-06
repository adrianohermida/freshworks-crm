Deno.serve(async (req) => {
  try {
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offline - Freshdesk Manager</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
        }
        .offline-container {
            background: white;
            border-radius: 12px;
            padding: 40px 20px;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        .offline-icon { font-size: 64px; margin-bottom: 20px; opacity: 0.6; }
        h1 { color: #1e293b; font-size: 24px; margin-bottom: 10px; }
        p { color: #64748b; font-size: 16px; line-height: 1.5; margin-bottom: 20px; }
        .status { display: inline-block; padding: 8px 16px; background: #fef3c7; color: #92400e; border-radius: 6px; font-size: 14px; margin-top: 20px; }
        .tips { text-align: left; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
        .tips h3 { color: #1e293b; font-size: 14px; margin-bottom: 10px; }
        .tips ul { list-style: none; color: #64748b; font-size: 14px; }
        .tips li { padding: 5px 0; }
        .tips li::before { content: "✓ "; color: #0f766e; font-weight: bold; margin-right: 5px; }
        @media (prefers-color-scheme: dark) {
            body { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); }
            .offline-container { background: #1e293b; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); }
            h1 { color: #f1f5f9; }
            p { color: #cbd5e1; }
            .status { background: #78350f; color: #fef3c7; }
            .tips h3 { color: #f1f5f9; }
            .tips ul { color: #cbd5e1; }
            .tips li::before { color: #14b8a6; }
        }
    </style>
</head>
<body>
    <div class="offline-container">
        <div class="offline-icon">📡</div>
        <h1>Você está offline</h1>
        <p>A conexão com a internet foi perdida. Aguarde a reconexão automática.</p>
        <div class="status">⏳ Aguardando reconexão...</div>
        <div class="tips">
            <h3>Você pode:</h3>
            <ul>
                <li>Consultar dados em cache</li>
                <li>Rascunhar respostas</li>
                <li>Navegar páginas visitadas</li>
            </ul>
        </div>
    </div>
    <script>
        window.addEventListener('online', () => { window.location.href = '/'; });
        if (navigator.onLine) { window.location.href = '/'; }
        setInterval(() => { if (navigator.onLine) { window.location.href = '/'; } }, 5000);
    </script>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});