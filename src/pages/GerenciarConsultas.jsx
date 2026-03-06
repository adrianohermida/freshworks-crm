import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Calendar, Plus, Clock, CheckCircle2, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Breadcrumb from '@/components/seo/Breadcrumb';
import ResumeLoader from '@/components/common/ResumeLoader';
import ConsultasHeader from '@/components/consultas/ConsultaHeader';
import ConsultasGrid from '@/components/consultas/ConsultaGrid';
import AgendamentoCard from '@/components/consultas/AgendamentoCard';

const statusColors = {
  pendente_confirmacao: 'bg-yellow-100 text-yellow-800',
  confirmado: 'bg-green-100 text-green-800',
  realizado: 'bg-blue-100 text-blue-800',
  cancelado: 'bg-red-100 text-red-800',
  remarcado: 'bg-purple-100 text-purple-800',
  nao_compareceu: 'bg-gray-100 text-gray-800'
};

export default function GerenciarConsultas() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('agendamentos');

  // Fetch user & escritório
  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
    staleTime: 5 * 60 * 1000
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    },
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000
  });

  // Fetch agendamentos (Appointment)
  const { data: agendamentos = [], isLoading: loadingAgendamentos } = useQuery({
    queryKey: ['agendamentos-admin', escritorio?.id],
    queryFn: async () => {
      if (!escritorio?.id) return [];
      return base44.entities.Appointment.filter({
        escritorio_id: escritorio.id
      }, '-data', 100);
    },
    enabled: !!escritorio?.id,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000
  });

  // Mutations
  const confirmarMutation = useMutation({
    mutationFn: async (agendamento) => {
      await base44.entities.Appointment.update(agendamento.id, {
        status: 'confirmado',
        confirmado_em: new Date().toISOString(),
        confirmado_por: user.email
      });
    },
    onSuccess: async (data, agendamento) => {
      // Auto-criar Conversa + Mensagem
      try {
        await base44.functions.invoke('criarConversaAgendamento', {
          appointment_id: agendamento.id,
          cliente_email: agendamento.cliente_email,
          cliente_nome: agendamento.cliente_nome,
          escritorio_id: escritorio?.id
        });
      } catch (err) {
        console.error('Erro ao criar conversa:', err);
      }

      // Enviar email de confirmação
      try {
        await base44.functions.invoke('email/notifyAgendamentoConfirmado', {
          agendamento_id: agendamento.id,
          cliente_email: agendamento.cliente_email,
          cliente_nome: agendamento.cliente_nome,
          data_agendamento: agendamento.data,
          hora_agendamento: agendamento.hora
        });
      } catch (err) {
        console.error('Erro ao enviar email de confirmação:', err);
      }
      queryClient.invalidateQueries({ queryKey: ['agendamentos-admin'] });
      queryClient.invalidateQueries({ queryKey: ['conversas-unificadas'] });
      toast.success('Agendamento confirmado e conversa criada');
    }
  });

  const remarcarMutation = useMutation({
    mutationFn: async ({ agendamento, novaData, novaHora }) => {
      await base44.entities.Appointment.update(agendamento.id, {
        data: novaData,
        hora: novaHora,
        status: 'remarcado',
        remarcado_em: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos-admin'] });
      toast.success('Agendamento remarcado');
    }
  });

  const cancelarMutation = useMutation({
    mutationFn: async (agendamento) => {
      await base44.entities.Appointment.update(agendamento.id, {
        status: 'cancelado',
        cancelado_em: new Date().toISOString(),
        cancelado_por: user.email
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos-admin'] });
      toast.success('Agendamento cancelado');
    }
  });

  if (loadingUser || loadingAgendamentos) return <ResumeLoader />;

  // Agrupar agendamentos por status
  const pendentes = agendamentos.filter(a => a.status === 'pendente_confirmacao');
  const confirmados = agendamentos.filter(a => a.status === 'confirmado');
  const concluidos = agendamentos.filter(a => ['realizado', 'nao_compareceu'].includes(a.status));
  const cancelados = agendamentos.filter(a => a.status === 'cancelado');

  const stats = [
    { label: 'Pendentes', value: pendentes.length, icon: Clock, color: 'text-yellow-600' },
    { label: 'Confirmados', value: confirmados.length, icon: CheckCircle2, color: 'text-green-600' },
    { label: 'Realizados', value: concluidos.length, icon: Calendar, color: 'text-blue-600' },
    { label: 'Total', value: agendamentos.length, icon: Calendar, color: 'text-indigo-600' }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Header */}
      <div className="border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <Breadcrumb items={[
            { label: 'Dashboard', url: createPageUrl('Dashboard') },
            { label: 'Gerenciar Consultas' }
          ]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Title & Stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Calendar className="w-8 h-8 text-[var(--brand-primary)]" />
                Gerenciar Consultas
              </h1>
              <p className="text-[var(--text-secondary)] mt-1">Confirme, remarque e acompanhe agendamentos</p>
            </div>
            <Button 
              onClick={() => navigate(createPageUrl('AgendaSemanal'))}
              className="bg-[var(--brand-primary)]"
            >
              <Clock className="w-4 h-4 mr-2" />
              Agenda Semanal
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx} className="bg-[var(--bg-elevated)]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
                        <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                      </div>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="agendamentos">
              Pendentes <Badge className="ml-2" variant="secondary">{pendentes.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="confirmados">
              Confirmados <Badge className="ml-2" variant="secondary">{confirmados.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="concluidos">
              Concluídos <Badge className="ml-2" variant="secondary">{concluidos.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="cancelados">
              Cancelados <Badge className="ml-2" variant="secondary">{cancelados.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Pendentes */}
          <TabsContent value="agendamentos" className="space-y-4">
            {pendentes.length === 0 ? (
              <Card className="bg-[var(--bg-elevated)]">
                <CardContent className="p-12 text-center">
                  <p className="text-[var(--text-secondary)]">Nenhum agendamento pendente de confirmação</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendentes.map(appt => (
                  <AgendamentoCard 
                    key={appt.id}
                    agendamento={appt}
                    readonly={false}
                    actions={{
                      onConfirmar: () => confirmarMutation.mutate(appt),
                      onRemarcar: (data, hora) => remarcarMutation.mutate({ agendamento: appt, novaData: data, novaHora: hora }),
                      onCancelar: () => cancelarMutation.mutate(appt),
                      loading: confirmarMutation.isPending || remarcarMutation.isPending || cancelarMutation.isPending
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Confirmados */}
          <TabsContent value="confirmados" className="space-y-4">
            {confirmados.length === 0 ? (
              <Card className="bg-[var(--bg-elevated)]">
                <CardContent className="p-12 text-center">
                  <p className="text-[var(--text-secondary)]">Nenhum agendamento confirmado</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {confirmados.map(appt => (
                  <AgendamentoCard key={appt.id} agendamento={appt} readonly />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Concluídos */}
          <TabsContent value="concluidos" className="space-y-4">
            {concluidos.length === 0 ? (
              <Card className="bg-[var(--bg-elevated)]">
                <CardContent className="p-12 text-center">
                  <p className="text-[var(--text-secondary)]">Nenhum agendamento concluído</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {concluidos.map(appt => (
                  <AgendamentoCard key={appt.id} agendamento={appt} readonly />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Cancelados */}
          <TabsContent value="cancelados" className="space-y-4">
            {cancelados.length === 0 ? (
              <Card className="bg-[var(--bg-elevated)]">
                <CardContent className="p-12 text-center">
                  <p className="text-[var(--text-secondary)]">Nenhum agendamento cancelado</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {cancelados.map(appt => (
                  <AgendamentoCard key={appt.id} agendamento={appt} readonly />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}