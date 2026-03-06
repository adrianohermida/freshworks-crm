import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função para cadastrar credenciais para captura de intimações
 * POST /core/v1/intimacao
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();

    const {
      nomeResponsavel,
      idFonteXTipoPesquisa,
      dadoAcesso, // email, CPF, CNPJ, etc
      senha,
      autenticacao // código QR para 2FA (opcional)
    } = payload;

    // Validações
    if (!idFonteXTipoPesquisa || !dadoAcesso || !senha) {
      return Response.json(
        { error: 'idFonteXTipoPesquisa, dadoAcesso e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Chamar API Advise
    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseUrl = Deno.env.get('ADVISE_API_URL') || 'https://api.advise.com.br';

    const bodyAdvise = {
      nomeResponsavel: nomeResponsavel || user.full_name,
      idFonteXTipoPesquisa: parseInt(idFonteXTipoPesquisa),
      dadoAcesso,
      senha
    };

    // Adicionar autenticação 2FA se fornecida
    if (autenticacao) {
      bodyAdvise.autenticacao = autenticacao;
    }

    const response = await fetch(
      `${adviseUrl}/core/v1/intimacao`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adviseToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyAdvise)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(
        { error: errorData.message || 'Erro ao cadastrar credenciais no Advise' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Salvar no banco local para referência
    try {
      await base44.entities.ConfigIntimacao.create({
        nomeResponsavel: nomeResponsavel || user.full_name,
        idFonteXTipoPesquisa: idFonteXTipoPesquisa.toString(),
        dadoAcesso, // salvar sem a senha por segurança
        ativa: true,
        dataCadastro: new Date().toISOString(),
        ultimaSincronizacao: new Date().toISOString(),
        usuarioCadastro: user.email,
        idAdvise: data.id || null
      });
    } catch (err) {
      console.warn('Erro ao salvar config local:', err.message);
    }

    return Response.json({
      success: true,
      message: 'Credenciais cadastradas com sucesso',
      idIntimacao: data.id,
      fonte: data.nomeFonte,
      data: data
    });

  } catch (error) {
    console.error('Erro ao cadastrar credenciais:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});