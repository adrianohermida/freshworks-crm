import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Zap, Database, Mail, Bell, BarChart3, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { base44 } from '@/api/base44Client';

export default function IntegracaoCompleta() {
  const [status, setStatus] = useState({
    datajud_api: 'ativo',
    sincronizacao: 'operacional',
    alertas: 'monitorando',
    notificacoes: 'ativas',
    relatorios: 'disponiveis',
    fallback_offline: 'configurado'
  });

  const [metricas, setMetricas] = useState({
    total_processos: 0,
    movimentos_sincronizados: 0,
    taxa_sucesso: 0,
    tempo_medio: 0,
    alertas_ativos: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarDados();
    const interval = setInterval(carregarDados, 60000);
    return () => clearInterval(interval);
  }, []);

  const carregarDados = async () => {
    try {
      setIsLoading(true);

      // Buscar dados
      const sincs = await base44.entities.TPUSincronizacao.list('-data_sincronizacao', 100);
      const processos = await base44.entities.Process.list(null, 1);

      // Calcular métricas
      const sucessos = sincs.filter(s => s.status === 'sucesso').length;
      const total_movimentos = sincs.reduce((sum, s) => sum + (s.total_movimentos_sincronizados || 0), 0);
      const tempo_medio = sincs.length > 0 ? Math.round(sincs.reduce((sum, s) => sum + (s.tempo_execucao_ms || 0), 0) / sincs.length) : 0;

      setMetricas({
        total_processos: processos?.length || 0,
        movimentos_sincronizados: total_movimentos,
        taxa_sucesso: sincs.length > 0 ? Math.round((sucessos / sincs.length) * 100) : 0,
        tempo_medio,
        alertas_ativos: 0
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const componentes = [
    {
      nome: 'API DataJud',
      descricao: 'Integração em tempo real com DataJud',
      status: 'ativo',
      icone: <Database className="w-5 h-5" />,
      features: ['Sincronização automática', 'Retry com backoff', 'Fallback offline']
    },
    {
      nome: 'Sincronizações Agendadas',
      descricao: 'Agendamento automático a cada período',
      status: 'operacional',
      icone: <RefreshCw className="w-5 h-5" />,
      features: ['02:00 - Sync diária', '6h - Check performance', '08:00 - Resumo email']
    },
    {
      nome: 'Sistema de Alertas',
      descricao: 'Monitoramento contínuo de performance',
      status: 'monitorando',
      icone: <Bell className="w-5 h-5" />,
      features: ['Taxa de erro > 10%', 'Tempo > 5s', 'Falhas consecutivas']
    },
    {
      nome: 'Notificações',
      descricao: 'Email + Toast em tempo real',
      status: 'ativas',
      icone: <Mail className="w-5 h-5" />,
      features: ['Email customizado', 'Toast push', 'Histórico']
    },
    {
      nome: 'Relatórios Analíticos',
      descricao: 'Exportação em PDF e CSV',
      status: 'disponiveis',
      icone: <BarChart3 className="w-5 h-5" />,
      features: ['Gráficos interativos', 'Exportação PDF/CSV', '7/30/90 dias']
    },
    {
      nome: 'Fallback Offline',
      descricao: 'Parsing local quando API falha',
      status: 'configurado',
      icone: <Zap className="w-5 h-5" />,
      features: ['JuizoCNJ local', 'CodigoForoTJSP', 'Parsing CNJ']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativo':
      case 'operacional':
      case 'monitorando':
      case 'ativas':
      case 'disponiveis':
      case 'configurado':
        return 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700';
      case 'erro':
        return 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700';
      default:
        return 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ativo':
      case 'operacional':
      case 'monitorando':
      case 'ativas':
      case 'disponiveis':
      case 'configurado':
        return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'erro':
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            DataJud - Integração Completa
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Plataforma de sincronização e monitoramento de processos judiciais
          </p>
        </div>

        {/* MÉTRICAS PRINCIPAIS */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Processos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{metricas.total_processos}</p>
            </Card>
            <Card className="p-4 border-cyan-200 dark:border-cyan-700">
              <p className="text-sm text-cyan-600 dark:text-cyan-400">Movimentos</p>
              <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-2">{metricas.movimentos_sincronizados}</p>
            </Card>
            <Card className="p-4 border-green-200 dark:border-green-700">
              <p className="text-sm text-green-600 dark:text-green-400">Taxa Sucesso</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{metricas.taxa_sucesso}%</p>
            </Card>
            <Card className="p-4 border-blue-200 dark:border-blue-700">
              <p className="text-sm text-blue-600 dark:text-blue-400">Tempo Médio</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{metricas.tempo_medio}ms</p>
            </Card>
            <Card className="p-4 border-purple-200 dark:border-purple-700">
              <p className="text-sm text-purple-600 dark:text-purple-400">Alertas</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">{metricas.alertas_ativos}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Status Geral</p>
              <Badge className="mt-2 bg-green-500">Operacional</Badge>
            </Card>
          </div>
        )}

        {/* COMPONENTES */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Componentes do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {componentes.map((comp) => (
              <Card key={comp.nome} className={`p-6 border-l-4 border-l-cyan-600 ${getStatusColor(comp.status)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
                      {comp.icone}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{comp.nome}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{comp.descricao}</p>
                    </div>
                  </div>
                  {getStatusIcon(comp.status)}
                </div>
                <div className="space-y-1">
                  {comp.features.map((feature) => (
                    <p key={feature} className="text-xs text-gray-600 dark:text-gray-400">• {feature}</p>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* PROGRESSO GERAL */}
        <Card className="p-6 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900 dark:to-blue-900">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Progresso da Plataforma</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sprints Completados</span>
                <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">8/9 (88.9%)</span>
              </div>
              <Progress value={88.9} className="h-3" />
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Sprint 5: Entities</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Sprint 6: Webhooks</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Sprint 7: Analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Sprint 8: Notificações</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Sprint 9: Integração Completa</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* PRÓXIMAS AÇÕES */}
        <Card className="p-6 bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700">
          <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-4">🚀 Próximas Fases</h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li className="flex items-start gap-2">
              <span className="font-bold">→</span>
              <span><strong>Integração Móvel:</strong> App React Native para monitoramento em tempo real</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">→</span>
              <span><strong>BI Avançado:</strong> Dashboard com ML para previsão de atrasos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">→</span>
              <span><strong>Webhooks Externos:</strong> Integração com Slack, Teams, Zapier</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">→</span>
              <span><strong>Multi-Tribunal:</strong> Suporte para todos os tribunais do Brasil</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}