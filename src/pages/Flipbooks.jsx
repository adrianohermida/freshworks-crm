import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResumeLoader from '@/components/common/ResumeLoader';
import FlipbookGaleria from '@/components/cliente/FlipbookGaleria';
import EstanteDigitalHeader from '@/components/cliente/EstanteDigitalHeader';

export default function EstanteDigital() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const processoId = params.get('processoId');

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: processo, isLoading } = useQuery({
    queryKey: ['processo-estante', processoId],
    queryFn: () => base44.entities.Processo.filter(
      { id: processoId, created_by: user?.email },
      '',
      1
    ).then(res => res[0]),
    enabled: !!processoId && !!user?.email,
  });

  if (isLoading) return <ResumeLoader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {processoId ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(createPageUrl('MeuPainel') + '?tab=processos')}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              {processo && <EstanteDigitalHeader processo={processo} />}
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Estante Digital</h1>
            </>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <FlipbookGaleria processoId={processoId} />
      </div>
    </div>
  );
}