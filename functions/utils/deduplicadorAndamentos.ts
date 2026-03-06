/**
 * deduplicadorAndamentos.ts - Deduplicação inteligente de movimentações
 * 
 * Hash: numero_processo + tribunal + data_movimento + tipo_movimento + codigo_movimento
 * Evita duplicatas ao sincronizar DataJud múltiplas vezes
 */

import * as crypto from 'node:crypto';

export interface AndamentoProcessual {
  processo_id: string;
  processo_numero: string;
  tribunal: string;
  codigo_movimento: number;
  tipo_movimento: string;
  data_movimento: string; // ISO datetime
  orgao_julgador?: string;
  complementos?: string;
  hash?: string;
}

/**
 * Gera hash único para um andamento
 */
export function gerarHashAndamento(andamento: {
  numero_processo: string;
  tribunal: string;
  codigo_movimento: number;
  data_movimento: string;
}): string {
  const dados = `${andamento.numero_processo}|${andamento.tribunal}|${andamento.codigo_movimento}|${andamento.data_movimento}`;
  return crypto.createHash('sha256').update(dados).digest('hex');
}

/**
 * Filtra andamentos novos vs duplicatas
 * Retorna: { novos: [], duplicatas: [] }
 */
export async function deduplicarAndamentos(
  base44: any,
  processoId: string,
  andamentosNovos: any[]
): Promise<{
  novos: AndamentoProcessual[];
  duplicatas: string[];
  totalExistentes: number;
}> {
  try {
    // Buscar andamentos existentes do processo
    const existentes = await base44.asServiceRole.entities.AndamentoProcessual.filter(
      { processo_id: processoId },
      '-data_movimento',
      500
    );

    const hashesExistentes = new Set(
      existentes
        .filter(a => a.hash)
        .map(a => a.hash)
    );

    const novos: AndamentoProcessual[] = [];
    const duplicatas: string[] = [];

    for (const mov of andamentosNovos) {
      const hash = gerarHashAndamento({
        numero_processo: mov.numero_processo || mov.processo_numero,
        tribunal: mov.tribunal,
        codigo_movimento: mov.codigo_movimento || mov.codMovimento,
        data_movimento: mov.data_movimento || mov.dataHora,
      });

      if (hashesExistentes.has(hash)) {
        duplicatas.push(hash);
      } else {
        novos.push({
          ...mov,
          hash,
        });
      }
    }

    console.log(
      `[Dedup] Processo ${processoId}: ${novos.length} novos, ${duplicatas.length} duplicatas (${existentes.length} existentes)`
    );

    return {
      novos,
      duplicatas,
      totalExistentes: existentes.length,
    };
  } catch (err) {
    console.warn('[Dedup] Erro ao deduplicar:', err.message);
    // Se falhar a busca, retorna tudo como novo (fallback seguro)
    return {
      novos: andamentosNovos,
      duplicatas: [],
      totalExistentes: 0,
    };
  }
}

/**
 * Validação pós-deduplicação
 */
export function validarConsistenciaAndamentos(
  novos: AndamentoProcessual[]
): { validos: AndamentoProcessual[]; invalidos: any[] } {
  const validos: AndamentoProcessual[] = [];
  const invalidos: any[] = [];

  for (const and of novos) {
    const erros = [];

    if (!and.processo_numero) erros.push('numero_processo obrigatório');
    if (!and.tribunal) erros.push('tribunal obrigatório');
    if (!and.codigo_movimento) erros.push('codigo_movimento obrigatório');
    if (!and.data_movimento) erros.push('data_movimento obrigatória');
    if (!and.hash) erros.push('hash obrigatório');

    if (erros.length > 0) {
      invalidos.push({ andamento: and, erros });
    } else {
      validos.push(and);
    }
  }

  return { validos, invalidos };
}