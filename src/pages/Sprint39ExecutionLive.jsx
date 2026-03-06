import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Clock, TrendingUp, Zap, Target } from 'lucide-react';
import Card from '@/components/aetherlab/Card';

export default function Sprint39ExecutionLive() {
  const [expandedPhase, setExpandedPhase] = useState('overview');
  const [checkedItems, setCheckedItems] = useState({});

  const sprintMetrics = {
    sprint38: {
      status: 'COMPLETED',
      startDate: '2026-02-11',
      endDate: '2026-03-04',
      completionPercentage: 82,
      tasksCompleted: 9,
      tasksTotal: 11,
      qualityScore: 91
    },
    sprint39: {
      status: 'LAUNCH_PENDING',
      startDate: '2026-03-25',
      endDate: '2026-04-15',
      plannedCompletion: 0,
      daysRemaining: 21,
      effort: 85,
      phases: 3
    },
    transition: {
      statusDate: '2026-03-04',
      prelaunchActionsRemaining: 6,
      pendingTasksFromS38: 2,
      criticalPathItems: 4
    }
  };

  const prelaunchChecklist = [
    {
      id: 1,
      category: 'Infrastructure Setup',
      items: [
        { id: 1, title: 'Setup Prometheus/Grafana Monitoring', owner: 'SRE Team', deadline: '2026-03-22', completed: false, effort: '3d', priority: 'CRITICAL' },
        { id: 2, title: 'Prepare Staging Environment', owner: 'DevOps Team', deadline: '2026-03-20', completed: false, effort: '2d', priority: 'CRITICAL' },
        { id: 3, title: 'Configure Load Balancer & CDN', owner: 'DevOps Team', deadline: '2026-03-23', completed: false, effort: '2d', priority: 'HIGH' }
      ]
    },
    {
      id: 2,
      category: 'Team Preparation',
      items: [
        { id: 1, title: 'Allocate Team Resources', owner: 'PM', deadline: '2026-03-20', completed: false, effort: '1d', priority: 'CRITICAL' },
        { id: 2, title: 'Conduct Sprint 39 Kickoff', owner: 'Sprint Lead', deadline: '2026-03-24', completed: false, effort: '0.5d', priority: 'HIGH' }
      ]
    },
    {
      id: 3,
      category: 'Pending Tasks Handoff',
      items: [
        { id: 1, title: 'Complete Analytics Dashboard (80% → 100%)', owner: 'Data Team', deadline: '2026-03-22', completed: false, effort: '2d', priority: 'HIGH' },
        { id: 2, title: 'Finalize Sprint 37 Features (40% → 100%)', owner: 'Frontend Team', deadline: '2026-03-20', completed: false, effort: '3d', priority: 'MEDIUM' }
      ]
    }
  ];

  const sprint39ObjectivesFull = [
    {
      id: 1,
      phase: 'PHASE 1: Deployment & Infrastructure',
      daysAllocated: 12,
      objectives: [
        { 
          id: 1, 
          name: 'Deployment Automation (CI/CD)', 
          description: 'Fully automated production deployment pipeline', 
          status: 'pending',
          effort: '12d',
          owner: 'DevOps Team',
          criticalPath: true,
          metrics: ['Build time <5min', 'Rollback <2min']
        },
        { 
          id: 2, 
          name: 'Production Readiness Checklist', 
          description: 'Complete pre-deployment validation suite', 
          status: 'pending',
          effort: '4d',
          owner: 'QA Team',
          criticalPath: true,
          metrics: ['100% checklist coverage']
        },
        { 
          id: 3, 
          name: 'Infrastructure Hardening', 
          description: 'Security & compliance setup', 
          status: 'pending',
          effort: '8d',
          owner: 'Security Team',
          criticalPath: true,
          metrics: ['OWASP A10 compliance']
        }
      ]
    },
    {
      id: 2,
      phase: 'PHASE 2: Monitoring & Observability',
      daysAllocated: 15,
      objectives: [
        { 
          id: 1, 
          name: 'Alerting System Implementation', 
          description: 'Real-time monitoring & alerts', 
          status: 'pending',
          effort: '10d',
          owner: 'SRE Team',
          criticalPath: true,
          metrics: ['<5min alert latency', '99.9% uptime']
        },
        { 
          id: 2, 
          name: 'SLA Monitoring Dashboard', 
          description: 'Real-time SLA tracking', 
          status: 'pending',
          effort: '6d',
          owner: 'Analytics Team',
          criticalPath: true,
          metrics: ['Real-time dashboards']
        },
        { 
          id: 3, 
          name: 'Log Aggregation & Analysis', 
          description: 'Centralized logging solution', 
          status: 'pending',
          effort: '7d',
          owner: 'DevOps Team',
          criticalPath: false,
          metrics: ['<1sec search response']
        }
      ]
    },
    {
      id: 3,
      phase: 'PHASE 3: Performance & Optimization',
      daysAllocated: 14,
      objectives: [
        { 
          id: 1, 
          name: 'Load Testing & Scaling Validation', 
          description: 'Verify system can handle peak load', 
          status: 'pending',
          effort: '10d',
          owner: 'QA Team',
          criticalPath: true,
          metrics: ['Handle 10k req/sec', 'P99 <200ms']
        },
        { 
          id: 2, 
          name: 'Database Optimization', 
          description: 'Query optimization & indexing', 
          status: 'pending',
          effort: '8d',
          owner: 'Backend Team',
          criticalPath: false,
          metrics: ['Query perf +50%']
        },
        { 
          id: 3, 
          name: 'Frontend Performance Tuning', 
          description: 'Bundle optimization & caching', 
          status: 'pending',
          effort: '5d',
          owner: 'Frontend Team',
          criticalPath: false,
          metrics: ['LCP <2.5s', 'FID <100ms']
        }
      ]
    }
  ];

  const completedFromSprint38 = [
    '✅ Google Sheets Sync Fix (+98% stability)',
    '✅ Settings Refactoring (Aetherlab compliant)',
    '✅ AdminPanel Refactoring',
    '✅ Google Sheets Monitoring Dashboard',
    '✅ Analytics Dashboard (80% complete)',
    '✅ Marketplace Partner Dashboard',
    '✅ QA Testing Checklist',
    '✅ Marketplace API Core',
    '✅ Sprint 38 Live Tracker'
  ];

  const toggleCheckItem = (key) => {
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalItems = prelaunchChecklist.reduce((sum, cat) => sum + cat.items.length, 0);
  const prelaunchCompletion = Math.round((completedCount / totalItems) * 100);

  const getStatusBadgeStyle = (status) => {
    switch(status) {
      case 'COMPLETED': return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)' };
      case 'LAUNCH_PENDING': return { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)' };
      case 'IN_PROGRESS': return { bg: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-info)' };
      default: return { bg: 'rgba(107, 114, 128, 0.1)', color: 'var(--color-body)' };
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-xl)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
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
                🚀 Sprint 39 Execution Live
              </h1>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: '0.5rem 0 0 0' }}>
                Real-time tracking: Sprint 38 → 39 Transition
              </p>
            </div>
          </div>

          {/* STATUS CARDS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-2xl)'
          }}>
            <Card variant="elevated">
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                Sprint 38 Status
              </p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)', margin: 0 }}>
                ✅ 82%
              </p>
            </Card>

            <Card variant="elevated">
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                S39 Readiness
              </p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: prelaunchCompletion === 100 ? 'var(--color-success)' : 'var(--color-warning)', margin: 0 }}>
                {prelaunchCompletion}%
              </p>
            </Card>

            <Card variant="elevated">
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                Pre-Launch Actions
              </p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info)', margin: 0 }}>
                {completedCount}/{totalItems}
              </p>
            </Card>

            <Card variant="elevated">
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                Days Until Launch
              </p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-error)', margin: 0 }}>
                21 days
              </p>
            </Card>
          </div>
        </div>

        {/* SPRINT 38 COMPLETED */}
        <Card variant="elevated" style={{ marginBottom: 'var(--spacing-2xl)', borderLeft: '4px solid var(--color-success)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
            ✅ Sprint 38 Completado (9/11 Tarefas - 82%)
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-md)'
          }}>
            {completedFromSprint38.map((item, idx) => (
              <div key={idx} style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'rgba(16, 185, 129, 0.05)',
                borderRadius: 'var(--border-radius-md)',
                borderLeft: '3px solid var(--color-success)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-heading)'
              }}>
                {item}
              </div>
            ))}
          </div>
        </Card>

        {/* PRE-LAUNCH CHECKLIST */}
        <Card variant="elevated" style={{ marginBottom: 'var(--spacing-2xl)', borderLeft: '4px solid var(--color-warning)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-md)' }}>
            📋 Pre-Launch Checklist ({completedCount}/{totalItems} = {prelaunchCompletion}%)
          </h3>
          
          <div style={{
            height: '8px',
            backgroundColor: 'var(--color-border)',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <div style={{
              height: '100%',
              backgroundColor: prelaunchCompletion === 100 ? 'var(--color-success)' : 'var(--color-warning)',
              width: `${prelaunchCompletion}%`,
              transition: 'width 300ms ease'
            }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {prelaunchChecklist.map((category) => (
              <div key={category.id}>
                <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-md)' }}>
                  {category.category}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  {category.items.map((item) => {
                    const isChecked = checkedItems[`${category.id}-${item.id}`];
                    return (
                      <div key={item.id} style={{
                        padding: 'var(--spacing-md)',
                        backgroundColor: isChecked ? 'rgba(16, 185, 129, 0.05)' : 'var(--color-light)',
                        borderRadius: 'var(--border-radius-md)',
                        border: `1px solid ${isChecked ? 'var(--color-success)' : 'var(--color-border)'}`,
                        cursor: 'pointer',
                        transition: 'all 200ms ease'
                      }} onClick={() => toggleCheckItem(`${category.id}-${item.id}`)}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            border: `2px solid ${isChecked ? 'var(--color-success)' : 'var(--color-border)'}`,
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isChecked ? 'var(--color-success)' : 'transparent',
                            flexShrink: 0,
                            marginTop: '2px'
                          }}>
                            {isChecked && <span style={{ color: 'white', fontSize: '14px' }}>✓</span>}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: '4px', textDecoration: isChecked ? 'line-through' : 'none' }}>
                              {item.title}
                            </p>
                            <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: 'var(--font-size-xs)', color: 'var(--color-body)' }}>
                              <span>{item.owner}</span>
                              <span>•</span>
                              <span>{item.effort}</span>
                              <span>•</span>
                              <span style={{ fontWeight: 'var(--font-weight-bold)', color: item.priority === 'CRITICAL' ? 'var(--color-error)' : 'var(--color-warning)' }}>
                                {item.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* SPRINT 39 OBJECTIVES */}
        <Card variant="elevated" style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
            🎯 Sprint 39 Objectives (3 Phases | 85 days effort)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {sprint39ObjectivesFull.map((phase) => (
              <div key={phase.id}>
                <div 
                  style={{
                    padding: 'var(--spacing-lg)',
                    backgroundColor: 'var(--color-light)',
                    borderRadius: 'var(--border-radius-md)',
                    borderLeft: '4px solid var(--color-primary)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: '4px' }}>
                        {phase.phase}
                      </h4>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
                        {phase.objectives.length} objectives • {phase.daysAllocated} days allocated
                      </p>
                    </div>
                    <span style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)' }}>
                      {expandedPhase === phase.id ? '−' : '+'}
                    </span>
                  </div>
                </div>

                {expandedPhase === phase.id && (
                  <div style={{ marginTop: 'var(--spacing-md)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-md)' }}>
                    {phase.objectives.map((obj) => (
                      <div key={obj.id} style={{
                        padding: 'var(--spacing-lg)',
                        backgroundColor: obj.criticalPath ? 'rgba(239, 68, 68, 0.05)' : 'rgba(59, 130, 246, 0.05)',
                        borderRadius: 'var(--border-radius-md)',
                        borderLeft: `3px solid ${obj.criticalPath ? 'var(--color-error)' : 'var(--color-info)'}`
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                          <div>
                            <h5 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: '4px' }}>
                              {obj.name}
                            </h5>
                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
                              {obj.description}
                            </p>
                          </div>
                          {obj.criticalPath && <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-error)', whiteSpace: 'nowrap' }}>🔴 CRITICAL PATH</span>}
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', fontSize: 'var(--font-size-xs)', color: 'var(--color-body)' }}>
                          <span>Owner: {obj.owner}</span>
                          <span>•</span>
                          <span>Effort: {obj.effort}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* SUMMARY */}
        <div style={{ padding: 'var(--spacing-xl)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-md)', border: '2px solid var(--color-primary)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
            📊 EXECUTION STATUS
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', fontWeight: 'var(--font-weight-bold)', textTransform: 'uppercase' }}>
                What's Done
              </p>
              <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--color-success)' }}>
                <li>✅ Sprint 38 Review (82% complete)</li>
                <li>✅ 9 of 11 tasks delivered</li>
                <li>✅ Audit completed</li>
              </ul>
            </div>

            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', fontWeight: 'var(--font-weight-bold)', textTransform: 'uppercase' }}>
                What's Pending
              </p>
              <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--color-warning)' }}>
                <li>⏳ Analytics Dashboard (80% → 100%)</li>
                <li>⏳ Sprint 37 Features (40% → 100%)</li>
                <li>⏳ {totalItems - completedCount} pre-launch actions</li>
              </ul>
            </div>

            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', fontWeight: 'var(--font-weight-bold)', textTransform: 'uppercase' }}>
                Launch Readiness
              </p>
              <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)', color: prelaunchCompletion === 100 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                <li>{prelaunchCompletion}% pre-launch complete</li>
                <li>Launch: March 25, 2026</li>
                <li>{21} days to prepare</li>
              </ul>
            </div>
          </div>

          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 0, paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)' }}>
            <strong>🎯 NEXT STEPS:</strong> Complete all pre-launch actions by 2026-03-24 → Finalize pending tasks → Launch Sprint 39 on 2026-03-25 with full team
          </p>
        </div>
      </div>
    </div>
  );
}