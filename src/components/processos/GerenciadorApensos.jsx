import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, Unlink, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function GerenciadorApensos() {
  const [processosPrincipal, setProcessosPrincipal] = useState('');
  const [processosApensado, setProcessosApensado] = useState('');
  const [motivo, setMotivo] = useState('');
  const queryClient = useQueryClient();

  const { data: apensos = {}, isLoading } = useQuery({
    queryKey: ['apensos'],
    queryFn: async () => {
      const response = await base44.functions.invoke('gerenciarApensos', {
        action: 'listar'
      });
      return response.data.apensos || {};
    }
  });

  const apensoMutation = useMutation({
    mutationFn: async (data) => {
      const response = await base44.functions.invoke('gerenciarApensos', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apensos'] });
      setProcessosPrincipal('');
      setProcessosApensado('');
      setMotivo('');
    }
  });

  const handleApensiar = () => {
    if (!processosPrincipal || !processosApensado) {
      alert('Preencha ambos os números de processo');
      return;
    }

    apensoMutation.mutate({
      action: 'apensiar',
      numeroProcessoPrincipal: processosPrincipal,
      numeroProcessoApensado: processosApensado,
      tipoApenso: 'apenso',
      motivo: motivo || 'Identidade de partes ou conexão'
    });
  };

  const handleDesapensiar = (procPrincipal, procApensado) => {
    if (confirm(`Desapensiar processo ${procApensado}?`)) {
      apensoMutation.mutate({
        action: 'desapensiar',
        numeroProcessoPrincipal: procPrincipal,
        numeroProcessoApensado: procApensado
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Criar Apenso */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Criar Apenso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Processo Principal</label>
              <Input
                placeholder="Ex: 0000001-12.2025.8.26.0100"
                value={processosPrincipal}
                onChange={(e) => setProcessosPrincipal(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Processo Apensado</label>
              <Input
                placeholder="Ex: 0000002-12.2025.8.26.0100"
                value={processosApensado}
                onChange={(e) => setProcessosApensado(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Motivo (opcional)</label>
              <Input
                placeholder="Ex: Identidade de partes, Conexão, etc"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
            </div>

            <Button
              onClick={handleApensiar}
              disabled={apensoMutation.isPending}
              className="w-full"
            >
              {apensoMutation.isPending ? 'Criando...' : 'Apensiar Processos'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {apensoMutation.isSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {apensoMutation.data?.message}
          </AlertDescription>
        </Alert>
      )}

      {apensoMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{apensoMutation.error?.message}</AlertDescription>
        </Alert>
      )}

      {/* Lista de Apensos */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Link className="w-4 h-4" />
          Processos Apensados ({Object.keys(apensos).length})
        </h3>

        {isLoading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : Object.keys(apensos).length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-gray-500">
              Nenhum apenso registrado
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {Object.entries(apensos).map(([principal, apensados]) => (
              <Card key={principal}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Processo Principal</CardTitle>
                  <p className="font-mono text-sm font-semibold">{principal}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {apensados.map((apenso) => (
                    <div
                      key={apenso.id}
                      className="p-2 bg-gray-50 rounded-lg flex items-center justify-between gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600">Apensado:</p>
                        <p className="font-mono text-sm truncate">
                          {apenso.numeroProcessoApensado}
                        </p>
                        {apenso.motivo && (
                          <p className="text-xs text-gray-500 mt-1">
                            {apenso.motivo}
                          </p>
                        )}
                      </div>
                      {apenso.status === 'ativo' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDesapensiar(principal, apenso.numeroProcessoApensado)
                          }
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Unlink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}