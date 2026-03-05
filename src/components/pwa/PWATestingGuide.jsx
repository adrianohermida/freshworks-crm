import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Play, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Componente interativo para testar funcionalidades PWA
 */
export default function PWATestingGuide() {
  const [testResults, setTestResults] = useState({
    serviceWorker: null,
    pwaSupport: null,
    offline: null,
    notifications: null,
    badgeAPI: null,
    cacheAPI: null
  });
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const results = {};

    // Test 1: Service Worker
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      results.serviceWorker = registration ? 'pass' : 'fail';
      console.log('[Test] Service Worker:', registration);
    } catch (err) {
      results.serviceWorker = 'fail';
    }

    // Test 2: PWA Support
    const isPWA = 'serviceWorker' in navigator && 'caches' in window;
    results.pwaSupport = isPWA ? 'pass' : 'fail';

    // Test 3: Offline Detection
    results.offline = navigator.onLine ? 'online' : 'offline';

    // Test 4: Notifications
    try {
      const permission = Notification.permission;
      results.notifications = permission === 'granted' ? 'pass' : permission === 'denied' ? 'blocked' : 'prompt';
    } catch (err) {
      results.notifications = 'unsupported';
    }

    // Test 5: Badge API
    results.badgeAPI = 'setAppBadge' in navigator ? 'pass' : 'unsupported';

    // Test 6: Cache API
    try {
      const cacheNames = await caches.keys();
      results.cacheAPI = cacheNames.length > 0 ? 'pass' : 'empty';
    } catch (err) {
      results.cacheAPI = 'fail';
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pass': return 'text-green-600';
      case 'fail': return 'text-red-600';
      case 'blocked': return 'text-orange-600';
      case 'prompt': return 'text-yellow-600';
      case 'unsupported': return 'text-gray-600';
      case 'online': return 'text-green-600';
      case 'offline': return 'text-red-600';
      case 'empty': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'fail':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <Tabs defaultValue="automated" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="automated">Testes Automáticos</TabsTrigger>
          <TabsTrigger value="manual">Testes Manuais</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Automated Tests */}
        <TabsContent value="automated" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Testes Automáticos do Sistema
              </CardTitle>
              <CardDescription>
                Execute testes para validar suporte PWA do navegador
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button
                onClick={runTests}
                disabled={isRunning}
                className="w-full gap-2"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Executando testes...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Executar Testes
                  </>
                )}
              </Button>

              {Object.keys(testResults).some(k => testResults[k]) && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm mb-3">Resultados:</h3>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(testResults.serviceWorker)}
                      <span className="text-sm">Service Worker</span>
                    </div>
                    <span className={`text-sm font-medium ${getStatusColor(testResults.serviceWorker)}`}>
                      {testResults.serviceWorker === 'pass' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(testResults.pwaSupport)}
                      <span className="text-sm">PWA Support</span>
                    </div>
                    <span className={`text-sm font-medium ${getStatusColor(testResults.pwaSupport)}`}>
                      {testResults.pwaSupport === 'pass' ? 'Suportado' : 'Não suportado'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(testResults.offline)}
                      <span className="text-sm">Status de Conexão</span>
                    </div>
                    <span className={`text-sm font-medium ${getStatusColor(testResults.offline)}`}>
                      {testResults.offline === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(testResults.notifications)}
                      <span className="text-sm">Notifications API</span>
                    </div>
                    <span className={`text-sm font-medium ${getStatusColor(testResults.notifications)}`}>
                      {testResults.notifications === 'pass' ? 'Ativada' : testResults.notifications === 'blocked' ? 'Bloqueada' : 'Prompt necessário'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(testResults.badgeAPI)}
                      <span className="text-sm">Badge API</span>
                    </div>
                    <span className={`text-sm font-medium ${getStatusColor(testResults.badgeAPI)}`}>
                      {testResults.badgeAPI === 'pass' ? 'Suportada' : 'Não suportada'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(testResults.cacheAPI)}
                      <span className="text-sm">Cache API</span>
                    </div>
                    <span className={`text-sm font-medium ${getStatusColor(testResults.cacheAPI)}`}>
                      {testResults.cacheAPI === 'pass' ? 'Operacional' : testResults.cacheAPI === 'empty' ? 'Sem cache' : 'Erro'}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manual Tests */}
        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Testes Manuais em DevTools</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-semibold mb-2">1. Verificar Service Worker</h4>
                <pre className="text-xs overflow-x-auto">
{`F12 > Application > Service Workers
Status: "activated and running"
Scope: http://localhost:5173/`}
                </pre>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-semibold mb-2">2. Verificar Caches</h4>
                <pre className="text-xs overflow-x-auto">
{`F12 > Application > Cache Storage
Caches esperados:
- legal-tasks-v1
- legal-tasks-runtime-v1
- legal-tasks-api-v1`}
                </pre>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-semibold mb-2">3. Simular Offline</h4>
                <pre className="text-xs overflow-x-auto">
{`F12 > Network > Throttling
Marque: "Offline"
Recarregue página
Deve carregar do cache`}
                </pre>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-semibold mb-2">4. Teste de Install Prompt</h4>
                <pre className="text-xs overflow-x-auto">
{`F12 > Application > Manifest
Verifique: icons, name, display
Clique: "Install" button
Ou pressione: "I" no Chrome`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance & Lighthouse</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Execute Lighthouse audit para validar PWA compliance
                </AlertDescription>
              </Alert>

              <div className="space-y-3 text-sm">
                <div className="bg-green-50 border border-green-200 p-3 rounded">
                  <h4 className="font-semibold text-green-900">Meta: PWA Score 90+</h4>
                  <p className="text-green-800 mt-1">
                    F12 > Lighthouse > PWA > Analyze
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                  <h4 className="font-semibold text-blue-900">Meta: Performance 80+</h4>
                  <p className="text-blue-800 mt-1">
                    Deve carregar em &lt;2s em 4G lento
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-3 rounded">
                  <h4 className="font-semibold text-purple-900">Meta: Accessibility 90+</h4>
                  <p className="text-purple-800 mt-1">
                    Navegação por teclado funcional
                  </p>
                </div>
              </div>

              <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# Build para produção
npm run build

# Preview com HTTPS
npm run preview -- --https

# Abra: https://localhost:4173
# F12 > Lighthouse > Analisar`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}