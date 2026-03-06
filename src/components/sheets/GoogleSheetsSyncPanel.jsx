import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Cloud, Download, AlertCircle, CheckCircle2, ExternalLink, Plus } from 'lucide-react';

export default function GoogleSheetsSyncPanel() {
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [loading, setLoading] = useState(false);
  const [creatingSheet, setCreatingSheet] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lastSync, setLastSync] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
        if (userData.global_google_sheet_id) {
          setSpreadsheetId(userData.global_google_sheet_id);
        }
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
      }
    };
    loadUser();
  }, []);

  const handleSync = async () => {
    if (!spreadsheetId.trim()) {
      setError('Insira o ID da planilha Google');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await base44.functions.invoke('syncProcessToGoogleSheets', {
        spreadsheetId: spreadsheetId.trim()
      });

      setSuccess(`✓ ${response.data.synced_rows} processos sincronizados para Google Sheets`);
      setLastSync(new Date());
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao sincronizar com Google Sheets');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!spreadsheetId.trim()) {
      setError('Insira o ID da planilha Google');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await base44.functions.invoke('restoreProcessFromGoogleSheets', {
        spreadsheetId: spreadsheetId.trim()
      });

      setSuccess(`✓ ${response.data.restored_count} processos restaurados do Google Sheets`);
      setLastSync(new Date());
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao restaurar do Google Sheets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGlobalSheet = async () => {
    setCreatingSheet(true);
    setError('');
    setSuccess('');

    try {
      const response = await base44.functions.invoke('createGlobalGoogleSheet', {});

      setSpreadsheetId(response.data.spreadsheetId);
      setSuccess(`✓ Planilha global criada! Abas: Processos, Prazos, Publicações`);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar planilha global');
    } finally {
      setCreatingSheet(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="w-5 h-5" />
          Sincronização Google Sheets
        </CardTitle>
        <CardDescription>
          Espelhe seus processos no Google Sheets como backup e fallback offline
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">ID da Planilha Google Sheets</label>
          <Input
            placeholder="Ex: 1a2b3c4d5e6f7g8h9i0j"
            value={spreadsheetId}
            onChange={(e) => setSpreadsheetId(e.target.value)}
            disabled={loading}
            className="font-mono text-xs"
          />
          <p className="text-xs text-gray-500">
            Encontre o ID na URL: <code className="bg-gray-100 px-1 rounded">docs.google.com/spreadsheets/d/[ID_AQUI]/</code>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              onClick={handleSync}
              disabled={loading || !spreadsheetId.trim()}
              className="gap-2 flex-1 bg-cyan-600 hover:bg-cyan-700"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Cloud className="w-4 h-4" />
              )}
              Sincronizar para Sheet
            </Button>

            <Button
              onClick={handleRestore}
              disabled={loading || !spreadsheetId.trim()}
              variant="outline"
              className="gap-2 flex-1"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Restaurar de Sheet
            </Button>
          </div>

          {spreadsheetId.trim() && (
            <Button
              onClick={() => {
                window.open(
                  `https://docs.google.com/spreadsheets/d/${spreadsheetId.trim()}/edit`,
                  '_blank'
                );
              }}
              variant="outline"
              className="gap-2 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir no Google Sheets
            </Button>
          )}
        </div>

        {lastSync && (
          <p className="text-xs text-gray-500 text-center">
            Última sincronização: {lastSync.toLocaleString('pt-BR')}
          </p>
        )}

        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm space-y-2 text-blue-900">
          <p className="font-semibold">💡 Como usar:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><strong>Sincronizar:</strong> Salva seus processos no Google Sheets (backup)</li>
            <li><strong>Restaurar:</strong> Carrega dados do Sheet (útil quando servidor está offline)</li>
            <li>A planilha fica em modo "Processos" com CNJ, Título, Status, etc</li>
            <li>O cliente pode editar a planilha e você restaura as alterações</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}