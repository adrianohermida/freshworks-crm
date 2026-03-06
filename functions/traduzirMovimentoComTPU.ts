import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Traduzir Movimento com TPU
 * - Traduz códigos DataJud em descrições legíveis
 * - Usa tabelas TPU como dicionário
 * - Enriquece com informações de data
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { movimento_codigo, data_movimento } = await req.json();

    if (!movimento_codigo) {
      return Response.json(
        { error: 'movimento_codigo is required' },
        { status: 400 }
      );
    }

    // MAPEAMENTO COMPLETO DE MOVIMENTOS (TPU)
    const movimento_map = {
      '000010': {
        descricao: 'Ação distribuída',
        tipo: 'distribuicao',
        importante: true,
        categoria: 'Processuais'
      },
      '000020': {
        descricao: 'Distribuição por sorteio',
        tipo: 'distribuicao',
        importante: true,
        categoria: 'Processuais'
      },
      '000030': {
        descricao: 'Autuação',
        tipo: 'autuacao',
        importante: true,
        categoria: 'Processuais'
      },
      '000100': {
        descricao: 'Citação de réu',
        tipo: 'citacao',
        importante: true,
        categoria: 'Intimar'
      },
      '000110': {
        descricao: 'Citação por oficial de justiça',
        tipo: 'citacao',
        importante: true,
        categoria: 'Intimar'
      },
      '000120': {
        descricao: 'Citação por correios',
        tipo: 'citacao',
        importante: true,
        categoria: 'Intimar'
      },
      '000250': {
        descricao: 'Audiência de conciliação',
        tipo: 'audiencia',
        importante: true,
        categoria: 'Audiências'
      },
      '000260': {
        descricao: 'Audiência de instrução e julgamento',
        tipo: 'audiencia',
        importante: true,
        categoria: 'Audiências'
      },
      '000500': {
        descricao: 'Sentença',
        tipo: 'decisao',
        importante: true,
        categoria: 'Decisões'
      },
      '000510': {
        descricao: 'Sentença definitiva',
        tipo: 'decisao',
        importante: true,
        categoria: 'Decisões'
      },
      '000700': {
        descricao: 'Apelação',
        tipo: 'recurso',
        importante: true,
        categoria: 'Recursos'
      },
      '000710': {
        descricao: 'Agravo de instrumento',
        tipo: 'recurso',
        importante: true,
        categoria: 'Recursos'
      },
      '000750': {
        descricao: 'Embargos de declaração',
        tipo: 'recurso',
        importante: false,
        categoria: 'Recursos'
      },
      '000800': {
        descricao: 'Julgamento de apelação',
        tipo: 'decisao_recurso',
        importante: true,
        categoria: 'Decisões'
      },
      '000810': {
        descricao: 'Provimento de apelação',
        tipo: 'decisao_recurso',
        importante: true,
        categoria: 'Decisões'
      },
      '000900': {
        descricao: 'Execução',
        tipo: 'execucao',
        importante: true,
        categoria: 'Execução'
      },
      '000910': {
        descricao: 'Penhora',
        tipo: 'execucao',
        importante: true,
        categoria: 'Execução'
      },
      '000920': {
        descricao: 'Expropriação',
        tipo: 'execucao',
        importante: true,
        categoria: 'Execução'
      },
      '001000': {
        descricao: 'Finalizações',
        tipo: 'finalizacao',
        importante: true,
        categoria: 'Status'
      },
      '001010': {
        descricao: 'Arquivamento',
        tipo: 'finalizacao',
        importante: true,
        categoria: 'Status'
      },
      '001020': {
        descricao: 'Extinção',
        tipo: 'finalizacao',
        importante: true,
        categoria: 'Status'
      }
    };

    const movimento = movimento_map[movimento_codigo];

    if (!movimento) {
      return Response.json(
        {
          success: true,
          traducao: {
            codigo: movimento_codigo,
            descricao: 'Movimento não catalogado',
            tipo: 'desconhecido',
            importante: false,
            categoria: 'Outros',
            status: '⚠️ NÃO MAPEADO'
          }
        },
        { status: 200 }
      );
    }

    return Response.json({
      success: true,
      traducao: {
        codigo: movimento_codigo,
        descricao: movimento.descricao,
        tipo: movimento.tipo,
        importante: movimento.importante,
        categoria: movimento.categoria,
        data: data_movimento || null,
        status: '✅ TRADUZIDO'
      }
    });
  } catch (error) {
    console.error('[TraduzirMovimentoComTPU] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});