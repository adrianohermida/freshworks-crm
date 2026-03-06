
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Added AlertTitle
import { CheckCircle2, AlertCircle, Server, Zap, Rocket } from 'lucide-react'; // Added Rocket icon
import { Badge } from '@/components/ui/badge';

export const DEPLOYMENT_GUIDE = {
  title: "🚀 Deployment Guide - Freshdesk Manager v1.0.0",
  
  preDeployment: {
    checks: [
      "✅ Todos os testes passando",
      "✅ Code review completo",
      "✅ Lighthouse score > 90",
      "✅ Mobile responsiveness validado",
      "✅ PWA funcionando offline",
      "✅ Analytics integrado",
      "✅ Error tracking ativo",
      "✅ Performance monitoring ativo"
    ],
    
    envVariables: {
      production: {
        VITE_FRESHDESK_DOMAIN: "seu-dominio.freshdesk.com",
        VITE_FRESHDESK_API_KEY: "sua-api-key-prod",
        VITE_FRESHDESK_BASIC_TOKEN: "seu-token-prod",
        VITE_APP_ENV: "production",
        VITE_SENTRY_DSN: "seu-sentry-dsn"
      },
      staging: {
        VITE_FRESHDESK_DOMAIN: "seu-dominio-staging.freshdesk.com",
        VITE_FRESHDESK_API_KEY: "sua-api-key-staging",
        VITE_FRESHDESK_BASIC_TOKEN: "seu-token-staging",
        VITE_APP_ENV: "staging"
      }
    }
  },

  deploymentOptions: [
    {
      name: "Base44 Platform",
      steps: [
        "1. Connect GitHub repo no Base44 Dashboard",
        "2. Configure environment variables",
        "3. Branch protection: require PR reviews",
        "4. Auto-deploy on merge to main",
        "5. Monitor via Base44 monitoring"
      ],
      time: "~5 minutes"
    },
    {
      name: "Vercel",
      steps: [
        "1. npm run build",
        "2. vercel deploy --prod",
        "3. Configure domains & SSL",
        "4. Setup GitHub integration",
        "5. Configure preview deployments"
      ],
      time: "~10 minutes"
    },
    {
      name: "Docker",
      steps: [
        "1. docker build -t freshdesk-manager .",
        "2. docker run -p 3000:3000 freshdesk-manager",
        "3. Configure reverse proxy (nginx)",
        "4. Setup SSL certificates",
        "5. Configure auto-restart"
      ],
      time: "~15 minutes"
    }
  ],

  postDeployment: {
    verification: [
      "✅ App loads in <3 seconds",
      "✅ All pages accessible",
      "✅ Dashboard shows data",
      "✅ Tickets sync from Freshdesk",
      "✅ Offline mode functional",
      "✅ Analytics tracking active",
      "✅ Error tracking working",
      "✅ PWA installable"
    ],
    
    monitoring: [
      "📊 Lighthouse score > 90",
      "⏱️ Core Web Vitals within targets",
      "📈 Analytics events flowing",
      "🐛 Error rate < 0.1%",
      "🔒 HTTPS working (100%)",
      "🚀 Response times < 500ms"
    ],

    rollback: {
      procedure: "1. Revert to previous git commit, 2. Redeploy, 3. Notify users",
      time: "~5 minutes"
    }
  },

  monitoring: {
    tools: [
      "Base44 Dashboard - Native monitoring",
      "Sentry - Error tracking (optional)",
      "Lighthouse CI - Performance monitoring",
      "Google Analytics - User analytics"
    ],
    
    alerts: {
      critical: "Error rate > 5% | Response time > 2s | Uptime < 99%",
      warning: "Error rate > 1% | Response time > 1s | Uptime < 99.5%"
    }
  }
};

