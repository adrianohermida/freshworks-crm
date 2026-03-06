import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function AnaliseAdviseAPI() {
  const [expandedCategory, setExpandedCategory] = useState('endpoints-pendentes');

  const endpointsPendentes = [
    {
      categoria: "Intimações",
      endpoints: [
        {
          metodo: "GET",
          rota: "/core/v1/intimacao/ConsultaFonteIntimacoes",
          descricao: "Consulta lista de fontes de intimações",
          prioridade: "Alta",
          implemented: false
        },
        {
          metodo: "POST",
          rota: "/core/v1/intimacao",
          descricao: "Cadastra login/senha para captura de intimações",
          prioridade: "Alta",
          implemented: false
        },
        {
          metodo: "GET",
          rota: "/core/v1/intimacao/ConsultaCadastroAcessos",
          descricao: "Consulta acessos cadastrados",
          prioridade: "Média",
          implemented: false
        }
      ]
    },
    {
      categoria: "Processos - Gerenciamento de Fontes",
      endpoints: [
        {
          metodo: "GET",
          rota: "/core/v1/processos-clientes/consulta-fonte-processo",
          descricao: "Consulta idFonteXTipoPesquisa e idValorParamFonteProc",
          prioridade: "Alta",
          implemented: false
        },
        {
          metodo: "GET",
          rota: "/core/v1/cabecalhos-processos",
          descricao: "Obtém dados do cabeçalho do processo",
          prioridade: "Média",
          implemented: false
        },
        {
          metodo: "GET",
          rota: "/core/v1/processos-clientes/informacoes-adicionais",
          descricao: "Retorna informações adicionais do processo",
          prioridade: "Média",
          implemented: false
        }
      ]
    },
    {
      categoria: "Processos - Anexos",
      endpoints: [
        {
          metodo: "POST",
          rota: "/core/v1/processos-clientes/anexos",
          descricao: "Pesquisa anexos do processo",
          prioridade: "Média",
          implemented: false
        },
        {
          metodo: "GET",
          rota: "/core/v1/anexo-fonte-processo/{id}",
          descricao: "Download de anexo do processo",
          prioridade: "Média",
          implemented: false
        }
      ]
    },
    {
      categoria: "Processos - Exclusão",
      endpoints: [
        {
          metodo: "POST",
          rota: "/core/v1/processos-clientes/excluir-pesquisas-por-processos",
          descricao: "Exclui processo (todas as fontes)",
          prioridade: "Baixa",
          implemented: false
        }
      ]
    }
  ];

  const implementados = [
    { rota: "GET /core/v1/intimacoes-clientes", descricao: "Consulta lista de intimações" },
    { rota: "PUT /core/v1/intimacao/ativar-pesquisa", descricao: "Ativa pesquisa de intimação" },
    { rota: "PUT /core/v1/intimacao/inativar-pesquisa", descricao: "Inativa pesquisa de intimação" },
    { rota: "PUT /core/v1/intimacao/excluir-pesquisa", descricao: "Exclui pesquisa de intimação" },
    { rota: "PUT /core/v1/movimento-processo-cliente-lido/marcar", descricao: "Marca intimações como lidas" },
    { rota: "PUT /core/v1/movimento-processo-cliente-lido/desmarcar", descricao: "Marca intimações como não lidas" },
    { rota: "POST /core/v1/processos-clientes", descricao: "Cadastra processo" },
    { rota: "GET /core/v1/processos-clientes/fontes-processos", descricao: "Consulta fontes cadastradas" },
    { rota: "PUT /core/v1/processos-clientes/alterar-situacao", descricao: "Altera situação do processo" },
    { rota: "GET /core/v1/processos-clientes/andamentos", descricao: "Consulta andamentos" },
    { rota: "GET /core/v1/processos-clientes/andamentos-paginado", descricao: "Consulta andamentos (paginado)" },
    { rota: "PUT /core/v1/processos-clientes/marcar-lidos", descricao: "Marca andamentos como lidos" },
    { rota: "PUT /core/v1/processos-clientes/desmarcar-lidos", descricao: "Marca andamentos como não lidos" },
    { rota: "GET /core/v1/publicacoes-clientes", descricao: "Consulta publicações" },
    { rota: "GET /core/v1/publicacoes-clientes/consulta-paginada", descricao: "Consulta publicações (paginado)" },
    { rota: "PUT /core/v1/publicacoes-clientes/marcar-lidos", descricao: "Marca publicações como lidas" },
    { rota: "PUT /core/v1/publicacoes-clientes/desmarcar-lidos", descricao: "Marca publicações como não lidas" }
  ];

  const planoImplementacao = [
    {
      sprint: "Sprint 8",
      titulo: "Gerenciamento de Fontes de Intimação",
      tarefas: [
        "✓ Implementar GET /intimacao/ConsultaFonteIntimacoes",
        "✓ Implementar POST /intimacao (cadastro de credenciais)",
        "✓ Implementar GET /intimacao/ConsultaCadastroAcessos",
        "✓ Criar UI para configurar fontes de intimação",
        "✓ Adicionar entity FonteIntimacao com suporte completo"
      ],
      estimativa: "3 dias"
    },
    {
      sprint: "Sprint 9",
      titulo: "Gerenciamento Avançado de Processos",
      tarefas: [
        "✓ Implementar GET /processos-clientes/consulta-fonte-processo",
        "✓ Implementar GET /cabecalhos-processos",
        "✓ Implementar GET /processos-clientes/informacoes-adicionais",
        "✓ Criar componente DetailedProcessHeader",
        "✓ Adicionar cache de fontes de processo"
      ],
      estimativa: "3 dias"
    },
    {
      sprint: "Sprint 10",
      titulo: "Sistema de Anexos",
      tarefas: [
        "✓ Implementar POST /processos-clientes/anexos",
        "✓ Implementar GET /anexo-fonte-processo/{id}",
        "✓ Criar componente ProcessAttachments",
        "✓ Adicionar download de anexos",
        "✓ Integrar com visualizador de documentos"
      ],
      estimativa: "3 dias"
    },
    {
      sprint: "Sprint 11",
      titulo: "Operações Críticas e Dashboard Admin",
      tarefas: [
        "✓ Implementar POST /processos-clientes/excluir-pesquisas-por-processos",
        "✓ Criar página de admin para gerenciar processos",
        "✓ Implementar confirmações de exclusão",
        "✓ Adicionar auditoria de operações críticas",
        "✓ Criar relatórios de uso da API"
      ],
      estimativa: "4 dias"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">📊 Análise Completa API Advise</h1>
          <p className="text-gray-600">Mapeamento de todos os endpoints e plano de implementação</p>
        </div>

        {/* Status Geral */}
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>Total de Endpoints:</strong> 30 rotas documentadas | 
            <strong className="ml-2">Implementadas:</strong> 17 (57%) | 
            <strong className="ml-2">Pendentes:</strong> 13 (43%)
          </AlertDescription>
        </Alert>

        {/* Endpoints Implementados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Endpoints Implementados (17/30)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {implementados.map((item, idx) => (
                <div key={idx} className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                  <p className="font-mono font-semibold text-green-900">{item.rota}</p>
                  <p className="text-xs text-green-700 mt-1">{item.descricao}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Endpoints Pendentes */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Endpoints Pendentes (13/30)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {endpointsPendentes.map((cat, idx) => (
              <div key={idx} className="border border-orange-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedCategory(expandedCategory === `cat-${idx}` ? null : `cat-${idx}`)}
                  className="w-full p-4 bg-orange-100 hover:bg-orange-200 text-left font-semibold text-orange-900 flex items-center justify-between"
                >
                  {cat.categoria}
                  <span className="text-sm">({cat.endpoints.length} endpoints)</span>
                </button>
                
                {expandedCategory === `cat-${idx}` && (
                  <div className="p-4 space-y-3">
                    {cat.endpoints.map((ep, epIdx) => (
                      <div key={epIdx} className="p-3 bg-white border border-orange-100 rounded">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="font-mono text-sm font-semibold">
                            <Badge className="bg-orange-600">{ep.metodo}</Badge>
                            <span className="ml-2 text-gray-900">{ep.rota}</span>
                          </div>
                          <Badge className={
                            ep.prioridade === "Alta" ? "bg-red-600" :
                            ep.prioridade === "Média" ? "bg-yellow-600" : "bg-blue-600"
                          }>
                            {ep.prioridade}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">{ep.descricao}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Plano de Implementação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Plano de Implementação (13 Pendências)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {planoImplementacao.map((sprint, idx) => (
              <div key={idx} className="border border-blue-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-blue-900">{sprint.sprint}: {sprint.titulo}</h3>
                    <p className="text-sm text-blue-700">Estimativa: {sprint.estimativa}</p>
                  </div>
                  <Badge className="bg-blue-600">Sprint {sprint.sprint.split(' ')[1]}</Badge>
                </div>
                <ul className="space-y-1 text-sm text-gray-700">
                  {sprint.tarefas.map((tarefa, tidx) => (
                    <li key={tidx} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{tarefa}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Resumo Executivo */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300">
          <CardHeader>
            <CardTitle>📋 Resumo Executivo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-semibold text-blue-900">Endpoints Críticos (Alta Prioridade):</p>
              <p className="text-blue-800 ml-4">• Consulta de Fontes de Intimação</p>
              <p className="text-blue-800 ml-4">• Cadastro de Credenciais para Intimação</p>
              <p className="text-blue-800 ml-4">• Consulta de Parâmetros de Fonte (para processos)</p>
            </div>
            
            <div>
              <p className="font-semibold text-blue-900">Impacto Estratégico:</p>
              <p className="text-blue-800 ml-4">• 13 endpoints adicionais = 43% de aumento de funcionalidade</p>
              <p className="text-blue-800 ml-4">• Estimativa total: 13 dias de desenvolvimento</p>
              <p className="text-blue-800 ml-4">• 4 sprints de implementação incremental</p>
            </div>

            <div>
              <p className="font-semibold text-blue-900">Recomendações:</p>
              <p className="text-blue-800 ml-4">1. Começar com Sprint 8 (Fontes de Intimação) - impacto imediato</p>
              <p className="text-blue-800 ml-4">2. Integrar anexos no Sprint 10 para completar experiência</p>
              <p className="text-blue-800 ml-4">3. Operações admin no final (Sprint 11) para segurança</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}