import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função para consultar fontes de intimação disponíveis
 * GET /core/v1/intimacao/ConsultaFonteIntimacoes
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
    if (registrosPorPagina < 10 || registrosPorPagina > 100) {
      return Response.json(
        { error: 'registrosPorPagina deve estar entre 10 e 100' },
        { status: 400 }
      );
    }

    // Chamar API Advise com timeout
    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseUrl = Deno.env.get('ADVISE_API_URL') || 'https://api.advise.com.br';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 segundos timeout

    const response = await Promise.race([
      fetch(
        `${adviseUrl}/core/v1/intimacao/ConsultaFonteIntimacoes?registrosPorPagina=${registrosPorPagina}&paginaAtual=${paginaAtual}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${adviseToken}`,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        }
      ),
      new Promise((_, reject) => setTimeout(() => reject(new Error('API timeout')), 25000))
    ]).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(
        { error: errorData.message || 'Erro ao consultar Advise' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Salvar fontes no banco local para referência
    if (data.fontes && Array.isArray(data.fontes)) {
      for (const fonte of data.fontes) {
        try {
          const fonteExistente = await base44.entities.FonteIntimacao.filter({
            idFonte: fonte.idFonteXTipoPesquisa
          }).then(r => r[0]);

          if (!fonteExistente) {
            await base44.entities.FonteIntimacao.create({
              idFonte: fonte.idFonteXTipoPesquisa?.toString(),
              nomeFonte: fonte.nomeFonte || 'Fonte Desconhecida',
              descricao: fonte.descricao || '',
              ativa: true,
              ultimaSincronizacao: new Date().toISOString()
            });
          }
        } catch (err) {
          console.warn(`Erro ao salvar fonte ${fonte.nomeFonte}:`, err.message);
        }
      }
    }

    return Response.json({
      success: true,
      fontes: data.fontes || [],
      paginaAtual,
      registrosPorPagina,
      totalRegistros: data.totalRegistros || 0,
      totalPaginas: data.totalPaginas || 0
    });

  } catch (error) {
    console.error('Erro ao consultar fontes:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});