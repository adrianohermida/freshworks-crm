import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Users, BarChart3, Zap, Target } from 'lucide-react';

export default function Sprint16ExecutionPlan() {
  const [expandedTask, setExpandedTask] = useState(null);

  const sprint16Plan = {
    name: 'Sprint 16: Post-Launch Support & Optimization',
    status: 'ACTIVE',
    timeline: '2026-03-13 to 2026-03-20 (8 days)',
    focus: 'Bug fixes, user feedback implementation, performance tuning',
    totalTasks: 12,
    completedTasks: 0,
    completionPercentage: 0,
    tasks: [
      {
        id: 1,
        priority: 'CRITICAL',
        category: 'Bug Fixes',
        icon: AlertCircle,
        title: 'Fix Reported User Issues',
        description: 'Address critical bugs reported by 147 active users',
        subtasks: [
          'Login timeout issue (23 reports)',
          'Process export formatting (12 reports)',
          'Deadline notification delay (8 reports)',
          'Calendar sync conflicts (5 reports)',
        ],
        estimatedHours: 12,
        assigned: 'Backend Team',
      },
      {
        id: 2,
        priority: 'HIGH',
        category: 'Performance',
        icon: BarChart3,
        title: 'Performance Tuning',
        description: 'Optimize slow operations, reduce page load times',
        subtasks: [
          'Dashboard load time optimization',
          'Process list pagination optimization',
          'Calendar sync performance improvement',
          'Image lazy loading implementation',
        ],
        estimatedHours: 10,
        assigned: 'Frontend Team',
      },
      {
        id: 3,
        priority: 'HIGH',
        category: 'User Feedback',
        icon: Users,
        title: 'Implement User Feedback',
        description: 'Prioritize and implement top user-requested features',
        subtasks: [
          'Dark mode refinement (18 requests)',
          'Process filtering improvements (15 requests)',
          'Bulk actions for deadlines (12 requests)',
          'Custom notifications preferences (10 requests)',
        ],
        estimatedHours: 14,
        assigned: 'Product Team',
      },
      {
        id: 4,
        priority: 'MEDIUM',
        category: 'Analytics',
        icon: BarChart3,
        title: 'Analytics & Insights',
        description: 'Analyze usage patterns, create dashboards',
        subtasks: [
          'User behavior analytics setup',
          'Feature usage tracking',
          'Performance dashboards creation',
          'Weekly usage reports automation',
        ],
        estimatedHours: 8,
        assigned: 'Analytics Team',
      },
      {
        id: 5,
        priority: 'MEDIUM',
        category: 'Documentation',
        icon: Target,
        title: 'User Documentation Updates',
        description: 'Update docs based on user feedback and new features',
        subtasks: [
          'FAQ expansion (20 new questions)',
          'Video tutorials creation (4 videos)',
          'Troubleshooting guide updates',
          'API documentation improvements',
        ],
        estimatedHours: 8,
        assigned: 'Documentation Team',
      },
      {
        id: 6,
        priority: 'MEDIUM',
        category: 'Testing',
        icon: CheckCircle2,
        title: 'Regression Testing',
        description: 'Comprehensive testing of bug fixes and changes',
        subtasks: [
          'Manual regression test suite',
          'Automated test coverage expansion',
          'Integration test updates',
          'UAT validation with users',
        ],
        estimatedHours: 10,
        assigned: 'QA Team',
      },
      {
        id: 7,
        priority: 'MEDIUM',
        category: 'Infrastructure',
        icon: Zap,
        title: 'Infrastructure Monitoring',
        description: 'Fine-tune monitoring, add alerts, optimize resources',
        subtasks: [
          'CPU/Memory optimization',
          'Database index analysis',
          'Cache strategy refinement',
          'Cost optimization review',
        ],
        estimatedHours: 8,
        assigned: 'DevOps Team',
      },
      {
        id: 8,
        priority: 'LOW',
        category: 'Nice-to-Have',
        icon: Zap,
        title: 'UI/UX Refinements',
        description: 'Polish UI based on user experience data',
        subtasks: [
          'Button/interaction refinement',
          'Color scheme adjustments',
          'Mobile experience improvements',
          'Accessibility enhancements',
        ],
        estimatedHours: 8,
        assigned: 'Design Team',
      },
      {
        id: 9,
        priority: 'LOW',
        category: 'Feature',
        icon: Target,
        title: 'Quick Wins Implementation',
        description: 'Implement easy, high-impact features',
        subtasks: [
          'Export to PDF functionality',
          'Process templates',
          'Quick filters shortcuts',
          'Email notifications improvements',
        ],
        estimatedHours: 6,
        assigned: 'Frontend Team',
      },
      {
        id: 10,
        priority: 'LOW',
        category: 'Integration',
        icon: Zap,
        title: 'Third-party Integration Updates',
        description: 'Update and optimize existing integrations',
        subtasks: [
          'Google Workspace integration refinement',
          'Slack integration enhancement',
          'Webhook reliability improvements',
          'Rate limiting adjustments',
        ],
        estimatedHours: 6,
        assigned: 'Integration Team',
      },
      {
        id: 11,
        priority: 'LOW',
        category: 'Compliance',
        icon: Target,
        title: 'Compliance & Security Review',
        description: 'Maintain compliance, address security findings',
        subtasks: [
          'LGPD audit follow-up',
          'Data retention policy review',
          'Privacy policy updates',
          'Security patch deployment',
        ],
        estimatedHours: 6,
        assigned: 'Security Team',
      },
      {
        id: 12,
        priority: 'LOW',
        category: 'Roadmap',
        icon: Target,
        title: 'Sprint 17 Planning',
        description: 'Plan advanced features for next sprint',
        subtasks: [
          'Roadmap review with stakeholders',
          'Feature estimation for Sprint 17',
          'Resource allocation planning',
          'Dependency analysis',
        ],
        estimatedHours: 4,
        assigned: 'Leadership',
      },
    ],
  };

  const priorityColors = {
    CRITICAL: '#EF4444',
    HIGH: '#F59E0B',
    MEDIUM: '#3b82f6',
    LOW: '#8b5cf6',
  };

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-lg)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
            🚀 {sprint16Plan.name}
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 'var(--spacing-sm) 0 0' }}>
            {sprint16Plan.timeline} • {sprint16Plan.focus}
          </p>
        </div>

        {/* Sprint Overview */}
        <div style={{
          backgroundColor: 'white',
          border: '2px solid #3b82f6',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-2xl)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-2xl)' }}>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', fontWeight: '600', margin: 0 }}>
                STATUS
              </p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: '#3b82f6', margin: 'var(--spacing-sm) 0 0' }}>
                🟢 ACTIVE
              </p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', fontWeight: '600', margin: 0 }}>
                PROGRESS
              </p>
              <div style={{ marginTop: 'var(--spacing-sm)' }}>
                <div style={{ height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden', marginBottom: 'var(--spacing-sm)' }}>
                  <div style={{ width: '0%', height: '100%', backgroundColor: '#3b82f6' }} />
                </div>
                <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '700', color: 'var(--color-heading)', margin: 0 }}>
                  0%
                </p>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', fontWeight: '600', margin: 0 }}>
                TASKS
              </p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: '#3b82f6', margin: 'var(--spacing-sm) 0 0' }}>
                0/12
              </p>
            </div>
          </div>
        </div>

        {/* Tasks by Priority */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
        }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700', color: 'var(--color-heading)', margin: '0 0 var(--spacing-lg)' }}>
            📋 Sprint Tasks
          </h2>

          <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
            {sprint16Plan.tasks.map(task => {
              const Icon = task.icon;
              const isExpanded = expandedTask === task.id;

              return (
                <div key={task.id}>
                  <div
                    onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                    style={{
                      backgroundColor: 'var(--color-light)',
                      borderLeft: `4px solid ${priorityColors[task.priority]}`,
                      borderRadius: 'var(--border-radius-md)',
                      padding: 'var(--spacing-lg)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-md)',
                    }}
                  >
                    <Icon style={{ width: '20px', height: '20px', color: priorityColors[task.priority], flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: '700', color: 'var(--color-heading)', margin: 0 }}>
                        {task.title}
                      </h3>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 'var(--spacing-xs) 0 0' }}>
                        {task.description}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                      <span style={{
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: '600',
                        color: priorityColors[task.priority],
                        backgroundColor: task.priority === 'CRITICAL' ? '#FEE2E2' : task.priority === 'HIGH' ? '#FEF3C7' : task.priority === 'MEDIUM' ? '#EFF6FF' : '#F5F3FF',
                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                        borderRadius: '12px',
                      }}>
                        {task.priority}
                      </span>
                      <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: '600', color: 'var(--color-body)' }}>
                        ⏱ {task.estimatedHours}h
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{
                      backgroundColor: 'white',
                      borderLeft: `4px solid ${priorityColors[task.priority]}`,
                      borderRadius: '0 0 var(--border-radius-md) var(--border-radius-md)',
                      padding: 'var(--spacing-lg)',
                      marginTop: '-1px',
                      borderTop: 'none',
                    }}>
                      <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: '600', color: 'var(--color-body)', margin: '0 0 var(--spacing-md)', textTransform: 'uppercase' }}>
                        Subtasks
                      </p>
                      <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)' }}>
                        {task.subtasks.map((subtask, idx) => (
                          <li key={idx} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', marginBottom: 'var(--spacing-xs)' }}>
                            ☐ {subtask}
                          </li>
                        ))}
                      </ul>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 'var(--spacing-lg) 0 0', fontWeight: '600', fontStyle: 'italic' }}>
                        👤 Assigned to: {task.assigned}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div style={{
          marginTop: 'var(--spacing-2xl)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: 'var(--spacing-lg)',
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-lg)',
            textAlign: 'center',
            borderTop: `4px solid ${priorityColors.CRITICAL}`,
          }}>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', fontWeight: '600', margin: 0 }}>
              CRITICAL
            </p>
            <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: priorityColors.CRITICAL, margin: 'var(--spacing-sm) 0 0' }}>
              1
            </p>
          </div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-lg)',
            textAlign: 'center',
            borderTop: `4px solid ${priorityColors.HIGH}`,
          }}>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', fontWeight: '600', margin: 0 }}>
              HIGH
            </p>
            <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: priorityColors.HIGH, margin: 'var(--spacing-sm) 0 0' }}>
              2
            </p>
          </div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-lg)',
            textAlign: 'center',
            borderTop: `4px solid ${priorityColors.MEDIUM}`,
          }}>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', fontWeight: '600', margin: 0 }}>
              MEDIUM
            </p>
            <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: priorityColors.MEDIUM, margin: 'var(--spacing-sm) 0 0' }}>
              4
            </p>
          </div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-lg)',
            textAlign: 'center',
            borderTop: `4px solid ${priorityColors.LOW}`,
          }}>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', fontWeight: '600', margin: 0 }}>
              LOW
            </p>
            <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: priorityColors.LOW, margin: 'var(--spacing-sm) 0 0' }}>
              5
            </p>
          </div>
        </div>

        {/* Total Effort */}
        <div style={{
          marginTop: 'var(--spacing-lg)',
          padding: 'var(--spacing-lg)',
          backgroundColor: '#F0F9FF',
          borderLeft: '4px solid #3b82f6',
          borderRadius: 'var(--border-radius-md)',
        }}>
          <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', color: '#1e40af', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
            📊 Sprint 16 Effort
          </p>
          <p style={{ fontSize: 'var(--font-size-sm)', color: '#1e40af', margin: 0 }}>
            <strong>Total: 100 estimated hours</strong> across 12 tasks • 1 CRITICAL (bug fixes), 2 HIGH (perf + feedback), 4 MEDIUM, 5 LOW • Expected completion: 2026-03-20
          </p>
        </div>
      </div>
    </div>
  );
}