import React, { useState } from 'react';
import { Brain, Zap, BarChart3, Share2, Cpu, Target } from 'lucide-react';

export default function Sprint17ExecutionMaster() {
  const [expandedTask, setExpandedTask] = useState(null);

  const sprint17 = {
    name: 'Sprint 17: Advanced Features Phase 1',
    status: 'PLANNED',
    timeline: '2026-03-21 to 2026-04-03 (14 days)',
    focus: 'Power user features & advanced capabilities',
    totalTasks: 15,
    completedTasks: 0,
    completionPercentage: 0,
    estimatedTotalHours: 140,
    kickoffDate: '2026-03-21',
    tasks: [
      {
        id: 1,
        priority: 'CRITICAL',
        category: 'Core Feature',
        icon: Brain,
        title: 'Advanced Search & Filtering',
        description: 'Multi-field search, saved filters, full-text indexing',
        subtasks: [
          'Elasticsearch integration',
          'Advanced filter UI builder',
          'Save/load filter presets',
          'Search history tracking',
          'Full-text indexing implementation',
        ],
        estimatedHours: 20,
        dependencies: [],
        team: 'Backend + Frontend',
      },
      {
        id: 2,
        priority: 'CRITICAL',
        category: 'AI Features',
        icon: Brain,
        title: 'AI-Powered Process Insights',
        description: 'ML predictions, anomaly detection, recommendations',
        subtasks: [
          'ML model integration (TensorFlow.js)',
          'Process pattern analysis',
          'Risk prediction engine',
          'Recommendation algorithm',
          'Insight dashboard UI',
        ],
        estimatedHours: 24,
        dependencies: [],
        team: 'AI/ML + Frontend',
      },
      {
        id: 3,
        priority: 'CRITICAL',
        category: 'Automation',
        icon: Zap,
        title: 'Custom Workflow Automation',
        description: 'Drag-drop workflow builder, custom rules engine',
        subtasks: [
          'Workflow builder UI (drag-drop)',
          'Rule engine implementation',
          'Trigger/action system',
          'Conditional logic builder',
          'Workflow templates library',
        ],
        estimatedHours: 22,
        dependencies: ['id1'],
        team: 'Backend + Frontend',
      },
      {
        id: 4,
        priority: 'HIGH',
        category: 'Collaboration',
        icon: Share2,
        title: 'Real-time Collaboration',
        description: 'Live editing, comments, @mentions, activity feed',
        subtasks: [
          'WebSocket real-time sync',
          'Comment system implementation',
          'Activity feed service',
          'Notification for mentions',
          'Collaborative editing UI',
        ],
        estimatedHours: 18,
        dependencies: [],
        team: 'Backend + Frontend',
      },
      {
        id: 5,
        priority: 'HIGH',
        category: 'Analytics',
        icon: BarChart3,
        title: 'Advanced Reporting & Analytics',
        description: 'Custom reports, data visualization, export formats',
        subtasks: [
          'Report builder (SQL query)',
          'Chart customization (15+ chart types)',
          'Data visualization library',
          'Export to PDF/Excel/CSV',
          'Scheduled report emails',
        ],
        estimatedHours: 18,
        dependencies: [],
        team: 'Backend + Frontend',
      },
      {
        id: 6,
        priority: 'HIGH',
        category: 'Performance',
        icon: Cpu,
        title: 'Advanced Caching & CDN',
        description: 'Intelligent caching, edge computing, optimization',
        subtasks: [
          'Redis cache strategy',
          'Query result caching',
          'Static asset CDN optimization',
          'Service Worker improvements',
          'Cache invalidation strategy',
        ],
        estimatedHours: 12,
        dependencies: [],
        team: 'DevOps + Backend',
      },
      {
        id: 7,
        priority: 'MEDIUM',
        category: 'Feature',
        icon: Target,
        title: 'Process Templates & Presets',
        description: 'Pre-built process templates, customizable presets',
        subtasks: [
          'Template library UI',
          'Template editor',
          'Process duplication',
          'Template sharing & marketplace',
          'Version control for templates',
        ],
        estimatedHours: 10,
        dependencies: ['id1'],
        team: 'Frontend',
      },
      {
        id: 8,
        priority: 'MEDIUM',
        category: 'Feature',
        icon: Target,
        title: 'Bulk Operations & Automation',
        description: 'Batch processing, scheduled tasks, API automation',
        subtasks: [
          'Bulk action queue system',
          'Scheduled task runner',
          'API endpoint for automation',
          'Batch status tracking',
          'Error handling & retries',
        ],
        estimatedHours: 8,
        dependencies: ['id3'],
        team: 'Backend',
      },
      {
        id: 9,
        priority: 'MEDIUM',
        category: 'Integration',
        icon: Share2,
        title: 'Webhook & API Enhancements',
        description: 'Custom webhooks, rate limiting, versioning',
        subtasks: [
          'Webhook management UI',
          'API versioning (v1, v2)',
          'Rate limiting per API key',
          'Webhook retry logic',
          'API documentation auto-generation',
        ],
        estimatedHours: 12,
        dependencies: [],
        team: 'Backend',
      },
      {
        id: 10,
        priority: 'MEDIUM',
        category: 'Security',
        icon: Target,
        title: 'Advanced Access Control',
        description: 'Role-based access, field-level permissions, audit logs',
        subtasks: [
          'RBAC system enhancement',
          'Field-level permission engine',
          'Fine-grained audit logging',
          'Data masking for roles',
          'Permission inheritance',
        ],
        estimatedHours: 10,
        dependencies: [],
        team: 'Backend + Security',
      },
      {
        id: 11,
        priority: 'MEDIUM',
        category: 'Feature',
        icon: Target,
        title: 'Mobile App PWA Enhancements',
        description: 'Offline capability, push notifications, app shell',
        subtasks: [
          'Service Worker offline mode',
          'Push notification setup',
          'App shell architecture',
          'Mobile home screen install',
          'Offline data sync on reconnect',
        ],
        estimatedHours: 10,
        dependencies: [],
        team: 'Frontend + DevOps',
      },
      {
        id: 12,
        priority: 'LOW',
        category: 'Enhancement',
        icon: Zap,
        title: 'Performance Benchmarking',
        description: 'Load testing v2, stress tests, capacity planning',
        subtasks: [
          'Load testing setup (5000+ users)',
          'Performance regression detection',
          'Capacity planning report',
          'Bottleneck identification',
          'Optimization recommendations',
        ],
        estimatedHours: 8,
        dependencies: [],
        team: 'DevOps + Backend',
      },
      {
        id: 13,
        priority: 'LOW',
        category: 'Enhancement',
        icon: Target,
        title: 'Internationalization (i18n)',
        description: 'Multi-language support, regional settings',
        subtasks: [
          'i18n framework setup (i18next)',
          'UI translation to 5 languages',
          'Regional date/currency formatting',
          'RTL language support',
          'Translation management workflow',
        ],
        estimatedHours: 12,
        dependencies: [],
        team: 'Frontend + Localization',
      },
      {
        id: 14,
        priority: 'LOW',
        category: 'Enhancement',
        icon: BarChart3,
        title: 'Advanced Notifications',
        description: 'Smart alerts, notification channels, do-not-disturb',
        subtasks: [
          'Notification scheduling',
          'Multi-channel delivery (email/SMS/push)',
          'User quiet hours (do-not-disturb)',
          'Notification grouping',
          'Smart digest generation',
        ],
        estimatedHours: 8,
        dependencies: [],
        team: 'Backend + Frontend',
      },
      {
        id: 15,
        priority: 'LOW',
        category: 'Planning',
        icon: Target,
        title: 'Sprint 18 Planning',
        description: 'Mobile app launch preparation',
        subtasks: [
          'Mobile roadmap finalization',
          'Native app architecture design',
          'iOS/Android feature parity plan',
          'Resource allocation for mobile',
          'Stakeholder alignment',
        ],
        estimatedHours: 6,
        dependencies: [],
        team: 'Leadership + Product',
      },
    ],
  };

  const priorityColors = {
    CRITICAL: { bg: '#FEE2E2', border: '#EF4444', text: '#DC2626' },
    HIGH: { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
    MEDIUM: { bg: '#EFF6FF', border: '#3b82f6', text: '#1e40af' },
    LOW: { bg: '#F5F3FF', border: '#8b5cf6', text: '#6B21A8' },
  };

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-lg)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
            🚀 {sprint17.name}
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 'var(--spacing-sm) 0 0' }}>
            {sprint17.timeline} • Kickoff: {sprint17.kickoffDate} • {sprint17.focus}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 'var(--spacing-2xl)' }}>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', fontWeight: '600', margin: 0 }}>STATUS</p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: '#3b82f6', margin: 'var(--spacing-sm) 0 0' }}>
                🟡 PLANNED
              </p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', fontWeight: '600', margin: 0 }}>PROGRESS</p>
              <div style={{ marginTop: 'var(--spacing-sm)' }}>
                <div style={{ height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '0%', height: '100%', backgroundColor: '#3b82f6' }} />
                </div>
                <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '700', margin: 'var(--spacing-xs) 0 0' }}>0%</p>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', fontWeight: '600', margin: 0 }}>TASKS</p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: '#3b82f6', margin: 'var(--spacing-sm) 0 0' }}>
                0/15
              </p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', fontWeight: '600', margin: 0 }}>EFFORT</p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: '#3b82f6', margin: 'var(--spacing-sm) 0 0' }}>
                {sprint17.estimatedTotalHours}h
              </p>
            </div>
          </div>
        </div>

        {/* Task Distribution */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700', color: 'var(--color-heading)', margin: '0 0 var(--spacing-lg)' }}>
            📋 Sprint Tasks ({sprint17.totalTasks} total)
          </h2>

          {/* Task List */}
          <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
            {sprint17.tasks.map(task => {
              const Icon = task.icon;
              const colors = priorityColors[task.priority];
              const isExpanded = expandedTask === task.id;

              return (
                <div key={task.id}>
                  <div
                    onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                    style={{
                      backgroundColor: colors.bg,
                      borderLeft: `4px solid ${colors.border}`,
                      borderRadius: 'var(--border-radius-md)',
                      padding: 'var(--spacing-lg)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-md)',
                    }}
                  >
                    <Icon style={{ width: '20px', height: '20px', color: colors.border, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: '700', color: 'var(--color-heading)', margin: 0 }}>
                        {task.id}. {task.title}
                      </h3>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 'var(--spacing-xs) 0 0' }}>
                        {task.description}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                      <span style={{
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: '600',
                        color: colors.text,
                        backgroundColor: colors.bg,
                        border: `1px solid ${colors.border}`,
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
                      borderLeft: `4px solid ${colors.border}`,
                      borderRadius: '0 0 var(--border-radius-md) var(--border-radius-md)',
                      padding: 'var(--spacing-lg)',
                      marginTop: '-1px',
                      borderTop: 'none',
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-lg)' }}>
                        <div>
                          <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: '600', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                            Subtasks
                          </p>
                          <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)' }}>
                            {task.subtasks.map((subtask, idx) => (
                              <li key={idx} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', marginBottom: 'var(--spacing-xs)' }}>
                                ☐ {subtask}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: '600', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                            Team
                          </p>
                          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-heading)', fontWeight: '600', margin: 0 }}>
                            {task.team}
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: '600', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                            Dependencies
                          </p>
                          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-heading)', margin: 0 }}>
                            {task.dependencies.length === 0 ? 'None' : `Task(s) ${task.dependencies.join(', ')}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-lg)',
        }}>
          <div style={{
            backgroundColor: priorityColors.CRITICAL.bg,
            borderLeft: `4px solid ${priorityColors.CRITICAL.border}`,
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-lg)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 'var(--font-size-xs)', color: priorityColors.CRITICAL.text, fontWeight: '600', margin: 0 }}>CRITICAL</p>
            <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: priorityColors.CRITICAL.text, margin: 'var(--spacing-sm) 0 0' }}>2</p>
          </div>
          <div style={{
            backgroundColor: priorityColors.HIGH.bg,
            borderLeft: `4px solid ${priorityColors.HIGH.border}`,
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-lg)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 'var(--font-size-xs)', color: priorityColors.HIGH.text, fontWeight: '600', margin: 0 }}>HIGH</p>
            <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: priorityColors.HIGH.text, margin: 'var(--spacing-sm) 0 0' }}>4</p>
          </div>
          <div style={{
            backgroundColor: priorityColors.MEDIUM.bg,
            borderLeft: `4px solid ${priorityColors.MEDIUM.border}`,
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-lg)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 'var(--font-size-xs)', color: priorityColors.MEDIUM.text, fontWeight: '600', margin: 0 }}>MEDIUM</p>
            <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: priorityColors.MEDIUM.text, margin: 'var(--spacing-sm) 0 0' }}>5</p>
          </div>
          <div style={{
            backgroundColor: priorityColors.LOW.bg,
            borderLeft: `4px solid ${priorityColors.LOW.border}`,
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-lg)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 'var(--font-size-xs)', color: priorityColors.LOW.text, fontWeight: '600', margin: 0 }}>LOW</p>
            <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: priorityColors.LOW.text, margin: 'var(--spacing-sm) 0 0' }}>4</p>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{
          padding: 'var(--spacing-lg)',
          backgroundColor: '#EFF6FF',
          borderLeft: '4px solid #3b82f6',
          borderRadius: 'var(--border-radius-md)',
        }}>
          <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', color: '#1e40af', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
            📊 Sprint 17 Overview
          </p>
          <p style={{ fontSize: 'var(--font-size-sm)', color: '#1e40af', margin: 0 }}>
            <strong>15 tasks, 140 hours, 14 days</strong> • Focus: Advanced features for power users • 2 critical AI/search features, 4 high-priority integrations/collaboration, 5 medium enhancements, 4 low-priority improvements • Launch Timeline: Sprint 18 (Mobile App) follows immediately after
          </p>
        </div>
      </div>
    </div>
  );
}