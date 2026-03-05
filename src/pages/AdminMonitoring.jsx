import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useAdminAuth } from '@/components/hooks/useAdminAuth';
import AdminLayout from '@/components/admin/layouts/AdminLayout';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

export default function AdminMonitoring() {
  const { user: adminUser, isLoading: authLoading } = useAdminAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { data: events = [] } = useQuery({
    queryKey: ['admin_monitoring'],
    queryFn: () => base44.entities.Analytics.list('-timestamp', 50),
    enabled: !authLoading,
    refetchInterval: 5000 // Auto-refresh a cada 5s
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      process_created: '➕',
      process_synced: '🔄',
      deadline_created: '⏰',
      search_performed: '🔍',
      export_generated: '📤',
      settings_updated: '⚙️'
    };
    return icons[type] || '📊';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (authLoading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;

  return (
    <AdminLayout user={adminUser} isSuperAdmin={adminUser?.role === 'super_admin'}>
      <ModuleLayout
        title="Monitoramento"
        subtitle="Acompanhar eventos, sincronizações e erros"
        icon={Eye}
      >
        <Card>
          <CardHeader>
            <CardTitle>Timeline de Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Nenhum evento registrado</div>
            ) : (
              <div className="space-y-2">
                {events.map((event, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{getEventTypeIcon(event.event_type)}</span>
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-white">
                            {event.event_type}
                          </p>
                          <p className="text-xs text-gray-500">{event.action}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{formatDate(event.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedEvent && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Detalhes do Evento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tipo</p>
                    <p className="font-medium">{selectedEvent.event_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className={getStatusColor(selectedEvent.status)}>
                      {selectedEvent.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Data/Hora</p>
                    <p className="text-sm">{formatDate(selectedEvent.timestamp)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Entidade</p>
                    <p className="font-medium">{selectedEvent.entity_type}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Ação</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedEvent.action}</p>
                  </div>
                  {selectedEvent.metadata && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Metadata</p>
                      <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                        {JSON.stringify(selectedEvent.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </ModuleLayout>
    </AdminLayout>
  );
}