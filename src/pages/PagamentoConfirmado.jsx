import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function PagamentoConfirmado() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center py-8">
      <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />
          <CardTitle>Pagamento Realizado com Sucesso!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)] text-center">
            Seu pagamento foi processado com sucesso. Um email de confirmação foi enviado para você.
          </p>

          {sessionId && (
            <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg">
              <p className="text-xs text-[var(--text-tertiary)]">ID da Sessão</p>
              <p className="font-mono text-xs break-all">{sessionId}</p>
            </div>
          )}

          <div className="space-y-2 pt-4 border-t">
            <Button
              className="w-full bg-[var(--brand-primary)]"
              onClick={() => navigate('/MinhasFaturas')}
            >
              Voltar para Minhas Faturas
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/Dashboard')}
            >
              Ir para Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}