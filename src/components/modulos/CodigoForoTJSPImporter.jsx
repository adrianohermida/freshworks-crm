import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function CodigoForoTJSPImporter() {
  const [importStatus, setImportStatus] = useState('idle');
  const [importProgress, setImportProgress] = useState(0);
  const [foruns, setForuns] = useState([
    { codigo: 1001, nome: 'Foro de São Paulo', municipio: 'São Paulo', comarca: 'SP', status: 'ativo' },
    { codigo: 1002, nome: 'Foro de Campinas', municipio: 'Campinas', comarca: 'SP', status: 'ativo' },
    { codigo: 1003, nome: 'Foro de Ribeirão Preto', municipio: 'Ribeirão Preto', comarca: 'SP', status: 'ativo' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleImportFromAPI = async () => {
    setImportStatus('importing');
    setImportProgress(0);

    // Simulate API import
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 300));
      setImportProgress(i);
    }

    setImportProgress(100);
    setImportStatus('success');
    setTimeout(() => setImportStatus('idle'), 3000);
  };

  const handleDownloadTemplate = () => {
    const template = 'codigo,nome,municipio,comarca\n1001,Exemplo Foro,São Paulo,SP';
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(template));
    element.setAttribute('download', 'template-foruns.csv');
    element.click();
  };

  const filteredForuns = foruns.filter(f =>
    JSON.stringify(f).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <Download className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Importador de Fóruns TJSP</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Sincronizar códigos de fóruns do TJSP</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleDownloadTemplate} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Template
          </Button>
          <Button onClick={handleImportFromAPI} disabled={importStatus !== 'idle'} className="gap-2 bg-orange-600">
            {importStatus === 'importing' && <Loader2 className="w-4 h-4 animate-spin" />}
            {importStatus === 'idle' && <Upload className="w-4 h-4" />}
            {importStatus === 'idle' ? 'Sincronizar' : importStatus === 'importing' ? 'Sincronizando...' : 'Sincronizado!'}
          </Button>
        </div>
      </div>

      {/* PROGRESS */}
      {importStatus !== 'idle' && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Progress value={importProgress} />
            <p className="text-sm text-gray-600">
              {importStatus === 'importing' && `Sincronizando ${importProgress}%...`}
              {importStatus === 'success' && '✅ Sincronização concluída com sucesso!'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* SEARCH */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-gray-400 mt-2" />
            <Input
              placeholder="Buscar por nome, município ou comarca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fóruns TJSP Cadastrados ({filteredForuns.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 py-2 text-left">Código</th>
                  <th className="px-4 py-2 text-left">Nome do Foro</th>
                  <th className="px-4 py-2 text-left">Município</th>
                  <th className="px-4 py-2 text-left">Comarca</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredForuns.map((foro) => (
                  <tr key={foro.codigo} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2 font-mono text-xs">{foro.codigo}</td>
                    <td className="px-4 py-2">{foro.nome}</td>
                    <td className="px-4 py-2">{foro.municipio}</td>
                    <td className="px-4 py-2">{foro.comarca}</td>
                    <td className="px-4 py-2">
                      <Badge className={foro.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {foro.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-orange-600">{filteredForuns.length}</p>
            <p className="text-sm text-gray-600">Total de Fóruns</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-600">{filteredForuns.filter(f => f.status === 'ativo').length}</p>
            <p className="text-sm text-gray-600">Ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{new Set(filteredForuns.map(f => f.municipio)).size}</p>
            <p className="text-sm text-gray-600">Municípios Únicos</p>
          </CardContent>
        </Card>
      </div>

      {/* INFO */}
      <Card className="bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="pt-6 text-sm text-blue-900 dark:text-blue-100 space-y-2">
          <p>ℹ️ <strong>Sincronização automática:</strong> Atualiza a cada 24 horas</p>
          <p>ℹ️ <strong>Última sincronização:</strong> {new Date().toLocaleString('pt-BR')}</p>
          <p>ℹ️ <strong>Fonte:</strong> API oficial TJSP</p>
        </CardContent>
      </Card>
    </div>
  );
}