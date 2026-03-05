import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Rocket, TrendingUp, Users, BarChart3, Zap } from 'lucide-react';

/**
 * SPRINT 67 — PLANEJAMENTO
 * Após conclusão de Sprint 66, iniciamos Sprint 67 com foco em:
 * 1. Integração com novos domínios legais
 * 2. Recursos de colaboração em tempo real
 * 3. Analytics avançado
 */

const sprintData = {
  numero: 67,
  titulo: 'Integração Avançada & Colaboração',
  duracao: '5 dias (40h)',
  dataInicio: '2026-03-09',
  dataFim: '2026-03-13',
  progresso: 0,
  status: 'planejado',

  objetivos: [
    '🔗 Integrar com novos domínios jurídicos (Certidões, Protestos)',
    '👥 Implementar colaboração real-time entre advogados',
    '📊 Analytics avançado com dashboards customizáveis',
    '🔐 Compliance com novos regulamentos (LGPD 2.0)',
    '⚡ Features de IA para análise de documentos'
  ],

  fases: [
    {
      numero: 1,
      nome: 'Novas Integrações API',
      status: 'planejado',
      duracao: '1.5 dias (12h)',
      progresso: 0,
      tarefas: [
        {
          id: 1,
          nome: 'Integrar API Certidões Imobiliárias',
          status: 'planejado',
          descricao: 'Consultar e sincronizar registros de imóveis',
          horas: 4,
          prioridade: 'alta'
        },
        {
          id: 2,
          nome: 'Integrar API Protestos (CNPJ/CPF)',
          status: 'planejado',
          descricao: 'Sincronizar dados de protestos',
          horas: 4,
          prioridade: 'alta'
        },
        {
          id: 3,
          nome: 'Integrar com Sistemas Estaduais',
          status: 'planejado',
          descricao: 'São Paulo, Rio de Janeiro, Minas Gerais',
          horas: 4,
          prioridade: 'media'
        }
      ]
    },
    {
      numero: 2,
      nome: 'Colaboração Real-time',
      status: 'planejado',
      duracao: '1.5 dias (12h)',
      progresso: 0,
      tarefas: [
        {
          id: 4,
          nome: 'WebSocket para edição colaborativa',
          status: 'planejado',
          descricao: 'Múltiplos usuários editando simultaneamente',
          horas: 4,
          prioridade: 'alta'
        },
        {
          id: 5,
          nome: 'Sistema de comentários em tempo real',
          status: 'planejado',
          descricao: 'Menções, threads, notificações',
          horas: 4,
          prioridade: 'alta'
        },
        {
          id: 6,
          nome: 'Versionamento de documentos',
          status: 'planejado',
          descricao: 'Histórico + rollback automático',
          horas: 4,
          prioridade: 'media'
        }
      ]
    },
    {
      numero: 3,
      nome: 'Analytics & BI',
      status: 'planejado',
      duracao: '1 dia (8h)',
      progresso: 0,
      tarefas: [
        {
          id: 7,
          nome: 'Dashboard Analytics Customizável',
          status: 'planejado',
          descricao: 'Drag-drop widgets, filtros avançados',
          horas: 4,
          prioridade: 'alta'
        },
        {
          id: 8,
          nome: 'Reports programados + export',
          status: 'planejado',
          descricao: 'PDF, Excel, Datasource scheduling',
          horas: 4,
          prioridade: 'media'
        }
      ]
    },
    {
      numero: 4,
      nome: 'IA & Automação',
      status: 'planejado',
      duracao: '1 dia (8h)',
      progresso: 0,
      tarefas: [
        {
          id: 9,
          nome: 'Análise de documentos com IA',
          status: 'planejado',
          descricao: 'Extração de dados, classificação automática',
          horas: 4,
          prioridade: 'alta'
        },
        {
          id: 10,
          nome: 'Sugestões de prazos automáticas',
          status: 'planejado',
          descricao: 'ML model baseado em histórico',
          horas: 4,
          prioridade: 'media'
        }
      ]
    }
  ]
};

function FaseCard({ fase }) {
  const tarefasCompletas = fase.tarefas.filter(t => t.status === 'concluido').length;
  const percentComplete = (tarefasCompletas / fase.tarefas.length) * 100;

  return (
    <Card className="p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="text-2xl">#{fase.numero}</span>
            {fase.nome}
          </h3>
          <p className="text-sm text-gray-500">{fase.duracao}</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">{fase.status}</Badge>
      </div>

      <Progress value={percentComplete} className="mb-4" />

      <div className="space-y-2">
        {fase.tarefas.map((tarefa) => (
          <div key={tarefa.id} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
            <div className="text-xl">{tarefa.status === 'concluido' ? '✅' : '⏳'}</div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{tarefa.nome}</p>
              <p className="text-xs text-gray-600">{tarefa.descricao}</p>
              <div className="flex gap-2 mt-1">
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">{tarefa.horas}h</span>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">{tarefa.prioridade}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function Sprint67Planning() {
  const totalTarefas = sprintData.fases.reduce((sum, f) => sum + f.tarefas.length, 0);
  const tarefasCompletas = sprintData.fases.reduce(
    (sum, f) => sum + f.tarefas.filter(t => t.status === 'concluido').length,
    0
  );
  const progresso = (tarefasCompletas / totalTarefas) * 100;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
          <Rocket className="w-10 h-10 text-blue-600" />
          Sprint 67 — Planejamento
        </h1>
        <p className="text-gray-600">Integração avançada, colaboração real-time e analytics</p>
      </div>

      {/* Sprint Info Card */}
      <Card className="p-6 border-l-4 border-l-blue-600 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-xs text-gray-500">Duração</p>
            <p className="font-bold">{sprintData.duracao}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Data Início</p>
            <p className="font-bold">{sprintData.dataInicio}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Data Fim</p>
            <p className="font-bold">{sprintData.dataFim}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Tarefas</p>
            <p className="font-bold">{totalTarefas}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Progresso</p>
            <p className="font-bold text-blue-600">{Math.round(progresso)}%</p>
          </div>
        </div>
      </Card>

      {/* Objetivos */}
      <Card className="p-6 bg-white">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-green-600" />
          Objetivos Sprint 67
        </h2>
        <ul className="space-y-2">
          {sprintData.objetivos.map((obj, idx) => (
            <li key={idx} className="flex gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{obj}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Fases */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Fases & Tarefas</h2>
        {sprintData.fases.map((fase) => (
          <FaseCard key={fase.numero} fase={fase} />
        ))}
      </div>

      {/* Summary */}
      <Card className="p-6 bg-gradient-to-r from-blue-100 to-indigo-100 border-l-4 border-l-blue-600">
        <h3 className="font-bold text-lg mb-2">📋 Resumo</h3>
        <p className="text-gray-700">
          Sprint 67 marca o início da fase de integração avançada do Legal Tasks. Com Sprint 66 finalizado (100% ✅),
          temos uma base sólida em produção. Agora focamos em expandir funcionalidades, implementar colaboração real-time
          e entregar analytics avançado. ETA: 13/03 18:00 UTC com todas as features produção-ready.
        </p>
      </Card>
    </div>
  );
}