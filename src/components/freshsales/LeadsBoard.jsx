import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function LeadsBoard({ leads, isLoading }) {
  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    qualified: 'bg-purple-100 text-purple-800',
    contacted: 'bg-cyan-100 text-cyan-800',
    proposal: 'bg-orange-100 text-orange-800',
    negotiation: 'bg-yellow-100 text-yellow-800',
    won: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800'
  };

  const sortedLeads = [...leads].sort((a, b) => {
    const scoreA = a.freddy_score || 0;
    const scoreB = b.freddy_score || 0;
    return scoreB - scoreA;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse text-slate-500">Carregando leads...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedLeads.length === 0 ? (
        <Card className="bg-white dark:bg-slate-800">
          <CardContent className="pt-6 text-center text-slate-500">
            Nenhum lead encontrado. Sincronize dados do Freshsales.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedLeads.map((lead) => (
            <Card
              key={lead.id}
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-semibold line-clamp-2">
                    {lead.title}
                  </CardTitle>
                  {lead.freddy_score && (
                    <Badge className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white ml-2">
                      {lead.freddy_score.toFixed(0)}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Value */}
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-semibold">
                    R$ {lead.value?.toLocaleString('pt-BR')}
                  </span>
                </div>

                {/* Status & Probability */}
                <div className="flex gap-2 flex-wrap">
                  <Badge className={statusColors[lead.status] || 'bg-slate-100'}>
                    {lead.status}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50">
                    {lead.probability}% prob
                  </Badge>
                </div>

                {/* Close Date */}
                {lead.expected_close_date && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(lead.expected_close_date), 'dd MMM yyyy')}
                  </div>
                )}

                {/* Freddy Recommendation */}
                {lead.next_action && (
                  <div className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-slate-700 dark:to-slate-700 p-2 rounded text-xs">
                    <p className="font-semibold text-cyan-900 dark:text-cyan-300">Próxima ação:</p>
                    <p className="text-slate-700 dark:text-slate-300">{lead.next_action}</p>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  variant="outline"
                  className="w-full text-xs h-8"
                >
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}