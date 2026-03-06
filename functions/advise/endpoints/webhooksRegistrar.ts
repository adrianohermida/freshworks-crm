import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adviseToken = Deno.env.get('ADVISE_TOKEN');
    const adviseApiUrl = Deno.env.get('ADVISE_API_URL') || 'https://api.advise.com.br';
    const webhookUrl = Deno.env.get('WEBHOOK_URL') || 'https://api.base44.app/webhooks/advise';

    const {
      eventos = ['publicacao', 'intimacao', 'prazo', 'audiencia'],
      descricao = 'Webhook de sincronização em tempo real'
    } = await req.json();

    if (!eventos || eventos.length === 0) {
      return Response.json({
        success: false,
        error: 'eventos é obrigatório (array de eventos a monitorar)'
      }, { status: 400 });
    }

    // POST /webhooks/registrar - registra webhook
    const response = await fetch(`${adviseApiUrl}/webhooks/registrar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adviseToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: webhookUrl,
        eventos: eventos,
        descricao: descricao,
        ativo: true,
        retornarPayload: true
      })
    });

    if (!response.ok) {
      throw new Error(`Advise API error: ${response.statusText}`);
    }

    const webhookData = await response.json();

    // Armazenar configuração de webhook no banco
    const configExistente = await base44.entities.AdviseConfig.filter({});
    
    if (configExistente.length > 0) {
      await base44.entities.AdviseConfig.update(configExistente[0].id, {
        webhookRegistrado: true,
        webhookId: webhookData.id,
        webhookAtivo: true,
        ultimaSincronizacao: new Date().toISOString()
      });
    }

    return Response.json({
      success: true,
      action: 'webhooks.registrar',
      data: {
        webhookId: webhookData.id,
        url: webhookUrl,
        eventos: eventos,
        ativo: webhookData.ativo === true,
        descricao: descricao,
        dataRegistro: new Date().toISOString(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});