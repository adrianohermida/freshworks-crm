import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { formatCNJ } from '../components/utils/CNJFormatter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, BookOpen, Download, ArrowLeft } from 'lucide-react';
import ResumeLoader from '@/components/common/ResumeLoader';
import PDFViewer from '@/components/cliente/PDFViewer';
import EstanteDigitalHeader from '@/components/cliente/EstanteDigitalHeader';
import DataJudErrorAlert from '@/components/cliente/DataJudErrorAlert';
import PlanoPushCTA from '@/components/cliente/PlanoPushCTA';

export default function ProcessoEletronico() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const processoId = params.get('processoId');

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: processo, isLoading } = useQuery({
    queryKey: ['processo-eletronico', processoId],
    queryFn: () => base44.entities.Processo.filter(
      { id: processoId, created_by: user?.email },
      '',
      1
    ).then(res => res[0]),
    enabled: !!processoId && !!user?.email,
  });

  const { data: copias = [] } = useQuery({
    queryKey: ['copias-entregues', processoId],
    queryFn: () => base44.entities.SolicitacaoCopiaEletronicaCliente.filter(
      { processo_id: processoId, status: 'entregue' },
      '-created_date'
    ),
    enabled: !!processoId,
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4 md:p-6">
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
          <div>
            <p className="text-sm text-gray-600 mb-1">Breadcrumb</p>
            <p className="text-xs text-gray-500 font-mono">
              Home / Processos / {formatCNJ(processo?.numero_cnj)}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <Tabs defaultValue="copias" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="copias" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Cópias Entregues</span>
              <span className="sm:hidden">Cópias</span>
            </TabsTrigger>
            <TabsTrigger value="estante" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Estante Digital</span>
              <span className="sm:hidden">Estante</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="copias" className="space-y-4">
            {copias.length === 0 ? (
              <>
                <Card className="bg-white">
                  <CardContent className="p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">
                      Nenhuma cópia entregue disponível
                    </p>
                    <Button
                      onClick={() => navigate(createPageUrl('MeuPainel') + '?tab=processos')}
                      variant="outline"
                    >
                      Solicitar Cópia
                    </Button>
                  </CardContent>
                </Card>
                <DataJudErrorAlert
                  onUpgradePlan={() => navigate(createPageUrl('MeuPainel') + '?tab=plano')}
                />
                <PlanoPushCTA
                  onUpgrade={() => navigate(createPageUrl('MeuPainel') + '?tab=plano')}
                />
              </>
            ) : (
              <div className="space-y-4">
                {copias.map(copia => (
                  <Card key={copia.id} className="bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>Cópia Entregue</span>
                        <span className="text-xs font-normal text-gray-600">
                          {new Date(copia.created_date).toLocaleDateString('pt-BR')}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {copia.pdf_url && (
                        <PDFViewer
                          url={copia.pdf_url}
                          filename={`processo-${formatCNJ(processo?.numero_cnj)}.pdf`}
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="estante" className="space-y-4">
            <EstanteDigitalHeader processo={processo} />
            <Card className="bg-white">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">
                  Carregando Estante Digital...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}