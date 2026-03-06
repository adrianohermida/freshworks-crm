import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

export default function AdminDeadlines() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: deadlines = [], isLoading } = useQuery({
    queryKey: ['admin_deadlines'],
    queryFn: () => base44.entities.Deadline.list('-due_date', 100)
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['admin_alerts'],
    queryFn: () => base44.entities.DeadlineAlert.filter({ status: 'pending' }, '-alert_date', 50)
  });

  const today = new Date();
  const filteredDeadlines = deadlines.filter(d => {
    const matchSearch = d.description?.includes(searchTerm) || d.process_id?.includes(searchTerm);
    return matchSearch;
  });

  const stats = {
    total: deadlines.length,
    pending: deadlines.filter(d => d.status === 'pending').length,
    overdue: deadlines.filter(d => new Date(d.due_date) < today && d.status !== 'completed').length,
    completed: deadlines.filter(d => d.status === 'completed').length,
    pendingAlerts: alerts.length
  };

  const upcomingDeadlines = filteredDeadlines
    .filter(d => new Date(d.due_date) >= today && d.status !== 'completed')
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 10);

  const overdueDeadlines = filteredDeadlines
    .filter(d => new Date(d.due_date) < today && d.status !== 'completed')
    .sort((a, b) => new Date(b.due_date) - new Date(a.due_date));

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center"><p className="text-gray-600">Carregando prazos...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin - Prazos</h1>
          <p className="text-gray-600 mt-1">Monitoramento centralizado de prazos processuais</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-3xl font-bold text-cyan-600">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Pendentes</p>
              <p className="text-3xl font-bold text-blue-600">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Vencidos</p>
              <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Concluídos</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Alertas</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pendingAlerts}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Input
          placeholder="Buscar por descrição ou processo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />

        {/* Overdue Alert */}
        {overdueDeadlines.length > 0 && (
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-900">
                <AlertCircle className="w-5 h-5" />
                ⚠️ Prazos Vencidos ({overdueDeadlines.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {overdueDeadlines.map(deadline => (
                  <div key={deadline.id} className="flex items-center justify-between p-3 bg-white rounded border border-red-200">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{deadline.description}</p>
                      <p className="text-xs text-gray-600">Venceu em: {new Date(deadline.due_date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <Badge className="bg-red-600">VENCIDO</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Próximos Prazos ({upcomingDeadlines.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhum prazo próximo</p>
            ) : (
              <div className="space-y-2">
                {upcomingDeadlines.map(deadline => {
                  const daysLeft = Math.ceil((new Date(deadline.due_date) - today) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{deadline.description}</p>
                        <p className="text-xs text-gray-600">{new Date(deadline.due_date).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <Badge className={daysLeft <= 3 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}>
                        {daysLeft} dias
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Sem alertas pendentes</p>
            ) : (
              <div className="space-y-2">
                {alerts.slice(0, 15).map(alert => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded border border-yellow-200">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Alerta para {new Date(alert.alert_date).toLocaleDateString('pt-BR')}</p>
                      <p className="text-xs text-gray-600">Prazo ID: {alert.deadline_id}</p>
                    </div>
                    <Badge className="bg-yellow-600">{alert.alert_type}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}