import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle, Shield, Zap } from 'lucide-react';

/**
 * Guia de Preparação para Produção
 * Checklist final antes de publicar nas stores
 */
export default function ProductionReadinessGuide() {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="max-w-4xl space-y-6">
      <Alert>
        <Zap className="h-4 w-4" />
        <AlertDescription>
          Guia completo de preparação para produção e publicação nas stores
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="security" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="infrastructure">Infra</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
        </TabsList>

        {/* Security */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                Segurança em Produção
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold">Criptografia e Comunicação</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-600">
                  <li>✓ HTTPS/TLS 1.3 obrigatório em produção</li>
                  <li>✓ Certificate pinning para APIs críticas</li>
                  <li>✓ HSTS header ativo</li>
                  <li>✓ CSP (Content Security Policy) configurada</li>
                  <li>✓ CORS stricto (apenas origens conhecidas)</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Autenticação e Autorização</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-600">
                  <li>✓ JWT tokens com expiração (15min)</li>
                  <li>✓ Refresh tokens com longa validade (7 dias)</li>
                  <li>✓ Password hashing com bcrypt (rounds: 12)</li>
                  <li>✓ Rate limiting em login (5 tentativas/15 min)</li>
                  <li>✓ 2FA para contas de admin</li>
                  <li>✓ Session timeout (30 min inatividade)</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Proteção de Dados</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-600">
                  <li>✓ Dados sensíveis não em localStorage (usar sessionStorage)</li>
                  <li>✓ Encriptação de dados em repouso (AES-256)</li>
                  <li>✓ Purga automática de dados temporários</li>
                  <li>✓ Backup encriptado (diário)</li>
                  <li>✓ Sem logs de senhas ou tokens</li>
                  <li>✓ LGPD/GDPR compliance (direito ao esquecimento)</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                <p className="text-sm text-yellow-900">
                  <strong>⚠️ Obrigatório:</strong> Auditoria de segurança antes de produção
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance em Produção</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold">Otimizações Críticas</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-600">
                  <li>✓ Code splitting (lazy loading de rotas)</li>
                  <li>✓ Tree-shaking habilitado (produção)</li>
                  <li>✓ Minificação de JS/CSS</li>
                  <li>✓ Compressão de imagens (WebP)</li>
                  <li>✓ CDN para assets estáticos</li>
                  <li>✓ Caching headers (max-age 1 ano para assets versionados)</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Métricas de Performance</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`Metas de Lighthouse:
┌─ Performance: 80+
├─ Accessibility: 90+
├─ Best Practices: 90+
├─ SEO: 90+
└─ PWA: 90+

Core Web Vitals:
├─ LCP (Largest Contentful Paint): < 2.5s
├─ FID (First Input Delay): < 100ms
└─ CLS (Cumulative Layout Shift): < 0.1`}
                </pre>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Network e Caching</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-600">
                  <li>✓ Service Worker cache strategies ativa</li>
                  <li>✓ Offline mode funcional</li>
                  <li>✓ API requests com retry automático</li>
                  <li>✓ Deduplica requests simultâneas</li>
                  <li>✓ Stale-while-revalidate pattern</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conformidade Legal e Regulatória</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold">LGPD (Lei Geral de Proteção de Dados)</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-600">
                  <li>✓ Consentimento explícito para coleta de dados</li>
                  <li>✓ Política de privacidade clara e acessível</li>
                  <li>✓ Direito de acesso aos dados pessoais</li>
                  <li>✓ Direito de correção/exclusão (DIREITO AO ESQUECIMENTO)</li>
                  <li>✓ Notificação em caso de vazamento (72h)</li>
                  <li>✓ Termo de consentimento na onboarding</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">GDPR (General Data Protection Regulation)</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-600">
                  <li>✓ Dados de usuários da EU protegidos</li>
                  <li>✓ Privacy by design implementado</li>
                  <li>✓ Data Processing Agreement (DPA) com fornecedores</li>
                  <li>✓ Data protection impact assessment (DPIA)</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Acessibilidade</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-600">
                  <li>✓ WCAG 2.1 Level AA compliance</li>
                  <li>✓ Navegação por teclado funcional</li>
                  <li>✓ Screen reader suporte (ARIA labels)</li>
                  <li>✓ Contraste de cores adequado</li>
                  <li>✓ Sem conteúdo que pisca > 3 vezes/segundo</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Termos de Serviço</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-600">
                  <li>✓ Termos de Serviço atualizados</li>
                  <li>✓ Políticas de contas e suspensão</li>
                  <li>✓ Disclaimers sobre uso da plataforma</li>
                  <li>✓ Responsabilidades legais clarificadas</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Infrastructure */}
        <TabsContent value="infrastructure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Infraestrutura de Produção</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold">Deploy e Hosting</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`Opções Recomendadas:
├─ Vercel (frontend)
├─ AWS/Google Cloud (backend)
└─ Railway/Heroku (backend simples)

Requisitos:
✓ Auto-scaling ativo
✓ Load balancing
✓ Multi-region (redundância)
✓ 99.9% uptime SLA`}
                </pre>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Banco de Dados</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-600">
                  <li>✓ Backup automático (diário)</li>
                  <li>✓ Replicação/redundância</li>
                  <li>✓ Encriptação em repouso</li>
                  <li>✓ Indexes otimizados</li>
                  <li>✓ Connection pooling</li>
                  <li>✓ Query monitoring e logging</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Certificados e DNS</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-600">
                  <li>✓ SSL/TLS válido e renovado automaticamente</li>
                  <li>✓ DNS configurado corretamente</li>
                  <li>✓ SPF/DKIM/DMARC para emails</li>
                  <li>✓ CAA records para certificado seguro</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Environment Variables</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# Nunca commitar secrets!
