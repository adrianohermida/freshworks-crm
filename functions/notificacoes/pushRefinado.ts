import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { deviceToken, titulo, mensagem, tipo = 'default', dados = {}, imagem, acoes = [] } = await req.json();

    if (!deviceToken || !titulo || !mensagem) {
      return Response.json({
        success: false,
        error: 'deviceToken, titulo e mensagem são obrigatórios'
      }, { status: 400 });
    }

    // Rich notification options
    const notificacao = {
      to: deviceToken,
      notification: {
        title: titulo,
        body: mensagem,
        icon: 'icon',
        image: imagem || undefined,
        click_action: 'FLUTTER_NOTIFICATION_CLICK'
      },
      data: {
        tipo,
        ...dados,
        timestamp: new Date().toISOString()
      }
    };

    // Add custom actions for rich notifications
    if (acoes.length > 0) {
      notificacao.data.acoes = JSON.stringify(acoes);
    }

    // Send via FCM
    const fcmServerKey = Deno.env.get('FCM_SERVER_KEY');
    
    if (!fcmServerKey) {
      return Response.json({
        success: false,
        error: 'FCM_SERVER_KEY not configured'
      }, { status: 500 });
    }

    const fcmResponse = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `key=${fcmServerKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notificacao)
    });

    if (!fcmResponse.ok) {
      const error = await fcmResponse.json();
      return Response.json({
        success: false,
        error: `FCM error: ${error.error || 'Unknown error'}`
      }, { status: fcmResponse.status });
    }

    const pushData = await fcmResponse.json();

    // Store notification record
    const pushRegistro = {
      deviceToken,
      titulo,
      mensagem,
      tipo,
      status: pushData.success ? 'entregue' : 'falhou',
      dataCriacao: new Date().toISOString(),
      dataEnvio: new Date().toISOString(),
      fcmMessageId: pushData.message_id,
      temImagem: !!imagem,
      temAcoes: acoes.length > 0,
      metadados: dados
    };

    try {
      await base44.entities.PushNotificacao?.create(pushRegistro);
    } catch (e) {
      console.log('PushNotificacao entity not available');
    }

    return Response.json({
      success: pushData.success === 1,
      action: 'notificacoes.pushRefinado',
      data: {
        deviceToken: deviceToken.substring(0, 20) + '...',
        titulo,
        tipo,
        status: pushData.success ? 'entregue' : 'falhou',
        temImagem: !!imagem,
        temAcoes: acoes.length > 0,
        fcmMessageId: pushData.message_id,
        dataEnvio: pushRegistro.dataEnvio,
        message: `Push ${tipo} ${pushData.success ? 'entregue' : 'falhou'}`
      }
    });
  } catch (error) {
    console.error('PushRefinado error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});