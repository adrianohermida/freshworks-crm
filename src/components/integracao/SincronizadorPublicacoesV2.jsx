import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  TrendingUp,
  Zap,
  Clock
} from 'lucide-react';

export default function SincronizadorPublicacoesV2() {
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState({ 
    total: 0, 
    processado: 0, 
    duplicados: 0, 
    erros: 0,
    novas: 0,
    fase: 'idle'
  });
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState(new Date().toISOString().split('T')[0]);

  const handleSync = async () => {
    setSyncing(true);
    setErro(null);
    setResultado(null);
    
    try {
      setProgress({ total: 0, processado: 0, duplicados: 0, erros: 0, novas: 0, fase: 'carregando_metricas' });

      // Carregar métricas iniciais
      const metricsResp = await base44.functions.invoke('advise/getTotalPublicacoesAdvise', {});
      const totalAPI = metricsResp.data?.totalPublicacoesAdvise || 0;
      
      setProgress(p => ({ ...p, total: totalAPI, fase: 'sincronizando' }));

      // Executar sincronização
      const response = await base44.functions.invoke('advise/syncPublicacoesManual', {
        dataInicio: dataInicio || undefined,
        dataFim: dataFim,
        tamanhoLote: 20,
        maxPublicacoes: 200
      });

      if (response.data?.success) {
        setProgress(p => ({ 
          ...p, 
          processado: response.data.totalProcessados,
          duplicados: response.data.totalPulados,
          erros: response.data.totalErros,
          novas: response.data.totalProcessados,
          fase: 'completo'
        }));

        setResultado({
          novas: response.data.totalProcessados,
          duplicadas: response.data.totalPulados,
          erros: response.data.totalErros,
          faltamImportar: Math.max(0, totalAPI - response.data.totalProcessados),
          tempoSegundos: response.data.tempoTotalSegundos,
          paginasProcessadas: response.data.paginasProcessadas,
          timestamp: new Date(response.data.timestamp).toLocaleString('pt-BR'),
          periodoInicio: response.data.periodo?.dataInicio,
          periodoFim: response.data.periodo?.dataFim
        });
      } else {
        throw new Error(response.data?.error || 'Sincronização falhou');
      }
    } catch (err) {
      setErro(err.message || 'Erro na sincronização');
      setProgress(p => ({ ...p, fase: 'erro' }));
    } finally {
      setSyncing(false);
    }
  };

  const percentualProgresso = progress.total > 0 
    ? Math.round(((progress.duplicados + progress.processado) / progress.total) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Painel de Controle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Sincronizador de Publicações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filtros de Período */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Inicial (opcional)
              </label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                disabled={syncing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Se vazio: últimos 365 dias</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Final
              </label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                disabled={syncing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Botão de Sincronização */}
          <Button 
            onClick={handleSync}
            disabled={syncing}
            className="w-full bg-[#7E57FF] hover:bg-[#6D47E0] text-white font-medium py-2"
          >
            {syncing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sincronizando em andamento...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Iniciar Sincronização
              </>
            )}
          </Button>

          {/* Progresso em Tempo Real */}
          {syncing && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Fase: {progress.fase === 'carregando_metricas' ? '📊 Carregando métricas...' 
                           : progress.fase === 'sincronizando' ? '⚙️ Sincronizando...'
                           : '✅ Finalizando...'}
                  </span>
                </div>
                <Progress value={percentualProgresso} className="h-2" />
                <div className="text-xs text-blue-700 mt-2">
                  {progress.total > 0 && (
                    <>Processado: {progress.duplicados + progress.processado} de {progress.total} ({percentualProgresso}%)</>
                  )}
                </div>
              </div>

              {/* Estatísticas ao Vivo */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-2xl font-bold text-green-700">{progress.novas}</div>
                  <div className="text-xs text-green-600">Novas importadas</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="text-2xl font-bold text-orange-700">{progress.duplicados}</div>
                  <div className="text-xs text-orange-600">Duplicatas ignoradas</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="text-2xl font-bold text-red-700">{progress.erros}</div>
                  <div className="text-xs text-red-600">Erros encontrados</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-2xl font-bold text-purple-700">{Math.max(0, progress.total - (progress.duplicados + progress.novas))}</div>
                  <div className="text-xs text-purple-600">Ainda faltam</div>
                </div>
              </div>
            </div>
          )}

          {/* Resultado Final */}
          {resultado && !syncing && (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 ml-2">
                  ✅ Sincronização concluída com sucesso
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Publicações Novas</p>
                    <p className="text-2xl font-bold text-green-600">{resultado.novas}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duplicatas Evitadas</p>
                    <p className="text-2xl font-bold text-orange-600">{resultado.duplicadas}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Erros Encontrados</p>
                    <p className="text-2xl font-bold text-red-600">{resultado.erros}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ainda Faltam</p>
                    <p className="text-2xl font-bold text-purple-600">{resultado.faltamImportar}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3 space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Tempo total:</span>
                    <span className="font-medium">{resultado.tempoSegundos}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Período:</span>
                    <span className="font-medium">{resultado.periodoInicio} a {resultado.periodoFim}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Executado em:</span>
                    <span className="font-medium">{resultado.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Erro */}
          {erro && !syncing && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 ml-2">
                {erro}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
        <div className="text-sm text-blue-900">
          <strong>Ordem de busca:</strong> Das publicações mais recentes para as mais antigas
          <br />
          <strong>Proteção:</strong> Duplicatas são automaticamente ignoradas
          <br />
          <strong>Período padrão:</strong> Últimos 365 dias (se não especificado)
        </div>
      </div>
    </div>
  );
}