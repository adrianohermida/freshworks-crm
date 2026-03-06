import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { TRIBUNAIS, getTribunalByAlias } from './utils/tribunaisData.js';

/**
 * Fetch processo DataJud com suporte a múltiplos tribunais
 * Suporta busca por CNJ ou tribunal específico
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { cnj_number, tribunal_alias } = body;

    if (!cnj_number) {
      return Response.json({ error: 'cnj_number é obrigatório' }, { status: 400 });
    }

    // Obter tribunal padrão do usuário
    let tribunalConfig = null;
    if (tribunal_alias) {
      tribunalConfig = getTribunalByAlias(tribunal_alias);
    } else {
      // Buscar config padrão do usuário
      const configs = await base44.entities.TribunalConfig.filter(
        { user_id: user.email, ativo: true },
        null,
        1
      );
      if (configs && configs.length > 0) {
        tribunalConfig = getTribunalByAlias(configs[0].tribunal_alias);
      }
    }

    // Fallback: usar TJSP como padrão
    if (!tribunalConfig) {
      tribunalConfig = getTribunalByAlias('tjsp');
    }

    // Buscar processo
    const response = await fetch(tribunalConfig.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('DATAJUD_API_KEY')}`
      },
      body: JSON.stringify({
        query: {
          match: {
            numeroProcesso: cnj_number
          }
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Erro ao consultar tribunal ${tribunalConfig.alias}:`, error);
      return Response.json(
        { error: `Tribunal ${tribunalConfig.nome} indisponível` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Processar resposta
    const processes = data.hits?.hits || [];
    if (processes.length === 0) {
      return Response.json({ error: 'Processo não encontrado' }, { status: 404 });
    }

    const processo = processes[0]._source;

    return Response.json({
      id: `${tribunalConfig.alias}_${processo.numeroProcesso}`,
      cnj_number: processo.numeroProcesso,
      title: processo.assunto || 'Sem título',
      status: 'active',
      tribunal_alias: tribunalConfig.alias,
      tribunal_nome: tribunalConfig.nome,
      tribunal_categoria: tribunalConfig.categoria,
      synced_at: new Date().toISOString(),
      datajud_data: processo,
      movement_count: processo.movimentos?.length || 0,
      last_movement_date: processo.movimentos?.[0]?.dataMovimento
    });
  } catch (error) {
    console.error('[datajudFetchProcessoMultiTribunal] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});