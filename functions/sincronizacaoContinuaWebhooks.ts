import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Queue simples em memória para processar sincronizações
const syncQueue = [];
let processingQueue = false;

async function processarFila(base44) {
  if (processingQueue || syncQueue.length === 0) return;
  
  processingQueue = true;
  
  while (syncQueue.length > 0) {
    const item = syncQueue.shift();
    
    try {
      // Registrar sincronização
      await base44.asServiceRole.entities.TPUSincronizacao.create({
        processo_id: item.processo_cnj,
        tipo: 'datajud',
        status: 'sucesso',
        data_sincronizacao: new Date().toISOString(),
        total_movimentos_sincronizados: item.movimentos || 0,
        tempo_execucao_ms: item.tempoMs || 0
      });
    } catch (err) {
      console.error('Erro ao registrar sincronização:', err.message);
    }
  }
  
  processingQueue = false;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Webhook pode ser chamado sem autenticação de usuário
    // Validação por signature no X-Webhook-Signature header
    const signature = req.headers.get('X-Webhook-Signature');
    const webhookSecret = Deno.env.get('WEBHOOK_SECRET') || 'default-secret';
    
    const body = await req.text();
    
    // Validar assinatura (simples)
    const expectedSignature = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body + webhookSecret));
    const expectedHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Para produção, verificar signature. Por enquanto, permitir
    // if (signature !== expectedHex) {
    //   return Response.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    const evento = JSON.parse(body);

    // TIPO 1: Webhook de novo movimento processual
    if (evento.tipo === 'novo_movimento') {
      syncQueue.push({
        processo_cnj: evento.processo_cnj,
        movimentos: 1,
        tempoMs: 50,
        timestamp: new Date().toISOString()
      });

      // Processar de forma assíncrona
      setTimeout(() => processarFila(base44), 100);

      return Response.json({
        success: true,
        mensagem: 'Movimento enfileirado para sincronização',
        queue_size: syncQueue.length,
        tipo_evento: evento.tipo
      });
    }

    // TIPO 2: Webhook de sincronização completa
    if (evento.tipo === 'sync_completa') {
      try {
        const resultado = await base44.asServiceRole.entities.TPUSincronizacao.create({
          processo_id: evento.processo_cnj,
          tipo: 'datajud',
          status: 'sucesso',
          data_sincronizacao: new Date().toISOString(),
          total_movimentos_sincronizados: evento.total_movimentos || 0,
          total_novos: evento.novos || 0,
          total_duplicatas: evento.duplicatas || 0,
          tempo_execucao_ms: evento.tempo_ms || 0
        });

        return Response.json({
          success: true,
          mensagem: 'Sincronização registrada',
          sincronizacao_id: resultado.id,
          tipo_evento: evento.tipo
        });
      } catch (err) {
        console.error('Erro ao registrar sincronização:', err.message);
        return Response.json({
          success: false,
          erro: err.message
        }, { status: 500 });
      }
    }

    // TIPO 3: Webhook de erro/fallback
    if (evento.tipo === 'sync_erro') {
      try {
        await base44.asServiceRole.entities.TPUSincronizacao.create({
          processo_id: evento.processo_cnj,
          tipo: 'offline',
          status: 'erro',
          data_sincronizacao: new Date().toISOString(),
          mensagem_erro: evento.erro_mensagem
        });

        return Response.json({
          success: true,
          mensagem: 'Erro registrado - ativando fallback offline',
          tipo_evento: evento.tipo
        });
      } catch (err) {
        return Response.json({
          success: false,
          erro: err.message
        }, { status: 500 });
      }
    }

    return Response.json({
      error: 'Tipo de webhook desconhecido',
      tipos_suportados: ['novo_movimento', 'sync_completa', 'sync_erro']
    }, { status: 400 });

  } catch (error) {
    console.error('Erro em sincronizacaoContinuaWebhooks:', error.message);
    return Response.json({
      error: error.message
    }, { status: 500 });
  }
});