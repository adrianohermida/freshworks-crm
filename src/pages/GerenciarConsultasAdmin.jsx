import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Mail, Calendar, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_COLORS = {
  agendado: 'bg-yellow-50 border-l-4 border-yellow-500',
  confirmado: 'bg-green-50 border-l-4 border-green-500',
  cancelado: 'bg-gray-50 border-l-4 border-gray-400',
  concluido: 'bg-blue-50 border-l-4 border-blue-300'
};

export default function GerenciarConsultasAdmin() {
  const queryClient = useQueryClient();
  const [searchCliente, setSearchCliente] = useState('');

  const { data: consultas = [], isLoading } = useQuery({
    queryKey: ['consultas-admin'],
    queryFn: () => base44.asServiceRole.entities.Appointment.list('-created_date', 100)
  });

  const syncGoogleMutation = useMutation({
    mutationFn: (consulta_id) =>
      base44.functions.invoke('syncGoogleCalendarConsulta', { consulta_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultas-admin'] });
      toast.success('Sincronizado com Google Calendar');
    },
    onError: () => toast.error('Erro ao sincronizar')
  });

  const sendReminderMutation = useMutation({
    mutationFn: () => base44.functions.invoke('lembreteConsulta24h'),
    onSuccess: (data) => {
      toast.success(`${data.emailsEnviados} lembretes enviados`);
    }
  });

  const filtradas = consultas.filter(c =>
    c.cliente_email?.toLowerCase().includes(searchCliente.toLowerCase()) ||
    c.cliente_nome?.toLowerCase().includes(searchCliente.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Consultas</h1>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Buscar por cliente..."
          value={searchCliente}
          onChange={(e) => setSearchCliente(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={() => sendReminderMutation.mutate()}
          disabled={sendReminderMutation.isPending}
          className="bg-blue-600"
        >
          <Mail className="w-4 h-4 mr-2" />
          Enviar Lembretes 24h
        </Button>
      </div>

      <div className="space-y-4">
        {filtradas.map(c => (
          <Card key={c.id} className={STATUS_COLORS[c.status]}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{c.cliente_nome}</p>
                  <p className="text-sm text-gray-600">{c.cliente_email}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span>
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {new Date(c.data_hora).toLocaleDateString('pt-BR')}
                    </span>
                    <span>{c.tipo}</span>
                    <span className="capitalize">{c.status}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!c.google_event_id && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => syncGoogleMutation.mutate(c.id)}
                      disabled={syncGoogleMutation.isPending}
                    >
                      <Calendar className="w-4 h-4" />
                    </Button>
                  )}
                  {c.google_meet_link && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(c.google_meet_link)}
                    >
                      <LinkIcon className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}