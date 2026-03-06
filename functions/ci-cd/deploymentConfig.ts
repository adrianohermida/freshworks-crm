/**
 * CI/CD Pipeline Configuration - Sprint 66 Task 1
 * GitHub Actions + Deno Deploy automático
 * Status: EM ANDAMENTO
 */

const deploymentConfig = {
  pipelines: {
    staging: {
      trigger: 'push to develop branch',
      steps: [
        { step: 1, nome: 'Checkout code', tool: 'GitHub Actions' },
        { step: 2, nome: 'Run tests', tool: 'Deno test' },
        { step: 3, nome: 'Build frontend', tool: 'Vite build' },
        { step: 4, nome: 'Deploy to staging', tool: 'Deno Deploy' },
        { step: 5, nome: 'Smoke tests', tool: 'E2E tests' }
      ],
      duracao: '~8 minutos',
      status: 'configurado'
    },
    production: {
      trigger: 'merge to main branch',
      steps: [
        { step: 1, nome: 'Checkout code', tool: 'GitHub Actions' },
        { step: 2, nome: 'Run full test suite', tool: 'Deno test' },
        { step: 3, nome: 'Code coverage check', tool: 'codecov' },
        { step: 4, nome: 'Build & optimize', tool: 'Vite build + compression' },
        { step: 5, nome: 'Database migrations', tool: 'Knex/migrate' },
        { step: 6, nome: 'Deploy to production', tool: 'Deno Deploy' },
        { step: 7, nome: 'Health checks', tool: 'Datadog health endpoints' },
        { step: 8, nome: 'Rollback ready', tool: 'Blue-green deployment' }
      ],
      duracao: '~15 minutos',
      status: 'configurado',
      rollback: {
        enabled: true,
        strategy: 'blue-green',
        recoveryTime: '< 30 segundos'
      }
    }
  },
  
  environments: {
    staging: {
      url: 'https://staging-legal-tasks.deno.dev',
      database: 'PostgreSQL staging (replicated)',
      cache: 'Redis staging',
      monitoring: 'Datadog staging'
    },
    production: {
      url: 'https://legal-tasks.app',
      database: 'PostgreSQL production (HA + replication)',
      cache: 'Redis production cluster',
      monitoring: 'Datadog production + PagerDuty alerts'
    }
  },

  secrets: [
    { name: 'DENO_DEPLOY_TOKEN', env: 'production', status: '✅ configurado' },
    { name: 'DATABASE_URL', env: 'production', status: '⏳ aguardando setup' },
    { name: 'REDIS_URL', env: 'production', status: '⏳ aguardando setup' },
    { name: 'DATADOG_API_KEY', env: 'production', status: '⏳ aguardando setup' },
    { name: 'PAGERDUTY_TOKEN', env: 'production', status: '⏳ aguardando setup' }
  ],

  qualityGates: {
    testCoverage: { target: '80%', current: 'TBD' },
    buildTime: { target: '< 5min', current: 'TBD' },
    deployTime: { target: '< 15min', current: 'TBD' },
    errorRate: { target: '< 0.1%', current: 'TBD' }
  },

  timeline: {
    started: '2026-03-05',
    phase1_cicd_complete: '2026-03-05 EOD',
    phase2_db_setup: '2026-03-06 morning',
    phase3_ssl: '2026-03-06 afternoon',
    phase4_monitoring: '2026-03-07',
    phase5_loadtest: '2026-03-07 evening'
  }
};

export default deploymentConfig;