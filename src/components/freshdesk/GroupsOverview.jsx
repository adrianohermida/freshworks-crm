import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, AlertCircle } from 'lucide-react';

export default function GroupsOverview({ groups, isLoading }) {
  if (isLoading) {
    return <div className="text-center py-8 text-slate-500">Carregando grupos...</div>;
  }

  const getSLAStatus = (compliance) => {
    if (compliance >= 90) return { color: 'bg-green-100 text-green-800', label: '✅ Excelente' };
    if (compliance >= 75) return { color: 'bg-blue-100 text-blue-800', label: '👍 Bom' };
    if (compliance >= 60) return { color: 'bg-yellow-100 text-yellow-800', label: '⚠️ Atenção' };
    return { color: 'bg-red-100 text-red-800', label: '❌ Crítico' };
  };

  return (
    <div className="space-y-4">
      {groups.length === 0 ? (
        <Card className="bg-white dark:bg-slate-800">
          <CardContent className="pt-6 text-center text-slate-500">
            Nenhum grupo de suporte encontrado
          </CardContent>
        </Card>
      ) : (
        groups.map(group => {
          const slaStatus = getSLAStatus(group.sla_compliance || 0);
          return (
            <Card key={group.id} className="bg-white dark:bg-slate-800 hover:shadow-lg transition">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-slate-500" />
                    <div>
                      <CardTitle className="text-sm">{group.name}</CardTitle>
                      {group.description && (
                        <p className="text-xs text-slate-500 mt-1">{group.description}</p>
                      )}
                    </div>
                  </div>
                  <Badge className={slaStatus.color}>
                    {slaStatus.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 mb-1">Membros</p>
                    <p className="font-bold text-lg">{group.members?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 mb-1">Tickets Abertos</p>
                    <p className="font-bold text-lg text-orange-600">{group.open_tickets_count || 0}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 mb-1">Tempo Resposta</p>
                    <p className="font-bold">{Math.round(group.avg_response_time || 0)} min</p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 mb-1">SLA Compliance</p>
                    <p className="font-bold">{(group.sla_compliance || 0).toFixed(0)}%</p>
                  </div>
                </div>

                {group.escalation_enabled && (
                  <div className="bg-blue-50 dark:bg-blue-900 p-2 rounded flex gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-blue-900 dark:text-blue-200">
                      Escalação automática: {group.escalation_rules?.timeout_minutes} min
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}