import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, FileText, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export default function ProconDocumentUpload({ processo }) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const documentos = processo.documentos || [];

  const updateMutation = useMutation({
    mutationFn: (novosDocumentos) =>
      base44.entities.ProcessoCEJUSC.update(processo.id, { documentos: novosDocumentos }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processos'] });
      toast.success('Documento salvo!');
    },
    onError: (e) => toast.error('Erro: ' + e.message),
  });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const novoDoc = {
        nome: file.name,
        url: file_url,
        data_upload: new Date().toISOString().split('T')[0],
      };
      updateMutation.mutate([...documentos, novoDoc]);
    } catch (err) {
      toast.error('Erro no upload: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removerDocumento = (idx) => {
    if (!confirm('Remover este documento?')) return;
    const novos = documentos.filter((_, i) => i !== idx);
    updateMutation.mutate(novos);
  };

  return (
    <Card className="border-blue-100">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-blue-800 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Documentos do Processo ({documentos.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Upload */}
        <label className={`flex items-center gap-2 border-2 border-dashed border-blue-200 rounded-lg p-3 cursor-pointer hover:bg-blue-50 transition-colors ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          ) : (
            <Upload className="w-4 h-4 text-blue-500" />
          )}
          <span className="text-sm text-blue-700">{uploading ? 'Enviando...' : 'Clique para enviar documento (PDF, imagem)'}</span>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>

        {/* Lista */}
        {documentos.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-2">Nenhum documento anexado</p>
        ) : (
          <div className="space-y-2">
            {documentos.map((doc, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{doc.nome}</p>
                  {doc.data_upload && (
                    <p className="text-xs text-slate-400">{format(new Date(doc.data_upload), 'dd/MM/yyyy')}</p>
                  )}
                </div>
                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </a>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removerDocumento(idx)}
                  className="h-7 w-7 p-0 text-red-400 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}