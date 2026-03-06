import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ModuleHeader from '@/components/cliente/ModuleHeader';
import ConsultasGrid from '@/components/consultas/cliente/ConsultasGrid';
import ConsultasEmpty from '@/components/consultas/cliente/ConsultasEmpty';
import RemarcarModal from '@/components/consultas/cliente/RemarcarModal';
import CancelarModal from '@/components/consultas/cliente/CancelarModal';
import PersistentCTABanner from '@/components/cliente/PersistentCTABanner';
import ResumeLoader from '@/components/common/ResumeLoader';

export default function MinhasConsultas() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [remarcarModal, setRemarcarModal] = useState({ open: false, agendamento: null });
  const [cancelarModal, setCancelarModal] = useState({ open: false, agendamento: null });

  // Fetch user
  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  // Fetch agendamentos (multi-tenant: cliente_email)
  const { data: agendamentos = [], isLoading: loadingAgendamentos } = useQuery({
    queryKey: ['minhas-consultas', user?.email],
    queryFn: async () => {
      const appointments = await base44.entities.Appointment.filter({
        cliente_email: user.email
      }, '-data', 50);
      return appointments;
    },
    enabled: !!user?.email
  });

  // Remarcar mutation
  const remarcarMutation = useMutation({
    mutationFn: async ({ agendamento, novaData, novaHora }) => {
      const dataHora = `${novaData}T${novaHora}`;
      await base44.entities.Appointment.update(agendamento.id, {
        data: novaData,
        hora: novaHora,
        status: 'pendente_confirmacao'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['minhas-consultas'] });
      toast.success('Consulta remarcada! Aguarde confirmação.');
      setRemarcarModal({ open: false, agendamento: null });
    },
    onError: (error) => {
      toast.error('Erro ao remarcar: ' + error.message);
    }
  });

  // Cancelar mutation
  const cancelarMutation = useMutation({
    mutationFn: async ({ agendamento, motivo }) => {
      await base44.entities.Appointment.update(agendamento.id, {
        status: 'cancelado',
        cancelado_em: new Date().toISOString(),
        cancelado_por: user.email,
        descricao: motivo ? `${agendamento.descricao || ''}\n\nMotivo cancelamento: ${motivo}` : agendamento.descricao
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['minhas-consultas'] });
      toast.success('Consulta cancelada com sucesso');
      setCancelarModal({ open: false, agendamento: null });
    },
    onError: (error) => {
      toast.error('Erro ao cancelar: ' + error.message);
    }
  });

  const handleRemarcar = (agendamento, novaData, novaHora) => {
    remarcarMutation.mutate({ agendamento, novaData, novaHora });
  };

  const handleCancelar = (agendamento, motivo) => {
    cancelarMutation.mutate({ agendamento, motivo });
  };

  if (loadingUser || loadingAgendamentos) return <ResumeLoader />;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <PersistentCTABanner />
      
      <ModuleHeader
        title="Minhas Consultas"
        breadcrumbItems={[
          { label: 'Painel', url: createPageUrl('MeuPainel') },
          { label: 'Consultas' }
        ]}
        icon={Calendar}
        action={
          <Button 
            onClick={() => navigate(createPageUrl('AgendarConsulta'))}
            className="bg-[var(--brand-primary)] w-full sm:w-auto"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agendar
          </Button>
        }
      />

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-6 pb-32 md:pb-6">
        {agendamentos.length === 0 ? (
          <ConsultasEmpty />
        ) : (
          <ConsultasGrid
            agendamentos={agendamentos}
            onRemarcar={(a) => setRemarcarModal({ open: true, agendamento: a })}
            onCancelar={(a) => setCancelarModal({ open: true, agendamento: a })}
            loading={remarcarMutation.isPending || cancelarMutation.isPending}
          />
        )}
      </div>

      <RemarcarModal
        agendamento={remarcarModal.agendamento}
        open={remarcarModal.open}
        onClose={() => setRemarcarModal({ open: false, agendamento: null })}
        onSave={handleRemarcar}
        loading={remarcarMutation.isPending}
      />

      <CancelarModal
        agendamento={cancelarModal.agendamento}
        open={cancelarModal.open}
        onClose={() => setCancelarModal({ open: false, agendamento: null })}
        onConfirm={handleCancelar}
        loading={cancelarMutation.isPending}
      />
    </div>
  );
}