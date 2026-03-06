import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Clock, Trash2 } from 'lucide-react';

export default function TimeTracker({ ticketId }) {
  const queryClient = useQueryClient();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const { data: trackings = [], isLoading } = useQuery({
    queryKey: ['timeTrackings', ticketId],
    queryFn: async () => {
      const all = await base44.entities.TimeTracking.list();
      return all.filter(t => t.ticket_id === ticketId);
    },
    initialData: []
  });

  const activeTracking = trackings.find(t => t.is_running);

  // Timer para tracking ativo
  useEffect(() => {
    if (!activeTracking) {
      setElapsedSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - new Date(activeTracking.start_time).getTime()) / 1000
      );
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTracking]);

  const startMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('trackTime', {
        action: 'start',
        ticket_id: ticketId,
        task_type: 'other'
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('⏱️ Rastreamento iniciado');
      queryClient.invalidateQueries({ queryKey: ['timeTrackings', ticketId] });
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    }
  });

  const stopMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('trackTime', {
        action: 'stop',
        tracking_id: activeTracking.id
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('⏹️ Rastreamento parado');
      queryClient.invalidateQueries({ queryKey: ['timeTrackings', ticketId] });
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.TimeTracking.delete(id),
    onSuccess: () => {
      toast.success('Rastreamento removido');
      queryClient.invalidateQueries({ queryKey: ['timeTrackings', ticketId] });
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    }
  });

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getTotalTime = () => {
    const total = trackings.reduce((sum, t) => sum + (t.duration_seconds || 0), 0);
    return formatTime(total);
  };

  if (isLoading) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Rastreamento de Tempo
          </div>
          <Badge variant="outline">{getTotalTime()}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Timer */}
        {activeTracking && (
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-blue-900">Rastreamento Ativo</p>
              <span className="text-2xl font-bold text-blue-600 font-mono">
                {formatTime(elapsedSeconds)}
              </span>
            </div>
            <Button
              onClick={() => stopMutation.mutate()}
              disabled={stopMutation.isPending}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <Square className="w-4 h-4 mr-2" />
              Parar Rastreamento
            </Button>
          </div>
        )}

        {/* Start Button */}
        {!activeTracking && (
          <Button
            onClick={() => startMutation.mutate()}
            disabled={startMutation.isPending}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Iniciar Rastreamento
          </Button>
        )}

        {/* History */}
        {trackings.filter(t => !t.is_running).length > 0 && (
          <div className="space-y-2 mt-4 pt-4 border-t">
            <p className="text-sm font-medium">Histórico</p>
            {trackings
              .filter(t => !t.is_running)
              .reverse()
              .map((tracking) => (
                <div
                  key={tracking.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{formatTime(tracking.duration_seconds)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(tracking.start_time).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(tracking.id)}
                    className="h-7 w-7"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}