import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { telefone, mensagem, templateId, dados = {} } = await req.json();

    if (!telefone || !mensagem) {
      return Response.json({
        success: false,
        error: 'telefone e mensagem são obrigatórios'
      }, { status: 400 });
    }

    // SMS Templates
    const templates = {
      prazo_vencimento: 'Alerta: Processo {{numeroProcesso}} vence em {{dias}} dias.',
      movimentacao_nova: 'Novo movimento no processo {{numero}}: {{descricao}}',
      audiencia_proxima: 'Audiência agendada para {{data}} às {{hora}}.',
      confirmacao_tarefa: 'Tarefa {{titulo}} atribuída. Prazo: {{prazo}}'
    };

    let textoSMS = mensagem;
    
    if (templateId && templates[templateId]) {
      textoSMS = templates[templateId];
      Object.entries(dados).forEach(([key, value]) => {
        textoSMS = textoSMS.replace(`{{${key}}}`, value);
      });
    }

    // Validate SMS length (160 chars or 2 parts)
    if (textoSMS.length > 320) {
      return Response.json({
        success: false,
        error: 'Mensagem muito longa (máximo 320 caracteres)'
      }, { status: 400 });
    }

    // Send SMS via Twilio
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER') || '+5511999999999';

    if (!twilioAccountSid || !twilioAuthToken) {
      return Response.json({
        success: false,
        error: 'Twilio credentials not configured'
      }, { status: 500 });
    }

    const auth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);
    const smsResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: twilioPhoneNumber,
          To: telefone,
          Body: textoSMS
        })
      }
    );

    if (!smsResponse.ok) {
      const error = await smsResponse.json();
      return Response.json({
        success: false,
        error: `Twilio API error: ${error.message || 'Failed to send SMS'}`
      }, { status: smsResponse.status });
    }

    const smsData = await smsResponse.json();

    // Store notification record
    const notificacao = {
      titulo: `SMS para ${telefone}`,
      mensagem: textoSMS,
      tipo: 'sms',
      destinatario: telefone,
      status: 'enviada',
      dataCriacao: new Date().toISOString(),
      dataEnvio: new Date().toISOString(),
      prioridade: 'normal',
      metadados: {
        templateId,
        twilioSid: smsData.sid
      }
    };

    try {
      await base44.entities.Notificacao.create(notificacao);
    } catch (e) {
      console.log('Notificacao entity not available');
    }

    // Audit log
    await base44.functions.invoke('security/auditLog', {
      acao: 'enviarSMS',
      entidade: 'Notificacao',
      resultado: 'success',
      metadados: { telefone, twilioSid: smsData.sid }
    });

    return Response.json({
      success: true,
      action: 'notificacoes.enviarSMS',
      data: {
        telefone,
        mensagem: textoSMS,
        status: 'enviada',
        dataEnvio: new Date().toISOString(),
        twilioSid: smsData.sid,
        message: `SMS enviado com sucesso para ${telefone}`
      }
    });
  } catch (error) {
    console.error('EnviarSMS error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});