import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react';

export default function AdviseConfigForm({ config, onSave, isLoading }) {
  const [formData, setFormData] = useState(config || {
    adviseApiToken: '',
    adviseApiUrl: 'https://sandbox-api.advise.com.br',
    ambiente: 'sandbox',
    nomeEmpresa: '',
    syncPublicacoes: true,
    syncIntimacoes: false,
    syncProcessos: false,
    frequenciaSync: 'daily'
  });

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showToken, setShowToken] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTestResult(null);
    setError(null);
  };

  const handleToggle = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const testConnection = async () => {
    if (!formData.adviseApiToken.trim()) {
      setError('Token é obrigatório para testar');
      return;
    }

    setTesting(true);
    try {
      const response = await base44.functions.invoke('testAdviseConnection', {
        token: formData.adviseApiToken,
        url: formData.adviseApiUrl
      });

      if (response.data?.success) {
        setTestResult({
          success: true,
          message: response.data.message,
          ambiente: response.data.data.ambiente
        });
        setError(null);
      } else {
        setError(response.data?.message || 'Erro ao testar conexão');
        setTestResult(null);
      }
    } catch (err) {
      setError(err.message);
      setTestResult(null);
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    if (!formData.adviseApiToken.trim()) {
      setError('Token é obrigatório');
      return;
    }

    // Test before saving
    setTesting(true);
    try {
      const response = await base44.functions.invoke('testAdviseConnection', {
        token: formData.adviseApiToken,
        url: formData.adviseApiUrl
      });

      if (response.data?.success) {
        await onSave({
          ...formData,
          statusConexao: 'conectado'
        });
      } else {
        setError('Falha na validação da conexão. Verifique suas credenciais.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Token */}
      <Card className="dark:bg-slate-900 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg dark:text-white">Credenciais Advise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="token-input" className="block text-sm font-medium mb-2 dark:text-gray-200">Token API</label>
            <div className="relative">
              <Input
                id="token-input"
                type={showToken ? "text" : "password"}
                value={formData.adviseApiToken}
                onChange={(e) => handleInputChange('adviseApiToken', e.target.value)}
                placeholder="Cole seu token Bearer aqui"
                className="pr-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                aria-label="Token API Advise"
                aria-describedby="token-help"
                aria-required="true"
                aria-invalid={!formData.adviseApiToken.trim() ? "true" : "false"}
              />
              <button
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label={showToken ? "Ocultar token" : "Mostrar token"}
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p id="token-help" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Obtido no console Advise após criar a aplicação
            </p>
          </div>

          <div>
            <label htmlFor="ambiente-select" className="block text-sm font-medium mb-2 dark:text-gray-200">Ambiente</label>
            <Select value={formData.ambiente} onValueChange={(value) => {
              setFormData(prev => ({
                ...prev,
                ambiente: value,
                adviseApiUrl: value === 'sandbox' 
                  ? 'https://sandbox-api.advise.com.br'
                  : 'https://api.advise.com.br'
              }));
            }}>
              <SelectTrigger 
                id="ambiente-select" 
                className="dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                aria-required="true"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sandbox">Sandbox (Testes)</SelectItem>
                <SelectItem value="production">Production (Real)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="url-api" className="block text-sm font-medium mb-2 dark:text-gray-200">URL API</label>
            <Input
              id="url-api"
              value={formData.adviseApiUrl}
              readOnly
              className="bg-gray-100 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600"
              aria-label="URL da API Advise"
              aria-disabled="true"
            />
          </div>

          <Button
            onClick={testConnection}
            disabled={testing || !formData.adviseApiToken.trim()}
            variant="outline"
            className="w-full"
            aria-busy={testing}
            aria-label={testing ? 'Testando conexão' : 'Testar conexão com API Advise'}
          >
            {testing && <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />}
            {testing ? 'Testando...' : 'Testar Conexão'}
          </Button>

          {testResult?.success && (
           <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-start gap-3" role="status" aria-live="polite" aria-atomic="true">
             <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
             <div className="text-sm text-green-800 dark:text-green-300">
               <p className="font-medium">{testResult.message}</p>
               <p className="text-xs mt-1">Ambiente: {testResult.ambiente}</p>
             </div>
           </div>
          )}

          {error && (
           <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-3" role="alert" aria-live="assertive" aria-atomic="true">
             <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
             <p className="text-sm text-red-800 dark:text-red-300" id="error-message">{error}</p>
           </div>
          )}
        </CardContent>
      </Card>

      {/* Empresa */}
      <Card className="dark:bg-slate-900 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg dark:text-white">Informações da Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <label htmlFor="empresa-input" className="block text-sm font-medium mb-2 dark:text-gray-200">Nome da Empresa</label>
          <Input
            id="empresa-input"
            value={formData.nomeEmpresa}
            onChange={(e) => handleInputChange('nomeEmpresa', e.target.value)}
            placeholder="Ex: Escritório de Advocacia XYZ"
            className="dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            aria-label="Nome da empresa"
            aria-required="false"
          />
        </CardContent>
      </Card>

      {/* Módulos */}
      <Card className="dark:bg-slate-900 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg dark:text-white">Módulos de Sincronização</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={formData.syncPublicacoes}
              onCheckedChange={() => handleToggle('syncPublicacoes')}
            />
            <div className="flex-1">
              <p className="font-medium text-sm dark:text-gray-200">Publicações</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sincronizar publicações do Diário Oficial</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">Ativo</Badge>
          </div>

          <div className="flex items-center gap-3 opacity-50">
            <Checkbox
              checked={formData.syncIntimacoes}
              onCheckedChange={() => handleToggle('syncIntimacoes')}
              disabled
            />
            <div className="flex-1">
              <p className="font-medium text-sm dark:text-gray-200">Intimações</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sincronizar intimações de processos</p>
            </div>
            <Badge variant="outline">Em breve</Badge>
          </div>

          <div className="flex items-center gap-3 opacity-50">
            <Checkbox
              checked={formData.syncProcessos}
              onCheckedChange={() => handleToggle('syncProcessos')}
              disabled
            />
            <div className="flex-1">
              <p className="font-medium text-sm dark:text-gray-200">Processos</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sincronizar dados completos de processos</p>
            </div>
            <Badge variant="outline">Em breve</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Frequência */}
      <Card className="dark:bg-slate-900 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg dark:text-white">Frequência de Sincronização</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={formData.frequenciaSync} onValueChange={(value) => handleInputChange('frequenciaSync', value)}>
            <SelectTrigger className="dark:bg-slate-800 dark:border-slate-600 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">A cada hora</SelectItem>
              <SelectItem value="daily">Diariamente</SelectItem>
              <SelectItem value="weekly">Semanalmente</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Publicações serão sincronizadas na frequência configurada</p>
        </CardContent>
      </Card>

      {/* Botões */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={isLoading || testing || !formData.adviseApiToken.trim()}
          className="flex-1"
          aria-busy={isLoading}
          aria-label={isLoading ? 'Salvando configurações' : 'Ativar integração Advise'}
          aria-disabled={isLoading || testing || !formData.adviseApiToken.trim()}
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />}
          {isLoading ? 'Salvando...' : 'Ativar Integração'}
        </Button>
      </div>
    </div>
  );
}