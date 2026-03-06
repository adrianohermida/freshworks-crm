/**
 * Utilitário para criar logs estruturados em SyncLog
 * Adiciona contexto completo: processoId, tribunal, etapa, fase
 */

export async function criarSyncLog(base44, dados) {
  const {
    processo_id,
    processo_numero,
    tribunal = 'desconhecido',
    usuario_email,
    tipo = 'manual',
    status = 'em_progresso',
    etapa = 'iniciado',
    fase = 'sincronizacao',
    movimento_total = 0,
    movimento_novos = 0,
    andamentos_criados = 0,
    tempo_execucao_ms = 0,
    dedup_count = 0,
    erro_code = null,
    erro_mensagem = null,
    retry_count = 0,
    retry_tentativa = 0,
  } = dados;

  // Valida campos obrigatórios
  if (!processo_id || !usuario_email) {
    throw new Error('processo_id e usuario_email são obrigatórios');
  }

  const syncLogData = {
    processo_id,
    processo_numero: processo_numero || 'N/A',
    timestamp: new Date().toISOString(),
    tipo,
    status,
    movimento_total,
    movimento_novos,
    andamentos_criados,
    tempo_execucao_ms,
    usuario_email,
    
    // Campos estruturados para auditoria
    tribunal,
    etapa,
    fase,
    dedup_count,
    erro_code,
    erro_mensagem,
    retry_count,
    retry_tentativa,
    
    // Metadados
    metadata: {
      ip: 'N/A',
      user_agent: 'base44-sync',
      timestamp_criacao: new Date().toISOString(),
    },
  };

  return await base44.asServiceRole.entities.SyncLog.create(syncLogData);
}

/**
 * Registra etapas da sincronização para auditoria
 */
export async function registrarEtapaSyncLog(base44, processId, etapa, status, detalhes = {}) {
  console.log(`[SyncLog] Processo: ${processId} | Etapa: ${etapa} | Status: ${status}`, detalhes);
  
  // Aqui poderia registrar em cache/queue se necessário para batching
}

/**
 * Finaliza log com resultado
 */
export async function finalizarSyncLog(base44, logData) {
  logData.tempo_execucao_ms = Date.now() - logData._startTime;
  logData.status = logData.erro_code ? 'erro' : 'sucesso';
  
  return await criarSyncLog(base44, logData);
}