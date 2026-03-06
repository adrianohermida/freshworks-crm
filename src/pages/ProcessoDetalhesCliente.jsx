import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MessageSquare, Mail, FileText, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ResumeLoader from '@/components/common/ResumeLoader';
import ProcessoClienteHeader from '@/components/cliente/ProcessoClienteHeader';
import ProcessoClienteInfo from '@/components/cliente/ProcessoClienteInfo';
import ProcessoClienteMovimentos from '@/components/cliente/ProcessoClienteMovimentos';
import DataJudErrorAlert from '@/components/cliente/DataJudErrorAlert';
import PlanoPushCTA from '@/components/cliente/PlanoPushCTA';

export default function ProcessoDetalhesCliente() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const processoId = params.get('id');

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: processo, isLoading } = useQuery({
    queryKey: ['processo-cliente', processoId],
    queryFn: async () => {
      // Busca por ID diretamente, sem filtrar por created_by (processos podem ser criados pelo admin)
      const todos = await base44.entities.Processo.filter({ id: processoId }, '', 1);
      return todos[0] || null;
    },
    enabled: !!processoId && !!user?.email,
  });

  if (isLoading) return <ResumeLoader />;
  if (!processo) return (
    <div className="p-6 text-center">
      <p>Processo não encontrado</p>
      <Button onClick={() => navigate(createPageUrl('MeuPainel'))} className="mt-4">
        Voltar
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <div className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)] p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(createPageUrl('MeuPainel') + '?tab=processos')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <ProcessoClienteHeader processo={processo} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <ProcessoClienteInfo processo={processo} />
        <ProcessoClienteMovimentos processo={processo} />

        {/* Documentação Digital CTA */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Documentação Digital</h3>
            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={() => navigate(createPageUrl('ProcessoEletronico') + `?processoId=${processo.id}`)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                Ver Cópias Entregues
              </Button>
              <Button
                onClick={() => navigate(createPageUrl('EstanteDigital') + `?processoId=${processo.id}`)}
                variant="outline"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Estante Digital
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* DataJud error e Push CTA */}
        <DataJudErrorAlert
          onUpgradePlan={() => navigate(createPageUrl('MeuPainel') + '?tab=plano')}
        />
        <PlanoPushCTA
          onUpgrade={() => navigate(createPageUrl('MeuPainel') + '?tab=plano')}
        />

        <Card className="bg-[var(--bg-elevated)] border-[var(--border-primary)]">
          <CardContent className="p-6">
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">Precisa de ajuda?</h3>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  const event = new CustomEvent('openChatWithClient', {
                    detail: { processoId: processo.id, processoTitulo: processo.titulo }
                  });
                  window.dispatchEvent(event);
                }}
                className="flex-1"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </Button>
              <Button
                onClick={() => {
                  const event = new CustomEvent('openTicketModal', {
                    detail: { processoId: processo.id, processoTitulo: processo.titulo }
                  });
                  window.dispatchEvent(event);
                }}
                variant="outline"
                className="flex-1"
              >
                <Mail className="w-4 h-4 mr-2" />
                Suporte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}