import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get Advise config
    const configs = await base44.entities.AdviseConfig.filter({ ativa: true });
    
    if (configs.length === 0) {
      return Response.json(
        { error: 'Integração Advise não configurada' },
        { status: 400 }
      );
    }

    const config = configs[0];

    // Fetch sources from Advise API
    const response = await fetch(
      `${config.adviseApiUrl}/core/v1/intimacao/ConsultaFonteIntimacoes?RegistrosPorPagina=100&PaginaAtual=1`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.adviseApiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: `Erro ao consultar fontes: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Save/update sources in local database
    if (data && Array.isArray(data)) {
      for (const fonte of data) {
        const existentes = await base44.entities.FonteIntimacao.filter({
          idFonte: fonte.id || fonte.idFonteIntimacao
        });

        if (existentes.length === 0) {
          await base44.entities.FonteIntimacao.create({
            idFonte: fonte.id || fonte.idFonteIntimacao,
            nomeFonte: fonte.nome || fonte.nomeFonte,
            descricao: fonte.descricao || '',
            ativa: true,
            ultimaSincronizacao: new Date().toISOString()
          });
        } else {
          await base44.entities.FonteIntimacao.update(existentes[0].id, {
            ultimaSincronizacao: new Date().toISOString()
          });
        }
      }
    }

    return Response.json({
      success: true,
      message: 'Fontes de intimações sincronizadas',
      fontes: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao consultar fontes:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});