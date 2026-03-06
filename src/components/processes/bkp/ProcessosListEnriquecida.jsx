/**
 * ProcessosListEnriquecida - Lista de processos com enriquecimento TPU integrado
 * Suporta: filtragem, busca, paginação, sincronização manual
 */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, RefreshCw, Plus, Filter } from 'lucide-react';
import { toast } from 'sonner';
import ProcessoEnriquecidoCard from './ProcessoEnriquecidoCard';

export default function ProcessosListEnriquecida({ clienteId, onProcessoSelect }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const queryClient = useQueryClient();

  const handleProcessoSelect = (processo) => {
    if (onProcessoSelect) {
      onProcessoSelect(processo);
    } else {
      // Se não houver callback, navega diretamente para o detalhe
      navigate(`/ProcessoDetalhe/${processo.id}`);
    }
  };

  const { data: processos = [], isLoading } = useQuery({
    queryKey: ['processos', clienteId],
    queryFn: async () => {
      if (!clienteId) return [];
      return await base44.entities.ProcessoCEJUSC.filter(
        { cliente_id: clienteId },
        '-updated_date',
        500
      );
    },
    enabled: !!clienteId,
  });

  // Filtros
  const filtrados = useMemo(() => {
    let result = processos;

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p =>
        p.numero_processo?.toLowerCase().includes(s) ||
        p.descricao?.toLowerCase().includes(s) ||
        p.tribunal?.toLowerCase().includes(s)
      );
    }

    if (statusFilter !== 'todos') {
      result = result.filter(p => p.status === statusFilter);
    }

    return result;
  }, [processos, search, statusFilter]);

  const paginados = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtrados.slice(start, start + pageSize);
  }, [filtrados, page]);

  const totalPages = Math.ceil(filtrados.length / pageSize);

  const sincronizarMutation = useMutation({
    mutationFn: async (processoId) => {
      const res = await base44.functions.invoke('sincronizarProcessoDataJud', {
        processo_id: processoId,
      });
      return res.data;
    },
    onSuccess: (data, processoId) => {
      queryClient.invalidateQueries({ queryKey: ['processos', clienteId] });
      toast.success('Processo sincronizado com DataJud');
    },
    onError: (err) => {
      toast.error('Erro ao sincronizar: ' + err.message);
    },
  });

  const statusCounts = useMemo(() => {
    const counts = {};
    processos.forEach(p => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return counts;
  }, [processos]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Processos Enriquecidos com TPU</h2>
        <p className="text-sm text-slate-500 mt-1">
          {filtrados.length} processo{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Busca e filtros */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por número, descrição ou tribunal..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-slate-200 rounded-md text-sm bg-white hover:border-slate-300"
        >
          <option value="todos">Todos os status</option>
          <option value="aberto">Aberto</option>
          <option value="em_audiencia">Em Audiência</option>
          <option value="acordo">Acordo</option>
          <option value="finalizado">Finalizado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {/* Status badges */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Badge
            key={status}
            variant={statusFilter === status ? 'default' : 'outline'}
            onClick={() => setStatusFilter(statusFilter === status ? 'todos' : status)}
            className="cursor-pointer"
          >
            {status.replace(/_/g, ' ')}: {count}
          </Badge>
        ))}
      </div>

      {/* Lista de processos */}
      {isLoading ? (
        <div className="text-center py-8 text-slate-500">Carregando processos...</div>
      ) : filtrados.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-slate-500">
            Nenhum processo encontrado
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3">
            {paginados.map(processo => (
              <ProcessoEnriquecidoCard
                key={processo.id}
                processo={processo}
                onClick={() => handleProcessoSelect(processo)}
                onEnrichmentComplete={() => {
                  queryClient.invalidateQueries({ queryKey: ['processos', clienteId] });
                }}
              />
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                Página {page} de {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(Math.max(1, page - 1))}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}