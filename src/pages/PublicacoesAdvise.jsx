import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import UnifiedDocumentList from '../components/advise/UnifiedDocumentList';
import PublicacaoMetrics from '../components/publicacoes/PublicacaoMetrics';
import PublicacaoFilters from '../components/publicacoes/PublicacaoFilters';
import { Loader2, AlertCircle } from 'lucide-react';

const ITEMS_PER_PAGE = 50;

export default function PublicacoesAdvise() {

  // Buscar publicações sincronizadas
    const [publicacoes, setPublicacoes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState(null);
    const [filtros, setFiltros] = useState({ usuario: '', palavrasChave: [] });
    const [usuarios, setUsuarios] = useState([]);
    const [todasPalavrasChave, setTodasPalavrasChave] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [contadorImportadas, setContadorImportadas] = useState(0);
    const observerRef = useRef(null);

    const loadPublicacoes = useCallback(async () => {
      setIsLoading(true);
      setLoadError(null);
      setPaginaAtual(1);
      
      try {
        const result = await retryLoadPublicacoes();
        setPublicacoes(result || []);
        setContadorImportadas(result?.length || 0);
        
        // Extrair usuários e palavras-chave únicas
        const usuariosUnicos = [...new Set(result?.map(p => p.created_by) || [])];
        const palavrasUnicas = [...new Set(result?.flatMap(p => p.palavrasChave || []) || [])];
        
        setUsuarios(usuariosUnicos.map(email => ({ id: email, email, nome: email.split('@')[0] })));
        setTodasPalavrasChave(palavrasUnicas);
        setLoadError(null);
      } catch (err) {
        const isRateLimit = err.response?.status === 429 || err.message?.includes('429');
        const msg = isRateLimit
          ? 'Limite de requisições atingido. Aguarde alguns minutos e tente novamente.'
          : `Erro ao carregar: ${err.message}`;
        setLoadError(msg);
        console.error('Erro ao carregar publicações:', err);
      } finally {
        setIsLoading(false);
      }
    }, []);

    const retryLoadPublicacoes = useCallback(async () => {
      const maxAttempts = 3;
      const baseDelay = 2000;
      
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          // Carregar sem limite para obter TODAS as publicações
          return await base44.entities.PublicacaoAdvise.list('-updated_date');
        } catch (err) {
          const isRetryable = err.response?.status === 429 || err.response?.status === 504;
          
          if (isRetryable && attempt < maxAttempts - 1) {
            const delay = baseDelay * Math.pow(2, attempt);
            setLoadError(`⏳ Taxa de requisições excedida. Aguardando ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            throw err;
          }
        }
      }
    }, []);

    // Filtrar publicações
    const publicacoesFiltradasFinal = useMemo(() => 
      publicacoes.filter(p => {
        const filtroUsuarios = !filtros.usuarios || filtros.usuarios.length === 0 || filtros.usuarios.includes(p.created_by);
        const filtroPalavras = !filtros.palavrasChave || filtros.palavrasChave.length === 0 || 
          filtros.palavrasChave.some(palavra => p.palavrasChave?.includes(palavra));
        return filtroUsuarios && filtroPalavras;
      }), [publicacoes, filtros]);

    // Paginação e lazy load
    const totalPaginas = Math.ceil(publicacoesFiltradasFinal.length / ITEMS_PER_PAGE);
    const publicacoesPaginadas = useMemo(() => {
      const inicio = (paginaAtual - 1) * ITEMS_PER_PAGE;
      return publicacoesFiltradasFinal.slice(0, inicio + ITEMS_PER_PAGE);
    }, [publicacoesFiltradasFinal, paginaAtual]);

    // Lazy load com IntersectionObserver
    useEffect(() => {
      if (!observerRef.current || paginaAtual >= totalPaginas) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && paginaAtual < totalPaginas) {
            setPaginaAtual(p => p + 1);
          }
        },
        { threshold: 0.1 }
      );

      if (observerRef.current) {
        observer.observe(observerRef.current);
      }

      return () => observer.disconnect();
    }, [paginaAtual, totalPaginas]);

  // Buscar métricas completas (total no Advise + sincronizadas + faltam)
   const [metricsData, setMetricsData] = React.useState({ totalPublicacoesAdvise: 0, totalImportadas: 0, faltamImportar: 0 });

   const loadMetrics = React.useCallback(async () => {
     try {
       const response = await base44.functions.invoke('advise/getTotalPublicacoesAdvise', {});
       setMetricsData(response.data || { totalPublicacoesAdvise: 0, totalImportadas: 0, faltamImportar: 0 });
     } catch (err) {
       console.error('Erro ao carregar métricas:', err);
     }
   }, []);

  // Carregar automaticamente ao montar o componente
  useEffect(() => {
    loadPublicacoes();
    loadMetrics();
  }, []);

  const updateStatusMutation = useMutation({
    mutationFn: async (pub) => {
      const response = await base44.functions.invoke('updatePublicacaoStatus', {
        idPublicacao: pub.idPublicacaoAdvise || pub.id,
        lido: pub.lido
      });
      return response.data;
    },
    onSuccess: () => {
      loadPublicacoes();
    }
  });

  const lidas = publicacoesFiltradasFinal.filter(p => p.lido).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Publicações</h1>
            <p className="text-gray-600">Monitore publicações de seus processos | {contadorImportadas} registros sincronizados</p>
          </div>
          <div className="text-sm bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center gap-2">
            <span className="text-blue-700">
              ℹ️ Sincronização automática: diariamente às 02:00 AM (sua zona)
            </span>
          </div>
        </div>

        {/* Filtros */}
        <PublicacaoFilters 
          onFilterChange={setFiltros}
          usuarios={usuarios}
          palavrasFiltro={todasPalavrasChave}
        />

        {/* Métricas */}
        <PublicacaoMetrics 
          totalNaAPI={metricsData.totalPublicacoesAdvise}
          sincronizadas={publicacoesFiltradasFinal.length}
          lidas={lidas}
          loading={isLoading}
          confiavel={metricsData.confiavel}
        />

        {/* Load Data Button */}
        <Button 
          onClick={() => { 
            loadPublicacoes();
            loadMetrics();
          }} 
          disabled={isLoading}
          variant="outline" 
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Carregando...
            </>
          ) : (
            'Carregar Publicações'
          )}
        </Button>

        {/* Status Messages */}
        {loadError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-900">{loadError}</p>
          </div>
        )}

        {!isLoading && publicacoes.length === 0 && !loadError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-yellow-900 font-medium">Nenhuma publicação encontrada</p>
            <p className="text-yellow-700 text-sm mt-1">Clique em "Carregar Publicações" para visualizar os registros sincronizados</p>
          </div>
        )}

        {publicacoes.length > 0 && publicacoesFiltradasFinal.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900">Nenhuma publicação corresponde aos filtros selecionados</p>
          </div>
        )}

        {/* Unified List com Lazy Load */}
        {publicacoesFiltradasFinal.length > 0 && (
          <>
            <UnifiedDocumentList
              documents={publicacoesPaginadas}
              isLoading={false}
              type="publicacao"
              onStatusChange={(pub) => updateStatusMutation.mutate(pub)}
              title="Publicações"
            />

            {/* Load More Trigger */}
            <div ref={observerRef} className="flex justify-center py-4">
              {paginaAtual < totalPaginas && (
                <p className="text-sm text-gray-500">
                  Carregando mais... ({publicacoesPaginadas.length} de {publicacoesFiltradasFinal.length})
                </p>
              )}
            </div>

            {/* Pagination Info */}
            <div className="text-center text-sm text-gray-600 mt-4">
              Página {paginaAtual} de {totalPaginas} | {publicacoesPaginadas.length} registros carregados
            </div>
          </>
        )}
      </div>
    </div>
  );
}