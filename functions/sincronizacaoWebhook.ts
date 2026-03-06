import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Webhook para sincronizações
 * Captura eventos de sincronização e registra status
 * POST /webhook/sync com { processo_id, tipo, status, dados }
 */

Deno.serve(async (req) => {
  try {
    // Validar método
    if (req.method !== 'POST') {
      return Response.json({ error: 'Método não permitido' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { processo_id, tipo, status, total_movimentos, total_novos, total_duplicatas, tempo_ms, erro } = body;

    // Validar campos obrigatórios
    if (!processo_id || !tipo || !status) {
      return Response.json({
        error: 'Campos obrigatórios: processo_id, tipo, status'
      }, { status: 400 });
    }

    // Salvar registro de sincronização
    const sincSync = await base44.entities.TPUSincronizacao.create({
      processo_id,
      tipo,
      status,
      total_movimentos_sincronizados: total_movimentos || 0,
      total_novos: total_novos || 0,
      total_duplicatas: total_duplicatas || 0,
      data_sincronizacao: new Date().toISOString(),
      tempo_execucao_ms: tempo_ms || 0,
      mensagem_erro: erro || null
    });

    // Registrar evento de analytics
    try {
      await base44.entities.Analytics.create({
        user_id: 'sistema',
        event_type: 'process_synced',
        entity_type: 'process',
        entity_id: processo_id,
        action: `Sincronização ${tipo} - ${status}`,
        timestamp: new Date().toISOString(),
        status: status === 'sucesso' ? 'success' : status === 'erro' ? 'error' : 'pending',
        metadata: {
          tipo_sincronizacao: tipo,
          movimentos: total_movimentos,
          novos: total_novos,
          duplicatas: total_duplicatas,
          tempo_ms: tempo_ms
        }
      });
    } catch (analyticsError) {
      console.warn('Erro ao registrar analytics:', analyticsError.message);
    }

    return Response.json({
      success: true,
      sincronizacao_id: sincSync.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[sincronizacaoWebhook] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});