import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Loader2, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function TestE2E() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runE2ETests = async () => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke('e2eSyncTests', {});
      setResults(response.data);
    } catch (error) {
      setResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Testes E2E - Sincronização Crítica
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Valida: DataJud, TPU, SGT, deduplicação, isolamento multi-tenant
          </p>
        </div>

        {/* Botão Executar */}
        <Card className="p-6 dark:bg-gray-800 mb-6">
          <Button
            onClick={runE2ETests}
            disabled={loading}
            className="gap-2 bg-cyan-600 hover:bg-cyan-700"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Executando Testes...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Executar Testes E2E
              </>
            )}
          </Button>
        </Card>

        {/* Resultados */}
        {results && (
          <>
            {results.error ? (
              <Card className="p-6 dark:bg-gray-800 bg-red-50">
                <AlertCircle className="w-6 h-6 text-red-600 mb-2" />
                <p className="text-red-600 font-semibold">{results.error}</p>
              </Card>
            ) : (
              <>
                {/* Summary */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <Card className="p-4 dark:bg-gray-800">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {results.summary.total_tests}
                    </div>
                  </Card>
                  <Card className="p-4 dark:bg-gray-800 bg-green-50 dark:bg-green-900">
                    <div className="text-sm text-green-600">Passou</div>
                    <div className="text-3xl font-bold text-green-700">
                      {results.summary.passed}
                    </div>
                  </Card>
                  <Card className="p-4 dark:bg-gray-800 bg-red-50 dark:bg-red-900">
                    <div className="text-sm text-red-600">Falhou</div>
                    <div className="text-3xl font-bold text-red-700">
                      {results.summary.failed}
                    </div>
                  </Card>
                  <Card className="p-4 dark:bg-gray-800">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Taxa</div>
                    <div className="text-3xl font-bold text-cyan-600">
                      {results.summary.success_rate}%
                    </div>
                  </Card>
                </div>

                {/* Tests */}
                <div className="space-y-4">
                  {results.tests.map((test, idx) => (
                    <Card key={idx} className="p-6 dark:bg-gray-800">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold">{test.testName}</h3>
                        <Badge className={
                          test.overallStatus === 'PASS' ? 'bg-green-600' : 'bg-red-600'
                        }>
                          {test.successRate}%
                        </Badge>
                      </div>

                      <Progress value={test.successRate} className="mb-4" />

                      <div className="space-y-2">
                        {test.steps.map((step, sidx) => (
                          <div key={sidx} className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                            {step.status === 'PASS' ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="font-mono">{step.action}</p>
                              <p className="text-xs text-gray-600">{step.description}</p>
                            </div>
                            <span className="text-xs text-gray-500">{step.duration}ms</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mt-6">
                  Executado em {results.tests[0]?.startTime}
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}