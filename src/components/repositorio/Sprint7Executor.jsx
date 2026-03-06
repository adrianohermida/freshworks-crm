import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, AlertCircle, Zap, Globe } from 'lucide-react';

export default function Sprint7Executor() {
  const [sprint7Status, setSprint7Status] = useState(null);
  const [loading, setLoading] = useState(false);

  const tarefas = [
    {
      id: 1,
      titulo: 'Infraestrutura i18n',
      desc: 'Setup i18next + traduções baseadas em arquivos JSON',
      status: 'EM_PROGRESSO',
      progresso: 40,
      prazo: '2026-03-07',
      tarefas: [
        { t: 'Instalar i18next e react-i18next', s: true },
        { t: 'Criar estrutura de pastas translations/', s: false },
        { t: 'Configurar language detector', s: false },
        { t: 'Setup namespace management', s: false }
      ]
    },
    {
      id: 2,
      titulo: 'Traduções PT-BR (Base)',
      desc: 'Traduzir toda interface para português (base language)',
      status: 'TODO',
      progresso: 0,
      prazo: '2026-03-10',
      tarefas: [
        { t: 'Dashboard e navegação', s: false },
        { t: 'Páginas de processo', s: false },
        { t: 'Modais e formulários', s: false },
        { t: 'Mensagens de erro e alertas', s: false }
      ]
    },
    {
      id: 3,
      titulo: 'Inglês (EN)',
      desc: 'Traduzir interface completa para inglês',
      status: 'TODO',
      progresso: 0,
      prazo: '2026-03-12',
      tarefas: [
        { t: 'Tradução técnica', s: false },
        { t: 'Revisão terminologia legal', s: false },
        { t: 'QA e testes de layout', s: false }
      ]
    },
    {
      id: 4,
      titulo: 'Espanhol (ES) + Francês (FR)',
      desc: 'Adicionar ES e FR para cobertura LATAM/Europa',
      status: 'TODO',
      progresso: 0,
      prazo: '2026-03-14',
      tarefas: [
        { t: 'Tradução ES (LATAM)', s: false },
        { t: 'Tradução FR (Europa)', s: false },
        { t: 'QA multi-idioma', s: false }
      ]
    },
    {
      id: 5,
      titulo: 'Alemão (DE) + Variações RTL',
      desc: 'DE para mercado europeu, preparar RTL para árabe/hebraico',
      status: 'TODO',
      progresso: 0,
      prazo: '2026-03-16',
      tarefas: [
        { t: 'Tradução DE', s: false },
        { t: 'Estrutura RTL no CSS', s: false },
        { t: 'Testes RTL layout', s: false }
      ]
    },
    {
      id: 6,
      titulo: 'Language Switcher UI',
      desc: 'Componente seletor de idioma + persistência localStorage',
      status: 'TODO',
      progresso: 0,
      prazo: '2026-03-11',
      tarefas: [
        { t: 'Criar componente LanguageSelector', s: false },
        { t: 'Salvar preferência no localStorage', s: false },
        { t: 'Detectar idioma do browser', s: false },
        { t: 'Integrar no Header/Layout', s: false }
      ]
    },
    {
      id: 7,
      titulo: 'Testes E2E i18n',
      desc: 'Validar tradução em cenários reais + mudanças de idioma',
      status: 'TODO',
      progresso: 0,
      prazo: '2026-03-17',
      tarefas: [
        { t: 'Testes switch entre idiomas', s: false },
        { t: 'Validar persistência idioma', s: false },
        { t: 'Testes de layout (comprimento texto)', s: false },
        { t: 'Testes de caracteres especiais', s: false }
      ]
    },
    {
      id: 8,
      titulo: 'Documentação & Deploy',
      desc: 'Guia de como adicionar novos idiomas + merge para produção',
      status: 'TODO',
      progresso: 0,
      prazo: '2026-03-18',
      tarefas: [
        { t: 'Documentar estrutura i18n', s: false },
        { t: 'Guia para novos tradutores', s: false },
        { t: 'Deploy staging', s: false },
        { t: 'Merge para main + produção', s: false }
      ]
    }
  ];

  const sprintInfo = {
    numero: 7,
    titulo: 'i18n & Multi-Idioma',
    duracao: '2 semanas (7-14 dias úteis)',
    datainicio: '2026-03-04',
    datafim: '2026-03-18',
    objetivo: '5 idiomas (PT, EN, ES, FR, DE) + RTL support',
    recurso: '2 devs + 1 tradutor externo',
    impacto: 'Mercado global 🌍'
  };

  const progressoTotal = Math.round(
    tarefas.reduce((acc, t) => acc + t.progresso, 0) / tarefas.length
  );

  const tarefasCompletas = tarefas.filter(t => t.progresso === 100).length;
  const tarefasEmProgresso = tarefas.filter(t => t.progresso > 0 && t.progresso < 100).length;
  const tarefasPendentes = tarefas.filter(t => t.progresso === 0).length;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-bold">🌍 Sprint 7: i18n & Multi-Idioma</h1>
        <p className="text-gray-600">Expansão global da plataforma para 5 idiomas</p>
        <Badge className="bg-cyan-600 mx-auto mt-2">{sprintInfo.duracao}</Badge>
      </div>

      {/* PROGRESSO GERAL */}
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900 dark:to-blue-900 border-2 border-cyan-300">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Progresso Geral do Sprint</span>
            <span className="text-3xl font-bold text-cyan-600">{progressoTotal}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progressoTotal} className="h-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-gray-600 text-sm">Completas</p>
              <p className="text-2xl font-bold text-green-600">{tarefasCompletas}/8</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Em Progresso</p>
              <p className="text-2xl font-bold text-blue-600">{tarefasEmProgresso}/8</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Pendentes</p>
              <p className="text-2xl font-bold text-orange-600">{tarefasPendentes}/8</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Data Fim</p>
              <p className="text-xl font-bold text-purple-600">18/03</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TABS */}
      <Tabs defaultValue="tarefas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tarefas">Tarefas (8)</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="detalhes">Detalhes Sprint</TabsTrigger>
        </TabsList>

        {/* TAREFAS */}
        <TabsContent value="tarefas">
          <div className="space-y-4">
            {tarefas.map((tarefa, idx) => (
              <Card key={idx} className={tarefa.progresso === 100 ? 'bg-green-50 dark:bg-green-900' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {tarefa.progresso === 100 ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : tarefa.progresso > 0 ? (
                          <Zap className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                        <h3 className="font-bold text-lg">{idx + 1}. {tarefa.titulo}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{tarefa.desc}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={tarefa.status === 'COMPLETA' ? 'default' : tarefa.status === 'EM_PROGRESSO' ? 'secondary' : 'outline'}>
                        {tarefa.status === 'COMPLETA' ? '✅' : tarefa.status === 'EM_PROGRESSO' ? '🔄' : '⏳'} {tarefa.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-2">{tarefa.prazo}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="font-semibold">Progresso</span>
                      <span>{tarefa.progresso}%</span>
                    </div>
                    <Progress value={tarefa.progresso} className="h-2" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {tarefa.tarefas.map((t, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        {t.s ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                        <span className={t.s ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}>{t.t}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TIMELINE */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>📅 Timeline Sprint 7</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { data: '04/03 - 07/03', fase: 'Fase 1: Setup', tarefas: ['Infraestrutura i18n (40%)', 'Language Switcher (0%)'], status: 'EM_PROGRESSO' },
                { data: '07/03 - 10/03', fase: 'Fase 2: PT-BR', tarefas: ['Tradução completa PT-BR', 'Testes de layout'], status: 'PROXIMO' },
                { data: '10/03 - 12/03', fase: 'Fase 3: Idiomas Principais', tarefas: ['Inglês (EN)', 'Espanhol (ES)'], status: 'PROXIMO' },
                { data: '12/03 - 14/03', fase: 'Fase 4: Idiomas Adicionais', tarefas: ['Francês (FR)', 'Alemão (DE)', 'RTL Support'], status: 'PROXIMO' },
                { data: '14/03 - 17/03', fase: 'Fase 5: QA & Testes', tarefas: ['E2E tests i18n', 'Testes cross-browser'], status: 'PROXIMO' },
                { data: '17/03 - 18/03', fase: 'Fase 6: Deploy', tarefas: ['Staging deploy', 'Merge para produção'], status: 'PROXIMO' }
              ].map((fase, idx) => (
                <div key={idx} className={`border-l-4 pl-4 py-2 ${fase.status === 'EM_PROGRESSO' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900' : 'border-gray-300'}`}>
                  <p className="text-sm font-semibold text-gray-600">{fase.data}</p>
                  <p className="font-bold text-lg mt-1">{fase.fase}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {fase.tarefas.map((t, i) => (
                      <Badge key={i} variant="outline">{t}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* DETALHES */}
        <TabsContent value="detalhes">
          <Card>
            <CardHeader>
              <CardTitle>📋 Detalhes do Sprint</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-gray-700 mb-3">Sprint Info</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Número:</strong> {sprintInfo.numero}</p>
                    <p><strong>Título:</strong> {sprintInfo.titulo}</p>
                    <p><strong>Duração:</strong> {sprintInfo.duracao}</p>
                    <p><strong>Início:</strong> {sprintInfo.datainicio}</p>
                    <p><strong>Fim:</strong> {sprintInfo.datafim}</p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-3">Recursos</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Tim:</strong> {sprintInfo.recurso}</p>
                    <p><strong>Objetivo:</strong> {sprintInfo.objetivo}</p>
                    <p><strong>Impacto:</strong> {sprintInfo.impacto}</p>
                    <p><strong>Prioridade:</strong> 🔴 ALTA</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold mb-2 text-blue-900 dark:text-blue-100">✅ Pré-requisitos Atendidos:</p>
                <ul className="text-sm text-blue-900 dark:text-blue-100 space-y-1">
                  <li>✓ Produção estável (Sprint 6)</li>
                  <li>✓ Arquitetura i18n planejada</li>
                  <li>✓ Recursos alocados</li>
                  <li>✓ Tradutor contratado</li>
                </ul>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900 border border-amber-200 rounded-lg p-4">
                <p className="font-semibold mb-2 text-amber-900 dark:text-amber-100">⚠️ Riscos Identificados:</p>
                <ul className="text-sm text-amber-900 dark:text-amber-100 space-y-1">
                  <li>• Atraso na tradução (contratar 2º tradutor em standby)</li>
                  <li>• Incompatibilidade RTL (validar com bibliotecas RTL cedo)</li>
                  <li>• Limite de 14 dias para 5 idiomas (sprint intenso)</li>
                </ul>
              </div>

              <Button className="w-full h-12 text-lg bg-cyan-600 hover:bg-cyan-700">
                🚀 Iniciar Sprint 7
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* RESUMO EXECUÇÃO */}
      <Card className="border-2 border-cyan-400">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="font-bold text-lg">📊 Resumo Sprint 7 - Phase 2 Kickoff</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <p className="text-gray-600">Tarefas Completas</p>
                <p className="text-2xl font-bold text-green-600">{tarefasCompletas}/8</p>
                <p className="text-xs text-gray-500 mt-1">{tarefasCompletas === 8 ? '✅ 100%' : `${Math.round((tarefasCompletas/8)*100)}% restante`}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <p className="text-gray-600">Em Progresso</p>
                <p className="text-2xl font-bold text-blue-600">{tarefasEmProgresso}/8</p>
                <p className="text-xs text-gray-500 mt-1">Infraestrutura iniciada</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
                <p className="text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{tarefasPendentes}/8</p>
                <p className="text-xs text-gray-500 mt-1">Aguardando sinal de go</p>
              </div>
            </div>
            <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="font-bold text-lg">Porcentagem de Completude: <span className="text-cyan-600">{progressoTotal}%</span></p>
              <p className="text-xs text-gray-600 mt-1">Sprint iniciando | 14 dias para conclusão</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}