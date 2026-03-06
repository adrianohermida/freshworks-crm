import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, Users } from 'lucide-react';

export default function AdminAgenda() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: agenda = [], isLoading } = useQuery({
    queryKey: ['admin_agenda'],
    queryFn: () => base44.entities.Agenda.list('-start_date', 100)
  });

  const filteredAgenda = agenda.filter(a => {
    const matchSearch = a.title?.includes(searchTerm) || a.description?.includes(searchTerm);
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: agenda.length,
    agendado: agenda.filter(a => a.status === 'agendado').length,
    concluido: agenda.filter(a => a.status === 'concluido').length,
    adiado: agenda.filter(a => a.status === 'adiado').length,
    cancelado: agenda.filter(a => a.status === 'cancelado').length
  };

  const today = new Date();
  const upcomingEvents = filteredAgenda
    .filter(a => new Date(a.start_date) >= today && a.status === 'agendado')
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
    .slice(0, 10);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center"><p className="text-gray-600">Carregando agenda...</p></div>;
  }

  const typeColors = {
    audiencia: 'bg-red-100 text-red-800',
    reuniao: 'bg-blue-100 text-blue-800',
    despacho: 'bg-yellow-100 text-yellow-800',
    sentenca: 'bg-green-100 text-green-800',
    outro: 'bg-gray-100 text-gray-800'
  };

  const statusColors = {
    agendado: 'bg-blue-100 text-blue-800',
    concluido: 'bg-green-100 text-green-800',
    adiado: 'bg-yellow-100 text-yellow-800',
    cancelado: 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin - Agenda</h1>
          <p className="text-gray-600 mt-1">Agenda centralizada de eventos processuais</p>
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
              <p className="text-sm text-gray-600">Agendados</p>
              <p className="text-3xl font-bold text-blue-600">{stats.agendado}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Concluídos</p>
              <p className="text-3xl font-bold text-green-600">{stats.concluido}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Adiados</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.adiado}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Cancelados</p>
              <p className="text-3xl font-bold text-red-600">{stats.cancelado}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <Input
            placeholder="Buscar por título ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-48"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">Todos os Status</option>
            <option value="agendado">Agendados</option>
            <option value="concluido">Concluídos</option>
            <option value="adiado">Adiados</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Próximos Eventos ({upcomingEvents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhum evento próximo</p>
            ) : (
              <div className="space-y-2">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-start justify-between p-3 bg-gray-50 rounded border">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{event.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                      <div className="flex gap-3 mt-2 text-xs text-gray-600">
                        {event.start_date && (
                          <span>📅 {new Date(event.start_date).toLocaleString('pt-BR')}</span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {event.location}
                          </span>
                        )}
                      </div>
                      {event.participants?.length > 0 && (
                        <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                          <Users className="w-3 h-3" /> {event.participants.length} participante(s)
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={typeColors[event.type] || 'bg-gray-100 text-gray-800'}>
                        {event.type}
                      </Badge>
                      <Badge className={statusColors[event.status] || 'bg-gray-100 text-gray-800'}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Events */}
        <Card>
          <CardHeader>
            <CardTitle>Todos os Eventos ({filteredAgenda.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAgenda.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhum evento encontrado</p>
            ) : (
              <div className="space-y-2">
                {filteredAgenda.slice(0, 20).map(event => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border text-sm">
                    <div className="flex-1">
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-xs text-gray-600">{new Date(event.start_date).toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={typeColors[event.type] || 'bg-gray-100 text-gray-800'}>
                        {event.type}
                      </Badge>
                      <Badge className={statusColors[event.status] || 'bg-gray-100 text-gray-800'}>
                        {event.status}
                      </Badge>
                    </div>
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