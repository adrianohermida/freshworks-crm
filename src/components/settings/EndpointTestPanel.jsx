import React, { useState } from 'react';
import { Play, CheckCircle2, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useAnalytics } from '../analytics/useAnalytics';

const statusIcons = {
  success: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900' },
  failed: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900' },
  timeout: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900' },
  not_tested: { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-50 dark:bg-gray-800' }
};

export default function EndpointTestPanel({
  courts = [],
  onTest,
  isLoading = false
}) {
  const [filter, setFilter] = useState('all');
  const [testResults, setTestResults] = useState({});
  const { trackEvent } = useAnalytics();

  const filteredCourts = courts.filter(c => 
    filter === 'all' || c.category === filter
  );

  const handleTest = async (court) => {
    try {
      const result = await onTest(court);
      setTestResults(prev => ({ ...prev, [court.alias]: result }));
      
      // Track analytics
      trackEvent({
        event_type: 'endpoint_tested',
        entity_type: 'endpoint',
        entity_id: court.alias,
        action: `Testou endpoint ${court.name}`,
        value: result?.responseTime || 0,
        metadata: {
          tribunal: court.name,
          categoria: court.category,
          status: result?.status
        },
        status: result?.status === 'success' ? 'success' : 'error'
      });
    } catch (error) {
      // Track analytics
      trackEvent({
        event_type: 'endpoint_tested',
        entity_type: 'endpoint',
        entity_id: court.alias,
        action: `Erro ao testar ${court.name}`,
        metadata: { error: error.message },
        status: 'error'
      });

      window.dispatchEvent(new CustomEvent('toast', {
        detail: { type: 'error', message: `Erro ao testar ${court.name}` }
      }));
    }
  };

  const handleTestAll = async () => {
    for (const court of filteredCourts) {
      await handleTest(court);
      await new Promise(r => setTimeout(r, 500)); // Delay entre testes
    }
  };

  const getStatusConfig = (court) => {
    const result = testResults[court.alias];
    const status = result?.status || court.last_test_status || 'not_tested';
    return statusIcons[status];
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold">Teste de Endpoints</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Teste a conectividade dos endpoints do DataJud por tribunal
          </p>
        </div>
        <Button
          onClick={handleTestAll}
          disabled={isLoading}
          className="gap-2"
          aria-busy={isLoading}
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          <Play className="w-4 h-4" />
          Testar Todos
        </Button>
      </div>

      {/* FILTER */}
      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Tribunais</SelectItem>
          <SelectItem value="superior">Tribunais Superiores</SelectItem>
          <SelectItem value="federal">Justiça Federal</SelectItem>
          <SelectItem value="estadual">Justiça Estadual</SelectItem>
          <SelectItem value="trabalho">Justiça do Trabalho</SelectItem>
          <SelectItem value="eleitoral">Justiça Eleitoral</SelectItem>
          <SelectItem value="militar">Justiça Militar</SelectItem>
        </SelectContent>
      </Select>

      {/* COURTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourts.map(court => {
          const result = testResults[court.alias];
          const config = getStatusConfig(court);
          const Icon = config.icon;

          return (
            <Card key={court.alias} className="p-4">
              <div className="space-y-4">
                {/* HEADER */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{court.name}</p>
                    <p className="text-xs text-gray-500">{court.alias}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${config.bg}`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                </div>

                {/* STATUS */}
                {result && (
                  <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-medium capitalize">{result.status}</span>
                    </div>
                    {result.responseTime && (
                      <div className="flex justify-between">
                        <span>Tempo:</span>
                        <span className="font-medium">{result.responseTime}ms</span>
                      </div>
                    )}
                    {result.recordsFound !== undefined && (
                      <div className="flex justify-between">
                        <span>Registros:</span>
                        <span className="font-medium">{result.recordsFound}</span>
                      </div>
                    )}
                    {result.errorMessage && (
                      <div className="text-red-600 dark:text-red-400 mt-2">
                        {result.errorMessage}
                      </div>
                    )}
                  </div>
                )}

                {/* LAST TEST */}
                {court.last_test_at && !result && (
                  <p className="text-xs text-gray-500">
                    Último teste: {new Date(court.last_test_at).toLocaleDateString('pt-BR')}
                  </p>
                )}

                {/* TEST BUTTON */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTest(court)}
                  disabled={isLoading}
                  className="w-full gap-2"
                >
                  <Play className="w-3 h-3" />
                  Testar
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}