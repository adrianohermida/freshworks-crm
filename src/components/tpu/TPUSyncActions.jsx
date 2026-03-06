import React, { useState } from 'react';
import { Download, Database, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';

export default function TPUSyncActions({ dados, tabela, onSyncComplete }) {
  const [isLoading, setIsLoading] = useState(false);
  const [ultimoSync, setUltimoSync] = useState(null);
  const [erro, setErro] = useState(null);

  const handleDownload = async (formato) => {
    if (!dados || dados.length === 0) {
      setErro('Nenhum dado para fazer download');
      return;
    }

    setIsLoading(true);
    setErro(null);

    try {
      const response = await base44.functions.invoke('downloadAndSyncTPU', {
        action: 'download',
        tabela,
        dados,
        formato
      });

      // Criar blob e fazer download
      const blob = new Blob([response.data], {
        type: formato === 'json' ? 'application/json' : 'text/csv'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tpu-${tabela}-${new Date().toISOString().split('T')[0]}.${formato}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setErro(`Erro ao fazer download: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    if (!dados || dados.length === 0) {
      setErro('Nenhum dado para sincronizar');
      return;
    }

    setIsLoading(true);
    setErro(null);

    try {
      const resultado = await base44.functions.invoke('downloadAndSyncTPU', {
        action: 'sync',
        tabela,
        dados
      });

      setUltimoSync({
        timestamp: new Date(),
        total: dados.length,
        sincronizados: resultado.data.syncRecord.total_sincronizado,
        erros: resultado.data.syncRecord.total_erros,
        status: resultado.data.syncRecord.status
      });

      if (onSyncComplete) {
        onSyncComplete(resultado.data);
      }
    } catch (error) {
      setErro(`Erro ao sincronizar: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      {/* HEADER */}
      <div>
        <h3 className="font-semibold text-lg flex items-center gap-2">
          ⚙️ Ações com Dados
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {dados?.length || 0} registros disponíveis para exportar ou sincronizar
        </p>
      </div>

      {/* ERRO */}
      {erro && (
        <div className="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded text-sm text-red-700 dark:text-red-200 flex gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {erro}
        </div>
      )}

      {/* ÚLTIMO SYNC */}
      {ultimoSync && (
        <div className={`p-3 rounded border ${
          ultimoSync.status === 'sucesso' 
            ? 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700'
            : 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700'
        }`}>
          <div className="flex gap-2">
            {ultimoSync.status === 'sucesso' ? (
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="text-sm">
              <p className="font-semibold text-green-900 dark:text-green-100">
                {ultimoSync.sincronizados} de {ultimoSync.total} sincronizados
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {ultimoSync.timestamp.toLocaleString('pt-BR')}
              </p>
              {ultimoSync.erros > 0 && (
                <p className="text-xs text-yellow-700 dark:text-yellow-200 mt-1">
                  ⚠️ {ultimoSync.erros} erros de sincronização
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BOTÕES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* DOWNLOAD JSON */}
        <Button
          onClick={() => handleDownload('json')}
          disabled={isLoading || !dados || dados.length === 0}
          variant="outline"
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          JSON
        </Button>

        {/* DOWNLOAD CSV */}
        <Button
          onClick={() => handleDownload('csv')}
          disabled={isLoading || !dados || dados.length === 0}
          variant="outline"
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          CSV
        </Button>

        {/* SINCRONIZAR */}
        <Button
          onClick={handleSync}
          disabled={isLoading || !dados || dados.length === 0}
          className="gap-2 bg-cyan-600 hover:bg-cyan-700"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Database className="w-4 h-4" />
          )}
          Sincronizar
        </Button>
      </div>

      {/* INFO */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        💡 Downloads são salvos como {dados?.length || 0} registros em formato JSON ou CSV. Sincronização salva localmente na entidade TPU{tabela.charAt(0).toUpperCase() + tabela.slice(1)}.
      </p>
    </Card>
  );
}