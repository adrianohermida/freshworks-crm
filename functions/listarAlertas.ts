import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função para listar alertas
 * GET - Lista alertas com filtros
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const filtroStatus = url.searchParams.get('status') || 'aberto'; // aberto, resolvido, todos
    const filtroTipo = url.searchParams.get('tipo');
    const filtroSeveridade = url.searchParams.get('severidade');
    const numeroProcesso = url.searchParams.get('numeroProcesso');
    const limite = parseInt(url.searchParams.get('limite') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Construir query
    let query = {
      usuarioResponsavel: user.email
    };

    if (filtroStatus === 'aberto') {
      query.resolvido = false;
    } else if (filtroStatus === 'resolvido') {
      query.resolvido = true;
    }

    if (filtroTipo) query.tipo = filtroTipo;
    if (filtroSeveridade) query.severidade = filtroSeveridade;
    if (numeroProcesso) query.numeroProcesso = numeroProcesso;

    // Buscar alertas
    const alertas = await base44.entities.Alerta.filter(
      query,
      '-dataOcorrencia',
      limite,
      offset
    );

    // Contar total
    const total = (await base44.entities.Alerta.filter(query)).length;

    // Agrupar por severidade
    const estadisticas = {
      total,
      critica: alertas.filter(a => a.severidade === 'critica').length,
      alta: alertas.filter(a => a.severidade === 'alta').length,
      media: alertas.filter(a => a.severidade === 'media').length,
      baixa: alertas.filter(a => a.severidade === 'baixa').length,
      naoLidos: alertas.filter(a => !a.lido).length
    };

    return new Response(JSON.stringify({
      success: true,
      alertas,
      paginacao: {
        total,
        limite,
        offset,
        pagina: Math.floor(offset / limite) + 1,
        totalPaginas: Math.ceil(total / limite)
      },
      estadisticas,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=60' // 1 minuto
      }
    });

  } catch (error) {
    console.error('Erro ao listar alertas:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});