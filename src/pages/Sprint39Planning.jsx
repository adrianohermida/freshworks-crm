import React, { useState } from 'react';
import { Zap, Target, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import Card from '@/components/aetherlab/Card';

export default function Sprint39Planning() {
  const [selectedPhase, setSelectedPhase] = useState('overview');

  const sprintData = {
    overview: {
      name: 'Sprint 39: Deployment & Monitoring',
      status: 'PLANNED',
      startDate: '2026-03-25',
      endDate: '2026-04-15',
      duration: 21,
      objectiveCount: 6,
      effortDays: 85,
      teamSize: 5
    },
    objectives: [
      {
        id: 1,
        name: 'Production Deployment Automation',
        description: 'CI/CD pipeline completo, automated testing, zero-downtime deploys',
        priority: 'critical',
        estimatedDays: 12,
        dependsOn: 'Sprint 38 completion',
        tasks: [
          'GitHub Actions workflow setup',
          'Database migration automation',
          'Rollback procedures',
          'Health check monitoring'
        ]
      },
      {
        id: 2,
        name: 'Monitoring & Alerting System',
        description: 'Real-time system monitoring, custom alerts, dashboards',
        priority: 'critical',
        estimatedDays: 15,
        dependsOn: 'Sprint 38 completion',
        tasks: [
          'Prometheus setup',
          'Grafana dashboards',
          'Alert rules (CPU, memory, errors)',
          'On-call rotation setup'
        ]
      },
      {
        id: 3,
        name: 'Performance Optimization',
        description: 'Database indexing, API caching, frontend optimization',
        priority: 'high',
        estimatedDays: 18,
        dependsOn: 'None',
        tasks: [
          'Database query optimization',
          'Redis caching layer',
          'Code splitting & lazy loading',
          'Image optimization'
        ]
      },
      {
        id: 4,
        name: 'Security Hardening',
        description: 'Penetration testing, vulnerability scanning, compliance',
        priority: 'critical',
        estimatedDays: 14,
        dependsOn: 'Sprint 38 QA',
        tasks: [
          'OWASP vulnerability scan',
          'SSL/TLS hardening',
          'Rate limiting policies',
          'Security audit & fixes'
        ]
      },
      {
        id: 5,
        name: 'Load Testing & Scalability',
        description: 'K8s setup, auto-scaling, stress testing for 10K concurrent users',
        priority: 'high',
        estimatedDays: 16,
        dependsOn: 'Monitoring setup',
        tasks: [
          'Kubernetes cluster setup',
          'Load balancer configuration',
          'Stress testing (k6)',
          'Auto-scaling policies'
        ]
      },
      {
        id: 6,
        name: 'Documentation & Training',
        description: 'Runbooks, architecture docs, team training',
        priority: 'medium',
        estimatedDays: 10,
        dependsOn: 'All technical work',
        tasks: [
          'Architecture documentation',
          'Deployment runbook',
          'Troubleshooting guide',
          'Team training sessions'
        ]
      }
    ],
    risks: [
      {
        id: 1,
        title: 'Database migration downtime',
        probability: 'medium',
        impact: 'high',
        mitigation: 'Test migrations in staging, use blue-green deployment'
      },
      {
        id: 2,
        title: 'Third-party service unavailability',
        probability: 'low',
        impact: 'high',
        mitigation: 'Circuit breakers, fallback mechanisms, SLA monitoring'
      },
      {
        id: 3,
        title: 'Performance regressions',
        probability: 'high',
        impact: 'medium',
        mitigation: 'Continuous performance testing, baselines, automated alerts'
      }
    ]
  };

  const getPhaseColor = (priority) => {
    switch(priority) {
      case 'critical': return 'var(--color-error)';
      case 'high': return 'var(--color-warning)';
      default: return 'var(--color-info)';
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-xl)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
            <div style={{
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--color-primary)',
              borderRadius: 'var(--border-radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Target style={{ width: '24px', height: '24px', color: 'var(--color-white)' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                🎯 Sprint 39 Planning
              </h1>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: '0.5rem 0 0 0' }}>
                Deployment, Monitoring & Performance
              </p>
            </div>
          </div>

          {/* SPRINT INFO */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <Card variant="default">
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                Duration
              </p>
              <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', margin: 0 }}>
                {sprintData.overview.duration} days
              </p>
            </Card>
            <Card variant="default">
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                Effort Days
              </p>
              <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)', margin: 0 }}>
                {sprintData.overview.effortDays}d
              </p>
            </Card>
            <Card variant="default">
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                Objectives
              </p>
              <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)', margin: 0 }}>
                {sprintData.overview.objectiveCount}
              </p>
            </Card>
          </div>
        </div>

        {/* TABS */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-2xl)',
          borderBottom: '2px solid var(--color-border)',
          paddingBottom: 'var(--spacing-lg)',
          overflowX: 'auto'
        }}>
          {['overview', 'objectives', 'risks'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedPhase(tab)}
              style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                backgroundColor: selectedPhase === tab ? 'var(--color-primary)' : 'transparent',
                color: selectedPhase === tab ? 'var(--color-white)' : 'var(--color-body)',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontWeight: 'var(--font-weight-semibold)',
                transition: 'all 200ms ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab === 'overview' && '📋 Overview'}
              {tab === 'objectives' && '🎯 Objectives'}
              {tab === 'risks' && '⚠️ Risks'}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {selectedPhase === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            <Card variant="elevated">
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
                📅 Timeline
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--spacing-lg)'
              }}>
                <div>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                    Start Date
                  </p>
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                    {new Date(sprintData.overview.startDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                    End Date
                  </p>
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                    {new Date(sprintData.overview.endDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </Card>

            <Card variant="default">
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
                🎯 Goals
              </h3>
              <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', color: 'var(--color-body)', fontSize: 'var(--font-size-sm)' }}>
                <li style={{ marginBottom: 'var(--spacing-sm)' }}>Deploy production-ready application with zero downtime</li>
                <li style={{ marginBottom: 'var(--spacing-sm)' }}>Implement comprehensive monitoring & alerting</li>
                <li style={{ marginBottom: 'var(--spacing-sm)' }}>Achieve 99.95% uptime SLA</li>
                <li style={{ marginBottom: 'var(--spacing-sm)' }}>Support 10K+ concurrent users with &lt; 200ms response time</li>
                <li>Complete security audit & penetration testing</li>
              </ul>
            </Card>
          </div>
        )}

        {selectedPhase === 'objectives' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {sprintData.objectives.map((obj) => (
              <Card key={obj.id} variant="elevated" style={{ borderLeft: `4px solid ${getPhaseColor(obj.priority)}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
                  <div>
                    <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                      {obj.name}
                    </h4>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 0 }}>
                      {obj.description}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: getPhaseColor(obj.priority),
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-bold)',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap'
                  }}>
                    {obj.estimatedDays}d
                  </span>
                </div>

                <div style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--color-light)',
                  borderRadius: 'var(--border-radius-md)',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
                    Depends on: {obj.dependsOn}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase', fontWeight: 'var(--font-weight-semibold)' }}>
                    Tasks
                  </p>
                  <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', color: 'var(--color-body)', fontSize: 'var(--font-size-sm)' }}>
                    {obj.tasks.map((task, idx) => (
                      <li key={idx} style={{ marginBottom: idx < obj.tasks.length - 1 ? 'var(--spacing-xs)' : 0 }}>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        )}

        {selectedPhase === 'risks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {sprintData.risks.map((risk) => (
              <Card key={risk.id} variant="elevated" style={{ borderLeft: '4px solid var(--color-warning)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                  <AlertCircle style={{ width: '24px', height: '24px', color: 'var(--color-warning)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                      {risk.title}
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-lg)' }}>
                      <div>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                          Probability
                        </p>
                        <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)', margin: 0 }}>
                          {risk.probability}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                          Impact
                        </p>
                        <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-error)', margin: 0 }}>
                          {risk.impact}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--color-light)',
                  borderRadius: 'var(--border-radius-md)'
                }}>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase', fontWeight: 'var(--font-weight-semibold)' }}>
                    Mitigation
                  </p>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-heading)', margin: 0 }}>
                    {risk.mitigation}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}