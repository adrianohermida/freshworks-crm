import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, RefreshCw, BarChart3, Palette } from 'lucide-react';
import Card from '@/components/aetherlab/Card';

export default function AetherLabDesignAudit() {
  const [expandedPhase, setExpandedPhase] = useState(1);

  const auditData = {
    overallCompletion: 35,
    componentsCovered: 8,
    componentsTotal: 12,
    areasToRefactor: 8
  };

  const componentAudit = [
    {
      id: 1,
      name: 'Button',
      status: 'implemented',
      coverage: 100,
      location: '@/components/aetherlab/Button',
      usage: 'Partially (line 98-105)',
      issues: []
    },
    {
      id: 2,
      name: 'Card',
      status: 'implemented',
      coverage: 100,
      location: '@/components/aetherlab/Card',
      usage: 'Partially (lines 115-139)',
      issues: ['Used with inline padding, should use Card props']
    },
    {
      id: 3,
      name: 'Input',
      status: 'implemented',
      coverage: 100,
      location: '@/components/aetherlab/Input',
      usage: 'Yes (line 161-166)',
      issues: []
    },
    {
      id: 4,
      name: 'Tabs',
      status: 'shadcn/ui',
      coverage: 80,
      location: '@/components/ui/tabs',
      usage: 'Yes (lines 142-156)',
      issues: ['Should wrap with Aetherlab Tab wrapper for consistency']
    },
    {
      id: 5,
      name: 'Loading State',
      status: 'partial',
      coverage: 50,
      location: 'Inline styling',
      usage: 'Partial (line 172-174)',
      issues: ['Use Aetherlab Spinner component instead']
    },
    {
      id: 6,
      name: 'Empty State',
      status: 'partial',
      coverage: 40,
      location: 'Inline styling',
      usage: 'Partial (line 177-180)',
      issues: ['Create dedicated EmptyState component']
    },
    {
      id: 7,
      name: 'Color Tokens',
      status: 'implemented',
      coverage: 100,
      location: 'CSS variables (globals.css)',
      usage: 'Yes',
      issues: []
    },
    {
      id: 8,
      name: 'Typography',
      status: 'implemented',
      coverage: 100,
      location: 'CSS variables',
      usage: 'Yes',
      issues: []
    },
    {
      id: 9,
      name: 'Spacing',
      status: 'implemented',
      coverage: 100,
      location: 'CSS variables',
      usage: 'Yes',
      issues: []
    },
    {
      id: 10,
      name: 'Badge',
      status: 'not_used',
      coverage: 0,
      location: '@/components/aetherlab/Badge',
      usage: 'No',
      issues: ['Could be used for sync status indicators']
    },
    {
      id: 11,
      name: 'Alert/Notification',
      status: 'not_used',
      coverage: 0,
      location: '@/components/aetherlab/Alert',
      usage: 'No',
      issues: ['Missing for error/success messages']
    },
    {
      id: 12,
      name: 'Divider',
      status: 'not_used',
      coverage: 0,
      location: '@/components/aetherlab/Divider',
      usage: 'No',
      issues: ['Could improve section separation']
    }
  ];

  const refactoringPhases = [
    {
      id: 1,
      phase: 'Phase 1: Core Components',
      duration: '2-3 days',
      effort: '5d',
      priority: 'CRITICAL',
      tasks: [
        {
          id: 1,
          title: 'Remove inline Card padding, use Card variant props',
          status: 'pending',
          lines: '115-139',
          impact: 'high',
          complexity: 'low'
        },
        {
          id: 2,
          title: 'Replace inline RefreshCw spinner with Aetherlab Spinner',
          status: 'pending',
          lines: '172-174',
          impact: 'medium',
          complexity: 'low'
        },
        {
          id: 3,
          title: 'Create EmptyState component for Dashboard',
          status: 'pending',
          lines: '177-180',
          impact: 'medium',
          complexity: 'medium'
        },
        {
          id: 4,
          title: 'Wrap TabsList with Aetherlab Tab wrapper',
          status: 'pending',
          lines: '142-156',
          impact: 'high',
          complexity: 'medium'
        }
      ]
    },
    {
      id: 2,
      phase: 'Phase 2: Advanced Components',
      duration: '2-3 days',
      effort: '5d',
      priority: 'HIGH',
      tasks: [
        {
          id: 1,
          title: 'Add Badge component for sync status (lines 160-225)',
          status: 'pending',
          lines: 'ProcessCard',
          impact: 'high',
          complexity: 'medium'
        },
        {
          id: 2,
          title: 'Implement Alert component for errors/success',
          status: 'pending',
          lines: 'Add to tabs',
          impact: 'medium',
          complexity: 'low'
        },
        {
          id: 3,
          title: 'Add Divider components between sections',
          status: 'pending',
          lines: '108-140, 157-195',
          impact: 'low',
          complexity: 'low'
        },
        {
          id: 4,
          title: 'Implement Tooltip for metric cards',
          status: 'pending',
          lines: '115-138',
          impact: 'medium',
          complexity: 'medium'
        }
      ]
    },
    {
      id: 3,
      phase: 'Phase 3: Styling & Polish',
      duration: '1-2 days',
      effort: '3d',
      priority: 'MEDIUM',
      tasks: [
        {
          id: 1,
          title: 'Apply consistent spacing throughout',
          status: 'pending',
          lines: 'All',
          impact: 'high',
          complexity: 'low'
        },
        {
          id: 2,
          title: 'Ensure all color tokens use CSS variables',
          status: 'pending',
          lines: 'All',
          impact: 'high',
          complexity: 'low'
        },
        {
          id: 3,
          title: 'Add hover states to interactive elements',
          status: 'pending',
          lines: '98-105, 184-191',
          impact: 'medium',
          complexity: 'medium'
        },
        {
          id: 4,
          title: 'Implement responsive design tweaks',
          status: 'pending',
          lines: 'All',
          impact: 'medium',
          complexity: 'medium'
        }
      ]
    },
    {
      id: 4,
      phase: 'Phase 4: Testing & Validation',
      duration: '1 day',
      effort: '2d',
      priority: 'HIGH',
      tasks: [
        {
          id: 1,
          title: 'Visual regression testing',
          status: 'pending',
          lines: 'All',
          impact: 'high',
          complexity: 'medium'
        },
        {
          id: 2,
          title: 'Component interaction testing',
          status: 'pending',
          lines: 'All',
          impact: 'high',
          complexity: 'medium'
        },
        {
          id: 3,
          title: 'Accessibility audit (WCAG 2.1)',
          status: 'pending',
          lines: 'All',
          impact: 'high',
          complexity: 'high'
        },
        {
          id: 4,
          title: 'Performance metrics review',
          status: 'pending',
          lines: 'All',
          impact: 'medium',
          complexity: 'low'
        }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'implemented': return 'var(--color-success)';
      case 'partial': return 'var(--color-warning)';
      case 'shadcn/ui': return 'var(--color-info)';
      case 'not_used': return 'var(--color-error)';
      default: return 'var(--color-border)';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'implemented': return '✅ Implemented';
      case 'partial': return '⚠️ Partial';
      case 'shadcn/ui': return 'ℹ️ shadcn/ui';
      case 'not_used': return '❌ Not Used';
      default: return 'Unknown';
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-xl)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
            <div style={{
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--color-primary)',
              borderRadius: 'var(--border-radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Palette style={{ width: '24px', height: '24px', color: 'var(--color-white)' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                🎨 Aetherlab Design System Audit
              </h1>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: '0.5rem 0 0 0' }}>
                Dashboard Component Coverage & Refactoring Plan
              </p>
            </div>
          </div>

          {/* AUDIT METRICS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-2xl)'
          }}>
            <Card variant="elevated">
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                Overall Coverage
              </p>
              <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', margin: 0 }}>
                {auditData.overallCompletion}%
              </p>
              <div style={{
                height: '4px',
                backgroundColor: 'var(--color-border)',
                borderRadius: '2px',
                marginTop: 'var(--spacing-md)',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  backgroundColor: 'var(--color-primary)',
                  width: `${auditData.overallCompletion}%`
                }} />
              </div>
            </Card>

            <Card variant="elevated">
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                Components Used
              </p>
              <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)', margin: 0 }}>
                {auditData.componentsCovered}/{auditData.componentsTotal}
              </p>
            </Card>

            <Card variant="elevated">
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                Areas To Fix
              </p>
              <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)', margin: 0 }}>
                {auditData.areasToRefactor}
              </p>
            </Card>

            <Card variant="elevated">
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                Effort Needed
              </p>
              <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info)', margin: 0 }}>
                15d
              </p>
            </Card>
          </div>
        </div>

        {/* COMPONENT AUDIT */}
        <Card variant="elevated" style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
            📋 Component Audit ({auditData.componentsCovered}/{auditData.componentsTotal})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {componentAudit.map((component) => (
              <div key={component.id} style={{
                padding: 'var(--spacing-lg)',
                backgroundColor: 'var(--color-light)',
                borderRadius: 'var(--border-radius-md)',
                borderLeft: `4px solid ${getStatusColor(component.status)}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                  <div>
                    <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                      {component.name}
                    </h4>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: '0.25rem 0 0 0' }}>
                      {component.location}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    backgroundColor: `rgba(${component.status === 'implemented' ? '16, 185, 129' : '239, 68, 68'}, 0.1)`,
                    color: getStatusColor(component.status),
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-bold)',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap'
                  }}>
                    {getStatusLabel(component.status)}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-sm)' }}>
                  <span style={{ color: 'var(--color-body)' }}>Usage: {component.usage}</span>
                  <span style={{ color: 'var(--color-body)' }}>Coverage: {component.coverage}%</span>
                </div>

                {component.issues.length > 0 && (
                  <div style={{ marginTop: 'var(--spacing-sm)', paddingTop: 'var(--spacing-sm)', borderTop: '1px solid var(--color-border)' }}>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-error)', margin: 0, marginBottom: 'var(--spacing-xs)', fontWeight: 'var(--font-weight-bold)' }}>
                      ⚠️ Issues:
                    </p>
                    <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', fontSize: 'var(--font-size-xs)', color: 'var(--color-body)' }}>
                      {component.issues.map((issue, idx) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* REFACTORING PHASES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {refactoringPhases.map((phase) => (
            <Card key={phase.id} variant="elevated">
              <div 
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: expandedPhase === phase.id ? 'var(--spacing-lg)' : 0,
                  borderBottom: expandedPhase === phase.id ? '1px solid var(--color-border)' : 'none'
                }}
                onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
              >
                <div>
                  <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>
                    {phase.phase}
                  </h3>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
                    {phase.duration} • Effort: {phase.effort}
                  </p>
                </div>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: phase.priority === 'CRITICAL' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: phase.priority === 'CRITICAL' ? 'var(--color-error)' : 'var(--color-warning)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-bold)',
                  borderRadius: '4px'
                }}>
                  {phase.priority}
                </span>
              </div>

              {expandedPhase === phase.id && (
                <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  {phase.tasks.map((task) => (
                    <div key={task.id} style={{
                      padding: 'var(--spacing-md)',
                      backgroundColor: 'var(--color-light)',
                      borderRadius: 'var(--border-radius-md)',
                      borderLeft: `3px solid ${task.impact === 'high' ? 'var(--color-error)' : 'var(--color-warning)'}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                        <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                          {task.title}
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', backgroundColor: 'var(--color-white)', padding: '2px 8px', borderRadius: '3px' }}>
                            {task.complexity}
                          </span>
                          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', backgroundColor: 'var(--color-white)', padding: '2px 8px', borderRadius: '3px' }}>
                            {task.lines}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* SUMMARY */}
        <div style={{ marginTop: 'var(--spacing-2xl)', padding: 'var(--spacing-xl)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-md)', border: '2px solid var(--color-primary)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
            📊 Refactoring Summary
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase', fontWeight: 'var(--font-weight-bold)' }}>
                Total Effort
              </p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info)', margin: 0 }}>
                15 days
              </p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase', fontWeight: 'var(--font-weight-bold)' }}>
                Phases
              </p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info)', margin: 0 }}>
                4 phases
              </p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase', fontWeight: 'var(--font-weight-bold)' }}>
                Target Completion
              </p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)', margin: 0 }}>
                100%
              </p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase', fontWeight: 'var(--font-weight-bold)' }}>
                Timeline
              </p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)', margin: 0 }}>
                Sprint 40
              </p>
            </div>
          </div>
          <p style={{ marginTop: 'var(--spacing-lg)', marginBottom: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-body)' }}>
            <strong>Recommendation:</strong> Execute all 4 phases sequentially for complete Aetherlab Design System implementation in Dashboard. Start with Phase 1 (critical components) immediately after Sprint 39.
          </p>
        </div>
      </div>
    </div>
  );
}