import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Target, AlertTriangle, Loader2 } from 'lucide-react';
import { subDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ExecutiveDashboard() {
  const [comparacao, setComparacao] = useState('30'); // dias para comparar

  // Dados
  const { data: processos = [] } = useQuery({
    queryKey: ['processos-exec'],
    queryFn: () => base44.entities.ProcessoAdvise.list('-dataSincronizacao', 100)
  });

  const { data: alertas = [] } = useQuery({
    queryKey: ['alertas-exec'],
    queryFn: () => base44.entities.Alerta.list('-dataOcorrencia', 100)
  });

  const { data: prazos = [] } = useQuery({
    queryKey: ['prazos-exec'],
    queryFn: () => base44.entities.PrazoProcessual.list('-dataVencimento', 100)
  });

  const { data: audiencias = [] } = useQuery({
    queryKey: ['audiencias-exec'],
    queryFn: () => base44.entities.Audiencia.list('-dataAudiencia', 100)
  });

  const periodoNum = parseInt(comparacao);
  const dataLimite = subDays(new Date(), periodoNum);

  // KPIs
  const kpis = {
    processosAtivos: processos.filter(p => p.statusProcesso === 'ativo').length,
    processosTotal: processos.length,
    prazosVencidos: prazos.filter(p => p.status === 'vencido').length,
    alertasCriticos: alertas.filter(a => a.severidade === 'critica' && !a.resolvido).length,
    audienciasProximas: audiencias.filter(a => {
      const data = new Date(a.dataAudiencia);
      const agora = new Date();
      const diasAte = Math.ceil((data - agora) / (1000 * 60 * 60 * 24));
      return diasAte >= 0 && diasAte <= 14;
    }).length,
    saudeGeral: Math.max(0, 100 - (prazos.filter(p => p.status === 'vencido').length * 5) - (alertas.filter(a => a.severidade === 'critica').length * 3))
  };

  // Comparação período
  const periodoAnterior = subDays(dataLimite, periodoNum);
  const processosAnterior = processos.filter(p => new Date(p.dataSincronizacao) >= periodoAnterior && new Date(p.dataSincronizacao) < dataLimite).length;
  const processosAtual = processos.filter(p => new Date(p.dataSincronizacao) >= dataLimite).length;
  const alertasAnterior = alertas.filter(a => new Date(a.dataOcorrencia) >= periodoAnterior && new Date(a.dataOcorrencia) < dataLimite).length;
  const alertasAtual = alertas.filter(a => new Date(a.dataOcorrencia) >= dataLimite).length;

  // Variação
  const variacaoProcessos = processosAnterior > 0 ? Math.round(((processosAtual - processosAnterior) / processosAnterior) * 100) : 0;
  const variacaoAlertas = alertasAnterior > 0 ? Math.round(((alertasAtual - alertasAnterior) / alertasAnterior) * 100) : 0;

  // Dados para gráfico de tendência
  const tendencia = Array.from({ length: 7 }, (_, i) => {
    const data = subDays(new Date(), 6 - i);
    return {
      data: format(data, 'dd/MMM', { locale: ptBR }),
      processosAtivos: processos.filter(p => {
        const pData = new Date(p.dataSincronizacao);
        return pData.toDateString() === data.toDateString() && p.statusProcesso === 'ativo';
      }).length,
      alertas: alertas.filter(a => {
        const aData = new Date(a.dataOcorrencia);
        return aData.toDateString() === data.toDateString();
      }).length
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard Executivo</h2>
        <select
          value={comparacao}
          onChange={(e) => setComparacao(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="7">7 dias</option>
          <option value="30">30 dias</option>
          <option value="90">90 dias</option>
        </select>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Processos Ativos */}
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 font-medium">Processos Ativos</p>
            <p className="text-2xl font-bold text-gray-900">{kpis.processosAtivos}</p>
            <p className="text-xs text-gray-500 mt-1">de {kpis.processosTotal}</p>
            <Badge className="mt-2 bg-blue-100 text-blue-800 text-xs">
              {Math.round((kpis.processosAtivos / kpis.processosTotal) * 100)}%
            </Badge>
          </CardContent>
        </Card>

        {/* Prazos Vencidos */}
        <Card className={kpis.prazosVencidos > 0 ? 'border-red-200 bg-red-50' : ''}>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 font-medium">Prazos Vencidos</p>
            <p className={`text-2xl font-bold ${kpis.prazosVencidos > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {kpis.prazosVencidos}
            </p>
            <p className="text-xs text-gray-500 mt-1">crítico</p>
          </CardContent>
        </Card>

        {/* Alertas Críticos */}
        <Card className={kpis.alertasCriticos > 0 ? 'border-orange-200 bg-orange-50' : ''}>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 font-medium">Alertas Críticos</p>
            <p className={`text-2xl font-bold ${kpis.alertasCriticos > 0 ? 'text-orange-600' : 'text-green-600'}`}>
              {kpis.alertasCriticos}
            </p>
            <p className="text-xs text-gray-500 mt-1">não resolvidos</p>
          </CardContent>
        </Card>

        {/* Audiências Próximas */}
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 font-medium">Audiências 14d</p>
            <p className="text-2xl font-bold text-gray-900">{kpis.audienciasProximas}</p>
            <p className="text-xs text-gray-500 mt-1">agendadas</p>
          </CardContent>
        </Card>

        {/* Health Score */}
        <Card className={kpis.saudeGeral >= 80 ? 'border-green-200 bg-green-50' : kpis.saudeGeral >= 60 ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 font-medium">Saúde Geral</p>
            <div className="flex items-end gap-1 mt-1">
              <p className={`text-2xl font-bold ${
                kpis.saudeGeral >= 80 ? 'text-green-600' :
                kpis.saudeGeral >= 60 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {kpis.saudeGeral}
              </p>
              <p className="text-xs text-gray-500 pb-1">%</p>
            </div>
          </CardContent>
        </Card>

        {/* Target */}
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 font-medium">Meta: 95%</p>
            <p className="text-2xl font-bold text-gray-900">{95 - kpis.saudeGeral}</p>
            <p className="text-xs text-gray-500 mt-1">gap</p>
          </CardContent>
        </Card>
      </div>

      {/* Comparações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Processos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Processos</span>
              <div className="flex items-center gap-1">
                {variacaoProcessos > 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-bold">+{variacaoProcessos}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600 font-bold">{variacaoProcessos}%</span>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Período anterior:</span>
                <span className="font-semibold">{processosAnterior}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Período atual:</span>
                <span className="font-semibold text-blue-600">{processosAtual}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alertas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Alertas</span>
              <div className="flex items-center gap-1">
                {variacaoAlertas > 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-600 font-bold">+{variacaoAlertas}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-bold">{variacaoAlertas}%</span>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Período anterior:</span>
                <span className="font-semibold">{alertasAnterior}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Período atual:</span>
                <span className="font-semibold text-yellow-600">{alertasAtual}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tendência */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tendência Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={tendencia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="processosAtivos"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Processos Ativos"
              />
              <Line
                type="monotone"
                dataKey="alertas"
                stroke="#ef4444"
                strokeWidth={2}
                name="Alertas"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recomendações */}
      {(kpis.prazosVencidos > 0 || kpis.alertasCriticos > 0) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Recomendações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-yellow-900">
              {kpis.prazosVencidos > 0 && (
                <li>⚠️ {kpis.prazosVencidos} prazo(s) vencido(s) - ação imediata recomendada</li>
              )}
              {kpis.alertasCriticos > 0 && (
                <li>🚨 {kpis.alertasCriticos} alerta(s) crítico(s) pendente(s) - revise prioritariamente</li>
              )}
              {kpis.saudeGeral < 60 && (
                <li>📊 Saúde geral abaixo de 60% - verificar acompanhamento de prazos</li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}