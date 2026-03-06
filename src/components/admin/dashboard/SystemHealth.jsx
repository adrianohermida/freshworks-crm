import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SystemHealth() {
  const [healthChecks, setHealthChecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        // Check DataJud by counting recent processes
        const processes = await base44.entities.Process.list('-synced_at', 1);
        const datajudStatus = processes.length > 0 && new Date(processes[0].synced_at) > new Date(Date.now() - 3600000) ? 'online' : 'warning';

        // Check TPU by counting recent sync records
        const tpuSyncs = await base44.entities.TPUSincronizacao.list('-data_sincronizacao', 1);
        const tpuStatus = tpuSyncs.length > 0 && tpuSyncs[0].status === 'sucesso' ? 'online' : 'warning';

        // Check Database by counting recent analytics
        const analytics = await base44.entities.Analytics.list('-timestamp', 1);
        const dbStatus = analytics.length > 0 ? 'online' : 'warning';

        // Check Notifications by counting alerts
        const alerts = await base44.entities.DeadlineAlert.list('-alert_date', 1);
        const notifyStatus = alerts.length > 0 ? 'online' : 'warning';

        setHealthChecks([
          { name: 'DataJud API', status: datajudStatus },
          { name: 'TPU Sync', status: tpuStatus },
          { name: 'Database', status: dbStatus },
          { name: 'Alert System', status: notifyStatus }
        ]);
      } catch (error) {
        console.error('Health check failed:', error);
        setHealthChecks([
          { name: 'DataJud API', status: 'offline' },
          { name: 'TPU Sync', status: 'offline' },
          { name: 'Database', status: 'offline' },
          { name: 'Alert System', status: 'offline' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIcon = (status) => {
    return status === 'online' ? (
      <CheckCircle2 className="w-4 h-4 text-green-600" />
    ) : (
      <AlertCircle className="w-4 h-4 text-yellow-600" />
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Saúde do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Saúde do Sistema</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {healthChecks.map((check, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                {getIcon(check.status)}
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {check.name}
                </span>
              </div>
              <Badge className={getStatusColor(check.status)}>
                {check.status === 'online' ? 'Online' : check.status === 'warning' ? 'Aviso' : 'Offline'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}