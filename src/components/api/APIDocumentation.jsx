import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, ExternalLink } from 'lucide-react';

const API_ENDPOINTS = [
  {
    title: 'Listar Tickets',
    method: 'GET',
    endpoint: '/api/tickets',
    description: 'Retorna lista de todos os tickets',
    scopes: ['tickets:read'],
    example: {
      url: 'GET /api/tickets?status=open&limit=10',
      response: `{
  "success": true,
  "data": [
    {
      "id": "ticket_123",
      "subject": "Problema com login",
      "status": "open",
      "priority": "high"
    }
  ],
  "total": 42
}`
    }
  },
  {
    title: 'Obter Ticket',
    method: 'GET',
    endpoint: '/api/tickets/:id',
    description: 'Retorna detalhes de um ticket específico',
    scopes: ['tickets:read'],
    example: {
      url: 'GET /api/tickets/ticket_123',
      response: `{
  "id": "ticket_123",
  "subject": "Problema com login",
  "description": "Não consigo fazer login",
  "status": "open",
  "priority": "high",
  "customer_email": "user@example.com"
}`
    }
  },
  {
    title: 'Criar Ticket',
    method: 'POST',
    endpoint: '/api/tickets',
    description: 'Cria um novo ticket',
    scopes: ['tickets:write'],
    example: {
      url: 'POST /api/tickets',
      request: `{
  "subject": "Novo problema",
  "description": "Descrição detalhada",
  "customer_email": "user@example.com",
  "priority": "medium"
}`,
      response: `{
  "id": "ticket_456",
  "subject": "Novo problema",
  "status": "open",
  "created_at": "2026-03-03T10:00:00Z"
}`
    }
  },
  {
    title: 'Atualizar Ticket',
    method: 'PUT',
    endpoint: '/api/tickets/:id',
    description: 'Atualiza um ticket existente',
    scopes: ['tickets:write'],
    example: {
      url: 'PUT /api/tickets/ticket_123',
      request: `{
  "status": "resolved",
  "priority": "low"
}`,
      response: `{
  "success": true,
  "message": "Ticket atualizado"
}`
    }
  },
  {
    title: 'Obter Analytics',
    method: 'GET',
    endpoint: '/api/analytics',
    description: 'Retorna métricas de analytics',
    scopes: ['analytics:read'],
    example: {
      url: 'GET /api/analytics?period=monthly',
      response: `{
  "total_tickets": 156,
  "resolved_tickets": 142,
  "avg_resolution_time_hours": 4.2,
  "customer_satisfaction": 4.7
}`
    }
  }
];

const AUTHENTICATION = `
Authorization: Bearer YOUR_API_KEY

Exemplo com curl:
curl -H "Authorization: Bearer sk_live_abc123..." \\
  https://api.freshdesk-manager.com/api/tickets
`;

export default function APIDocumentation() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const methodColors = {
    GET: 'bg-blue-100 text-blue-800',
    POST: 'bg-green-100 text-green-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800',
    PATCH: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="space-y-6">
      {/* Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>🔐 Autenticação</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Todas as requisições à API precisam incluir uma chave API válida no header de autorização.
          </p>
          <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-xs mb-4 overflow-x-auto">
            <pre>{AUTHENTICATION}</pre>
          </div>
          <p className="text-xs text-gray-500">
            As chaves API podem ser geradas na aba "Chaves API" nas configurações.
          </p>
        </CardContent>
      </Card>

      {/* Base URL */}
      <Card>
        <CardHeader>
          <CardTitle>🔗 URL Base</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-3 rounded font-mono text-sm flex items-center justify-between">
            <span>https://api.freshdesk-manager.com/api</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard('https://api.freshdesk-manager.com/api', 'base-url')}
            >
              {copied === 'base-url' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Endpoints */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">📚 Endpoints</h3>
        {API_ENDPOINTS.map((endpoint, idx) => (
          <Card key={idx} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader
              onClick={() => setSelectedEndpoint(selectedEndpoint === idx ? null : idx)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Badge className={methodColors[endpoint.method]}>
                    {endpoint.method}
                  </Badge>
                  <div>
                    <p className="font-semibold">{endpoint.title}</p>
                    <p className="text-xs text-gray-600 font-mono">{endpoint.endpoint}</p>
                  </div>
                </div>
                <span className="text-gray-400">
                  {selectedEndpoint === idx ? '▼' : '▶'}
                </span>
              </div>
            </CardHeader>

            {selectedEndpoint === idx && (
              <CardContent className="pt-0 space-y-4 border-t">
                <div>
                  <p className="text-sm font-medium mb-2">Descrição</p>
                  <p className="text-sm text-gray-600">{endpoint.description}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Permissões Necessárias</p>
                  <div className="flex gap-2 flex-wrap">
                    {endpoint.scopes.map(scope => (
                      <Badge key={scope} variant="outline">{scope}</Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded space-y-3">
                  <div>
                    <p className="text-xs font-medium mb-2">Exemplo de Requisição</p>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto flex items-center justify-between">
                      <span>{endpoint.example.url}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-2"
                        onClick={() => copyToClipboard(endpoint.example.url, `url-${idx}`)}
                      >
                        {copied === `url-${idx}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>

                  {endpoint.example.request && (
                    <div>
                      <p className="text-xs font-medium mb-2">Body da Requisição</p>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
                        <pre>{endpoint.example.request}</pre>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-medium mb-2">Resposta Esperada</p>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
                      <pre>{endpoint.example.response}</pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Error Codes */}
      <Card>
        <CardHeader>
          <CardTitle>⚠️ Códigos de Erro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { code: 400, message: 'Requisição inválida - verifique os parâmetros' },
              { code: 401, message: 'Não autorizado - chave API inválida ou expirada' },
              { code: 403, message: 'Acesso proibido - sua chave não tem permissão' },
              { code: 404, message: 'Recurso não encontrado' },
              { code: 429, message: 'Limite de requisições excedido' },
              { code: 500, message: 'Erro interno do servidor' }
            ].map(error => (
              <div key={error.code} className="flex gap-3 pb-3 border-b last:border-0">
                <Badge className="mt-0.5">{error.code}</Badge>
                <p className="text-sm text-gray-600">{error.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rate Limiting */}
      <Card>
        <CardHeader>
          <CardTitle>⏱️ Rate Limiting</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            A API tem limitadores de taxa para proteger o serviço. Você receberá um header indicando seu uso:
          </p>
          <div className="bg-gray-100 p-3 rounded font-mono text-xs space-y-2">
            <p><span className="font-semibold">X-RateLimit-Limit:</span> 1000 (requisições por hora)</p>
            <p><span className="font-semibold">X-RateLimit-Remaining:</span> 850</p>
            <p><span className="font-semibold">X-RateLimit-Reset:</span> 1704067200</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}