import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import UnifiedDocumentList from '../components/advise/UnifiedDocumentList';
import { Card, CardContent } from "@/components/ui/card";

export default function IntimacoesDashboard() {
  const queryClient = useQueryClient();

  const { data: intimacoes = [], isLoading, refetch } = useQuery({
    queryKey: ['intimacoes'],
    queryFn: () => base44.entities.IntimacaoAdvise.list(),
    enabled: false,
    staleTime: Infinity
  });

  const syncMutation = useMutation({
    mutationFn: () => base44.functions.invoke('syncAdviseIntimacoes', {}),
    onSuccess: () => refetch()
  });

  const stats = {
    total: intimacoes.length,
    pendentes: intimacoes.filter(i => i.statusIntimacao === 'pendente').length,
    recebidas: intimacoes.filter(i => i.statusIntimacao === 'recebida').length,
    cumpridas: intimacoes.filter(i => i.statusIntimacao === 'cumprida').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Intimações</h1>
          <p className="text-gray-600">Monitore intimações e prazos de seus processos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-6"><p className="text-gray-600 text-sm">Total</p><p className="text-3xl font-bold text-gray-900">{stats.total}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-gray-600 text-sm">Pendentes</p><p className="text-3xl font-bold text-yellow-600">{stats.pendentes}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-gray-600 text-sm">Recebidas</p><p className="text-3xl font-bold text-blue-600">{stats.recebidas}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-gray-600 text-sm">Cumpridas</p><p className="text-3xl font-bold text-green-600">{stats.cumpridas}</p></CardContent></Card>
        </div>

        {/* Unified List */}
        <UnifiedDocumentList
          documents={intimacoes}
          isLoading={isLoading}
          type="intimacao"
          onSync={() => syncMutation.mutate()}
          syncLoading={syncMutation.isPending}
          title="Intimações"
        />
      </div>
    </div>
  );
}