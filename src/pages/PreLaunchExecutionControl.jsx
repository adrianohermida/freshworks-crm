import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Clock, Zap, TrendingUp } from 'lucide-react';
import Card from '@/components/aetherlab/Card';

export default function PreLaunchExecutionControl() {
  const [executionState, setExecutionState] = useState({
    startDate: '2026-03-04',
    launchDate: '2026-03-25',
    daysRemaining: 21,
    currentTime: new Date().toLocaleTimeString('pt-BR'),
    overallProgress: 0
  });

  const [actions, setActions] = useState([
    {
      id: 1,
      title: 'SRE: Prometheus/Grafana Setup',
      owner: 'SRE Team Lead',
      status: 'PENDING',
      progress: 0,
      deadline: '2026-03-22',
      effort: '3 days',
      impact: 'BLOCKS_ALL',
      subtasks: [
        { id: 1, name: 'Install Prometheus stack', status: 'pending' },
        { id: 2, name: 'Configure monitoring rules', status: 'pending' },
        { id: 3, name: 'Setup Grafana dashboards', status: 'pending' },
        { id: 4, name: 'Integration testing', status: 'pending' }
      ],
      notes: 'CRITICAL: Must start TODAY - blocks all monitoring tasks'
    },
    {
      id: 2,
      title: 'DevOps: Staging Environment',
      owner: 'DevOps Team Lead',
      status: 'PENDING',
      progress: 0,
      deadline: '2026-03-20',
      effort: '2 days',
      impact: 'CRITICAL',
      subtasks: [
        { id: 1, name: 'Infrastructure provisioning', status: 'pending' },
        { id: 2, name: 'Database configuration', status: 'pending' },
        { id: 3, name: 'Security validation', status: 'pending' }
      ],
      notes: 'Must be ready by March 20 for integration testing'
    },
    {
      id: 3,
      title: 'PM: Resource Allocation',
      owner: 'Product Manager',
      status: 'PENDING',
      progress: 0,
      deadline: '2026-03-20',
      effort: '1 day',
      impact: 'CRITICAL',
      subtasks: [
        { id: 1, name: 'Schedule allocation meeting', status: 'pending' },
        { id: 2, name: 'Confirm team assignments', status: 'pending' },
        { id: 3, name: 'Send notifications', status: 'pending' }
      ],
      notes: 'Schedule meeting for 2026-03-05. Team needs clarity ASAP'
    },
    {
      id: 4,
      title: 'Data: Analytics Dashboard 100%',
      owner: 'Data Team Lead',
      status: 'PENDING',
      progress: 20,
      deadline: '2026-03-22',
      effort: '2 days',
      impact: 'HIGH',
      subtasks: [
        { id: 1, name: 'Complete remaining 20%', status: 'pending' },
        { id: 2, name: 'Performance optimization', status: 'pending' },
        { id: 3, name: 'UAT validation', status: 'pending' }
      ],
      notes: 'Currently at 80% - final 20% needed by March 22'
    },
    {
      id: 5,
      title: 'Frontend: Sprint 37 Features 100%',
      owner: 'Frontend Team Lead',
      status: 'PENDING',
      progress: 40,
      deadline: '2026-03-20',
      effort: '3 days',
      impact: 'HIGH',
      subtasks: [
        { id: 1, name: 'Complete remaining 60%', status: 'pending' },
        { id: 2, name: 'Code review & testing', status: 'pending' },
        { id: 3, name: 'Integration with backend', status: 'pending' }
      ],
      notes: 'Carryover from Sprint 38 - must be done by March 20'
    },
    {
      id: 6,
      title: 'Lead: Sprint 39 Kickoff',
      owner: 'Sprint Lead',
      status: 'PENDING',
      progress: 0,
      deadline: '2026-03-24',
      effort: '4 hours',
      impact: 'HIGH',
      subtasks: [
        { id: 1, name: 'Prepare kickoff agenda', status: 'pending' },
        { id: 2, name: 'Schedule meeting for full team', status: 'pending' },
        { id: 3, name: 'Send pre-kickoff materials', status: 'pending' }
      ],
      notes: 'Final day before launch - confirm readiness'
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setExecutionState(prev => ({
        ...prev,
        currentTime: new Date().toLocaleTimeString('pt-BR')
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateOverallProgress = () => {
    const avg = actions.reduce((sum, a) => sum + a.progress, 0) / actions.length;
    return Math.round(avg);
  };

  const handleActionStart = (actionId) => {
    setActions(actions.map(a => 
      a.id === actionId ? { ...a, status: 'IN_PROGRESS', progress: 5 } : a
    ));
  };

  const handleSubtaskComplete = (actionId, subtaskId) => {
    setActions(actions.map(a => {
      if (a.id === actionId) {
        const updatedSubtasks = a.subtasks.map(st =>
          st.id === subtaskId ? { ...st, status: 'completed' } : st
        );
        const completedCount = updatedSubtasks.filter(st => st.status === 'completed').length;
        const newProgress = Math.round((completedCount / updatedSubtasks.length) * 100);
        return { ...a, subtasks: updatedSubtasks, progress: newProgress };
      }
      return a;
    }));
  };

  const criticalActions = actions.filter(a => a.impact === 'BLOCKS_ALL' || a.impact === 'CRITICAL');
  const highPriorityActions = actions.filter(a => a.impact === 'HIGH');

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-xl)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* LIVE TIMER HEADER */}
        <div style={{
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: 'var(--shadow-md)',
          marginBottom: 'var(--spacing-2xl)',
          border: '3px solid var(--color-error)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-lg)' }}>
            <div>
              <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                🚀 PRE-LAUNCH EXECUTION CONTROL CENTER
              </h1>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: '0.5rem 0 0 0' }}>
                Sprint 38 → 39 | 6 Critical Actions | 21 Days to Launch
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-error)', margin: 0 }}>
                ⏰ {executionState.currentTime}
              </p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: '0.5rem 0 0 0' }}>
                {executionState.daysRemaining}D | {21 - executionState.daysRemaining} hours elapsed
              </p>
            </div>
          </div>
        </div>

        {/* OVERALL METRICS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-2xl)'
        }}>
          <Card variant="elevated">
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>Overall Progress</p>
            <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)', margin: 0 }}>{calculateOverallProgress()}%</p>
            <div style={{ height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px', marginTop: 'var(--spacing-md)', overflow: 'hidden' }}>
              <div style={{ height: '100%', backgroundColor: 'var(--color-warning)', width: `${calculateOverallProgress()}%`, transition: 'width 300ms' }} />
            </div>
          </Card>

          <Card variant="elevated">
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>Actions Started</p>
            <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info)', margin: 0 }}>
              {actions.filter(a => a.status !== 'PENDING').length}/{actions.length}
            </p>
          </Card>

          <Card variant="elevated">
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>Days to Launch</p>
            <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-error)', margin: 0 }}>{executionState.daysRemaining}d</p>
          </Card>

          <Card variant="elevated">
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>Critical Blocker</p>
            <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-error)', margin: 0 }}>3</p>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-error)', margin: '0.5rem 0 0 0' }}>START TODAY</p>
          </Card>
        </div>

        {/* CRITICAL PATH ACTIONS */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: '0 0 var(--spacing-lg) 0' }}>
            🔴 CRITICAL PATH - START TODAY (3 Actions)
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {criticalActions.map(action => (
              <Card key={action.id} variant="default" style={{ borderLeft: '4px solid var(--color-error)', backgroundColor: 'rgba(239, 68, 68, 0.02)' }}>
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                    <div>
                      <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: '4px' }}>
                        {action.title}
                      </h3>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 0 }}>
                        👤 {action.owner} | 📅 Deadline: {action.deadline} | ⏱️ {action.effort}
                      </p>
                    </div>
                    {action.status === 'PENDING' ? (
                      <button
                        onClick={() => handleActionStart(action.id)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: 'var(--color-error)',
                          color: 'var(--color-white)',
                          border: 'none',
                          borderRadius: 'var(--border-radius-md)',
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 'var(--font-weight-bold)',
                          cursor: 'pointer',
                          transition: 'all 200ms'
                        }}
                      >
                        🚀 START NOW
                      </button>
                    ) : (
                      <span style={{ padding: '8px 16px', backgroundColor: 'var(--color-success)', color: 'var(--color-white)', borderRadius: 'var(--border-radius-md)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)' }}>
                        ✅ IN PROGRESS
                      </span>
                    )}
                  </div>

                  {/* PROGRESS BAR */}
                  <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>Progress</p>
                      <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>{action.progress}%</p>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', backgroundColor: 'var(--color-error)', width: `${action.progress}%`, transition: 'width 300ms' }} />
                    </div>
                  </div>

                  {/* SUBTASKS */}
                  <div>
                    <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: '0 0 var(--spacing-sm) 0', textTransform: 'uppercase' }}>
                      Subtasks ({action.subtasks.filter(st => st.status === 'completed').length}/{action.subtasks.length})
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {action.subtasks.map(subtask => (
                        <div key={subtask.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-sm)',
                          padding: '8px',
                          backgroundColor: 'var(--color-light)',
                          borderRadius: '4px'
                        }}>
                          <input
                            type="checkbox"
                            checked={subtask.status === 'completed'}
                            onChange={() => handleSubtaskComplete(action.id, subtask.id)}
                            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                          />
                          <span style={{
                            fontSize: 'var(--font-size-sm)',
                            color: subtask.status === 'completed' ? 'var(--color-body)' : 'var(--color-heading)',
                            textDecoration: subtask.status === 'completed' ? 'line-through' : 'none'
                          }}>
                            {subtask.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* NOTES */}
                  <div style={{ marginTop: 'var(--spacing-md)', padding: 'var(--spacing-md)', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '4px', borderLeft: '3px solid var(--color-error)' }}>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-error)', fontWeight: 'var(--font-weight-bold)', margin: 0 }}>
                      ⚠️ {action.notes}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* HIGH PRIORITY ACTIONS */}
        <div>
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: '0 0 var(--spacing-lg) 0' }}>
            🟠 HIGH PRIORITY - FOLLOW-UP (3 Actions)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {highPriorityActions.map(action => (
              <Card key={action.id} variant="default" style={{ borderLeft: '4px solid var(--color-warning)' }}>
                <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: '8px' }}>
                  {action.title}
                </h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: '0 0 var(--spacing-sm) 0' }}>
                  👤 {action.owner}
                </p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: '0 0 var(--spacing-md) 0' }}>
                  📅 {action.deadline} | ⏱️ {action.effort}
                </p>
                <div style={{ height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px', marginBottom: 'var(--spacing-sm)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', backgroundColor: 'var(--color-warning)', width: `${action.progress}%` }} />
                </div>
                <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)', margin: 0 }}>
                  {action.progress}% Complete
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}