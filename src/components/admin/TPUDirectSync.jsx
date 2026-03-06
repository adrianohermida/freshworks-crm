import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, Download, CheckCircle2, Loader2 } from 'lucide-react';

export default function TPUDirectSync() {
  const [syncing, setSyncing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const tables = ['assuntos', 'classes', 'movimentos', 'documentos'];

  const syncTable = async (table) => {
    setSyncing(true);
    setError(null);
    try {
      const response = await base44.functions.invoke('tpuDirectSync', {
        table,
        pageSize: '100',
        page: '0',
      });

      setResults(response.data);
    } catch (err) {
      setError(err.message || 'Erro ao sincronizar TPU');
      console.error('Sync error:', err);
    } finally {
      setSyncing(false);
    }
  };

  const syncAll = async () => {
    setSyncing(true);
    setError(null);
    setResults(null);

    const allResults = {};
    for (const table of tables) {
      try {
        const response = await base44.functions.invoke('tpuDirectSync', { table });
        allResults[table] = response.data;
      } catch (err) {
        allResults[table] = { error: err.message };
      }
    }
    
    setResults(allResults);
    setSyncing(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sincronização TPU Direta (PJe Gateway)</h3>
        <p className="text-sm text-gray-600 mb-6">
          Sincroniza dados do TPU diretamente do gateway.cloud.pje.jus.br sem depender da API DataJud.
        </p>

        <div className="flex gap-3 flex-wrap">
          {tables.map((table) => (
            <Button
              key={table}
              onClick={() => syncTable(table)}
              disabled={syncing}
              variant="outline"
            >
              {syncing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
              {table.charAt(0).toUpperCase() + table.slice(1)}
            </Button>
          ))}
          <Button onClick={syncAll} disabled={syncing} className="bg-cyan-600 hover:bg-cyan-700">
            {syncing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
            Sincronizar Tudo
          </Button>
        </div>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Erro</p>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      {results && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Resultados</h4>
          <div className="space-y-3">
            {Array.isArray(results) ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span>Importados: {results.imported || 0}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Duplicatas: {results.duplicates || 0}</span>
                </div>
                <div className="text-sm text-gray-600">Total: {results.total || 0}</div>
              </>
            ) : (
              Object.entries(results).map(([table, data]) => (
                <div key={table} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-sm mb-2 capitalize">{table}</p>
                  {data.error ? (
                    <p className="text-sm text-red-600">{data.error}</p>
                  ) : (
                    <>
                      <p className="text-xs text-gray-600">Importados: {data.imported || 0}</p>
                      <p className="text-xs text-gray-600">Duplicatas: {data.duplicates || 0}</p>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
}