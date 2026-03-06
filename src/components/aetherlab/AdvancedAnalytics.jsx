import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Brain, BarChart3, FileText, AlertTriangle } from 'lucide-react';
import PredictiveAnalytics from '@/components/PredictiveAnalytics';
import DocumentClassification from '@/components/DocumentClassification';
import AnalyticsMetrics from '@/components/AnalyticsMetrics';

export default function AdvancedAnalytics() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['advancedAnalytics', selectedPeriod],
    queryFn: () => base44.functions.invoke('getAdvancedAnalytics', { period: selectedPeriod }).then(r => r.data),
    initialData: {}
  });

  const { data: predictions, isLoading: isPredLoading } = useQuery({
    queryKey: ['predictions'],
    queryFn: () => base44.functions.invoke('generatePredictions', {}).then(r => r.data),
    initialData: {}
  });

  const { data: classificationMetrics } = useQuery({
    queryKey: ['classificationMetrics'],
    queryFn: () => base44.functions.invoke('getClassificationMetrics', {}).then(r => r.data),
    initialData: {}
  });

  if (isLoading || isPredLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className={`inline-block animate-spin rounded-full h-8 w-8 border-b-2 mb-3 ${isDark ? 'border-blue-400' : 'border-blue-600'}`}></div>
          <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Carregando análises avançadas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-gray-950' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Brain className="w-8 h-8 text-purple-600" />
              Análises Avançadas
            </h1>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Insights inteligentes e previsões com ML
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            {['7d', '30d', '90d', 'all'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded transition ${
                  selectedPeriod === period
                    ? 'bg-purple-600 text-white'
                    : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {period === 'all' ? 'Tudo' : period}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="p-6">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Documentos Analisados</p>
              <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {analyticsData.totalDocumentsAnalyzed || 0}
              </p>
              <p className="text-xs text-green-600 mt-1">+12% vs período anterior</p>
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="p-6">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Taxa de Acurácia</p>
              <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {classificationMetrics.accuracy ? `${classificationMetrics.accuracy}%` : '0%'}
              </p>
              <p className="text-xs text-green-600 mt-1">Modelo otimizado</p>
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="p-6">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Processos em Risco</p>
              <p className={`text-3xl font-bold mt-2 text-red-600`}>
                {predictions.processesAtRisk || 0}
              </p>
              <p className="text-xs text-red-500 mt-1">Requer atenção</p>
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="p-6">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Tempo Médio Resolução</p>
              <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {analyticsData.avgResolutionDays || 0}d
              </p>
              <p className="text-xs text-green-600 mt-1">-5 dias vs baseline</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="predictive" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="predictive" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Previsões
            </TabsTrigger>
            <TabsTrigger value="classification" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Classificação
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Métricas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predictive">
            <PredictiveAnalytics predictions={predictions} isDark={isDark} />
          </TabsContent>

          <TabsContent value="classification">
            <DocumentClassification classificationMetrics={classificationMetrics} isDark={isDark} />
          </TabsContent>

          <TabsContent value="metrics">
            <AnalyticsMetrics analyticsData={analyticsData} isDark={isDark} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}