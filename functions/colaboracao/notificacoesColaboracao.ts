import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { acao, processoId, tipo, conteudo, usuarios = [] } = await req.json();

    if (!acao) {
      return Response.json({
        success: false,
        error: 'acao é obrigatória (notificar, listar, marcar_lido)'
      }, { status: 400 });
    }

    if (acao === 'notificar') {
      if (!processoId || !tipo || !conteudo) {
        return Response.json({
          success: false,
          error: 'processoId, tipo e conteudo são obrigatórios'
        }, { status: 400 });
      }

      // Notificação mapping
      const templates = {
        comentario_novo: '{{usuario}} comentou: {{conteudo}}',
        mencionado: '{{usuario}} te mencionou em {{processo}}',
        documento_compartilhado: '{{usuario}} compartilhou {{documento}} com você',
        tarefa_atribuida: 'Você foi atribuído à tarefa {{tarefa}} em {{processo}}',
        mudanca_status: 'Status de {{processo}} mudou para {{status}}'
      };

      const notificacoes = [];

      for (const emailDestino of usuarios) {
        const not = {
          processoId,
          usuarioOrigem: user.email,
          usuarioDestino: emailDestino,
          tipo,
          conteudo,
          mensagem: templates[tipo] || conteudo,
          status: 'nao_lido',
          dataCriacao: new Date().toISOString(),
          lido: false,
          dataLeitura: null,
          canal: 'in_app'
        };

        try {
          const created = await base44.entities.NotificacaoColaboracao?.create(not);
          notificacoes.push(created);

          // Also send via push if user has subscription
          try {
            await base44.functions.invoke('notificacoes/pushRefinado', {
              deviceToken: `user_${emailDestino}`,
              titulo: `Novo: ${tipo.replace('_', ' ')}`,
              mensagem: not.mensagem,
              tipo: 'colaboracao',
              dados: { processoId, notificacaoId: created?.id }
            });
          } catch (e) {
            console.log('Push notification skipped');
          }
        } catch (e) {
          console.error(`Erro ao notificar ${emailDestino}:`, e);
        }
      }

      return Response.json({
        success: true,
        action: 'colaboracao.notificacoesColaboracao',
        data: {
          acao: 'notificar',
          processoId,
          tipo,
          notificadosCount: notificacoes.length,
          usuarios,
          message: `${notificacoes.length} notificação(ões) de colaboração enviada(s)`
        }
      });
    } else if (acao === 'listar') {
      const notifs = await base44.entities.NotificacaoColaboracao?.filter(
        { usuarioDestino: user.email },
        '-dataCriacao',
        50
      );

      const naoLidas = notifs?.filter(n => !n.lido).length || 0;

      return Response.json({
        success: true,
        action: 'colaboracao.notificacoesColaboracao',
        data: {
          acao: 'listar',
          usuarioEmail: user.email,
          total: notifs?.length || 0,
          naoLidas,
          notificacoes: notifs?.map(n => ({
            id: n.id,
            tipo: n.tipo,
            usuarioOrigem: n.usuarioOrigem,
            mensagem: n.mensagem,
            processoId: n.processoId,
            lido: n.lido,
            dataCriacao: n.dataCriacao
          })) || []
        }
      });
    } else if (acao === 'marcar_lido') {
      const { notificacaoId } = await req.json();

      if (!notificacaoId) {
        return Response.json({
          success: false,
          error: 'notificacaoId é obrigatório'
        }, { status: 400 });
      }

      await base44.entities.NotificacaoColaboracao?.update(notificacaoId, {
        lido: true,
        dataLeitura: new Date().toISOString(),
        status: 'lido'
      });

      return Response.json({
        success: true,
        action: 'colaboracao.notificacoesColaboracao',
        data: {
          acao: 'marcar_lido',
          notificacaoId,
          message: 'Notificação marcada como lida'
        }
      });
    }

    return Response.json({
      success: false,
      error: 'Ação inválida'
    }, { status: 400 });
  } catch (error) {
    console.error('NotificacoesColaboracao error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});