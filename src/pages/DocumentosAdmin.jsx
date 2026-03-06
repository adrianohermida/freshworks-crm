import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Search, Filter, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import Breadcrumb from '@/components/seo/Breadcrumb';
import DocumentoCard from '@/components/documentos/DocumentoCard';
import ValidacaoDocumentoForm from '@/components/documentos/ValidacaoDocumentoForm';
import DocumentoFormInline from '@/components/documentos/DocumentoFormInline';

export default function DocumentosAdmin() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedDocumento, setSelectedDocumento] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
    enabled: !!user,
  });

  const { data: documentos = [], isLoading } = useQuery({
    queryKey: ['documentos-admin', escritorio?.[0]?.id],
    queryFn: () => base44.entities.Documento.filter(
      { escritorio_id: escritorio[0].id },
      '-created_date',
      100
    ),
    enabled: !!escritorio?.[0]?.id,
  });

  const { data: validacoes = [] } = useQuery({
    queryKey: ['validacoes', escritorio?.[0]?.id],
    queryFn: () => base44.entities.ValidacaoDocumento.filter(
      { escritorio_id: escritorio[0].id },
      '-created_date',
      100
    ),
    enabled: !!escritorio?.[0]?.id,
  });

  const filtrados = documentos.filter(doc => {
    const validacao = validacoes.find(v => v.documento_id === doc.id);
    const docStatus = validacao?.status || 'pendente';
    
    const matchSearch = doc.titulo?.toLowerCase().includes(search.toLowerCase()) ||
                       doc.created_by?.toLowerCase().includes(search.toLowerCase());
    
    const matchStatus = statusFilter === 'todos' || docStatus === statusFilter;
    
    return matchSearch && matchStatus;
  });

  const stats = {
    pendente: validacoes.filter(v => v.status === 'pendente').length,
    em_analise: validacoes.filter(v => v.status === 'em_analise').length,
    aprovado: validacoes.filter(v => v.status === 'aprovado').length,
    rejeitado: validacoes.filter(v => v.status === 'rejeitado').length
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={[{ label: 'Documentos Admin' }]} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Validação de Documentos</h1>
          <p className="text-[var(--text-secondary)]">Revise e valide documentos dos clientes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Pendentes', value: stats.pendente, icon: Clock, color: 'yellow' },
            { label: 'Em Análise', value: stats.em_analise, icon: FileText, color: 'blue' },
            { label: 'Aprovados', value: stats.aprovado, icon: CheckCircle2, color: 'green' },
            { label: 'Rejeitados', value: stats.rejeitado, icon: AlertCircle, color: 'red' }
          ].map((stat) => {
            const Icon = stat.icon;
            const colorClass = {
              yellow: 'bg-yellow-50 border-yellow-200',
              blue: 'bg-blue-50 border-blue-200',
              green: 'bg-green-50 border-green-200',
              red: 'bg-red-50 border-red-200'
            }[stat.color];

            return (
              <Card key={stat.label} className={colorClass}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
                      <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-[var(--text-tertiary)]" />
                <Input
                  placeholder="Buscar cliente ou documento..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_analise">Em Análise</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="rejeitado">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Form Inline */}
        {showForm && (
          <DocumentoFormInline
            escritorioId={escritorio?.[0]?.id}
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['documentos-admin', escritorio?.[0]?.id] });
            }}
          />
        )}

        {/* Documentos */}
        {selectedDocumento ? (
          <div className="space-y-6">
            <Button
              variant="outline"
              onClick={() => setSelectedDocumento(null)}
              className="mb-4"
            >
              ← Voltar
            </Button>
            <ValidacaoDocumentoForm
              documento={selectedDocumento}
              validacao={validacoes.find(v => v.documento_id === selectedDocumento.id)}
              onClose={() => {
                setSelectedDocumento(null);
                queryClient.invalidateQueries({ queryKey: ['documentos-admin', escritorio?.[0]?.id] });
              }}
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ['documentos-admin', escritorio?.[0]?.id] });
                queryClient.invalidateQueries({ queryKey: ['validacoes', escritorio?.[0]?.id] });
                setSelectedDocumento(null);
              }}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">{filtrados.length} documento{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}</p>
              </div>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-[var(--brand-primary)]"
                size="sm"
              >
                + Novo Documento
              </Button>
            </div>
            {isLoading ? (
              <div className="text-center py-8" data-testid="loading-state">Carregando documentos...</div>
            ) : filtrados.length === 0 ? (
              <Card className="bg-[var(--bg-elevated)]">
                <CardContent className="p-12 text-center">
                  <FileText className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
                  <p className="text-[var(--text-secondary)] mb-2">Nenhum documento encontrado</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowForm(true)}
                    className="mt-4"
                  >
                    Criar Documento
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="documentos-grid">
                {filtrados.map((doc) => {
                  const validacao = validacoes.find(v => v.documento_id === doc.id);
                  return (
                    <div 
                      key={doc.id} 
                      onClick={() => setSelectedDocumento(doc)} 
                      className="cursor-pointer"
                      data-testid={`documento-card-${doc.id}`}
                    >
                      <DocumentoCard documento={doc} validacao={validacao} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}