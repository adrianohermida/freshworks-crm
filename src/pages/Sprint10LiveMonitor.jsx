import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2, Clock, Zap, Flame, TrendingUp } from 'lucide-react';

export default function Sprint10LiveMonitor() {
  const [queryAnalysis, setQueryAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [executionMetrics, setExecutionMetrics] = useState({
    tasksCompleted: 16,
    tasksTotal: 22,
    hoursSpent: 125,
    hoursRemaining: 19,
    lastUpdated: new Date()
  });

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await base44.functions.invoke('analyzeQueryPerformance', {});
        setQueryAnalysis(response.data.analysis);
      } catch (error) {
        console.error('Error fetching query analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
    const interval = setInterval(fetchAnalysis, 300000); // Refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  const completionPercentage = Math.round((executionMetrics.tasksCompleted / executionMetrics.tasksTotal) * 100);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', padding: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0 }}>
            🔴 SPRINT 10 LIVE MONITOR
          </h1>
          <div style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>
            Last updated: {executionMetrics.lastUpdated.toLocaleTimeString()}
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', border: '1px solid' }}>
            <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
              <CheckCircle2 style={{ width: '2.5rem', height: '2.5rem', color: '#4ade80', margin: '0 auto 0.5rem' }} />
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600', margin: 0 }}>TASKS COMPLETED</p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#fff', margin: '0.5rem 0' }}>
                {executionMetrics.tasksCompleted}/{executionMetrics.tasksTotal}
              </p>
              <div style={{ height: '0.5rem', backgroundColor: '#334155', borderRadius: '0.375rem', overflow: 'hidden', marginTop: '0.75rem' }}>
                <div style={{ height: '100%', backgroundColor: '#4ade80', width: `${completionPercentage}%`, transition: 'width 0.3s ease' }}></div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', border: '1px solid' }}>
            <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
              <Clock style={{ width: '2.5rem', height: '2.5rem', color: '#fbbf24', margin: '0 auto 0.5rem' }} />
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600', margin: 0 }}>TIME REMAINING</p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#fff', margin: '0.5rem 0' }}>6 days</p>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0.5rem 0 0' }}>Est. completion: 2026-03-10</p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', border: '1px solid' }}>
            <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
              <Flame style={{ width: '2.5rem', height: '2.5rem', color: '#ef4444', margin: '0 auto 0.5rem', animation: 'pulse 2s infinite' }} />
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600', margin: 0 }}>CRITICAL BLOCKERS</p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444', margin: '0.5rem 0' }}>2</p>
              <Badge style={{ backgroundColor: '#dc2626', color: '#fff', marginTop: '0.5rem' }}>UNBLOCK TODAY</Badge>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', border: '1px solid' }}>
            <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
              <TrendingUp style={{ width: '2.5rem', height: '2.5rem', color: '#60a5fa', margin: '0 auto 0.5rem' }} />
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600', margin: 0 }}>COMPLETION %</p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#60a5fa', margin: '0.5rem 0' }}>{completionPercentage}%</p>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0.5rem 0 0' }}>Target: 100%</p>
            </CardContent>
          </Card>
        </div>

        {/* Critical Action */}
        <Card style={{ backgroundColor: '#7f1d1d', borderColor: '#dc2626', border: '2px solid', boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.1)' }}>
          <CardHeader>
            <CardTitle style={{ color: '#fecaca', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
              <AlertCircle style={{ width: '1.5rem', height: '1.5rem' }} />
              🚨 TODAY'S CRITICAL ACTION
            </CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#450a0a', borderRadius: '0.5rem', border: '1px solid #991b1b' }}>
              <p style={{ fontSize: '1.125rem', fontWeight: '700', color: '#fca5a5', margin: '0 0 0.75rem' }}>
                Query Performance Analysis
              </p>
              <p style={{ color: '#fecaca', margin: 0, lineHeight: '1.5' }}>
                Backend Lead must execute query diagnostics immediately. This is blocking Sprint 11 kickoff.
              </p>
              <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#1f2937', borderRadius: '0.375rem' }}>
                <p style={{ color: '#60a5fa', fontSize: '0.875rem', fontWeight: '600', margin: 0 }}>⏱️ Deadline: TODAY 17:00 (Manaus Time)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Query Analysis Results */}
        {queryAnalysis && (
          <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', border: '1px solid' }}>
            <CardHeader>
              <CardTitle style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                <Zap style={{ width: '1.5rem', height: '1.5rem', color: '#fbbf24' }} />
                Top 5 Slow Queries
              </CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {queryAnalysis.recommendations.slice(0, 5).map((query, idx) => (
                <div key={idx} style={{ padding: '1rem', backgroundColor: '#0f172a', borderRadius: '0.5rem', borderLeft: `4px solid ${query.impact === 'CRITICAL' ? '#ef4444' : query.impact === 'HIGH' ? '#fbbf24' : '#60a5fa'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8', margin: 0 }}>
                      Query #{query.rank}
                    </p>
                    <Badge style={{ backgroundColor: query.impact === 'CRITICAL' ? '#dc2626' : query.impact === 'HIGH' ? '#d97706' : '#0ea5e9', color: '#fff' }}>
                      {query.impact}
                    </Badge>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#cbd5e1', margin: '0.5rem 0', fontFamily: 'monospace', maxHeight: '3rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {query.query}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '0.75rem', fontSize: '0.75rem' }}>
                    <div>
                      <p style={{ color: '#94a3b8', margin: '0 0 0.25rem' }}>Avg Time</p>
                      <p style={{ color: '#4ade80', fontWeight: '600', margin: 0 }}>{query.avgTime}</p>
                    </div>
                    <div>
                      <p style={{ color: '#94a3b8', margin: '0 0 0.25rem' }}>Executions</p>
                      <p style={{ color: '#60a5fa', fontWeight: '600', margin: 0 }}>{query.executions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p style={{ color: '#94a3b8', margin: '0 0 0.25rem' }}>Fix Priority</p>
                      <p style={{ color: '#fbbf24', fontWeight: '600', margin: 0 }}>Phase {Math.min(query.rank, 3)}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.5rem', margin: '0.5rem 0 0', fontStyle: 'italic' }}>
                    💡 {query.recommendation}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Execution Plan */}
        <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', border: '1px solid' }}>
          <CardHeader>
            <CardTitle style={{ color: '#fff', margin: 0 }}>📋 Execution Plan (48h)</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {[
                { day: 'TODAY (03-04)', task: 'Query Analysis', status: '🔴 IN PROGRESS', hours: '4h' },
                { day: '03-05', task: 'Query Optimization', status: '⏳ PENDING', hours: '6h' },
                { day: '03-06→09', task: 'Sprint 10 Closure', status: '📅 SCHEDULED', hours: '9.5h' }
              ].map((item, idx) => (
                <div key={idx} style={{ padding: '1rem', backgroundColor: '#0f172a', borderRadius: '0.5rem', borderTop: '2px solid #0ea5e9' }}>
                  <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', margin: 0 }}>{item.day}</p>
                  <p style={{ color: '#fff', fontSize: '0.875rem', fontWeight: '700', margin: '0.5rem 0' }}>{item.task}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                    <Badge style={{ backgroundColor: item.status.includes('IN PROGRESS') ? '#dc2626' : item.status.includes('PENDING') ? '#f59e0b' : '#0ea5e9', color: '#fff', fontSize: '0.7rem' }}>
                      {item.status}
                    </Badge>
                    <span style={{ color: '#cbd5e1', fontSize: '0.75rem' }}>{item.hours}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sprint 11 Readiness */}
        <Card style={{ backgroundColor: '#4c1d95', borderColor: '#a855f7', border: '2px solid', background: 'linear-gradient(135deg, #4c1d95, #2e1065)' }}>
          <CardHeader>
            <CardTitle style={{ color: '#e9d5ff', margin: 0 }}>🚀 Sprint 11 Status - READY TO LAUNCH</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#d8b4fe' }}>16</p>
                <p style={{ color: '#c4b5fd', fontSize: '0.875rem', margin: '0.5rem 0 0' }}>Tasks</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#d8b4fe' }}>4</p>
                <p style={{ color: '#c4b5fd', fontSize: '0.875rem', margin: '0.5rem 0 0' }}>Phases</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#d8b4fe' }}>14</p>
                <p style={{ color: '#c4b5fd', fontSize: '0.875rem', margin: '0.5rem 0 0' }}>Days</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#d8b4fe' }}>03-10</p>
                <p style={{ color: '#c4b5fd', fontSize: '0.875rem', margin: '0.5rem 0 0' }}>Kickoff</p>
              </div>
            </div>
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem', borderLeft: '4px solid #a855f7' }}>
              <p style={{ color: '#e9d5ff', fontWeight: '600', margin: '0 0 0.5rem' }}>🎯 Performance Optimization Sprint</p>
              <p style={{ color: '#d8b4fe', fontSize: '0.875rem', margin: 0, lineHeight: '1.5' }}>
                Target: 40% speed improvement + 1000 concurrent users support. Dependencies resolved, all prerequisites met. Awaiting Sprint 10 completion.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}