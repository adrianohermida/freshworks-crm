import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Marca intimação como lida tanto no Advise quanto localmente
 * Sincroniza bidirecionalmente com a API Advise
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    if (!adviseToken) {
      return Response.json({ error: 'ADVISE_TOKEN não configurado' }, { status: 500 });
    }

    const { idIntimacao, idMovProcessoCliente, apiUrl = 'https://api.advise.com.br' } = await req.json();

    if (!idIntimacao || !idMovProcessoCliente) {
      return Response.json(
        { error: 'idIntimacao e idMovProcessoCliente são obrigatórios' },
        { status: 400 }
      );
    }

    console.log('[marcarIntimacaoLida] Marcando intimação como lida:', idIntimacao);

    const headers = {
      'Authorization': `Bearer ${adviseToken}`,
      'Content-Type': 'application/json'
    };

    // 1. Marcar no Advise API
    let adviseSuccess = false;
    let adviseError = null;

    try {
      const adviseResponse = await fetch(
        `${apiUrl}/core/v1/movimento-processo-cliente-lido/marcar`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({ idMovimento: idMovProcessoCliente })
        }
      );

      if (!adviseResponse.ok) {
        const error = await adviseResponse.text();
        adviseError = `API Advise retornou ${adviseResponse.status}: ${error}`;
        console.error('[marcarIntimacaoLida]', adviseError);
      } else {
        adviseSuccess = true;
        console.log('[marcarIntimacaoLida] Marcado com sucesso no Advise');
      }
    } catch (err) {
      adviseError = `Erro ao chamar API Advise: ${err.message}`;
      console.error('[marcarIntimacaoLida]', adviseError);
    }

    // 2. Atualizar localmente
    let localSuccess = false;
    try {
      const intimacoes = await base44.asServiceRole.entities.IntimacaoAdvise.filter(
        { idIntimacao }
      );

      if (intimacoes.length > 0) {
        await base44.asServiceRole.entities.IntimacaoAdvise.update(intimacoes[0].id, {
          lido: true,
          statusIntimacao: 'recebida',
          dataSincronizacao: new Date().toISOString()
        });
        localSuccess = true;
        console.log('[marcarIntimacaoLida] Atualizado localmente');
      }
    } catch (err) {
      console.error('[marcarIntimacaoLida] Erro ao atualizar localmente:', err);
    }

    return Response.json({
      success: adviseSuccess && localSuccess,
      message: 'Operação concluída',
      data: {
        idIntimacao,
        adviseSync: {
          success: adviseSuccess,
          error: adviseError
        },
        localSync: {
          success: localSuccess
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[marcarIntimacaoLida] Erro geral:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});