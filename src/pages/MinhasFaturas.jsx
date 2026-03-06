import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileText, Download, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

const STATUS_COLORS = {
  pendente: 'bg-yellow-50 border-l-4 border-yellow-500',
  pago: 'bg-green-50 border-l-4 border-green-500',
  vencido: 'bg-red-50 border-l-4 border-red-500',
  cancelado: 'bg-gray-50 border-l-4 border-gray-400'
};

export default function MinhasFaturas() {
  const navigate = useNavigate();
  const [detalhesModal, setDetalhesModal] = useState(null);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: cliente } = useQuery({
    queryKey: ['cliente', user?.email],
    queryFn: async () => {
      const clientes = await base44.entities.Cliente.filter({ email: user?.email });
      return clientes?.[0];
    },
    enabled: !!user?.email
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
    enabled: !!user
  });

  const { data: transacoes = [] } = useQuery({
    queryKey: ['transacoes', cliente?.id],
    queryFn: () => base44.entities.TransacaoFinanceira.filter({
      cliente_id: cliente?.id,
      escritorio_id: escritorio?.[0]?.id
    }),
    enabled: !!cliente?.id && !!escritorio?.[0]?.id
  });

  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-[var(--text-primary)]">Faça login para acessar suas faturas</p>
      </div>
    );
  }

  const pendentes = transacoes.filter(t => t.status === 'pendente' || t.status === 'vencido');
  const pagas = transacoes.filter(t => t.status === 'pago');
  const totalPendente = pendentes.reduce((sum, t) => sum + (t.valor || 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Minhas Faturas</h1>
        {totalPendente > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 font-medium">Valor pendente: R$ {totalPendente.toFixed(2)}</p>
          </div>
        )}
      </div>

      <Tabs defaultValue="pendentes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="pendentes">Pendentes ({pendentes.length})</TabsTrigger>
          <TabsTrigger value="pagas">Pagas ({pagas.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pendentes" className="space-y-3">
          {pendentes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-[var(--text-secondary)]">Nenhuma fatura pendente</p>
              </CardContent>
            </Card>
          ) : (
            pendentes.map((t) => (
              <Card key={t.id} className={STATUS_COLORS[t.status]}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium capitalize">{t.tipo}</p>
                      <p className="text-sm text-[var(--text-secondary)]">{t.descricao}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Vencimento: {new Date(t.data_vencimento).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-xl font-bold text-[var(--text-primary)]">R$ {t.valor?.toFixed(2)}</p>
                      <div className={`text-xs font-medium mt-1 px-2 py-1 rounded ${
                        t.status === 'vencido' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {t.status === 'vencido' ? '⚠️ Vencido' : '⏳ Pendente'}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDetalhesModal(t)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="pagas" className="space-y-3">
          {pagas.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-[var(--text-secondary)]">Nenhuma fatura paga</p>
              </CardContent>
            </Card>
          ) : (
            pagas.map((t) => (
              <Card key={t.id} className={STATUS_COLORS[t.status]}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium capitalize">{t.tipo}</p>
                      <p className="text-sm text-[var(--text-secondary)]">{t.descricao}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Pagamento: {new Date(t.data_pagamento).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-xl font-bold text-green-600">R$ {t.valor?.toFixed(2)}</p>
                      <p className="text-xs font-medium text-green-600 mt-1">Pago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {detalhesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Detalhes da Fatura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Tipo</p>
                  <p className="font-medium capitalize">{detalhesModal.tipo}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Valor</p>
                  <p className="font-medium text-lg">R$ {detalhesModal.valor?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Status</p>
                  <p className="font-medium capitalize">{detalhesModal.status}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Vencimento</p>
                  <p className="font-medium">{new Date(detalhesModal.data_vencimento).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              {detalhesModal.descricao && (
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Descrição</p>
                  <p className="text-sm">{detalhesModal.descricao}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setDetalhesModal(null)}>
                  Fechar
                </Button>
                {['pendente', 'vencido'].includes(detalhesModal.status) && (
                  <Button 
                    className="flex-1 bg-[var(--brand-primary)]"
                    data-testid="btn-checkout-fatura"
                    onClick={() => {
                      navigate(createPageUrl('CheckoutFatura') + `?faturaId=${detalhesModal.id}`);
                      setDetalhesModal(null);
                    }}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Pagar Agora
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}