.env.production (nunca no git)
├─ API_KEY
├─ DATABASE_URL
├─ JWT_SECRET
├─ STRIPE_SECRET_KEY
└─ VAPID_PRIVATE_KEY`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring */}
        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitoramento e Observabilidade</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold">Error Tracking</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`Ferramentas Recomendadas:
├─ Sentry (error tracking)
├─ LogRocket (session replay)
└─ Datadog/New Relic (APM)

Logging:
✓ Logs centralizados
✓ Níveis: debug, info, warn, error
✓ Sem dados sensíveis em logs
✓ Rotação de logs`}
                </pre>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Alertas e Notificações</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-600">
                  <li>✓ Alert em erros críticos (Slack/email)</li>
                  <li>✓ Alert em performance degradada</li>
                  <li>✓ Alert em certificado vencendo</li>
                  <li>✓ Alert em disk space baixo</li>
                  <li>✓ Alert em requisições 5xx > threshold</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Métricas a Monitorar</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-600">
                  <li>✓ Taxa de erro (< 0.1%)</li>
                  <li>✓ Response time (< 200ms p95)</li>
                  <li>✓ Uptime (99.9%+)</li>
                  <li>✓ Taxa de rejeição</li>
                  <li>✓ Uso de CPU/memória</li>
                  <li>✓ Conexões ativas ao BD</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Healthchecks</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`GET /api/health
Response: {
  "status": "ok",
  "database": "connected",
  "cache": "connected",
  "uptime": 3600,
  "timestamp": "2026-03-03T10:00:00Z"
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <CheckCircle2 className="w-5 h-5" />
            Checklist Final
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {[
            'Todos os testes unitários passam',
            'E2E tests automatizados completos',
            'Lighthouse audit (90+ em todas as categorias)',
            'Segurança auditada (OWASP Top 10)',
            'LGPD/GDPR compliance validado',
            'Acessibilidade WCAG 2.1 AA',
            'Performance em 4G lento testado',
            'Offline mode funcionando',
            'Push notifications testadas',
            'Backup e recovery testados',
            'Plano de rollback definido',
            'Runbook de troubleshooting criado',
            'Equipe de suporte treinada',
            'Monitoramento ativo',
            'Alertas configurados'
          ].map((item, idx) => (
            <label key={idx} className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm text-green-900">{item}</span>
            </label>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}