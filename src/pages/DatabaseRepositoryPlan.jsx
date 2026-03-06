import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Database, Lock, Search, Zap } from 'lucide-react';

export default function DatabaseRepositoryPlan() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Plano de Implementação: Repositório Global de Processos</h1>
        <p className="text-gray-600 dark:text-gray-400">Backup local offline + redução de chamadas DataJud</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="entities">Entidades</TabsTrigger>
          <TabsTrigger value="architecture">Arquitetura</TabsTrigger>
          <TabsTrigger value="search">Busca</TabsTrigger>
          <TabsTrigger value="multitenant">Multi-Tenant</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Objetivos Principais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Repositório Central Offline</p>
                  <p className="text-sm text-gray-600">Todos os processos verificados no DataJud são salvos localmente, criando um backup permanente</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Reduzir Chamadas API</p>
                  <p className="text-sm text-gray-600">Consultas ao repositório local evitam múltiplas chamadas ao DataJud (economia de custos e latência)</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Organização Hierárquica</p>
                  <p className="text-sm text-gray-600">Estrutura em árvore: Tribunal → Instância → Órgão → Processo</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Busca Avançada + Isolamento Multi-Tenant</p>
                  <p className="text-sm text-gray-600">Busca por múltiplos critérios com garantia de isolamento de dados entre clientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ENTITIES */}
        <TabsContent value="entities" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Entidades Principais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-cyan-600 pl-4 py-2">
                <p className="font-bold text-cyan-700">ProcessoRepositorio (NOVA)</p>
                <p className="text-sm text-gray-600 mt-1">Registro central de todos os processos do CNJ</p>
                <ul className="text-sm mt-2 space-y-1 text-gray-700">
                  <li>• cnj_number (PK)</li>
                  <li>• numero_sequencial, ano, segmento, tribunal, instancia, origem</li>
                  <li>• data_verificacao_datajud</li>
                  <li>• hash_verificacao (para detetar mudanças)</li>
                  <li>• datajud_raw_data (snapshot dos dados do DataJud)</li>
                  <li>• tribunal_id, instancia_id, orgao_id (FK)</li>
                  <li>• status_repositorio: 'verificado', 'sincronizando', 'erro'</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-600 pl-4 py-2">
                <p className="font-bold text-blue-700">ProcessoUsuario (ASSOCIAÇÃO)</p>
                <p className="text-sm text-gray-600 mt-1">Relaciona processos ao usuário e mantém metadados</p>
                <ul className="text-sm mt-2 space-y-1 text-gray-700">
                  <li>• processo_id + user_id (PK composta)</li>
                  <li>• papel: 'advogado', 'cliente', 'interessado'</li>
                  <li>• data_adicao, data_ultima_atualizacao</li>
                  <li>• notas_internas</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-600 pl-4 py-2">
                <p className="font-bold text-purple-700">TribunalHierarquia</p>
                <p className="text-sm text-gray-600 mt-1">Organização: Tribunal → Instância → Órgão</p>
                <ul className="text-sm mt-2 space-y-1 text-gray-700">
                  <li>• tribunal_id, instancia_id, orgao_id</li>
                  <li>• nome, codigo_cnj, especialidade</li>
                  <li>• nivel: '1grau', '2grau', 'superior'</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-600 pl-4 py-2">
                <p className="font-bold text-green-700">Relacionamentos Já Existentes</p>
                <ul className="text-sm mt-2 space-y-1 text-gray-700">
                  <li>• ProcessoRepositorio → Contato (partes, advogados)</li>
                  <li>• ProcessoRepositorio → Deadline (prazos processuais)</li>
                  <li>• ProcessoRepositorio → Agenda (audiências, despachos)</li>
                  <li>• ProcessoRepositorio → Publication (publicações DJe)</li>
                  <li>• ProcessoRepositorio → AndamentoProcessual (movimentos)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ARCHITECTURE */}
        <TabsContent value="architecture" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Arquitetura de Sincronização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
                <div className="space-y-2">
                  <div><span className="text-cyan-600">┌─ DATAJUD (API Externa)</span></div>
                  <div><span className="text-gray-400">│</span></div>
                  <div><span className="text-cyan-600">├─ Função: sincronizarProcessoRepositorio()</span></div>
                  <div><span className="text-gray-400">│   │</span></div>
                  <div><span className="text-cyan-600">│   ├─ Buscar CNJ no DataJud</span></div>
                  <div><span className="text-cyan-600">│   ├─ Verificar se existe em ProcessoRepositorio</span></div>
                  <div><span className="text-cyan-600">│   ├─ Se novo: Criar registro + partes + movimentos</span></div>
                  <div><span className="text-cyan-600">│   ├─ Se existe: Comparar hash e atualizar se necessário</span></div>
                  <div><span className="text-cyan-600">│   └─ Retornar métricas (novo, atualizado, duplicata)</span></div>
                  <div><span className="text-gray-400">│</span></div>
                  <div><span className="text-cyan-600">└─ PROCESSODREPOSITORIO (Base44 Local)</span></div>
                </div>
              </div>

              <Card className="bg-blue-50 dark:bg-blue-900 border-blue-200">
                <CardContent className="pt-6">
                  <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Fluxo de Adição:</p>
                  <ol className="text-sm text-blue-900 dark:text-blue-100 space-y-1 list-decimal list-inside">
                    <li>Usuário adiciona processo (número CNJ)</li>
                    <li>Sistema consulta ProcessoRepositorio primeiro (cache local)</li>
                    <li>Se não encontrado → Chama DataJud (1 chamada apenas)</li>
                    <li>Salva em ProcessoRepositorio + associa ao usuário</li>
                    <li>Próximas consultas usam repositório local (zero chamadas)</li>
                  </ol>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEARCH */}
        <TabsContent value="search" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Sistema de Busca Avançada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="border-l-4 border-cyan-600 pl-4">
                  <p className="font-semibold">1. Busca por Número do Processo</p>
                  <p className="text-sm text-gray-600 mt-1">SELECT * FROM ProcessoRepositorio WHERE cnj_number = ?</p>
                  <Badge className="mt-2">Índice PK - O(1)</Badge>
                </div>

                <div className="border-l-4 border-cyan-600 pl-4">
                  <p className="font-semibold">2. Busca por Litigante (Nome)</p>
                  <p className="text-sm text-gray-600 mt-1">JOIN ProcessoRepositorio → Contato WHERE nome LIKE %termo%</p>
                  <Badge className="mt-2">Índice em Contato.nome - O(log n)</Badge>
                </div>

                <div className="border-l-4 border-cyan-600 pl-4">
                  <p className="font-semibold">3. Busca por Classe Processual</p>
                  <p className="text-sm text-gray-600 mt-1">SELECT * FROM ProcessoRepositorio WHERE classe_id = ? AND tribunal_id = ?</p>
                  <Badge className="mt-2">Índice composto (classe, tribunal)</Badge>
                </div>

                <div className="border-l-4 border-cyan-600 pl-4">
                  <p className="font-semibold">4. Busca por Órgão Julgador</p>
                  <p className="text-sm text-gray-600 mt-1">SELECT * FROM ProcessoRepositorio WHERE orgao_id = ? ORDER BY data_verificacao DESC</p>
                  <Badge className="mt-2">Índice em orgao_id</Badge>
                </div>

                <div className="border-l-4 border-cyan-600 pl-4">
                  <p className="font-semibold">5. Busca Combinada (Filtros)</p>
                  <p className="text-sm text-gray-600 mt-1">WHERE tribunal_id = ? AND instancia_id = ? AND classe_id = ? AND ano = ?</p>
                  <Badge className="mt-2">Índice composto de 4 campos</Badge>
                </div>
              </div>

              <Card className="bg-green-50 dark:bg-green-900 border-green-200 mt-4">
                <CardContent className="pt-6">
                  <p className="font-semibold text-green-900 dark:text-green-100 mb-2">Otimizações:</p>
                  <ul className="text-sm text-green-900 dark:text-green-100 space-y-1">
                    <li>✓ Índices em fields frequentemente filtrados</li>
                    <li>✓ Cache de resultados recentes (Redis-like)</li>
                    <li>✓ Full-text search para nomes e descritivos</li>
                    <li>✓ Paginação (10/25/50 registros)</li>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MULTITENANT */}
        <TabsContent value="multitenant" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Isolamento Multi-Tenant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                <p className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Princípio: Row-Level Security</p>
                <p className="text-sm text-orange-900 dark:text-orange-100">Cada usuário/tenant acessa APENAS seus processos</p>
              </div>

              <div className="space-y-3">
                <div className="border-l-4 border-purple-600 pl-4">
                  <p className="font-semibold">Nível 1: ProcessoRepositorio</p>
                  <p className="text-sm text-gray-600 mt-1">Banco de dados CENTRAL compartilhado por todos os tenants (economiza espaço)</p>
                  <p className="text-xs text-gray-500 mt-2">➜ Sem coluna tenant_id (processos são únicos no CNJ)</p>
                </div>

                <div className="border-l-4 border-purple-600 pl-4">
                  <p className="font-semibold">Nível 2: ProcessoUsuario (CHAVE DO ISOLAMENTO)</p>
                  <p className="text-sm text-gray-600 mt-1">Tabela de associação que CONECTA usuário ao processo</p>
                  <p className="text-xs text-gray-500 mt-2">➜ Contém: usuario_id, processo_id, tenant_id, papel</p>
                  <p className="text-xs text-gray-500 mt-2">➜ Query: SELECT p.* FROM ProcessoRepositorio p JOIN ProcessoUsuario pu ON p.id = pu.processo_id WHERE pu.usuario_id = ? AND pu.tenant_id = ?</p>
                </div>

                <div className="border-l-4 border-purple-600 pl-4">
                  <p className="font-semibold">Nível 3: Contatos, Deadlines, Agenda, Publicações</p>
                  <p className="text-sm text-gray-600 mt-1">Já isoladas por tenant_id (herdam do usuário)</p>
                </div>
              </div>

              <Card className="bg-red-50 dark:bg-red-900 border-red-200 mt-4">
                <CardContent className="pt-6">
                  <p className="font-semibold text-red-900 dark:text-red-100 mb-2">⚠️ Regra de Ouro:</p>
                  <p className="text-sm text-red-900 dark:text-red-100">NUNCA fazer SELECT em ProcessoRepositorio SEM passar por ProcessoUsuario com filtro tenant_id</p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ROADMAP */}
        <TabsContent value="roadmap" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Roadmap de Implementação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-600 pl-4 py-2">
                  <p className="font-bold text-lg">FASE 1: Estrutura Base (2-3 sprints)</p>
                  <ul className="text-sm mt-2 space-y-1 text-gray-700 list-disc list-inside">
                    <li>Criar entidades: ProcessoRepositorio, ProcessoUsuario, TribunalHierarquia</li>
                    <li>Implementar função: sincronizarProcessoRepositorio()</li>
                    <li>Criar índices em campos críticos</li>
                    <li>Testes de performance (10k, 100k processos)</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-600 pl-4 py-2">
                  <p className="font-bold text-lg">FASE 2: Busca Avançada (1-2 sprints)</p>
                  <ul className="text-sm mt-2 space-y-1 text-gray-700 list-disc list-inside">
                    <li>Implementar busca por CNJ (cache local)</li>
                    <li>Busca por litigante/contato</li>
                    <li>Busca por classe + órgão</li>
                    <li>Interface no Database tab do admin</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-600 pl-4 py-2">
                  <p className="font-bold text-lg">FASE 3: Multi-Tenant Compliance (1 sprint)</p>
                  <ul className="text-sm mt-2 space-y-1 text-gray-700 list-disc list-inside">
                    <li>Validar isolamento de dados entre tenants</li>
                    <li>Implementar ProcessoUsuario com tenant_id</li>
                    <li>Testes de segurança (evitar vazamento de dados)</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-600 pl-4 py-2">
                  <p className="font-bold text-lg">FASE 4: Interface + Dashboard (2 sprints)</p>
                  <ul className="text-sm mt-2 space-y-1 text-gray-700 list-disc list-inside">
                    <li>Visualizador hierárquico (Tribunal → Instância → Órgão)</li>
                    <li>Barra de busca avançada com filtros</li>
                    <li>Estatísticas do repositório (total, por tribunal, etc)</li>
                    <li>Export de dados (CSV, relatório)</li>
                  </ul>
                </div>

                <div className="border-l-4 border-cyan-600 pl-4 py-2">
                  <p className="font-bold text-lg">FASE 5: Sincronização Contínua (1 sprint)</p>
                  <ul className="text-sm mt-2 space-y-1 text-gray-700 list-disc list-inside">
                    <li>Automação: verificar atualizações periodicamente</li>
                    <li>Webhook para mudanças (nova movimentação, etc)</li>
                    <li>Notificações quando processo tem atualização</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Benefícios Esperados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li><strong>Redução de API calls:</strong> -80% a -95% (primeira consulta DataJud, resto cache)</li>
                <li><strong>Velocidade:</strong> Queries locais &lt; 100ms vs API DataJud 500-2000ms</li>
                <li><strong>Disponibilidade:</strong> Funciona offline, independente da API externa</li>
                <li><strong>Escalabilidade:</strong> Suporta milhões de processos sem degradação</li>
                <li><strong>Economia:</strong> Menos chamadas = custos menores com DataJud</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}