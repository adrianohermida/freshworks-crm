import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = Deno.env.get('ADVISE_TOKEN');
    const apiUrl = Deno.env.get('ADVISE_API_URL');

    if (!token || !apiUrl) {
      return Response.json({
        success: false,
        error: 'ADVISE_TOKEN ou ADVISE_API_URL não configurados'
      }, { status: 400 });
    }

    const {
      campos = '*',
      DataInicioMovimento,
      DataFimMovimento,
      RegistrosPorPagina = 50,
      paginaAtual = 1
    } = await req.json();

    // Validar registros por página
    if (RegistrosPorPagina < 10 || RegistrosPorPagina > 100) {
      return Response.json({
        success: false,
        error: 'RegistrosPorPagina deve estar entre 10 e 100'
      }, { status: 400 });
    }

    // Validar página atual
    if (paginaAtual < 1) {
      return Response.json({
        success: false,
        error: 'paginaAtual deve ser maior que 0'
      }, { status: 400 });
    }

    // Construir query params (mesmo padrão do E2E)
    const params = new URLSearchParams({
      campos,
      RegistrosPorPagina,
      paginaAtual
    });

    if (DataInicioMovimento && DataFimMovimento) {
      params.append('DataInicioMovimento', DataInicioMovimento);
      params.append('DataFimMovimento', DataFimMovimento);
    }

    const url = `${apiUrl}?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      return Response.json({
        success: false,
        statusCode: 401,
        error: 'Usuário não logado ou não autorizado',
        message: 'Token inválido ou expirado'
      }, { status: 401 });
    }

    if (response.status === 400) {
      const errorData = await response.json();
      return Response.json({
        success: false,
        statusCode: 400,
        error: 'Erro na requisição',
        detalhes: errorData
      }, { status: 400 });
    }

    if (!response.ok) {
      return Response.json({
        success: false,
        statusCode: response.status,
        error: 'Erro ao consultar publicações'
      }, { status: response.status });
    }

    const result = await response.json();

    // Enriquecer com dados locais
    const publicacoes = result.itens || result.result || result.publicacoes || result.items || [];

    const publicacoesEnriquecidas = await Promise.all(
      (publicacoes || []).map(async (pub) => {
        try {
          const pubLocal = await base44.entities.PublicacaoAdvise?.filter({
            idPublicacaoAdvise: pub.id?.toString()
          });
          return {
            ...pub,
            local: pubLocal?.[0] || null
          };
        } catch (e) {
          return pub;
        }
      })
    );

    return Response.json({
      success: true,
      action: 'advise.publicacoes.consultaAvancada',
      data: {
        filtros: {
          DataInicioMovimento,
          DataFimMovimento
        },
        paginacao: {
          paginaAtual: result.paginacao?.paginaAtual || paginaAtual,
          paginaTotal: result.paginacao?.paginaTotal || 1,
          registrosPorPagina: result.paginacao?.registrosPorPagina || RegistrosPorPagina,
          registrosTotal: result.paginacao?.registrosTotal || publicacoes.length
        },
        publicacoes: publicacoesEnriquecidas,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('PublicacoesConsultaAvancada error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});