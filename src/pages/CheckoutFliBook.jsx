import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Book, CreditCard, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ModuleHeader from '@/components/cliente/ModuleHeader';
import ResumeLoader from '@/components/common/ResumeLoader';
import { toast } from 'sonner';

export default function CheckoutFliBook() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const assinante_id = searchParams.get('assinante_id');

  const { data: assinante, isLoading } = useQuery({
    queryKey: ['assinante-checkout', assinante_id],
    queryFn: async () => {
      if (!assinante_id) return null;
      const assinantes = await base44.entities.AssinanteFliBook.filter({
        id: assinante_id
      });
      return assinantes[0] || null;
    },
    enabled: !!assinante_id
  });

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('criarCheckoutStripeFliBook', {
        assinante_id: assinante_id
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    },
    onError: (error) => {
      toast.error(`Erro ao criar checkout: ${error.message}`);
    }
  });

  if (isLoading) return <ResumeLoader />;

  if (!assinante) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)]">
        <ModuleHeader
          title="Checkout FliBOOK"
          icon={Book}
          breadcrumbItems={[
            { label: 'Plano FliBOOK', url: '/plano-flipbook' },
            { label: 'Checkout' }
          ]}
        />
        <div className="max-w-2xl mx-auto p-4 md:p-6 text-center">
          <p className="text-[var(--text-secondary)]">Assinatura não encontrada</p>
          <Button onClick={() => navigate('/plano-flipbook')} className="mt-4">
            Voltar aos Planos
          </Button>
        </div>
      </div>
    );
  }

  const isParcelado = assinante.plano === 'anual_parcelado_12x';

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <ModuleHeader
        title="Checkout FliBOOK"
        icon={Book}
        breadcrumbItems={[
          { label: 'Plano FliBOOK', url: '/plano-flipbook' },
          { label: 'Checkout' }
        ]}
      />

      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <Button
          onClick={() => navigate('/plano-flipbook')}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Resumo do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between pb-3 border-b border-[var(--border-primary)]">
              <span className="text-[var(--text-secondary)]">Plano</span>
              <span className="font-semibold">
                {isParcelado ? 'Anual em 12x' : 'Anual à Vista'}
              </span>
            </div>

            <div className="flex justify-between pb-3 border-b border-[var(--border-primary)]">
              <span className="text-[var(--text-secondary)]">Forma de Pagamento</span>
              <span className="font-semibold">
                {isParcelado ? '12 parcelas no cartão' : 'Pagamento único'}
              </span>
            </div>

            <div className="flex justify-between pb-3 border-b border-[var(--border-primary)]">
              <span className="text-[var(--text-secondary)]">Email</span>
              <span className="font-semibold text-sm">{assinante.cliente_email}</span>
            </div>

            <div className="flex justify-between pt-4">
              <span className="font-bold">Total</span>
              <div className="text-right">
                <div className="font-bold text-[var(--brand-primary)] text-2xl">
                  R$ {assinante.valor_total.toFixed(2)}
                </div>
                {isParcelado && (
                  <p className="text-xs text-[var(--text-secondary)]">
                    12x de R$ 29,90
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Button */}
        <Button
          onClick={() => checkoutMutation.mutate()}
          disabled={checkoutMutation.isPending}
          className="w-full bg-[var(--brand-primary)] h-12 text-base"
        >
          {checkoutMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Redirecionando...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Pagar com Stripe
            </>
          )}
        </Button>

        {/* Security */}
        <p className="text-xs text-[var(--text-secondary)] text-center mt-4">
          🔒 Pagamento seguro processado pelo Stripe
        </p>
      </div>
    </div>
  );
}