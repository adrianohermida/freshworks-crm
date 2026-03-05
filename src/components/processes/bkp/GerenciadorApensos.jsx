import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Link2, Unlink2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function GerenciadorApensos({ processo }) {
  const [novoApenso, setNovoApenso] = useState('');
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  // Buscar processos apensados
  const { data: apensos = [], isLoading } = useQuery({
    queryKey: ['apensos', processo?.id],
    queryFn: async () => {
      if (!processo?.id) return [];
      const procs = await base44.entities.ProcessoCEJUSC.filter({
        apensos: { $contains: processo.numero_processo }
      });
      return procs;
    },
    enabled: !!processo?.id,
  });

  // Buscar processos vinculados (apensados a este)
  const { data: processosApensados = [] } = useQuery({
    queryKey: ['processosApensados', processo?.numero_processo],
    queryFn: async () => {
      if (!processo?.numero_processo) return [];
      const data = await base44.entities.ProcessoCEJUSC.get(processo.id);
      if (data?.apensos && Array.isArray(data.apensos)) {
        const procs = await Promise.all(
          data.apensos.map(num => 
            base44.entities.ProcessoCEJUSC.filter({ numero_processo: num }).then(r => r[0])
          )
        );
        return procs.filter(p => p);
      }
      return [];
    },
    enabled: !!processo?.id,
  });

  // Adicionar apenso
  const adicionarMutation = useMutation({
    mutationFn: async () => {
      if (!novoApenso.trim()) {
        throw new Error('Número do processo obrigatório');
      }

      // Verificar se processo existe
      const procExistente = await base44.entities.ProcessoCEJUSC.filter({
        numero_processo: novoApenso.trim()
      });
      if (!procExistente || procExistente.length === 0) {
        throw new Error('Processo não encontrado');
      }

      // Atualizar apensos do processo atual
      const apensosList = Array.isArray(processo.apensos) ? [...processo.apensos] : [];
      if (!apensosList.includes(novoApenso.trim())) {
        apensosList.push(novoApenso.trim());
      }

      await base44.entities.ProcessoCEJUSC.update(processo.id, {
        apensos: apensosList
      });
    },
    onSuccess: () => {
      setNovoApenso('');
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['processosApensados', processo?.numero_processo] });
      queryClient.invalidateQueries({ queryKey: ['apensos', processo?.id] });
      toast.success('Apenso adicionado com sucesso');
    },
    onError: (err) => toast.error('Erro: ' + err.message),
  });

  // Remover apenso
  const removerMutation = useMutation({
    mutationFn: async (numeroApenso) => {
      const apensosList = Array.isArray(processo.apensos) ? processo.apensos.filter(a => a !== numeroApenso) : [];
      await base44.entities.ProcessoCEJUSC.update(processo.id, { apensos: apensosList });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processosApensados', processo?.numero_processo] });
      queryClient.invalidateQueries({ queryKey: ['apensos', processo?.id] });
      toast.success('Apenso removido');
    },
    onError: (err) => toast.error('Erro ao remover: ' + err.message),
  });

  if (!processo) return <p className="text-slate-500">Selecione um processo primeiro</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-700">Gerenciamento de Apensos ({processosApensados.length})</h3>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="w-4 h-4" /> Vincular Apenso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Vincular Processo Apensado</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Número do Processo Apensado</label>
                <Input
                  placeholder="0001234-56.2024.8.26.0000"
                  value={novoApenso}
                  onChange={(e) => setNovoApenso(e.target.value)}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                <Button
                  onClick={() => adicionarMutation.mutate()}
                  disabled={adicionarMutation.isPending}
                  className="gap-1"
                >
                  {adicionarMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Adicionando...
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4" />
                      Vincular
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Carregando...
        </div>
      ) : processosApensados.length === 0 ? (
        <Card className="bg-slate-50">
          <CardContent className="py-6 text-center text-slate-500 text-sm">
            Nenhum processo apensado. Clique em "Vincular Apenso" para adicionar.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {processosApensados.map((apenso) => (
            <Card key={apenso.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{apenso.numero_processo}</p>
                    <p className="text-xs text-slate-600 mt-1">{apenso.tribunal} - {apenso.classe_judicial || 'Sem classe'}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs bg-blue-50">{apenso.status}</Badge>
                      <Badge variant="outline" className="text-xs bg-green-50">Apensado</Badge>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removerMutation.mutate(apenso.numero_processo)}
                    disabled={removerMutation.isPending}
                    className="hover:bg-red-50 text-red-600"
                  >
                    <Unlink2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}