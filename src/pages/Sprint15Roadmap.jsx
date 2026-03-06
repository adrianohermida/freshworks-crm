import React, { useState } from 'react';
import { Zap, Target, BarChart3, Users, Cpu, Shield } from 'lucide-react';

export default function Sprint15Roadmap() {
  const sprint14Final = {
    name: 'Sprint 14: Integrations & Automation',
    status: 'COMPLETING',
    completion: 95,
    completedTasks: 10,
    totalTasks: 10,
    completedDate: '2026-03-08',
    achievements: [
      'Google Calendar sync fully operational',
      'Google Sheets daily exports active',
      '10 automations running (2 new, 8 existing)',
      'E2E test suite 100% passing',
      'Production validator confirmed ready',
      'ErrorBoundary & LoadingIndicators deployed',
      'Sprint execution dashboard live',
    ],
  };

  const sprint15Plan = {
    name: 'Sprint 15: Performance & Scale',
    duration: '3 dias (2026-03-09 até 2026-03-12)',
    target: '100% Production Ready',
    tasks: [
      {
        id: 1,
        category: 'Performance',
        icon: Cpu,
        name: 'Database Query Optimization',
        description: 'Index optimization, N+1 query fixes, caching strategies',
        priority: 'CRITICAL',
        estimatedHours: 8,
      },
      {
        id: 2,
        category: 'Performance',
        icon: Cpu,
        name: 'Load Testing & Benchmarking',
        description: 'Concurrent user testing, stress test scenarios, baseline metrics',
        priority: 'CRITICAL',
        estimatedHours: 6,
      },
      {
        id: 3,
        category: 'Security',
        icon: Shield,
        name: 'Security Audit & Hardening',
        description: 'LGPD compliance final check, data encryption, API rate limiting',
        priority: 'CRITICAL',
        estimatedHours: 6,
      },
      {
        id: 4,
        category: 'Monitoring',
        icon: BarChart3,
        name: 'Production Monitoring Setup',
        description: 'Error tracking, performance monitoring, alert rules',
        priority: 'HIGH',
        estimatedHours: 6,
      },
      {
        id: 5,
        category: 'Documentation',
        icon: Users,
        name: 'Go-Live Documentation',
        description: 'Runbook, troubleshooting guide, user manual, API docs',
        priority: 'HIGH',
        estimatedHours: 8,
      },
      {
        id: 6,
        category: 'Operations',
        icon: Zap,
        name: 'Production Deployment',
        description: 'Final deployment, DNS setup, CDN configuration, verification',
        priority: 'CRITICAL',
        estimatedHours: 4,
      },
    ],
  };

  const nextSprints = [
    {
      number: 16,
      name: 'Post-Launch Support & Optimization',
      timeline: '2026-03-13 - 2026-03-20',
      focus: 'Bug fixes, user feedback implementation, performance tuning',
      tasks: 12,
    },
    {
      number: 17,
      name: 'Advanced Features Phase 1',
      timeline: '2026-03-21 - 2026-04-03',
      focus: 'Advanced search, analytics dashboard, AI-powered insights',
      tasks: 15,
    },
    {
      number: 18,
      name: 'Mobile App Launch',
      timeline: '2026-04-04 - 2026-04-17',
      focus: 'React Native mobile app, iOS/Android optimization',
      tasks: 20,
    },
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-lg)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
          🚀 Sprint 15 Roadmap & Execution Plan
        </h1>

        {/* Sprint 14 Completion Summary */}
        <div style={{
          backgroundColor: 'white',
          border: '3px solid #10B981',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-2xl)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700', color: 'var(--color-heading)', margin: 0 }}>
              ✅ {sprint14Final.name}
            </h2>
            <span style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: '700',
              color: 'white',
              backgroundColor: '#10B981',
              padding: 'var(--spacing-xs) var(--spacing-md)',
              borderRadius: '20px',
            }}>
              {sprint14Final.completion}% COMPLETE
            </span>
          </div>

          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div style={{ height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden', marginBottom: 'var(--spacing-sm)' }}>
              <div style={{ width: `${sprint14Final.completion}%`, height: '100%', backgroundColor: '#10B981', transition: 'width 0.3s' }} />
            </div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 0 }}>
              {sprint14Final.completedTasks}/{sprint14Final.totalTasks} tasks complete • Completed: {sprint14Final.completedDate}
            </p>
          </div>

          <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
            {sprint14Final.achievements.map((achievement, idx) => (
              <li key={idx} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)' }}>
                ✓ {achievement}
              </li>
            ))}
          </ul>
        </div>

        {/* Sprint 15 Plan */}
        <div style={{
          backgroundColor: 'white',
          border: '2px solid #3b82f6',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-2xl)',
        }}>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700', color: 'var(--color-heading)', margin: 0 }}>
              🎯 {sprint15Plan.name}
            </h2>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 'var(--spacing-sm) 0 0' }}>
              {sprint15Plan.duration} • Target: {sprint15Plan.target}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
            {sprint15Plan.tasks.map(task => {
              const Icon = task.icon;
              return (
                <div
                  key={task.id}
                  style={{
                    backgroundColor: 'var(--color-light)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: 'var(--spacing-lg)',
                    borderLeft: task.priority === 'CRITICAL' ? '4px solid #EF4444' : '4px solid #F59E0B',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                    <Icon style={{ width: '20px', height: '20px', color: task.priority === 'CRITICAL' ? '#EF4444' : '#F59E0B' }} />
                    <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: '700', color: 'var(--color-heading)', margin: 0, flex: 1 }}>
                      {task.name}
                    </h3>
                    <span style={{
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: '600',
                      color: task.priority === 'CRITICAL' ? '#EF4444' : '#F59E0B',
                      backgroundColor: task.priority === 'CRITICAL' ? '#FEE2E2' : '#FEF3C7',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: '12px',
                    }}>
                      {task.priority}
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: '0 0 var(--spacing-md)' }}>
                    {task.description}
                  </p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: '#3b82f6', fontWeight: '600', margin: 0 }}>
                    ⏱ {task.estimatedHours}h
                  </p>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-lg)', backgroundColor: '#F0F9FF', borderRadius: 'var(--border-radius-md)', borderLeft: '4px solid #3b82f6' }}>
            <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', color: '#1e40af', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
              📊 Sprint 15 Summary
            </p>
            <p style={{ fontSize: 'var(--font-size-sm)', color: '#1e40af', margin: 0 }}>
              6 critical tasks • 38 estimated hours • 🔴 3 critical path tasks (Query Opt, Security, Deploy)
            </p>
          </div>
        </div>

        {/* Future Roadmap */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
        }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700', color: 'var(--color-heading)', margin: '0 0 var(--spacing-lg)' }}>
            📈 Future Roadmap (Sprints 16-18)
          </h2>

          <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
            {nextSprints.map(sprint => (
              <div
                key={sprint.number}
                style={{
                  padding: 'var(--spacing-lg)',
                  backgroundColor: 'var(--color-light)',
                  borderRadius: 'var(--border-radius-md)',
                  borderLeft: '4px solid #8b5cf6',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                  <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: '700', color: 'var(--color-heading)', margin: 0 }}>
                    Sprint {sprint.number}: {sprint.name}
                  </h3>
                  <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: '600', color: 'var(--color-body)' }}>
                    {sprint.tasks} tasks
                  </span>
                </div>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 'var(--spacing-xs) 0 0' }}>
                  📅 {sprint.timeline} • 🎯 {sprint.focus}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}