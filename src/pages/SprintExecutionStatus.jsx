import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock, Zap, TrendingUp, ChevronRight } from 'lucide-react';

export default function SprintExecutionStatus() {
  const [sprintData, setSprintData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await base44.functions.invoke('sprintExecutionTracker', {});
        setSprintData(response.data);
      } catch (error) {
        console.error('Error fetching sprint data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>Loading sprint data...</div>;
  }

  if (!sprintData) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>Error loading data</div>;
  }

  const { sprint10, sprint11, timeline } = sprintData;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', padding: '2rem' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* Main Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0, marginBottom: '0.5rem' }}>
            🎯 SPRINT EXECUTION STATUS
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem' }}>
            Real-time tracking • Updated: {new Date().toLocaleString()}
          </p>
        </div>

        {/* Sprint 10 Section */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#f87171', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle style={{ width: '1.5rem', height: '1.5rem' }} />
            SPRINT 10 - CLOSURE PHASE (73% Complete)
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
              <CardContent style={{ padding: '1rem' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', margin: 0 }}>TASKS COMPLETED</p>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#4ade80', margin: '0.5rem 0 0' }}>{sprint10.tasks.completed}/{sprint10.tasks.total}</p>
                <div style={{ height: '0.375rem', backgroundColor: '#334155', borderRadius: '0.25rem', marginTop: '0.75rem', overflow: 'hidden' }}>
                  <div style={{ height: '100%', backgroundColor: '#4ade80', width: '73%' }}></div>
                </div>
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
              <CardContent style={{ padding: '1rem' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', margin: 0 }}>DAYS REMAINING</p>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fbbf24', margin: '0.5rem 0 0' }}>{sprint10.daysRemaining}</p>
                <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0.5rem 0 0' }}>Until 2026-03-09</p>
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
              <CardContent style={{ padding: '1rem' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', margin: 0 }}>CRITICAL BLOCKERS</p>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ef4444', margin: '0.5rem 0 0' }}>{sprint10.criticalBlockers.length}</p>
                <Badge style={{ backgroundColor: '#dc2626', color: '#fff', marginTop: '0.5rem', fontSize: '0.65rem' }}>MUST RESOLVE TODAY</Badge>
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
              <CardContent style={{ padding: '1rem' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', margin: 0 }}>PENDING TASKS</p>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#60a5fa', margin: '0.5rem 0 0' }}>{sprint10.tasks.pending}</p>
                <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0.5rem 0 0' }}>Must complete</p>
              </CardContent>
            </Card>
          </div>

          {/* Critical Blockers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {sprint10.criticalBlockers.map((blocker, idx) => (
              <Card key={idx} style={{ backgroundColor: '#7f1d1d', borderColor: '#dc2626', border: '1px solid' }}>
                <CardHeader style={{ padding: '1rem' }}>
                  <CardTitle style={{ color: '#fecaca', fontSize: '1rem', fontWeight: '700', margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    {blocker.title}
                    <Badge style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '0.65rem' }}>🔴 CRITICAL</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent style={{ padding: '0 1rem 1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.75rem' }}>
                    <div>
                      <p style={{ color: '#94a3b8', margin: '0 0 0.25rem' }}>Owner</p>
                      <p style={{ color: '#fca5a5', fontWeight: '600', margin: 0 }}>{blocker.owner}</p>
                    </div>
                    <div>
                      <p style={{ color: '#94a3b8', margin: '0 0 0.25rem' }}>Status</p>
                      <p style={{ color: '#fca5a5', fontWeight: '600', margin: 0 }}>{blocker.status}</p>
                    </div>
                    <div>
                      <p style={{ color: '#94a3b8', margin: '0 0 0.25rem' }}>Est. Hours</p>
                      <p style={{ color: '#fca5a5', fontWeight: '600', margin: 0 }}>{blocker.estimatedHours}h</p>
                    </div>
                    <div>
                      <p style={{ color: '#94a3b8', margin: '0 0 0.25rem' }}>Deadline</p>
                      <p style={{ color: '#fca5a5', fontWeight: '600', margin: 0 }}>TODAY 17:00</p>
                    </div>
                  </div>
                  <div style={{ marginTop: '0.75rem', padding: '0.5rem', backgroundColor: '#450a0a', borderRadius: '0.25rem', borderLeft: '2px solid #dc2626' }}>
                    <p style={{ color: '#fecaca', fontSize: '0.7rem', margin: 0, fontWeight: '600' }}>Impact: {blocker.impact}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Completed Tasks */}
          <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', marginBottom: '1rem' }}>
            <CardHeader style={{ padding: '1rem' }}>
              <CardTitle style={{ color: '#4ade80', fontSize: '1rem', fontWeight: '700', margin: 0 }}>✅ {sprint10.completedTasks.length} Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent style={{ padding: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem' }}>
                {sprint10.completedTasks.map((task, idx) => (
                  <div key={idx} style={{ padding: '0.75rem', backgroundColor: '#0f172a', borderRadius: '0.375rem', borderLeft: '3px solid #4ade80', fontSize: '0.875rem', color: '#cbd5e1' }}>
                    {task}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
            <CardHeader style={{ padding: '1rem' }}>
              <CardTitle style={{ color: '#fbbf24', fontSize: '1rem', fontWeight: '700', margin: 0 }}>⏳ {sprint10.pendingTasks.length} Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {sprint10.pendingTasks.map((task, idx) => (
                  <div key={idx} style={{ padding: '0.75rem', backgroundColor: '#0f172a', borderRadius: '0.375rem', borderLeft: '3px solid #fbbf24', fontSize: '0.875rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{task}</span>
                    <ChevronRight style={{ width: '1rem', height: '1rem', color: '#fbbf24' }} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Timeline */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>📅 TODAY'S EXECUTION PLAN (2026-03-04)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {timeline.today_actions.map((item, idx) => (
              <Card key={idx} style={{ backgroundColor: '#1e293b', borderColor: '#334155', borderLeft: item.status === 'CRITICAL' ? '4px solid #ef4444' : item.status === 'IN_PROGRESS' ? '4px solid #fbbf24' : '4px solid #60a5fa' }}>
                <CardContent style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: '1rem', alignItems: 'center' }}>
                  <p style={{ fontWeight: '700', color: '#fbbf24', fontSize: '0.875rem', margin: 0 }}>{item.time}</p>
                  <div>
                    <p style={{ fontWeight: '600', color: '#fff', fontSize: '0.875rem', margin: 0 }}>{item.action}</p>
                    <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>Owner: {item.owner}</p>
                  </div>
                  <Badge style={{ backgroundColor: item.status === 'CRITICAL' ? '#dc2626' : item.status === 'IN_PROGRESS' ? '#d97706' : '#0ea5e9', color: '#fff', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                    {item.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sprint 11 Readiness */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#a855f7' }}>
            <Zap style={{ width: '1.5rem', height: '1.5rem' }} />
            SPRINT 11 - READY TO LAUNCH (95% Prep)
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <Card style={{ backgroundColor: '#4c1d95', borderColor: '#a855f7', border: '1px solid' }}>
              <CardContent style={{ padding: '1rem', textAlign: 'center' }}>
                <p style={{ color: '#d8b4fe', fontSize: '0.75rem', fontWeight: '600', margin: 0 }}>PLANNED TASKS</p>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#e9d5ff', margin: '0.5rem 0 0' }}>{sprint11.plannedTasks}</p>
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: '#4c1d95', borderColor: '#a855f7', border: '1px solid' }}>
              <CardContent style={{ padding: '1rem', textAlign: 'center' }}>
                <p style={{ color: '#d8b4fe', fontSize: '0.75rem', fontWeight: '600', margin: 0 }}>PHASES</p>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#e9d5ff', margin: '0.5rem 0 0' }}>{sprint11.phases.length}</p>
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: '#4c1d95', borderColor: '#a855f7', border: '1px solid' }}>
              <CardContent style={{ padding: '1rem', textAlign: 'center' }}>
                <p style={{ color: '#d8b4fe', fontSize: '0.75rem', fontWeight: '600', margin: 0 }}>KICKOFF IN</p>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#e9d5ff', margin: '0.5rem 0 0' }}>6 days</p>
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: '#4c1d95', borderColor: '#a855f7', border: '1px solid' }}>
              <CardContent style={{ padding: '1rem', textAlign: 'center' }}>
                <p style={{ color: '#d8b4fe', fontSize: '0.75rem', fontWeight: '600', margin: 0 }}>READINESS</p>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#e9d5ff', margin: '0.5rem 0 0' }}>95%</p>
              </CardContent>
            </Card>
          </div>

          <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
            <CardHeader style={{ padding: '1rem' }}>
              <CardTitle style={{ color: '#e9d5ff', fontSize: '1rem', fontWeight: '700', margin: 0 }}>Theme: {sprint11.theme}</CardTitle>
            </CardHeader>
            <CardContent style={{ padding: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem' }}>
                {sprint11.phases.map((phase, idx) => (
                  <div key={idx} style={{ padding: '0.75rem', backgroundColor: '#0f172a', borderRadius: '0.375rem', borderTop: '2px solid #a855f7' }}>
                    <p style={{ fontWeight: '600', color: '#e9d5ff', fontSize: '0.875rem', margin: 0 }}>{phase.name}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                      <span style={{ color: '#94a3b8' }}>{phase.duration}</span>
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
      </div>
    </div>
  );
}