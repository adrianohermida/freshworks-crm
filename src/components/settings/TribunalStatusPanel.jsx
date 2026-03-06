import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TRIBUNAIS, agruparTribunaisPorCategoria } from '../../functions/utils/tribunaisData';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

const CATEGORIA_LABELS = {
  superior: '🏛️ Tribunais Superiores',
  federal: '⚖️ Justiça Federal',
  estadual: '📋 Justiça Estadual',
  trabalho: '💼 Justiça do Trabalho',
  eleitoral: '🗳️ Justiça Eleitoral',
  militar: '🎖️ Justiça Militar'
};

export default function TribunalStatusPanel() {
  const [tribunaisStatus, setTribunaisStatus] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    testarTribunais();
  }, []);

  const testarTribunais = async () => {
    setLoading(true);
    const status = {};

    if (Array.isArray(TRIBUNAIS)) {
      for (const tribunal of TRIBUNAIS) {
        try {
          const response = await fetch(tribunal.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: { match_all: {} },
              size: 0
            }),
            timeout: 5000
          });

          status[tribunal.alias] = {
            online: response.ok,
            statusCode: response.status
          };
        } catch (error) {
          status[tribunal.alias] = {
            online: false,
            erro: error.message
          };
        }
      }
    }

    setTribunaisStatus(status);
    setLoading(false);
  };

  const tribunaisPorCategoria = agruparTribunaisPorCategoria();
  const totalOnline = Object.values(tribunaisStatus).filter(s => s.online).length;

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            📡 Status dos Tribunais
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {totalOnline}/{Array.isArray(TRIBUNAIS) ? TRIBUNAIS.length : 0} tribunais disponíveis
          </p>
        </div>
        <Button
          onClick={testarTribunais}
          disabled={loading}
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Testar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(tribunaisPorCategoria).map(([categoria, tribunais]) => (
          <Card key={categoria} className="p-4 bg-gray-50 dark:bg-gray-800">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
              {CATEGORIA_LABELS[categoria]}
            </h4>
            <div className="space-y-2">
              {tribunais.map(tribunal => {
                const status = tribunaisStatus[tribunal.alias];
                return (
                  <div key={tribunal.alias} className="flex items-center justify-between text-xs">
                    <span className="text-gray-700 dark:text-gray-300">
                      {tribunal.nome}
                    </span>
                    {!loading && status ? (
                      <Badge className={status.online ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {status.online ? '✓ OK' : '✗ Erro'}
                      </Badge>
                    ) : (
                      <Badge variant="outline">...</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {Array.isArray(TRIBUNAIS) && totalOnline === TRIBUNAIS.length && (
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg border border-green-200 dark:border-green-700">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900 dark:text-green-100">
                Todos os tribunais disponíveis!
              </p>
              <p className="text-xs text-green-800 dark:text-green-200 mt-1">
                Você pode buscar processos em qualquer tribunal do Brasil
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}