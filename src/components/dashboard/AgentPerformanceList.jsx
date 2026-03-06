import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AgentPerformanceList({ agents }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agentes Mais Ativos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-80 overflow-y-auto">
          {agents.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum agente atribuído</p>
          ) : (
            agents.map((agent, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{agent.name}</p>
                  <p className="text-xs text-gray-500">{agent.count} tickets</p>
                </div>
                <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-turquoise-600"
                    style={{ width: `${(agent.count / Math.max(...agents.map(a => a.count), 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}