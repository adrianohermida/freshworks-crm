import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Loader2, Clock } from 'lucide-react';

export default function SyncStatus({ lastSync, isLoading }) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (!lastSync) return;
    
    const updateTimeAgo = () => {
      const now = new Date();
      const last = new Date(lastSync);
      const diff = Math.floor((now - last) / 1000);
      
      if (diff < 60) {
        setTimeAgo('agora mesmo');
      } else if (diff < 3600) {
        setTimeAgo(`${Math.floor(diff / 60)} minutos atrás`);
      } else if (diff < 86400) {
        setTimeAgo(`${Math.floor(diff / 3600)} horas atrás`);
      } else {
        setTimeAgo(`${Math.floor(diff / 86400)} dias atrás`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000);
    return () => clearInterval(interval);
  }, [lastSync]);

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Último Sync</CardTitle>
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-3 h-3 text-slate-500" />
          <span className="text-sm font-medium">{timeAgo || '—'}</span>
        </div>
        <Badge variant="outline" className="text-xs">
          Automático • 8AM UTC
        </Badge>
      </CardContent>
    </Card>
  );
}