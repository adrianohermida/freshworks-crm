import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Zap } from 'lucide-react';

/**
 * Guia para executar Lighthouse audit
 * Valida conformidade com PWA standards (Google & Apple)
 */
export default function LighthouseAuditGuide() {
  return (
    <div className="max-w-3xl space-y-6">
      <Alert>
        <Zap className="h-4 w-4" />
        <AlertDescription>
          Lighthouse valida PWA, Performance, Acessibilidade e SEO
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Google Lighthouse Audit
          </CardTitle>
          <CardDescription>
            Validar conformidade com PWA standards
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-sm">Passo 1: Build para Produção</h3>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`npm run build`}
            </pre>

            <h3 className="font-semibold text-sm mt-4">Passo 2: Executar preview com HTTPS</h3>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`npm run preview -- --https`}
            </pre>

            <h3 className="font-semibold text-sm mt-4">Passo 3: Abrir Chrome DevTools</h3>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`1. Abra http://localhost:4173 (ou HTTPS)
2. Press F12 (Chrome DevTools)
3. Aba "Lighthouse"
4. Selecione categorias:
   ✓ Performance
   ✓ Accessibility
   ✓ Best Practices
   ✓ SEO
   ✓ PWA
5. Click "Analyze page load"`}
            </pre>
          </div>

          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-sm">
              <strong>Metas de Score:</strong>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>🟢 PWA: 90+</li>
                <li>🟢 Performance: 80+</li>
                <li>🟢 Accessibility: 90+</li>
                <li>🟢 Best Practices: 90+</li>
                <li>🟢 SEO: 90+</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            PWA Checklist de Validação
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>✓ manifest.json com ícones e configurações</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>✓ Service Worker registrado e funcional</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>✓ HTTPS obrigatório (não funciona em HTTP)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>✓ Viewport meta tag configurada</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>✓ Theme color definida</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>✓ Offline fallback (offline.html)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>✓ Install prompt funcionando</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>✓ Push notifications operacional</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Testes Manuais</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">1. Teste de Offline</h4>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`1. DevTools > Network
2. Marque "Offline"
3. Recarregue a página
4. Navegue entre páginas (devem estar em cache)
5. Tente executar ações (devem ir para fila)`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">2. Teste de Install Prompt</h4>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`1. DevTools > Application > Manifest
2. Verifique ícones e dados
3. Clique "Install" ou pressione "I"
4. Confirme instalação
5. Verifique no home screen`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">3. Teste de Service Worker</h4>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`1. DevTools > Application > Service Workers
2. Verifique status "activated"
3. Abas de cache:
   - legal-tasks-v1
   - legal-tasks-runtime-v1
   - legal-tasks-api-v1
4. Verifique precache assets`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">4. Teste de Push Notifications</h4>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`1. DevTools > Application > Manifest
2. Verifique "Subscription"
3. Clique "Send test notification"
4. Notificação deve aparecer
5. Clique para abrir app`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conformidade com Guidelines</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">📱 Google Play (Android)</h4>
            <ul className="list-disc ml-5 space-y-1">
              <li>App deve ter manifest.json válido</li>
              <li>Suporthar offline functionality</li>
              <li>Icons em 192x192 e 512x512</li>
              <li>HTTPS obrigatório</li>
              <li>Display mode: standalone</li>
              <li>Lighthouse PWA score: 90+</li>
            </ul>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">🍎 Apple App Store (iOS)</h4>
            <ul className="list-disc ml-5 space-y-1">
              <li>Viewport meta tag configurada</li>
              <li>apple-mobile-web-app-capable: yes</li>
              <li>apple-mobile-web-app-title</li>
              <li>apple-mobile-web-app-status-bar-style</li>
              <li>Apple icons em 180x180</li>
              <li>HTTPS obrigatório</li>
              <li>Performance score: 80+</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}