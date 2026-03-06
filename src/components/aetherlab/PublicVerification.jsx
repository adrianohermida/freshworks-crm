import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertCircle, Download, Share2, Lock, Eye, FileText, Zap, Shield, BarChart3 } from 'lucide-react';

export default function PublicVerification() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  
  const [documentHash, setDocumentHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract hash from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hashParam = urlParams.get('hash') || window.location.pathname.split('/').pop();
    if (hashParam && hashParam !== 'PublicVerification') {
      setDocumentHash(hashParam);
    }
  }, []);

  const { data: verificationData, isLoading, isError, refetch } = useQuery({
    queryKey: ['publicVerification', documentHash],
    queryFn: async () => {
      if (!documentHash || documentHash.length < 10) {
        throw new Error('Hash inválido');
      }
      const response = await base44.functions.invoke('verifyPublicDocument', {
        documentHash
      });
      return response.data;
    },
    enabled: false,
    retry: false
  });

  const handleVerify = (e) => {
    e.preventDefault();
    if (!documentHash || documentHash.length < 10) {
      setError('Hash inválido');
      return;
    }
    setError('');
    setLoading(true);
    refetch().then(() => setLoading(false)).catch((err) => {
      setError('Erro ao verificar documento');
      setLoading(false);
    });
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gradient-to-br from-blue-50 to-indigo-50'} p-6`}>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HERO Header */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl blur-3xl" />
          <div className="relative text-center space-y-3 py-8">
            <div className="flex justify-center gap-2 mb-4">
              <Eye className={`w-10 h-10 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <Shield className={`w-10 h-10 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              <Zap className={`w-10 h-10 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <h1 className="text-5xl font-black">Verificação Pública de Documentos</h1>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Acesso seguro sem login • Blockchain verificável • Cadeia de custódia legal
            </p>
          </div>
        </section>

        {/* Search Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Cole o hash do documento (SHA-256)..."
              value={documentHash}
              onChange={(e) => setDocumentHash(e.target.value)}
              className={`flex-1 px-4 py-3 rounded-lg border transition ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-6"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verificar'}
            </Button>
          </div>
        </form>

        {/* Error State */}
        {error && (
          <Alert className={isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}>
            <AlertCircle className={`w-4 h-4 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
            <AlertDescription className={isDark ? 'text-red-300' : 'text-red-800'}>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Document Details */}
        {verificationData?.success && verificationData?.document && (() => {
          const document = verificationData.document;
          const verificationStatus = verificationData.verification;
          return (
          <div className="space-y-6">
            
            {/* Verification Status Card */}
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'border-green-200 bg-green-50'}>
              <CardHeader className="flex flex-row items-start justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  Documento Verificado
                </CardTitle>
                <Badge className="bg-green-600">Autêntico</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold opacity-70">Nome do Documento</p>
                    <p className="text-lg font-bold">{document.nome}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold opacity-70">Data de Registro</p>
                    <p className="text-lg font-bold">
                      {new Date(document.dataCriacao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold opacity-70">Criador</p>
                    <p className="text-sm truncate">{document.created_by}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold opacity-70">Status Blockchain</p>
                    <Badge className={verificationStatus.isValid ? 'bg-green-600' : 'bg-red-600'}>
                      {verificationStatus.isValid ? 'Válido' : 'Inválido'}
                    </Badge>
                  </div>
                </div>

                {/* Hash Display */}
                <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                  <p className="text-xs font-semibold mb-2 opacity-70">SHA-256 Hash</p>
                  <code className="text-xs break-all font-mono">{verificationStatus.blockchainHash}</code>
                </div>

                {/* Blockchain Metadata */}
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  <div>
                    <p className="text-xs font-semibold opacity-70">Timestamp Blockchain</p>
                    <p className="text-sm">
                      {new Date(verificationStatus.blockchainTimestamp).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold opacity-70">Bloco</p>
                    <p className="text-sm font-mono">{verificationStatus.blockNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold opacity-70">Transação</p>
                    <p className="text-sm font-mono truncate">{verificationStatus.transactionHash}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold opacity-70">Confirmações</p>
                    <p className="text-sm font-bold text-green-600">{verificationStatus.confirmations}+</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Badge */}
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lock className="w-5 h-5" />
                  Conformidade Legal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    { label: 'Lei 14.063/2020', status: true },
                    { label: 'LGPD Compliant', status: true },
                    { label: 'eIDAS Ready', status: true }
                  ].map((badge, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${
                      badge.status 
                        ? (isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-300')
                        : (isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300')
                    }`}>
                      <p className="text-sm font-semibold flex items-center gap-2">
                        {badge.status && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                        {badge.label}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Baixar Certificado
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Compartilhar
              </Button>
            </div>
          </div>
          );
        })()}

        {/* Loading State */}
        {(loading || isLoading) && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Empty State */}
        {!verificationData?.success && !loading && !isLoading && !error && !isError && (
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-12 text-center space-y-4">
              <FileText className={`w-12 h-12 mx-auto opacity-50 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <div>
                <h3 className="font-semibold text-lg mb-2">Nenhum documento carregado</h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Cole um hash SHA-256 acima para verificar um documento
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* VANTAGENS */}
        <section className="grid md:grid-cols-3 gap-4">
          {[
            { icon: '🔗', title: 'Blockchain Ethereum', desc: 'Verificação imutável e pública' },
            { icon: '🚫', title: 'Sem Login', desc: 'Acesso aberto a qualquer pessoa' },
            { icon: '⚖️', title: 'Lei 14.063/2020', desc: 'Válido em tribunais brasileiros' }
          ].map((item, i) => (
            <Card key={i} className={`${isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'} text-center`}>
              <CardContent className="pt-6">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Info Footer */}
        <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400'}`}>
          <CardContent className="pt-6 space-y-3">
            <p className="font-bold text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Diferencial Exclusivo DocuChain
            </p>
            <p className={isDark ? 'text-gray-300' : 'text-gray-800'}>
              <strong>Única plataforma onde qualquer pessoa (sem login) pode verificar a autenticidade de documentos.</strong> Blockchain Ethereum público + Lei 14.063/2020 + Cadeia de custódia legal rastreável. Seus concorrentes (Docusign, AdobeSign, PandaDoc) não têm isso.
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}