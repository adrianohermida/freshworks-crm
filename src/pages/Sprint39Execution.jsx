import React, { useState } from 'react';
import { Zap, CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import Card from '@/components/aetherlab/Card';

export default function Sprint39Execution() {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedTask, setExpandedTask] = useState(null);

  const executionData = {
    sprint: 39,
    startDate: '2026-03-25',
    currentDate: '2026-03-04',
    endDate: '2026-04-15',
    status: 'PLANNED',
    overallProgress: 0,
    tasks: [
      {
        id: 1,
        phase: 1,
        name: 'Production Deployment Automation',
        category: 'Deployment',
        status: 'pending',
        progress: 0,
        estimatedDays: 12,
        actualDays: 0,
        priority: 'critical',
        owner: 'DevOps Team',
        subtasks: [
          { name: 'GitHub Actions workflow setup', status: 'pending', completion: 0 },
          { name: 'Database migration automation', status: 'pending', completion: 0 },
          { name: 'Rollback procedures', status: 'pending', completion: 0 },
          { name: 'Health check monitoring', status: 'pending', completion: 0 }
        ]
      },
      {
        id: 2,
        phase: 1,
        name: 'Monitoring & Alerting System',
        category: 'Infrastructure',
        status: 'pending',
        progress: 0,
        estimatedDays: 15,
        actualDays: 0,
        priority: 'critical',
        owner: 'SRE Team',
        subtasks: [
          { name: 'Prometheus setup', status: 'pending', completion: 0 },
          { name: 'Grafana dashboards', status: 'pending', completion: 0 },
          { name: 'Alert rules (CPU, memory, errors)', status: 'pending', completion: 0 },
          { name: 'On-call rotation setup', status: 'pending', completion: 0 }
        ]
      },
      {
        id: 3,
        phase: 2,
        name: 'Performance Optimization',
        category: 'Optimization',
        status: 'pending',
        progress: 0,
        estimatedDays: 18,
        actualDays: 0,
        priority: 'high',
        owner: 'Backend Team',
        subtasks: [
          { name: 'Database query optimization', status: 'pending', completion: 0 },
          { name: 'Redis caching layer', status: 'pending', completion: 0 },
          { name: 'Code splitting & lazy loading', status: 'pending', completion: 0 },
          { name: 'Image optimization', status: 'pending', completion: 0 }
        ]
      },
      {
        id: 4,
        phase: 1,
        name: 'Security Hardening',
        category: 'Security',
        status: 'pending',
        progress: 0,
        estimatedDays: 14,
        actualDays: 0,
        priority: 'critical',
        owner: 'Security Team',
        subtasks: [
          { name: 'OWASP vulnerability scan', status: 'pending', completion: 0 },
          { name: 'SSL/TLS hardening', status: 'pending', completion: 0 },
          { name: 'Rate limiting policies', status: 'pending', completion: 0 },
          { name: 'Security audit & fixes', status: 'pending', completion: 0 }
        ]
      },
      {
        id: 5,
        phase: 2,
        name: 'Load Testing & Scalability',
        category: 'Testing',
        status: 'pending',
        progress: 0,
        estimatedDays: 16,
        actualDays: 0,
        priority: 'high',
        owner: 'QA Team',
        subtasks: [
          { name: 'Kubernetes cluster setup', status: 'pending', completion: 0 },
          { name: 'Load balancer configuration', status: 'pending', completion: 0 },
          { name: 'Stress testing (k6)', status: 'pending', completion: 0 },
          { name: 'Auto-scaling policies', status: 'pending', completion: 0 }
        ]
      },
      {
        id: 6,
        phase: 3,
        name: 'Documentation & Training',
        category: 'Documentation',
        status: 'pending',
        progress: 0,
        estimatedDays: 10,
        actualDays: 0,
        priority: 'medium',
        owner: 'Tech Lead',
        subtasks: [
          { name: 'Architecture documentation', status: 'pending', completion: 0 },
          { name: 'Deployment runbook', status: 'pending', completion: 0 },
          { name: 'Troubleshooting guide', status: 'pending', completion: 0 },
          { name: 'Team training sessions', status: 'pending', completion: 0 }
        ]
      }
    ]
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'var(--color-success)';
      case 'in_progress': return 'var(--color-warning)';
      case 'blocked': return 'var(--color-error)';
      default: return 'var(--color-border)';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return 'var(--color-error)';
      case 'high': return 'var(--color-warning)';
      default: return 'var(--color-info)';
    }
  };

  const tasksByPhase = {
    1: executionData.tasks.filter(t => t.phase === 1),
    2: executionData.tasks.filter(t => t.phase === 2),
    3: executionData.tasks.filter(t => t.phase === 3)
  };

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-xl)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
              <Zap style={{ width: '24px', height: '24px', color: 'var(--color-white)' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                🚀 Sprint 39 Execution Tracker
              </h1>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: '0.5rem 0 0 0' }}>
                Real-time execution monitoring • Status: {executionData.status}
              </p>
            </div>
          </div>

          {/* PROGRESS GAUGE */}
          <Card variant="elevated">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2xl)' }}>
              <div>
                <div style={{
                  fontSize: 'var(--font-size-4xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-primary)',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  {executionData.overallProgress}%
                </div>
                <div style={{
                  height: '8px',
                  backgroundColor: 'var(--color-border)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    backgroundColor: 'var(--color-primary)',
                    width: `${executionData.overallProgress}%`,
                    transition: 'width 500ms ease'
                  }} />
                </div>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: '0.5rem 0 0 0' }}>
                  Overall Completion
                </p>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'var(--spacing-md)',
                alignContent: 'start'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-body)', margin: 0 }}>
                    0/6
                  </p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: '0.5rem 0 0 0', textTransform: 'uppercase' }}>
                    Completed
                  </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)', margin: 0 }}>
                    6
                  </p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: '0.5rem 0 0 0', textTransform: 'uppercase' }}>
                    Pending
                  </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info)', margin: 0 }}>
                    85d
                  </p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: '0.5rem 0 0 0', textTransform: 'uppercase' }}>
                    Effort
                  </p>
                </div>
              </div>
            </div>
          </Card>
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
          {['overview', 'phase1', 'phase2', 'phase3'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                backgroundColor: activeTab === tab ? 'var(--color-primary)' : 'transparent',
                color: activeTab === tab ? 'var(--color-white)' : 'var(--color-body)',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontWeight: 'var(--font-weight-semibold)',
                transition: 'all 200ms ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab === 'overview' && '📊 Overview'}
              {tab === 'phase1' && '🔧 Phase 1: Core'}
              {tab === 'phase2' && '⚡ Phase 2: Optimization'}
              {tab === 'phase3' && '📚 Phase 3: Docs'}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
            {/* Timeline */}
            <Card variant="default">
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
                📅 Timeline
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                    Start
                  </p>
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                    {new Date(executionData.startDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                    End
                  </p>
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                    {new Date(executionData.endDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                    Duration
                  </p>
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                    21 days
                  </p>
                </div>
              </div>
            </Card>

            {/* Key Metrics */}
            <Card variant="default">
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
                📈 Key Metrics
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                    Effort
                  </p>
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                    85 person-days
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                    Critical Tasks
                  </p>
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-error)', margin: 0 }}>
                    4 tasks
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                    High Priority
                  </p>
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)', margin: 0 }}>
                    2 tasks
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Phase Views */}
        {['phase1', 'phase2', 'phase3'].includes(activeTab) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {tasksByPhase[activeTab === 'phase1' ? 1 : activeTab === 'phase2' ? 2 : 3].map((task) => (
              <Card 
                key={task.id} 
                variant="elevated"
                style={{
                  borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                  cursor: 'pointer',
                  transition: 'all 200ms ease'
                }}
                onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                      {task.name}
                    </h4>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                      {task.category} • Owner: {task.owner}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'center' }}>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: 'rgba(126, 87, 255, 0.1)',
                      color: 'var(--color-primary)',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 'var(--font-weight-bold)',
                      borderRadius: '4px'
                    }}>
                      {task.estimatedDays}d
                    </span>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      color: 'var(--color-warning)',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 'var(--font-weight-bold)',
                      borderRadius: '4px'
                    }}>
                      Pending
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{
                    height: '6px',
                    backgroundColor: 'var(--color-border)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      backgroundColor: 'var(--color-primary)',
                      width: `${task.progress}%`,
                      transition: 'width 300ms ease'
                    }} />
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: '0.5rem 0 0 0' }}>
                    {task.progress}% complete
                  </p>
                </div>

                {/* Subtasks - Expanded */}
                {expandedTask === task.id && (
                  <div style={{
                    padding: 'var(--spacing-lg)',
                    backgroundColor: 'var(--color-light)',
                    borderRadius: 'var(--border-radius-md)',
                    marginTop: 'var(--spacing-lg)'
                  }}>
                    <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-md)' }}>
                      Subtasks
                    </p>
                    {task.subtasks.map((subtask, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-md)',
                        padding: 'var(--spacing-sm) 0',
                        borderBottom: idx < task.subtasks.length - 1 ? '1px solid var(--color-border)' : 'none'
                      }}>
                        <Clock style={{ width: '16px', height: '16px', color: 'var(--color-warning)' }} />
                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-heading)', flex: 1 }}>
                          {subtask.name}
                        </span>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', backgroundColor: 'var(--color-white)', padding: '2px 8px', borderRadius: '3px' }}>
                          {subtask.completion}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}