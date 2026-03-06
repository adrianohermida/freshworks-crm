import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Enriquece órgão julgador com dados de JuizoCNJ
 * Busca por código e retorna nome, tribunal, municipio
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { codigoOrgaoJulgador } = await req.json();

    if (!codigoOrgaoJulgador) {
      return Response.json({ 
        status: 'erro',
        error: 'codigoOrgaoJulgador obrigatório' 
      }, { status: 400 });
    }

    try {
      // Busca por código numérico ou código_origem (string)
      let juizos = await base44.entities.JuizoCNJ.filter(
        { codigo: Number(codigoOrgaoJulgador) },
        null,
        1
      );

      // Fallback: buscar por codigo_origem
      if (!juizos || juizos.length === 0) {
        juizos = await base44.entities.JuizoCNJ.filter(
          { codigo_origem: String(codigoOrgaoJulgador) },
          null,
          1
        );
      }
      
      if (juizos && juizos.length > 0) {
        const juizo = juizos[0];
        return Response.json({
          status: 'sucesso',
          enriquecimento: {
            codigo_orgao_julgador: juizo.codigo || juizo.codigo_origem,
            orgao_julgador: juizo.nome || juizo.nome_serventia,
            nome_serventia: juizo.nome_serventia,
            numero_serventia: juizo.numero_serventia,
            tribunal: juizo.tribunal,
            uf: juizo.uf,
            municipio: juizo.municipio,
            grau: juizo.grau,
            tipo_unidade: juizo.tipo_unidade,
            classificacao: juizo.classificacao,
            juizo_100_digital: juizo.juizo_100_digital,
          },
        });
      }

      return Response.json({
        status: 'nao_encontrado',
        enriquecimento: {},
      });

    } catch (e) {
      console.warn('Erro ao buscar JuizoCNJ:', e.message);
      return Response.json({
        status: 'erro',
        error: e.message,
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erro em enriquecerComJuizoCNJ:', error);
    return Response.json({
      status: 'erro',
      error: error.message,
    }, { status: 500 });
  }
});