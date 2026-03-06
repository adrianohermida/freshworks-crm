import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { deviceToken, titulo, mensagem, dados = {}, linkAcao } = await req.json();

    if (!deviceToken || !titulo || !mensagem) {
      return Response.json({
        success: false,
        error: 'deviceToken, titulo e mensagem são obrigatórios'
      }, { status: 400 });
    }

    // Send push via FCM
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
      body: JSON.stringify({
        to: deviceToken,
        notification: {
          title: titulo,
          body: mensagem,
          icon: 'icon',
          click_action: linkAcao || 'FLUTTER_NOTIFICATION_CLICK'
        },
        data: {
          ...dados,
          timestamp: new Date().toISOString()
        }
      })
    });

    if (!fcmResponse.ok) {
      const error = await fcmResponse.json();
      return Response.json({
        success: false,
        error: `FCM API error: ${error.error || 'Failed to send push'}`
      }, { status: fcmResponse.status });
    }

    const pushData = await fcmResponse.json();

    // Store notification record
    const notificacao = {
      titulo,
      mensagem,
      tipo: 'push',
      destinatario: deviceToken,
      status: pushData.success ? 'entregue' : 'falhou',
      dataCriacao: new Date().toISOString(),
      dataEnvio: new Date().toISOString(),
      prioridade: 'normal',
      linkAcao,
      metadados: {
        fcmMessageId: pushData.message_id,
        dados
      }
    };

    try {
      await base44.entities.Notificacao.create(notificacao);
    } catch (e) {
      console.log('Notificacao entity not available');
    }

    // Audit log
    await base44.functions.invoke('security/auditLog', {
      acao: 'enviarPush',
      entidade: 'Notificacao',
      resultado: pushData.success ? 'success' : 'failure',
      metadados: { deviceToken, fcmMessageId: pushData.message_id }
    });

    return Response.json({
      success: pushData.success === 1,
      action: 'notificacoes.enviarPush',
      data: {
        deviceToken,
        titulo,
        status: pushData.success ? 'entregue' : 'falhou',
        dataEnvio: new Date().toISOString(),
        fcmMessageId: pushData.message_id,
        message: `Push notification ${pushData.success ? 'enviada' : 'falhou'}`
      }
    });
  } catch (error) {
    console.error('EnviarPush error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});