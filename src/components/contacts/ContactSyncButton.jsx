import React from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactSyncButton() {
  const queryClient = useQueryClient();

  const syncMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('syncContacts', {});
      if (response.data?.error) throw new Error(response.data.error);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`✓ ${data.message}`);
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    }
  });

  return (
    <Button
      onClick={() => syncMutation.mutate()}
      disabled={syncMutation.isPending}
      variant="outline"
      className="gap-2"
    >
      {syncMutation.isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <RefreshCw className="w-4 h-4" />
      )}
      {syncMutation.isPending ? 'Sincronizando...' : 'Sincronizar do Freshdesk'}
    </Button>
  );
}