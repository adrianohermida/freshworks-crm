import React, { useState, useEffect } from 'react';
import Card from '@/components/aetherlab/Card';

export default function SprintExecutionLiveMonitor() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [actionStatus, setActionStatus] = useState({
    prometheus: { started: false, progress: 0, status: 'WAITING' },
    staging: { started: false, progress: 0, status: 'WAITING' },
    resources: { started: false, progress: 0, status: 'WAITING' }
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const criticalActions = [
    {
      id: 'prometheus',
      icon: '⚙️',
      title: 'Prometheus/Grafana Setup',
      owner: 'SRE Lead',
      deadline: '2026-03-22',
      effort: '18d',
      blockers: ['Kubernetes access', 'Cloud credentials'],
      impact: '🔴 CRITICAL - Monitoring infrastructure'
    },
    {
      id: 'staging',
      icon: '🏗️',
      title: 'Staging Environment',
      owner: 'DevOps Lead',
      deadline: '2026-03-20',
      effort: '16d',
      blockers: ['Infrastructure approval', 'Network config'],
      impact: '🔴 CRITICAL - Pre-launch validation'
    },
    {
      id: 'resources',
      icon: '👥',
      title: 'Resource Allocation',
      owner: 'PM',
      deadline: '2026-03-20',
      effort: '2d',
      blockers: ['Budget approval', 'Team availability'],
      impact: '🔴 CRITICAL - Enable all other work'
    }
  ];

  const toggleAction = (id) => {
    setActionStatus(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        started: !prev[id].started,
        status: !prev[id].started ? 'IN_PROGRESS' : 'WAITING'
      }
    }));
  };

  const startedCount = Object.values(actionStatus).filter(a => a.started).length;
  const overallProgress = (startedCount / 3) * 100;

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-xl)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* LIVE HEADER */}
        <div style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: 'var(--spacing-2xl)',
          border: '2px solid var(--color-error)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
              🔴 LIVE SPRINT EXECUTION MONITOR
            </h1>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 0 }}>Updated</p>
              <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: '4px 0 0 0' }}>
                {currentTime.toLocaleTimeString('pt-BR')}
              </p>
            </div>
          </div>

          {/* OVERALL PROGRESS */}
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)' }}>
                Critical Actions Started: {startedCount}/3
              </span>
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-error)' }}>
                {Math.round(overallProgress)}%
              </span>
            </div>
            <div style={{ height: '12px', backgroundColor: 'var(--color-border)', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                backgroundColor: startedCount === 3 ? 'var(--color-success)' : startedCount > 0 ? 'var(--color-warning)' : 'var(--color-error)',
                width: `${overallProgress}%`,
                transition: 'width 300ms ease'
              }} />
            </div>
          </div>

          {/* STATUS INDICATOR */}
          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <div style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: startedCount === 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              borderRadius: 'var(--border-radius-md)',
              border: `1px solid ${startedCount === 0 ? 'var(--color-error)' : 'var(--color-success)'}`
            }}>
              <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: startedCount === 0 ? 'var(--color-error)' : 'var(--color-success)', margin: 0 }}>
                {startedCount === 0 ? '⚠️ AWAITING START' : startedCount < 3 ? '🟡 PARTIAL START' : '✅ ALL STARTED'}
              </p>
            </div>
            <div style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--color-info)'
            }}>
              <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info)', margin: 0 }}>
                📅 Day 1 of 21 Pre-Launch
              </p>
            </div>
          </div>
        </div>

        {/* CRITICAL ACTIONS CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-2xl)'
        }}>
          {criticalActions.map(action => (
            <Card key={action.id} variant="elevated" style={{ borderLeft: '4px solid var(--color-error)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--spacing-md)' }}>
                <div>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 0, marginBottom: '4px' }}>
                    {action.icon} {action.title}
                  </p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
                    Owner: {action.owner}
                  </p>
                </div>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: actionStatus[action.id].started ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: actionStatus[action.id].started ? 'var(--color-success)' : 'var(--color-error)',
                  borderRadius: '20px',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  {actionStatus[action.id].status}
                </span>
              </div>

              {/* TIMELINE */}
              <div style={{ marginBottom: 'var(--spacing-md)', padding: 'var(--spacing-md)', backgroundColor: 'var(--color-light)', borderRadius: 'var(--border-radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                    Deadline: {action.deadline}
                  </p>
                  <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)', margin: 0 }}>
                    {action.effort} effort
                  </p>
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)' }}>
                  {action.impact}
                </div>
              </div>

              {/* BLOCKERS */}
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: '8px' }}>
                  🔒 Current Blockers:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {action.blockers.map((blocker, i) => (
                    <p key={i} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, paddingLeft: '12px' }}>
                      • {blocker}
                    </p>
                  ))}
                </div>
              </div>

              {/* START BUTTON */}
              <button
                onClick={() => toggleAction(action.id)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  backgroundColor: actionStatus[action.id].started ? 'var(--color-success)' : 'var(--color-error)',
                  color: 'var(--color-white)',
                  border: 'none',
                  borderRadius: 'var(--border-radius-md)',
                  fontWeight: 'var(--font-weight-bold)',
                  cursor: 'pointer',
                  transition: 'all 200ms',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                {actionStatus[action.id].started ? '✅ STARTED - MARK COMPLETE' : '▶️ START ACTION'}
              </button>
            </Card>
          ))}
        </div>

        {/* EXECUTION CHECKLIST */}
        <Card variant="elevated">
          <h2 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
            📋 PRE-LAUNCH EXECUTION CHECKLIST
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {/* PHASE 1 */}
            <div style={{ padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-light)', borderRadius: 'var(--border-radius-md)', borderLeft: '3px solid var(--color-error)' }}>
              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-md)' }}>
                🔴 PHASE 1: Immediate (Today)
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer', fontSize: 'var(--font-size-xs)' }}>
                  <input type="checkbox" defaultChecked={actionStatus.prometheus.started} readOnly />
                  <span>✓ Prometheus/Grafana: {actionStatus.prometheus.started ? '✅' : '❌'}</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer', fontSize: 'var(--font-size-xs)' }}>
                  <input type="checkbox" defaultChecked={actionStatus.staging.started} readOnly />
                  <span>✓ Staging Environment: {actionStatus.staging.started ? '✅' : '❌'}</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer', fontSize: 'var(--font-size-xs)' }}>
                  <input type="checkbox" defaultChecked={actionStatus.resources.started} readOnly />
                  <span>✓ Resource Allocation: {actionStatus.resources.started ? '✅' : '❌'}</span>
                </label>
              </div>
            </div>

            {/* PHASE 2 */}
            <div style={{ padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-light)', borderRadius: 'var(--border-radius-md)', borderLeft: '3px solid var(--color-warning)' }}>
              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-md)' }}>
                🟠 PHASE 2: Short-term (5-20 Mar)
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
                  • Sprint 37 Features (40%→100%)
                </p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
                  • Monitoring Setup (80%→100%)
                </p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
                  • Analytics Dashboard (80%→100%)
                </p>
              </div>
            </div>

            {/* PHASE 3 */}
            <div style={{ padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-light)', borderRadius: 'var(--border-radius-md)', borderLeft: '3px solid var(--color-info)' }}>
              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-md)' }}>
                🔵 PHASE 3: Final (21-24 Mar)
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
                  • Final Monitoring Validation
                </p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
                  • Team Readiness Assessment
                </p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
                  • 🚀 Sprint 39 Kickoff
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* FINAL STATUS */}
        <div style={{ marginTop: 'var(--spacing-2xl)', padding: 'var(--spacing-xl)', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--color-success)' }}>
          <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-md)' }}>
            ✅ EXECUTOR STATUS
          </p>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, lineHeight: '1.6' }}>
            Sprint Executor is LIVE and monitoring real-time execution. Click "START ACTION" above to trigger each critical task. Progress updates will reflect immediately. Next daily check-in: Tomorrow 09:00 BRT.
          </p>
        </div>
      </div>
    </div>
  );
}