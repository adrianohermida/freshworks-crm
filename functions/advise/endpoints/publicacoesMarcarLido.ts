import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adviseConfig = await base44.entities.AdviseConfig?.filter({
      ativa: true
    });

    if (!adviseConfig || adviseConfig.length === 0) {
      return Response.json({
        success: false,
        error: 'Advise não configurado'
      }, { status: 400 });
    }

    const config = adviseConfig[0];
    const token = config.adviseApiToken;
    const baseUrl = config.adviseApiUrl;

    const { itens } = await req.json();

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return Response.json({
        success: false,
        error: 'itens é obrigatório e deve ser um array'
      }, { status: 400 });
    }

    // Validar que cada item tem idMovProcessoCliente
    const itemsValidos = itens.every(item => item.idMovProcessoCliente);
    if (!itemsValidos) {
      return Response.json({
        success: false,
        error: 'Todos os itens devem ter idMovProcessoCliente'
      }, { status: 400 });
    }

    const response = await fetch(
      `${baseUrl}/core/v1/publicacoes-clientes/marcar-lidos`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itens })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json({
        success: false,
        statusCode: response.status,
        error: errorData.mensagem || 'Erro ao marcar publicações',
        detalhes: errorData
      }, { status: response.status });
    }

    const result = await response.json();

    // Registrar no audit trail
    try {
      await base44.entities.AuditTrailColaboracao?.create({
        processoId: 'publicacoes_advise',
        usuarioEmail: user.email,
        tipoOperacao: 'marcar_publicacoes_lidas',
        descricao: `${itens.length} publicação(ões) marcada(s) como lida(s)`,
        dataCriacao: new Date().toISOString(),
        metadados: { quantidadeItens: itens.length }
      });
    } catch (e) {
      console.log('Audit trail não disponível');
    }

    return Response.json({
      success: true,
      action: 'advise.publicacoes.marcarLido',
      data: {
        publicacoesMarcadas: itens.length,
        resposta: result,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('MarcarPublicacaoLido error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});