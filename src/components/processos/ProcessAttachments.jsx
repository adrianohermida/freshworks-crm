import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  File, Download, Loader2, AlertCircle, Lock, FileText, 
  FileImage, FileArchive, Plus
} from 'lucide-react';
import { format } from 'date-fns';

export default function ProcessAttachments({ numeroProcesso, idProcessoAdvise }) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch annexes
  const { data: anexos = [], isLoading } = useQuery({
    queryKey: ['anexos', numeroProcesso],
    queryFn: async () => {
      const response = await base44.functions.invoke('consultarAnexosProcesso', {
        numeroProcesso,
        idProcessoAdvise
      });
      return response.data.anexos || [];
    },
    enabled: !!numeroProcesso,
    refetchInterval: 60000
  });

  // Download mutation
  const downloadMutation = useMutation({
    mutationFn: async (idAnexo) => {
      const response = await base44.functions.invoke('gerarUrlDownloadAnexo', {
        idAnexo,
        numeroProcesso,
        expiresIn: 3600
      });
      return response.data;
    },
    onSuccess: (data) => {
      window.location.href = data.downloadUrl;
    }
  });

  const getFileIcon = (extensao) => {
    const icones = {
      'pdf': FileText,
      'doc': FileText,
      'docx': FileText,
      'xlsx': FileText,
      'xls': FileText,
      'jpg': FileImage,
      'jpeg': FileImage,
      'png': FileImage,
      'zip': FileArchive,
      'rar': FileArchive,
      'gz': FileArchive
    };
    return icones[extensao?.toLowerCase()] || File;
  };

  const getTipoBadge = (tipo) => {
    const cores = {
      'peticao': 'bg-blue-100 text-blue-800',
      'sentenca': 'bg-green-100 text-green-800',
      'mandado': 'bg-purple-100 text-purple-800',
      'intimacao': 'bg-red-100 text-red-800',
      'recurso': 'bg-yellow-100 text-yellow-800',
      'parecer': 'bg-indigo-100 text-indigo-800',
      'contrato': 'bg-cyan-100 text-cyan-800',
      'outro': 'bg-gray-100 text-gray-800'
    };
    return cores[tipo] || 'bg-gray-100 text-gray-800';
  };

  const formatarTamanho = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          <span className="text-gray-500">Carregando anexos...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <File className="w-5 h-5" />
          Anexos ({anexos.length})
        </CardTitle>
        <Button
          size="sm"
          onClick={() => setUploadOpen(!uploadOpen)}
          className="gap-1"
        >
          <Plus className="w-4 h-4" />
          Upload
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Upload Form */}
        {uploadOpen && (
          <UploadForm
            numeroProcesso={numeroProcesso}
            onSuccess={() => {
              setUploadOpen(false);
              queryClient.invalidateQueries({ queryKey: ['anexos', numeroProcesso] });
            }}
          />
        )}

        {/* Lista de Anexos */}
        {anexos.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Nenhum anexo disponível</p>
          </div>
        ) : (
          <div className="space-y-2">
            {anexos.map((anexo) => {
              const FileIcon = getFileIcon(anexo.extensao);
              const isExpired = anexo.urlDownloadExpira && 
                new Date(anexo.urlDownloadExpira) < new Date();

              return (
                <div
                  key={anexo.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {anexo.nomeArquivo}
                        </p>
                        {anexo.privado && (
                          <Lock className="w-3 h-3 text-gray-500 flex-shrink-0" />
                        )}
                        {anexo.assinado && (
                          <Badge variant="outline" className="text-xs">Assinado</Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                        <Badge className={getTipoBadge(anexo.tipo)}>
                          {anexo.tipo}
                        </Badge>
                        <span>{formatarTamanho(anexo.tamanhoBytes)}</span>
                        {anexo.dataDocumento && (
                          <span>
                            {format(new Date(anexo.dataDocumento), 'dd/MM/yyyy')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => downloadMutation.mutate(anexo.idAnexo)}
                    disabled={downloadMutation.isPending || isExpired}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  >
                    {downloadMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Info */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            URLs de download expiram em 24 horas. Assinados digitalmente via Advise.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function UploadForm({ numeroProcesso, onSuccess }) {
  const [formData, setFormData] = useState({
    tipo: 'outro',
    descricao: ''
  });
  const [file, setFile] = useState(null);

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error('Selecione um arquivo');

      // Upload file
      const uploadResponse = await base44.integrations.Core.UploadFile({
        file: file
      });

      // Send to backend
      const response = await base44.functions.invoke('uploadAnexoProcesso', {
        numeroProcesso,
        nomeArquivo: file.name,
        tipo: formData.tipo,
        descricao: formData.descricao,
        fileUrl: uploadResponse.file_url
      });

      return response.data;
    },
    onSuccess: () => {
      onSuccess();
      setFile(null);
    }
  });

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div>
        <label className="text-sm font-medium text-gray-700">Arquivo</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0])}
          className="mt-1 block w-full text-sm"
          accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png,.zip,.rar"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Tipo</label>
        <select
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="peticao">Petição</option>
          <option value="sentenca">Sentença</option>
          <option value="mandado">Mandado</option>
          <option value="intimacao">Intimação</option>
          <option value="recurso">Recurso</option>
          <option value="parecer">Parecer</option>
          <option value="contrato">Contrato</option>
          <option value="outro">Outro</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Descrição (opcional)</label>
        <input
          type="text"
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          placeholder="Ex: Petição inicial..."
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          size="sm"
          onClick={() => uploadMutation.mutate()}
          disabled={!file || uploadMutation.isPending}
          className="flex-1"
        >
          {uploadMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-1" />
              Enviando...
            </>
          ) : (
            'Enviar'
          )}
        </Button>
      </div>
    </div>
  );
}