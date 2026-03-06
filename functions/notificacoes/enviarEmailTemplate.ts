import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { templateId, destinatario, dados = {}, prioridade = 'normal' } = await req.json();

    if (!templateId || !destinatario) {
      return Response.json({
        success: false,
        error: 'templateId e destinatario são obrigatórios'
      }, { status: 400 });
    }

    // Template definitions
    const templates = {
      alerta_prazo: {
        assunto: 'Alerta de Prazo: {{numeroProcesso}}',
        corpo: 'O processo {{numeroProcesso}} vence em {{diasRestantes}} dias.'
      },
      movimentacao_nova: {
        assunto: 'Nova movimentação: {{numeroProcesso}}',
        corpo: 'Novo movimento no processo {{numeroProcesso}}: {{descricaoMovimento}}'
      },
      audiencia_agendada: {
        assunto: 'Audiência Agendada: {{data}}',
        corpo: 'Audiência agendada para {{data}} às {{hora}} na vara {{vara}}.'
      },
      tarefa_atribuida: {
        assunto: 'Nova tarefa: {{titulo}}',
        corpo: 'Você foi atribuído à tarefa: {{titulo}}. Prazo: {{dataPrazo}}'
      }
    };

    const template = templates[templateId];
    if (!template) {
      return Response.json({
        success: false,
        error: `Template ${templateId} não encontrado`
      }, { status: 404 });
    }

    // Render template
    let assunto = template.assunto;
    let corpo = template.corpo;

    Object.entries(dados).forEach(([key, value]) => {
      assunto = assunto.replace(`{{${key}}}`, value);
      corpo = corpo.replace(`{{${key}}}`, value);
    });

    // Send email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'noreply@legaltech.com.br',
        to: destinatario,
        subject: assunto,
        html: `
          <h2>${assunto}</h2>
          <p>${corpo}</p>
          <hr />
          <p style="color: #888; font-size: 12px;">Enviado por LegalTech | ${new Date().toLocaleDateString('pt-BR')}</p>
        `
      })
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.json();
      return Response.json({
        success: false,
        error: `Email API error: ${error.message || 'Failed to send'}`
      }, { status: emailResponse.status });
    }

    const emailData = await emailResponse.json();

    // Store notification record
    const notificacao = {
      titulo: assunto,
      mensagem: corpo,
      tipo: 'email',
      destinatario,
      status: 'enviada',
      dataCriacao: new Date().toISOString(),
      dataEnvio: new Date().toISOString(),
      prioridade,
      metadados: {
        templateId,
        resendId: emailData.id
      }
    };

    try {
      await base44.entities.Notificacao.create(notificacao);
    } catch (e) {
      console.log('Notificacao entity not available');
    }

    // Audit log
    await base44.functions.invoke('security/auditLog', {
      acao: 'enviarEmailTemplate',
      entidade: 'Notificacao',
      resultado: 'success',
      metadados: { templateId, destinatario, resendId: emailData.id }
    });

    return Response.json({
      success: true,
      action: 'notificacoes.enviarEmailTemplate',
      data: {
        templateId,
        destinatario,
        assunto,
        status: 'enviada',
        dataEnvio: new Date().toISOString(),
        resendId: emailData.id,
        message: `Email enviado com sucesso para ${destinatario}`
      }
    });
  } catch (error) {
    console.error('EnviarEmailTemplate error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});