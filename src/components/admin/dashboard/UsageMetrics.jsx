import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

export default function UsageMetrics() {
  const { data: analytics = [] } = useQuery({
    queryKey: ['admin_usage_metrics'],
    queryFn: async () => {
      const events = await base44.entities.Analytics.list('-timestamp', 100);
      
      // Agrupar por tipo de evento
      const grouped = events.reduce((acc, event) => {
        const existing = acc.find(e => e.name === event.event_type);
        if (existing) {
          existing.value += 1;
        } else {
          acc.push({ name: event.event_type, value: 1 });
        }
        return acc;
      }, []);
      
      return grouped.slice(0, 5);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Métricas de Uso
        </CardTitle>
      </CardHeader>
      <CardContent>
        {analytics.length === 0 ? (
          <p className="text-sm text-gray-500">Sem dados</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}