import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Popula banco com todos os endpoints dos tribunais
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    const courts = [
      // TRIBUNAIS SUPERIORES
      { name: 'Tribunal Superior do Trabalho', alias: 'tst', category: 'superior', level: 'superior', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_tst/_search' },
      { name: 'Tribunal Superior Eleitoral', alias: 'tse', category: 'superior', level: 'superior', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_tse/_search' },
      { name: 'Tribunal Superior de Justiça', alias: 'stj', category: 'superior', level: 'superior', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_stj/_search' },
      { name: 'Tribunal Superior Militar', alias: 'stm', category: 'superior', level: 'superior', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_stm/_search' },

      // JUSTIÇA FEDERAL
      { name: 'Tribunal Regional Federal da 1ª Região', alias: 'trf1', category: 'federal', level: '2º_grau', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf1/_search' },
      { name: 'Tribunal Regional Federal da 2ª Região', alias: 'trf2', category: 'federal', level: '2º_grau', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf2/_search' },
      { name: 'Tribunal Regional Federal da 3ª Região', alias: 'trf3', category: 'federal', level: '2º_grau', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf3/_search' },
      { name: 'Tribunal Regional Federal da 4ª Região', alias: 'trf4', category: 'federal', level: '2º_grau', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf4/_search' },
      { name: 'Tribunal Regional Federal da 5ª Região', alias: 'trf5', category: 'federal', level: '2º_grau', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf5/_search' },
      { name: 'Tribunal Regional Federal da 6ª Região', alias: 'trf6', category: 'federal', level: '2º_grau', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf6/_search' },

      // JUSTIÇA ESTADUAL (SELEÇÃO - AC, SP, RJ, MG, BA, RS)
      { name: 'Tribunal de Justiça do Acre', alias: 'tjac', category: 'estadual', level: '2º_grau', state: 'AC', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjac/_search' },
      { name: 'Tribunal de Justiça do Amazonas', alias: 'tjam', category: 'estadual', level: '2º_grau', state: 'AM', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjam/_search' },
      { name: 'Tribunal de Justiça da Bahia', alias: 'tjba', category: 'estadual', level: '2º_grau', state: 'BA', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjba/_search' },
      { name: 'Tribunal de Justiça de Minas Gerais', alias: 'tjmg', category: 'estadual', level: '2º_grau', state: 'MG', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjmg/_search' },
      { name: 'Tribunal de Justiça do Pará', alias: 'tjpa', category: 'estadual', level: '2º_grau', state: 'PA', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjpa/_search' },
      { name: 'Tribunal de Justiça do Paraná', alias: 'tjpr', category: 'estadual', level: '2º_grau', state: 'PR', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjpr/_search' },
      { name: 'Tribunal de Justiça do Rio de Janeiro', alias: 'tjrj', category: 'estadual', level: '2º_grau', state: 'RJ', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjrj/_search' },
      { name: 'Tribunal de Justiça do Rio Grande do Sul', alias: 'tjrs', category: 'estadual', level: '2º_grau', state: 'RS', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjrs/_search' },
      { name: 'Tribunal de Justiça de São Paulo', alias: 'tjsp', category: 'estadual', level: '2º_grau', state: 'SP', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjsp/_search' },

      // JUSTIÇA DO TRABALHO (SELEÇÃO)
      { name: 'Tribunal Regional do Trabalho da 1ª Região', alias: 'trt1', category: 'trabalho', level: '2º_grau', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt1/_search' },
      { name: 'Tribunal Regional do Trabalho da 2ª Região', alias: 'trt2', category: 'trabalho', level: '2º_grau', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt2/_search' },
      { name: 'Tribunal Regional do Trabalho da 3ª Região', alias: 'trt3', category: 'trabalho', level: '2º_grau', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt3/_search' },
      { name: 'Tribunal Regional do Trabalho da 9ª Região', alias: 'trt9', category: 'trabalho', level: '2º_grau', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt9/_search' },
      { name: 'Tribunal Regional do Trabalho da 15ª Região', alias: 'trt15', category: 'trabalho', level: '2º_grau', endpoint: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt15/_search' },
    ];

    let created = 0;
    let skipped = 0;

    for (const court of courts) {
      const existing = await base44.entities.Court.filter(
        { alias: court.alias },
        null,
        1
      );

      if (existing.length === 0) {
        await base44.entities.Court.create(court);
        created++;
      } else {
        skipped++;
      }
    }

    return Response.json({
      message: `Tribunais carregados: ${created} criados, ${skipped} já existentes`,
      created,
      skipped,
      total: courts.length
    });
  } catch (error) {
    console.error('[SeedCourtEndpoints] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});