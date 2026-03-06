import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { acao, telefone, templateId, dados = {}, prioridade = 'normal' } = await req.json();

    if (!acao) {
      return Response.json({
        success: false,
        error: 'acao é obrigatória (enviar, agendar, rastrear)'
      }, { status: 400 });
    }

    if (acao === 'enviar') {
      if (!telefone || !templateId) {
        return Response.json({
          success: false,
          error: 'telefone e templateId são obrigatórios'
        }, { status: 400 });
      }

      // SMS templates
      const templates = {
        alerta_prazo: 'Alerta: Processo {{numero}} vence em {{dias}} dias. Acesse: {{link}}',
        confirmacao: 'Sua solicitação foi recebida. ID: {{id}}. Referência: {{ref}}',
        audiencia: 'Audiência agendada para {{data}} às {{hora}} em {{local}}',
        documento: 'Novo documento disponível: {{titulo}}. Acesse: {{link}}'
      };

      let mensagem = templates[templateId] || '';
      Object.entries(dados).forEach(([key, value]) => {
        mensagem = mensagem.replace(`{{${key}}}`, value);
      });

      // Send SMS
      const twilioResponse = await base44.functions.invoke('notificacoes/enviarSMS', {
        telefone,
        mensagem,
        templateId
      });

      // Store record
      const smsEnviado = {
        telefone,
        templateId,
        mensagem,
        status: 'enviado',
        prioridade,
        dataCriacao: new Date().toISOString(),
        dataEnvio: new Date().toISOString(),
        twilioSid: twilioResponse?.data?.twilioSid
      };

      try {
        await base44.entities.SmsRastreamento?.create(smsEnviado);
      } catch (e) {
        console.log('SmsRastreamento entity not available');
      }

      return Response.json({
        success: true,
        action: 'notificacoes.smsAvancado',
        data: {
          acao: 'enviar',
          telefone,
          status: 'enviado',
          mensagem: mensagem.substring(0, 50) + '...',
          dataEnvio: smsEnviado.dataEnvio,
          message: `SMS enviado com sucesso para ${telefone}`
        }
      });
    } else if (acao === 'agendar') {
      const { dataAgendamento } = await req.json();

      if (!telefone || !templateId || !dataAgendamento) {
        return Response.json({
          success: false,
          error: 'telefone, templateId e dataAgendamento são obrigatórios'
        }, { status: 400 });
      }

      const agendado = {
        telefone,
        templateId,
        dados,
        dataAgendamento,
        status: 'agendado',
        prioridade,
        dataCriacao: new Date().toISOString()
      };

      try {
        await base44.entities.SmsAgendado?.create(agendado);
      } catch (e) {
        console.log('SmsAgendado entity not available');
      }

      return Response.json({
        success: true,
        action: 'notificacoes.smsAvancado',
        data: {
          acao: 'agendar',
          telefone,
          dataAgendamento,
          status: 'agendado',
          message: `SMS agendado para ${new Date(dataAgendamento).toLocaleString('pt-BR')}`
        }
      });
    } else if (acao === 'rastrear') {
      const smsEnviados = await base44.entities.SmsRastreamento?.filter({ telefone }, '-dataEnvio', 20);

      return Response.json({
        success: true,
        action: 'notificacoes.smsAvancado',
        data: {
          acao: 'rastrear',
          telefone,
          total: smsEnviados?.length || 0,
          registros: smsEnviados?.map(sms => ({
            id: sms.id,
            mensagem: sms.mensagem.substring(0, 50),
            status: sms.status,
            dataEnvio: sms.dataEnvio
          })) || [],
          message: `${smsEnviados?.length || 0} SMS rastreados`
        }
      });
    }

    return Response.json({
      success: false,
      error: 'Ação inválida'
    }, { status: 400 });
  } catch (error) {
    console.error('SmsAvancado error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});