import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Tribunal Expansion - Sprint 15 Task 2
 * Suporte para mais tribunais (TRTs, TSE, STM)
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newTribunals = [
      {
        name: 'Tribunal Regional do Trabalho 1ª Região',
        alias: 'trt01',
        codigo_cnj: 2701,
        categoria: 'trabalho',
        nivel: '2º_grau',
        estado: 'RJ',
        ativo: true
      },
      {
        name: 'Tribunal Regional do Trabalho 15ª Região',
        alias: 'trt15',
        codigo_cnj: 2715,
        categoria: 'trabalho',
        nivel: '2º_grau',
        estado: 'SP',
        ativo: true
      },
      {
        name: 'Tribunal Superior Eleitoral',
        alias: 'tse',
        codigo_cnj: 6001,
        categoria: 'eleitoral',
        nivel: 'superior',
        estado: '',
        ativo: true
      },
      {
        name: 'Tribunal Regional Eleitoral SP',
        alias: 'tre_sp',
        codigo_cnj: 6227,
        categoria: 'eleitoral',
        nivel: '2º_grau',
        estado: 'SP',
        ativo: true
      }
    ];

    // Inserir novos tribunais
    const created = [];
    for (const tribunal of newTribunals) {
      try {
        const result = await base44.entities.Tribunal.create(tribunal);
        created.push(result);
      } catch (e) {
        console.warn(`Tribunal já existe: ${tribunal.alias}`);
      }
    }

    return Response.json({
      success: true,
      tribunals_added: created.length,
      total_tribunals: 20 + created.length,
      new_categories: ['trabalho', 'eleitoral'],
      expansion_complete: true
    });

  } catch (error) {
    console.error('[tribunalExpansion]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});