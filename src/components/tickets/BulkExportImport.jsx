import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, Trash2, FileText, Loader2 } from 'lucide-react';

export default function BulkExportImport() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [exportFormat, setExportFormat] = useState('csv');
  const [importFormat, setImportFormat] = useState('csv');
  const [selectedFile, setSelectedFile] = useState(null);

  const { data: exports = [], isLoading } = useQuery({
    queryKey: ['dataExports'],
    queryFn: () => base44.entities.DataExport.list(),
    initialData: []
  });

  const exportMutation = useMutation({
    mutationFn: async (format) => {
      const response = await base44.functions.invoke('exportTickets', {
        format,
        filters: {}
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Export iniciado! O arquivo será baixado em breve...');
      queryClient.invalidateQueries({ queryKey: ['dataExports'] });
    },
    onError: (error) => {
      toast.error('Erro ao exportar: ' + error.message);
    }
  });

  const importMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', importFormat);

      const response = await base44.functions.invoke('importTickets', {
        file,
        format: importFormat
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(
        `✓ ${data.imported} importados | ✗ ${data.failed} falharam`
      );
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error) => {
      toast.error('Erro ao importar: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.DataExport.delete(id),
    onSuccess: () => {
      toast.success('Histórico removido');
      queryClient.invalidateQueries({ queryKey: ['dataExports'] });
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    }
  });

  const handleExport = () => {
    exportMutation.mutate(exportFormat);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = () => {
    if (!selectedFile) {
      toast.error('Selecione um arquivo');
      return;
    }
    importMutation.mutate(selectedFile);
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar Tickets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Formato</label>
            <div className="flex gap-2">
              {['csv', 'json', 'pdf'].map((fmt) => (
                <Button
                  key={fmt}
                  variant={exportFormat === fmt ? 'default' : 'outline'}
                  onClick={() => setExportFormat(fmt)}
                  className="uppercase text-xs"
                >
                  {fmt}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              💾 Exporta todos os tickets em {exportFormat.toUpperCase()} com opção de filtros avançados
            </p>
          </div>

          <Button
            onClick={handleExport}
            disabled={exportMutation.isPending}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {exportMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Exportar Agora
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Importar Tickets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Formato</label>
            <div className="flex gap-2">
              {['csv', 'json'].map((fmt) => (
                <Button
                  key={fmt}
                  variant={importFormat === fmt ? 'default' : 'outline'}
                  onClick={() => setImportFormat(fmt)}
                  className="uppercase text-xs"
                >
                  {fmt}
                </Button>
              ))}
            </div>
          </div>

          <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
               onClick={() => fileInputRef.current?.click()}>
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium">Clique para selecionar arquivo</p>
            <p className="text-xs text-gray-500">ou arraste e solte</p>
            <input
              ref={fileInputRef}
              type="file"
              accept={importFormat === 'csv' ? '.csv' : '.json'}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {selectedFile && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                📁 Arquivo: <span className="font-semibold">{selectedFile.name}</span>
              </p>
            </div>
          )}

          <Button
            onClick={handleImport}
            disabled={importMutation.isPending || !selectedFile}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {importMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Importar Agora
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Histórico de Exports ({exports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {exports.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum export realizado</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {exports.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{exp.name}</p>
                    <p className="text-xs text-gray-500">
                      {exp.record_count} registros • {new Date(exp.exported_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{exp.format.toUpperCase()}</Badge>
                    {exp.status === 'completed' && (
                      <Badge className="bg-green-100 text-green-800">✓</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(exp.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}