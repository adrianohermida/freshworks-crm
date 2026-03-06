import React from 'react';
import { CheckCircle2, AlertCircle, TrendingUp, Zap, Database, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Sprint20Summary() {
  const tarefas = [
    { 
      num: '1', 
      nome: 'Executive Dashboard', 
      componente: 'ExecutiveDashboard.jsx', 
      status: 'completo',
      detalhe: '6 KPIs + Health Score + Recomendações'
    },
    { 
      num: '2', 
      nome: 'Google Calendar Sync', 
      componente: 'syncAudienciasGoogleCalendar.js', 
      status: 'completo',
      detalhe: 'Sincroniza audiências a cada 12h'
    },
    { 
      num: '3', 
      nome: 'Google Drive Sync', 
      componente: 'syncDocumentosGoogleDrive.js', 
      status: 'completo',
      detalhe: 'Sincroniza documentos diariamente'
    },
    { 
      num: '4', 
      nome: 'Webhooks Real-time', 
      componente: 'webhookAdviseRealtime.js', 
      status: 'completo',
      detalhe: '4 eventos monitorados (pub, intimação, prazo, audiência)'
    },
    { 
      num: '5', 
      nome: 'Page Dashboard', 
      componente: 'DashboardExecutivo.jsx', 
      status: 'completo',
      detalhe: 'Landing page com integração'
    },
    { 
      num: '6', 
      nome: 'Performance Optimization', 
      componente: 'usePerformanceOptimization.js', 
      status: 'completo',
      detalhe: 'Lazy loading, caching, code splitting'
    }
  ];

  const automacoes = [
    { nome: 'Sync Publicações', intervalo: '6h', status: true },
    { nome: 'Sync Intimações', intervalo: '6h', status: true },
    { nome: 'Sync Processos', intervalo: '12h', status: true },
    { nome: 'Sync Alertas', intervalo: '6h', status: true },
    { nome: 'Relatório Semanal', intervalo: 'Seg 08h', status: true },
    { nome: 'Google Calendar', intervalo: '12h', status: true },
    { nome: 'Google Drive', intervalo: '24h', status: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Sprint 20 - Resumo Executivo</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Fase 6: Dashboard Executivo & Integrações Avançadas</p>
          <div className="flex items-center gap-2 mt-4">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <span className="text-2xl font-bold text-green-600">100% CONCLUÍDO</span>
          </div>
        </div>

        {/* Tarefas */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6" /> Tarefas Completadas (6/6)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tarefas.map((tarefa) => (
              <div key={tarefa.num} className="border border-green-200 dark:border-green-900 rounded-lg p-4 bg-green-50 dark:bg-green-950">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{tarefa.num}. {tarefa.nome}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tarefa.componente}</p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">{tarefa.detalhe}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Automações */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6" /> Automações Ativas (7/7)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {automacoes.map((auto, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{auto.nome}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">A cada {auto.intervalo}</p>
                </div>
                {auto.status && <CheckCircle2 className="w-5 h-5 text-green-600" />}
              </div>
            ))}
          </div>
        </Card>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Total de Linhas de Código</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">22.4KB</p>
          </Card>
          <Card className="p-6 text-center">
            <Database className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Componentes Criados</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">6</p>
          </Card>
          <Card className="p-6 text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Melhorias de Performance</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">8</p>
          </Card>
        </div>

        {/* Próximas Fases */}
        <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
          <h2 className="text-2xl font-bold mb-4">🚀 Próximo: Sprint 21 - Monitoramento & Analytics Avançado</h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>✓ Sistema de monitoramento em tempo real</li>
            <li>✓ Dashboard de saúde do sistema</li>
            <li>✓ Alertas inteligentes com IA</li>
            <li>✓ Relatórios preditivos</li>
            <li>✓ Otimizações de banco de dados</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}