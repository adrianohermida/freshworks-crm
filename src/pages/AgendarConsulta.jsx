import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Calendar, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const TIPOS_CONSULTA = [
  { id: 'presencial', label: 'Presencial' },
  { id: 'online', label: 'Online (Zoom)' },
  { id: 'telefone', label: 'Telefone' }
];

export default function AgendarConsulta() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    data: '',
    hora: '',
    tipo: 'presencial',
    descricao: ''
  });

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: cliente } = useQuery({
    queryKey: ['cliente-agendamento', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const clientes = await base44.entities.Cliente.filter({ email: user.email });
      return clientes?.[0];
    },
    enabled: !!user?.email
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio-agendamento'],
    queryFn: () => base44.entities.Escritorio.list(),
    enabled: !!user
  });

  const createMutation = useMutation({
    mutationFn: (data) => {
      if (!cliente?.id || !escritorio?.[0]?.id) {
        throw new Error('Dados incompletos');
      }
      return base44.entities.Appointment.create({
        cliente_id: cliente.id,
        cliente_email: user.email,
        cliente_nome: cliente.nome_completo,
        escritorio_id: escritorio[0].id,
        data_hora: new Date(`${data.data}T${data.hora}`).toISOString(),
        tipo: data.tipo,
        descricao: data.descricao,
        status: 'agendado'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Consulta agendada com sucesso!');
      setFormData({ data: '', hora: '', tipo: 'presencial', descricao: '' });
    },
    onError: (error) => toast.error('Erro ao agendar: ' + error.message)
  });

  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-red-600 font-medium mb-4">Você precisa estar autenticado</p>
        <Button onClick={() => base44.auth.redirectToLogin(window.location.pathname)}>
          Fazer Login
        </Button>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.data || !formData.hora) {
      toast.error('Preencha data e hora');
      return;
    }
    createMutation.mutate(formData);
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Agendar Consulta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Data*</label>
              <Input
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                min={minDate}
                className="mt-1"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Horário*</label>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <Input
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Tipo de Consulta*</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-[var(--bg-primary)] mt-1"
              >
                {TIPOS_CONSULTA.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>{tipo.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Observações</label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-[var(--bg-primary)] mt-1 resize-none"
                rows="3"
                placeholder="Descreva o motivo da consulta..."
              />
            </div>

            <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
              Uma confirmação será enviada para seu email {user.email}
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 bg-[var(--brand-primary)]"
                data-testid="btn-agendar-consulta"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Agendando...
                  </>
                ) : (
                  'Agendar'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}