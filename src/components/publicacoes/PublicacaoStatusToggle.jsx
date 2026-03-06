import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function PublicacaoStatusToggle({ publicacao, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleToggleStatus = async () => {
    try {
      setIsLoading(true);

      const action = publicacao.lido ? 'desmarcar' : 'marcar';
      const endpoint = publicacao.lido 
        ? 'advise/endpoints/publicacoesDesmarcarLido'
        : 'advise/endpoints/publicacoesMarcarLido';

      const response = await base44.functions.invoke(endpoint, {
        itens: [
          {
            idMovProcessoCliente: publicacao.idMovProcessoCliente || publicacao.id
          }
        ]
      });

      if (response.data.success) {
        // Invalidar queries
        queryClient.invalidateQueries({ queryKey: ['publicacoes'] });
        queryClient.invalidateQueries({ queryKey: ['publicacoes-paginadas'] });

        onSuccess?.({
          id: publicacao.id,
          lido: !publicacao.lido,
          acao: action
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleToggleStatus}
      disabled={isLoading}
      variant="ghost"
      size="sm"
      className="gap-2"
      title={publicacao.lido ? 'Marcar como não lido' : 'Marcar como lido'}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : publicacao.lido ? (
        <CheckCircle2 className="w-4 h-4 text-green-600" />
      ) : (
        <Circle className="w-4 h-4 text-gray-400" />
      )}
      <span className="text-xs">
        {publicacao.lido ? 'Lido' : 'Não lido'}
      </span>
    </Button>
  );
}