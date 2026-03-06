import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Clock, MapPin, X } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_COLORS = {
  agendado: 'bg-blue-50 border-l-4 border-blue-500',
  confirmado: 'bg-green-50 border-l-4 border-green-500',
  cancelado: 'bg-gray-50 border-l-4 border-gray-400',
  concluido: 'bg-blue-50 border-l-4 border-blue-300'
};

const TIPOS_LABELS = {
  presencial: '📍 Presencial',
  online: '💻 Online (Zoom)',
  telefone: '📞 Telefone'
};

export default function MinhasConsultasCliente() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cancelandoId, setCancelandoId] = useState(null);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: cliente } = useQuery({
    queryKey: ['cliente-consultas', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const clientes = await base44.entities.Cliente.filter({ email: user.email });
      return clientes?.[0];
    },
    enabled: !!user?.email
  });

  const { data: consultas = [] } = useQuery({
    queryKey: ['consultas-cliente', cliente?.id],
    queryFn: () => {
      if (!cliente?.id) return [];
      return base44.entities.Appointment.filter({
        cliente_id: cliente.id
      });
    },
    enabled: !!cliente?.id
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => base44.entities.Appointment.update(id, { status: 'cancelado' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultas-cliente'] });
      toast.success('Consulta cancelada');
      setCancelandoId(null);
    },
    onError: () => toast.error('Erro ao cancelar')
  });

  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  if (!user) return null;

  const proximas = consultas.filter(c => 
    ['agendado', 'confirmado'].includes(c.status) && 
    new Date(c.data_hora) > new Date()
  );
  
  const concluidas = consultas.filter(c => 
    ['concluido', 'cancelado'].includes(c.status)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">Minhas Consultas</h1>

      <div className="space-y-8">
        {/* Próximas */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Próximas Consultas ({proximas.length})
          </h2>
          {proximas.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-[var(--text-secondary)]">Nenhuma consulta agendada</p>
                <Button 
                  onClick={() => navigate(createPageUrl('AgendarConsulta'))}
                  className="mt-4 bg-[var(--brand-primary)]"
                  data-testid="btn-agendar-vazio"
                >
                  Agendar Consulta
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {proximas.map(c => (
                <Card key={c.id} className={STATUS_COLORS[c.status]}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">
                          {new Date(c.data_hora).toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-[var(--text-secondary)]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(c.data_hora).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <span>{TIPOS_LABELS[c.tipo]}</span>
                        </div>
                        {c.descricao && (
                          <p className="text-xs text-gray-600 mt-2">{c.descricao}</p>
                        )}
                      </div>
                      {['agendado', 'confirmado'].includes(c.status) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                          onClick={() => {
                            if (confirm('Deseja cancelar esta consulta?')) {
                              setCancelandoId(c.id);
                              cancelMutation.mutate(c.id);
                            }
                          }}
                          disabled={cancelMutation.isPending}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Histórico */}
        {concluidas.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Histórico ({concluidas.length})
            </h2>
            <div className="space-y-3">
              {concluidas.map(c => (
                <Card key={c.id} className={STATUS_COLORS[c.status]}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {new Date(c.data_hora).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {TIPOS_LABELS[c.tipo]}
                        </p>
                      </div>
                      <p className="text-xs font-medium capitalize">{c.status}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}