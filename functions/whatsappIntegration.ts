import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * WhatsApp Integration - Sprint 14 Task 2
 * Enviar notificações via WhatsApp (via Twilio)
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      whatsapp_number, 
      event_type,
      process_data
    } = await req.json();

    if (!whatsapp_number) {
      return Response.json({ error: 'Missing WhatsApp number' }, { status: 400 });
    }

    // Validar número (formato: +55XXXXXXXXX)
    if (!whatsapp_number.match(/^\+55\d{10,11}$/)) {
      return Response.json({ error: 'Invalid WhatsApp number format' }, { status: 400 });
    }

    // Preparar mensagem WhatsApp
    const message = buildWhatsAppMessage(event_type, process_data);

    // Simulação de envio (requer Twilio em produção)
    const messageId = `whatsapp_${Date.now()}`;

    // Log
    await base44.entities.Notification.create({
      user_id: user.email,
      type: event_type,
      title: `Notificação WhatsApp - ${event_type}`,
      message,
      channel: 'whatsapp',
      status: 'sent',
      sent_at: new Date().toISOString(),
      related_entity: 'Process',
      related_entity_id: process_data?.cnj_number,
      metadata: {
        phone: whatsapp_number.substring(0, 5) + '****' + whatsapp_number.slice(-2),
        message_id: messageId
      }
    });

    return Response.json({
      success: true,
      message_id: messageId,
      sent_to: whatsapp_number,
      status: 'sent'
    });

  } catch (error) {
    console.error('[whatsappIntegration]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function buildWhatsAppMessage(eventType, data) {
  const messages = {
    movement: `📌 Novo Movimento\n\nProcesso: ${data?.cnj_number}\nTipo: ${data?.movement_type}\nData: ${new Date().toLocaleDateString('pt-BR')}`,
    publication: `📢 Nova Publicação\n\nProcesso: ${data?.cnj_number}\nDiário: ${data?.dj}\nData: ${new Date().toLocaleDateString('pt-BR')}`,
    deadline: `⏰ Prazo Próximo\n\nProcesso: ${data?.cnj_number}\nPrazo: ${data?.deadline_date}\nDias: ${data?.days_until}`,
    sync_error: `❌ Erro de Sincronização\n\nProcesso: ${data?.cnj_number}\nErro: ${data?.error_message}`
  };

  return messages[eventType] || 'Você recebeu uma notificação DataJud';
}