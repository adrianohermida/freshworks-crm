import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProcessosList from '@/components/advise/ProcessosList';
import DetailedProcessHeader from '@/components/processos/DetailedProcessHeader';
import { useProcessoDetail } from '@/components/processos/useProcessoDetail';
import { List, FileText } from 'lucide-react';

export default function ProcessosPage() {
  const [processoSelecionado, setProcessoSelecionado] = useState(null);
  const { cabecalho, informacoes, isLoading } = useProcessoDetail(
    processoSelecionado?.numeroProcesso,
    processoSelecionado?.idFonteProcesso
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Processos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Acompanhe todos os processos e seus andamentos da plataforma Advise
          </p>
        </div>

        <Tabs defaultValue="lista" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lista" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Lista de Processos
            </TabsTrigger>
            <TabsTrigger value="detalhes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Detalhes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lista" className="space-y-6">
            <ProcessosList onSelectProcesso={setProcessoSelecionado} />
          </TabsContent>

          <TabsContent value="detalhes" className="space-y-6">
            {processoSelecionado ? (
              <DetailedProcessHeader
                processo={processoSelecionado}
                cabecalho={cabecalho}
                informacoes={informacoes}
                isLoading={isLoading}
              />
            ) : (
              <div className="p-8 text-center text-gray-500 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700">
                <p>Selecione um processo na aba "Lista de Processos" para ver detalhes</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}