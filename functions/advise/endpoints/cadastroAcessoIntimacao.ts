import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { idFonteXTipoPesquisa, dadoAcesso, nomeResponsavel } = await req.json();

    if (!idFonteXTipoPesquisa || !dadoAcesso) {
      return Response.json({
        success: false,
        error: 'idFonteXTipoPesquisa e dadoAcesso são obrigatórios'
      }, { status: 400 });
    }

    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseUrl = 'https://api.advise.com.br';

    // Register acesso on Advise API
    const response = await fetch(`${adviseUrl}/core/v1/intimacao`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adviseToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idFonteXTipoPesquisa,
        dadoAcesso,
        nomeResponsavel: nomeResponsavel || user.full_name
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return Response.json({
        success: false,
        error: `Advise API error: ${error.message || 'Failed to register acesso'}`
      }, { status: response.status });
    }

    const acessoData = await response.json();

    // Store locally
    const novoAcesso = {
      nomeResponsavel: nomeResponsavel || user.full_name,
      idFonteXTipoPesquisa,
      nomeFonte: acessoData.nomeFonte || 'Unknown',
      dadoAcesso,
      ativa: true,
      dataCadastro: new Date().toISOString(),
      ultimaSincronizacao: new Date().toISOString(),
      usuarioCadastro: user.email,
      idAdvise: acessoData.id || acessoData.idAdvise,
      status: 'ativo'
    };

    const created = await base44.entities.ConfigIntimacao.create(novoAcesso);

    // Audit log
    await base44.functions.invoke('security/auditLog', {
      acao: 'cadastroAcessoIntimacao',
      entidade: 'ConfigIntimacao',
      resultado: 'success',
      metadados: { fonte: novoAcesso.nomeFonte }
    });

    return Response.json({
      success: true,
      action: 'intimacao.cadastroAcesso',
      data: {
        acessoId: created.id,
        fonte: novoAcesso.nomeFonte,
        status: 'ativo',
        dataCadastro: novoAcesso.dataCadastro,
        message: 'Acesso de intimação cadastrado com sucesso'
      }
    });
  } catch (error) {
    console.error('CadastroAcessoIntimacao error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});