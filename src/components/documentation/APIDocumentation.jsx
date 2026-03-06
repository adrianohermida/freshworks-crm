import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Code, BookOpen, Zap } from 'lucide-react';

export default function APIDocumentation() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('tickets');

  const endpoints = {
    tickets: [
      { method: 'GET', path: '/tickets', description: 'Listar todos os tickets' },
      { method: 'POST', path: '/tickets', description: 'Criar novo ticket' },
      { method: 'GET', path: '/tickets/{id}', description: 'Obter detalhe do ticket' },
      { method: 'PUT', path: '/tickets/{id}', description: 'Atualizar ticket' },
      { method: 'DELETE', path: '/tickets/{id}', description: 'Deletar ticket' }
    ],
    contacts: [
      { method: 'GET', path: '/contacts', description: 'Listar contatos' },
      { method: 'POST', path: '/contacts', description: 'Criar contato' },
      { method: 'GET', path: '/contacts/{id}', description: 'Obter contato' }
    ],
    agents: [
      { method: 'GET', path: '/agents', description: 'Listar agentes' },
      { method: 'GET', path: '/agents/{id}', description: 'Obter agente' },
      { method: 'PUT', path: '/agents/{id}', description: 'Atualizar status do agente' }
    ],
    functions: [
      { method: 'POST', path: '/functions/getBulkTicketStats', description: 'Estatísticas de tickets' },
      { method: 'POST', path: '/functions/getPerformanceMetrics', description: 'Métricas de performance' },
      { method: 'POST', path: '/functions/getSLAMonitoring', description: 'Monitoramento de SLA' },
      { method: 'POST', path: '/functions/bulkUpdateTicketsPriority', description: 'Atualizar prioridade em massa' },
      { method: 'POST', path: '/functions/bulkDeleteTickets', description: 'Deletar tickets em massa' }
    ]
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800';
      case 'POST': return 'bg-green-100 text-green-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-6 w-6" />
        <h1 className="text-2xl font-bold">API Documentation</h1>
      </div>

      <Tabs defaultValue="tickets" value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
        <TabsList>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="functions">Custom Functions</TabsTrigger>
        </TabsList>

        {Object.keys(endpoints).map(category => (
          <TabsContent key={category} value={category}>
            <div className="grid gap-4">
              {endpoints[category].map((endpoint, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={getMethodColor(endpoint.method)}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono">{endpoint.path}</code>
                      </div>
                    </div>
                    <CardDescription>{endpoint.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-semibold">1. Caching</h4>
            <p className="text-sm text-gray-600">Use React Query para reduzir chamadas à API</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">2. Paginação</h4>
            <p className="text-sm text-gray-600">Para listas grandes, use paginação com limit/offset</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">3. Error Handling</h4>
            <p className="text-sm text-gray-600">Implemente retry logic com exponential backoff</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">4. Rate Limiting</h4>
            <p className="text-sm text-gray-600">Respeite 600 requisições por 10 minutos</p>
          </div>
        </CardContent>
      </Card>

      {/* Example Request */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Example Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { base44 } from '@/api/base44Client';

// Get all tickets
const tickets = await base44.entities.Ticket.list();

// Create ticket
const newTicket = await base44.entities.Ticket.create({
  subject: 'Help needed',
  description: 'I need support',
  email: 'user@example.com'
});

// Get performance metrics
const metrics = await base44.functions.invoke('getPerformanceMetrics', {
  period: 'week'
});`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}