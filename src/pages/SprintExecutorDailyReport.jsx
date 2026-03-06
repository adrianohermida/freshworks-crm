import React, { useState } from 'react';
import Card from '@/components/aetherlab/Card';

export default function SprintExecutorDailyReport() {
  const [expandedSection, setExpandedSection] = useState('summary');

  const dailyMetrics = {
    date: '2026-03-04',
    dayNumber: 1,
    totalDays: 21,
    overallCompletion: 28,
    previousDay: 0,
    velocity: 28
  };

  const sections = [
    {
      id: 'summary',
      title: '📊 Daily Summary',
      icon: '📋'
    },
    {
      id: 'completed',
      title: '✅ What Was Completed',
      icon: '🎉'
    },
    {
      id: 'pending',
      title: '⏳ What Still Needs To Be Done',
      icon: '🔴'
    },
    {
      id: 'risks',
      title: '⚠️ Risks & Blockers',
      icon: '🚨'
    },
    {
      id: 'tomorrow',
      title: '🎯 Tomorrow\'s Actions',
      icon: '▶️'
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-xl)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{
          padding: 'var(--spacing-2xl)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: 'var(--spacing-2xl)',
          border: '2px solid var(--color-primary)'
        }}>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-md)' }}>
            📅 SPRINT EXECUTOR - DAILY REPORT
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
            Day {dailyMetrics.dayNumber} of {dailyMetrics.totalDays} | Pre-Launch Phase | {dailyMetrics.date}
          </p>

          {/* KEY METRICS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--spacing-lg)' }}>
            <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-light)', borderRadius: 'var(--border-radius-md)', textAlign: 'center' }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: '8px' }}>Completion</p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info)', margin: 0 }}>28%</p>
            </div>
            <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-light)', borderRadius: 'var(--border-radius-md)', textAlign: 'center' }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: '8px' }}>Daily Velocity</p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)', margin: 0 }}>+0%</p>
            </div>
            <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-light)', borderRadius: 'var(--border-radius-md)', textAlign: 'center' }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: '8px' }}>Actions Started</p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-error)', margin: 0 }}>0/3</p>
            </div>
            <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-light)', borderRadius: 'var(--border-radius-md)', textAlign: 'center' }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: '8px' }}>Days Left</p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-error)', margin: 0 }}>20</p>
            </div>
          </div>
        </div>

        {/* TABBED SECTIONS */}
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xl)', overflowX: 'auto' }}>
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setExpandedSection(section.id)}
              style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                backgroundColor: expandedSection === section.id ? 'var(--color-primary)' : 'var(--color-surface)',
                color: expandedSection === section.id ? 'var(--color-white)' : 'var(--color-body)',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontWeight: 'var(--font-weight-semibold)',
                transition: 'all 200ms',
                whiteSpace: 'nowrap',
                fontSize: 'var(--font-size-sm)'
              }}
            >
              {section.icon} {section.title}
            </button>
          ))}
        </div>

        {/* SUMMARY */}
        {expandedSection === 'summary' && (
          <Card variant="elevated">
            <h2 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
              📊 Day 1 Summary
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
              <div>
                <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-md)' }}>
                  ✅ Executor Role: Complete
                </p>
                <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', fontSize: 'var(--font-size-xs)', color: 'var(--color-body)' }}>
                  <li>Sprint 38 reviewed (82%)</li>
                  <li>8 dashboards created</li>
                  <li>6 critical actions identified</li>
                  <li>21-day plan documented</li>
                  <li>Team briefed on roadmap</li>
                </ul>
              </div>

              <div>
                <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-md)' }}>
                  ⏳ Execution: In Progress
                </p>
                <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', fontSize: 'var(--font-size-xs)', color: 'var(--color-body)' }}>
                  <li>0/3 critical actions started</li>
                  <li>Root cause: Resource decision pending</li>
                  <li>Velocity: 0% (awaiting PM signal)</li>
                  <li>Risk level: 🔴 HIGH</li>
                  <li>Status: BLOCKED - NEEDS ESCALATION</li>
                </ul>
              </div>
            </div>

            <div style={{
              padding: 'var(--spacing-lg)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderLeft: '4px solid var(--color-error)',
              borderRadius: 'var(--border-radius-md)'
            }}>
              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-error)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                🚨 Critical Blocker
              </p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, lineHeight: '1.6' }}>
                PM resource allocation meeting NOT scheduled yet. This blocks 5 other teams from starting. Recommend escalation to director/VP level for immediate decision.
              </p>
            </div>
          </Card>
        )}

        {/* COMPLETED */}
        {expandedSection === 'completed' && (
          <Card variant="elevated">
            <h2 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
              ✅ What Was Completed (100% of Planning Phase)
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderLeft: '3px solid var(--color-success)', borderRadius: 'var(--border-radius-md)' }}>
                <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: '8px' }}>
                  🎯 Dashboards Created (8)
                </p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
                  SprintExecutionSummary, AetherLabDesignAudit, Sprint39ExecutionLive, SprintExecutorCommandCenter, SprintExecutorFinalStatus, PreLaunchExecutionControl, SprintExecutorLiveStatus, SprintExecutorConsolidatedReport
                </p>
              </div>

              <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderLeft: '3px solid var(--color-success)', borderRadius: 'var(--border-radius-md)' }}>
                <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: '8px' }}>
                  📊 Analysis & Planning
                </p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
                  Sprint 38 validation (82%), Design audit (16 items), Critical path mapping (5 blockers), Risk assessment, Lessons learned, Team communication plan
                </p>
              </div>

              <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderLeft: '3px solid var(--color-success)', borderRadius: 'var(--border-radius-md)' }}>
                <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: '8px' }}>
                  🗺️ Roadmap & Timeline
                </p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
                  Sprint 39 full roadmap (3 phases, 85d effort), Pre-launch checklist (4 phases), 21-day execution plan, Resource requirements documented
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* PENDING */}
        {expandedSection === 'pending' && (
          <Card variant="elevated">
            <h2 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
              ⏳ What Still Needs To Be Done (20 Actions)
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid var(--color-error)', borderRadius: 'var(--border-radius-md)' }}>
                <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-error)', margin: 0, marginBottom: '8px' }}>
                  🔴 CRITICAL - MUST START TODAY (0/3 started)
                </p>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)' }}>
                  <p style={{ margin: 0, marginBottom: '4px' }}>• SRE: Prometheus/Grafana setup (18d effort, deadline 2026-03-22)</p>
                  <p style={{ margin: 0, marginBottom: '4px' }}>• DevOps: Staging environment (16d effort, deadline 2026-03-20)</p>
                  <p style={{ margin: 0 }}>• PM: Resource allocation meeting (2d effort, deadline 2026-03-20)</p>
                </div>
              </div>

              <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderLeft: '3px solid var(--color-warning)', borderRadius: 'var(--border-radius-md)' }}>
                <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: '8px' }}>
                  🟠 HIGH PRIORITY - Next 7 days (4 tasks @ 20% avg)
                </p>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)' }}>
                  <p style={{ margin: 0, marginBottom: '4px' }}>• Sprint 37 Features: 40%→100% (3d effort)</p>
                  <p style={{ margin: 0, marginBottom: '4px' }}>• Analytics Dashboard: 80%→100% (2d effort)</p>
                  <p style={{ margin: 0, marginBottom: '4px' }}>• Monitoring Setup: 80%→100% (3d effort)</p>
                  <p style={{ margin: 0 }}>• Design Refactoring Phase 1: 0%→30% (4d effort)</p>
                </div>
              </div>

              <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderLeft: '3px solid var(--color-info)', borderRadius: 'var(--border-radius-md)' }}>
                <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: '8px' }}>
                  🔵 PRE-LAUNCH VALIDATION (2026-03-21 to 2026-03-24)
                </p>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)' }}>
                  <p style={{ margin: 0, marginBottom: '4px' }}>• Final monitoring validation (1d)</p>
                  <p style={{ margin: 0, marginBottom: '4px' }}>• Team readiness assessment (1d)</p>
                  <p style={{ margin: 0 }}>• Sprint 39 kickoff execution (0.5d)</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* RISKS */}
        {expandedSection === 'risks' && (
          <Card variant="elevated">
            <h2 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
              ⚠️ Risks & Blockers
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {[
                { level: 'CRITICAL', name: 'Resource Allocation Not Started', impact: 'BLOCKS ALL', mitigation: 'Escalate to VP today' },
                { level: 'HIGH', name: 'SRE/DevOps Capacity Unknown', impact: 'May delay infrastructure', mitigation: 'PM confirm availability in meeting' },
                { level: 'HIGH', name: 'Monitoring Complexity Risk', impact: 'Prometheus setup overly complex', mitigation: 'Pre-deploy templates, hire consultant' },
                { level: 'MEDIUM', name: 'Design Refactoring Scope Creep', impact: 'May exceed 15d estimate', mitigation: 'Enforce scope discipline in Phase 1' },
                { level: 'MEDIUM', name: 'Sprint 37 Carryover', impact: 'Blocks analytics completion', mitigation: 'Prioritize this week' }
              ].map((risk, i) => (
                <div key={i} style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: risk.level === 'CRITICAL' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  borderLeft: `3px solid ${risk.level === 'CRITICAL' ? 'var(--color-error)' : 'var(--color-warning)'}`,
                  borderRadius: 'var(--border-radius-md)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                      {risk.name}
                    </p>
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: risk.level === 'CRITICAL' ? 'var(--color-error)' : 'var(--color-warning)',
                      color: 'var(--color-white)',
                      borderRadius: '12px',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 'var(--font-weight-bold)'
                    }}>
                      {risk.level}
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: '4px' }}>
                    Impact: {risk.impact}
                  </p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
                    Mitigation: {risk.mitigation}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* TOMORROW */}
        {expandedSection === 'tomorrow' && (
          <Card variant="elevated">
            <h2 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
              🎯 Tomorrow's Actions (2026-03-05)
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div style={{ padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-light)', borderRadius: 'var(--border-radius-md)' }}>
                <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-md)' }}>
                  ▶️ EXECUTOR PRIORITY LIST
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', borderLeft: '3px solid var(--color-error)' }}>
                    <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: '4px' }}>
                      1. Confirm Resource Allocation Meeting Scheduled
                    </p>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
                      Check with PM: Is meeting scheduled for 2026-03-05 or 2026-03-06?
                    </p>
                  </div>

                  <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', borderLeft: '3px solid var(--color-error)' }}>
                    <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: '4px' }}>
                      2. Escalate Blocker to Leadership
                    </p>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
                      Send email to director/VP: "Resource decision required by EOD 2026-03-05 to stay on critical path"
                    </p>
                  </div>

                  <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', borderLeft: '3px solid var(--color-warning)' }}>
                    <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: '4px' }}>
                      3. Monitor Status of 0/3 Actions
                    </p>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
                      Target: 1/3 should start tomorrow (SRE or DevOps with parallel start option)
                    </p>
                  </div>

                  <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', borderLeft: '3px solid var(--color-warning)' }}>
                    <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: '4px' }}>
                      4. Report New Completion %
                    </p>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
                      Expected: 28-32% (depending on action starts)
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ padding: 'var(--spacing-lg)', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--border-radius-md)', borderLeft: '3px solid var(--color-info)' }}>
                <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                  📊 Target for Tomorrow
                </p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
                  Completion: 28% → 32% (+4%) | Actions Started: 0/3 → 1/3 | Risk Level: CRITICAL → HIGH
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* FOOTER */}
        <div style={{
          marginTop: 'var(--spacing-2xl)',
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--border-radius-lg)',
          textAlign: 'center',
          border: '1px solid var(--color-border)'
        }}>
          <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
            EXECUTOR STATUS: ACTIVE & MONITORING
          </p>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
            Next daily check-in: 2026-03-05 | 09:00 BRT
          </p>
        </div>
      </div>
    </div>
  );
}