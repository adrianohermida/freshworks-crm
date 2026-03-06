import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Clock, TrendingUp, Zap } from 'lucide-react';
import Card from '@/components/aetherlab/Card';

export default function GoogleSheetsMonitoringDashboard() {
  const [monitoringData, setMonitoringData] = useState(null);
  const [alertHistory, setAlertHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular dados de monitoramento em tempo real
    const fetchMonitoringData = async () => {
      try {
        // Em produção, isso viria de uma função backend
        const mockData = {
          status: 'healthy',
          lastSync: new Date(Date.now() - 15 * 60 * 1000),
          successRate: 98.5,
          avgResponseTime: 245,
          totalRequests: 1542,
          failedRequests: 23,
          retriedSuccessfully: 18,
          timeoutErrors: 2,
          authErrors: 3
        };
        setMonitoringData(mockData);
        
        // Simular histórico de alertas
        setAlertHistory([
          { id: 1, type: 'timeout', message: 'Request timeout on sync #1234', time: new Date(Date.now() - 3600000), resolved: true },
          { id: 2, type: 'retry_success', message: 'Successfully retried sync #1233 (attempt 2/3)', time: new Date(Date.now() - 7200000), resolved: true },
          { id: 3, type: 'auth_error', message: 'Authentication failed, regenerating credentials', time: new Date(Date.now() - 10800000), resolved: true }
        ]);
      } catch (error) {
        console.error('Erro ao buscar dados de monitoramento:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonitoringData();
    const interval = setInterval(fetchMonitoringData, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !monitoringData) {
    return <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>Carregando...</div>;
  }

  const getStatusColor = () => {
    if (monitoringData.successRate >= 99) return 'var(--color-success)';
    if (monitoringData.successRate >= 95) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-xl)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
            <div style={{ 
              padding: 'var(--spacing-md)', 
              backgroundColor: 'var(--color-primary)', 
              borderRadius: 'var(--border-radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Activity style={{ width: '24px', height: '24px', color: 'var(--color-white)' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                🔍 Google Sheets Monitoring
              </h1>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: '0.5rem 0 0 0' }}>
                Real-time sync health & error tracking
              </p>
            </div>
          </div>
        </div>

        {/* STATUS METRICS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-2xl)'
        }}>
          <Card variant="elevated" style={{ borderLeft: `4px solid ${getStatusColor()}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', marginBottom: 'var(--spacing-sm)' }}>
                  Success Rate
                </div>
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: getStatusColor() }}>
                  {monitoringData.successRate.toFixed(1)}%
                </div>
              </div>
              <CheckCircle2 style={{ width: '32px', height: '32px', color: getStatusColor(), opacity: 0.3 }} />
            </div>
          </Card>

          <Card variant="elevated" style={{ borderLeft: '4px solid var(--color-info)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', marginBottom: 'var(--spacing-sm)' }}>
                  Avg Response Time
                </div>
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info)' }}>
                  {monitoringData.avgResponseTime}ms
                </div>
              </div>
              <Clock style={{ width: '32px', height: '32px', color: 'var(--color-info)', opacity: 0.3 }} />
            </div>
          </Card>

          <Card variant="elevated" style={{ borderLeft: '4px solid var(--color-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', marginBottom: 'var(--spacing-sm)' }}>
                  Total Requests
                </div>
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
                  {monitoringData.totalRequests.toLocaleString()}
                </div>
              </div>
              <TrendingUp style={{ width: '32px', height: '32px', color: 'var(--color-primary)', opacity: 0.3 }} />
            </div>
          </Card>

          <Card variant="elevated" style={{ borderLeft: '4px solid var(--color-warning)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', marginBottom: 'var(--spacing-sm)' }}>
                  Failed Requests
                </div>
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)' }}>
                  {monitoringData.failedRequests}
                </div>
              </div>
              <AlertTriangle style={{ width: '32px', height: '32px', color: 'var(--color-warning)', opacity: 0.3 }} />
            </div>
          </Card>
        </div>

        {/* RECOVERY METRICS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-2xl)'
        }}>
          <Card variant="default">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)', marginBottom: 'var(--spacing-sm)' }}>
                ✅ Retried Successfully
              </div>
              <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)' }}>
                {monitoringData.retriedSuccessfully}/{monitoringData.failedRequests}
              </div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 'var(--spacing-sm) 0 0 0' }}>
                {((monitoringData.retriedSuccessfully / monitoringData.failedRequests) * 100).toFixed(0)}% recovery rate
              </p>
            </div>
          </Card>

          <Card variant="default">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)', marginBottom: 'var(--spacing-sm)' }}>
                ⏱️ Timeout Errors
              </div>
              <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)' }}>
                {monitoringData.timeoutErrors}
              </div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 'var(--spacing-sm) 0 0 0' }}>
                {((monitoringData.timeoutErrors / monitoringData.failedRequests) * 100).toFixed(0)}% of failures
              </p>
            </div>
          </Card>

          <Card variant="default">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-error)', marginBottom: 'var(--spacing-sm)' }}>
                🔐 Auth Errors
              </div>
              <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-error)' }}>
                {monitoringData.authErrors}
              </div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 'var(--spacing-sm) 0 0 0' }}>
                {((monitoringData.authErrors / monitoringData.failedRequests) * 100).toFixed(0)}% of failures
              </p>
            </div>
          </Card>
        </div>

        {/* ALERT HISTORY */}
        <Card variant="elevated">
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0 }}>
              📋 Alert History
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {alertHistory.map((alert) => (
              <div key={alert.id} style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-light)',
                borderRadius: 'var(--border-radius-md)',
                borderLeft: `4px solid ${alert.type === 'timeout' ? 'var(--color-warning)' : alert.type === 'retry_success' ? 'var(--color-success)' : 'var(--color-error)'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                  <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0 }}>
                    {alert.message}
                  </p>
                  {alert.resolved && (
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                      ✓ Resolved
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0 }}>
                  {alert.time.toLocaleString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* LAST SYNC INFO */}
        <div style={{ marginTop: 'var(--spacing-2xl)', textAlign: 'center', color: 'var(--color-body)', fontSize: 'var(--font-size-sm)' }}>
          <Zap style={{ width: '16px', height: '16px', display: 'inline-block', marginRight: '4px' }} />
          Last sync: {monitoringData.lastSync?.toLocaleTimeString('pt-BR')} • Status: <span style={{ color: getStatusColor(), fontWeight: 'var(--font-weight-bold)' }}>HEALTHY</span>
        </div>
      </div>
    </div>
  );
}