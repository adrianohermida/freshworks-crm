import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle2, AlertCircle, Clock, Download, Copy, History } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import AuditTrail from '@/components/AuditTrail';
import CertificadoDownloadButton from '@/components/CertificadoDownloadButton';
import { useTenant } from '@/components/TenantContext';
import { checkPermission, auditPermissionCheck } from '@/components/RoleBasedAccess';

export default function MeusDocumentos() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [copiadoId, setCopiadoId] = useState(null);
  const [documentoSelecionado, setDocumentoSelecionado] = useState(null);
  const [permissionError, setPermissionError] = useState(null);
  const { tenantId } = useTenant();

  useEffect(() => {
    const validateAccess = async () => {
      const hasAccess = await checkPermission('read', 'documents');
      if (!hasAccess) {
        setPermissionError('Você não tem permissão para visualizar documentos');
        await auditPermissionCheck('read', 'documents', { success: false });
      }
    };
    validateAccess();
  }, []);

  const { data: documentos, isLoading } = useQuery({
    queryKey: ['meusdocumentos', tenantId],
    queryFn: () => base44.entities.RegistroBlockchain.filter({ tenantId }, '-created_date', 50),
    initialData: []
  });

  const getStatusInfo = (status) => {
    const configs = {
      validado: {
        label: 'Válido',
        icon: CheckCircle2,
        color: 'bg-green-100 text-green-800',
        bgColor: 'bg-green-50'
      },
      pendente: {
        label: 'Pendente',
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-800',
        bgColor: 'bg-yellow-50'
      },
      expirado: {
        label: 'Expirado',
        icon: AlertCircle,
        color: 'bg-red-100 text-red-800',
        bgColor: 'bg-red-50'
      },
      revogado: {
        label: 'Revogado',
        icon: AlertCircle,
        color: 'bg-gray-100 text-gray-800',
        bgColor: 'bg-gray-50'
      }
    };

    return configs[status] || configs.pendente;
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  const diasParaExpirar = (dataVencimento) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const dias = Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24));
    return dias;
  };

  // Se houver erro de permissão
  if (permissionError) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} py-12 px-4 sm:px-6 flex items-center justify-center`}>
        <Card className="border-2 border-red-200 bg-red-50 max-w-md">
          <CardContent className="pt-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800">Acesso Negado</p>
              <p className="text-red-700 text-sm">{permissionError}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se um documento foi selecionado para ver audit trail
  if (documentoSelecionado) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} py-12 px-4 sm:px-6`}>
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => setDocumentoSelecionado(null)}
            className="mb-6"
          >
            ← Voltar para Documentos
          </Button>

          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Histórico de Auditoria
              </CardTitle>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                {documentoSelecionado.metadadosDocumento?.titulo || 'Documento Assinado'}
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <AuditTrail documentoId={documentoSelecionado.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} py-12 px-4 sm:px-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
            <FileText className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            Meus Documentos
          </h1>
          <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Visualize todos os seus documentos assinados e registrados no blockchain
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                Total de Documentos
              </p>
              <p className="text-2xl sm:text-3xl font-bold">{documentos.length}</p>
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                Válidos
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                {documentos.filter(d => d.statusValidacao === 'validado').length}
              </p>
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                Próximos a Expirar
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
                {documentos.filter(d => {
                  const dias = diasParaExpirar(d.dataVencimento);
                  return dias > 0 && dias <= 7;
                }).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Documentos */}
        {isLoading ? (
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="py-12 text-center">
              <div className={`inline-block animate-spin rounded-full h-8 w-8 border-b-2 ${
                isDark ? 'border-blue-400' : 'border-blue-600'
              }`}></div>
              <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Carregando documentos...
              </p>
            </CardContent>
          </Card>
        ) : documentos.length === 0 ? (
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="py-12 text-center">
              <FileText className={`w-12 h-12 mx-auto mb-4 ${
                isDark ? 'text-gray-600' : 'text-gray-300'
              }`} />
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Você ainda não tem documentos assinados
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {documentos.map((doc) => {
              const statusInfo = getStatusInfo(doc.statusValidacao);
              const StatusIcon = statusInfo.icon;
              const dias = diasParaExpirar(doc.dataVencimento);
              
              return (
                <Card
                  key={doc.id}
                  className={`${statusInfo.bgColor} ${isDark ? 'bg-gray-800 border-gray-700' : ''} overflow-hidden hover:shadow-md transition`}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Status Badge */}
                        <div className="mb-3">
                          <Badge className={statusInfo.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </div>

                        {/* Document Title */}
                        <h3 className="font-semibold mb-2 truncate">
                          {doc.metadadosDocumento?.titulo || 'Documento Assinado'}
                        </h3>

                        {/* Hash */}
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3 break-all`}>
                          <p className="mb-1">Hash: <span className="font-mono">{doc.documentoHash.slice(0, 20)}...</span></p>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                          <div>
                            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Registrado</p>
                            <p className="font-medium">
                              {format(new Date(doc.created_date), 'dd MMM yyyy', { locale: pt })}
                            </p>
                          </div>
                          <div>
                            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Vencimento</p>
                            <p className={`font-medium ${dias <= 7 ? 'text-yellow-600' : ''}`}>
                              {format(new Date(doc.dataVencimento), 'dd MMM yyyy', { locale: pt })}
                              {dias > 0 && dias <= 7 && ` (${dias}d)`}
                            </p>
                          </div>
                        </div>

                        {/* Blockchain Link */}
                        <a
                          href={`https://mumbai.polygonscan.com/tx/${doc.hashBlockchain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Ver no Blockchain →
                        </a>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 sm:justify-start">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(doc.documentoHash, doc.id)}
                          className="w-full sm:w-auto"
                        >
                          {copiadoId === doc.id ? (
                            'Copiado!'
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-1" />
                              Copiar Hash
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDocumentoSelecionado(doc)}
                          className="w-full sm:w-auto"
                        >
                          <History className="w-4 h-4 mr-1" />
                          Auditoria
                        </Button>
                        <CertificadoDownloadButton doc={doc} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}