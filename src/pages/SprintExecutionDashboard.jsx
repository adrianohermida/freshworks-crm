import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, AlertCircle, TrendingUp, Zap, BarChart3 } from 'lucide-react';

export default function SprintExecutionDashboard() {
  const [currentDate] = useState('2026-03-20');

  const sprints = [
    {
      number: 13,
      name: 'Production Hardening',
      period: '2026-02-24 - 2026-03-02',
      status: 'COMPLETED',
      completion: 100,
      completedDate: '2026-03-02',
      tasks: 8,
      deliverables: ['Security hardening', 'LGPD compliance', 'Monitoring setup'],
    },
    {
      number: 14,
      name: 'Integrations & Automation',
      period: '2026-03-03 - 2026-03-08',
      status: 'COMPLETED',
      completion: 100,
      completedDate: '2026-03-08',
      tasks: 10,
      deliverables: ['Google Calendar sync', 'Google Sheets export', '10 automations active'],
    },
    {
      number: 15,
      name: 'Performance & Scale',
      period: '2026-03-09 - 2026-03-12',
      status: 'COMPLETED',
      completion: 100,
      completedDate: '2026-03-12',
      tasks: 6,
      deliverables: ['Query optimization', 'Load testing', 'Go-live deployment'],
    },
    {
      number: 16,
      name: 'Post-Launch Support & Optimization',
      period: '2026-03-13 - 2026-03-20',
      status: 'IN PROGRESS',
      completion: 92,
      tasks: 12,
      completed: 11,
      pending: 1,
      deliverables: ['46 bugs fixed', '51% feature requests', '63% performance gain', '312 active users'],
    },
    {
      number: 17,
      name: 'Advanced Features Phase 1',
      period: '2026-03-21 - 2026-04-03',
      status: 'PLANNED',
      completion: 0,
      tasks: 15,
      deliverables: ['Advanced search', 'AI insights', 'Workflow automation', 'Real-time collaboration'],
    },
  ];

  const sprint16Status = {
    tasksCompleted: 11,
    tasksTotal: 12,
    percentComplete: 92,
    pendingTasks: [
      { id: 15, title: 'Sprint 17 Planning', status: 'IN PROGRESS', hoursRemaining: 4 },
    ],
    metrics: {
      bugsFixed: 46,
      featureRequests: '51% of 55',
      performanceGain: '63%',
      userGrowth: '+112%',
      userSatisfaction: '4.2/5.0',
    },
  };

  const sprint17Readiness = {
    status: '✅ READY TO LAUNCH',
    startDate: '2026-03-21',
    criticalTasks: 2,
    highPriorityTasks: 4,
    totalEffort: '140 hours',
    keyFeatures: ['Advanced search', 'AI-powered insights', 'Workflow automation'],
  };

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-lg)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
            📊 Sprint Execution Dashboard
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 'var(--spacing-sm) 0 0' }}>
            Real-time tracking of sprint completion, deliverables, and roadmap progress • Current Date: {currentDate}
          </p>
        </div>

        {/* Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-lg)',
            borderTop: '4px solid #10B981',
          }}>
            <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: '600', color: 'var(--color-body)', margin: 0 }}>SPRINTS COMPLETED</p>
            <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: '700', color: '#10B981', margin: 'var(--spacing-sm) 0 0' }}>4/5</p>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 'var(--spacing-sm) 0 0' }}>80% complete</p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-lg)',
            borderTop: '4px solid #3b82f6',
          }}>
            <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: '600', color: 'var(--color-body)', margin: 0 }}>SPRINT 16 PROGRESS</p>
            <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: '700', color: '#3b82f6', margin: 'var(--spacing-sm) 0 0' }}>92%</p>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 'var(--spacing-sm) 0 0' }}>{sprint16Status.tasksCompleted}/{sprint16Status.tasksTotal} tasks</p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-lg)',
            borderTop: '4px solid #F59E0B',
          }}>
            <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: '600', color: 'var(--color-body)', margin: 0 }}>ACTIVE USERS</p>
            <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: '700', color: '#F59E0B', margin: 'var(--spacing-sm) 0 0' }}>312</p>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 'var(--spacing-sm) 0 0' }}>+112% from launch</p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-lg)',
            borderTop: '4px solid #8b5cf6',
          }}>
            <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: '600', color: 'var(--color-body)', margin: 0 }}>SPRINT 17 STATUS</p>
            <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: '700', color: '#8b5cf6', margin: 'var(--spacing-sm) 0 0' }}>READY</p>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 'var(--spacing-sm) 0 0' }}>Launches 2026-03-21</p>
          </div>
        </div>

        {/* Sprint Timeline */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-2xl)',
        }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700', color: 'var(--color-heading)', margin: '0 0 var(--spacing-lg)' }}>
            📅 Sprint Timeline & History
          </h2>

          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            {sprints.map((sprint, idx) => (
              <div
                key={sprint.number}
                style={{
                  backgroundColor: sprint.status === 'COMPLETED' ? '#F0FDF4' : sprint.status === 'IN PROGRESS' ? '#F0F9FF' : '#F5F3FF',
                  borderLeft: sprint.status === 'COMPLETED' ? '4px solid #10B981' : sprint.status === 'IN PROGRESS' ? '4px solid #3b82f6' : '4px solid #8b5cf6',
                  borderRadius: 'var(--border-radius-md)',
                  padding: 'var(--spacing-lg)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: '700', color: 'var(--color-heading)', margin: 0 }}>
                      Sprint {sprint.number}: {sprint.name}
                    </h3>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 'var(--spacing-xs) 0 0' }}>
                      {sprint.period}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                      {sprint.status === 'COMPLETED' && (
                        <>
                          <CheckCircle2 style={{ width: '20px', height: '20px', color: '#10B981' }} />
                          <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: '700', color: '#10B981' }}>✅ COMPLETED</span>
                        </>
                      )}
                      {sprint.status === 'IN PROGRESS' && (
                        <>
                          <Clock style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
                          <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: '700', color: '#3b82f6' }}>🟢 IN PROGRESS</span>
                        </>
                      )}
                      {sprint.status === 'PLANNED' && (
                        <>
                          <AlertCircle style={{ width: '20px', height: '20px', color: '#8b5cf6' }} />
                          <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: '700', color: '#8b5cf6' }}>🟡 PLANNED</span>
                        </>
                      )}
                    </div>
                    <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700', color: 'var(--color-heading)', margin: 0 }}>
                      {sprint.completion}%
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ height: '6px', backgroundColor: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden', marginBottom: 'var(--spacing-md)' }}>
                  <div style={{ width: `${sprint.completion}%`, height: '100%', backgroundColor: sprint.status === 'COMPLETED' ? '#10B981' : sprint.status === 'IN PROGRESS' ? '#3b82f6' : '#8b5cf6' }} />
                </div>

                {/* Sprint Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                  <div>
                    <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: '600', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-xs)' }}>
                      Tasks
                    </p>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-heading)', fontWeight: '600', margin: 0 }}>
                      {sprint.completed ? `${sprint.completed}/${sprint.tasks}` : sprint.tasks}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: '600', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-xs)' }}>
                      Key Deliverables
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                      {sprint.deliverables.map((deliverable, i) => (
                        <span key={i} style={{
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--color-heading)',
                          backgroundColor: 'white',
                          padding: 'var(--spacing-xs) var(--spacing-sm)',
                          borderRadius: '12px',
                          border: '1px solid var(--color-border)',
                        }}>
                          {deliverable}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sprint 16 Final Status */}
        <div style={{
          backgroundColor: '#F0F9FF',
          border: '2px solid #3b82f6',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-2xl)',
        }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700', color: '#1e40af', margin: '0 0 var(--spacing-lg)' }}>
            📌 Sprint 16 Current Status
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2xl)' }}>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: '600', color: '#1e40af', margin: 0, marginBottom: 'var(--spacing-md)', textTransform: 'uppercase' }}>
                Pending Tasks
              </p>
              {sprint16Status.pendingTasks.length > 0 ? (
                sprint16Status.pendingTasks.map(task => (
                  <div key={task.id} style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--border-radius-md)',
                    padding: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-sm)',
                    borderLeft: '4px solid #F59E0B',
                  }}>
                    <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', color: 'var(--color-heading)', margin: 0 }}>
                      {task.title}
                    </p>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 'var(--spacing-xs) 0 0' }}>
                      ⏱ {task.hoursRemaining}h remaining • Status: {task.status}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: 'var(--font-size-sm)', color: '#10B981', fontWeight: '600' }}>
                  ✅ All critical tasks complete
                </p>
              )}
            </div>

            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: '600', color: '#1e40af', margin: 0, marginBottom: 'var(--spacing-md)', textTransform: 'uppercase' }}>
                Key Metrics
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                {Object.entries(sprint16Status.metrics).map(([key, value]) => (
                  <div key={key}>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-xs)' }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </p>
                    <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '700', color: '#1e40af', margin: 0 }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sprint 17 Readiness */}
        <div style={{
          backgroundColor: '#F5F3FF',
          border: '2px solid #8b5cf6',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
        }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700', color: '#6B21A8', margin: '0 0 var(--spacing-lg)' }}>
            🚀 Sprint 17 Readiness Check
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 'var(--spacing-lg)' }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: 'var(--border-radius-md)',
              padding: 'var(--spacing-lg)',
              textAlign: 'center',
              borderTop: '4px solid #10B981',
            }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', fontWeight: '600', margin: 0 }}>STATUS</p>
              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '700', color: '#10B981', margin: 'var(--spacing-sm) 0 0' }}>
                {sprint17Readiness.status}
              </p>
            </div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: 'var(--border-radius-md)',
              padding: 'var(--spacing-lg)',
              textAlign: 'center',
              borderTop: '4px solid #3b82f6',
            }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', fontWeight: '600', margin: 0 }}>START DATE</p>
              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '700', color: '#3b82f6', margin: 'var(--spacing-sm) 0 0' }}>
                {sprint17Readiness.startDate}
              </p>
            </div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: 'var(--border-radius-md)',
              padding: 'var(--spacing-lg)',
              textAlign: 'center',
              borderTop: '4px solid #F59E0B',
            }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', fontWeight: '600', margin: 0 }}>TASKS</p>
              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '700', color: '#F59E0B', margin: 'var(--spacing-sm) 0 0' }}>
                {sprint17Readiness.criticalTasks + sprint17Readiness.highPriorityTasks + 9}
              </p>
            </div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: 'var(--border-radius-md)',
              padding: 'var(--spacing-lg)',
              textAlign: 'center',
              borderTop: '4px solid #8b5cf6',
            }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', fontWeight: '600', margin: 0 }}>EFFORT</p>
              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '700', color: '#8b5cf6', margin: 'var(--spacing-sm) 0 0' }}>
                {sprint17Readiness.totalEffort}
              </p>
            </div>
          </div>

          <div style={{ marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-lg)', backgroundColor: 'white', borderRadius: 'var(--border-radius-md)' }}>
            <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: '600', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-md)', textTransform: 'uppercase' }}>
              Key Features
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
              {sprint17Readiness.keyFeatures.map((feature, idx) => (
                <span key={idx} style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: '600',
                  color: '#6B21A8',
                  backgroundColor: '#F5F3FF',
                  padding: 'var(--spacing-xs) var(--spacing-md)',
                  borderRadius: '12px',
                  border: '1px solid #8b5cf6',
                }}>
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}