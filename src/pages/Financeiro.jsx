import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { usePerformanceTracker } from '@/components/hooks/usePerformanceTracker';
import { useUXTracker } from '@/components/hooks/useUXTracker';
import Breadcrumb from '@/components/seo/Breadcrumb';
import FinanceiroHeaderCompacta from '@/components/financeiro/FinanceiroHeaderCompacta';
import TransacaoCardCompacta from '@/components/financeiro/TransacaoCardCompacta';
import NovaTransacaoModal from '@/components/financeiro/NovaTransacaoModal';
import FluxoCaixaChart from '@/components/financeiro/charts/FluxoCaixaChart';
import ReceitasChart from '@/components/financeiro/charts/ReceitasChart';
import { reportCustomError } from '@/components/debug/ErrorLogger';
import { InstrumentedErrorBoundary } from '@/components/debug/InstrumentedErrorBoundary';

export default function Financeiro() {
  usePerformanceTracker('Financeiro');
  useUXTracker();
  
  const [filtros, setFiltros] = useState({ tipo: 'todos', status: 'todos' });
  const [showNovaTransacao, setShowNovaTransacao] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      try {
        const result = await base44.asServiceRole.entities.Escritorio.list();
        return result[0] || null;
      } catch {
        return null;
      }
    },
  });

  const { data: transacoes = [], isLoading } = useQuery({
    queryKey: ['transacoes', escritorio?.id],
    queryFn: async () => {
      if (!escritorio?.id) return [];
      try {
        return await base44.entities.TransacaoFinanceira.filter({
          escritorio_id: escritorio.id
        }, '-created_date', 100);
      } catch (error) {
        reportCustomError('Erro ao carregar transações', 'ENTITIES', error.stack);
        return [];
      }
    },
    enabled: !!escritorio?.id,
  });

  const { data: processos = [] } = useQuery({
    queryKey: ['processos', escritorio?.id],
    queryFn: async () => {
      if (!escritorio?.id) return [];
      try {
        return await base44.entities.Processo.filter({
          escritorio_id: escritorio.id
        }, '-created_date', 50);
      } catch {
        return [];
      }
    },
    enabled: !!escritorio?.id,
  });

  const transacoesFiltradas = useMemo(() => {
    return transacoes.filter((t) => {
      const tipoMatch = filtros.tipo === 'todos' || t.tipo === filtros.tipo;
      const statusMatch = filtros.status === 'todos' || t.status === filtros.status;
      return tipoMatch && statusMatch;
    });
  }, [transacoes, filtros]);

  const stats = useMemo(() => {
    const entradas = transacoes
      .filter((t) => ['honorario', 'receita'].includes(t.tipo) && t.status === 'pago')
      .reduce((sum, t) => sum + t.valor, 0);
    const saidas = transacoes
      .filter((t) => ['custa', 'despesa'].includes(t.tipo) && t.status === 'pago')
      .reduce((sum, t) => sum + t.valor, 0);
    return { entradas, saidas, saldo: entradas - saidas };
  }, [transacoes]);

  if (isLoading) {
    return (
      <InstrumentedErrorBoundary category="ROUTES">
        <div className="min-h-screen bg-[var(--bg-secondary)]">
          <FinanceiroHeaderCompacta stats={stats} onNovaTransacao={() => {}} />
        </div>
      </InstrumentedErrorBoundary>
    );
  }

  return (
    <InstrumentedErrorBoundary category="ROUTES">
      <div className="min-h-screen bg-[var(--bg-secondary)] pb-20 md:pb-0">
        <FinanceiroHeaderCompacta
          totalReceitas={stats.entradas}
          totalDespesas={stats.saidas}
          saldo={stats.saldo}
          onNovaTransacao={() => setShowNovaTransacao(true)}
          filtros={filtros}
          onFiltrosChange={setFiltros}
        />

        <div className="max-w-7xl mx-auto px-3 md:px-6 py-4">
          {transacoesFiltradas.length === 0 ? (
            <div className="text-center py-12" data-testid="empty-state-financeiro">
              <p className="text-[var(--text-secondary)] mb-4">Nenhuma transação encontrada</p>
              <button
                onClick={() => setShowNovaTransacao(true)}
                className="text-[var(--brand-primary)] hover:underline font-medium"
                data-testid="btn-registrar-vazio"
              >
                Registrar nova transação
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8" data-testid="transacoes-grid">
              {transacoesFiltradas.map((transacao) => (
                <TransacaoCardCompacta
                  key={transacao.id}
                  transacao={transacao}
                  processo={processos.find((p) => p.id === transacao.processo_id)}
                  data-testid={`transacao-card-${transacao.id}`}
                />
              ))}
            </div>
          )}

          {/* Charts - Admin only - Implementar depois */}
        </div>
      </div>

      <NovaTransacaoModal open={showNovaTransacao} onOpenChange={setShowNovaTransacao} />
    </InstrumentedErrorBoundary>
  );
}