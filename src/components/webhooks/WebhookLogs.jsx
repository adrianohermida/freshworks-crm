import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';

export default function WebhookLogs() {
  const [expandedId, setExpandedId] = useState(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['webhookEvents'],
    queryFn: () => base44.entities.WebhookEvent.list(),
    initialData: []
  });

  const statusConfig = {
    success: { color: 'bg-green-100 text-green-800', icon: '✅' },
    failed: { color: 'bg-red-100 text-red-800', icon: '❌' },
    retrying: { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
    pending: { color: 'bg-blue-100 text-blue-800', icon: '⏱️' },
    sent: { color: 'bg-purple-100 text-purple-800', icon: '📤' }
  };

  const recentEvents = events.slice(0, 20);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">📋 Log de Eventos</h3>

      {isLoading ? (
        <p className="text-sm text-gray-500 py-4">Carregando eventos...</p>
      ) : recentEvents.length === 0 ? (
        <p className="text-sm text-gray-500 py-4">Nenhum evento registrado</p>
      ) : (
        <div className="space-y-2">
          {recentEvents.map(event => {
            const config = statusConfig[event.status] || statusConfig.pending;

            return (
              <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <div
                  onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                  className="p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={config.color}>
                          {config.icon} {event.status.toUpperCase()}
                        </Badge>
                        <p className="font-semibold text-sm">{event.event_type}</p>
                      </div>
                      <p className="text-xs text-gray-600">
                        {event.entity_type} • {event.entity_id}
                      </p>
                      {event.sent_at && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(event.sent_at).toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs text-gray-600">
                        <p>Tentativa {event.attempt_count}/{3}</p>
                        {event.response_code && (
                          <p className="font-mono font-bold">
                            {event.response_code}
                          </p>
                        )}
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          expandedId === event.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {expandedId === event.id && (
                  <div className="border-t p-4 bg-gray-50 space-y-3">
                    {event.error_message && (
                      <div>
                        <p className="text-xs font-medium text-red-900 mb-1">❌ Erro</p>
                        <p className="text-xs text-red-800">{event.error_message}</p>
                      </div>
                    )}

                    {event.payload && (
                      <div>
                        <p className="text-xs font-medium text-gray-900 mb-1">📦 Payload</p>
                        <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs overflow-x-auto max-h-40 overflow-y-auto">
                          {JSON.stringify(event.payload, null, 2)}
                        </pre>
                      </div>
                    )}

                    {event.response_body && (
                      <div>
                        <p className="text-xs font-medium text-gray-900 mb-1">📤 Resposta</p>
                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-40 overflow-y-auto">
                          {event.response_body}
                        </pre>
                      </div>
                    )}

                    {event.next_retry && (
                      <p className="text-xs text-yellow-700">
                        ⏳ Próxima tentativa: {new Date(event.next_retry).toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}