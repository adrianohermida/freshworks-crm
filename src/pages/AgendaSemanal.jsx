import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Save, Building2, User, Calendar, Clock, CheckCircle2, Badge as BadgeIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResumeLoader from '@/components/common/ResumeLoader';
import ConfiguracaoRecessoForense from '@/components/agenda/ConfiguracaoRecessoForense';
import PeriodosIndisponibilidade from '@/components/agenda/PeriodosIndisponibilidade';
import WeeklyScheduleManager from '@/components/calendar/WeeklyScheduleManager';

export default function AgendaSemanal() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('escritorio');
  const [configEscritorio, setConfigEscritorio] = useState({});
  const [configUsuario, setConfigUsuario] = useState({});

  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    }
  });

  const { data: configsEscritorio = [] } = useQuery({
    queryKey: ['config-agenda-escritorio', escritorio?.id],
    queryFn: () => base44.entities.ConfiguracaoAgenda.filter({ tipo: 'escritorio', escritorio_id: escritorio.id }),
    enabled: !!escritorio
  });

  const { data: configsUsuario = [] } = useQuery({
    queryKey: ['config-agenda-usuario', user?.email],
    queryFn: () => base44.entities.ConfiguracaoAgenda.filter({ tipo: 'usuario', user_email: user.email }),
    enabled: !!user
  });

  useEffect(() => {
    if (configsEscritorio[0]) {
      setConfigEscritorio(configsEscritorio[0]);
    } else if (escritorio) {
      setConfigEscritorio({
        tipo: 'escritorio',
        escritorio_id: escritorio.id,
        recesso_forense_ativo: false,
        permitir_tickets_urgentes: true,
        periodos_indisponibilidade: []
      });
    }
  }, [configsEscritorio, escritorio]);

  useEffect(() => {
    if (configsUsuario[0]) {
      setConfigUsuario(configsUsuario[0]);
    } else if (user) {
      setConfigUsuario({
        tipo: 'usuario',
        user_email: user.email,
        periodos_indisponibilidade: []
      });
    }
  }, [configsUsuario, user]);

  const saveMutation = useMutation({
    mutationFn: async ({ config }) => {
      if (config.id) {
        return base44.entities.ConfiguracaoAgenda.update(config.id, config);
      } else {
        return base44.entities.ConfiguracaoAgenda.create(config);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['config-agenda-escritorio']);
      queryClient.invalidateQueries(['config-agenda-usuario']);
      toast.success('Configurações salvas');
    }
  });

  const handleSave = () => {
    if (activeTab === 'escritorio') {
      saveMutation.mutate({ config: configEscritorio });
    } else {
      saveMutation.mutate({ config: configUsuario });
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <div className="border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <Breadcrumb items={[{ label: 'Configurações de Agenda' }]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <SettingsIcon className="w-8 h-8 text-[var(--brand-primary)]" />
              Configurações de Agenda
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">
              Gerencie disponibilidade, recesso forense e períodos de indisponibilidade
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="escritorio" disabled={!isAdmin}>
              <Building2 className="w-4 h-4 mr-2" />
              Escritório
            </TabsTrigger>
            <TabsTrigger value="agendamentos" disabled={!isAdmin}>
              <Calendar className="w-4 h-4 mr-2" />
              Agendamentos
            </TabsTrigger>
            <TabsTrigger value="usuario">
              <User className="w-4 h-4 mr-2" />
              Pessoal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="escritorio" className="space-y-6">
            {isAdmin ? (
              <>
                <ConfiguracaoRecessoForense
                  config={configEscritorio}
                  onChange={setConfigEscritorio}
                />
                <PeriodosIndisponibilidade
                  config={configEscritorio}
                  onChange={setConfigEscritorio}
                />
                <WeeklyScheduleManager />
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-[var(--text-secondary)]">
                  Apenas administradores podem configurar a agenda do escritório
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="agendamentos" className="space-y-6">
            {isAdmin && <AgendamentosTab />}
          </TabsContent>

          <TabsContent value="usuario" className="space-y-6">
            <PeriodosIndisponibilidade
              config={configUsuario}
              onChange={setConfigUsuario}
            />
            <WeeklyScheduleManager />
          </TabsContent>
          </Tabs>
          </div>
          </div>
          );
          }

          function AgendamentosTab() {
          const [remarcarOpen, setRemarcarOpen] = useState(null);
          const [novaData, setNovaData] = useState('');
          const [novaHora, setNovaHora] = useState('');
          const queryClient = useQueryClient();

          const { data: escritorio } = useQuery({
          queryKey: ['escritorio'],
          queryFn: async () => {
          const result = await base44.entities.Escritorio.list();
          return result[0];
          }
          });

          const { data: agendamentos = [], isLoading } = useQuery({
          queryKey: ['agendamentos-agenda-admin', escritorio?.id],
          queryFn: async () => {
          if (!escritorio?.id) return [];
          return base44.entities.Appointment.filter({
          escritorio_id: escritorio.id
          }, '-data', 50);
          },
          enabled: !!escritorio?.id,
          staleTime: 5 * 60 * 1000
          });

          const confirmarMutation = useMutation({
          mutationFn: async (agendamento) => {
          await base44.entities.Appointment.update(agendamento.id, {
          status: 'confirmado',
          confirmado_em: new Date().toISOString()
          });
          },
          onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['agendamentos-agenda-admin'] });
          toast.success('Agendamento confirmado');
          }
          });

          const remarcarMutation = useMutation({
          mutationFn: async ({ agendamento, novaData, novaHora }) => {
          await base44.entities.Appointment.update(agendamento.id, {
          data: novaData,
          hora: novaHora,
          status: 'remarcado'
          });
          },
          onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['agendamentos-agenda-admin'] });
          toast.success('Agendamento remarcado');
          setRemarcarOpen(null);
          }
          });

          const cancelarMutation = useMutation({
          mutationFn: async (agendamento) => {
          await base44.entities.Appointment.update(agendamento.id, {
          status: 'cancelado',
          cancelado_em: new Date().toISOString()
          });
          },
          onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['agendamentos-agenda-admin'] });
          toast.success('Agendamento cancelado');
          }
          });

          if (isLoading) return <ResumeLoader />;

          const pendentes = agendamentos.filter(a => a.status === 'pendente_confirmacao');
          const confirmados = agendamentos.filter(a => a.status === 'confirmado');

          return (
          <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
          <Card className="bg-[var(--bg-elevated)]">
          <CardContent className="p-4">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-xs text-[var(--text-secondary)]">Pendentes</p>
               <p className="text-2xl font-bold">{pendentes.length}</p>
             </div>
             <Clock className="w-8 h-8 text-yellow-600" />
           </div>
          </CardContent>
          </Card>
          <Card className="bg-[var(--bg-elevated)]">
          <CardContent className="p-4">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-xs text-[var(--text-secondary)]">Confirmados</p>
               <p className="text-2xl font-bold">{confirmados.length}</p>
             </div>
             <CheckCircle2 className="w-8 h-8 text-green-600" />
           </div>
          </CardContent>
          </Card>
          <Card className="bg-[var(--bg-elevated)]">
          <CardContent className="p-4">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-xs text-[var(--text-secondary)]">Total</p>
               <p className="text-2xl font-bold">{agendamentos.length}</p>
             </div>
             <Calendar className="w-8 h-8 text-indigo-600" />
           </div>
          </CardContent>
          </Card>
          </div>

          {pendentes.length > 0 && (
          <div className="space-y-3">
          <h3 className="font-semibold text-[var(--text-primary)]">Pendentes de Confirmação</h3>
          {pendentes.map(appt => (
           <Card key={appt.id} className="bg-[var(--bg-elevated)]">
             <CardContent className="p-4">
               <div className="flex items-start justify-between mb-3">
                 <div className="flex-1">
                   <p className="font-semibold">{appt.cliente_nome}</p>
                   <p className="text-xs text-[var(--text-secondary)]">{appt.cliente_email}</p>
                   <p className="text-sm mt-1">
                     {new Date(appt.data).toLocaleDateString('pt-BR')} às {appt.hora}
                   </p>
                 </div>
                 <BadgeIcon className="text-yellow-600 w-5 h-5" />
               </div>

               {remarcarOpen === appt.id ? (
                 <div className="space-y-2 p-3 bg-[var(--bg-secondary)] rounded-lg">
                   <input type="date" value={novaData} onChange={(e) => setNovaData(e.target.value)} className="w-full px-2 py-1 border border-[var(--border-primary)] rounded text-sm" />
                   <input type="time" value={novaHora} onChange={(e) => setNovaHora(e.target.value)} className="w-full px-2 py-1 border border-[var(--border-primary)] rounded text-sm" />
                   <div className="flex gap-2">
                     <Button size="sm" onClick={() => remarcarMutation.mutate({ agendamento: appt, novaData, novaHora })} disabled={remarcarMutation.isPending} className="flex-1 bg-[var(--brand-primary)]">
                       Confirmar
                     </Button>
                     <Button size="sm" variant="outline" onClick={() => setRemarcarOpen(null)}>
                       Cancelar
                     </Button>
                   </div>
                 </div>
               ) : (
                 <div className="flex gap-2">
                   <Button size="sm" onClick={() => confirmarMutation.mutate(appt)} disabled={confirmarMutation.isPending} className="flex-1 bg-green-600">
                     Confirmar
                   </Button>
                   <Button size="sm" variant="outline" onClick={() => { setRemarcarOpen(appt.id); setNovaData(appt.data); setNovaHora(appt.hora); }}>
                     Remarcar
                   </Button>
                   <Button size="sm" variant="destructive" onClick={() => cancelarMutation.mutate(appt)} disabled={cancelarMutation.isPending}>
                     Cancelar
                   </Button>
                 </div>
               )}
             </CardContent>
           </Card>
          ))}
          </div>
          )}

          {confirmados.length > 0 && (
          <div className="space-y-3">
          <h3 className="font-semibold text-[var(--text-primary)]">Confirmados</h3>
          <div className="space-y-2">
           {confirmados.map(appt => (
             <Card key={appt.id} className="bg-[var(--bg-secondary)]">
               <CardContent className="p-3">
                 <div className="flex items-start justify-between">
                   <div>
                     <p className="font-semibold text-sm">{appt.cliente_nome}</p>
                     <p className="text-xs text-[var(--text-secondary)]">{new Date(appt.data).toLocaleDateString('pt-BR')} às {appt.hora}</p>
                   </div>
                   <CheckCircle2 className="w-4 h-4 text-green-600" />
                 </div>
               </CardContent>
             </Card>
           ))}
          </div>
          </div>
          )}

          {agendamentos.length === 0 && (
          <Card className="bg-[var(--bg-elevated)]">
          <CardContent className="p-12 text-center">
           <p className="text-[var(--text-secondary)]">Nenhum agendamento</p>
          </CardContent>
          </Card>
          )}
          </div>
          );
          }