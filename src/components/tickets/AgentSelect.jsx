import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader } from 'lucide-react';

export default function AgentSelect({ value, onChange, disabled }) {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const response = await base44.functions.invoke('getAgents');
        if (response.data?.error) {
          setError(response.data.error);
        } else {
          setAgents(response.data?.agents || []);
        }
      } catch (err) {
        setError('Erro ao carregar agentes');
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, []);

  if (loading) {
    return <Loader className="w-4 h-4 animate-spin" />;
  }

  if (error) {
    return <span className="text-sm text-red-600">{error}</span>;
  }

  return (
    <Select value={value || ''} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecionar agente..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={null}>Sem atribuição</SelectItem>
        {agents.map(agent => (
          <SelectItem key={agent.id} value={String(agent.id)}>
            {agent.name} ({agent.email})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}