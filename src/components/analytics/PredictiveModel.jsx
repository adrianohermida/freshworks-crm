import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { base44 } from '@/api/base44Client';

/**
 * Predictive Analytics Component
 * Integração com ML para previsões sobre casos jurídicos
 */

export default function PredictiveModel({ processId }) {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runPrediction = async () => {
    if (!processId) {
      setError('Processo não selecionado');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await base44.functions.invoke('predictiveAnalytics', {
        action: 'predict_outcome',
        process_id: processId
      });
      setPredictions(result.data);
    } catch (err) {
      setError('Erro ao executar previsão: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Predictive Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-700 dark:text-red-300 rounded text-sm">
            {error}
          </div>
        )}
        {!predictions ? (
          <Button onClick={runPrediction} disabled={loading} className="w-full">
            {loading ? 'Analisando...' : 'Executar Previsão'}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="text-sm text-gray-600 dark:text-gray-400">Prognóstico Provável</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                {predictions.likely_outcome === 'favorable' ? '✓ Favorável' : '✗ Desfavorável'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Confiança: {Math.round(predictions.confidence * 100)}%
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <p className="text-xs text-gray-600 dark:text-gray-400">Duração Estimada</p>
                <p className="font-bold">{predictions.estimated_duration_days}d</p>
              </div>
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <p className="text-xs text-gray-600 dark:text-gray-400">Taxa Sucesso</p>
                <p className="font-bold">{Math.round(predictions.success_rate_similar * 100)}%</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">⚠️ Fatores de Risco</p>
              <div className="space-y-1">
                {predictions.risk_factors.map((factor, i) => (
                  <Badge key={i} variant="outline" className="block text-left w-full">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}