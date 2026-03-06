import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import TarefasList from '@/components/tarefas/TarefasList';
import TarefasHeader from '@/components/tarefas/TarefasHeader';

export default function Tarefas() {
  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0] || null;
    },
    enabled: !!user
  });

  const { data: tarefas = [], refetch } = useQuery({
    queryKey: ['tarefas', escritorio?.id],
    queryFn: () => {
      if (!escritorio?.id) return [];
      return base44.entities.Tarefa.filter({ status: 'pendente', escritorio_id: escritorio.id }, '-data_vencimento', 50);
    },
    enabled: !!escritorio?.id
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <TarefasHeader />
        <TarefasList tarefas={tarefas} onUpdate={refetch} />
      </div>
    </div>
  );
}