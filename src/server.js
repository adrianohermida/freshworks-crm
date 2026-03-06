const fs = require('fs');
const path = require('path');
const http = require('http');
const { URL } = require('url');

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
    '.js': 'application/javascript; charset=utf-8',
    '.jsx': 'application/javascript; charset=utf-8',
    '.sql': 'text/plain; charset=utf-8'
  };

  response.writeHead(200, { 'Content-Type': contentTypes[extension] || 'text/plain; charset=utf-8' });
  response.end(fs.readFileSync(filePath));
}

const server = http.createServer((request, response) => {
  const currentUrl = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === 'GET' && currentUrl.pathname === '/health') {
    sendJson(response, 200, { status: 'ok' });
    return;
  }

  const siteDirectory = path.join(process.cwd(), 'src');
  const staticPath = currentUrl.pathname === '/' ? '/index.html' : currentUrl.pathname;
  sendStaticFile(response, path.join(siteDirectory, staticPath));
});

server.listen(port, () => {
  console.log(`Site disponível em http://localhost:${port}`);
});
