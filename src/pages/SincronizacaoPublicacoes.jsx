import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SyncControls from '@/components/advise/SyncControls';
import StatusAlert from '@/components/advise/StatusAlert';
import StatsGrid from '@/components/advise/StatsGrid';
import DataTable from '@/components/advise/DataTable';
import { useAdviseSync } from '@/components/advise/useAdviseSync';

export default function SincronizacaoPublicacoes() {
  const { loading, error, result, sync } = useAdviseSync();
  const [diasAtras, setDiasAtras] = useState('1');

  const { data: publicacoes = [], isLoading: loadingPubs, refetch } = useQuery({
    queryKey: ['publicacoes'],
    queryFn: () => base44.entities.PublicacaoAdvise.list()
  });

  const handleSync = async () => {
    try {
      await sync('publicacoes.consultar', { 
        diasAtras: parseInt(diasAtras),
        lido: false
      });
      refetch();
    } catch (err) {
      console.error('Sync error:', err);
    }
  };

  const exportJSON = () => {
    const json = JSON.stringify(publicacoes, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `publicacoes-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: {
      label: 'Total',
      value: publicacoes.length,
      color: 'blue'
    },
    naoLidas: {
      label: 'Não Lidas',
      value: publicacoes.filter(p => !p.lido).length,
      color: 'yellow'
    },
    lidas: {
      label: 'Lidas',
      value: publicacoes.filter(p => p.lido).length,
      color: 'green'
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'importado': 'bg-blue-100 text-blue-800',
      'processado': 'bg-green-100 text-green-800',
      'pendente': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Sincronização de Publicações</h1>
        <p className="text-gray-600">Sincronize publicações do Advise em tempo real</p>
      </div>

      <SyncControls 
        loading={loading}
        period={diasAtras}
        onPeriodChange={setDiasAtras}
        onSync={handleSync}
        label="Sincronizar Publicações"
      />

      <StatusAlert 
        status={error ? 'error' : result ? 'success' : 'idle'}
        message={error || (result ? `✓ Sincronização concluída! ${result.publicacoes?.length || 0} publicações importadas.` : '')}
        details={result?.periodo?.periodoBuscaFormatado}
      />

      {publicacoes.length > 0 && (
        <>
          <StatsGrid stats={stats} />

          <div className="flex gap-2">
            <Button onClick={handleSync} disabled={loading} variant="outline">
              Sincronizar Novamente
            </Button>
            <Button onClick={exportJSON} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Baixar JSON
            </Button>
          </div>

          <Tabs defaultValue="todas" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="todas">Todas ({publicacoes.length})</TabsTrigger>
              <TabsTrigger value="nao-lidas">Não Lidas ({publicacoes.filter(p => !p.lido).length})</TabsTrigger>
            </TabsList>

            <TabsContent value="todas">
              <DataTable 
                title="Todas as Publicações"
                data={publicacoes}
                loading={loadingPubs}
                emptyMessage="Nenhuma publicação sincronizada"
                renderRow={(pub) => (
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {pub.numeroProcesso || 'Sem número'}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {pub.vara || 'Sem vara'} - {pub.municipio || 'Sem municipio'}
                        </p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge className={getStatusColor(pub.statusSincronizacao)}>
                            {pub.statusSincronizacao}
                          </Badge>
                          {pub.lido ? (
                            <Badge variant="outline">Lida</Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800">Não Lida</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(pub.dataPublicacao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              />
            </TabsContent>

            <TabsContent value="nao-lidas">
              <DataTable 
                title="Publicações Não Lidas"
                data={publicacoes.filter(p => !p.lido)}
                loading={loadingPubs}
                emptyMessage="Todas as publicações foram lidas! ✓"
                renderRow={(pub) => (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {pub.numeroProcesso || 'Sem número'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      📍 {pub.vara || 'Sem vara'} - {pub.municipio || 'Sem municipio'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(pub.dataPublicacao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}