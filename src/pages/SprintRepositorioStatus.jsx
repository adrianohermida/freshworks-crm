import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';

export default function SprintRepositorioStatus() {
  const [activeSprint, setActiveSprint] = useState('sprint-1');

  // SPRINT 1 - FASE 1 (CONCLUÍDO)
  const sprint1 = {
    numero: 1,
    titulo: 'FASE 1: Estrutura Base do Repositório Global',
    status: 'CONCLUÍDO ✅',
    progresso: 100,
    tarefas: [
      { 
        id: 1, 
        titulo: 'Criar entidade ProcessoRepositorio', 
        status: 'concluido',
        detalhes: 'Campos: cnj_number, tribunal, classe, assunto, data_verificacao, hash, datajud_raw_data'
      },
      { 
        id: 2, 
        titulo: 'Criar entidade ProcessoUsuario', 
        status: 'concluido',
        detalhes: 'Associação: usuario + processo + papel + notas + favorito'
      },
      { 
        id: 3, 
        titulo: 'Criar entidade TribunalHierarquia', 
        status: 'concluido',
        detalhes: 'Hierarquia: Tribunal → Instância → Órgão'
      },
      { 
        id: 4, 
        titulo: 'Implementar função syncProcessoRepositorio()', 
        status: 'concluido',
        detalhes: 'Hash para deduplicação, associação com usuário, tratamento de duplicatas'
      },
      { 
        id: 5, 
        titulo: 'Implementar função searchProcessoRepositorio()', 
        status: 'concluido',
        detalhes: 'Busca por CNJ, tribunal, classe, órgão com paginação'
      },
      { 
        id: 6, 
        titulo: 'Criar interface ProcessoRepositorioManager', 
        status: 'concluido',
        detalhes: 'Barra de busca, resultados, métricas (cache, redução API, latência)'
      }
    ],
    metricas: {
      apiReduction: '80-95%',
      responseTime: '< 100ms',
      offlineAvailable: true
    }
  };

  // SPRINT 2 - FASE 2 (EM EXECUÇÃO)
  const sprint2 = {
    numero: 2,
    titulo: 'FASE 2: Busca Avançada com Índices e Otimizações',
    status: 'EM EXECUÇÃO 🚀',
    progresso: 25,
    tarefas: [
      { 
        id: 1, 
        titulo: 'Implementar busca por litigante/contato', 
        status: 'pendente',
        detalhes: 'JOIN ProcessoRepositorio → Contato com busca LIKE em nomes'
      },
      { 
        id: 2, 
        titulo: 'Adicionar índices em campos críticos', 
        status: 'pendente',
        detalhes: 'Índices em: tribunal_codigo, classe_id, origem_nome, ano'
      },
      { 
        id: 3, 
        titulo: 'Implementar cache de resultados recentes', 
        status: 'pendente',
        detalhes: 'Cache em memória (Redis-like) para queries frequentes'
      },
      { 
        id: 4, 
        titulo: 'Implementar full-text search', 
        status: 'pendente',
        detalhes: 'Busca em nomes, descritivos, classe_nome, assunto_nome'
      },
      { 
        id: 5, 
        titulo: 'Melhorar interface com filtros avançados', 
        status: 'em-progresso',
        detalhes: 'Filtros por período, status, sigilosidade, tribunal múltiplos'
      },
      { 
        id: 6, 
        titulo: 'Testes de performance (10k, 100k processos)', 
        status: 'pendente',
        detalhes: 'Validar < 100ms em queries com large datasets'
      }
    ],
    metricas: {
      targetResponseTime: '< 100ms (large queries)',
      targetCacheHitRate: '> 70%',
      targetIndices: '4+'
    }
  };

  // SPRINT 3 - FASE 3 (PLANEJADO)
  const sprint3 = {
    numero: 3,
    titulo: 'FASE 3: Multi-Tenant Compliance & Segurança',
    status: 'PLANEJADO',
    progresso: 0,
    tarefas: [
      { 
        id: 1, 
        titulo: 'Implementar Row-Level Security', 
        status: 'nao-iniciado',
        detalhes: 'Garantir que usuários só vejam seus processos'
      },
      { 
        id: 2, 
        titulo: 'Testes de isolamento de dados', 
        status: 'nao-iniciado',
        detalhes: 'Validar que não há vazamento entre tenants'
      },
      { 
        id: 3, 
        titulo: 'Implementar validação de tenant_id', 
        status: 'nao-iniciado',
        detalhes: 'Em todas as queries de ProcessoRepositorio'
      }
    ]
  };

  // SPRINT 4 - FASE 4 (PLANEJADO)
  const sprint4 = {
    numero: 4,
    titulo: 'FASE 4: Interface + Dashboard Avançado',
    status: 'PLANEJADO',
    progresso: 0,
    tarefas: [
      { 
        id: 1, 
        titulo: 'Visualizador hierárquico interativo', 
        status: 'nao-iniciado',
        detalhes: 'Árvore expansível de Tribunal → Instância → Órgão'
      },
      { 
        id: 2, 
        titulo: 'Export de dados (CSV, relatório)', 
        status: 'nao-iniciado',
        detalhes: 'Permitir download de resultados'
      },
      { 
        id: 3, 
        titulo: 'Estatísticas detalhadas do repositório', 
        status: 'nao-iniciado',
        detalhes: 'Total por tribunal, classe, instância'
      }
    ]
  };

  const renderTarefa = (tarefa) => {
    const statusConfig = {
      concluido: { bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle2, color: 'text-green-600', label: 'Concluído' },
      'em-progresso': { bg: 'bg-blue-50', border: 'border-blue-200', icon: Clock, color: 'text-blue-600', label: 'Em Progresso' },
      pendente: { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: AlertCircle, color: 'text-yellow-600', label: 'Pendente' },
      'nao-iniciado': { bg: 'bg-gray-50', border: 'border-gray-200', icon: AlertCircle, color: 'text-gray-600', label: 'Não Iniciado' }
    };

    const config = statusConfig[tarefa.status];
    const Icon = config.icon;

    return (
      <div key={tarefa.id} className={`border-l-4 ${config.border} ${config.bg} p-3 rounded`}>
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <p className="font-semibold text-sm">{tarefa.titulo}</p>
            <p className="text-xs text-gray-600 mt-1">{tarefa.detalhes}</p>
            <Badge className="mt-2 text-xs" variant={tarefa.status === 'concluido' ? 'default' : 'outline'}>
              {config.label}
            </Badge>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Executor de Sprint - Repositório Global</h1>
        <p className="text-gray-600 dark:text-gray-400">Acompanhamento de progresso: Plano de 5 fases</p>
      </div>

      <Tabs value={activeSprint} onValueChange={setActiveSprint} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sprint-1">Sprint 1 ✅</TabsTrigger>
          <TabsTrigger value="sprint-2">Sprint 2 🚀</TabsTrigger>
          <TabsTrigger value="sprint-3">Sprint 3</TabsTrigger>
          <TabsTrigger value="sprint-4">Sprint 4</TabsTrigger>
        </TabsList>

        {/* SPRINT 1 */}
        <TabsContent value="sprint-1" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{sprint1.titulo}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Fase 1: Estrutura base do cache local offline</p>
                </div>
                <Badge className="bg-green-100 text-green-800 text-lg">{sprint1.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progresso */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">Progresso Geral</p>
                  <p className="text-lg font-bold text-green-600">{sprint1.progresso}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full" style={{ width: `${sprint1.progresso}%` }}></div>
                </div>
              </div>

              {/* Tarefas */}
              <div className="space-y-3">
                <p className="font-semibold">Tarefas Realizadas:</p>
                {sprint1.tarefas.map(renderTarefa)}
              </div>

              {/* Métricas Alcançadas */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                <p className="font-semibold text-green-900 mb-3">✅ Métricas Alcançadas:</p>
                <ul className="space-y-2 text-sm text-green-900">
                  <li>🔹 Redução de API calls: <strong>{sprint1.metricas.apiReduction}</strong></li>
                  <li>🔹 Tempo de resposta: <strong>{sprint1.metricas.responseTime}</strong></li>
                  <li>🔹 Disponibilidade offline: <strong>✓ Confirmada</strong></li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SPRINT 2 */}
        <TabsContent value="sprint-2" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{sprint2.titulo}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Fase 2: Otimizações, índices e busca full-text</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800 text-lg">{sprint2.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progresso */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">Progresso Geral</p>
                  <p className="text-lg font-bold text-blue-600">{sprint2.progresso}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${sprint2.progresso}%` }}></div>
                </div>
              </div>

              {/* Tarefas */}
              <div className="space-y-3">
                <p className="font-semibold">Tarefas desta Sprint:</p>
                {sprint2.tarefas.map(renderTarefa)}
              </div>

              {/* Objetivos */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="font-semibold text-blue-900 mb-3">🎯 Objetivos desta Sprint:</p>
                <ul className="space-y-2 text-sm text-blue-900">
                  <li>🔹 Tempo resposta: <strong>{sprint2.metricas.targetResponseTime}</strong></li>
                  <li>🔹 Taxa de cache hit: <strong>{sprint2.metricas.targetCacheHitRate}</strong></li>
                  <li>🔹 Total de índices: <strong>{sprint2.metricas.targetIndices}</strong></li>
                </ul>
              </div>

              {/* Próximos Passos */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="font-semibold text-orange-900 mb-3">⚡ Próximos Passos:</p>
                <ol className="space-y-2 text-sm text-orange-900 list-decimal list-inside">
                  <li>Implementar busca por litigante com JOIN em Contato</li>
                  <li>Criar índices em tribunal_codigo, classe_id, origem_nome</li>
                  <li>Integrar cache de resultados recentes</li>
                  <li>Validar performance com 100k registros</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SPRINT 3 */}
        <TabsContent value="sprint-3" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{sprint3.titulo}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Fase 3: Isolamento de dados e segurança multi-tenant (1 sprint)</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {sprint3.tarefas.map(renderTarefa)}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SPRINT 4 */}
        <TabsContent value="sprint-4" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{sprint4.titulo}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Fase 4: Visualização e dashboards (2 sprints)</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {sprint4.tarefas.map(renderTarefa)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resumo Geral */}
      <Card className="border-2 border-cyan-200 bg-cyan-50 dark:bg-cyan-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Resumo de Progresso Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sprints Concluídos</p>
              <p className="text-3xl font-bold text-green-600">1/4</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Percentual Total</p>
              <p className="text-3xl font-bold text-cyan-600">25%</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-semibold mb-2">Linha do Tempo:</p>
              <div className="flex gap-2">
                <div className="flex-1 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">✅ 100%</div>
                <div className="flex-1 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">🚀 25%</div>
                <div className="flex-1 h-8 bg-gray-400 rounded-lg flex items-center justify-center text-white text-xs font-bold">0%</div>
                <div className="flex-1 h-8 bg-gray-400 rounded-lg flex items-center justify-center text-white text-xs font-bold">0%</div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Fase 1</span>
                <span>Fase 2</span>
                <span>Fase 3</span>
                <span>Fase 4</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}