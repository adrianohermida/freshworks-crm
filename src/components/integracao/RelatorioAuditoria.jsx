import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  RefreshCw,
  FileText,
  Download,
  BarChart3
} from 'lucide-react';

export default function RelatorioAuditoria() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState('todos');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState(new Date().toISOString().split('T')[0]);

  const loadAudit = async () => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke('advise/auditSyncPublicacoes', {
        tipo: filtro,
        dataInicio: dataInicio || undefined,
        dataFim,
        limit: 100
      });

      if (response.data?.success) {
        setLogs(response.data.logs);
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Erro ao carregar auditoria:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAudit();
  }, [filtro]);

  // Dados para gráfico
  const chartData = logs
    .slice(0, 30)
    .reverse()
    .map((log, idx) => ({
      dia: new Date(log.dataEvento).toLocaleDateString('pt-BR').slice(0, 5),
      novas: log.novasImportadas || 0,
      duplicatas: log.duplicatasIgnoradas || 0,
      erros: log.errosEncontrados || 0
    }));

  const getTipoBadge = (tipo) => {
    const badges = {
      sucesso: 'bg-green-100 text-green-800',
      erro: 'bg-red-100 text-red-800',
      duplicata: 'bg-yellow-100 text-yellow-800',
      aviso: 'bg-orange-100 text-orange-800'
    };
    const icons = {
      sucesso: '✅',
      erro: '❌',
      duplicata: '⚠️',
      aviso: '⚡'
    };
    return { badge: badges[tipo] || 'bg-gray-100 text-gray-800', icon: icons[tipo] || '❓' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            Auditoria de Sincronizações
          </h2>
          <p className="text-gray-600 mt-1">Dashboard completo com métricas, trends e histórico detalhado</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar Relatório
        </Button>
      </div>

      {/* Estatísticas Gerais */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-600">Eventos Totais</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.sucessos}</div>
              <div className="text-xs text-gray-600">Sincronizações OK</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{stats.erros}</div>
              <div className="text-xs text-gray-600">Erros</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">{stats.duplicatas}</div>
              <div className="text-xs text-gray-600">Duplicatas Bloqueadas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{stats.taxaSucesso}%</div>
              <div className="text-xs text-gray-600">Taxa de Sucesso</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alert Status */}
      {stats && stats.taxaSucesso < 90 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <AlertDescription className="text-orange-900 ml-2">
            <strong>Taxa de sucesso abaixo de 90%:</strong> Verifique as configurações da API Advise ou abra um ticket de suporte.
          </AlertDescription>
        </Alert>
      )}

      {/* Gráfico de Tendência */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tendência de Sincronizações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="novas" fill="#10b981" name="Novas Importadas" />
                <Bar dataKey="duplicatas" fill="#f59e0b" name="Duplicatas" />
                <Bar dataKey="erros" fill="#ef4444" name="Erros" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Evento</label>
              <select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="todos">Todos</option>
                <option value="sucesso">Sucessos</option>
                <option value="erro">Erros</option>
                <option value="duplicata">Duplicatas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <Button 
            onClick={loadAudit}
            disabled={loading}
            className="w-full bg-[#7E57FF] hover:bg-[#6D47E0] text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Carregando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Filtrar
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Log de Eventos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Log de Sincronizações ({logs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {logs.map((log) => {
              const { badge, icon } = getTipoBadge(log.tipoEvento);
              return (
                <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{icon}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge}`}>
                        {log.tipoEvento.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(log.dataEvento).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">
                      {log.tipoExecucao === 'automatica' ? '🤖 Automática' : '👤 Manual'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">{log.mensagem}</p>

                  {(log.novasImportadas > 0 || log.duplicatasIgnoradas > 0 || log.errosEncontrados > 0) && (
                    <div className="grid grid-cols-4 gap-2 text-xs bg-gray-50 rounded p-2 mt-2">
                      <div><span className="text-gray-600">Novas:</span> <strong className="text-green-700">{log.novasImportadas}</strong></div>
                      <div><span className="text-gray-600">Duplicatas:</span> <strong className="text-yellow-700">{log.duplicatasIgnoradas}</strong></div>
                      <div><span className="text-gray-600">Erros:</span> <strong className="text-red-700">{log.errosEncontrados}</strong></div>
                      <div><span className="text-gray-600">Tempo:</span> <strong>{log.tempoSegundos ? log.tempoSegundos.toFixed(1) : '—'}s</strong></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {logs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum evento encontrado para os filtros selecionados
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}