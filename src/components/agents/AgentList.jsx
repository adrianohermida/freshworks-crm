import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader, Circle } from 'lucide-react';

export default function AgentList() {
  const [page, setPage] = useState(1);
  
  const { data: agentsData = {}, isLoading } = useQuery({
    queryKey: ['agents', page],
    queryFn: async () => {
      const response = await base44.functions.invoke('listAgents', { page, per_page: 20 });
      return response.data || {};
    }
  });

  const agents = agentsData.agents || [];
  const stateColors = {
    busy: 'bg-red-500',
    idle: 'bg-yellow-500',
    offline: 'bg-gray-500'
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Agentes</h2>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader className="w-6 h-6 animate-spin" />
        </div>
      ) : agents.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            Nenhum agente disponível
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {agents.map(agent => (
            <Card key={agent.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{agent.name}</h3>
                      <div className={`w-2 h-2 rounded-full ${stateColors[agent.state] || 'bg-gray-500'}`} />
                      <Badge variant="outline" className="text-xs">
                        {agent.state}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{agent.email}</p>
                    {agent.phone && <p className="text-xs text-gray-500">{agent.phone}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}