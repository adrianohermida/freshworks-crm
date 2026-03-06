import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, BarChart3, Upload, Download, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { differenceInDays, parseISO } from 'date-fns';
import { AnimatePresence } from 'framer-motion';
import ResumeLoader from '@/components/common/ResumeLoader';
import { useDebounce } from '@/components/hooks/useDebounce';

const PublicacaoCard = React.lazy(() => import('@/components/publicacoes/PublicacaoCard'));
const PublicacaoFilters = React.lazy(() => import('@/components/publicacoes/PublicacaoFilters'));
const PublicacaoDetailPanel = React.lazy(() => import('@/components/publicacoes/PublicacaoDetailPanel'));
const PublicacaoFormDialog = React.lazy(() => import('@/components/publicacoes/PublicacaoFormDialog'));
const PublicacoesMetricsDashboard = React.lazy(() => import('@/components/publicacoes/PublicacoesMetricsDashboard'));
const PublicacaoAdvancedFilters = React.lazy(() => import('@/components/publicacoes/PublicacaoAdvancedFilters'));
const ImportCSVModal = React.lazy(() => import('@/components/publicacoes/ImportCSVModal'));

export default function Publicacoes() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedPublicacao, setSelectedPublicacao] = useState(null);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [isExporting, setIsExporting] = useState(false);
  const [showImportCSV, setShowImportCSV] = useState(false);

  // Fetch user & escritorio
  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
    enabled: !!user,
  });

  // Fetch publicações
  const { data: publicacoes = [], isLoading, refetch } = useQuery({
    queryKey: ['publicacoes', escritorio?.[0]?.id],
    queryFn: () => base44.entities.Publicacao.filter(
      { escritorio_id: escritorio[0].id },
      '-created_date',
      500
    ),
    enabled: !!escritorio?.[0]?.id,
  });

  // Fetch analytics
  const { data: analytics } = useQuery({
    queryKey: ['publicacoes-analytics', escritorio?.[0]?.id],
    queryFn: async () => {
      const pubs = await base44.entities.Publicacao.filter(
        { escritorio_id: escritorio[0].id },
        '-created_date',
        500
      );

      const total = pubs.length;
      const pendentes = pubs.filter(p => p.status === 'pendente').length;
      const lidas = pubs.filter(p => p.status === 'lida').length;
      const processadas = pubs.filter(p => p.status === 'processada').length;
      const comPrazo = pubs.filter(p => p.prazo_gerado_id).length;

      const typeDistribution = Object.entries(
        pubs.reduce((acc, p) => {
          acc[p.tipo || 'outro'] = (acc[p.tipo || 'outro'] || 0) + 1;
          return acc;
        }, {})
      ).map(([tipo, count]) => ({ name: tipo, value: count }));

      return {
        metrics: { total, pendentes, lidas, processadas, comPrazo },
        typeDistribution,
        timeline: [],
      };
    },
    enabled: !!escritorio?.[0]?.id,
  });

  // Filter publicações (com debounce)
  const filtered = publicacoes.filter(pub => {
    const matchSearch = !debouncedSearch ||
      pub.titulo?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      pub.cnj?.includes(debouncedSearch) ||
      pub.contratante?.toLowerCase().includes(debouncedSearch.toLowerCase());
    
    const matchStatus = statusFilter === 'todos' || pub.status === statusFilter;

    let matchAdvanced = true;
    if (advancedFilters.dataInicio) {
      matchAdvanced = matchAdvanced && new Date(pub.data_publicacao) >= new Date(advancedFilters.dataInicio);
    }
    if (advancedFilters.dataFim) {
      matchAdvanced = matchAdvanced && new Date(pub.data_publicacao) <= new Date(advancedFilters.dataFim);
    }
    if (advancedFilters.tipos?.length > 0) {
      matchAdvanced = matchAdvanced && advancedFilters.tipos.includes(pub.tipo);
    }
    if (advancedFilters.status?.length > 0) {
      matchAdvanced = matchAdvanced && advancedFilters.status.includes(pub.status);
    }
    if (advancedFilters.apenasPrazoGerado) {
      matchAdvanced = matchAdvanced && !!pub.prazo_gerado_id;
    }
    if (advancedFilters.apenasVinculado) {
      matchAdvanced = matchAdvanced && !!pub.processo_id;
    }
    if (advancedFilters.apenasCNJ) {
      matchAdvanced = matchAdvanced && !!pub.cnj;
    }

    return matchSearch && matchStatus && matchAdvanced;
  });

  // Recent pending
  const recentPending = publicacoes.filter(p =>
    p.status === 'pendente' &&
    p.data_publicacao &&
    differenceInDays(new Date(), parseISO(p.data_publicacao)) <= 7
  );

  const handleMarkLida = async (pub) => {
    try {
      await base44.entities.Publicacao.update(pub.id, {
        status: 'lida',
      });
      refetch();
      toast.success('Publicação marcada como lida');
    } catch (error) {
      toast.error('Erro ao atualizar publicação');
    }
  };

  const handleArchive = async (pubId) => {
    try {
      await base44.entities.Publicacao.update(pubId, {
        status: 'arquivada',
      });
      refetch();
      toast.success('Publicação arquivada');
    } catch (error) {
      toast.error('Erro ao arquivar publicação');
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const response = await base44.functions.invoke('exportarPublicacoesPDF', {
        escritorio_id: escritorio[0].id,
        filters: advancedFilters
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `publicacoes_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      toast.success('PDF exportado com sucesso');
    } catch (error) {
      toast.error('Erro ao exportar PDF');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) return <ResumeLoader />;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Publicações</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {filtered.length} publicaç{filtered.length !== 1 ? 'ões' : 'ão'} encontrada{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={showMetrics ? 'default' : 'outline'}
              onClick={() => setShowMetrics(!showMetrics)}
              size="sm"
              className={showMetrics ? 'bg-[var(--brand-primary)]' : ''}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleExportPDF}
              disabled={isExporting}
              size="sm"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exportando...' : 'PDF'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowImportCSV(true)}
              size="sm"
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              Importar
            </Button>
            <Button
              onClick={() => setShowFormDialog(true)}
              className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] gap-2"
            >
              <Plus className="w-4 h-4" />
              Nova
            </Button>
          </div>
        </div>

        {/* Alert Pendentes */}
        {recentPending.length > 0 && (
          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-900 dark:text-orange-300">
                {recentPending.length} publicaç{recentPending.length > 1 ? 'ões pendentes' : 'ão pendente'} dos últimos 7 dias
              </span>
            </div>
            <p className="text-xs text-orange-700 dark:text-orange-400 ml-6">
              Revise para evitar perda de prazos
            </p>
          </div>
        )}

        {/* Metrics */}
        {showMetrics && analytics && (
          <React.Suspense fallback={<div className="h-64 bg-gray-200 rounded animate-pulse" />}>
            <PublicacoesMetricsDashboard analytics={analytics} />
          </React.Suspense>
        )}

        {/* Filters */}
        <React.Suspense fallback={null}>
          <PublicacaoFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </React.Suspense>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          {showAdvancedFilters ? 'Ocultar' : 'Mostrar'} Filtros Avançados
        </Button>

        {showAdvancedFilters && (
          <React.Suspense fallback={null}>
            <PublicacaoAdvancedFilters
              filters={advancedFilters}
              onFiltersChange={setAdvancedFilters}
              onClear={() => setAdvancedFilters({})}
            />
          </React.Suspense>
        )}

        {/* List */}
        {filtered.length === 0 ? (
          <Card className="bg-[var(--bg-elevated)]">
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
              <p className="text-[var(--text-secondary)] mb-2">Nenhuma publicação encontrada</p>
              <p className="text-xs text-[var(--text-tertiary)]">
                {statusFilter !== 'todos'
                  ? `Sem publicações com status "${statusFilter}"`
                  : 'Importe publicações ou crie manualmente'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map(pub => (
                <React.Suspense key={pub.id} fallback={<div className="h-24 bg-gray-200 rounded animate-pulse" />}>
                  <PublicacaoCard
                    publicacao={pub}
                    onView={setSelectedPublicacao}
                    onMarkLida={handleMarkLida}
                    onArchive={() => handleArchive(pub.id)}
                  />
                </React.Suspense>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Form Dialog */}
        <React.Suspense fallback={null}>
          <PublicacaoFormDialog
            open={showFormDialog}
            onClose={() => setShowFormDialog(false)}
            escritorioId={escritorio?.[0]?.id}
            onSuccess={() => {
              refetch();
              setShowFormDialog(false);
            }}
          />
        </React.Suspense>

        {/* Detail Panel Modal */}
        {selectedPublicacao && (
          <React.Suspense fallback={null}>
            <PublicacaoDetailPanel
              publicacao={selectedPublicacao}
              onClose={() => setSelectedPublicacao(null)}
              onUpdate={() => {
                refetch();
                setSelectedPublicacao(null);
              }}
            />
          </React.Suspense>
        )}

        {/* Import Modal */}
        {showImportCSV && (
          <React.Suspense fallback={null}>
            <ImportCSVModal
              isOpen={showImportCSV}
              onClose={() => setShowImportCSV(false)}
              onSuccess={() => {
                refetch();
                setShowImportCSV(false);
              }}
            />
          </React.Suspense>
        )}
      </div>
    </div>
  );
}