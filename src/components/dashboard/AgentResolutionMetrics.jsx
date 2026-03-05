import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck } from 'lucide-react';

export default function AgentResolutionMetrics({ tickets }) {
  const agentStats = useMemo(() => {
    const map = {};
    tickets.forEach(ticket => {
      const agent = ticket.assigned_agent_name || ticket.assigned_agent_email;
      if (!agent) return;
      if (!map[agent]) map[agent] = { name: agent, total: 0, resolved: 0, totalTime: 0, resolvedCount: 0 };
      map[agent].total++;
      if (ticket.status === 'resolved') {
        map[agent].resolved++;
        const created = new Date(ticket.created_date);
        const updated = new Date(ticket.updated_date);
        const hours = (updated - created) / (1000 * 60 * 60);
        map[agent].totalTime += hours;
        map[agent].resolvedCount++;
      }
    });

    return Object.values(map)
      .map(a => ({
        ...a,
        resolutionRate: a.total > 0 ? Math.round((a.resolved / a.total) * 100) : 0,
        avgTime: a.resolvedCount > 0 ? (a.totalTime / a.resolvedCount).toFixed(1) : null
      }))
      .sort((a, b) => b.resolutionRate - a.resolutionRate)
      .slice(0, 6);
  }, [tickets]);

  const getColor = (rate) => {
    if (rate >= 80) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    if (rate >= 50) return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20';
    return 'text-red-600 bg-red-50 dark:bg-red-900/20';
  };

  if (agentStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserCheck className="w-4 h-4" /> Resolução por Agente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">Nenhum agente atribuído</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <UserCheck className="w-4 h-4" /> Resolução por Agente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {agentStats.map((agent) => (
            <div key={agent.name} className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{agent.name}</p>
                <p className="text-xs text-muted-foreground">
                  {agent.resolved}/{agent.total} resolvidos
                  {agent.avgTime && ` · ${agent.avgTime}h médio`}
                </p>
                <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${agent.resolutionRate}%` }}
                  />
                </div>
              </div>
              <Badge className={`shrink-0 text-xs font-bold ${getColor(agent.resolutionRate)}`}>
                {agent.resolutionRate}%
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}