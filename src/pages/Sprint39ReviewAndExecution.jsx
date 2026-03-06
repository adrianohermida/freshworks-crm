import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, TrendingUp, Clock, Target, Zap } from 'lucide-react';
import Card from '@/components/aetherlab/Card';

export default function Sprint39ReviewAndExecution() {
  const [activeView, setActiveView] = useState('review');

  const sprintReview = {
    sprintNumber: 39,
    status: 'EXECUTION',
    completionPercentage: 0,
    startDate: '2026-03-25',
    currentDate: '2026-03-04',
    endDate: '2026-04-15',
    durationDays: 21,
    plannedTasks: 6,
    completedTasks: 0,
    inProgressTasks: 0,
    blockedTasks: 0,
    pendingTasks: 6,
    objectivesMet: 0,
    totalObjectives: 6,
    effortDays: 85,
    velocity: '0d/session'
  };

  const taskBreakdown = [
    {
      id: 1,
      name: 'Production Deployment Automation',
      category: 'Deployment',
      status: 'pending',
      progress: 0,
      estimatedDays: 12,
      priority: 'critical',
      dependencies: 'Sprint 38 completion',
      risks: ['GitHub Actions complexity', 'Database migration risks'],
      readyToStart: true
    },
    {
      id: 2,
      name: 'Monitoring & Alerting System',
      category: 'Infrastructure',
      status: 'pending',
      progress: 0,
      estimatedDays: 15,
      priority: 'critical',
      dependencies: 'Sprint 38 completion',
      risks: ['Prometheus setup complexity', 'Alert threshold tuning'],
      readyToStart: true
    },
    {
      id: 3,
      name: 'Performance Optimization',
      category: 'Optimization',
      status: 'pending',
      progress: 0,
      estimatedDays: 18,
      priority: 'high',
      dependencies: 'Sprint 38 Analytics',
      risks: ['Database indexing impact', 'Cache invalidation'],
      readyToStart: true
    },
    {
      id: 4,
      name: 'Security Hardening',
      category: 'Security',
      status: 'pending',
      progress: 0,
      estimatedDays: 14,
      priority: 'critical',
      dependencies: 'Sprint 38 QA',
      risks: ['Vulnerability discovery', 'Compliance requirements'],
      readyToStart: true
    },
    {
      id: 5,
      name: 'Load Testing & Scalability',
      category: 'Testing',
      status: 'pending',
      progress: 0,
      estimatedDays: 16,
      priority: 'high',
      dependencies: 'Monitoring setup',
      risks: ['K8s cluster issues', 'Load generation limitations'],
      readyToStart: false
    },
    {
      id: 6,
      name: 'Documentation & Training',
      category: 'Documentation',
      status: 'pending',
      progress: 0,
      estimatedDays: 10,
      priority: 'medium',
      dependencies: 'All technical work',
      risks: ['Time constraints', 'Team availability'],
      readyToStart: false
    }
  ];

  const actionItems = [
    {
      id: 1,
      action: 'START Phase 1 Critical Tasks (3 parallel)',
      owner: 'DevOps Lead',
      deadline: '2026-03-25',
      status: 'pending',
      effort: '41 days',
      tasks: ['Deployment Automation', 'Monitoring Setup', 'Security Hardening']
    },
    {
      id: 2,
      action: 'Allocate Team Resources',
      owner: 'Project Manager',
      deadline: '2026-03-24',
      status: 'pending',
      effort: '1 day',
      tasks: ['Team assignments', 'Capacity planning', 'Risk mitigation']
    },
    {
      id: 3,
      action: 'Infrastructure Pre-setup',
      owner: 'SRE Team',
      deadline: '2026-03-23',
      status: 'pending',
      effort: '3 days',
      tasks: ['Staging environment', 'Monitoring tools', 'Load testing tools']
    },
    {
      id: 4,
      action: 'Start Phase 2 when Phase 1 50% done',
      owner: 'Tech Lead',
      deadline: '2026-04-01',
      status: 'scheduled',
      effort: '34 days',
      tasks: ['Performance Optimization', 'Load Testing']
    }
  ];

  const sprintGoals = [
    'Deploy production-ready application with zero downtime',
    'Implement comprehensive monitoring & alerting',
    'Achieve 99.95% uptime SLA target',
    'Support 10K+ concurrent users with &lt; 200ms response time',
    'Complete security audit with 95%+ OWASP compliance',
    'Enable team self-service deployment capabilities'
  ];

  const risks = [
    { category: 'Technical', items: ['Database migration complexity', 'K8s cluster stability', 'Performance bottlenecks'] },
    { category: 'Resource', items: ['Team capacity during holidays', 'Third-party service availability', 'Tool licensing'] },
    { category: 'Schedule', items: ['Unforeseen blockers', 'Dependency delays', 'Testing bottlenecks'] }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return 'var(--color-error)';
      case 'high': return 'var(--color-warning)';
      default: return 'var(--color-info)';
    }
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
              <Target style={{ width: '24px', height: '24px', color: 'var(--color-white)' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                Sprint 39 Review & Execution Plan
              </h1>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: '0.5rem 0 0 0' }}>
                Deployment, Monitoring & Performance • Status: EXECUTION READY
              </p>
            </div>
          </div>

          {/* KEY METRICS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-2xl)'
          }}>
            <Card variant="default" style={{ borderLeft: '4px solid var(--color-primary)' }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                Completion
              </p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', margin: 0 }}>
                {sprintReview.completionPercentage}%
              </p>
            </Card>

            <Card variant="default" style={{ borderLeft: '4px solid var(--color-success)' }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                Completed
              </p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)', margin: 0 }}>
                {sprintReview.completedTasks}/{sprintReview.plannedTasks}
              </p>
            </Card>

            <Card variant="default" style={{ borderLeft: '4px solid var(--color-warning)' }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                Pending
              </p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)', margin: 0 }}>
                {sprintReview.pendingTasks}
              </p>
            </Card>

            <Card variant="default" style={{ borderLeft: '4px solid var(--color-info)' }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                Effort
              </p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info)', margin: 0 }}>
                {sprintReview.effortDays}d
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
          {['review', 'tasks', 'actions', 'risks'].map(view => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                backgroundColor: activeView === view ? 'var(--color-primary)' : 'transparent',
                color: activeView === view ? 'var(--color-white)' : 'var(--color-body)',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontWeight: 'var(--font-weight-semibold)',
                transition: 'all 200ms ease',
                whiteSpace: 'nowrap'
              }}
            >
              {view === 'review' && '📊 Review'}
              {view === 'tasks' && '✅ Tasks'}
              {view === 'actions' && '🎯 Actions'}
              {view === 'risks' && '⚠️ Risks'}
            </button>
          ))}
        </div>

        {/* REVIEW VIEW */}
        {activeView === 'review' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
            {/* Goals */}
            <Card variant="elevated">
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
                🎯 Sprint Goals
              </h3>
              <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', color: 'var(--color-body)', fontSize: 'var(--font-size-sm)' }}>
                {sprintGoals.map((goal, idx) => (
                  <li key={idx} style={{ marginBottom: 'var(--spacing-md)' }}>{goal}</li>
                ))}
              </ul>
            </Card>

            {/* Status Summary */}
            <Card variant="elevated">
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
                📋 Status Summary
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                    Sprint Duration
                  </p>
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                    {sprintReview.durationDays} days (Mar 25 - Apr 15)
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                    Planned Tasks
                  </p>
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                    {sprintReview.plannedTasks} critical objectives
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                    Total Effort
                  </p>
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                    {sprintReview.effortDays} person-days
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                    Critical Priority
                  </p>
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-error)', margin: 0 }}>
                    4 tasks (Deployment, Monitoring, Security)
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TASKS VIEW */}
        {activeView === 'tasks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {taskBreakdown.map((task) => (
              <Card key={task.id} variant="elevated" style={{ borderLeft: `4px solid ${getPriorityColor(task.priority)}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                      {task.name}
                    </h4>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                      {task.category} • Depends on: {task.dependencies}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
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
                      backgroundColor: task.readyToStart ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: task.readyToStart ? 'var(--color-success)' : 'var(--color-warning)',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 'var(--font-weight-bold)',
                      borderRadius: '4px'
                    }}>
                      {task.readyToStart ? 'Ready to Start' : 'Blocked'}
                    </span>
                  </div>
                </div>

                {task.risks.length > 0 && (
                  <div style={{
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'var(--color-light)',
                    borderRadius: 'var(--border-radius-md)',
                    marginTop: 'var(--spacing-lg)'
                  }}>
                    <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                      ⚠️ Key Risks
                    </p>
                    <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--color-body)' }}>
                      {task.risks.map((risk, idx) => (
                        <li key={idx}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* ACTIONS VIEW */}
        {activeView === 'actions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {actionItems.map((action) => (
              <Card key={action.id} variant="elevated">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                      {action.action}
                    </h4>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                      Owner: {action.owner} • Deadline: {new Date(action.deadline).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    backgroundColor: action.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                    color: action.status === 'pending' ? 'var(--color-warning)' : 'var(--color-info)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-bold)',
                    borderRadius: '4px'
                  }}>
                    {action.status === 'pending' ? 'Action Required' : 'Scheduled'}
                  </span>
                </div>

                <div style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--color-light)',
                  borderRadius: 'var(--border-radius-md)'
                }}>
                  <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                    📋 Tasks ({action.tasks.length})
                  </p>
                  <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--color-body)' }}>
                    {action.tasks.map((task, idx) => (
                      <li key={idx}>{task}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* RISKS VIEW */}
        {activeView === 'risks' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {risks.map((riskCategory, idx) => (
              <Card key={idx} variant="elevated" style={{ borderLeft: '4px solid var(--color-warning)' }}>
                <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
                  {riskCategory.category} Risks
                </h3>
                <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--color-body)' }}>
                  {riskCategory.items.map((item, i) => (
                    <li key={i} style={{ marginBottom: 'var(--spacing-md)' }}>{item}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        )}

        {/* ACTION SUMMARY */}
        <div style={{ marginTop: 'var(--spacing-2xl)', padding: 'var(--spacing-xl)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-md)', border: '2px solid var(--color-primary)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
            ✅ Execution Readiness Checklist
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
              <CheckCircle2 style={{ width: '20px', height: '20px', color: 'var(--color-success)', flexShrink: 0 }} />
              <span style={{ color: 'var(--color-heading)', fontSize: 'var(--font-size-sm)' }}>
                Sprint 38 completed with 82% success
              </span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
              <CheckCircle2 style={{ width: '20px', height: '20px', color: 'var(--color-success)', flexShrink: 0 }} />
              <span style={{ color: 'var(--color-heading)', fontSize: 'var(--font-size-sm)' }}>
                Team resources allocated
              </span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
              <CheckCircle2 style={{ width: '20px', height: '20px', color: 'var(--color-success)', flexShrink: 0 }} />
              <span style={{ color: 'var(--color-heading)', fontSize: 'var(--font-size-sm)' }}>
                Staging environment ready
              </span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
              <CheckCircle2 style={{ width: '20px', height: '20px', color: 'var(--color-success)', flexShrink: 0 }} />
              <span style={{ color: 'var(--color-heading)', fontSize: 'var(--font-size-sm)' }}>
                Tools & monitoring configured
              </span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
              <CheckCircle2 style={{ width: '20px', height: '20px', color: 'var(--color-success)', flexShrink: 0 }} />
              <span style={{ color: 'var(--color-heading)', fontSize: 'var(--font-size-sm)' }}>
                Risk mitigation plans in place
              </span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
              <CheckCircle2 style={{ width: '20px', height: '20px', color: 'var(--color-success)', flexShrink: 0 }} />
              <span style={{ color: 'var(--color-heading)', fontSize: 'var(--font-size-sm)' }}>
                Communication plan defined
              </span>
            </div>
          </div>
          <p style={{ marginTop: 'var(--spacing-lg)', marginBottom: 0, fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)' }}>
            🚀 READY TO LAUNCH SPRINT 39 - March 25, 2026
          </p>
        </div>
      </div>
    </div>
  );
}