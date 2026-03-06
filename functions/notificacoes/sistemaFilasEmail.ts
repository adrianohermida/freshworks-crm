import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { acao, emailData = {}, prioridade = 'normal', tentativas = 0 } = await req.json();

    if (!acao) {
      return Response.json({
        success: false,
        error: 'acao é obrigatória (enfileirar, processar, retry)'
      }, { status: 400 });
    }

    if (acao === 'enfileirar') {
      // Add email to queue
      const { templateId, destinatario, dados } = emailData;

      if (!templateId || !destinatario) {
        return Response.json({
          success: false,
          error: 'templateId e destinatario são obrigatórios'
        }, { status: 400 });
      }

      const filaEmail = {
        templateId,
        destinatario,
        dados,
        status: 'pendente',
        prioridade,
        tentativas: 0,
        proximaTentativa: new Date().toISOString(),
        dataCriacao: new Date().toISOString(),
        ultimoErro: null,
        metadados: {
          criadoPor: user.email
        }
      };

      const created = await base44.entities.FilaEmail?.create(filaEmail);

      return Response.json({
        success: true,
        action: 'notificacoes.sistemaFilasEmail',
        data: {
          acao: 'enfileirar',
          id: created?.id,
          destinatario,
          status: 'pendente',
          posicao: 'na_fila',
          message: `Email enfileirado com sucesso para ${destinatario}`
        }
      });
    } else if (acao === 'processar') {
      // Process pending emails
      const filaEmAberto = await base44.entities.FilaEmail?.filter({ status: 'pendente' }, '-prioridade', 50);
      
      if (!filaEmAberto || filaEmAberto.length === 0) {
        return Response.json({
          success: true,
          action: 'notificacoes.sistemaFilasEmail',
          data: {
            acao: 'processar',
            processados: 0,
            falhados: 0,
            mensagem: 'Nenhum email pendente para processar'
          }
        });
      }

      let processados = 0;
      let falhados = 0;

      for (const email of filaEmAberto) {
        try {
          const { data } = await base44.functions.invoke('notificacoes/enviarEmailTemplate', {
            templateId: email.templateId,
            destinatario: email.destinatario,
            dados: email.dados
          });

          // Update status to enviado
          await base44.entities.FilaEmail?.update(email.id, {
            status: 'enviado',
            dataEnvio: new Date().toISOString(),
            tentativas: email.tentativas + 1
          });

          processados++;
        } catch (e) {
          falhados++;
          const novasTentativas = email.tentativas + 1;
          const maxTentativas = 5;

          if (novasTentativas < maxTentativas) {
            // Schedule retry
            const proximaTentativa = new Date();
            proximaTentativa.setMinutes(proximaTentativa.getMinutes() + (5 * novasTentativas)); // Backoff exponencial

            await base44.entities.FilaEmail?.update(email.id, {
              status: 'erro',
              tentativas: novasTentativas,
              proximaTentativa: proximaTentativa.toISOString(),
              ultimoErro: e.message
            });
          } else {
            // Max retries exceeded
            await base44.entities.FilaEmail?.update(email.id, {
              status: 'falhou',
              tentativas: novasTentativas,
              ultimoErro: `Falha após ${maxTentativas} tentativas: ${e.message}`
            });
          }
        }
      }

      return Response.json({
        success: true,
        action: 'notificacoes.sistemaFilasEmail',
        data: {
          acao: 'processar',
          processados,
          falhados,
          dataProcessamento: new Date().toISOString(),
          message: `${processados} emails processados, ${falhados} falharam`
        }
      });
    } else if (acao === 'retry') {
      // Retry failed emails
      const emailsComErro = await base44.entities.FilaEmail?.filter({ 
        status: 'erro'
      }, '-proximaTentativa', 20);

      if (!emailsComErro || emailsComErro.length === 0) {
        return Response.json({
          success: true,
          action: 'notificacoes.sistemaFilasEmail',
          data: {
            acao: 'retry',
            retentados: 0,
            message: 'Nenhum email para retentar'
          }
        });
      }

      let retentados = 0;
      for (const email of emailsComErro) {
        const agora = new Date();
        if (new Date(email.proximaTentativa) <= agora) {
          await base44.entities.FilaEmail?.update(email.id, {
            status: 'pendente',
            ultimoErro: null
          });
          retentados++;
        }
      }

      return Response.json({
        success: true,
        action: 'notificacoes.sistemaFilasEmail',
        data: {
          acao: 'retry',
          retentados,
          dataRetentativa: new Date().toISOString(),
          message: `${retentados} emails marcados para retentar`
        }
      });
    }

    return Response.json({
      success: false,
      error: 'Ação inválida'
    }, { status: 400 });
  } catch (error) {
    console.error('SistemaFilasEmail error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});