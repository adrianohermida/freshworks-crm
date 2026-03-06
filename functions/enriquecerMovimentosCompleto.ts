import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Enriquece movimentos com dados TPU completos
 * - Nome + categoria + subcategoria
 * - Normaliza tribunal/foro
 * - Deduplicação
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { processo_id, movimentos, tribunal } = await req.json();

    if (!processo_id || !Array.isArray(movimentos)) {
      return Response.json({ 
        error: 'processo_id e movimentos array são obrigatórios' 
      }, { status: 400 });
    }

    const enriquecidos = [];
    const naoEncontrados = [];
    const erros = [];

    for (const mov of movimentos) {
      try {
        // Buscar em TPUMovimentos
        const tpuMov = await base44.entities.TPUMovimentos.filter(
          { cod_movimento: Number(mov.codigo_movimento) },
          null,
          1
        );

        let enriquecido = {
          processo_id,
          codigo_movimento: mov.codigo_movimento,
          data_movimento: mov.data_movimento,
          nome_movimento: null,
          categoria_movimento: null,
          subcategoria_movimento: null,
          visibilidade_externa: null,
          hash: gerarHash(processo_id, mov.codigo_movimento, mov.data_movimento)
        };

        if (tpuMov && tpuMov.length > 0) {
          const item = tpuMov[0];
          enriquecido.nome_movimento = item.nome;
          enriquecido.categoria_movimento = item.categoria;
          enriquecido.subcategoria_movimento = item.subcategoria;
          enriquecido.visibilidade_externa = item.visibilidade_externa;
        } else {
          naoEncontrados.push(mov.codigo_movimento);
        }

        // Normalizar tribunal/foro (opcional)
        if (tribunal) {
          const foroInfo = await buscarForo(base44, tribunal);
          if (foroInfo) {
            enriquecido.orgao_julgador = foroInfo.nome;
          }
        }

        enriquecidos.push(enriquecido);
      } catch (error) {
        erros.push({
          codigo_movimento: mov.codigo_movimento,
          erro: error.message
        });
      }
    }

    return Response.json({
      success: true,
      processo_id,
      movimentos_enriquecidos: enriquecidos,
      total_enriquecidos: enriquecidos.length,
      total_nao_encontrados: naoEncontrados.length,
      codigos_nao_encontrados: naoEncontrados,
      erros: erros.length > 0 ? erros : null
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

/**
 * Gera hash para deduplicação
 */
function gerarHash(processo_id, codigo_movimento, data_movimento) {
  // Implementar SHA256 aqui
  // Por enquanto retorna um hash simples
  return `${processo_id}|${codigo_movimento}|${data_movimento}`.substring(0, 64);
}

/**
 * Busca informações do foro/órgão julgador
 */
async function buscarForo(base44, tribunal) {
  try {
    // Tentar em JuizoCNJ primeiro
    const juizos = await base44.entities.JuizoCNJ.filter(
      { tribunal },
      null,
      1
    );
    if (juizos?.length > 0) {
      return juizos[0];
    }

    // Se TJSP, tentar em CodigoForoTJSP
    if (tribunal.toUpperCase() === 'TJSP') {
      // Buscar por prefixo ou primeiro do TJSP
      const foros = await base44.entities.CodigoForoTJSP.filter(
        {},
        null,
        1
      );
      if (foros?.length > 0) {
        return foros[0];
      }
    }

    return null;
  } catch (e) {
    return null;
  }
}