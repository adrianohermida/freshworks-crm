import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Enriquece código de foro TJSP com mapeamento CNJ
 * Busca mapeamento entre código TJSP e CNJ
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { codigoCNJ, tribunal } = await req.json();

    if (!codigoCNJ || tribunal !== 'TJSP') {
      return Response.json({
        status: 'nao_aplicavel',
        enriquecimento: {},
      });
    }

    try {
      const codigos = await base44.entities.CodigoForoTJSP.filter(
        { codigo_cnj: Number(codigoCNJ) },
        null,
        1
      );

      if (codigos && codigos.length > 0) {
        const codigo = codigos[0];
        return Response.json({
          status: 'sucesso',
          enriquecimento: {
            codigo_foro_tjsp: codigo.codigo_tjsp,
            nome_foro: codigo.nome_foro,
            comarca: codigo.comarca,
            grau: codigo.grau,
          },
        });
      }

      return Response.json({
        status: 'nao_encontrado',
        enriquecimento: {},
      });

    } catch (e) {
      console.warn('Erro ao buscar CodigoForoTJSP:', e.message);
      return Response.json({
        status: 'erro',
        error: e.message,
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erro em enriquecerCodigoForoTJSP:', error);
    return Response.json({
      status: 'erro',
      error: error.message,
    }, { status: 500 });
  }
});