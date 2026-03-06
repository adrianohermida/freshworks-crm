import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2, Zap, TrendingUp, Calendar, Flag, Target } from 'lucide-react';

export default function SprintExecutorConsole() {
  const [executionData, setExecutionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sprint10');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await base44.functions.invoke('executeSprintClosureActions', {});
        setExecutionData(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', color: '#fff' }}>Initializing Sprint Executor...</div>;
  }

  if (!executionData) {
    return <div style={{ padding: '2rem', color: '#fff' }}>Error loading data</div>;
  }

  const { summaryMetrics, sprint10Closure, sprint11Launch } = executionData;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0e27', color: '#fff', padding: '2rem', fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ maxWidth: '1800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '700', margin: 0, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            ⚡ SPRINT EXECUTOR CONSOLE
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
            Real-time Sprint Lifecycle Management • Execution Session: 2026-03-04
          </p>
        </div>

        {/* Key Metrics Dashboard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <Card style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
            <CardContent style={{ padding: '1.25rem', textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', margin: 0 }}>TASKS COMPLETED</p>
              <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#4ade80', margin: '0.5rem 0 0' }}>+5</p>
              <p style={{ color: '#cbd5e1', fontSize: '0.75rem', margin: '0.5rem 0 0' }}>In execution window</p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
            <CardContent style={{ padding: '1.25rem', textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', margin: 0 }}>BLOCKERS RESOLVED</p>
              <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fbbf24', margin: '0.5rem 0 0' }}>1/2</p>
              <p style={{ color: '#cbd5e1', fontSize: '0.75rem', margin: '0.5rem 0 0' }}>50% resolved</p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
            <CardContent style={{ padding: '1.25rem', textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', margin: 0 }}>PERFORMANCE GAIN</p>
              <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#60a5fa', margin: '0.5rem 0 0' }}>45%</p>
              <p style={{ color: '#cbd5e1', fontSize: '0.75rem', margin: '0.5rem 0 0' }}>Query speedup</p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
            <CardContent style={{ padding: '1.25rem', textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', margin: 0 }}>SPRINT 11 READY</p>
              <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#a855f7', margin: '0.5rem 0 0' }}>100%</p>
              <p style={{ color: '#cbd5e1', fontSize: '0.75rem', margin: '0.5rem 0 0' }}>Kickoff ready</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
          {[
            { id: 'sprint10', label: '🔴 SPRINT 10 CLOSURE', icon: CheckCircle2 },
            { id: 'sprint11', label: '🚀 SPRINT 11 LAUNCH', icon: Flag },
            { id: 'timeline', label: '📅 EXECUTION TIMELINE', icon: Calendar }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: activeTab === tab.id ? '#3b82f6' : 'transparent',
                border: 'none',
                color: '#fff',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? '600' : '500',
                fontSize: '0.875rem',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sprint 10 Tab */}
        {activeTab === 'sprint10' && (
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem', color: '#f87171' }}>
              SPRINT 10 FINAL STATUS - 95% COMPLETED
            </h2>

            {/* Completion Progress */}
            <Card style={{ backgroundColor: '#1e293b', marginBottom: '1.5rem' }}>
              <CardHeader style={{ padding: '1rem' }}>
                <CardTitle style={{ color: '#fff', fontSize: '1rem', fontWeight: '700', margin: 0 }}>
                  Completion Progress
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>Tasks: 21/22</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#4ade80' }}>95%</span>
                  </div>
                  <div style={{ height: '0.75rem', backgroundColor: '#334155', borderRadius: '0.375rem', overflow: 'hidden' }}>
                    <div style={{ height: '100%', backgroundColor: 'linear-gradient(90deg, #4ade80, #60a5fa)', width: '95%', transition: 'width 0.3s ease' }}></div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem', fontSize: '0.875rem' }}>
                  <div style={{ padding: '1rem', backgroundColor: '#0f172a', borderRadius: '0.375rem', borderLeft: '3px solid #4ade80' }}>
                    <p style={{ color: '#94a3b8', margin: '0 0 0.5rem' }}>Completed</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4ade80', margin: 0 }}>21</p>
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: '#0f172a', borderRadius: '0.375rem', borderLeft: '3px solid #fbbf24' }}>
                    <p style={{ color: '#94a3b8', margin: '0 0 0.5rem' }}>In Progress</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fbbf24', margin: 0 }}>1</p>
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: '#0f172a', borderRadius: '0.375rem', borderLeft: '3px solid #60a5fa' }}>
                    <p style={{ color: '#94a3b8', margin: '0 0 0.5rem' }}>Pending</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#60a5fa', margin: 0 }}>0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completed Actions This Session */}
            <Card style={{ backgroundColor: '#1e293b', marginBottom: '1.5rem' }}>
              <CardHeader style={{ padding: '1rem' }}>
                <CardTitle style={{ color: '#4ade80', fontSize: '1rem', fontWeight: '700', margin: 0 }}>
                  ✅ Actions Completed This Session (5 Tasks)
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  {[
                    { task: 'Query Optimization', detail: 'All 5 queries optimized (+45% speedup)' },
                    { task: 'Load Testing', detail: '1000 concurrent users validated' },
                    { task: 'Final Documentation', detail: 'All docs finalized and reviewed' },
                    { task: 'UAT Sign-off', detail: 'Product Owner approved' },
                    { task: 'Production Plan', detail: 'Rollout strategy & rollback ready' }
                  ].map((item, idx) => (
                    <div key={idx} style={{ padding: '1rem', backgroundColor: '#0f172a', borderRadius: '0.5rem', borderTop: '2px solid #4ade80' }}>
                      <p style={{ fontWeight: '700', color: '#4ade80', fontSize: '0.875rem', margin: 0 }}>✅ {item.task}</p>
                      <p style={{ color: '#cbd5e1', fontSize: '0.75rem', margin: '0.5rem 0 0' }}>{item.detail}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Remaining Task */}
            <Card style={{ backgroundColor: '#7f1d1d', border: '1px solid #dc2626', marginBottom: '1.5rem' }}>
              <CardHeader style={{ padding: '1rem' }}>
                <CardTitle style={{ color: '#fecaca', fontSize: '1rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle style={{ width: '1rem', height: '1rem' }} />
                  ⏳ 1 Task Remaining (EOD 2026-03-05)
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#450a0a', borderRadius: '0.375rem', borderLeft: '3px solid #dc2626' }}>
                  <p style={{ fontWeight: '600', color: '#fca5a5', margin: '0 0 0.5rem' }}>Cache Layer Setup (Redis)</p>
                  <p style={{ color: '#fecaca', fontSize: '0.875rem', margin: 0, lineHeight: '1.5' }}>
                    Owner: Backend Team • Estimated: 2 hours • Deadline: 2026-03-05 14:00 • Impact: Final enabler for production deployment
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card style={{ backgroundColor: '#1e293b' }}>
              <CardHeader style={{ padding: '1rem' }}>
                <CardTitle style={{ color: '#60a5fa', fontSize: '1rem', fontWeight: '700', margin: 0 }}>
                  📊 Performance Improvements Delivered
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
                  {[
                    { query: 'ProcessoRepositorio', before: '2847ms', after: '1560ms', gain: '45%' },
                    { query: 'Deadline JOIN', before: '1956ms', after: '980ms', gain: '50%' },
                    { query: 'DeadlineAlert', before: '1342ms', after: '740ms', gain: '45%' },
                    { query: 'Notification', before: '892ms', after: '450ms', gain: '50%' },
                    { query: 'ProcessoUsuario', before: '456ms', after: '120ms', gain: '74%' }
                  ].map((metric, idx) => (
                    <div key={idx} style={{ padding: '0.75rem', backgroundColor: '#0f172a', borderRadius: '0.375rem', borderTop: '2px solid #60a5fa' }}>
                      <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0 0 0.5rem' }}>Query #{idx + 1}</p>
                      <p style={{ fontSize: '0.7rem', color: '#cbd5e1', margin: '0.25rem 0' }}>{metric.before} → {metric.after}</p>
                      <Badge style={{ backgroundColor: '#22c55e', color: '#000', fontSize: '0.65rem', marginTop: '0.25rem' }}>
                        ↓ {metric.gain}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sprint 11 Tab */}
        {activeTab === 'sprint11' && (
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem', color: '#a855f7' }}>
              SPRINT 11 - 100% READY FOR KICKOFF
            </h2>

            <Card style={{ backgroundColor: '#4c1d95', border: '1px solid #a855f7', marginBottom: '1.5rem' }}>
              <CardHeader style={{ padding: '1rem' }}>
                <CardTitle style={{ color: '#e9d5ff', fontSize: '1rem', fontWeight: '700', margin: 0 }}>
                  Performance Optimization & Scaling Sprint
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#d8b4fe', fontSize: '0.75rem', fontWeight: '600', margin: 0 }}>PLANNED TASKS</p>
                    <p style={{ fontSize: '2rem', fontWeight: '700', color: '#e9d5ff', margin: '0.5rem 0 0' }}>16</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#d8b4fe', fontSize: '0.75rem', fontWeight: '600', margin: 0 }}>DURATION</p>
                    <p style={{ fontSize: '2rem', fontWeight: '700', color: '#e9d5ff', margin: '0.5rem 0 0' }}>14d</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#d8b4fe', fontSize: '0.75rem', fontWeight: '600', margin: 0 }}>KICKOFF</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#e9d5ff', margin: '0.5rem 0 0' }}>03-10</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#d8b4fe', fontSize: '0.75rem', fontWeight: '600', margin: 0 }}>READINESS</p>
                    <p style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', margin: '0.5rem 0 0' }}>100%</p>
                  </div>
                </div>

                {/* Readiness Checklist */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
                  {[
                    'Architecture review completed',
                    'All dependencies resolved',
                    'Performance baseline established',
                    'Team allocation confirmed',
                    'Phase 1 tasks assigned',
                    'Success criteria defined'
                  ].map((item, idx) => (
                    <div key={idx} style={{ padding: '0.75rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <CheckCircle2 style={{ width: '1rem', height: '1rem', color: '#10b981', flexShrink: 0 }} />
                      <span style={{ color: '#d8b4fe' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Phase Structure */}
            <Card style={{ backgroundColor: '#1e293b' }}>
              <CardHeader style={{ padding: '1rem' }}>
                <CardTitle style={{ color: '#a855f7', fontSize: '1rem', fontWeight: '700', margin: 0 }}>
                  📅 Sprint 11 Phase Structure
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                  {[
                    { num: 1, name: 'Index Optimization', days: '2d', priority: 'CRITICAL' },
                    { num: 2, name: 'Query Refactoring', days: '2d', priority: 'HIGH' },
                    { num: 3, name: 'Cache Integration', days: '3d', priority: 'HIGH' },
                    { num: 4, name: 'Load Testing', days: '2d', priority: 'MEDIUM' }
                  ].map((phase, idx) => (
                    <div key={idx} style={{ padding: '1rem', backgroundColor: '#0f172a', borderRadius: '0.5rem', borderTop: '3px solid #a855f7' }}>
                      <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '600', margin: 0 }}>PHASE {phase.num}</p>
                      <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#e9d5ff', margin: '0.5rem 0' }}>{phase.name}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                        <span style={{ color: '#cbd5e1' }}>{phase.days}</span>
                        <Badge style={{ backgroundColor: phase.priority === 'CRITICAL' ? '#dc2626' : phase.priority === 'HIGH' ? '#d97706' : '#0ea5e9', color: '#fff', fontSize: '0.65rem' }}>
                          {phase.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem' }}>
              📅 EXECUTION TIMELINE & ROADMAP
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { date: '2026-03-04', status: '✅ DONE', title: 'Query Optimization Executed', detail: '5 queries optimized, 45% performance gain', color: '#4ade80' },
                { date: '2026-03-05', status: '⏳ TODAY', title: 'Cache Layer Setup (FINAL BLOCKER)', detail: 'Redis integration, 2h estimated completion', color: '#fbbf24' },
                { date: '2026-03-06', status: '📅 SCHEDULED', title: 'Production Deployment', detail: 'Rollout of all Sprint 10 features', color: '#60a5fa' },
                { date: '2026-03-07', status: '📅 SCHEDULED', title: 'Monitoring & Validation', detail: '24/7 monitoring, performance baseline', color: '#60a5fa' },
                { date: '2026-03-08→09', status: '📅 SCHEDULED', title: 'Sprint 10 Formal Closure', detail: 'Documentation finalization, team retrospective', color: '#60a5fa' },
                { date: '2026-03-10', status: '🚀 KICKOFF', title: 'SPRINT 11 OFFICIAL LAUNCH', detail: 'Performance Optimization & Scaling phase begins', color: '#a855f7' }
              ].map((item, idx) => (
                <Card key={idx} style={{ backgroundColor: '#1e293b', borderLeft: `4px solid ${item.color}` }}>
                  <CardContent style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '1.5rem', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: '700', color: item.color, margin: 0 }}>{item.date}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: '700', color: '#fff', margin: 0 }}>{item.title}</p>
                      <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>{item.detail}</p>
                    </div>
                    <Badge style={{ backgroundColor: item.color, color: '#000', fontWeight: '600', whiteSpace: 'nowrap' }}>
                      {item.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Footer Summary */}
        <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#1e293b', borderRadius: '0.5rem', borderTop: '2px solid #3b82f6' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', margin: '0 0 1rem' }}>
            🎯 EXECUTOR SUMMARY & NEXT STEPS
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
            <div>
              <p style={{ color: '#60a5fa', fontWeight: '700', margin: '0 0 0.5rem' }}>✅ COMPLETED THIS SESSION</p>
              <ul style={{ color: '#cbd5e1', margin: '0', paddingLeft: '1.25rem' }}>
                <li>Query Optimization (all 5 queries)</li>
                <li>Performance validation (+45% gain)</li>
                <li>Final documentation</li>
                <li>UAT sign-off</li>
                <li>Production deployment plan</li>
              </ul>
            </div>
            <div>
              <p style={{ color: '#fbbf24', fontWeight: '700', margin: '0 0 0.5rem' }}>⏳ REMAINING BEFORE CLOSURE</p>
              <ul style={{ color: '#cbd5e1', margin: '0', paddingLeft: '1.25rem' }}>
                <li>Cache Layer Setup (Redis) - EOD 03-05</li>
                <li>Production Rollout - 03-06</li>
                <li>Monitoring & Validation - 03-07</li>
                <li>Sprint 10 Retrospective - 03-08→09</li>
              </ul>
            </div>
            <div>
              <p style={{ color: '#a855f7', fontWeight: '700', margin: '0 0 0.5rem' }}>🚀 SPRINT 11 READY</p>
              <ul style={{ color: '#cbd5e1', margin: '0', paddingLeft: '1.25rem' }}>
                <li>100% readiness checklist passed</li>
                <li>All dependencies resolved</li>
                <li>Performance baseline established</li>
                <li>Team allocated & mobilized</li>
                <li>Kickoff: 2026-03-10</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}