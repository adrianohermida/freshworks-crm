import React, { useState, useCallback } from 'react';
import { ConfirmActionDialog } from '@/components/dialogs/ConfirmActionDialog';
import { useToast, ToastContainer } from '@/components/notifications/Toast';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle, Loader2, Download, RefreshCw, Plus } from 'lucide-react';

export default function TesteFreshdesk() {
  const { toasts, addToast, removeToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });

  const handleLoadTest = useCallback(async () => {
    setLoading(true);
    setErro(null);
    
    try {
      const response = await base44.functions.invoke('testLoadFreshdesk', {
        ticketCount: 50,
        testDuration: 30
      });
      
      addToast('Teste de carga concluído com sucesso', 'success');
      setResultado({ type: 'loadtest', data: response.data });
    } catch (err) {
      addToast('Erro ao executar teste de carga', 'error');
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const sincronizar = useCallback(async () => {
    setLoading(true);
    setErro(null);
    setResultado(null);
    setConfirmDialog({ isOpen: false });

    try {
      // Sincronizar tickets
      const ticketsRes = await base44.functions.invoke('freshdesk', {
        action: 'sincronizar'
      });
      setResultado(ticketsRes.data);
    } catch (err) {
      console.error('Erro:', err);
      setErro(err.response?.data?.error || err.message);
      addToast('Erro ao sincronizar', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const criarTicket = useCallback(async () => {
    setLoading(true);
    setErro(null);

    try {
      const novoTicket = await base44.functions.invoke('freshdesk', {
        action: 'criar',
        payload: {
          titulo: 'Teste de Ticket',
          descricao: 'Este é um ticket de teste criado via API',
          email: 'teste@example.com',
          prioridade: 2,
          canal: 'email'
        }
      });
      setResultado({ ...resultado, novoTicket: novoTicket.data });
      addToast('Ticket criado com sucesso', 'success');
    } catch (err) {
      setErro(err.response?.data?.error || err.message);
      addToast('Erro ao criar ticket', 'error');
    } finally {
      setLoading(false);
    }
  }, [resultado, addToast]);

  const exportarJSON = () => {
    const json = JSON.stringify(resultado, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freshdesk-sync-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const contarTickets = () => {
    if (!resultado?.data?.tickets) return 0;
    return resultado.data.tickets.length;
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <ConfirmActionDialog
        isOpen={confirmDialog.isOpen}
        title="Sincronizar com Freshdesk?"
        description="Isso irá buscar todos os tickets atuais do Freshdesk. Este processo pode levar alguns minutos."
        actionLabel="Sincronizar"
        isDangerous={false}
        isLoading={loading}
        onConfirm={() => sincronizar()}
        onCancel={() => setConfirmDialog({ isOpen: false })}
      />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold dark:text-white">Teste Freshdesk</h1>
        <p className="text-gray-600 dark:text-gray-400">Sincronize e gerencie tickets com um clique</p>
      </div>

      {/* Card Principal */}
      <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 dark:border-green-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <RefreshCw className="w-5 h-5" />
            Sincronismo Freshdesk
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Sincronize todos os tickets com a API Freshdesk
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setConfirmDialog({ isOpen: true })}
              disabled={loading}
              size="lg"
              className="flex-1 h-12 bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5 mr-2" aria-hidden="true" />
                  Sincronizar Tickets
                </>
              )}
            </Button>

            <Button
              onClick={criarTicket}
              disabled={loading}
              variant="outline"
              size="lg"
              className="flex-1 h-12 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            >
              <Plus className="w-5 h-5 mr-2" aria-hidden="true" />
              Criar Ticket
            </Button>
            
            <Button
              onClick={handleLoadTest}
              disabled={loading}
              variant="outline"
              size="lg"
              className="flex-1 h-12 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
              aria-label="Executar teste de carga com 50 tickets"
            >
              <Loader2 className="w-5 h-5 mr-2" aria-hidden="true" />
              Teste de Carga
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Erro */}
      {erro && (
        <Alert className="border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800" role="alert" aria-live="assertive">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />
          <AlertDescription className="text-red-800 dark:text-red-300">
            <strong>Erro:</strong> {erro}
          </AlertDescription>
        </Alert>
      )}

      {/* Resultado */}
      {resultado && !erro && (
        <div className="space-y-4">
          <Alert className="border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-800" role="status" aria-live="polite">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />
            <AlertDescription className="text-green-800 dark:text-green-300">
              Operação concluída com sucesso!
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="dark:bg-slate-900 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Tickets Sincronizados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{contarTickets()}</p>
              </CardContent>
            </Card>

            <Card className="dark:bg-slate-900 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">{resultado.data?.message || 'Sucesso'}</p>
              </CardContent>
            </Card>

            <Card className="dark:bg-slate-900 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Timestamp</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {new Date(resultado.timestamp || Date.now()).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Botões */}
          <div className="flex gap-2">
            <Button onClick={sincronizar} disabled={loading} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sincronizar Novamente
            </Button>
            <Button onClick={exportarJSON} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Baixar JSON
            </Button>
          </div>

          {/* Abas */}
          <Tabs defaultValue="tickets" className="w-full">
            <TabsList className="grid w-full grid-cols-2 dark:bg-slate-800">
              <TabsTrigger value="tickets">Tickets ({contarTickets()})</TabsTrigger>
              <TabsTrigger value="raw">Raw JSON</TabsTrigger>
            </TabsList>

            <TabsContent value="tickets" className="space-y-4">
              <Card className="dark:bg-slate-900 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Tickets Sincronizados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <pre className="bg-gray-100 dark:bg-slate-800 dark:text-gray-200 p-4 rounded text-xs overflow-auto max-h-96">
                      {JSON.stringify(resultado.data?.tickets || resultado.data?.metrics || [], null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="raw" className="space-y-4">
              <Card className="dark:bg-slate-900 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Resposta Completa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <pre className="bg-gray-100 dark:bg-slate-800 dark:text-gray-200 p-4 rounded text-xs overflow-auto max-h-96">
                      {JSON.stringify(resultado, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Documentação */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-300">Documentação API Freshdesk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-blue-900 dark:text-blue-300" aria-label="Documentação da API Freshdesk">
          <div>
            <strong>Base URL:</strong>
            <code className="block bg-white dark:bg-slate-900 p-2 rounded mt-1 text-xs">
              https://production.freshdesk.com/api/v2
            </code>
          </div>
          <div>
            <strong>Autenticação:</strong>
            <p className="mt-1">Bearer Token (header: Authorization: Bearer {'{'}API_KEY{'}'}})</p>
          </div>
          <div>
            <strong>Ações Disponíveis:</strong>
            <ul className="list-disc ml-5 mt-1 space-y-1 text-xs">
              <li>criar - Criar novo ticket</li>
              <li>listar - Listar todos os tickets</li>
              <li>obter - Obter ticket específico</li>
              <li>atualizar - Atualizar dados do ticket</li>
              <li>atualizarStatus - Mudar status do ticket</li>
              <li>fechar - Fechar ticket</li>
              <li>deletar - Deletar ticket</li>
              <li>adicionarComentario - Adicionar resposta</li>
              <li>sincronizar - Sincronizar todos os tickets</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}