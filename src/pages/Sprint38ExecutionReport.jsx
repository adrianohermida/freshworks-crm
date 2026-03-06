import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, TrendingUp, Zap } from 'lucide-react';

export default function Sprint38ExecutionReport() {
  const [expandedSection, setExpandedSection] = useState('overview');

  const executionData = {
    sprint_info: {
      number: 38,
      status: 'IN EXECUTION',
      started: '2026-03-04',
      planned_end: '2026-03-25',
      days_elapsed: 0,
      days_total: 21,
      current_time: new Date().toLocaleString('pt-BR')
    },
    completed_tasks: [
      {
        id: 1,
        name: 'Google Sheets Sync Timeout Fix',
        description: 'Implemented retry logic with exponential backoff (3 attempts, 30s timeout per request)',
        owner: 'Sprint Executor',
        status: '✅ COMPLETED',
        effort_days: 1,
        completion_pct: 100
      },
      {
        id: 2,
        name: 'Sprint 38 Live Tracking Dashboard',
        description: 'Created real-time progress dashboard with live metrics and objective tracking',
        owner: 'Sprint Executor',
        status: '✅ COMPLETED',
        effort_days: 0.5,
        completion_pct: 100
      },
      {
        id: 3,
        name: 'Settings Page - Aetherlab Refactoring',
        description: 'Refactored with Card component, improved UI consistency, added icons',
        owner: 'Sprint Executor',
        status: '✅ COMPLETED',
        effort_days: 1,
        completion_pct: 100
      },
      {
        id: 4,
        name: 'AdminPanel - Aetherlab Refactoring',
        description: 'Updated with Aetherlab Card component, CSS variables integration',
        owner: 'Sprint Executor',
        status: '✅ COMPLETED',
        effort_days: 1,
        completion_pct: 100
      }
    ],
    in_progress_tasks: [
      {
        id: 5,
        name: 'Google Sheets Monitoring Setup',
        description: 'Error tracking, alerting, dashboard visualization',
        owner: 'Backend Team',
        estimated_days: 1.5,
        completion_pct: 20
      },
      {
        id: 6,
        name: 'Sprint 37 Analytics Dashboard - 20% → 50%',
        description: 'Complete UI components, integrate ML models',
        owner: 'Sprint 37 Team',
        estimated_days: 5,
        completion_pct: 20
      }
    ],
    blocked_tasks: [
      {
        id: 7,
        name: 'SDK JavaScript Initialization',
        reason: 'Waiting for Stripe integration Phase 1 completion',
        blocked_since: '2026-03-04',
        estimated_unblock: '2026-03-10'
      }
    ],
    pending_tasks: [
      { id: 8, name: 'Marketplace API Partner Dashboard', estimated_days: 4 },
      { id: 9, name: 'Testing & QA - Coverage 85%+', estimated_days: 7 },
      { id: 10, name: 'Analytics & Monitoring Setup', estimated_days: 5 },
      { id: 11, name: 'Production Deployment & Validation', estimated_days: 2 }
    ]
  };

  const calculateStats = () => {
    const total_tasks = 
      executionData.completed_tasks.length +
      executionData.in_progress_tasks.length +
      executionData.blocked_tasks.length +
      executionData.pending_tasks.length;
    
    const completed = executionData.completed_tasks.length;
    const in_progress = executionData.in_progress_tasks.length;
    
    const overall_progress = Math.round(
      (completed * 100 + 
       in_progress * executionData.in_progress_tasks[0].completion_pct) / 
      total_tasks
    );

    return {
      total_tasks,
      completed,
      in_progress,
      blocked: executionData.blocked_tasks.length,
      pending: executionData.pending_tasks.length,
      overall_progress
    };
  };

  const stats = calculateStats();
  const effort_days_completed = executionData.completed_tasks.reduce((sum, t) => sum + t.effort_days, 0);
  const effort_days_remaining = 
    executionData.in_progress_tasks.reduce((sum, t) => sum + t.estimated_days, 0) +
    executionData.pending_tasks.reduce((sum, t) => sum + t.estimated_days, 0);

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-xl)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
            <Zap style={{ width: '40px', height: '40px', color: 'var(--color-primary)', animation: 'pulse 2s infinite' }} />
            <div>
              <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                Sprint 38 - EXECUTION REPORT
              </h1>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: '0.5rem 0 0 0' }}>
                🚀 Status: {executionData.sprint_info.status} | Generated: {executionData.sprint_info.current_time}
              </p>
            </div>
          </div>
        </div>

        {/* OVERALL METRICS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-2xl)'
        }}>
          <div style={{
            backgroundColor: 'var(--color-surface)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-md)',
            borderLeft: '4px solid var(--color-primary)'
          }}>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', marginBottom: 'var(--spacing-sm)' }}>
              OVERALL PROGRESS
            </div>
            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
              {stats.overall_progress}%
            </div>
            <div style={{ height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px', marginTop: 'var(--spacing-md)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                backgroundColor: 'var(--color-primary)',
                width: `${stats.overall_progress}%`,
                transition: 'width 500ms ease'
              }} />
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--color-surface)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-md)',
            borderLeft: '4px solid var(--color-success)'
          }}>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', marginBottom: 'var(--spacing-sm)' }}>
              COMPLETED
            </div>
            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)' }}>
              {stats.completed}/{stats.total_tasks}
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', marginTop: 'var(--spacing-sm)' }}>
              {effort_days_completed.toFixed(1)} dias de esforço
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--color-surface)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-md)',
            borderLeft: '4px solid var(--color-info)'
          }}>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', marginBottom: 'var(--spacing-sm)' }}>
              IN PROGRESS
            </div>
            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info)' }}>
              {stats.in_progress}
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', marginTop: 'var(--spacing-sm)' }}>
              ~{effort_days_remaining.toFixed(1)} dias restantes
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--color-surface)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-md)',
            borderLeft: '4px solid var(--color-warning)'
          }}>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', marginBottom: 'var(--spacing-sm)' }}>
              BLOCKERS
            </div>
            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)' }}>
              {stats.blocked}
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', marginTop: 'var(--spacing-sm)' }}>
              Estratégia: Unblock em 6 dias
            </div>
          </div>
        </div>

        {/* SECTIONS */}
        <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
          {/* COMPLETED TASKS */}
          <div style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden',
            borderLeft: '4px solid var(--color-success)'
          }}>
            <div
              onClick={() => setExpandedSection(expandedSection === 'completed' ? 'overview' : 'completed')}
              style={{
                padding: 'var(--spacing-lg)',
                cursor: 'pointer',
                backgroundColor: 'var(--color-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0 }}>
                ✅ Completed Tasks ({stats.completed})
              </h3>
              <span style={{ color: 'var(--color-body)' }}>
                {expandedSection === 'completed' ? '▼' : '▶'}
              </span>
            </div>
            {expandedSection === 'completed' && (
              <div style={{ padding: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)' }}>
                {executionData.completed_tasks.map((task, idx) => (
                  <div key={idx} style={{ marginBottom: idx < executionData.completed_tasks.length - 1 ? 'var(--spacing-lg)' : 0, paddingBottom: idx < executionData.completed_tasks.length - 1 ? 'var(--spacing-lg)' : 0, borderBottom: idx < executionData.completed_tasks.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                      <CheckCircle2 style={{ width: '20px', height: '20px', color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-xs)' }}>
                          {task.name}
                        </h4>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                          {task.description}
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--spacing-lg)', fontSize: 'var(--font-size-xs)', color: 'var(--color-body)' }}>
                          <span>Owner: {task.owner}</span>
                          <span>Effort: {task.effort_days}d</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* IN PROGRESS TASKS */}
          <div style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden',
            borderLeft: '4px solid var(--color-info)'
          }}>
            <div
              onClick={() => setExpandedSection(expandedSection === 'progress' ? 'overview' : 'progress')}
              style={{
                padding: 'var(--spacing-lg)',
                cursor: 'pointer',
                backgroundColor: 'var(--color-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0 }}>
                🔄 In Progress ({stats.in_progress})
              </h3>
              <span style={{ color: 'var(--color-body)' }}>
                {expandedSection === 'progress' ? '▼' : '▶'}
              </span>
            </div>
            {expandedSection === 'progress' && (
              <div style={{ padding: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)' }}>
                {executionData.in_progress_tasks.map((task, idx) => (
                  <div key={idx} style={{ marginBottom: idx < executionData.in_progress_tasks.length - 1 ? 'var(--spacing-lg)' : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                      <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0 }}>
                        {task.name}
                      </h4>
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info)' }}>
                        {task.completion_pct}%
                      </span>
                    </div>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: '0 0 var(--spacing-sm) 0' }}>
                      {task.description}
                    </p>
                    <div style={{ height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px', marginBottom: 'var(--spacing-sm)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        backgroundColor: 'var(--color-info)',
                        width: `${task.completion_pct}%`,
                        transition: 'width 500ms ease'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BLOCKED TASKS */}
          {stats.blocked > 0 && (
            <div style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--border-radius-lg)',
              boxShadow: 'var(--shadow-md)',
              overflow: 'hidden',
              borderLeft: '4px solid var(--color-warning)'
            }}>
              <div style={{
                padding: 'var(--spacing-lg)',
                backgroundColor: 'var(--color-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0 }}>
                  ⚠️ Blocked ({stats.blocked})
                </h3>
              </div>
              <div style={{ padding: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)' }}>
                {executionData.blocked_tasks.map((task, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: idx < executionData.blocked_tasks.length - 1 ? 'var(--spacing-lg)' : 0 }}>
                    <AlertCircle style={{ width: '20px', height: '20px', color: 'var(--color-warning)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-xs)' }}>
                        {task.name}
                      </h4>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 0 }}>
                        {task.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SUMMARY */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
          boxShadow: 'var(--shadow-md)',
          marginTop: 'var(--spacing-2xl)',
          borderLeft: '4px solid var(--color-success)'
        }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
            📊 SPRINT 38 SUMMARY
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--color-body)' }}>
            <div>
              <p style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-sm)', color: 'var(--color-heading)' }}>✅ Completados esta Sessão</p>
              <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)' }}>
                <li>Google Sheets Sync Fix</li>
                <li>Sprint 38 Tracker Dashboard</li>
                <li>Settings Refactoring</li>
                <li>AdminPanel Refactoring</li>
              </ul>
            </div>
            <div>
              <p style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-sm)', color: 'var(--color-heading)' }}>🎯 Próximas Prioridades (24h)</p>
              <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)' }}>
                <li>Google Sheets Monitoring Setup</li>
                <li>Analytics Dashboard 50%</li>
                <li>Marketplace API Core</li>
              </ul>
            </div>
            <div>
              <p style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-sm)', color: 'var(--color-heading)' }}>⏱️ Timeline</p>
              <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)' }}>
                <li>Dias restantes: 21</li>
                <li>Esforço restante: {effort_days_remaining.toFixed(1)}d</li>
                <li>Velocity: {(effort_days_completed / 1).toFixed(1)}d/dia</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}