/**
 * SincronizarDataJudButton
 * Botão de sincronização manual com DataJud + feedback de status.
 */
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function SincronizarDataJudButton({ processo }) {
  const queryClient = useQueryClient();
  const [resultado, setResultado] = useState(null);

  const syncMutation = useMutation({
    mutationFn: () => base44.functions.invoke('sincronizarProcessoDataJud', {
      numeroProcesso: processo.numero_processo,
      processoCEJUSCId: processo.id,
    }),
    onSuccess: (res) => {
      const data = res?.data || res;
      setResultado(data);
      if (data?.status === 'sucesso') {
        const novos = data.movimentosNovos || 0;
        toast.success(`Sincronizado! ${novos > 0 ? `${novos} movimentação(ões) nova(s)` : 'Sem novidades'}`);
        queryClient.invalidateQueries({ queryKey: ['processo', processo.id] });
        queryClient.invalidateQueries({ queryKey: ['andamentos-processuais', processo.id] });
        queryClient.invalidateQueries({ queryKey: ['andamentos', processo.id] });
      } else {
        toast.error('Falha ao sincronizar: ' + (data?.erro || 'erro desconhecido'));
      }
    },
    onError: (e) => toast.error('Erro: ' + e.message),
  });

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        size="sm"
        variant="outline"
        onClick={() => syncMutation.mutate()}
        disabled={syncMutation.isPending}
        className="gap-1.5 text-xs border-[#212373] text-[#212373] hover:bg-[#212373] hover:text-white"
      >
        {syncMutation.isPending
          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : <RefreshCw className="w-3.5 h-3.5" />}
        {syncMutation.isPending ? 'Sincronizando...' : 'Sincronizar DataJud'}
      </Button>

      {resultado?.status === 'sucesso' && (
        <Badge className="bg-emerald-100 text-emerald-800 text-xs gap-1">
          <CheckCircle2 className="w-3 h-3" />
          {resultado.movimentosNovos || 0} novos · {resultado.movimentosTotal || 0} total
        </Badge>
      )}
      {resultado?.status === 'erro' && (
        <Badge className="bg-red-100 text-red-800 text-xs gap-1">
          <AlertCircle className="w-3 h-3" />
          {resultado.erro}
        </Badge>
      )}

      {processo.ultima_sincronizacao && !resultado && (
        <span className="text-xs text-slate-400">
          Última: {format(new Date(processo.ultima_sincronizacao), "dd/MM HH:mm", { locale: ptBR })}
        </span>
      )}
    </div>
  );
}