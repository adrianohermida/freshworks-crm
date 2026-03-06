import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin users can register webhooks
    if (user.role !== 'admin') {
      return Response.json({
        success: false,
        error: 'Forbidden: Admin access required'
      }, { status: 403 });
    }

    const { url, eventos = [], nome, descricao } = await req.json();

    if (!url) {
      return Response.json({
        success: false,
        error: 'url é obrigatória'
      }, { status: 400 });
    }

    if (eventos.length === 0) {
      return Response.json({
        success: false,
        error: 'eventos é obrigatório (array com pelo menos 1 evento)'
      }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      return Response.json({
        success: false,
        error: 'URL inválida'
      }, { status: 400 });
    }

    // Validate webhook by sending test request
    const testResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Test': 'true'
      },
      body: JSON.stringify({
        evento: 'teste',
        timestamp: new Date().toISOString(),
        mensagem: 'Webhook validation test'
      })
    }).catch(e => {
      throw new Error(`Webhook URL unreachable: ${e.message}`);
    });

    if (!testResponse.ok && testResponse.status !== 200) {
      return Response.json({
        success: false,
        error: `Webhook validation failed: HTTP ${testResponse.status}`
      }, { status: 400 });
    }

    // Store webhook configuration
    const webhook = {
      nome: nome || `Webhook ${eventos[0]}`,
      descricao,
      url,
      eventos,
      ativa: true,
      dataCriacao: new Date().toISOString(),
      ultimaTentativa: null,
      statusUltimaTentativa: null,
      usuarioAdmin: user.email,
      tentativas: 0,
      ultimoErro: null
    };

    let webhookId = null;
    try {
      const created = await base44.entities.Webhook?.create(webhook);
      webhookId = created?.id;
    } catch (e) {
      console.log('Webhook entity not available');
    }

    // Audit log
    await base44.functions.invoke('security/auditLog', {
      acao: 'registrarWebhook',
      entidade: 'Webhook',
      resultado: 'success',
      metadados: { url, eventos, webhookId }
    });

    return Response.json({
      success: true,
      action: 'notificacoes.registrarWebhook',
      data: {
        webhookId,
        nome: webhook.nome,
        url,
        eventos,
        status: 'ativa',
        dataCriacao: webhook.dataCriacao,
        message: `Webhook registrado com sucesso para eventos: ${eventos.join(', ')}`
      }
    });
  } catch (error) {
    console.error('RegistrarWebhook error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});