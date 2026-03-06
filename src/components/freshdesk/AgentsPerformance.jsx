import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Award } from 'lucide-react';

export default function AgentsPerformance({ agents, isLoading }) {
  if (isLoading) {
    return <div className="text-center py-8 text-slate-500">Carregando agentes...</div>;
  }

  const sortedByRating = [...agents].sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4) return 'text-blue-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Performer */}
        {sortedByRating[0] && (
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700 border-2 border-green-200 dark:border-green-600">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-green-600" />
                <CardTitle className="text-sm">Top Agente</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-semibold text-green-900 dark:text-green-200">
                {sortedByRating[0].name}
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Rating: <span className={`font-bold ${getRatingColor(sortedByRating[0].rating)}`}>
                  {sortedByRating[0].rating?.toFixed(1)}/5
                </span>
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Resolvidos: {sortedByRating[0].tickets_resolved}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Total Agentes */}
        <Card className="bg-white dark:bg-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total de Agentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{agents.length}</p>
            <p className="text-xs text-slate-500">Na equipe</p>
          </CardContent>
        </Card>

        {/* Média de Rating */}
        <Card className="bg-white dark:bg-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Star className="w-4 h-4" /> Rating Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(agents.reduce((sum, a) => sum + (a.rating || 0), 0) / agents.length).toFixed(1)}
            </p>
            <p className="text-xs text-slate-500">Avaliação geral</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Agentes */}
      <Card className="bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-sm">Todos os Agentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {sortedByRating.map(agent => (
              <div key={agent.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded text-xs">
                <div>
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-slate-500 dark:text-slate-400">{agent.email}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${getRatingColor(agent.rating)}`}>
                    {agent.rating?.toFixed(1)}★
                  </p>
                  <p className="text-slate-500">{agent.tickets_resolved} resolvidos</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}