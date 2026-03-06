/**
 * Deduplicação de Andamentos - Identifica e marca movimentos duplicados
 * Usa hash SHA256 para comparação segura
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Calcular hash SHA256 de um movimento
 */
async function gerarHashMovimento(movimento) {
  const dados = JSON.stringify({
    codigo: movimento.codigo_movimento,
    data: movimento.data_movimento,
    dataIntimacao: movimento.data_intimacao,
    orgaoJulgador: movimento.orgao_julgador,
    complementos: movimento.complementos
  });

  const encoder = new TextEncoder();
  const data = encoder.encode(dados);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Detectar duplicatas com estratégia multi-nível
 */
function detectarDuplicatas(andamentos) {
  const grupos = {};
  const duplicatas = [];

  // Agrupamento por hash
  andamentos.forEach((movimento, idx) => {
    if (!movimento.hash) {
      movimento.hash = 'sem_hash';
    }

    if (!grupos[movimento.hash]) {
      grupos[movimento.hash] = [];
    }
    grupos[movimento.hash].push(idx);
  });

  // Identificar duplicatas
  Object.entries(grupos).forEach(([hash, indices]) => {
    if (indices.length > 1) {
      // Manter o mais recente, marcar outros como duplicatas
      const ordenados = indices.sort((a, b) => {
        const dataA = new Date(andamentos[a].data_movimento);
        const dataB = new Date(andamentos[b].data_movimento);
        return dataB - dataA; // Mais recente primeiro
      });

      duplicatas.push({
        hash,
        original_idx: ordenados[0],
        duplicatas_idx: ordenados.slice(1),
        count: indices.length
      });
    }
  });

  return {
    total: andamentos.length,
    com_hash: Object.keys(grupos).filter(k => k !== 'sem_hash').length,
    grupos,
    duplicatas
  };
}

/**
 * Remover ou marcar duplicatas
 */
function processarDuplicatas(andamentos, remover = false) {
  const resultado = detectarDuplicatas(andamentos);
  const andamentosProcessados = [...andamentos];

  resultado.duplicatas.forEach(dup => {
    dup.duplicatas_idx.forEach(idx => {
      if (remover) {
        andamentosProcessados[idx] = null;
      } else {
        andamentosProcessados[idx].duplicado = true;
        andamentosProcessados[idx].hash_original = dup.hash;
      }
    });
  });

  return {
    andamentos: remover ? andamentosProcessados.filter(a => a !== null) : andamentosProcessados,
    estatisticas: {
      total_original: andamentos.length,
      total_processado: remover ? andamentosProcessados.filter(a => a !== null).length : andamentos.length,
      duplicatas_removidas: resultado.duplicatas.reduce((acc, d) => acc + d.duplicatas_idx.length, 0),
      grupos_duplicata: resultado.duplicatas.length
    }
  };
}

/**
 * Backend function
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { andamentos, remover_duplicatas = false } = body;

    if (!andamentos || !Array.isArray(andamentos)) {
      return Response.json({ error: 'andamentos array é obrigatório' }, { status: 400 });
    }

    // Gerar hashes para todos os movimentos
    const andamentosComHash = await Promise.all(
      andamentos.map(async (mov) => ({
        ...mov,
        hash: await gerarHashMovimento(mov)
      }))
    );

    // Processar duplicatas
    const resultado = processarDuplicatas(andamentosComHash, remover_duplicatas);

    return Response.json(resultado, { status: 200 });
  } catch (error) {
    console.error('[deduplicadorAndamentos] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});