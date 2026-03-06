import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Função para enviar notificações através de múltiplos canais
 * POST - Envia via email, push, SMS ou in-app
 */
Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Método não permitido' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { notificacaoId } = body;

    if (!notificacaoId) {
      return Response.json(
        { error: 'notificacaoId é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar notificação
    const notificacoes = await base44.entities.Notificacao.filter({
      id: notificacaoId
    });

    if (notificacoes.length === 0) {
      return Response.json(
        { error: 'Notificação não encontrada' },
        { status: 404 }
      );
    }

    const notificacao = notificacoes[0];

    // Atualizar status para enviando
    await base44.entities.Notificacao.update(notificacao.id, {
      status: 'enviada',
      dataEnvio: new Date().toISOString(),
      tentativas: (notificacao.tentativas || 0) + 1
    });

    let resultado = { sucesso: true, canal: notificacao.tipo };

    try {
      // Enviar por canal
      switch (notificacao.tipo) {
        case 'email':
          await base44.integrations.Core.SendEmail({
            to: notificacao.destinatario,
            subject: notificacao.titulo,
            body: `
              <h2>${notificacao.titulo}</h2>
              <p>${notificacao.mensagem}</p>
              ${notificacao.linkAcao ? `<p><a href="${notificacao.linkAcao}">Visualizar detalhes</a></p>` : ''}
              <hr>
              <small>Sistema de Alertas Legal Tasks</small>
            `
          });
          break;

        case 'push':
          // Implementar com serviço de push (ex: Firebase Cloud Messaging)
          // Por enquanto, apenas registra como enviado
          console.log('Push notification queued:', notificacao.id);
          break;

        case 'sms':
          // Implementar com serviço de SMS (ex: Twilio)
          console.log('SMS notification queued:', notificacao.id);
          break;

        case 'in_app':
          // Notificação in-app é apenas marcada como entregue
          break;
      }

      // Atualizar status para entregue
      await base44.entities.Notificacao.update(notificacao.id, {
        status: 'entregue',
        dataEntrega: new Date().toISOString()
      });

      resultado.entregue = true;

    } catch (err) {
      console.error('Erro ao enviar notificação:', err);
      
      // Atualizar com erro
      await base44.entities.Notificacao.update(notificacao.id, {
        status: 'falhou',
        erroMensagem: err.message,
        proximaTentativa: new Date(Date.now() + 5 * 60 * 1000).toISOString() // retry em 5 min
      });

      resultado.sucesso = false;
      resultado.erro = err.message;
    }

    return new Response(JSON.stringify({
      success: true,
      resultado,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});