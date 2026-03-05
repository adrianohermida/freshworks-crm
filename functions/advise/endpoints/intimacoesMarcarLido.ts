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
      idsIntimacoes = [],
      marcar = true
    } = await req.json();

    if (!Array.isArray(idsIntimacoes) || idsIntimacoes.length === 0) {
      return Response.json({
        success: false,
        error: 'idsIntimacoes deve ser um array não vazio'
      }, { status: 400 });
    }

    // Endpoint para marcar como lido ou desmarcar
    const endpoint = marcar 
      ? '/core/v1/intimacoes-clientes/marcar-lidos'
      : '/core/v1/intimacoes-clientes/desmarcar-lidos';

    const url = `${apiUrl}${endpoint}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: idsIntimacoes
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      return Response.json({
        success: false,
        statusCode: response.status,
        error: 'Erro ao atualizar status de intimações',
        detalhes: errorData
      }, { status: response.status });
    }

    const result = await response.json();

    // Atualizar registros locais de intimações marcadas como lidas
    const intimacoes = await base44.entities.IntimacaoAdvise?.filter({
      idIntimacao: { $in: idsIntimacoes }
    });

    if (intimacoes && intimacoes.length > 0) {
      await Promise.all(
        intimacoes.map(int => 
          base44.entities.IntimacaoAdvise?.update(int.id, {
            lido: marcar
          })
        )
      );
    }

    return Response.json({
      success: true,
      action: 'advise.intimacoes.marcarLido',
      data: {
        idsProcessados: idsIntimacoes,
        acao: marcar ? 'marcadas como lidas' : 'desmarcadas como lidas',
        timestampAtualizacao: new Date().toISOString(),
        respuestaAdvise: result
      }
    });
  } catch (error) {
    console.error('IntimacoesMarcarLido error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});