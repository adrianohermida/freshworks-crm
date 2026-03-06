import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseApiUrl = Deno.env.get('ADVISE_API_URL') || 'https://api.advise.com.br';

    // GET /fontes/intimacoes - listar fontes de intimação
    const response = await fetch(`${adviseApiUrl}/core/v1/fontes/intimacoes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adviseToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Advise API error: ${response.statusText}`);
    }

    const fontes = await response.json();

    // Sincronizar com banco de dados
    for (const fonte of fontes) {
      const existente = await base44.entities.FonteIntimacao.filter({
        idFonte: fonte.id
      });

      if (existente.length === 0) {
        await base44.entities.FonteIntimacao.create({
          idFonte: fonte.id,
          nomeFonte: fonte.nome,
          descricao: fonte.descricao || '',
          ativa: fonte.ativa !== false,
          ultimaSincronizacao: new Date().toISOString()
        });
      } else {
        await base44.entities.FonteIntimacao.update(existente[0].id, {
          nomeFonte: fonte.nome,
          descricao: fonte.descricao || '',
          ativa: fonte.ativa !== false,
          ultimaSincronizacao: new Date().toISOString()
        });
      }
    }

    return Response.json({
      success: true,
      action: 'fontes.listar',
      data: {
        fontes: fontes,
        totalFontes: fontes.length,
        sincronizadas: fontes.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});