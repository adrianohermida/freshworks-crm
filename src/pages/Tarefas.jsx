import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, AlertCircle, CheckCircle2, Clock, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function TarefasPage() {
  const [filtroStatus, setFiltroStatus] = useState('all');
  const [filtroIntegracao, setFiltroIntegracao] = useState('all');

  const { data: tarefas = [], isLoading } = useQuery({
    queryKey: ['tarefas', filtroStatus, filtroIntegracao],
    queryFn: async () => {
      let query = {};
      if (filtroStatus !== 'all') query.status = filtroStatus;
      if (filtroIntegracao !== 'all') query.integracao = filtroIntegracao;
      
      return await base44.entities.TarefaAgendada.filter(query);
    },
    refetchInterval: 30000
  });

  const statusConfig = {
    pendente: { cor: 'bg-blue-100 text-blue-800', icon: Clock },
    criada: { cor: 'bg-purple-100 text-purple-800', icon: Zap },
    sincronizada: { cor: 'bg-green-100 text-green-800', icon: CheckCircle2 },
    concluida: { cor: 'bg-gray-100 text-gray-800', icon: CheckCircle2 },
    atrasada: { cor: 'bg-red-100 text-red-800', icon: AlertCircle },
    erro: { cor: 'bg-orange-100 text-orange-800', icon: AlertCircle }
  };

  const getDiasRestantes = (dataPrazo) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const prazo = new Date(dataPrazo);
    prazo.setHours(0, 0, 0, 0);
    const diff = Math.ceil((prazo - hoje) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getStatusColor = (dias) => {
    if (dias < 0) return 'text-red-600';
    if (dias <= 3) return 'text-orange-600';
    if (dias <= 7) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (isLoading) return <div className="p-6">Carregando tarefas...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tarefas de Prazos</h1>
          <p className="text-gray-600">Controle de publicações e prazos legais integrados com Advise</p>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="criada">Criada</SelectItem>
                <SelectItem value="sincronizada">Sincronizada</SelectItem>
                <SelectItem value="atrasada">Atrasada</SelectItem>
                <SelectItem value="erro">Erro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Integração</label>
            <Select value={filtroIntegracao} onValueChange={setFiltroIntegracao}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as integrações" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="advise">Advise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lista de tarefas */}
        <div className="grid gap-4">
          {tarefas.length === 0 ? (
            <Card>
              <CardContent className="p-8">
                <p className="text-center text-gray-500">Nenhuma tarefa encontrada</p>
              </CardContent>
            </Card>
          ) : (
            tarefas.map(tarefa => {
              const diasRestantes = getDiasRestantes(tarefa.dataPrazo);
              const StatusIcon = statusConfig[tarefa.status]?.icon || Clock;

              return (
                <Card key={tarefa.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-2 rounded-lg ${statusConfig[tarefa.status]?.cor}`}>
                          <StatusIcon className="w-5 h-5" />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Processo: {tarefa.numeroProcesso}
                          </h3>
                          <p className="text-gray-600 mt-1">{tarefa.titulo}</p>
                          
                          {tarefa.descricao && (
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                              {tarefa.descricao}
                            </p>
                          )}

                          <div className="flex gap-2 mt-3 flex-wrap">
                            <Badge variant="outline">
                              <Calendar className="w-3 h-3 mr-1" />
                              {format(new Date(tarefa.dataPrazo), 'dd MMM yyyy', { locale: ptBR })}
                            </Badge>
                            
                            <Badge className={getStatusColor(diasRestantes)}>
                              {diasRestantes < 0 
                                ? `Atrasado ${Math.abs(diasRestantes)}d`
                                : `${diasRestantes} dias`
                              }
                            </Badge>

                            {tarefa.integracao && (
                              <Badge variant="secondary">{tarefa.integracao}</Badge>
                            )}

                            <Badge variant="outline">{tarefa.diasUteis} dias úteis</Badge>
                          </div>

                          {tarefa.metadados?.municipio && (
                            <p className="text-xs text-gray-500 mt-2">
                              📍 {tarefa.metadados.municipio}
                              {tarefa.metadados.vara && ` • ${tarefa.metadados.vara}`}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">
                          {format(new Date(tarefa.dataPublicacao), 'dd/MM/yyyy')}
                        </p>
                        <p className="text-xs text-gray-500">Publicação</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Total de Tarefas</p>
              <p className="text-2xl font-bold text-gray-900">{tarefas.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Atrasadas</p>
              <p className="text-2xl font-bold text-red-600">
                {tarefas.filter(t => getDiasRestantes(t.dataPrazo) < 0).length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Próximas 3 dias</p>
              <p className="text-2xl font-bold text-orange-600">
                {tarefas.filter(t => {
                  const d = getDiasRestantes(t.dataPrazo);
                  return d >= 0 && d <= 3;
                }).length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Sincronizadas</p>
              <p className="text-2xl font-bold text-green-600">
                {tarefas.filter(t => t.status === 'sincronizada').length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}