import React, { useState } from 'react';
import Button from '@/components/aetherlab/Button';
import Card from '@/components/aetherlab/Card';
import { CheckCircle2, AlertCircle, TrendingUp, Zap, Target } from 'lucide-react';

export default function Sprint38Status() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const sprintReview = {
    sprint36_status: {
      title: 'Sprint 36 - Status Final',
      completion: 95,
      tasks: [
        { name: 'Stripe PCI Compliance', status: '✅ DONE' },
        { name: 'Performance Baselines', status: '✅ DONE' },
        { name: 'v2.0.0 Production Deployment', status: '✅ DONE' },
        { name: 'Uptime 99.9% Validation', status: '✅ DONE' },
      ],
      blockers: [
        '⚠️ Minor: Google Sheets sync timeout (3 casos) - FIX PENDING'
      ]
    },
    sprint37_readiness: {
      title: 'Sprint 37 - Verificação de Pré-Requisitos',
      completion: 40,
      status: 'IN PROGRESS',
      current_tasks: [
        { name: 'Advanced Analytics Dashboard UI', progress: 20, status: 'in_progress' },
        { name: 'Marketplace API Foundation', progress: 25, status: 'in_progress' },
        { name: 'SDK JavaScript', progress: 0, status: 'blocked' },
        { name: 'Multi-Tenancy Improvements', progress: 0, status: 'planned' },
      ]
    }
  };

  const sprint38_plan = {
    objectives: [
      {
        title: '🎯 Finalize Design System Aetherlab',
        tasks: [
          'Refactor Dashboard com Button/Input/Card Aetherlab ✅',
          'Refactor Processes page com componentes Aetherlab ✅',
          'Aplicar design system em todas as pages restantes',
          'Validar consistência visual em light/dark mode',
          'Documentar componentes Aetherlab'
        ],
        progress: 40,
        owner: 'Sprint Executor',
        timeline: '3 dias'
      },
      {
        title: '⚡ Fix Sprint 36 Blockers',
        tasks: [
          'Google Sheets sync timeout investigation',
          'Implement retry logic com exponential backoff',
          'Add monitoring para sheet sync failures',
          'Deploy hotfix em produção'
        ],
        progress: 0,
        owner: 'Backend Team',
        timeline: '2 dias'
      },
      {
        title: '🚀 Complete Sprint 37 Core Features',
        tasks: [
          'Finish Advanced Analytics Dashboard (80% → 100%)',
          'Complete Marketplace API partner dashboard',
          'Initialize SDK JavaScript/TypeScript',
          'Setup NPM package infrastructure'
        ],
        progress: 15,
        owner: 'Sprint 37 Team',
        timeline: '10 dias'
      },
      {
        title: '📊 Improve Testing & QA',
        tasks: [
          'Increase test coverage para 85%+',
          'Setup E2E tests para critical paths',
          'Performance testing: load 10k concurrent users',
          'Security audit com external team'
        ],
        progress: 0,
        owner: 'QA Team',
        timeline: '7 dias'
      },
      {
        title: '📈 Analytics & Monitoring',
        tasks: [
          'Implement custom event tracking',
          'Setup performance dashboards',
          'Add error tracking com Sentry',
          'Metrics: latency, throughput, error rates'
        ],
        progress: 0,
        owner: 'DevOps Team',
        timeline: '5 dias'
      }
    ],
    timeline: {
      start: '2026-03-04',
      end: '2026-03-25',
      days: 21,
      phases: [
        { name: 'Dias 1-3', desc: 'Fix blockers + Design System' },
        { name: 'Dias 4-10', desc: 'Feature Development' },
        { name: 'Dias 11-17', desc: 'Testing & Integration' },
        { name: 'Dias 18-21', desc: 'Refinement & Deployment' }
      ]
    }
  };

  const calculateOverallProgress = () => {
    const total = sprint38_plan.objectives.reduce((sum, obj) => sum + obj.progress, 0);
    return Math.round(total / sprint38_plan.objectives.length);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-xl)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
            <Zap style={{ width: '32px', height: '32px', color: 'var(--color-primary)' }} />
            <div>
              <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                Sprint 38 - Execution Plan
              </h1>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', marginTop: 'var(--spacing-sm)', margin: 0 }}>
                Design System Finalization + Feature Acceleration + QA Hardening
              </p>
            </div>
          </div>
        </div>

        {/* SPRINT REVIEW SECTION */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-2xl)' }}>
          <Card variant="elevated">
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0 }}>
                ✅ Sprint 36 Completed
              </h3>
              <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)', marginTop: 'var(--spacing-md)' }}>
                95%
              </div>
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {sprintReview.sprint36_status.tasks.map((task, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px', color: 'var(--color-success)', flexShrink: 0 }} />
                  <span>{task.name}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="elevated">
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0 }}>
                🔄 Sprint 37 In Progress
              </h3>
              <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info)', marginTop: 'var(--spacing-md)' }}>
                40%
              </div>
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {sprintReview.sprint37_readiness.current_tasks.slice(0, 3).map((task, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <TrendingUp style={{ width: '16px', height: '16px', color: task.status === 'blocked' ? 'var(--color-error)' : 'var(--color-info)', flexShrink: 0 }} />
                  <span>{task.name} ({task.progress}%)</span>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="elevated" style={{ borderLeft: '4px solid var(--color-warning)' }}>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0 }}>
                ⚠️ Blockers Identificados
              </h3>
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-error)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {sprintReview.sprint36_status.blockers.map((blocker, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-sm)' }}>
                  <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0, marginTop: '2px' }} />
                  <span>{blocker}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* SPRINT 38 OBJECTIVES */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', marginBottom: 'var(--spacing-lg)', margin: 0 }}>
            🎯 Sprint 38 Objectives ({calculateOverallProgress()}% Overall)
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {sprint38_plan.objectives.map((obj, idx) => (
              <Card key={idx} variant="default">
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0 }}>
                    {obj.title}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-body)' }}>
                    <span>Progress: {obj.progress}%</span>
                    <span>Timeline: {obj.timeline}</span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px', marginTop: 'var(--spacing-sm)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', backgroundColor: 'var(--color-primary)', width: `${obj.progress}%`, transition: 'width 300ms ease' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  {obj.tasks.map((task, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--color-body)' }}>
                      <span style={{ color: task.includes('✅') ? 'var(--color-success)' : 'var(--color-primary)', marginTop: '2px', flexShrink: 0 }}>→</span>
                      <span>{task.replace(/[✅]/g, '').trim()}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)', fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', opacity: 0.7 }}>
                  Owner: {obj.owner}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* TIMELINE */}
        <Card variant="elevated">
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', marginBottom: 'var(--spacing-lg)', margin: 0 }}>
            📅 Timeline: {sprint38_plan.timeline.days} dias ({sprint38_plan.timeline.start} → {sprint38_plan.timeline.end})
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {sprint38_plan.timeline.phases.map((phase, idx) => (
              <div key={idx} style={{ padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-light)', borderRadius: 'var(--border-radius-md)', borderLeft: '4px solid var(--color-primary)' }}>
                <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', marginBottom: 'var(--spacing-sm)' }}>
                  {phase.name}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)' }}>
                  {phase.desc}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ACTION ITEMS */}
        <Card variant="default" style={{ marginTop: 'var(--spacing-2xl)', borderLeft: '4px solid var(--color-success)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', marginBottom: 'var(--spacing-lg)', margin: 0 }}>
            ✅ Ações Imediatas (Próximas 24h)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
            <div>
              <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                1️⃣ Design System
              </div>
              <ul style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', paddingLeft: 'var(--spacing-lg)', margin: 0 }}>
                <li>✅ Refactor Dashboard</li>
                <li>✅ Refactor Processes</li>
                <li>→ Refactor Settings page</li>
                <li>→ Refactor AdminPanel</li>
              </ul>
            </div>
            <div>
              <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                2️⃣ Bug Fixes
              </div>
              <ul style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', paddingLeft: 'var(--spacing-lg)', margin: 0 }}>
                <li>→ Investigate Google Sheets timeout</li>
                <li>→ Implement retry mechanism</li>
                <li>→ Add error logging</li>
                <li>→ Production deployment</li>
              </ul>
            </div>
            <div>
              <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                3️⃣ Sprint 37 Push
              </div>
              <ul style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', paddingLeft: 'var(--spacing-lg)', margin: 0 }}>
                <li>→ Complete Analytics 40%→80%</li>
                <li>→ Start SDK setup</li>
                <li>→ Marketplace partner dashboard</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}