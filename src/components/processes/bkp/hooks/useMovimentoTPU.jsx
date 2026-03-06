/**
 * useMovimentoTPU
 * Hook que carrega o mapa de códigos TPUMovimentos e retorna função
 * para traduzir código de movimento DataJud → label humanizado.
 * Usa entidade TPUMovimentos (plural, conforme schema real).
 */
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

function buildMovimentoMap(movimentos) {
  const map = new Map();
  (movimentos || []).forEach(m => {
    const cod = m.cod_movimento ?? m.codigo;
    if (cod != null) map.set(String(cod), m.nome);
  });
  return map;
}

export function useMovimentoTPU() {
  const { data: movimentos = [] } = useQuery({
    queryKey: ['tpu-movimentos-map'],
    queryFn: () => base44.entities.TPUMovimentos.list('-cod_movimento', 2000),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const map = buildMovimentoMap(movimentos);

  /**
   * Traduz um movimento DataJud (objeto com .codigo e .nome) para label enriquecido.
   */
  function traduzirMovimento(mov) {
    if (!mov) return '—';
    const codigo = String(mov.codigo || mov.cod_movimento || mov.movimento_codigo || '');
    const nomeTPU = codigo ? map.get(codigo) : null;
    return nomeTPU || mov.nome || mov.movimento_nome || (codigo ? `Movimento #${codigo}` : '—');
  }

  function isTraduzido(mov) {
    const codigo = String(mov?.codigo || mov?.movimento_codigo || '');
    return codigo ? map.has(codigo) : false;
  }

  return { traduzirMovimento, isTraduzido, totalMapeados: map.size };
}