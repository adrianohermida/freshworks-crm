import React, { useState, useEffect } from 'react';
import Card from '@/components/aetherlab/Card';

export default function SprintExecutorLiveStatus() {
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const executionSummary = {
    phase: 'PRE-LAUNCH EXECUTION',
    startDate: '2026-03-04T00:00:00',
    launchDate: '2026-03-25T00:00:00',
    currentProgress: 8,
    daysRemaining: 21
  };

  const completedWork = [
    { title: '✅ Sprint 38 Validation', completion: 95, status: 'DONE' },
    { title: '✅ Design System Audit', completion: 100, status: 'DONE' },
    { title: '✅ Sprint 39 Planning', completion: 100, status: 'DONE' },
    { title: '✅ 5 Executive Dashboards', completion: 100, status: 'DONE' },
    { title: '✅ Critical Path Analysis', completion: 100, status: 'DONE' }
  ];

  const pendingWork = [
    { 
      id: 1, 
      title: 'SRE: Prometheus/Grafana Setup', 
      completion: 0, 
      status: 'PENDING', 
      deadline: '2026-03-22', 
      effort: '3d', 
      priority: 'CRITICAL' 
    },
    { 
      id: 2, 
      title: 'DevOps: Staging Environment', 
      completion: 0, 
      status: 'PENDING', 
      deadline: '2026-03-20', 
      effort: '2d', 
      priority: 'CRITICAL' 
    },
    { 
      id: 3, 
      title: 'PM: Resource Allocation', 
      completion: 0, 
      status: 'PENDING', 
      deadline: '2026-03-20', 
      effort: '1d', 
      priority: 'CRITICAL' 
    },
    { 
      id: 4, 
      title: 'Data: Analytics Dashboard 100%', 
      completion: 20, 
      status: 'PENDING', 
      deadline: '2026-03-22', 
      effort: '2d', 
      priority: 'HIGH' 
    },
    { 
      id: 5, 
      title: 'Frontend: Sprint 37 Features 100%', 
      completion: 40, 
      status: 'PENDING', 
      deadline: '2026-03-20', 
      effort: '3d', 
      priority: 'HIGH' 
    },
    { 
      id: 6, 
      title: 'Lead: Sprint 39 Kickoff', 
      completion: 0, 
      status: 'PENDING', 
      deadline: '2026-03-24', 
      effort: '0.5d', 
      priority: 'HIGH' 
    }
  ];

  const calculateProgress = () => {
    const completed = completedWork.length;
    const inProgress = pendingWork.filter(w => w.completion > 0).length;
    const total = completed + pendingWork.length;
    return Math.round(((completed + (inProgress * 0.5)) / total) * 100);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-xl)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* MAIN HEADER */}
        <div style={{
          padding: 'var(--spacing-2xl)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: 'var(--spacing-2xl)',
          border: '3px solid var(--color-primary)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <div>
              <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: '8px' }}>
                📋 SPRINT EXECUTOR - LIVE STATUS
              </h1>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 0 }}>
                Continuous Execution & Monitoring | Real-Time Progress
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', margin: 0 }}>
                {liveTime.toLocaleTimeString('pt-BR')}
              </p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: '8px 0 0 0' }}>
                {liveTime.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* MAIN PROGRESS INDICATOR */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)' }}>
                🎯 Overall Execution Progress
              </span>
              <span style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
                {calculateProgress()}%
              </span>
            </div>
            <div style={{ height: '16px', backgroundColor: 'var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                backgroundColor: 'var(--color-primary)',
                width: `${calculateProgress()}%`,
                transition: 'width 500ms ease'
              }} />
            </div>
          </div>
        </div>

        {/* KEY METRICS ROW */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-2xl)'
        }}>
          <Card variant="elevated">
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: '8px', textTransform: 'uppercase', fontWeight: 'var(--font-weight-bold)' }}>Completed</p>
            <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)', margin: 0 }}>{completedWork.length}/5</p>
          </Card>
          <Card variant="elevated">
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: '8px', textTransform: 'uppercase', fontWeight: 'var(--font-weight-bold)' }}>Pending</p>
            <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-error)', margin: 0 }}>{pendingWork.length}/6</p>
          </Card>
          <Card variant="elevated">
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: '8px', textTransform: 'uppercase', fontWeight: 'var(--font-weight-bold)' }}>Total Tasks</p>
            <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info)', margin: 0 }}>{completedWork.length + pendingWork.length}</p>
          </Card>
          <Card variant="elevated">
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: '8px', textTransform: 'uppercase', fontWeight: 'var(--font-weight-bold)' }}>Days Left</p>
            <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-error)', margin: 0 }}>{executionSummary.daysRemaining}d</p>
          </Card>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-2xl)' }}>
          {/* WHAT'S DONE */}
          <div>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)', margin: '0 0 var(--spacing-lg) 0' }}>
              ✅ WHAT'S BEEN COMPLETED
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {completedWork.map((item, idx) => (
                <Card key={idx} variant="default" style={{ borderLeft: '4px solid var(--color-success)' }}>
                  <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: '8px' }}>
                    {item.title}
                  </p>
                  <div style={{ height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', backgroundColor: 'var(--color-success)', width: '100%' }} />
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)', fontWeight: 'var(--font-weight-bold)', margin: '8px 0 0 0' }}>
                    {item.completion}% ✓
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* WHAT'S PENDING */}
          <div>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-error)', margin: '0 0 var(--spacing-lg) 0' }}>
              ⏳ WHAT'S STILL PENDING
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {pendingWork.map(item => (
                <Card key={item.id} variant="default" style={{
                  borderLeft: `4px solid ${item.priority === 'CRITICAL' ? 'var(--color-error)' : 'var(--color-warning)'}`
                }}>
                  <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: '4px' }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: '8px' }}>
                    📅 {item.deadline} | ⏱️ {item.effort}
                  </p>
                  <div style={{ height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      backgroundColor: item.priority === 'CRITICAL' ? 'var(--color-error)' : 'var(--color-warning)',
                      width: `${item.completion}%`
                    }} />
                  </div>
                  <p style={{
                    fontSize: 'var(--font-size-xs)',
                    color: item.priority === 'CRITICAL' ? 'var(--color-error)' : 'var(--color-warning)',
                    fontWeight: 'var(--font-weight-bold)',
                    margin: '8px 0 0 0'
                  }}>
                    {item.completion}% | {item.priority}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* SUMMARY FOOTER */}
        <Card variant="elevated" style={{ borderLeft: '4px solid var(--color-primary)' }}>
          <h2 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
            📊 EXECUTION SUMMARY
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: '8px', fontWeight: 'var(--font-weight-bold)', textTransform: 'uppercase' }}>
                Current Phase
              </p>
              <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-heading)', margin: 0 }}>
                {executionSummary.phase}
              </p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: '8px 0 0 0' }}>
                Day 1 of 21 | Started 2026-03-04
              </p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: '8px', fontWeight: 'var(--font-weight-bold)', textTransform: 'uppercase' }}>
                Critical Blockers
              </p>
              <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-error)', margin: 0 }}>
                3 Actions - START TODAY
              </p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: '8px 0 0 0' }}>
                Prometheus, Staging, Resources
              </p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: '8px', fontWeight: 'var(--font-weight-bold)', textTransform: 'uppercase' }}>
                Target Completion
              </p>
              <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-success)', margin: 0 }}>
                2026-03-24
              </p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: '8px 0 0 0' }}>
                1 day before launch
              </p>
            </div>
          </div>

          {/* PROGRESS BREAKDOWN */}
          <div style={{ marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-md)' }}>
              📈 Progress Breakdown
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)' }}>Sprint 38 (Completed)</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)' }}>82%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', backgroundColor: 'var(--color-success)', width: '82%' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)' }}>Design Audit (Completed)</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)' }}>100%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', backgroundColor: 'var(--color-success)', width: '100%' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)' }}>Pre-Launch Actions</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-error)' }}>{calculateProgress()}%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', backgroundColor: 'var(--color-warning)', width: `${calculateProgress()}%` }} />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* NEXT ACTIONS */}
        <div style={{
          marginTop: 'var(--spacing-2xl)',
          padding: 'var(--spacing-lg)',
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          borderRadius: 'var(--border-radius-lg)',
          borderLeft: '4px solid var(--color-error)'
        }}>
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-error)', margin: 0, marginBottom: 'var(--spacing-md)' }}>
            🔴 NEXT IMMEDIATE ACTIONS
          </h3>
          <ol style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <li style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-heading)' }}>
              <strong>SRE Lead:</strong> Email team NOW to start Prometheus/Grafana setup (blocks all monitoring)
            </li>
            <li style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-heading)' }}>
              <strong>PM:</strong> Send calendar invite for resource allocation meeting (schedule for 2026-03-05)
            </li>
            <li style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-heading)' }}>
              <strong>DevOps Lead:</strong> Begin staging environment provisioning THIS HOUR
            </li>
            <li style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-heading)' }}>
              <strong>Frontend Manager:</strong> Assign team to Analytics final 20% (start ASAP)
            </li>
            <li style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-heading)' }}>
              <strong>You:</strong> Confirm all 5 actions have started within next 2 hours
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}