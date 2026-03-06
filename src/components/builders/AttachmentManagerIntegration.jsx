import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, Download, Eye } from 'lucide-react';

export default function AttachmentManagerIntegration() {
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    setUploading(true);
    try {
      for (const file of files) {
        setAttachments(prev => [...prev, {
          id: Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAttachment = (id) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🔊';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('sheet') || type.includes('excel')) return '📊';
    return '📎';
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Attachment Manager</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Adicionar Anexos</label>
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50 hover:bg-blue-100 transition">
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium text-gray-700">Clique ou arraste arquivos</p>
                <p className="text-xs text-gray-500">Máx 25 MB por arquivo</p>
              </label>
            </div>
          </div>

          {attachments.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Anexos ({attachments.length})</h3>
              <div className="space-y-2">
                {attachments.map((att) => (
                  <div key={att.id} className="flex items-center justify-between bg-gray-50 p-3 rounded border">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xl">{getFileIcon(att.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{att.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(att.size)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {att.type.startsWith('image/') && (
                        <Button variant="ghost" size="sm" title="Visualizar">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" title="Download">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveAttachment(att.id)}
                        title="Remover"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded text-sm text-blue-900">
            <p className="font-medium mb-1">Tipos de arquivo suportados:</p>
            <p>Imagens, Vídeos, PDFs, Documentos Office, Planilhas e mais</p>
          </div>

          <Button className="w-full" disabled={attachments.length === 0}>
            Confirmar Anexos ({attachments.length})
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}