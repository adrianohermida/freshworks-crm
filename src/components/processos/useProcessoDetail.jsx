import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

/**
 * Hook customizado para carregar detalhes completos de um processo
 * Combina cabeçalho, informações adicionais e fonte do processo
 * Implementa cache estratégico
 */
export function useProcessoDetail(numeroProcesso, idFonteProcesso) {
  const { data: cabecalho, isLoading: cabecalhoLoading } = useQuery({
    queryKey: ['processoCabecalho', idFonteProcesso],
    queryFn: async () => {
      const response = await base44.functions.invoke('consultarCabecalhoProcesso', {
        idFonteProcesso
      });
      return response.data.cabecalho;
    },
    enabled: !!idFonteProcesso,
    staleTime: 30 * 60 * 1000, // 30 minutos
    gcTime: 60 * 60 * 1000 // 1 hora
  });

  const { data: informacoes, isLoading: informacoesLoading } = useQuery({
    queryKey: ['processoInformacoes', numeroProcesso],
    queryFn: async () => {
      const response = await base44.functions.invoke('consultarInfoAdicionaisProcesso', {
        numeroProcesso
      });
      return response.data.informacoes;
    },
    enabled: !!numeroProcesso,
    staleTime: 15 * 60 * 1000, // 15 minutos
    gcTime: 60 * 60 * 1000
  });

  const { data: fontes, isLoading: fontesLoading } = useQuery({
    queryKey: ['processoFontes'],
    queryFn: async () => {
      const response = await base44.functions.invoke('consultarFonteProcesso', {
        flAtivo: true
      });
      return response.data.fontes;
    },
    staleTime: 60 * 60 * 1000, // 1 hora
    gcTime: 2 * 60 * 60 * 1000 // 2 horas
  });

  return {
    cabecalho,
    informacoes,
    fontes,
    isLoading: cabecalhoLoading || informacoesLoading || fontesLoading,
    isCabecalhoLoading: cabecalhoLoading,
    isInformacoesLoading: informacoesLoading,
    isFontesLoading: fontesLoading
  };
}