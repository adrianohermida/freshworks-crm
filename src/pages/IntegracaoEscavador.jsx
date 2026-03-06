import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function IntegracaoEscavador() {
  const [numeroProcesso, setNumeroProcesso] = useState('');
  const [clientePolo, setClientePolo] = useState('');
  const [jsonData, setJsonData] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSync = async () => {
    if (!clientePolo.trim() || !jsonData.trim()) {
      setError('Preencha nome do cliente e dados JSON');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setStatus('loading');

      const escavadorData = JSON.parse(jsonData);
      const response = await base44.functions.invoke('escavadorIntegration', {
        numeroProcesso: numeroProcesso.trim() || escavadorData.numero_processo,
        clientePolo: clientePolo.trim(),
        escavadorData
      });

      setResult(response.data);
      setStatus('success');
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('JSON inválido');
      } else {
        setError(err.response?.data?.error || err.message);
      }
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Integração Escavador</h1>
        <p className="text-gray-600 mt-2">Sincronize processos com Escavador, HubSpot e Slack</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mapear Contatos Escavador</CardTitle>
          <CardDescription>Cole os dados JSON retornados pela API Escavador</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Número do Processo (opcional)</label>
            <Input
              placeholder="Ex: 0000001-00.2024.0.00.0000"
              value={numeroProcesso}
              onChange={(e) => setNumeroProcesso(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nome do Cliente (Polo Ativo) *</label>
            <Input
              placeholder="Ex: ACME LTDA"
              value={clientePolo}
              onChange={(e) => setClientePolo(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Dados JSON Escavador *</label>
            <Textarea
              placeholder='Cole o JSON retornado pela API Escavador aqui...'
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              disabled={loading}
              className="font-mono text-xs min-h-48"
            />
          </div>

          <Button 
            onClick={handleSync} 
            disabled={loading}
            className="w-full"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? 'Processando...' : 'Processar e Mapear'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && status === 'success' && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-start gap-4">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-1" />
            <div>
              <CardTitle className="text-green-900">Sincronização Concluída</CardTitle>
              <CardDescription className="text-green-800">Processo {result.processo} atualizado com sucesso</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded">
                <p className="text-xs text-gray-600">Contatos Encontrados</p>
                <p className="text-2xl font-bold">{result.contatosEncontrados}</p>
              </div>
              <div className="p-3 bg-white rounded">
                <p className="text-xs text-gray-600">Status</p>
                <p className="text-lg font-semibold text-green-700">Sincronizado</p>
              </div>
            </div>

            {result.contatos && result.contatos.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Contatos Mapeados:</h3>
                <div className="space-y-2">
                  {result.contatos.map((contato, i) => (
                    <div key={i} className="p-3 bg-white rounded border border-green-200 text-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{contato.nome}</p>
                          <p className="text-xs text-gray-600">
                            {contato.tipo === 'cliente' ? '👤 Cliente' : '👥 Envolvido'}
                          </p>
                        </div>
                        {contato.oab && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            OAB: {contato.oab}
                          </span>
                        )}
                      </div>
                      {(contato.cpf || contato.cnpj) && (
                        <p className="text-xs text-gray-500 mt-2">
                          {contato.cpf ? `CPF: ${contato.cpf}` : `CNPJ: ${contato.cnpj}`}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}