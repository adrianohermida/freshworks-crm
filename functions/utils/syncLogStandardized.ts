/**
 * syncLogStandardized.js - Funções padronizadas de logging para sincronizações
 * 
 * Garante estrutura consistente em SyncLog com:
 * - etapa, status, erro_code, tempo_execucao_ms
 * - enriquecimento flags (tpu, juizo, foro_tjsp)
 * - metadata com IP, user_agent, timestamp
 */

export function criarLogInicial(processoId, numeroProcesso, tipo, usuarioEmail) {
  return {
    processo_id: processoId,
    processo_numero: numeroProcesso,
    timestamp: new Date().toISOString(),
    tipo, // 'manual' | 'agendada'
    status: 'sucesso', // default, pode ser sobrescrito
    etapa: 'iniciado',
    usuario_email: usuarioEmail,
    tempo_execucao_ms: 0,
    movimento_total: 0,
    movimento_novos: 0,
    andamentos_criados: 0,
    dedup_count: 0,
    retry_count: 0,
    retry_tentativa: 0,
    enriquecimento_tpu: false,
    enriquecimento_juizo: false,
    enriquecimento_foro_tjsp: false,
    metadata: {
      timestamp_criacao: new Date().toISOString(),
    }
  };
}

export async function criarSyncLog(base44, logData) {
  try {
    return await base44.asServiceRole.entities.SyncLog.create({
      ...logData,
      timestamp: logData.timestamp || new Date().toISOString(),
    });
  } catch (err) {
    console.error('[SyncLog] Erro ao criar log:', err.message);
    throw err;
  }
}

export async function atualizarProcessoSincro(base44, processoId, syncData) {
  try {
    return await base44.entities.ProcessoCEJUSC.update(processoId, syncData);
  } catch (err) {
    console.error('[ProcessoCEJUSC] Erro ao atualizar sincro:', err.message);
    throw err;
  }
}

export function calcularProximaTentativa(tentativaNumero) {
  // Backoff exponencial: 5s, 10s, 20s, 40s, 80s
  const baseMs = 5000;
  const delayMs = Math.pow(2, tentativaNumero) * baseMs;
  const maxDelayMs = 80000;
  const finalDelayMs = Math.min(delayMs, maxDelayMs);
  
  const proximaTentativa = new Date(Date.now() + finalDelayMs);
  return proximaTentativa.toISOString();
}

export function estruturarErroLog(erro, etapa, errorCode) {
  return {
    etapa,
    status: 'erro',
    erro_code: errorCode || 'ERRO_DESCONHECIDO',
    erro_mensagem: erro.message || String(erro),
  };
}