import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutFatura() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const faturaCNJ = searchParams.get('faturaId');

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: cliente } = useQuery({
    queryKey: ['cliente-checkout', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const clientes = await base44.entities.Cliente.filter({ email: user.email });
      return clientes?.[0];
    },
    enabled: !!user?.email
  });

  const { data: fatura, isLoading: faturaLoading } = useQuery({
    queryKey: ['fatura-checkout', faturaCNJ],
    queryFn: async () => {
      if (!faturaCNJ) return null;
      try {
        const res = await base44.entities.TransacaoFinanceira.filter({
          id: faturaCNJ
        });
        return res?.[0] || null;
      } catch (error) {
        toast.error('Erro ao carregar fatura');
        return null;
      }
    },
    enabled: !!faturaCNJ
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio-checkout'],
    queryFn: () => base44.entities.Escritorio.list(),
    enabled: !!user
  });

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      setIsProcessing(true);
      try {
        const response = await base44.functions.invoke('criarCheckoutStripeFatura', {
          fatura_id: fatura.id,
          cliente_email: user.email,
          cliente_nome: cliente?.nome_completo,
          valor: fatura.valor,
          escritorio_id: escritorio?.[0]?.id
        });

        if (response.data?.url) {
          window.location.href = response.data.url;
        } else {
          throw new Error('Erro ao gerar checkout');
        }
      } catch (error) {
        toast.error('Erro ao processar pagamento: ' + error.message);
        setIsProcessing(false);
      }
    }
  });

  if (userLoading || faturaLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 font-medium mb-4">Você precisa estar autenticado</p>
        <Button onClick={() => base44.auth.redirectToLogin(window.location.pathname)}>
          Fazer Login
        </Button>
      </div>
    );
  }

  if (!fatura) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-yellow-600 font-medium">Fatura não encontrada</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] py-8">
      <div className="max-w-md mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Pagamento de Fatura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informações */}
            <div className="space-y-4">
              <div className="p-4 bg-[var(--bg-tertiary)] rounded-lg">
                <p className="text-sm text-[var(--text-secondary)]">Referência</p>
                <p className="font-medium">{fatura.descricao}</p>
              </div>

              <div className="p-4 bg-[var(--bg-tertiary)] rounded-lg">
                <p className="text-sm text-[var(--text-secondary)]">Tipo</p>
                <p className="font-medium capitalize">{fatura.tipo}</p>
              </div>

              <div className="p-4 bg-[var(--bg-tertiary)] rounded-lg">
                <p className="text-sm text-[var(--text-secondary)]">Vencimento</p>
                <p className="font-medium">
                  {new Date(fatura.data_vencimento).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <p className="text-sm text-green-700">Valor a Pagar</p>
                <p className="text-3xl font-bold text-green-600">R$ {fatura.valor.toFixed(2)}</p>
              </div>
            </div>

            {/* Aviso segurança */}
            <div className="p-3 bg-blue-50 rounded-lg flex gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">Pagamento seguro via Stripe. Seus dados estão protegidos.</p>
            </div>

            {/* Botões */}
            <div className="space-y-2 pt-4 border-t">
              <Button
                className="w-full bg-[var(--brand-primary)]"
                disabled={checkoutMutation.isPending || isProcessing}
                onClick={() => checkoutMutation.mutate()}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Pagar Agora'
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(-1)}
                disabled={isProcessing}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-[var(--text-tertiary)] mt-4">
          Ao clicar em "Pagar Agora", você será redirecionado para o Stripe.
        </p>
      </div>
    </div>
  );
}