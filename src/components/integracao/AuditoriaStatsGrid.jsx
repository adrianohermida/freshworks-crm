import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Clock, TrendingUp } from 'lucide-react';

export default function AuditoriaStatsGrid({ stats }) {
  const defaultStats = {
    totalSincronizacoes: 24,
    taxaSucesso: 95.8,
    duplicatasPrevenidas: 147,
    tempoMedioSegundos: 42.5,
    ultimaSincronizacao: new Date(Date.now() - 3600000).toLocaleString('pt-BR'),
    proxima: new Date(Date.now() + 82800000).toLocaleString('pt-BR')
  };

  const data = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            Taxa de Sucesso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{data.taxaSucesso}%</div>
          <p className="text-xs text-gray-500 mt-1">Sincronizações bem-sucedidas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            Duplicatas Evitadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">{data.duplicatasPrevenidas}</div>
          <p className="text-xs text-gray-500 mt-1">Registros deduplicados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Tempo Médio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{data.tempoMedioSegundos}s</div>
          <p className="text-xs text-gray-500 mt-1">Por sincronização</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            Total Sincronizações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600">{data.totalSincronizacoes}</div>
          <p className="text-xs text-gray-500 mt-1">Últimos 30 dias</p>
        </CardContent>
      </Card>
    </div>
  );
}