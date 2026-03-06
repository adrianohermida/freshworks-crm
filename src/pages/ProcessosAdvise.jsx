import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ProcessosList from '../components/advise/ProcessosList';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';

export default function ProcessosAdvise() {
  const queryClient = useQueryClient();
  const [processoSelecionado, setProcessoSelecionado] = useState(null);

  const { data: processos = [], isLoading } = useQuery({
    queryKey: ['processos'],
    queryFn: () => base44.entities.ProcessoAdvise.list(),
    enabled: false, // Disable auto-fetch to prevent rate limit
    staleTime: Infinity
  });

  const { data: movimentos = [] } = useQuery({
    queryKey: ['movimentos', processoSelecionado?.id],
    queryFn: () => {
      if (!processoSelecionado) return [];
      return base44.entities.MovimentoProcesso.filter({
        numeroProcesso: processoSelecionado.numeroProcesso
      });
    },
    enabled: !!processoSelecionado
  });

  const syncMutation = useMutation({
    mutationFn: () => base44.functions.invoke('syncAdviseProcessos', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processos'] });
    }
  });

  // Estatísticas
  const stats = {
    total: processos.length,
    ativos: processos.filter(p => p.statusProcesso === 'ativo').length,
    suspensos: processos.filter(p => p.statusProcesso === 'suspenso').length,
    conclusos: processos.filter(p => p.statusProcesso === 'concluso').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Processos</h1>
          <p className="text-gray-600 dark:text-gray-400">Acompanhe todos os seus processos jurídicos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600 text-sm">Total</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600 text-sm">Ativos</p>
              <p className="text-3xl font-bold text-green-600">{stats.ativos}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600 text-sm">Suspensos</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.suspensos}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600 text-sm">Conclusos</p>
              <p className="text-3xl font-bold text-purple-600">{stats.conclusos}</p>
            </CardContent>
          </Card>
        </div>

        {/* Alert */}
        {!isLoading && processos.length === 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <p className="font-medium">Nenhum processo encontrado</p>
                <p className="text-xs mt-1">Clique em "Sincronizar" para buscar processos do Advise</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Processos List */}
          <div className="lg:col-span-2">
            <ProcessosList
              processos={processos}
              loading={isLoading}
              onSelectProcesso={setProcessoSelecionado}
              onSync={() => syncMutation.mutate()}
              syncLoading={syncMutation.isPending}
            />
          </div>

          {/* Detalhe do Processo Selecionado */}
          {processoSelecionado && (
            <div className="space-y-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-blue-600 uppercase font-semibold">Processo Selecionado</p>
                      <p className="text-lg font-bold text-gray-900">{processoSelecionado.numeroProcesso}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Tribunal</p>
                      <p className="text-sm font-medium text-gray-900">{processoSelecionado.tribunal}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Assunto</p>
                      <p className="text-sm text-gray-700">{processoSelecionado.assunto || 'Sem informação'}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Status</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">{processoSelecionado.statusProcesso}</p>
                    </div>

                    {movimentos.length > 0 && (
                      <div className="pt-4 border-t">
                        <p className="text-xs text-gray-600 uppercase font-semibold mb-2">Últimos Movimentos ({movimentos.length})</p>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {movimentos.slice(0, 5).map((mov) => (
                            <div key={mov.id} className="text-xs p-2 bg-white rounded border">
                              <p className="font-medium text-gray-900">{mov.tipoMovimento}</p>
                              <p className="text-gray-600 line-clamp-2">{mov.descricaoMovimento}</p>
                              <p className="text-gray-500 text-xs mt-1">
                                {new Date(mov.dataMovimento).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setProcessoSelecionado(null)}
                      className="w-full mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Fechar
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}