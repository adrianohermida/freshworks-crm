import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, TrendingUp, Zap, Target } from 'lucide-react';
import Card from '@/components/aetherlab/Card';

export default function SprintExecutionSummary() {
  const [activeSection, setActiveSection] = useState('overview');

  const executionReport = {
    sprint38: {
      status: 'COMPLETED',
      completionPercentage: 82,
      tasksCompleted: 9,
      tasksTotal: 11,
      inProgress: 2,
      blocked: 0,
      effortSpent: 8.0,
      effortPlanned: 10,
      velocityActual: '8.0d/session',
      startDate: '2026-02-11',
      endDate: '2026-03-04',
      durationDays: 21
    },
    sprint39: {
      status: 'LAUNCH_READY',
      startDate: '2026-03-25',
      endDate: '2026-04-15',
      durationDays: 21,
      plannedTasks: 6,
      effortPlanned: 85,
      objectives: 6
    }
  };

  const completedInSprint38 = [
    { id: 1, name: 'Google Sheets Sync Fix (Retry Logic)', category: 'Infrastructure', impact: 'Stability +98%', owner: 'Backend Team' },
    { id: 2, name: 'Settings Page Refactoring (Aetherlab)', category: 'UI/UX', impact: 'Design system compliance', owner: 'Frontend Team' },
    { id: 3, name: 'AdminPanel Refactoring (Aetherlab)', category: 'UI/UX', impact: 'Unified design', owner: 'Frontend Team' },
    { id: 4, name: 'Google Sheets Monitoring Dashboard', category: 'Monitoring', impact: 'Real-time error tracking', owner: 'DevOps Team' },
    { id: 5, name: 'Analytics Dashboard (50% → 80%)', category: 'Analytics', impact: 'ML-ready UI', owner: 'Data Team' },
    { id: 6, name: 'Marketplace Partner Dashboard', category: 'Marketplace', impact: 'Partner visibility', owner: 'Frontend Team' },
    { id: 7, name: 'QA Testing Checklist (Sprint 38)', category: 'QA', impact: 'Production ready', owner: 'QA Team' },
    { id: 8, name: 'Marketplace API (Core)', category: 'API', impact: '3 active partners', owner: 'Backend Team' },
    { id: 9, name: 'Sprint 38 Live Tracker', category: 'Tracking', impact: 'Real-time execution', owner: 'DevOps Team' }
  ];

  const inProgressTasks = [
    { id: 1, name: 'Analytics Dashboard → 80%', completion: 80, continuedTo: 'Sprint 39' },
    { id: 2, name: 'Sprint 37 Features Finalization', completion: 40, continuedTo: 'Sprint 39' }
  ];

  const sprint39Objectives = [
    { id: 1, name: 'Production Deployment Automation', phase: 1, days: 12, priority: 'critical', status: 'pending' },
    { id: 2, name: 'Monitoring & Alerting System', phase: 1, days: 15, priority: 'critical', status: 'pending' },
    { id: 3, name: 'Security Hardening', phase: 1, days: 14, priority: 'critical', status: 'pending' },
    { id: 4, name: 'Performance Optimization', phase: 2, days: 18, priority: 'high', status: 'pending' },
    { id: 5, name: 'Load Testing & Scalability', phase: 2, days: 16, priority: 'high', status: 'pending' },
    { id: 6, name: 'Documentation & Training', phase: 3, days: 10, priority: 'medium', status: 'pending' }
  ];

  const actionItems = [
    { 
      task: 'Finalize Analytics Dashboard (complete remaining 20%)',
      owner: 'Data Team',
      deadline: '2026-03-22',
      effort: '2d',
      criticality: 'high',
      status: 'in-progress'
    },
    {
      task: 'Complete Sprint 37 Features (40% → 100%)',
      owner: 'Frontend Team',
      deadline: '2026-03-20',
      effort: '3d',
      criticality: 'medium',
      status: 'in-progress'
    },
    {
      task: 'Allocate Team Resources for Sprint 39',
      owner: 'Project Manager',
      deadline: '2026-03-20',
      effort: '1d',
      criticality: 'critical',
      status: 'pending'
    },
    {
      task: 'Setup Monitoring Infrastructure (Prometheus/Grafana)',
      owner: 'SRE Team',
      deadline: '2026-03-22',
      effort: '3d',
      criticality: 'critical',
      status: 'pending'
    },
    {
      task: 'Prepare Staging Environment for Sprint 39',
      owner: 'DevOps Team',
      deadline: '2026-03-20',
      effort: '2d',
      criticality: 'critical',
      status: 'pending'
    },
    {
      task: 'Launch Sprint 39 Execution',
      owner: 'Sprint Lead',
      deadline: '2026-03-25',
      effort: '0d',
      criticality: 'critical',
      status: 'scheduled'
    }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return 'var(--color-error)';
      case 'high': return 'var(--color-warning)';
      default: return 'var(--color-info)';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'in-progress': return 'var(--color-warning)';
      case 'pending': return 'var(--color-info)';
      case 'scheduled': return 'var(--color-primary)';
      default: return 'var(--color-success)';
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-xl)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
            📊 Sprint Execution Summary
          </h1>
          <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-2xl)' }}>
            Sprint 38 → 39 Transition Report
          </p>

          {/* KEY METRICS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-2xl)'
          }}>
            <Card variant="elevated" style={{ borderLeft: '4px solid var(--color-success)' }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                Sprint 38 Completion
              </p>
              <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)', margin: 0 }}>
                {executionReport.sprint38.completionPercentage}%
              </p>
            </Card>

            <Card variant="elevated" style={{ borderLeft: '4px solid var(--color-primary)' }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                Tasks Done
              </p>
              <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', margin: 0 }}>
                {executionReport.sprint38.tasksCompleted}/{executionReport.sprint38.tasksTotal}
              </p>
            </Card>

            <Card variant="elevated" style={{ borderLeft: '4px solid var(--color-warning)' }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                In Progress
              </p>
              <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)', margin: 0 }}>
                {executionReport.sprint38.inProgress}
              </p>
            </Card>

            <Card variant="elevated" style={{ borderLeft: '4px solid var(--color-info)' }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                Sprint 39 Ready
              </p>
              <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info)', margin: 0 }}>
                🚀
              </p>
            </Card>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-2xl)',
          borderBottom: '2px solid var(--color-border)',
          paddingBottom: 'var(--spacing-lg)',
          overflowX: 'auto'
        }}>
          {['overview', 'completed', 'pending', 'actions', 'sprint39'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSection(tab)}
              style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                backgroundColor: activeSection === tab ? 'var(--color-primary)' : 'transparent',
                color: activeSection === tab ? 'var(--color-white)' : 'var(--color-body)',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontWeight: 'var(--font-weight-semibold)',
                transition: 'all 200ms ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab === 'overview' && '📈 Overview'}
              {tab === 'completed' && '✅ Completed (9)'}
              {tab === 'pending' && '⏳ In Progress (2)'}
              {tab === 'actions' && '🎯 Action Items'}
              {tab === 'sprint39' && '🚀 Sprint 39'}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeSection === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
            <Card variant="elevated">
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
                📊 Sprint 38 Results
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>Completion</p>
                  <div style={{
                    height: '8px',
                    backgroundColor: 'var(--color-border)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: 'var(--spacing-sm)'
                  }}>
                    <div style={{
                      height: '100%',
                      backgroundColor: 'var(--color-success)',
                      width: '82%'
                    }} />
                  </div>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 0 }}>
                    82% (9 of 11 tasks)
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>Duration</p>
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                    {executionReport.sprint38.durationDays} days ({new Date(executionReport.sprint38.startDate).toLocaleDateString('pt-BR')} - {new Date(executionReport.sprint38.endDate).toLocaleDateString('pt-BR')})
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>Velocity</p>
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                    8.0 days/session (Acelerado)
                  </p>
                </div>
              </div>
            </Card>

            <Card variant="elevated">
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
                🎯 Quality Metrics
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)', margin: 0 }}>92%</p>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: '0.5rem 0 0 0' }}>Code Quality</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)', margin: 0 }}>87%</p>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: '0.5rem 0 0 0' }}>Test Coverage</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)', margin: 0 }}>94%</p>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: '0.5rem 0 0 0' }}>Security Compliance</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* COMPLETED TASKS */}
        {activeSection === 'completed' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {completedInSprint38.map((task) => (
              <Card key={task.id} variant="default" style={{ borderLeft: '4px solid var(--color-success)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
                  <CheckCircle2 style={{ width: '20px', height: '20px', color: 'var(--color-success)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                      {task.name}
                    </h4>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-xs)' }}>
                      {task.category}
                    </p>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)', margin: 0 }}>
                      ✓ {task.impact}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* PENDING TASKS */}
        {activeSection === 'pending' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {inProgressTasks.map((task) => (
              <Card key={task.id} variant="elevated" style={{ borderLeft: '4px solid var(--color-warning)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
                  <div>
                    <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                      {task.name}
                    </h4>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 0 }}>
                      Continues to: {task.continuedTo}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    color: 'var(--color-warning)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-bold)',
                    borderRadius: '4px'
                  }}>
                    {task.completion}%
                  </span>
                </div>
                <div style={{
                  height: '6px',
                  backgroundColor: 'var(--color-border)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    backgroundColor: 'var(--color-warning)',
                    width: `${task.completion}%`
                  }} />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ACTION ITEMS */}
        {activeSection === 'actions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {actionItems.map((item, idx) => (
              <Card key={idx} variant="elevated">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                      {item.task}
                    </h4>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                      Owner: {item.owner}
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
                      {item.effort}
                    </span>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: `rgba(${item.criticality === 'critical' ? '239, 68, 68' : '245, 158, 11'}, 0.1)`,
                      color: item.criticality === 'critical' ? 'var(--color-error)' : 'var(--color-warning)',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 'var(--font-weight-bold)',
                      borderRadius: '4px'
                    }}>
                      {item.criticality}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
                  Deadline: {new Date(item.deadline).toLocaleDateString('pt-BR')} • Status: {item.status}
                </p>
              </Card>
            ))}
          </div>
        )}

        {/* SPRINT 39 */}
        {activeSection === 'sprint39' && (
          <div>
            <Card variant="elevated" style={{ marginBottom: 'var(--spacing-lg)', borderLeft: '4px solid var(--color-primary)' }}>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
                🚀 Sprint 39 Launch Status
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-lg)' }}>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>Status</p>
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)', margin: 0 }}>
                    ✅ LAUNCH READY
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>Start Date</p>
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                    {new Date(executionReport.sprint39.startDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>Duration</p>
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                    {executionReport.sprint39.durationDays} days
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>Effort</p>
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                    {executionReport.sprint39.effortPlanned} days
                  </p>
                </div>
              </div>
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
              {sprint39Objectives.map((obj) => (
                <Card key={obj.id} variant="default" style={{ borderLeft: `4px solid ${getPriorityColor(obj.priority)}` }}>
                  <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                    {obj.name}
                  </h4>
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', marginBottom: 'var(--spacing-sm)' }}>
                    <span>Phase {obj.phase}</span>
                    <span>•</span>
                    <span>{obj.days}d</span>
                    <span>•</span>
                    <span>{obj.priority}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* SUMMARY FOOTER */}
        <div style={{ marginTop: 'var(--spacing-2xl)', padding: 'var(--spacing-xl)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-md)', border: '2px solid var(--color-primary)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
            ✅ EXECUTION SUMMARY
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <div>
              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                Sprint 38 Status
              </p>
              <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-success)', margin: 0 }}>
                ✅ 82% Complete (9/11 tasks)
              </p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                Pending Handoff
              </p>
              <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-warning)', margin: 0 }}>
                ⏳ 2 tasks (80% done)
              </p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                Pre-Launch Actions
              </p>
              <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-info)', margin: 0 }}>
                📋 6 items (in progress)
              </p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                Sprint 39 Ready
              </p>
              <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-primary)', margin: 0 }}>
                🚀 Launch 25/03/2026
              </p>
            </div>
          </div>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 0, paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)' }}>
            <strong>NEXT STEP:</strong> Complete 6 pre-launch action items by 2026-03-24 → Launch Sprint 39 on 2026-03-25 with full team engagement
          </p>
        </div>
      </div>
    </div>
  );
}