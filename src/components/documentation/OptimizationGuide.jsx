import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Zap, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function OptimizationGuide() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Zap className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Performance Optimization</h1>
      </div>

      {/* Current Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Current Performance Metrics</CardTitle>
          <CardDescription>Benchmarks da aplicação atual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600">Home page load</p>
              <p className="text-2xl font-bold">~2s</p>
              <Badge className="mt-2 bg-yellow-100 text-yellow-800">Target: &lt;1.5s</Badge>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600">Tickets list</p>
              <p className="text-2xl font-bold">~1.5s</p>
              <Badge className="mt-2 bg-yellow-100 text-yellow-800">Target: &lt;1s</Badge>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600">Performance dashboard</p>
              <p className="text-2xl font-bold">~2.5s</p>
              <Badge className="mt-2 bg-yellow-100 text-yellow-800">Target: &lt;2s</Badge>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600">SLA monitoring</p>
              <p className="text-2xl font-bold">~1s</p>
              <Badge className="mt-2 bg-green-100 text-green-800">✅ On target</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Caching Strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            React Query Caching
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>
              Implementado em toda a aplicação para reduzir chamadas desnecessárias
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold">Cache Configuration</h4>
              <pre className="bg-gray-100 p-3 rounded text-xs mt-2 overflow-x-auto">
{`staleTime: 5 * 60 * 1000,    // 5 minutos
gcTime: 10 * 60 * 1000,      // 10 minutos
refetchOnWindowFocus: false   // Não refetch ao focar`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold">Cache Keys</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                <li>['tickets'] - Lista geral</li>
                <li>['tickets', id] - Detalhe específico</li>
                <li>['contacts'] - Lista de contatos</li>
                <li>['performance-metrics', period] - Métricas por período</li>
                <li>['sla-monitoring'] - Monitoramento de SLA</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimizations Implemented */}
      <Card>
        <CardHeader>
          <CardTitle>✅ Optimizations Já Implementadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              'React Query caching com staleTime/gcTime',
              'Lazy loading de componentes com Suspense',
              'Code splitting por página',
              'Batch requests paralelos com Promise.all',
              'Paginação para listas grandes',
              'Fetch nativa ao invés de Axios',
              'Tree shaking com imports específicos',
              'Dark mode com CSS variables'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Future Optimizations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-blue-600">Curto Prazo (1-2 semanas)</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
              <li>Service Worker para offline mode</li>
              <li>IndexedDB para cache local</li>
              <li>Compress API responses (gzip)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-600">Médio Prazo (1 mês)</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
              <li>API rate limiting inteligente</li>
              <li>Request deduplication</li>
              <li>CDN para assets estáticos</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-600">Longo Prazo (3+ meses)</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
              <li>GraphQL ao invés de REST</li>
              <li>WebSocket para real-time updates</li>
              <li>Machine learning para SLA prediction</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}