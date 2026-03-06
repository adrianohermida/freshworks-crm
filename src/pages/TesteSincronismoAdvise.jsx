import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import SyncControls from '@/components/advise/SyncControls';
import StatusAlert from '@/components/advise/StatusAlert';
import StatsGrid from '@/components/advise/StatsGrid';
import ExportButton from '@/components/advise/ExportButton';
import SyncTabs from '@/components/advise/SyncTabs';
import { useAdviseSync } from '@/components/advise/useAdviseSync';

export default function TesteSincronismoAdvise() {
  const { loading, error, result, sync } = useAdviseSync();
  const [statusMessage, setStatusMessage] = useState('');

  const handleSync = async () => {
    try {
      setStatusMessage('Sincronizando publicações...');
      const res = await sync('publicacoes.consultar', { 
        diasAtras: 1, 
        lido: false 
      });
      setStatusMessage(`Sincronização concluída! ${res.publicacoes?.length || 0} registros importados.`);
    } catch (err) {
      setStatusMessage('');
    }
  };

  const stats = {
    publicacoes: {
      label: 'Publicações Encontradas',
      value: result?.publicacoes?.length || 0,
      color: 'blue'
    },
    periodo: {
      label: 'Período de Busca',
      value: result?.periodo?.periodoBuscaFormatado || '-',
      color: 'cyan'
    },
    status: {
      label: 'Status',
      value: loading ? 'Sincronizando...' : result ? 'Concluído' : 'Pronto',
      color: loading ? 'yellow' : 'green'
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Teste Sincronismo Advise</h1>
        <p className="text-gray-600">Sincronize publicações da API com um clique</p>
      </div>

      <SyncControls 
        loading={loading}
        period="1"
        onSync={handleSync}
        label="Sincronizar Publicações"
      />

      <StatusAlert 
        status={error ? 'error' : statusMessage ? 'success' : 'idle'}
        message={error || statusMessage}
        details={result?.periodo?.periodoBuscaFormatado}
      />

      {result && (
        <>
          <StatsGrid stats={stats} />

          <div className="flex gap-2">
            <Button onClick={handleSync} disabled={loading} variant="outline" size="sm">
              Sincronizar Novamente
            </Button>
            <ExportButton data={result} filename="advise-sync" />
          </div>

          <SyncTabs result={result} loading={loading} />
        </>
      )}
    </div>
  );
}