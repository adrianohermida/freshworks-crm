import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, XCircle, Clock, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ValidacaoDocumentoAdmin() {
  const queryClient = useQueryClient();
  const [escritorio_id, setEscritorio_id] = useState(null);

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
    onSuccess: (data) => {
      if (data?.[0]) setEscritorio_id(data[0].id);
    }
  });

  const { data: validacoes, isLoading } = useQuery({
    queryKey: ['validacoes-documentos', escritorio_id],
    queryFn: () => base44.entities.ValidacaoDocumento.filter({ escritorio_id }),
    enabled: !!escritorio_id
  });

  const approveMutation = useMutation({
    mutationFn: async (doc) => {
      const updated = await base44.entities.ValidacaoDocumento.update(doc.id, {
        status: 'aprovado',
        validado_por: 'admin',
        data_validacao: new Date().toISOString()
      });

      // Disparar e-mail
      await base44.functions.invoke('notificarStatusDocumento', {
        cliente_email: doc.cliente_email,
        cliente_nome: doc.cliente_nome,
        status: 'aprovado',
        tipo_documento: doc.tipo
      }).catch(err => console.error('Erro ao notificar:', err));

      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['validacoes-documentos']);
      toast.success('Documento aprovado e cliente notificado');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ doc, motivo }) => {
      const updated = await base44.entities.ValidacaoDocumento.update(doc.id, {
        status: 'rejeitado',
        motivo_rejeicao: motivo,
        validado_por: 'admin',
        data_validacao: new Date().toISOString()
      });

      // Disparar e-mail
      await base44.functions.invoke('notificarStatusDocumento', {
        cliente_email: doc.cliente_email,
        cliente_nome: doc.cliente_nome,
        status: 'rejeitado',
        motivo_rejeicao: motivo,
        tipo_documento: doc.tipo
      }).catch(err => console.error('Erro ao notificar:', err));

      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['validacoes-documentos']);
      toast.success('Documento rejeitado e cliente notificado');
    }
  });

  const pendentes = validacoes?.filter(v => v.status === 'pendente') || [];
  const aprovados = validacoes?.filter(v => v.status === 'aprovado') || [];
  const rejeitados = validacoes?.filter(v => v.status === 'rejeitado') || [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Validação de Documentos</h1>

      <Tabs defaultValue="pendentes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pendentes">
            Pendentes ({pendentes.length})
          </TabsTrigger>
          <TabsTrigger value="aprovados">
            Aprovados ({aprovados.length})
          </TabsTrigger>
          <TabsTrigger value="rejeitados">
            Rejeitados ({rejeitados.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pendentes" className="space-y-4">
          {isLoading && <p>Carregando...</p>}
          {pendentes.length === 0 && <p>Nenhum documento pendente</p>}
          {pendentes.map((validacao) => (
            <DocumentCard
              key={validacao.id}
              doc={validacao}
              onApprove={() => approveMutation.mutate(validacao)}
              onReject={() => {
                const motivo = prompt('Motivo da rejeição:');
                if (motivo) rejectMutation.mutate({ doc: validacao, motivo });
              }}
              status="pendente"
            />
          ))}
        </TabsContent>

        <TabsContent value="aprovados" className="space-y-4">
          {aprovados.map((validacao) => (
            <DocumentCard key={validacao.id} doc={validacao} status="aprovado" />
          ))}
        </TabsContent>

        <TabsContent value="rejeitados" className="space-y-4">
          {rejeitados.map((validacao) => (
            <DocumentCard key={validacao.id} doc={validacao} status="rejeitado" />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DocumentCard({ doc, onApprove, onReject, status }) {
  const statusConfig = {
    pendente: { icon: Clock, color: 'yellow', label: 'Pendente' },
    aprovado: { icon: CheckCircle2, color: 'green', label: 'Aprovado' },
    rejeitado: { icon: XCircle, color: 'red', label: 'Rejeitado' }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg">{doc.cliente_nome}</CardTitle>
          <p className="text-sm text-gray-600">{doc.cliente_email}</p>
        </div>
        <Badge variant={config.color}>
          <Icon className="w-3 h-3 mr-1" />
          {config.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Tipo de Documento</p>
            <p className="text-gray-700">{doc.tipo}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Data de Upload</p>
            <p className="text-gray-700">{new Date(doc.created_date).toLocaleDateString()}</p>
          </div>
        </div>

        {doc.documento_url && (
          <a
            href={doc.documento_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <Eye className="w-4 h-4" />
            Ver documento
          </a>
        )}

        {doc.motivo_rejeicao && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            <p className="font-medium">Motivo da rejeição:</p>
            <p>{doc.motivo_rejeicao}</p>
          </div>
        )}

        {status === 'pendente' && (
          <div className="flex gap-2">
            <Button
              onClick={onApprove}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Aprovar
            </Button>
            <Button
              onClick={onReject}
              variant="outline"
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Rejeitar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}