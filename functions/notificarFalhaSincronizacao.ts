import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Notifica falhas de sincronização via email
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { processo_id, tipo, erro, usuario_email } = await req.json();

    if (!processo_id || !tipo || !erro || !usuario_email) {
      return Response.json({
        error: 'Campos obrigatórios: processo_id, tipo, erro, usuario_email'
      }, { status: 400 });
    }

    // Enviar email de notificação
    await base44.integrations.Core.SendEmail({
      to: usuario_email,
      subject: `🚨 Falha na Sincronização: ${processo_id}`,
      body: `
Olá,

Ocorreu um erro durante a sincronização do processo ${processo_id}:

**Tipo de Sincronização:** ${tipo}
**Erro:** ${erro}
**Data/Hora:** ${new Date().toLocaleString('pt-BR')}

**Ações Recomendadas:**
1. Verifique se o número CNJ está correto
2. Tente sincronizar novamente manualmente no painel TPU
3. Se o erro persistir, entre em contato com o suporte

Acesse o painel em: [URL DO DASHBOARD]

Atenciosamente,
Sistema DataJud
      `
    });

    // Registrar notificação no banco
    await base44.entities.Notification.create({
      user_id: usuario_email,
      type: 'movement',
      title: 'Falha na Sincronização DataJud',
      message: `Erro ao sincronizar processo ${processo_id}: ${erro}`,
      channel: 'email',
      status: 'sent',
      related_entity: 'Process',
      related_entity_id: processo_id,
      metadata: {
        tipo_sincronizacao: tipo,
        erro_mensagem: erro
      }
    });

    return Response.json({
      success: true,
      notificacao_enviada: true,
      email_destinatario: usuario_email
    });
  } catch (error) {
    console.error('[notificarFalhaSincronizacao] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});