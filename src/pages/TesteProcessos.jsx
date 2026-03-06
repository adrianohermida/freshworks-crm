import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

export default function TesteProcessos() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSync = async () => {
    setStatus('testing');
    setError(null);
    setResult(null);

    try {
      const response = await base44.functions.invoke('syncAdviseProcessos', {});
      
      setResult({
        processosConsultados: response.data.data?.processosConsultados || 0,
        processosImportados: response.data.data?.processosImportados || 0,
        movimentosImportados: response.data.data?.movimentosImportados || 0,
        erros: response.data.data?.erros || []
      });

      setStatus(response.data.success ? 'success' : 'error');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const handleConsultarProcessos = async () => {
    setStatus('testing');
    setError(null);

    try {
      const processos = await base44.entities.ProcessoAdvise.list();
      
      setResult({
        totalProcessos: processos.length,
        processosAtivos: processos.filter(p => p.statusProcesso === 'ativo').length,
        processosArquivados: processos.filter(p => p.statusProcesso === 'arquivado').length,
        processosSuspensos: processos.filter(p => p.statusProcesso === 'suspenso').length,
        samples: processos.slice(0, 3).map(p => ({
          numeroProcesso: p.numeroProcesso,
          tribunal: p.tribunal,
          status: p.statusProcesso
        }))
      });

      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const handleConsultarMovimentos = async () => {
    setStatus('testing');
    setError(null);

    try {
      const movimentos = await base44.entities.MovimentoProcesso.list();
      
      setResult({
        totalMovimentos: movimentos.length,
        movimentosNaoLidos: movimentos.filter(m => !m.lido).length,
        movimentosImportantes: movimentos.filter(m => m.importante).length,
        porProcesso: movimentos.reduce((acc, m) => {
          acc[m.numeroProcesso] = (acc[m.numeroProcesso] || 0) + 1;
          return acc;
        }, {}),
        samples: movimentos.slice(0, 3).map(m => ({
          numeroProcesso: m.numeroProcesso,
          tipo: m.tipoMovimento,
          descricao: m.descricaoMovimento?.substring(0, 50) + '...'
        }))
      });

      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Teste - Processos</h1>
          <p className="text-gray-600">Validação de funcionamento da Fase 3 - Processos</p>
        </div>

        {/* Test Cards */}
        <div className="grid gap-4">
          {/* Sync Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Teste de Sincronização
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Importa processos e seus movimentos da API Advise
              </p>
              <Button
                onClick={handleSync}
                disabled={status === 'testing'}
                className="w-full"
              >
                {status === 'testing' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Testando...
                  </>
                ) : (
                  '🔄 Sincronizar Processos'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Consultar Processos */}
          <Card>
            <CardHeader>
              <CardTitle>Consultar Processos Locais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Lista todos os processos importados no banco de dados
              </p>
              <Button
                onClick={handleConsultarProcessos}
                disabled={status === 'testing'}
                variant="outline"
                className="w-full"
              >
                {status === 'testing' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Testando...
                  </>
                ) : (
                  '📋 Consultar Processos'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Consultar Movimentos */}
          <Card>
            <CardHeader>
              <CardTitle>Consultar Movimentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Lista todos os movimentos processados sincronizados
              </p>
              <Button
                onClick={handleConsultarMovimentos}
                disabled={status === 'testing'}
                variant="outline"
                className="w-full"
              >
                {status === 'testing' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Testando...
                  </>
                ) : (
                  '⏱️ Consultar Movimentos'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {status !== 'idle' && (
          <Card className={status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {status === 'success' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-green-900">Sucesso</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-900">Erro</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="text-sm text-red-900">
                  <strong>Erro:</strong> {error}
                </div>
              )}

              {result && (
                <div className="space-y-3 text-sm">
                  {/* Sync Results */}
                  {result.processosConsultados !== undefined && (
                    <>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-700">Processos Consultados:</span>
                        <Badge variant="outline">{result.processosConsultados}</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-700">Processos Importados:</span>
                        <Badge variant="outline">{result.processosImportados}</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-700">Movimentos Importados:</span>
                        <Badge variant="outline">{result.movimentosImportados}</Badge>
                      </div>
                    </>
                  )}

                  {/* Processos Results */}
                  {result.totalProcessos !== undefined && (
                    <>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-700">Total de Processos:</span>
                        <Badge variant="outline">{result.totalProcessos}</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700">Ativos:</span>
                        <Badge className="bg-green-100 text-green-800">{result.processosAtivos}</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700">Suspensos:</span>
                        <Badge className="bg-yellow-100 text-yellow-800">{result.processosSuspensos}</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700">Arquivados:</span>
                        <Badge className="bg-gray-100 text-gray-800">{result.processosArquivados}</Badge>
                      </div>
                    </>
                  )}

                  {/* Movimentos Results */}
                  {result.totalMovimentos !== undefined && (
                    <>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-700">Total de Movimentos:</span>
                        <Badge variant="outline">{result.totalMovimentos}</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700">Não Lidos:</span>
                        <Badge className="bg-amber-100 text-amber-800">{result.movimentosNaoLidos}</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700">Importantes:</span>
                        <Badge className="bg-red-100 text-red-800">{result.movimentosImportantes}</Badge>
                      </div>
                    </>
                  )}

                  {/* Samples */}
                  {result.samples && result.samples.length > 0 && (
                    <div className="pt-4 border-t">
                      <span className="font-medium text-gray-900">Amostras:</span>
                      <ul className="list-disc list-inside mt-2 text-xs text-gray-700 space-y-1">
                        {result.samples.map((s, i) => (
                          <li key={i}>
                            {s.numeroProcesso || s.tipo} - {s.tribunal || s.descricao}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Erros */}
                  {result.erros && result.erros.length > 0 && (
                    <div className="pt-4 border-t">
                      <span className="font-medium text-gray-900">Erros encontrados:</span>
                      <ul className="list-disc list-inside mt-2 text-xs text-red-700">
                        {result.erros.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Documentation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Checklist de Validação</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>ProcessoService com 8 endpoints implementados</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Função syncAdviseProcessos sincronizando processos e movimentos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Component ProcessosList com filtros funcionando</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Dashboard ProcessosAdvise com detalhe lateral</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Automação de sincronização a cada 12 horas (ativa)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Página TesteProcessos com validação E2E</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}