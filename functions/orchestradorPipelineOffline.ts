/**
 * Orchestrador do Pipeline Offline - Integra parser, deduplicação e enriquecimento
 * Gerencia o fluxo completo de processamento local
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Pipeline Orchestration - Executa etapas sequenciais com fallback
 */
async function executarPipeline(base44, processo, andamentos) {
  const logs = [];
  const resultado = {
    processo_id: processo.id,
    etapas: {},
    tempo_total_ms: 0,
    sucesso: false
  };

  const inicio = Date.now();

  try {
    // ETAPA 1: Parse CNJ
    logs.push('▶️ [1/4] Iniciando parse CNJ...');
    const parseResult = await invocarFuncao(base44, 'parseProcessoCNJ', {
      cnj_number: processo.cnj_number
    });
    resultado.etapas.parse_cnj = parseResult.data;
    logs.push(`✅ [1/4] Parse concluído: ${parseResult.data.numeroFormatado}`);

    // ETAPA 2: Deduplicação
    logs.push('▶️ [2/4] Iniciando deduplicação...');
    const deduplicaResult = await invocarFuncao(base44, 'deduplicadorAndamentos', {
      andamentos: andamentos,
      remover_duplicatas: true
    });
    resultado.etapas.deduplicacao = deduplicaResult.data.estatisticas;
    logs.push(`✅ [2/4] Deduplicação: ${deduplicaResult.data.estatisticas.duplicatas_removidas} removidas`);

    // ETAPA 3: Enriquecimento TPU
    logs.push('▶️ [3/4] Iniciando enriquecimento TPU...');
    const enriquecimentoResult = await invocarFuncao(base44, 'enriquecerComTPU', {
      processo: processo,
      andamentos: deduplicaResult.data.andamentos
    });
    resultado.etapas.enriquecimento = enriquecimentoResult.data.enriquecimento;
    logs.push(`✅ [3/4] Enriquecimento: ${enriquecimentoResult.data.estatisticas.movimentos_com_tpu}/${enriquecimentoResult.data.estatisticas.total_movimentos} movimentos mapeados`);

    // ETAPA 4: Validação LGPD
    logs.push('▶️ [4/4] Iniciando validação LGPD...');
    const lgpdResult = await invocarFuncao(base44, 'validacaoLGPDOffline', {
      operacao: 'mascarar_pii',
      dados: {
        numero_processo: processo.cnj_number,
        orgao_julgador: processo.orgao_julgador
      }
    });
    resultado.etapas.lgpd_validation = lgpdResult.data.audit_log;
    logs.push(`✅ [4/4] LGPD validado: PII mascarado`);

    resultado.sucesso = true;
    resultado.tempo_total_ms = Date.now() - inicio;

  } catch (error) {
    logs.push(`❌ ERRO: ${error.message}`);
    resultado.erro = error.message;
    resultado.tempo_total_ms = Date.now() - inicio;
  }

  return { resultado, logs };
}

/**
 * Helper para invocar funções backend
 */
async function invocarFuncao(base44, funcaoNome, params) {
  return await base44.functions.invoke(funcaoNome, params);
}

/**
 * Batch Processing - Processa lotes de 1000 movimentos
 */
function dividirEmLotes(andamentos, tamanhoLote = 1000) {
  const lotes = [];
  for (let i = 0; i < andamentos.length; i += tamanhoLote) {
    lotes.push(andamentos.slice(i, i + tamanhoLote));
  }
  return lotes;
}

/**
 * Backend function
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { processo, andamentos } = body;

    if (!processo) {
      return Response.json({ error: 'processo é obrigatório' }, { status: 400 });
    }

    // Dividir em lotes se necessário
    const lotes = dividirEmLotes(andamentos || [], 1000);
    const resultadosLotes = [];

    for (let i = 0; i < lotes.length; i++) {
      const { resultado, logs } = await executarPipeline(base44, processo, lotes[i]);
      resultadosLotes.push({ lote: i + 1, resultado, logs });
    }

    return Response.json({
      usuario: user.email,
      processo_id: processo.id,
      total_lotes: resultadosLotes.length,
      lotes: resultadosLotes,
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error) {
    console.error('[orchestradorPipelineOffline] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});