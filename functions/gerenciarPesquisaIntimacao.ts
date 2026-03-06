import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    const { acao, idPesquisaIntimacao } = payload;

    if (!acao || !idPesquisaIntimacao) {
      return Response.json(
        { error: 'acao e idPesquisaIntimacao são obrigatórios' },
        { status: 400 }
      );
    }

    // Get Advise config
    const configs = await base44.entities.AdviseConfig.filter({ ativa: true });
    if (configs.length === 0) {
      return Response.json({
        error: 'Integração Advise não configurada',
        success: false
      }, { status: 400 });
    }

    const config = configs[0];

    // Map action to Advise endpoint
    let endpoint = '';
    let novoStatus = '';

    if (acao === 'ativar') {
      endpoint = '/core/v1/intimacao/ativar-pesquisa';
      novoStatus = 'ativa';
    } else if (acao === 'inativar') {
      endpoint = '/core/v1/intimacao/inativar-pesquisa';
      novoStatus = 'inativa';
    } else if (acao === 'excluir') {
      endpoint = '/core/v1/intimacao/excluir-pesquisa';
      novoStatus = 'excluida';
    } else {
      return Response.json(
        { error: 'Ação inválida: ativar, inativar ou excluir' },
        { status: 400 }
      );
    }

    // Call Advise API
    const response = await fetch(
      `${config.adviseApiUrl}${endpoint}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${config.adviseApiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idPesqIntimacaoUsCliente: parseInt(idPesquisaIntimacao)
        })
      }
    );

    if (!response.ok) {
      return Response.json({
        success: false,
        error: `Erro ao ${acao} pesquisa: ${response.status}`,
        timestamp: new Date().toISOString()
      }, { status: response.status });
    }

    // Update local database
    const pesquisas = await base44.entities.PesquisaIntimacao.filter({
      idPesquisaAdvise: idPesquisaIntimacao
    });

    if (pesquisas.length > 0) {
      await base44.entities.PesquisaIntimacao.update(pesquisas[0].id, {
        status: novoStatus,
        ativa: acao === 'ativar',
        ultimaSincronizacao: new Date().toISOString()
      });
    }

    const mensagens = {
      ativar: 'Pesquisa de intimação ativada',
      inativar: 'Pesquisa de intimação desativada',
      excluir: 'Pesquisa de intimação excluída'
    };

    return Response.json({
      success: true,
      message: mensagens[acao],
      novoStatus: novoStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao gerenciar pesquisa:', error);
    return Response.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
});