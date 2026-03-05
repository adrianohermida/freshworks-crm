import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle2, AlertCircle, RotateCw } from 'lucide-react';
import { useTPUSynchronization } from './useTPUSynchronization';

const TABELAS = [
  { tipo: 'classes', label: 'Classes Processuais', cor: 'blue' },
  { tipo: 'assuntos', label: 'Assuntos Processuais', cor: 'purple' },
  { tipo: 'movimentos', label: 'Movimentos Processuais', cor: 'amber' },
  { tipo: 'documentos', label: 'Documentos Processuais', cor: 'green' }
];

export default function TPUSyncPanel() {
  const [selecionadas, setSelecionadas] = useState(new Set());
  const { syncTable, isSyncing, syncProgress } = useTPUSynchronization();

  const toggleSeleção = (tipo) => {
    const nova = new Set(selecionadas);
    if (nova.has(tipo)) {
      nova.delete(tipo);
    } else {
      nova.add(tipo);
    }
    setSelecionadas(nova);
  };

  const syncSelecionadas = async () => {
    for (const tipo of selecionadas) {
      await syncTable({ tipo });
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <RotateCw className="w-5 h-5 text-blue-600" />
            Sincronização com SGT
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Seleção de Tabelas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TABELAS.map(tabela => (
              <button
                key={tabela.tipo}
                onClick={() => toggleSeleção(tabela.tipo)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selecionadas.has(tabela.tipo)
                    ? `border-${tabela.cor}-500 bg-${tabela.cor}-100`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{tabela.label}</span>
                  <Badge variant={selecionadas.has(tabela.tipo) ? 'default' : 'outline'}>
                    {syncProgress[tabela.tipo] || 'pronto'}
                  </Badge>
                </div>
              </button>
            ))}
          </div>

          {/* Botão de Sincronização */}
          <Button
            onClick={syncSelecionadas}
            disabled={selecionadas.size === 0 || isSyncing}
            className="w-full"
          >
            {isSyncing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <RotateCw className="w-4 h-4 mr-2" />
                Sincronizar {selecionadas.size > 0 ? `(${selecionadas.size})` : 'Tabelas'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}