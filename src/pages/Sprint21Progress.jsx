import React from 'react';
import { CheckCircle2, Clock, AlertCircle, TrendingUp, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Sprint21Progress() {
  const tarefas = [
    {
      num: '1',
      nome: 'fontes.listar',
      endpoint: 'GET /fontes/intimacoes',
      status: 'completo',
      funcao: 'fontesListar.js'
    },
    {
      num: '2',
      nome: 'audiencias.listar',
      endpoint: 'GET /audiencias',
      status: 'completo',
      funcao: 'audienciasListar.js'
    },
    {
      num: '3',
      nome: 'audiencias.criar',
      endpoint: 'POST /audiencias',
      status: 'completo',
      funcao: 'audienciasCriar.js'
    },
    {
      num: '4',
      nome: 'prazos.listar',
      endpoint: 'GET /prazos',
      status: 'completo',
      funcao: 'prazosListar.js'
    },
    {
      num: '5',
      nome: 'documentos.listar',
      endpoint: 'GET /processos/:id/documentos',
      status: 'completo',
      funcao: 'documentosListar.js'
    },
    {
      num: '6',
      nome: 'documentos.download',
      endpoint: 'GET /documentos/:id/download',
      status: 'completo',
      funcao: 'documentosDownload.js'
    },
    {
      num: '7',
      nome: 'prazos.calcular',
      endpoint: 'POST /prazos/calcular',
      status: 'completo',
      funcao: 'prazosCalcular.js'
    },
    {
      num: '8',
      nome: 'webhooks.registrar',
      endpoint: 'POST /webhooks/registrar',
      status: 'completo',
      funcao: 'webhooksRegistrar.js'
    },
    {
      num: '9',
      nome: 'usuarios.listar',
      endpoint: 'GET /usuarios',
      status: 'completo',
      funcao: 'usuariosListar.js'
    },
    {
      num: '10',
      nome: 'movimentos.detalhe',
      endpoint: 'GET /movimentos/:id',
      status: 'completo',
      funcao: 'movimentosDetalhe.js'
    },
    {
      num: '11',
      nome: 'notificacoes.preferencias',
      endpoint: 'PUT /notificacoes/preferencias',
      status: 'completo',
      funcao: 'notificacoesPreferencias.js'
    },
    {
      num: '12',
      nome: 'audiencias.atualizar',
      endpoint: 'PUT /audiencias/:id',
      status: 'completo',
      funcao: 'audienciasAtualizar.js'
    }
  ];

  const pendentes = [];

  const progresso = (12 / 12) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Sprint 21 - Progress</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Implementação de Endpoints Advise API</p>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Completude</span>
              <span className="text-2xl font-bold text-blue-600">{progresso.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${progresso}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">5 de 12 endpoints implementados</p>
          </div>
        </div>

        {/* Completados */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" /> ✅ TODOS OS 12 ENDPOINTS IMPLEMENTADOS!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tarefas.map((tarefa) => (
              <div key={tarefa.num} className="border border-green-200 dark:border-green-900 rounded-lg p-4 bg-green-50 dark:bg-green-950">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{tarefa.nome}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">{tarefa.endpoint}</p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">functions/advise/endpoints/{tarefa.funcao}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Status Final */}
        {pendentes.length === 0 && (
          <Card className="p-6 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" /> Sprint 21 - 100% CONCLUÍDO
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg text-center border border-green-200 dark:border-green-800">
                <p className="text-3xl font-bold text-green-600">12/12</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Endpoints</p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg text-center border border-green-200 dark:border-green-800">
                <p className="text-3xl font-bold text-green-600">3</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Semanas</p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg text-center border border-green-200 dark:border-green-800">
                <p className="text-3xl font-bold text-green-600">100%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completude</p>
              </div>
            </div>
          </Card>
        )}

        {/* Detalhes Técnicos */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6" /> Detalhes Implementação
          </h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <p className="font-semibold mb-2">✅ Semana 1 - Listar & Criar (5/5):</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">GET /fontes/intimacoes</code> - FonteIntimacao sync</li>
                <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">GET /audiencias</code> - Audiencia sync (30 dias)</li>
                <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">POST /audiencias</code> - Cria com validação</li>
                <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">GET /prazos</code> - PrazoProcessual sync</li>
                <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">GET /processos/:id/documentos</code> - Paginação</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2">✅ Semana 2 - Download & Cálculos (3/3):</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><code>GET /documentos/:id/download</code> - Stream ArrayBuffer + DB update</li>
                <li><code>POST /prazos/calcular</code> - Dias úteis (excl. fins semana)</li>
                <li><code>POST /webhooks/registrar</code> - Evento listener Advise</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2">✅ Semana 3 - Gestão Avançada (4/4 CONCLUÍDOS):</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><code>GET /usuarios</code> - Sincroniza com Advogado entity</li>
                <li><code>GET /movimentos/:id</code> - Detalhe + MovimentoProcesso sync</li>
                <li><code>PUT /notificacoes/preferencias</code> - Atualiza preferências usuário</li>
                <li><code>PUT /audiencias/:id</code> - Atualiza comparecimento</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
          <h2 className="text-2xl font-bold mb-4">📅 Cronograma Sprint 21</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white font-bold text-sm">✓</div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Semana 1 ✅ CONCLUÍDA</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">5/5: fontes.listar, audiencias.listar/criar, prazos.listar, documentos.listar</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white font-bold text-sm">✓</div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Semana 2 ✅ CONCLUÍDA</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">3/3: documentos.download (stream), prazos.calcular (dias úteis), webhooks.registrar</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white font-bold text-sm">✓</div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Semana 3 ✅ CONCLUÍDA</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">4/4: usuarios.listar, movimentos.detalhe, notificacoes.preferencias, audiencias.atualizar</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}