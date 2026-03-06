import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Terminal } from 'lucide-react';

export default function DeploymentRunbook() {
  const sections = [
    {
      title: '🏗️ Pre-Deployment Checklist',
      steps: [
        '1. Verify all code is committed and tested',
        '2. Create production database backup',
        '3. Verify SSL certificates are valid',
        '4. Check all secrets are configured',
        '5. Verify load balancer configuration',
        '6. Test failover procedures',
        '7. Notify stakeholders of deployment window'
      ]
    },
    {
      title: '📦 Database Setup',
      steps: [
        'export DB_HOST="prod-db.aws.com"',
        'export DB_NAME="datajud_prod"',
        'export DB_USER="datajud_user"',
        'export DB_PASSWORD="$SECURE_PASSWORD"',
        'psql -h $DB_HOST -U $DB_USER -d postgres',
        'CREATE DATABASE $DB_NAME WITH ENCODING UTF8;',
        'GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;',
        'psql -h $DB_HOST -U $DB_USER -d $DB_NAME < schema.sql',
        'SELECT count(*) FROM information_schema.tables;'
      ]
    },
    {
      title: '🚀 Application Deployment',
      steps: [
        'git clone https://github.com/yourorg/datajud.git',
        'cd datajud && git checkout v1.0.0',
        'npm ci --production',
        'npm run build',
        'npm run db:migrate',
        'npm run seed:initial',
        'npm start -- --port 3000',
        'curl http://localhost:3000/health',
        'systemctl restart datajud'
      ]
    },
    {
      title: '🔒 Security & SSL',
      steps: [
        'Install SSL certificates in /etc/nginx/certs/',
        'Configure nginx with TLS 1.2+ minimum',
        'Enable HSTS with max-age=31536000',
        'Set security headers: X-Frame-Options, CSP',
        'Configure WAF rules in load balancer',
        'Test SSL configuration: ssllabs.com',
        'Verify certificate pinning in API clients'
      ]
    },
    {
      title: '📡 Infrastructure Setup',
      steps: [
        'Configure Redis cluster (3 nodes)',
        'Setup CloudFlare CDN for static assets',
        'Configure auto-scaling policies',
        'Setup monitoring alerts',
        'Configure log aggregation (ELK stack)',
        'Setup backup schedules (daily + hourly)',
        'Test disaster recovery procedures'
      ]
    },
    {
      title: '🧪 Post-Deployment Tests',
      steps: [
        'Run smoke test suite (5 min)',
        'Verify all API endpoints (10 min)',
        'Test user login flow (5 min)',
        'Validate data sync with DataJud (15 min)',
        'Check performance metrics (5 min)',
        'Verify backups are running (5 min)',
        'Monitor system for 1 hour',
        'Get stakeholder sign-off'
      ]
    },
    {
      title: '📊 Scaling Guidelines',
      steps: [
        'Horizontal scaling: Add API servers behind load balancer',
        'Vertical scaling: Upgrade database instance if CPU > 80%',
        'Cache scaling: Add Redis nodes if memory > 75%',
        'Auto-scaling trigger: CPU > 70% for 5 minutes',
        'Scale down trigger: CPU < 30% for 15 minutes',
        'Max servers: 10 (for cost control)',
        'Min servers: 2 (for high availability)'
      ]
    },
    {
      title: '🚨 Rollback Procedure',
      steps: [
        '1. If critical issue detected:',
        '   - Stop accepting new requests',
        '   - Revert database to latest backup',
        '   - Deploy previous version (v0.x.x)',
        '   - Verify system health',
        '   - Notify stakeholders',
        '2. Post-mortem analysis within 24 hours',
        '3. Root cause analysis and fix'
      ]
    }
  ];

  const TimelineItem = ({ phase, duration, description }) => (
    <div className="flex gap-4 pb-4">
      <div className="flex flex-col items-center">
        <div className="w-4 h-4 bg-cyan-600 rounded-full"></div>
        <div className="w-0.5 h-12 bg-gray-300 dark:bg-gray-600"></div>
      </div>
      <div>
        <p className="font-semibold text-sm">{phase}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">{duration}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Terminal className="w-8 h-8 text-cyan-600" />
        <div>
          <h1 className="text-3xl font-bold">Deployment Runbook v1.0.0</h1>
          <p className="text-gray-600 dark:text-gray-400">Step-by-step guide for production deployment</p>
        </div>
      </div>

      {/* DEPLOYMENT TIMELINE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">📅 Deployment Timeline (est. 2 hours)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <TimelineItem phase="Pre-checks" duration="15 min" description="Verify all prerequisites and backups" />
          <TimelineItem phase="Database Setup" duration="20 min" description="Initialize production database" />
          <TimelineItem phase="Code Deployment" duration="15 min" description="Build and deploy application" />
          <TimelineItem phase="Security Setup" duration="15 min" description="Configure SSL and security headers" />
          <TimelineItem phase="Infrastructure" duration="20 min" description="Setup CDN, caching, monitoring" />
          <TimelineItem phase="Testing" duration="30 min" description="Run smoke and integration tests" />
          <TimelineItem phase="Monitoring" duration="60 min" description="Monitor system health and metrics" />
        </CardContent>
      </Card>

      {/* DEPLOYMENT STEPS */}
      {sections.map((section, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle className="text-base">{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {section.steps.map((step, i) => (
                <div key={i} className="flex gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm font-mono">
                  <span className="text-gray-500 flex-shrink-0">{i + 1}.</span>
                  <span className="text-gray-800 dark:text-gray-200 break-all">{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* ENVIRONMENT VARIABLES */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">🔐 Required Environment Variables</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm font-mono">
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">DB_HOST=prod-db.aws.com</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">DB_NAME=datajud_prod</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">REDIS_URL=redis://prod-cache:6379</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">NODE_ENV=production</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">API_KEY=$DATAJUD_API_KEY</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">JWT_SECRET=$SECURE_SECRET</div>
        </CardContent>
      </Card>

      {/* HEALTH CHECKS */}
      <Card className="bg-green-50 dark:bg-green-900/20">
        <CardHeader>
          <CardTitle className="text-base text-green-900 dark:text-green-100">✅ Health Checks</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-green-900 dark:text-green-100 space-y-1">
          <p>curl http://localhost:3000/health → {"{"}  "status": "ok" {"}"}</p>
          <p>curl http://localhost:3000/api/processes (requires auth) → 200 OK</p>
          <p>Check Datadog/monitoring for error rates {'{<}'} 0.5%</p>
          <p>Verify database connection pooling active</p>
          <p>Confirm Redis cache is operational</p>
        </CardContent>
      </Card>

      {/* SUPPORT CONTACTS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">📞 Support Contacts</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p><strong>DevOps Lead:</strong> +55-92-XXXX-XXXX | ops@datajud.com</p>
          <p><strong>On-Call Engineer:</strong> Check PagerDuty schedule</p>
          <p><strong>Escalation:</strong> CTO at cto@datajud.com</p>
          <p><strong>Emergency:</strong> Slack #prod-incidents channel</p>
        </CardContent>
      </Card>
    </div>
  );
}