export default function DeploymentGuide() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Server className="h-6 w-6" />
        <h1 className="text-2xl font-bold">{DEPLOYMENT_GUIDE.title}</h1>
      </div>

      {/* Pre-Deployment Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Pre-Deployment Checklist</CardTitle>
          <CardDescription>Tarefas antes de fazer deploy em produção</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {DEPLOYMENT_GUIDE.preDeployment.checks.map((item, idx) => {
              const isChecked = item.startsWith('✅');
              const displayItem = item.replace(/^[✅✖️]/, '').trim(); // Remove icon for display
              return (
                <div key={idx} className="flex items-center gap-2">
                  {isChecked ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                  <span className={isChecked ? 'text-gray-900' : 'text-gray-600'}>
                    {displayItem}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Environment Setup */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Setup</CardTitle>
          <CardDescription>Configurar variáveis de produção e staging</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Production Environment Variables</h4>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
              {Object.entries(DEPLOYMENT_GUIDE.preDeployment.envVariables.production)
                .map(([key, value]) => `${key}=${value}`)
                .join('\n')}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Staging Environment Variables</h4>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
              {Object.entries(DEPLOYMENT_GUIDE.preDeployment.envVariables.staging)
                .map(([key, value]) => `${key}=${value}`)
                .join('\n')}
            </pre>
          </div>

          <Alert>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>
              Para variáveis com prefixo `VITE_`, use o Secrets Manager do seu provedor de cloud ou ferramenta de CI/CD para produção.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Deployment Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Deployment Options
          </CardTitle>
          <CardDescription>Escolha a melhor plataforma para o seu deploy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {DEPLOYMENT_GUIDE.deploymentOptions.map((option, idx) => (
            <div key={idx} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-lg">{option.name}</h4>
                <Badge variant="outline" className="text-gray-600">{option.time}</Badge>
              </div>
              <ul className="list-inside text-sm text-gray-700 space-y-1">
                {option.steps.map((step, stepIdx) => (
                  <li key={stepIdx} className="flex items-start gap-2">
                    <span className="text-blue-500 font-medium">{step.split('.')[0]}.</span>
                    <span>{step.substring(step.indexOf('.') + 1).trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Monitoring & Alerting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Monitoring & Alerting
          </CardTitle>
          <CardDescription>Configurações essenciais para observabilidade em produção</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Key Metrics to Monitor</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
              <li>API Response Time (target: &lt;500ms)</li>
              <li>Error Rate (target: &lt;0.1%)</li>
              <li>Database Connections (max: 20)</li>
              <li>Memory Usage (max: 512MB)</li>
              <li>CPU Usage (max: 80%)</li>
              <li>Ticket Creation Rate</li>
              <li>SLA Compliance</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Recommended Tools</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
              {DEPLOYMENT_GUIDE.monitoring.tools.map((tool, idx) => (
                <li key={idx}>{tool}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Alerts Configuration</h4>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Critical Alerts</AlertTitle>
              <AlertDescription>
                {DEPLOYMENT_GUIDE.monitoring.alerts.critical}
              </AlertDescription>
            </Alert>
            <Alert className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning Alerts</AlertTitle>
              <AlertDescription>
                {DEPLOYMENT_GUIDE.monitoring.alerts.warning}
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Rollback Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Rollback Plan</CardTitle>
          <CardDescription>Em caso de problemas, execute o plano de rollback</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Tenha um plano de rollback pronto antes de fazer deploy!
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h4 className="font-semibold">Rollback Procedure</h4>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
              {DEPLOYMENT_GUIDE.postDeployment.rollback.procedure.split(', ').map((step, idx) => (
                <li key={idx}>{step.trim()}</li>
              ))}
            </ol>
            <p className="text-sm text-gray-600 mt-2">
              Estimated Rollback Time: <span className="font-medium">{DEPLOYMENT_GUIDE.postDeployment.rollback.time}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Post-Deployment Verification */}
      <Card>
        <CardHeader>
          <CardTitle>Post-Deployment Verification</CardTitle>
          <CardDescription>Verificações essenciais após o deploy em produção</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Immediate Verification</h4>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              {DEPLOYMENT_GUIDE.postDeployment.verification.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Continuous Monitoring Checks</h4>
            <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
              {DEPLOYMENT_GUIDE.postDeployment.monitoring.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
