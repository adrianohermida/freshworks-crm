import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função para consultar acessos cadastrados
 * GET /core/v1/intimacao/ConsultaCadastroAcessos
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parâmetros da query
    const url = new URL(req.url);
    const registrosPorPagina = parseInt(url.searchParams.get('registrosPorPagina') || '20');
    const paginaAtual = parseInt(url.searchParams.get('paginaAtual') || '1');

    // Validar parâmetros
    if (registrosPorPagina < 10 || registrosPorPagina > 50) {
      return Response.json(
        { error: 'registrosPorPagina deve estar entre 10 e 50' },
        { status: 400 }
      );
    }

    // Chamar API Advise
    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseUrl = Deno.env.get('ADVISE_API_URL') || 'https://api.advise.com.br';

    const response = await fetch(
      `${adviseUrl}/core/v1/intimacao/ConsultaCadastroAcessos?campos=*&registrosPorPagina=${registrosPorPagina}&paginaAtual=${paginaAtual}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adviseToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(
        { error: errorData.message || 'Erro ao consultar acessos no Advise' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Sincronizar com banco local
    if (data.acessos && Array.isArray(data.acessos)) {
      for (const acesso of data.acessos) {
        try {
          const acessoLocal = await base44.entities.ConfigIntimacao.filter({
            idAdvise: acesso.id?.toString()
          }).then(r => r[0]);

          if (!acessoLocal) {
            await base44.entities.ConfigIntimacao.create({
              nomeResponsavel: acesso.nomeResponsavel || 'Sem nome',
              idFonteXTipoPesquisa: acesso.idFonteXTipoPesquisa?.toString() || '',
              dadoAcesso: acesso.dadoAcesso || '',
              ativa: acesso.ativa !== false,
              dataCadastro: acesso.dataCadastro || new Date().toISOString(),
              ultimaSincronizacao: new Date().toISOString(),
              usuarioCadastro: user.email,
              idAdvise: acesso.id?.toString()
            });
          }
        } catch (err) {
          console.warn(`Erro ao sincronizar acesso ${acesso.id}:`, err.message);
        }
      }
    }

    return Response.json({
      success: true,
      acessos: data.acessos || [],
      paginaAtual,
      registrosPorPagina,
      totalRegistros: data.totalRegistros || 0,
      totalPaginas: data.totalPaginas || 0
    });

  } catch (error) {
    console.error('Erro ao consultar acessos:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});