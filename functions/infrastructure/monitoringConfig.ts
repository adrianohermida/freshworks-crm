/**
 * Monitoring & Alertas Production - Sprint 66 Task 4
 * Datadog + PagerDuty
 * Status: EM ANDAMENTO
 */

const monitoringConfig = {
  datadog: {
    status: '✅ Agent instalado',
    metrics: {
      application: {
        enabled: true,
        apm: 'Datadog APM active',
        logs: 'Log collection configured',
        tracing: 'Distributed tracing enabled'
      },
      infrastructure: {
        enabled: true,
        cpu: 'monitored',
        memory: 'monitored',
        disk: 'monitored',
        network: 'monitored'
      },
      database: {
        enabled: true,
        replicationLag: 'alert if > 500ms',
        connectionPooling: 'monitored',
        slowQueries: 'threshold 1000ms'
      }
    },
    dashboards: [
      { name: 'System Overview', status: '✅ live' },
      { name: 'API Performance', status: '✅ live' },
      { name: 'Database Health', status: '✅ live' },
      { name: 'Infrastructure Metrics', status: '⏳ in progress' }
    ]
  },

  pagerduty: {
    status: '⏳ Configuração em andamento',
    oncall: {
      primary: 'ops-team-primary@legal-tasks.app',
      secondary: 'ops-team-secondary@legal-tasks.app',
      rotation: 'weekly on-call schedule'
    },
    escalationPolicy: {
      level1: '5 min - Primary on-call',
      level2: '10 min - Secondary on-call',
      level3: '15 min - Engineering manager'
    },
    integrations: [
      { name: 'Datadog', status: '⏳ configurando' },
      { name: 'GitHub', status: 'planejado' },
      { name: 'Slack', status: 'planejado' }
    ]
  },

  alertRules: [
    {
      name: 'Error Rate > 1%',
      severity: 'critical',
      condition: 'error_rate > 0.01',
      notification: 'Slack + PagerDuty',
      status: '✅ active'
    },
    {
      name: 'P95 Latency > 500ms',
      severity: 'warning',
      condition: 'p95_latency > 500ms',
      notification: 'Slack + PagerDuty',
      status: '✅ active'
    },
    {
      name: 'Database Replication Lag',
      severity: 'critical',
      condition: 'replication_lag > 500ms',
      notification: 'PagerDuty immediate',
      status: '✅ active'
    },
    {
      name: 'Memory Usage > 85%',
      severity: 'warning',
      condition: 'memory_percent > 85',
      notification: 'Slack',
      status: '✅ active'
    },
    {
      name: 'Disk Space < 20%',
      severity: 'critical',
      condition: 'disk_free_percent < 20',
      notification: 'PagerDuty immediate',
      status: '✅ active'
    },
    {
      name: 'SSL Certificate Expiry Warning',
      severity: 'warning',
      condition: 'days_until_expiry < 30',
      notification: 'Email + Slack',
      status: '✅ active'
    }
  ],

  notifications: {
    slack: {
      enabled: true,
      channels: [
        '#ops-alerts',
        '#engineering-critical'
      ]
    },
    email: {
      enabled: true,
      recipients: ['ops-team@legal-tasks.app']
    },
    sms: {
      enabled: true,
      onCriticalOnly: true
    }
  },

  slos: {
    availability: { target: '99.9%', current: 'n/a' },
    latency: { target: 'p95 < 200ms', current: 'n/a' },
    errorRate: { target: '< 0.1%', current: 'n/a' },
    mttr: { target: '< 15 min', current: 'n/a' }
  },

  timeline: {
    datadog_setup: '2026-03-06 morning',
    pagerduty_config: '2026-03-06 afternoon',
    alert_rules_live: '2026-03-06 17:00 UTC',
    validation: '2026-03-07'
  }
};

export default monitoringConfig;