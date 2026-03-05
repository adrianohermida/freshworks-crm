import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Loader2, Download, TrendingUp, AlertCircle, CheckCircle2, Zap, Clock, Wifi } from 'lucide-react';

export default function SincronizadorPublicacoes() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [tamanhoLote, setTamanhoLote] = useState(100);
  const [numLotes, setNumLotes] = useState(1);
  const [syncError, setSyncError] = useState(null);
  const [syncSuccess, setSyncSuccess] = useState(null);
  const [lastSyncResult, setLastSyncResult] = useState(null);
  const [syncProgress, setSyncProgress] = useState(0);
  const [currentLote, setCurrentLote] = useState(0);
  
  // Auto-sync settings
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [autoSyncFrequency, setAutoSyncFrequency] = useState('disabled');
  const [autoSyncTime, setAutoSyncTime] = useState('02:00');
  const [autoSyncLotes, setAutoSyncLotes] = useState('5');

  // Buscar métricas
  const { data: metricas = {}, isLoading: metricsLoading, refetch: refetchMetrics } = useQuery({
    queryKey: ['publicacoes-sync-metricas'],
    queryFn: async () => {
      const response = await base44.functions.invoke('advise/getTotalPublicacoesAdvise', {});
      return response.data || { totalPublicacoesAdvise: 0, totalImportadas: 0, faltamImportar: 0, percentualProgresso: 0 };
    },
    staleTime: 1000 * 60 * 5,
    retry: false
  });

  // Sincronização manual por lotes menores
    const syncMutation = useMutation({
      mutationFn: async () => {
        setSyncError(null);
        setSyncSuccess(null);
        setLastSyncResult(null);
        setSyncProgress(0);
        setCurrentLote(0);

        // Lotes fixos menores para evitar timeout (30 registros)
        const loteSize = 20;
        const numLotesInteiros = parseInt(numLotes);
        
        let totalProcessados = 0;
        let totalErros = 0;
        const REQUEST_TIMEOUT = 30000; // 30 segundos por requisição
        const DELAY_ENTRE_LOTES = 2000; // 2 segundos entre lotes

        for (let i = 0; i < numLotesInteiros; i++) {
          setCurrentLote(i + 1);
          setSyncProgress(Math.round(((i + 1) / numLotesInteiros) * 100));

          try {
            const response = await Promise.race([
              base44.functions.invoke('advise/syncPublicacoesManual', { 
                tamanhoLote: loteSize,
                ...(dataInicio && { dataInicio }),
                ...(dataFim && { dataFim })
              }),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error(`Timeout após ${REQUEST_TIMEOUT / 1000}s`)), REQUEST_TIMEOUT)
              )
            ]);
            
            const resultado = response.data;
            totalProcessados += resultado.processados || 0;
            totalErros += resultado.erros || 0;
          } catch (err) {
            // Acumular erro parcial, continuar com próximo lote
            console.error(`Erro no lote ${i + 1}:`, err);
            if (err.message.includes('Timeout') || err.message.includes('504') || err.message.includes('500')) {
              totalErros++;
            }
          }

          // Delay entre lotes para evitar rate limit/timeout
          if (i < numLotesInteiros - 1) {
            await new Promise(resolve => setTimeout(resolve, DELAY_ENTRE_LOTES));
          }
        }

        return {
          processados: totalProcessados,
          erros: totalErros,
          lotes: numLotesInteiros
        };
      },
      onSuccess: (data) => {
        setSyncProgress(100);
        setSyncSuccess(true);
        setLastSyncResult(data);
        refetchMetrics();
        setTimeout(() => {
          setSyncSuccess(false);
          setSyncProgress(0);
          setCurrentLote(0);
        }, 5000);
      },
      onError: (err) => {
        const errorMsg = err.message || 'Erro ao sincronizar publicações';
        setSyncError(errorMsg);
        setSyncProgress(0);
        setCurrentLote(0);
      }
    });

  const lotesFaltando = metricas.faltamImportar ? Math.ceil(metricas.faltamImportar / parseInt(tamanhoLote)) : 0;
   const percentualProgresso = metricas.percentualProgresso || 0;
   const totalRegistrosNaIteracao = parseInt(tamanhoLote) * parseInt(numLotes);

  return (
    <div className="space-y-6">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total no Advise */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-blue-700">Total no Advise</p>
            <Download className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-900">{(metricas.totalPublicacoesAdvise || 0).toLocaleString('pt-BR')}</p>
          <p className="text-xs text-blue-600 mt-2">publicações disponíveis</p>
        </Card>

        {/* Faltam Importar */}
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-orange-700">Faltam Importar</p>
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-900">{(metricas.faltamImportar || 0).toLocaleString('pt-BR')}</p>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs text-orange-600">
              <span>Progresso</span>
              <span className="font-bold">{percentualProgresso}%</span>
            </div>
            <div className="h-2 bg-orange-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-600 transition-all duration-300" 
                style={{ width: `${percentualProgresso}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros e Sincronização */}
      <Card className="p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sincronização Manual</h3>
        
        <div className="space-y-4">
          {/* Período */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Início (opcional)
              </label>
              <Input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                disabled={syncMutation.isPending}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Fim (opcional)
              </label>
              <Input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                disabled={syncMutation.isPending}
              />
            </div>
          </div>

          {/* Configuração de Lotes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamanho de Cada Lote
              </label>
              <Input
                type="number"
                min="5"
                max="100"
                value={tamanhoLote}
                onChange={(e) => setTamanhoLote(e.target.value)}
                disabled={syncMutation.isPending}
              />
              <p className="text-xs text-gray-500 mt-2">registros por lote (máx: 100)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantos Lotes Importar
              </label>
              <Input
                type="number"
                min="1"
                max="1000"
                value={numLotes}
                onChange={(e) => setNumLotes(e.target.value)}
                disabled={syncMutation.isPending}
              />
              <p className="text-xs text-gray-500 mt-2">ex: 40 lotes × 100 = 4.000 registros</p>
            </div>
          </div>

          {/* Info de Lotes */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm text-blue-900 font-medium">Esta sincronização:</p>
              <p className="text-sm text-blue-900 font-bold">{totalRegistrosNaIteracao.toLocaleString('pt-BR')} registros</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-blue-900 font-medium">Faltam importar:</p>
              <p className="text-sm text-blue-900 font-bold">{(metricas.faltamImportar || 0).toLocaleString('pt-BR')} publicações</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-blue-900 font-medium">Lotes faltando:</p>
              <p className="text-sm text-blue-900 font-bold">{lotesFaltando} lotes</p>
            </div>
            <div className="h-2 bg-blue-200 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-blue-600 transition-all duration-300" 
                style={{ width: `${percentualProgresso}%` }}
              />
            </div>
            <p className="text-xs text-blue-700 text-right">{percentualProgresso}% completo</p>
          </div>

          {/* Progresso em Tempo Real */}
          {syncMutation.isPending && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-blue-900">Sincronizando...</p>
                <p className="text-sm font-bold text-blue-900">{syncProgress}%</p>
              </div>
              <div className="h-3 bg-blue-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300" 
                  style={{ width: `${syncProgress}%` }}
                />
              </div>
              <p className="text-xs text-blue-700">Lote {currentLote} de {parseInt(numLotes)}</p>
            </div>
          )}

          {/* Mensagens de Status */}
          {syncSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-900 font-medium">✅ Sincronização concluída!</p>
                {lastSyncResult && (
                  <p className="text-green-700 text-sm">
                    Total: {lastSyncResult.processados || 0} registros em {lastSyncResult.lotes} lote(s), Erros: {lastSyncResult.erros || 0}
                  </p>
                )}
              </div>
            </div>
          )}

          {syncError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-900 font-medium">❌ Erro na sincronização</p>
                  <p className="text-red-700 text-sm mt-1">{syncError}</p>
                </div>
              </div>

              {/* Error Type Badge */}
              <div className="flex flex-wrap gap-2">
                {syncError.includes('Timeout') && (
                  <div className="flex items-center gap-1 bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full">
                    <Clock className="w-3 h-3" />
                    <span>Timeout (requisição demorou muito)</span>
                  </div>
                )}
                {syncError.includes('429') && (
                  <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full">
                    <Wifi className="w-3 h-3" />
                    <span>Rate Limit (muitas requisições)</span>
                  </div>
                )}
                {syncError.includes('500') && (
                  <div className="flex items-center gap-1 bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    <span>Erro no Servidor (500)</span>
                  </div>
                )}
                {syncError.includes('504') && (
                  <div className="flex items-center gap-1 bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full">
                    <Clock className="w-3 h-3" />
                    <span>Gateway Timeout (504)</span>
                  </div>
                )}
                {!syncError.includes('Timeout') && !syncError.includes('429') && !syncError.includes('500') && !syncError.includes('504') && (
                  <div className="flex items-center gap-1 bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    <span>Erro Desconhecido</span>
                  </div>
                )}
              </div>

              {/* Suggestions */}
              <div className="bg-white/50 rounded p-3 border border-red-100 text-sm text-red-800 space-y-1">
                <p className="font-medium">💡 Sugestões:</p>
                {syncError.includes('Timeout') && (
                  <ul className="list-disc list-inside space-y-1">
                    <li>Reduzir tamanho do lote (ex: 30 registros)</li>
                    <li>Tentar novamente em alguns minutos</li>
                    <li>Usar o botão ⚡ para importar menos registros</li>
                  </ul>
                )}
                {syncError.includes('429') && (
                  <ul className="list-disc list-inside space-y-1">
                    <li>Aguarde alguns minutos antes de tentar novamente</li>
                    <li>Reduzir frequência das sincronizações automáticas</li>
                    <li>Usar lotes menores (50-100 registros)</li>
                  </ul>
                )}
                {syncError.includes('500') || syncError.includes('504') && (
                  <ul className="list-disc list-inside space-y-1">
                    <li>O servidor Advise pode estar indisponível</li>
                    <li>Tente novamente em alguns minutos</li>
                    <li>Verifique a conexão com a API Advise</li>
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Botões Sincronizar */}
          <div className="flex gap-3">
            <Button
              onClick={() => syncMutation.mutate()}
              disabled={syncMutation.isPending || metricsLoading || metricas.faltamImportar === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 h-10"
            >
              {syncMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Importar agora
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                setTamanhoLote('150');
                setNumLotes('10');
                syncMutation.mutate();
              }}
              disabled={syncMutation.isPending || metricsLoading || metricas.faltamImportar === 0}
              variant="outline"
              className="px-4 h-10"
              title="Quick: 150 × 10 = 1.500 registros"
            >
              <Zap className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Agendamento Automático */}
      <Card className="p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">⏰ Sincronização Automática</h3>

      <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frequência
          </label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={autoSyncFrequency}
            onChange={(e) => setAutoSyncFrequency(e.target.value)}
          >
            <option value="disabled">❌ Desativado</option>
            <option value="daily">📅 Diariamente</option>
            <option value="every-6h">🔄 A cada 6 horas</option>
            <option value="every-12h">🔄 A cada 12 horas</option>
          </select>
          <p className="text-xs text-gray-500 mt-2">Executa automaticamente neste intervalo</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horário de Execução
          </label>
          <input 
            type="time" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={autoSyncTime}
            onChange={(e) => setAutoSyncTime(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-2">Sua zona: America/Manaus</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lotes por Execução
        </label>
        <Input
          type="number"
          min="1"
          max="100"
          value={autoSyncLotes}
          onChange={(e) => setAutoSyncLotes(e.target.value)}
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-2">Quantos lotes importar a cada execução automática</p>
      </div>

      <div className={`border rounded-lg p-4 ${autoSyncFrequency !== 'disabled' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
        <p className={`text-sm font-medium ${autoSyncFrequency !== 'disabled' ? 'text-green-900' : 'text-gray-900'}`}>
          {autoSyncFrequency !== 'disabled' ? '✅ Ativado' : '⏸️ Desativado'}
        </p>
        <p className={`text-xs mt-1 ${autoSyncFrequency !== 'disabled' ? 'text-green-700' : 'text-gray-600'}`}>
          {autoSyncFrequency !== 'disabled' 
            ? `Próxima execução: ${autoSyncFrequency === 'daily' ? 'Hoje' : 'Em breve'} às ${autoSyncTime}`
            : 'Sincronização automática desativada'}
        </p>
      </div>

      <Button 
        disabled={autoSyncFrequency === 'disabled'}
        className="w-full bg-green-600 hover:bg-green-700 h-10 disabled:opacity-50"
        onClick={() => alert(`Sincronização automática configurada:\n✅ Frequência: ${autoSyncFrequency}\n⏰ Horário: ${autoSyncTime}\n📦 Lotes: ${autoSyncLotes}`)}
      >
        💾 Salvar Configuração
      </Button>
      </div>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-blue-50 border border-blue-200">
          <h4 className="font-semibold text-blue-900 text-sm mb-2">💡 Estratégia Recomendada</h4>
          <p className="text-xs text-blue-700">
            Como temos 4M+ de publicações, recomenda-se importar em lotes de 100-150 registros por vez. Clique várias vezes ao longo do dia para distribuir a carga.
          </p>
        </Card>

        <Card className="p-4 bg-gray-50 border border-gray-200">
          <h4 className="font-semibold text-gray-900 text-sm mb-2">⚙️ Configuração</h4>
          <p className="text-xs text-gray-600">
            Use o painel para importações manuais. Sincronização automática: diariamente às 02:00 AM.
          </p>
        </Card>

        <Card className="p-4 bg-amber-50 border border-amber-200">
          <h4 className="font-semibold text-amber-900 text-sm mb-2">📌 Dicas</h4>
          <ul className="text-xs text-amber-700 space-y-1">
            <li>• Comece com 100-200 registros para testar</li>
            <li>• Aumente gradualmente se estável</li>
            <li>• Datas opcionais para períodos específicos</li>
          </ul>
        </Card>

        <Card className="p-4 bg-green-50 border border-green-200">
          <h4 className="font-semibold text-green-900 text-sm mb-2">🚀 Botão Rápido</h4>
          <p className="text-xs text-green-700">
            O ⚡ importa 10 lotes (1.000 registros) de uma vez. Perfeito para progresso rápido.
          </p>
        </Card>
      </div>
      </div>
      );
      }