import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertCircle, FileText, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_CONFIG = {
  pendente: { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Pendente' },
  em_analise: { icon: Loader2, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Em Análise' },
  aprovado: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: 'Aprovado' },
  rejeitado: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Rejeitado' }
};

export default function MeusDocumentos() {
  const queryClient = useQueryClient();
  const [uploadingFile, setUploadingFile] = useState(false);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: cliente } = useQuery({
    queryKey: ['cliente', user?.email],
    queryFn: async () => {
      const clientes = await base44.entities.Cliente.filter({ email: user?.email });
      return clientes?.[0];
    },
    enabled: !!user?.email
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
    enabled: !!user
  });

  const { data: documentos = [] } = useQuery({
    queryKey: ['documentos', cliente?.id],
    queryFn: () => base44.entities.ValidacaoDocumento.filter({
      cliente_email: user?.email,
      escritorio_id: escritorio?.[0]?.id
    }),
    enabled: !!user?.email && !!escritorio?.[0]?.id
  });

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      return base44.entities.ValidacaoDocumento.create({
        documento_id: `doc_${Date.now()}`,
        cliente_email: user.email,
        cliente_nome: cliente.nome_completo,
        tipo: 'outro',
        status: 'pendente',
        arquivo_url: file_url,
        tamanho_bytes: file.size,
        formato: file.name.split('.').pop(),
        escritorio_id: escritorio?.[0]?.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
      toast.success('Documento enviado para validação');
    },
    onError: () => toast.error('Erro ao enviar documento')
  });

  const deleteMutation = useMutation({
    mutationFn: (docId) => base44.entities.ValidacaoDocumento.delete(docId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
      toast.success('Documento removido');
    }
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    uploadMutation.mutate(file);
    setUploadingFile(false);
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="mb-4 text-[var(--text-primary)]">Faça login para acessar seus documentos</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Meus Documentos</h1>
        <label className="cursor-pointer">
          <Button className="bg-[var(--brand-primary)]" disabled={uploadingFile}>
            {uploadingFile ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            {uploadingFile ? 'Enviando...' : 'Enviar Documento'}
          </Button>
          <input type="file" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {documentos.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-[var(--text-secondary)] mb-4">Nenhum documento enviado ainda</p>
            <p className="text-sm text-gray-500">Envie seus documentos para validação</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {documentos.map((doc) => {
            const config = STATUS_CONFIG[doc.status];
            const Icon = config.icon;
            return (
              <Card key={doc.id} className={`border-l-4 ${config.bg}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${config.color}`} />
                    <div>
                      <p className="font-medium capitalize">{doc.tipo}</p>
                      <p className="text-sm text-[var(--text-secondary)]">Status: {config.label}</p>
                      {doc.motivo_rejeicao && <p className="text-xs text-red-600 mt-1">Motivo: {doc.motivo_rejeicao}</p>}
                      <p className="text-xs text-gray-500 mt-1">{new Date(doc.created_date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {doc.arquivo_url && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(doc.arquivo_url, '_blank')}
                        title="Baixar"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate(doc.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}