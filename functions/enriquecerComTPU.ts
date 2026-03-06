/**
 * Enriquecimento com TPU - Mapeia Classes, Movimentos e Assuntos
 * Vincula dados brutos com tabelas processuais unificadas do CNJ
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Mapear classe do processo com TPU
 */
async function mapearClasse(base44, classeCode) {
  try {
    const classes = await base44.entities.TPUClasses.filter(
      { cod_classe: parseInt(classeCode) },
      null,
      1
    );
    return classes && classes.length > 0 ? classes[0] : null;
  } catch {
    return null;
  }
}

/**
 * Mapear movimentos com TPU
 */
async function mapearMovimentos(base44, andamentos) {
  const mapeados = await Promise.all(
    andamentos.map(async (mov) => {
      try {
        const tpuMovimentos = await base44.entities.TPUMovimentos.filter(
          { cod_movimento: parseInt(mov.codigo_movimento) },
          null,
          1
        );

        if (tpuMovimentos && tpuMovimentos.length > 0) {
          const tpu = tpuMovimentos[0];
          return {
            ...mov,
            tpu_mapped: {
              cod_movimento: tpu.cod_movimento,
              nome_tpu: tpu.nome,
              categoria: tpu.categoria,
              subcategoria: tpu.subcategoria,
              visibilidade_externa: tpu.visibilidade_externa
            }
          };
        }
      } catch (e) {
        console.error(`Erro ao mapear movimento ${mov.codigo_movimento}:`, e);
      }
      return mov;
    })
  );

  return mapeados;
}

/**
 * Mapear assuntos
 */
async function mapearAssuntos(base44, assuntoCodes) {
  if (!assuntoCodes || assuntoCodes.length === 0) return [];

  const mapeados = await Promise.all(
    assuntoCodes.map(async (code) => {
      try {
        const assuntos = await base44.entities.TPUAssuntos.filter(
          { cod_assunto: parseInt(code) },
          null,
          1
        );
        return assuntos && assuntos.length > 0 ? assuntos[0] : null;
      } catch {
        return null;
      }
    })
  );

  return mapeados.filter(a => a !== null);
}

/**
 * Extrair órgão julgador com normalização
 */
function normalizarOrgaoJulgador(orgaoText, tribunal) {
  if (!orgaoText) return null;

  const patterns = {
    vara: /vara\s+(?:cível|criminal|trabalhista|eleitoral)?/i,
    camara: /câmara|câmera/i,
    juizado: /juizado/i,
    turma: /turma/i,
    tribunal: /tribunal/i
  };

  const tipo = Object.keys(patterns).find(key => patterns[key].test(orgaoText));

  return {
    texto_original: orgaoText,
    tipo_normalizado: tipo || 'outro',
    tribunal: tribunal
  };
}

/**
 * Função backend
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { processo, andamentos } = body;

    if (!processo) {
      return Response.json({ error: 'processo é obrigatório' }, { status: 400 });
    }

    // Mapear classe
    let classeTPU = null;
    if (processo.classe_codigo) {
      classeTPU = await mapearClasse(base44, processo.classe_codigo);
    }

    // Mapear movimentos
    let andamentosMapeados = andamentos || [];
    if (andamentosMapeados.length > 0) {
      andamentosMapeados = await mapearMovimentos(base44, andamentosMapeados);
    }

    // Mapear assuntos
    let assuntosTPU = [];
    if (processo.assunto_codigo) {
      assuntosTPU = await mapearAssuntos(base44, [processo.assunto_codigo]);
    }

    // Normalizar órgão julgador
    const orgaoNormalizado = normalizarOrgaoJulgador(
      processo.orgao_julgador,
      processo.tribunal_alias
    );

    return Response.json({
      processo_id: processo.id,
      enriquecimento: {
        classe_tpu: classeTPU,
        movimentos_mapeados: andamentosMapeados.length,
        assuntos_tpu: assuntosTPU,
        orgao_normalizado: orgaoNormalizado,
        timestamp: new Date().toISOString()
      },
      estatisticas: {
        total_movimentos: andamentosMapeados.length,
        movimentos_com_tpu: andamentosMapeados.filter(m => m.tpu_mapped).length,
        assuntos_encontrados: assuntosTPU.length
      }
    }, { status: 200 });
  } catch (error) {
    console.error('[enriquecerComTPU] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});