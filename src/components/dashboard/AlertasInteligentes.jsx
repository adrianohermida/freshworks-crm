import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Clock, Zap, X, RefreshCw, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AlertasInteligentes() {
  const queryClient = useQueryClient();
  const [filtroSeveridade, setFiltroSeveridade] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  // Buscar alertas
  const { data: alertas = [], isLoading: loadingAlertas } = useQuery({
    queryKey: ['alertas'],
    queryFn: () => base44.entities.Alerta.filter({ resolvido: false }),
    refetchInterval: 30000 // Refetch a cada 30 segundos
  });

  // Sincronizar alertas
  const syncMutation = useMutation({
    mutationFn: () => base44.functions.invoke('syncAlertas', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    }
  });

  // Marcar como lido
  const marcarLidoMutation = useMutation({
    mutationFn: (alertaId) => base44.entities.Alerta.update(alertaId, { lido: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    }
  });

  // Resolver alerta
  const resolverMutation = useMutation({
    mutationFn: (alertaId) => base44.entities.Alerta.update(alertaId, {
      resolvido: true,
      dataResolucao: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    }
  });

  // Filtrar alertas
  const filtrados = alertas.filter(alerta => {
    const matchSeveridade = filtroSeveridade === 'todos' || alerta.severidade === filtroSeveridade;
    const matchTipo = filtroTipo === 'todos' || alerta.tipo === filtroTipo;
    return matchSeveridade && matchTipo;
  });

  // Classificações
  const severidadeColors = {
    baixa: 'bg-blue-100 text-blue-800',
    media: 'bg-yellow-100 text-yellow-800',
    alta: 'bg-orange-100 text-orange-800',
    critica: 'bg-red-100 text-red-800'
  };

  const severidadeIcons = {
    baixa: '📋',
    media: '⚠️',
    alta: '🔴',
    critica: '🚨'
  };

  const tipoIcons = {
    prazo: '⏰',
    movimentacao: '📬',
    documento: '📄',
    audiencia: '⚖️',
    intimacao: '📨',
    vencimento: '⏳',
    importante: '⭐',
    informacao: 'ℹ️'
  };

  // Estatísticas
  const stats = {
    total: alertas.length,
    criticos: alertas.filter(a => a.severidade === 'critica').length,
    naoLidos: alertas.filter(a => !a.lido).length
  };

  return (
    <div className="space-y-6">
      {/* Header com Sync */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Alertas Inteligentes</h2>
        <Button
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
          className="gap-2"
        >
          {syncMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sincronizando...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Sincronizar
            </>
          )}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm">Total</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm">Críticos</p>
            <p className="text-3xl font-bold text-red-600">{stats.criticos}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm">Não Lidos</p>
            <p className="text-3xl font-bold text-blue-600">{stats.naoLidos}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Severidade</label>
              <select
                value={filtroSeveridade}
                onChange={(e) => setFiltroSeveridade(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="todos">Todos</option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Tipo</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="todos">Todos</option>
                <option value="prazo">Prazo</option>
                <option value="movimentacao">Movimentação</option>
                <option value="audiencia">Audiência</option>
                <option value="intimacao">Intimação</option>
              </select>
            </div>

            <div className="col-span-2 flex items-end">
              <span className="text-sm text-gray-600">
                <strong>{filtrados.length}</strong> de <strong>{alertas.length}</strong> alertas
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {loadingAlertas && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Empty */}
      {!loadingAlertas && filtrados.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Nenhum alerta pendente</p>
            <p className="text-sm text-gray-500">Parabéns! Tudo em dia</p>
          </CardContent>
        </Card>
      )}

      {/* Alertas */}
      <div className="space-y-4">
        {filtrados.sort((a, b) => {
          // Ordenar por severidade (critica > alta > media > baixa)
          const severidadeOrder = { critica: 0, alta: 1, media: 2, baixa: 3 };
          return severidadeOrder[a.severidade] - severidadeOrder[b.severidade];
        }).map((alerta) => (
          <Card
            key={alerta.id}
            className={`cursor-pointer transition-all ${
              !alerta.lido ? 'border-l-4 border-l-blue-600 bg-blue-50' : ''
            } ${alerta.severidade === 'critica' ? 'border border-red-300' : ''}`}
            onClick={() => !alerta.lido && marcarLidoMutation.mutate(alerta.id)}
          >
            <CardContent className="pt-6">
              <div className="flex gap-4">
                {/* Ícone */}
                <div className="text-3xl flex-shrink-0 mt-1">
                  {severidadeIcons[alerta.severidade]}
                </div>

                {/* Conteúdo */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-900">{alerta.titulo}</h3>
                        <Badge className={severidadeColors[alerta.severidade]}>
                          {alerta.severidade}
                        </Badge>
                        {alerta.tipo && (
                          <Badge variant="outline">
                            {tipoIcons[alerta.tipo]} {alerta.tipo}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{alerta.descricao}</p>

                      {/* Tags */}
                      {alerta.tagsAlerta && alerta.tagsAlerta.length > 0 && (
                        <div className="flex gap-2 mb-3 flex-wrap">
                          {alerta.tagsAlerta.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Ações Sugeridas */}
                      {alerta.acoesSugeridas && alerta.acoesSugeridas.length > 0 && (
                        <div className="bg-blue-50 rounded p-3 mb-3 border border-blue-100">
                          <p className="text-xs font-semibold text-blue-900 mb-2">Ações Sugeridas:</p>
                          <ul className="text-xs text-blue-800 space-y-1">
                            {alerta.acoesSugeridas.map((acao, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span>✓</span>
                                <span>{acao}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Data */}
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>
                          {alerta.dataVencimento && (
                            <>
                              ⏰ Vencimento: {format(new Date(alerta.dataVencimento), 'dd/MMM/yyyy', { locale: ptBR })}
                            </>
                          )}
                        </span>
                        {alerta.numeroProcesso && (
                          <span>📋 {alerta.numeroProcesso}</span>
                        )}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          marcarLidoMutation.mutate(alerta.id);
                        }}
                        disabled={alerta.lido || marcarLidoMutation.isPending}
                      >
                        {marcarLidoMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className={`w-4 h-4 ${alerta.lido ? 'text-green-600' : 'text-gray-400'}`} />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          resolverMutation.mutate(alerta.id);
                        }}
                        disabled={resolverMutation.isPending}
                      >
                        {resolverMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4 text-gray-400 hover:text-red-600" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}