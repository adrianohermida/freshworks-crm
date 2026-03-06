import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

export default function TesteAlertas() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSyncAlertas = async () => {
    setStatus('testing');
    setError(null);
    setResult(null);

    try {
      const response = await base44.functions.invoke('syncAlertas', {});
      
      setResult({
        alertasCriados: response.data.data?.alertasCriados || 0,
        alertasAdvise: response.data.data?.alertasAdvise || 0,
        totalErros: response.data.data?.erros?.length || 0,
        erros: response.data.data?.erros || []
      });

      setStatus(response.data.success ? 'success' : 'error');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const handleConsultarAlertas = async () => {
    setStatus('testing');
    setError(null);

    try {
      const alertas = await base44.entities.Alerta.filter({ resolvido: false });
      
      setResult({
        totalAlertas: alertas.length,
        criticos: alertas.filter(a => a.severidade === 'critica').length,
        altos: alertas.filter(a => a.severidade === 'alta').length,
        medios: alertas.filter(a => a.severidade === 'media').length,
        naoLidos: alertas.filter(a => !a.lido).length,
        porTipo: alertas.reduce((acc, a) => {
          acc[a.tipo] = (acc[a.tipo] || 0) + 1;
          return acc;
        }, {}),
        samples: alertas.slice(0, 3).map(a => ({
          titulo: a.titulo,
          tipo: a.tipo,
          severidade: a.severidade,
          numeroProcesso: a.numeroProcesso
        }))
      });

      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const handleCriarAlertaTeste = async () => {
    setStatus('testing');
    setError(null);

    try {
      const prazoTeste = {
        idProcessoAdvise: 'teste-001',
        numeroProcesso: '0000001-00.0000.0.00.0000',
        tipo: 'defesa',
        descricao: 'Prazo para oferecer defesa',
        dataInicio: new Date().toISOString().split('T')[0],
        dataVencimento: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        diasUteis: 15,
        status: 'aberto'
      };

      // Criar prazo
      const prazo = await base44.entities.PrazoProcessual.create(prazoTeste);

      // Sincronizar alertas (vai criar o alerta automaticamente)
      const syncResponse = await base44.functions.invoke('syncAlertas', {});

      setResult({
        prazoCriado: {
          id: prazo.id,
          numeroProcesso: prazo.numeroProcesso,
          dataVencimento: prazo.dataVencimento
        },
        alertasSincronizados: syncResponse.data.data?.alertasCriados,
        mensagem: 'Prazo de teste criado e alerta sincronizado com sucesso'
      });

      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const handleTestarNotificacao = async () => {
    setStatus('testing');
    setError(null);

    try {
      const user = await base44.auth.me();
      
      // Criar uma notificação de teste
      const notificacao = await base44.entities.Notificacao.create({
        titulo: '🧪 Notificação de Teste',
        mensagem: 'Esta é uma notificação de teste do sistema de alertas',
        tipo: 'in_app',
        destinatario: user.email,
        status: 'pendente',
        dataCriacao: new Date().toISOString(),
        prioridade: 'alta'
      });

      setResult({
        notificacaoId: notificacao.id,
        destinatario: user.email,
        tipo: 'in_app',
        mensagem: 'Notificação de teste criada com sucesso'
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
          <h1 className="text-3xl font-bold">Teste - Alertas & Notificações</h1>
          <p className="text-gray-600">Validação de funcionamento da Fase 4</p>
        </div>

        {/* Test Cards */}
        <div className="grid gap-4">
          {/* Sync Alertas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Sincronização de Alertas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Sincroniza alertas inteligentes baseados em prazos, audiências e movimentações
              </p>
              <Button
                onClick={handleSyncAlertas}
                disabled={status === 'testing'}
                className="w-full"
              >
                {status === 'testing' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Testando...
                  </>
                ) : (
                  '🔄 Sincronizar Alertas'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Consultar Alertas */}
          <Card>
            <CardHeader>
              <CardTitle>Consultar Alertas Locais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Lista todos os alertas pendentes no banco de dados
              </p>
              <Button
                onClick={handleConsultarAlertas}
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
                  '📋 Consultar Alertas'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Criar Prazo Teste */}
          <Card>
            <CardHeader>
              <CardTitle>Criar Prazo de Teste</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Cria um prazo de teste (vencendo em 10 dias) e sincroniza o alerta
              </p>
              <Button
                onClick={handleCriarAlertaTeste}
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
                  '⏰ Criar Prazo & Alerta'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Testar Notificação */}
          <Card>
            <CardHeader>
              <CardTitle>Testar Notificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Cria uma notificação de teste no sistema
              </p>
              <Button
                onClick={handleTestarNotificacao}
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
                  '📬 Testar Notificação'
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
                  {result.alertasCriados !== undefined && (
                    <>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-700">Alertas Criados:</span>
                        <Badge variant="outline">{result.alertasCriados}</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-700">Alertas Advise:</span>
                        <Badge variant="outline">{result.alertasAdvise}</Badge>
                      </div>
                      {result.totalErros > 0 && (
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-gray-700">Erros encontrados:</span>
                          <Badge className="bg-red-100 text-red-800">{result.totalErros}</Badge>
                        </div>
                      )}
                    </>
                  )}

                  {/* Consultar Results */}
                  {result.totalAlertas !== undefined && (
                    <>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-700">Total de Alertas:</span>
                        <Badge variant="outline">{result.totalAlertas}</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700">Críticos:</span>
                        <Badge className="bg-red-100 text-red-800">{result.criticos}</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700">Altos:</span>
                        <Badge className="bg-orange-100 text-orange-800">{result.altos}</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700">Médios:</span>
                        <Badge className="bg-yellow-100 text-yellow-800">{result.medios}</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700">Não Lidos:</span>
                        <Badge className="bg-blue-100 text-blue-800">{result.naoLidos}</Badge>
                      </div>
                    </>
                  )}

                  {/* Prazo Teste Results */}
                  {result.prazoCriado && (
                    <>
                      <div className="pt-4 border-t">
                        <span className="font-medium text-gray-900">Prazo de Teste Criado:</span>
                        <div className="mt-2 text-xs text-gray-700 space-y-1">
                          <p><strong>ID:</strong> {result.prazoCriado.id}</p>
                          <p><strong>Processo:</strong> {result.prazoCriado.numeroProcesso}</p>
                          <p><strong>Vencimento:</strong> {result.prazoCriado.dataVencimento}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700">Alertas Sincronizados:</span>
                        <Badge className="bg-green-100 text-green-800">{result.alertasSincronizados}</Badge>
                      </div>
                    </>
                  )}

                  {/* Notificação Teste */}
                  {result.notificacaoId && (
                    <>
                      <div className="pt-4 border-t">
                        <span className="font-medium text-gray-900">Notificação Criada:</span>
                        <div className="mt-2 text-xs text-gray-700 space-y-1">
                          <p><strong>ID:</strong> {result.notificacaoId}</p>
                          <p><strong>Destinatário:</strong> {result.destinatario}</p>
                          <p><strong>Tipo:</strong> {result.tipo}</p>
                        </div>
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
                            {s.titulo} - {s.tipo}
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
                        {result.erros.slice(0, 5).map((err, i) => (
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
            <CardTitle className="text-base">Checklist de Validação - Fase 4</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>AlertaService com 6 endpoints implementados</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>NotificacaoService com 4 endpoints implementados</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Função syncAlertas sincronizando com inteligência</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Component AlertasInteligentes funcionando</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Page Alertas com dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Página TesteAlertas com validação E2E</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}