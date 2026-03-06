const fs = require('fs');
const path = require('path');
const http = require('http');
const { URL } = require('url');
const { getDashboardSummary } = require('./services/dashboardService');
const { ensureDataDirectory, initializeDatabase, databasePath } = require('./services/database');

const port = Number(process.env.PORT) || 3000;

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}

function sendStaticFile(response, filePath) {
  if (!fs.existsSync(filePath)) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Arquivo não encontrado');
    return;
  }

  const extension = path.extname(filePath);
  const contentTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8'
  };

  response.writeHead(200, { 'Content-Type': contentTypes[extension] || 'text/plain; charset=utf-8' });
  response.end(fs.readFileSync(filePath));
}

const server = http.createServer(async (request, response) => {
  const currentUrl = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === 'GET' && currentUrl.pathname === '/health') {
    sendJson(response, 200, { status: 'ok' });
    return;
  }

  if (request.method === 'GET' && currentUrl.pathname === '/api/dashboard/summary') {
    try {
      const summary = await getDashboardSummary();
      sendJson(response, 200, summary);
    } catch (error) {
      sendJson(response, 500, {
        message: 'Falha ao carregar dados operacionais do dashboard.',
        details: error.message
      });
    }
    return;
  }

  const publicDirectory = path.join(process.cwd(), 'public');
  const staticPath = currentUrl.pathname === '/' ? '/index.html' : currentUrl.pathname;
  sendStaticFile(response, path.join(publicDirectory, staticPath));
});

function bootstrap() {
  ensureDataDirectory();
  initializeDatabase();

  server.listen(port, () => {
    console.log(`Servidor operacional disponível em http://localhost:${port}`);
    console.log(`Banco SQLite local: ${databasePath}`);
  });
}

bootstrap();
